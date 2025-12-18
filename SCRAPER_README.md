# Website Scraper - Reusable Python Script

A comprehensive web scraper that can scrape websites, including JavaScript-rendered content (SPAs).

## Features

- ✅ Scrapes all pages from a website
- ✅ Downloads all assets (images, CSS, JS, fonts, videos)
- ✅ Handles JavaScript-rendered content using Selenium
- ✅ Creates organized output directory structure
- ✅ Generates scraping summary and sitemap
- ✅ Rate limiting and error handling
- ✅ Command-line interface

## Installation

### Requirements

```bash
pip install requests beautifulsoup4 selenium lxml
```

### ChromeDriver (for Selenium)

Selenium requires ChromeDriver. Install it:

**macOS (using Homebrew):**
```bash
brew install chromedriver
```

**Linux:**
```bash
# Download from https://chromedriver.chromium.org/
# Or use your package manager
```

**Windows:**
Download from https://chromedriver.chromium.org/ and add to PATH

## Usage

### Basic Usage

```bash
python website_scraper.py --url https://example.com
```

### Advanced Usage

```bash
# Specify output directory
python website_scraper.py --url https://example.com --output my_scraped_content

# Limit number of pages
python website_scraper.py --url https://example.com --max-pages 50

# Adjust request delay (rate limiting)
python website_scraper.py --url https://example.com --delay 2.0

# Force use of Selenium (for JavaScript sites)
python website_scraper.py --url https://example.com --selenium

# Disable Selenium (faster, but may miss JS-rendered content)
python website_scraper.py --url https://example.com --no-selenium

# Custom log file
python website_scraper.py --url https://example.com --log my_scraper.log
```

### Command-Line Options

```
--url          Base URL to scrape (required)
--output       Output directory (default: scraped_content)
--max-pages    Maximum pages to scrape (default: 1000)
--delay        Delay between requests in seconds (default: 1.0)
--selenium     Force use of Selenium
--no-selenium  Disable Selenium even if available
--log          Log file path (default: scraper.log)
```

## Output Structure

The scraper creates the following directory structure:

```
scraped_content/
├── pages/              # HTML pages
│   ├── index.html
│   ├── about.html
│   └── ...
├── assets/             # Downloaded assets
│   ├── images/        # Images
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   ├── fonts/        # Font files
│   ├── videos/       # Video files
│   └── other/        # Other assets
├── scraping_summary.json  # Metadata and summary
└── sitemap.txt       # List of all scraped URLs
```

## Example: Scraping a Wix Site

```bash
# Wix sites are JavaScript-rendered, so Selenium is recommended
python website_scraper.py --url https://example.wixsite.com/mysite --selenium
```

## Example: Scraping a Static Site

```bash
# Static sites don't need Selenium
python website_scraper.py --url https://example.com --no-selenium
```

## Output Files

### scraping_summary.json

Contains metadata about the scraping session:

```json
{
  "base_url": "https://example.com",
  "scraped_at": "2025-01-15T10:30:00",
  "total_pages": 14,
  "failed_pages": 0,
  "total_assets": 91,
  "pages": [
    {
      "url": "https://example.com",
      "filename": "index.html",
      "title": "Home Page",
      "description": "...",
      "text_content": "...",
      "structured_data": []
    }
  ],
  "visited_urls": [...],
  "failed_urls": []
}
```

### sitemap.txt

Simple text file with one URL per line:

```
https://example.com
https://example.com/about
https://example.com/contact
...
```

## Customization

### Adding CDN Domains

If you need to download assets from specific CDNs, edit the `_should_download_external_asset` method:

```python
def _should_download_external_asset(self, url: str) -> bool:
    parsed = urlparse(url)
    cdn_domains = [
        'static.wixstatic.com',
        'static.parastorage.com',
        'your-cdn-domain.com',  # Add your CDN here
    ]
    return parsed.netloc in cdn_domains
```

### Adjusting Selenium Wait Times

For slower sites, increase wait times in `_get_page_content`:

```python
time.sleep(5)  # Increase from 3 to 5 seconds
```

## Troubleshooting

### Selenium Not Working

- Make sure ChromeDriver is installed and in PATH
- Check Chrome browser version matches ChromeDriver version
- Try running without `--headless` flag (modify code temporarily)

### Missing Content

- For JavaScript-rendered sites, use `--selenium` flag
- Increase wait times for slow-loading sites
- Check `scraper.log` for errors

### Rate Limiting

- Increase `--delay` to slow down requests
- Some sites may block rapid requests

## License

Free to use and modify for your projects.

## Notes

- Always respect robots.txt and website terms of service
- Use appropriate delays to avoid overwhelming servers
- Some sites may block automated scraping
- This scraper is for legitimate use cases (backup, migration, etc.)

