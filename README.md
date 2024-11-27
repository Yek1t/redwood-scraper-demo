[Demo link](https://redwood-scraper-demo.netlify.app/articles)

Due to time constraints, only the key parts of the Questions section were implemented:

1. Implemented scraping of the Coinbase Blog.
2. Handled Coinbase anti-scraping measures using `Puppeteer: stealth plugin`.
3. Deployed via `GitHub` and `Netlify`.

**Scraping Method**:
1. First, find a way to load more blog data. Here, a simple implementation was chosen by finding the `Show more` button and clicking it.
2. After clicking enough times, collect the blog links.
3. Scrape the blog content based on the links obtained in step 2.
4. For details, refer to the code in `./api/scraper/CoinbaseScraper.ts`.


**Areas for Improvement**:
1. For the scraper, find a more stable and efficient way to perform continuous and scheduled scraping; add multiple blog website data sources.
2. For the Redwood frontend data presentation, enhance the styling by using a component library.
