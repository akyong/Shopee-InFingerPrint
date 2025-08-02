# HTML Fetcher

HTML Fetcher is a Chrome extension designed to extract product links from web pages, specifically e-commerce platforms like Shopee, and convert them into the format `https://shopee.co.id/product/<shopid>/<itemid>`. The extension allows users to exclude specific items by their `itemid` and persists the exclusion list locally using the Chrome Storage API.

**Important Notice**: This code is **commercial** and protected under a proprietary license. Unauthorized use, reproduction, or distribution without explicit written permission from the developer is strictly prohibited.

## Features
- Fetches all product links from `<a class="contents">` elements on a webpage.
- Extracts `shopid` and `itemid` from links using regex (`i.<shopid>.<itemid>`).
- Converts links to the format `https://shopee.co.id/product/<shopid>/<itemid>`.
- Allows users to exclude specific `itemid`s via a semicolon-separated input (e.g., `itemid1;itemid2`).
- Saves the exclusion list in `chrome.storage.local` for reuse across sessions.
- Modern popup interface styled with Tailwind CSS, including copyright information.

## Prerequisites
- Google Chrome (latest version recommended).
- Internet connection to load Tailwind CSS from CDN (`https://cdn.tailwindcss.com`) during testing.
- Extension icons in PNG format (16x16, 48x48, 128x128) in the `icons/` folder.

## Installation
1. **Clone the Repository** (requires permission):
   ```bash
   git clone git@github.com:akyong/Shopee-Infingerprint.git
   ```
   *Note*: Repository access requires permission from the developer.

2. **Project Structure**:
   Ensure the project folder contains:
   ```
   HTMLFetcher/
   ├── .gitignore
   ├── icons/
   │   ├── icon16.png
   │   ├── icon48.png
   │   ├── icon128.png
   ├── popup.html
   ├── popup.js
   ├── content.js
   ├── manifest.json
   ├── README.md
   ├── bobbyakyong.css
   ```

3. **Load Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the `HTMLFetcher` project folder.
   - The extension will appear in the Chrome toolbar.

## Usage
1. Open a webpage containing products (e.g., a Shopee search results page).
2. Click the HTML Fetcher extension icon in the Chrome toolbar to open the popup.
3. In the "Exclude Item IDs" input field, enter `itemid`s to exclude, separated by semicolons (e.g., `26729408427;42151358661`).
4. Click the **Fetch Links** button.
5. The textarea will display a list of product links in the format `https://shopee.co.id/product/<shopid>/<itemid>`, excluding any links with the specified `itemid`s.
6. The exclusion list is saved locally and automatically loaded when the popup is reopened.

## License
**Proprietary License**  
The source code for HTML Fetcher is the exclusive property of Bobby Akyong. Unauthorized use, modification, reproduction, or distribution of this code is strictly prohibited without written permission from the developer. To request permission, contact the developer using the information below.

## Contact
Developed by Bobby Akyong.  
- Website: [www.bobbyakyong.com](https://www.bobbyakyong.com)  
- Email: [iam@bobbyakyong.com](mailto:iam@bobbyakyong.com)  or  [bobbyakyong@gmail.com](mailto:bobbyakyong@gmail.com)
  For custom requirements, collaboration, or usage permissions, please reach out via the email above.

## Contributions
Due to the commercial nature of this project, external contributions are not accepted without written permission. For suggestions or collaboration inquiries, contact the developer.

## Developer Notes
This project was developed for commercial purposes and tested on e-commerce platforms like Shopee. If you encounter issues, check the logs in Chrome Developer Tools (right-click on the popup > Inspect > Console) and contact the developer for support.

© 2025 Bobby Akyong. All rights reserved.