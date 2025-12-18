#!/usr/bin/env python3
"""
Comprehensive Web Scraper
A reusable web scraper that can scrape websites, including JavaScript-rendered content.

Features:
- Scrapes all pages from a website
- Downloads all assets (images, CSS, JS, fonts, videos)
- Handles JavaScript-rendered content (SPAs) using Selenium
- Creates organized output directory structure
- Generates scraping summary and sitemap
- Rate limiting and error handling

Usage:
    python website_scraper.py --url https://example.com --output scraped_content

Requirements:
    pip install requests beautifulsoup4 selenium lxml
"""

import os
import re
import json
import time
import argparse
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
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("Warning: Selenium not available. Install with: pip install selenium")
    print("Note: JavaScript-rendered content may not be fully scraped without Selenium.")


# Setup logging
def setup_logging(log_file: str = "scraper.log"):
    """Configure logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)


class WebsiteScraper:
    """
    Comprehensive website scraper that handles both static and JavaScript-rendered sites.
    """
    
    def __init__(self, base_url: str, output_dir: str = "scraped_content", request_delay: float = 1.0):
        """
        Initialize the scraper.
        
        Args:
            base_url: The base URL of the website to scrape
            output_dir: Directory to save scraped content
            request_delay: Delay between requests in seconds (rate limiting)
        """
        self.base_url = base_url.rstrip('/')
        self.domain = urlparse(base_url).netloc
        self.output_dir = Path(output_dir)
        self.visited_urls: Set[str] = set()
        self.failed_urls: Set[str] = set()
        self.assets_downloaded: Set[str] = set()
        self.pages_data: List[Dict] = []
        self.request_delay = request_delay
        
        # Create output directories
        self._create_directories()
        
        # Session for connection pooling
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Selenium driver (if available)
        self.driver = None
        if SELENIUM_AVAILABLE:
            self._init_selenium()
    
    def _create_directories(self):
        """Create output directory structure"""
        self.output_dir.mkdir(exist_ok=True)
        (self.output_dir / "pages").mkdir(exist_ok=True)
        (self.output_dir / "assets").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "images").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "css").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "js").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "fonts").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "videos").mkdir(exist_ok=True)
        (self.output_dir / "assets" / "other").mkdir(exist_ok=True)
    
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
        domain_no_www = self.domain.replace('www.', '')
        parsed_no_www = parsed.netloc.replace('www.', '')
        return parsed.netloc == self.domain or parsed.netloc == '' or parsed_no_www == domain_no_www
    
    def _should_download_external_asset(self, url: str) -> bool:
        """Check if external asset should be downloaded (e.g., CDN assets)"""
        parsed = urlparse(url)
        # Add your CDN domains here if needed
        cdn_domains = [
            'static.wixstatic.com',
            'static.parastorage.com',
            'video.wixstatic.com',
            'siteassets.parastorage.com',
            'viewer-assets.parastorage.com',
            # Add more CDN domains as needed
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
            
            # Determine asset type from extension
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
        base_domain = self.domain.replace('www.', '')
        
        # Find all anchor tags
        for tag in soup.find_all('a', href=True):
            href = tag['href']
            if href.startswith(('javascript:', 'mailto:', 'tel:', '#', 'data:')):
                continue
            
            full_url = urljoin(page_url, href)
            normalized = self._normalize_url(full_url)
            
            parsed = urlparse(normalized)
            parsed_domain = parsed.netloc.replace('www.', '')
            
            if parsed_domain == base_domain or parsed.netloc == '':
                links.add(normalized)
        
        # Extract links from JavaScript-rendered content if driver is available
        if driver:
            try:
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
        # Images
        for img in soup.find_all('img'):
            for attr in ['src', 'data-src', 'data-original', 'data-lazy-src', 'srcset']:
                if img.get(attr):
                    if attr == 'srcset':
                        srcset = img[attr]
                        urls = re.findall(r'([^\s,]+\.(?:jpg|jpeg|png|gif|webp|svg|ico))', srcset)
                        for url in urls:
                            self._download_asset(url.strip(), "images")
                    else:
                        self._download_asset(img[attr], "images")
        
        # CSS files
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
        
        # JavaScript files
        for script in soup.find_all('script'):
            src = script.get('src') or script.get('data-url')
            if src:
                self._download_asset(src, "js")
        
        # Background images from inline styles
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
                    if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']):
                        self._download_asset(url, "images")
                    elif '.woff' in url.lower() or '.ttf' in url.lower():
                        self._download_asset(url, "fonts")
        
        # Video sources
        for video in soup.find_all('video'):
            if video.get('src'):
                self._download_asset(video['src'], "videos")
            for source in video.find_all('source', src=True):
                self._download_asset(source['src'], "videos")
        
        # Extract assets from rendered DOM if driver is available
        if driver:
            try:
                # Images from rendered DOM
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
                
                # CSS and fonts from rendered DOM
                link_elements = driver.find_elements(By.TAG_NAME, "link")
                for elem in link_elements:
                    try:
                        href = elem.get_attribute('href') or elem.get_attribute('data-href')
                        rel = elem.get_attribute('rel') or ''
                        as_attr = elem.get_attribute('as') or ''
                        if href:
                            if 'stylesheet' in rel.lower():
                                self._download_asset(href, "css")
                            elif 'preload' in rel.lower() and 'font' in as_attr.lower():
                                self._download_asset(href, "fonts")
                    except:
                        continue
                
                # Scripts from rendered DOM
                script_elements = driver.find_elements(By.TAG_NAME, "script")
                for elem in script_elements:
                    try:
                        src = elem.get_attribute('src')
                        if src:
                            self._download_asset(src, "js")
                    except:
                        continue
            except Exception as e:
                logger.debug(f"Error extracting assets from rendered DOM: {e}")
    
    def _save_page(self, url: str, html_content: str, soup: BeautifulSoup):
        """Save page HTML and extract metadata"""
        parsed = urlparse(url)
        path_parts = [p for p in parsed.path.split('/') if p]
        
        if not path_parts:
            filename = "index.html"
        else:
            filename = path_parts[-1]
            if not filename.endswith(('.html', '.htm')):
                filename += ".html"
        
        filename = re.sub(r'[^\w\-_\.]', '_', filename)
        filepath = self.output_dir / "pages" / filename
        
        filepath.write_text(html_content, encoding='utf-8')
        
        # Extract metadata
        title = soup.find('title')
        title_text = title.get_text() if title else ""
        
        meta_description = soup.find('meta', attrs={'name': 'description'})
        description = meta_description.get('content', '') if meta_description else ""
        
        text_content = soup.get_text(separator='\n', strip=True)
        
        # Extract structured data
        structured_data = []
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                structured_data.append(json.loads(script.string))
            except:
                pass
        
        page_data = {
            'url': url,
            'filename': filename,
            'title': title_text,
            'description': description,
            'text_content': text_content[:1000],
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
        
        html_content = None
        driver_used = False
        
        if use_selenium and self.driver:
            html_content = self._get_page_content(normalized_url, use_selenium=True)
            driver_used = True
        
        if not html_content:
            html_content = self._get_page_content(normalized_url, use_selenium=False)
        
        if not html_content:
            self.failed_urls.add(normalized_url)
            logger.warning(f"Failed to fetch: {normalized_url}")
            return
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        driver_ref = self.driver if driver_used else None
        self._extract_assets(soup, normalized_url, driver=driver_ref)
        self._save_page(normalized_url, html_content, soup)
        
        links = self._extract_links(soup, normalized_url, driver=driver_ref)
        return links
    
    def scrape_all(self, max_pages: int = 1000, use_selenium: bool = False, auto_detect_js: bool = True):
        """Scrape all pages starting from base URL"""
        logger.info(f"Starting scrape of {self.base_url}")
        
        # Auto-detect JavaScript-rendered sites
        if auto_detect_js:
            if 'wix' in self.base_url.lower() or 'parastorage' in self.base_url.lower():
                if self.driver:
                    use_selenium = True
                    logger.info("Detected JavaScript-rendered site - using Selenium")
                else:
                    logger.warning("JavaScript site detected but Selenium not available")
        
        to_visit = {self.base_url}
        
        while to_visit and len(self.visited_urls) < max_pages:
            current_url = to_visit.pop()
            
            if current_url in self.visited_urls:
                continue
            
            links = self.scrape_page(current_url, use_selenium=use_selenium)
            
            if links:
                for link in links:
                    if link not in self.visited_urls:
                        to_visit.add(link)
            
            logger.info(f"Progress: {len(self.visited_urls)} pages scraped, {len(to_visit)} in queue, {len(self.assets_downloaded)} assets downloaded")
        
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
    """Main function with command-line interface"""
    parser = argparse.ArgumentParser(description='Comprehensive website scraper')
    parser.add_argument('--url', type=str, required=True, help='Base URL to scrape')
    parser.add_argument('--output', type=str, default='scraped_content', help='Output directory')
    parser.add_argument('--max-pages', type=int, default=1000, help='Maximum pages to scrape')
    parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests (seconds)')
    parser.add_argument('--selenium', action='store_true', help='Force use of Selenium')
    parser.add_argument('--no-selenium', action='store_true', help='Disable Selenium even if available')
    parser.add_argument('--log', type=str, default='scraper.log', help='Log file path')
    
    args = parser.parse_args()
    
    global logger
    logger = setup_logging(args.log)
    
    scraper = WebsiteScraper(args.url, args.output, args.delay)
    
    use_selenium = False
    if args.selenium:
        use_selenium = True
        if not scraper.driver:
            logger.error("Selenium requested but not available. Install with: pip install selenium")
            return
    elif not args.no_selenium and scraper.driver:
        use_selenium = True
    
    if use_selenium:
        logger.info("Using Selenium for JavaScript-rendered content")
    else:
        logger.info("Using standard HTTP requests")
    
    try:
        scraper.scrape_all(max_pages=args.max_pages, use_selenium=use_selenium)
    except KeyboardInterrupt:
        logger.info("Scraping interrupted by user")
        scraper._save_summary()
    except Exception as e:
        logger.error(f"Error during scraping: {e}", exc_info=True)
        scraper._save_summary()


if __name__ == "__main__":
    main()

