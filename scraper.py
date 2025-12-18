#!/usr/bin/env python3
"""
Comprehensive Web Scraper for discover-nocode.com
Scrapes all pages, assets, and content to rebuild the website.
"""

import os
import re
import json
import time
import requests
from urllib.parse import urljoin, urlparse, urlunparse
from pathlib import Path
from bs4 import BeautifulSoup
from typing import Set, Dict, List, Optional
import logging
from datetime import datetime

# Try to import selenium for JavaScript-rendered content
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("Warning: Selenium not available. Install with: pip install selenium")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class WebsiteScraper:
    def __init__(self, base_url: str, output_dir: str = "scraped_content"):
        self.base_url = base_url.rstrip('/')
        self.domain = urlparse(base_url).netloc
        self.output_dir = Path(output_dir)
        self.visited_urls: Set[str] = set()
        self.failed_urls: Set[str] = set()
        self.assets_downloaded: Set[str] = set()
        self.pages_data: List[Dict] = []
        
        # Create output directories
        self.output_dir.mkdir(exist_ok=True)
        (self.output_dir / "pages").mkdir(exist_ok=True)
        (self.output_dir / "assets").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "images").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "css").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "js").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "fonts").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "videos").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "other").mkdir(exist_ok=True)
        
        # Session for connection pooling
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Rate limiting
        self.request_delay = 1.0  # seconds between requests
        
        # Selenium driver (if available)
        self.driver = None
        if SELENIUM_AVAILABLE:
            self._init_selenium()
    
    def _init_selenium(self):
        """Initialize Selenium WebDriver for JavaScript-rendered content"""
        try:
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
            
            self.driver = webdriver.Chrome(options=chrome_options)
            logger.info("Selenium WebDriver initialized successfully")
        except Exception as e:
            logger.warning(f"Could not initialize Selenium: {e}")
            logger.warning("Continuing without JavaScript rendering support")
            self.driver = None
    
    def _normalize_url(self, url: str) -> str:
        """Normalize URL to avoid duplicates"""
        parsed = urlparse(url)
        # Remove fragment
        normalized = urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            parsed.query,
            ''  # Remove fragment
        ))
        return normalized.rstrip('/') or normalized + '/'
    
    def _is_same_domain(self, url: str) -> bool:
        """Check if URL belongs to the same domain"""
        parsed = urlparse(url)
        # Handle www subdomain variations
        domain_no_www = self.domain.replace('www.', '')
        parsed_no_www = parsed.netloc.replace('www.', '')
        return parsed.netloc == self.domain or parsed.netloc == '' or parsed_no_www == domain_no_www
    
    def _should_download_external_asset(self, url: str) -> bool:
        """Check if external asset should be downloaded (e.g., Wix CDN)"""
        parsed = urlparse(url)
        # Download assets from common CDNs used by Wix
        cdn_domains = [
            'static.wixstatic.com',
            'static.parastorage.com',
            'video.wixstatic.com',
            'siteassets.parastorage.com',
            'viewer-assets.parastorage.com'
        ]
        return parsed.netloc in cdn_domains
    
    def _get_page_content(self, url: str, use_selenium: bool = False) -> Optional[str]:
        """Fetch page content, optionally using Selenium for JS rendering"""
        if use_selenium and self.driver:
            try:
                logger.info(f"Fetching with Selenium: {url}")
                self.driver.get(url)
                
                # Wait for page to load
                time.sleep(3)
                
                # Wait for common dynamic content indicators
                try:
                    WebDriverWait(self.driver, 15).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                except:
                    pass
                
                # Scroll to trigger lazy-loaded content
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)
                self.driver.execute_script("window.scrollTo(0, 0);")
                time.sleep(1)
                
                # Wait for any remaining dynamic content
                time.sleep(2)
                
                return self.driver.page_source
            except Exception as e:
                logger.error(f"Selenium error for {url}: {e}")
                return None
        
        try:
            logger.info(f"Fetching: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            time.sleep(self.request_delay)  # Rate limiting
            return response.text
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None
    
    def _download_asset(self, url: str, asset_type: str = "other") -> Optional[str]:
        """Download an asset (image, CSS, JS, etc.) and return local path"""
        if url in self.assets_downloaded:
            return None
        
        try:
            # Handle relative URLs
            if not url.startswith(('http://', 'https://')):
                url = urljoin(self.base_url, url)
            
            # Skip external assets unless they're from known CDNs
            if not self._is_same_domain(url) and not self._should_download_external_asset(url):
                return None
            
            parsed = urlparse(url)
            filename = os.path.basename(parsed.path) or f"asset_{hash(url)}"
            
            # Sanitize filename
            filename = re.sub(r'[^\w\-_\.]', '_', filename)
            if not filename:
                filename = f"asset_{hash(url)}"
            
            # Determine asset type from extension or provided type
            ext = os.path.splitext(filename)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico']:
                asset_type = "images"
            elif ext in ['.css']:
                asset_type = "css"
            elif ext in ['.js', '.mjs']:
                asset_type = "js"
            elif ext in ['.woff', '.woff2', '.ttf', '.otf', '.eot']:
                asset_type = "fonts"
            elif ext in ['.mp4', '.webm', '.mov', '.avi']:
                asset_type = "videos"
            
            filepath = self.output_dir / "assets" / asset_type / filename
            
            # Skip if already exists
            if filepath.exists():
                self.assets_downloaded.add(url)
                return str(filepath.relative_to(self.output_dir))
            
            logger.info(f"Downloading asset: {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            filepath.write_bytes(response.content)
            self.assets_downloaded.add(url)
            time.sleep(self.request_delay)
            
            return str(filepath.relative_to(self.output_dir))
        except Exception as e:
            logger.error(f"Error downloading asset {url}: {e}")
            return None
    
    def _extract_links(self, soup: BeautifulSoup, page_url: str, driver=None) -> Set[str]:
        """Extract all links from a page"""
        links = set()
        
        # Normalize base URL to handle www variations
        base_domain = self.domain.replace('www.', '')
        
        # Find all anchor tags
        for tag in soup.find_all('a', href=True):
            href = tag['href']
            # Skip javascript:, mailto:, tel:, etc.
            if href.startswith(('javascript:', 'mailto:', 'tel:', '#', 'data:')):
                continue
            
            full_url = urljoin(page_url, href)
            normalized = self._normalize_url(full_url)
            
            # Normalize domain for comparison
            parsed = urlparse(normalized)
            parsed_domain = parsed.netloc.replace('www.', '')
            
            if parsed_domain == base_domain or parsed.netloc == '':
                links.add(normalized)
        
        # Also extract links from JavaScript-rendered content if driver is available
        if driver:
            try:
                # Find all links in the rendered DOM
                link_elements = driver.find_elements(By.TAG_NAME, "a")
                for elem in link_elements:
                    try:
                        href = elem.get_attribute('href')
                        if href and not href.startswith(('javascript:', 'mailto:', 'tel:', '#', 'data:')):
                            full_url = urljoin(page_url, href)
                            normalized = self._normalize_url(full_url)
                            
                            parsed = urlparse(normalized)
                            parsed_domain = parsed.netloc.replace('www.', '')
                            
                            if parsed_domain == base_domain or parsed.netloc == '':
                                links.add(normalized)
                    except:
                        continue
            except Exception as e:
                logger.debug(f"Error extracting links from rendered DOM: {e}")
        
        return links
    
    def _extract_assets(self, soup: BeautifulSoup, page_url: str, driver=None):
        """Extract and download all assets from a page"""
        # Images - check multiple attributes
        for img in soup.find_all('img'):
            for attr in ['src', 'data-src', 'data-original', 'data-lazy-src', 'srcset']:
                if img.get(attr):
                    if attr == 'srcset':
                        # Parse srcset (e.g., "image.jpg 1x, image@2x.jpg 2x")
                        srcset = img[attr]
                        urls = re.findall(r'([^\s,]+\.(?:jpg|jpeg|png|gif|webp|svg|ico))', srcset)
                        for url in urls:
                            self._download_asset(url.strip(), "images")
                    else:
                        self._download_asset(img[attr], "images")
        
        # CSS files - check all link tags
        for link in soup.find_all('link'):
            href = link.get('href') or link.get('data-href')
            if href:
                rel = link.get('rel', [])
                if isinstance(rel, list):
                    rel = ' '.join(rel)
                if 'stylesheet' in str(rel).lower():
                    self._download_asset(href, "css")
                elif 'preload' in str(rel).lower() or 'prefetch' in str(rel).lower():
                    as_attr = link.get('as', '').lower()
                    if 'font' in as_attr:
                        self._download_asset(href, "fonts")
                    elif 'style' in as_attr:
                        self._download_asset(href, "css")
                    else:
                        self._download_asset(href, "other")
        
        # JavaScript files - check all script tags
        for script in soup.find_all('script'):
            src = script.get('src') or script.get('data-url')
            if src:
                self._download_asset(src, "js")
        
        # Inline styles with background images - check style attributes and <style> tags
        for tag in soup.find_all(style=True):
            style = tag['style']
            urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', style)
            for url in urls:
                self._download_asset(url, "images")
        
        # Extract from <style> tags
        for style_tag in soup.find_all('style'):
            if style_tag.string:
                urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', style_tag.string)
                for url in urls:
                    # Determine type from extension
                    if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']):
                        self._download_asset(url, "images")
                    elif '.css' in url.lower():
                        self._download_asset(url, "css")
                    elif '.woff' in url.lower() or '.ttf' in url.lower() or '.otf' in url.lower():
                        self._download_asset(url, "fonts")
        
        # Video sources
        for video in soup.find_all('video'):
            if video.get('src'):
                self._download_asset(video['src'], "videos")
            for source in video.find_all('source', src=True):
                self._download_asset(source['src'], "videos")
        
        # Audio sources
        for audio in soup.find_all('audio'):
            if audio.get('src'):
                self._download_asset(audio['src'], "other")
            for source in audio.find_all('source', src=True):
                self._download_asset(source['src'], "other")
        
        # Extract assets from rendered DOM if driver is available
        if driver:
            try:
                # Get all images from rendered DOM - check multiple attributes
                img_elements = driver.find_elements(By.TAG_NAME, "img")
                for elem in img_elements:
                    try:
                        for attr in ['src', 'data-src', 'data-original', 'data-lazy-src']:
                            src = elem.get_attribute(attr)
                            if src:
                                self._download_asset(src, "images")
                                break
                    except:
                        continue
                
                # Get all link elements (CSS, fonts, etc.)
                link_elements = driver.find_elements(By.TAG_NAME, "link")
                for elem in link_elements:
                    try:
                        href = elem.get_attribute('href') or elem.get_attribute('data-href')
                        rel = elem.get_attribute('rel') or ''
                        as_attr = elem.get_attribute('as') or ''
                        if href:
                            if 'stylesheet' in rel.lower():
                                self._download_asset(href, "css")
                            elif 'preload' in rel.lower() or 'prefetch' in rel.lower():
                                if 'font' in as_attr.lower():
                                    self._download_asset(href, "fonts")
                                elif 'style' in as_attr.lower():
                                    self._download_asset(href, "css")
                                else:
                                    self._download_asset(href, "other")
                            else:
                                # Try to determine from URL
                                if any(ext in href.lower() for ext in ['.css']):
                                    self._download_asset(href, "css")
                                elif any(ext in href.lower() for ext in ['.woff', '.woff2', '.ttf', '.otf']):
                                    self._download_asset(href, "fonts")
                    except:
                        continue
                
                # Get all script elements
                script_elements = driver.find_elements(By.TAG_NAME, "script")
                for elem in script_elements:
                    try:
                        src = elem.get_attribute('src') or elem.get_attribute('data-url')
                        if src:
                            self._download_asset(src, "js")
                    except:
                        continue
                
                # Extract background images from computed styles
                try:
                    all_elements = driver.find_elements(By.XPATH, "//*[@style]")
                    for elem in all_elements[:100]:  # Limit to avoid too many requests
                        try:
                            bg_image = driver.execute_script(
                                "return window.getComputedStyle(arguments[0]).backgroundImage;", elem
                            )
                            if bg_image and 'url(' in bg_image:
                                urls = re.findall(r'url\(["\']?([^"\')]+)["\']?\)', bg_image)
                                for url in urls:
                                    self._download_asset(url, "images")
                        except:
                            continue
                except:
                    pass
            except Exception as e:
                logger.debug(f"Error extracting assets from rendered DOM: {e}")
    
    def _save_page(self, url: str, html_content: str, soup: BeautifulSoup):
        """Save page HTML and extract metadata"""
        # Create filename from URL
        parsed = urlparse(url)
        path_parts = [p for p in parsed.path.split('/') if p]
        
        if not path_parts:
            filename = "index.html"
        else:
            filename = path_parts[-1]
            if not filename.endswith(('.html', '.htm')):
                filename += ".html"
        
        # Sanitize filename
        filename = re.sub(r'[^\w\-_\.]', '_', filename)
        
        filepath = self.output_dir / "pages" / filename
        
        # Save HTML
        filepath.write_text(html_content, encoding='utf-8')
        
        # Extract metadata
        title = soup.find('title')
        title_text = title.get_text() if title else ""
        
        meta_description = soup.find('meta', attrs={'name': 'description'})
        description = meta_description.get('content', '') if meta_description else ""
        
        # Extract all text content
        text_content = soup.get_text(separator='\n', strip=True)
        
        # Extract structured data (JSON-LD, microdata, etc.)
        structured_data = []
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                structured_data.append(json.loads(script.string))
            except:
                pass
        
        # Save page metadata
        page_data = {
            'url': url,
            'filename': filename,
            'title': title_text,
            'description': description,
            'text_content': text_content[:1000],  # First 1000 chars
            'structured_data': structured_data,
            'scraped_at': datetime.now().isoformat()
        }
        
        self.pages_data.append(page_data)
        
        logger.info(f"Saved page: {filename}")
    
    def scrape_page(self, url: str, use_selenium: bool = False):
        """Scrape a single page"""
        normalized_url = self._normalize_url(url)
        
        if normalized_url in self.visited_urls:
            return
        
        self.visited_urls.add(normalized_url)
        
        # For Wix sites, prefer Selenium to get fully rendered content
        html_content = None
        driver_used = False
        
        if use_selenium and self.driver:
            html_content = self._get_page_content(normalized_url, use_selenium=True)
            driver_used = True
        
        # Fallback to regular fetch if Selenium didn't work
        if not html_content:
            html_content = self._get_page_content(normalized_url, use_selenium=False)
        
        if not html_content:
            self.failed_urls.add(normalized_url)
            logger.warning(f"Failed to fetch: {normalized_url}")
            return
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extract and download assets (pass driver if used)
        driver_ref = self.driver if driver_used else None
        self._extract_assets(soup, normalized_url, driver=driver_ref)
        
        # Save page
        self._save_page(normalized_url, html_content, soup)
        
        # Extract links for further crawling (pass driver if used)
        links = self._extract_links(soup, normalized_url, driver=driver_ref)
        return links
    
    def scrape_all(self, max_pages: int = 1000, use_selenium: bool = False):
        """Scrape all pages starting from base URL"""
        logger.info(f"Starting scrape of {self.base_url}")
        
        # Detect if this is a Wix site and force Selenium
        if 'wix' in self.base_url.lower() or 'parastorage' in self.base_url.lower():
            if self.driver:
                use_selenium = True
                logger.info("Detected Wix site - using Selenium for full content rendering")
            else:
                logger.warning("Wix site detected but Selenium not available - content may be incomplete")
        
        to_visit = {self.base_url}
        
        while to_visit and len(self.visited_urls) < max_pages:
            current_url = to_visit.pop()
            
            if current_url in self.visited_urls:
                continue
            
            links = self.scrape_page(current_url, use_selenium=use_selenium)
            
            if links:
                # Add new links to visit queue
                for link in links:
                    if link not in self.visited_urls:
                        to_visit.add(link)
            
            logger.info(f"Progress: {len(self.visited_urls)} pages scraped, {len(to_visit)} in queue, {len(self.assets_downloaded)} assets downloaded")
        
        # Save summary
        self._save_summary()
        
        logger.info(f"Scraping complete! Scraped {len(self.visited_urls)} pages")
        logger.info(f"Failed: {len(self.failed_urls)} pages")
        logger.info(f"Downloaded {len(self.assets_downloaded)} assets")
    
    def _save_summary(self):
        """Save scraping summary and metadata"""
        summary = {
            'base_url': self.base_url,
            'scraped_at': datetime.now().isoformat(),
            'total_pages': len(self.visited_urls),
            'failed_pages': len(self.failed_urls),
            'total_assets': len(self.assets_downloaded),
            'pages': self.pages_data,
            'visited_urls': list(self.visited_urls),
            'failed_urls': list(self.failed_urls)
        }
        
        summary_path = self.output_dir / "scraping_summary.json"
        summary_path.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding='utf-8')
        
        # Also save a simple sitemap
        sitemap_path = self.output_dir / "sitemap.txt"
        with sitemap_path.open('w', encoding='utf-8') as f:
            for page in self.pages_data:
                f.write(f"{page['url']}\n")
        
        logger.info(f"Summary saved to {summary_path}")
    
    def __del__(self):
        """Cleanup"""
        if self.driver:
            self.driver.quit()
        if self.session:
            self.session.close()


def main():
    """Main function"""
    base_url = "https://discover-nocode.com"
    output_dir = "scraped_content"
    
    scraper = WebsiteScraper(base_url, output_dir)
    
    # Force Selenium for Wix sites (they're SPAs)
    use_selenium = SELENIUM_AVAILABLE and scraper.driver is not None
    
    if use_selenium:
        logger.info("Using Selenium for JavaScript-rendered content")
    else:
        logger.info("Using standard HTTP requests (no JavaScript rendering)")
        logger.warning("For Wix sites, Selenium is recommended for complete content")
    
    try:
        scraper.scrape_all(max_pages=1000, use_selenium=use_selenium)
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
        scraper._save_summary()
    except Exception as e:
        logger.error(f"Error during scraping: {e}", exc_info=True)
        scraper._save_summary()


if __name__ == "__main__":
    main()

