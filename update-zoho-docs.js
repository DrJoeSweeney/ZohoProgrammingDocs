#!/usr/bin/env node

/**
 * Zoho Documentation Update Checker
 *
 * This script checks Zoho API documentation for changes and identifies
 * which documentation files need updating.
 *
 * Usage:
 *   node update-zoho-docs.js                    # Check all products
 *   node update-zoho-docs.js crm books desk     # Check specific products
 *   node update-zoho-docs.js --deluge           # Check Deluge docs
 *   node update-zoho-docs.js --full-report      # Generate detailed report
 *
 * Requirements:
 *   npm install playwright
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// Zoho products to check with their documentation URLs
const ZOHO_PRODUCTS = {
  crm: 'https://www.zoho.com/crm/developer/docs/api/v8/',
  books: 'https://www.zoho.com/books/api/v3/',
  desk: 'https://desk.zoho.com/DeskAPIDocument',
  analytics: 'https://www.zoho.com/analytics/api/',
  campaigns: 'https://www.zoho.com/campaigns/help/developers/api/',
  salesiq: 'https://www.zoho.com/salesiq/help/developer-section/',
  flow: 'https://www.zoho.com/flow/help/api.html',
  people: 'https://www.zoho.com/people/api/',
  recruit: 'https://www.zoho.com/recruit/developer-guide/',
  inventory: 'https://www.zoho.com/inventory/api/v1/',
  sign: 'https://www.zoho.com/sign/api/',
  invoice: 'https://www.zoho.com/invoice/api/v3/',
  expense: 'https://www.zoho.com/expense/api/v1/',
  subscriptions: 'https://www.zoho.com/subscriptions/api/v1/',
  projects: 'https://www.zoho.com/projects/help/rest-api/',
  creator: 'https://www.zoho.com/creator/help/api/',
  cliq: 'https://www.zoho.com/cliq/help/platform/api-overview.html',
  mail: 'https://www.zoho.com/mail/help/api/',
  meeting: 'https://www.zoho.com/meeting/api-integration.html',
  connect: 'https://www.zoho.com/connect/api/',
  workdrive: 'https://workdrive.zoho.com/apidocs/',
  sprints: 'https://www.zoho.com/sprints/api/',
  writer: 'https://www.zoho.com/writer/api/',
  sheet: 'https://www.zoho.com/sheet/api/',
  show: 'https://www.zoho.com/show/api/',
  forms: 'https://www.zoho.com/forms/help/api/',
  survey: 'https://www.zoho.com/survey/help/api/',
  deluge: 'https://www.zoho.com/deluge/help/'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class ZohoDocsChecker {
  constructor(options = {}) {
    this.browser = null;
    this.options = {
      fullReport: options.fullReport || false,
      productsToCheck: options.productsToCheck || Object.keys(ZOHO_PRODUCTS),
      checkDeluge: options.checkDeluge || false
    };
    this.results = [];
  }

  async init() {
    console.log(`${colors.blue}Initializing Zoho Documentation Checker...${colors.reset}\n`);
    this.browser = await chromium.launch({ headless: true });
  }

  async checkProduct(productName) {
    const url = ZOHO_PRODUCTS[productName];
    if (!url) {
      console.log(`${colors.red}✗ Unknown product: ${productName}${colors.reset}`);
      return null;
    }

    console.log(`${colors.cyan}Checking ${productName}...${colors.reset}`);

    try {
      const page = await this.browser.newPage();

      // Set timeout and user agent
      await page.setDefaultTimeout(30000);
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

      // Navigate to documentation page
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      if (!response || response.status() !== 200) {
        console.log(`${colors.yellow}⚠ Could not access ${productName} documentation (HTTP ${response?.status()})${colors.reset}`);
        await page.close();
        return { product: productName, status: 'inaccessible', url };
      }

      // Extract key information from the page
      const pageInfo = await page.evaluate(() => {
        const getTextContent = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.textContent.trim() : null;
        };

        const getAllText = () => {
          return document.body.innerText;
        };

        // Try to find API version information
        const bodyText = getAllText();
        const versionMatch = bodyText.match(/(?:API\s+)?[Vv]ersion\s*[:]?\s*([0-9]+(?:\.[0-9]+)?)/i) ||
                           bodyText.match(/v([0-9]+)/i);

        // Try to find last updated date
        const dateMatch = bodyText.match(/(?:Last\s+Updated|Updated\s+on)[:]?\s*([A-Za-z]+\s+[0-9]{1,2},?\s+[0-9]{4})/i) ||
                         bodyText.match(/([A-Za-z]+\s+[0-9]{1,2},?\s+[0-9]{4})/);

        // Check for specific API-related keywords
        const hasRestAPI = bodyText.toLowerCase().includes('rest api') || bodyText.toLowerCase().includes('restful');
        const hasOAuth = bodyText.toLowerCase().includes('oauth');
        const hasWebhooks = bodyText.toLowerCase().includes('webhook');

        return {
          title: document.title,
          version: versionMatch ? versionMatch[1] : null,
          lastUpdated: dateMatch ? dateMatch[1] : null,
          hasRestAPI,
          hasOAuth,
          hasWebhooks,
          contentLength: bodyText.length
        };
      });

      await page.close();

      // Read our local documentation to compare
      const localDocPath = path.join(__dirname, 'zoho-docs', 'api-reference', productName, 'README.md');
      let localVersion = null;
      let localLastUpdated = null;
      let fileExists = false;

      try {
        const localContent = await fs.readFile(localDocPath, 'utf-8');
        fileExists = true;

        // Extract version from local docs
        const versionMatch = localContent.match(/(?:API\s+)?[Vv]ersion[:\s]+([0-9]+(?:\.[0-9]+)?)/i) ||
                            localContent.match(/v([0-9]+)/i);
        localVersion = versionMatch ? versionMatch[1] : null;

        // Extract last updated from local docs
        const dateMatch = localContent.match(/\*\*Last Updated\*\*:\s*([A-Za-z]+\s+[0-9]{4})/i);
        localLastUpdated = dateMatch ? dateMatch[1] : null;
      } catch (err) {
        // File doesn't exist or can't be read
      }

      const result = {
        product: productName,
        status: 'checked',
        url,
        remote: pageInfo,
        local: {
          exists: fileExists,
          version: localVersion,
          lastUpdated: localLastUpdated
        },
        needsUpdate: false,
        reason: null
      };

      // Determine if update is needed
      if (!fileExists) {
        result.needsUpdate = true;
        result.reason = 'Local documentation file does not exist';
      } else if (pageInfo.version && localVersion && pageInfo.version !== localVersion) {
        result.needsUpdate = true;
        result.reason = `Version mismatch: Remote v${pageInfo.version} vs Local v${localVersion}`;
      } else if (pageInfo.contentLength > 50000 && !localLastUpdated) {
        result.needsUpdate = true;
        result.reason = 'Local docs missing last updated date';
      }

      // Display result
      if (result.needsUpdate) {
        console.log(`${colors.yellow}⚠ ${productName}: UPDATE NEEDED - ${result.reason}${colors.reset}`);
      } else {
        console.log(`${colors.green}✓ ${productName}: Up to date${colors.reset}`);
      }

      if (this.options.fullReport) {
        console.log(`  Remote: ${pageInfo.version ? `v${pageInfo.version}` : 'No version found'} | ${pageInfo.lastUpdated || 'No date found'}`);
        console.log(`  Local:  ${localVersion ? `v${localVersion}` : 'No version found'} | ${localLastUpdated || 'No date found'}`);
      }

      this.results.push(result);
      return result;

    } catch (error) {
      console.log(`${colors.red}✗ Error checking ${productName}: ${error.message}${colors.reset}`);
      return { product: productName, status: 'error', error: error.message, url };
    }
  }

  async checkAllProducts() {
    const products = this.options.productsToCheck;

    console.log(`${colors.blue}Checking ${products.length} product(s)...\n${colors.reset}`);

    for (const product of products) {
      await this.checkProduct(product);
    }
  }

  async generateReport() {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(__dirname, `update-report-${timestamp}.md`);

    const needsUpdate = this.results.filter(r => r.needsUpdate);
    const upToDate = this.results.filter(r => !r.needsUpdate && r.status === 'checked');
    const errors = this.results.filter(r => r.status === 'error' || r.status === 'inaccessible');

    let report = `# Zoho Documentation Update Report\n\n`;
    report += `**Generated**: ${new Date().toLocaleString()}\n`;
    report += `**Products Checked**: ${this.results.length}\n\n`;
    report += `---\n\n`;

    report += `## Summary\n\n`;
    report += `- ✅ **Up to Date**: ${upToDate.length}\n`;
    report += `- ⚠️  **Needs Update**: ${needsUpdate.length}\n`;
    report += `- ❌ **Errors/Inaccessible**: ${errors.length}\n\n`;
    report += `---\n\n`;

    if (needsUpdate.length > 0) {
      report += `## Documentation Needing Updates\n\n`;
      for (const item of needsUpdate) {
        report += `### ${item.product}\n\n`;
        report += `**Reason**: ${item.reason}\n\n`;
        report += `**Remote URL**: ${item.url}\n\n`;
        if (item.remote.version) report += `**Remote Version**: v${item.remote.version}\n\n`;
        if (item.local.version) report += `**Local Version**: v${item.local.version}\n\n`;
        report += `**Local File**: \`zoho-docs/api-reference/${item.product}/README.md\`\n\n`;
        report += `**Action**: Update documentation to reflect current API version and features\n\n`;
        report += `---\n\n`;
      }
    }

    if (upToDate.length > 0) {
      report += `## Up to Date Documentation\n\n`;
      for (const item of upToDate) {
        report += `- ✅ **${item.product}**: `;
        if (item.local.version) report += `v${item.local.version} `;
        if (item.local.lastUpdated) report += `(${item.local.lastUpdated})`;
        report += `\n`;
      }
      report += `\n`;
    }

    if (errors.length > 0) {
      report += `## Errors & Inaccessible\n\n`;
      for (const item of errors) {
        report += `- ❌ **${item.product}**: ${item.error || item.status}\n`;
        report += `  - URL: ${item.url}\n`;
      }
      report += `\n`;
    }

    report += `---\n\n`;
    report += `## Next Steps\n\n`;
    if (needsUpdate.length > 0) {
      report += `1. Review the products marked as needing updates\n`;
      report += `2. For each product, visit the remote documentation URL\n`;
      report += `3. Update the local markdown files with new information\n`;
      report += `4. Update version numbers and "Last Updated" dates\n`;
      report += `5. Re-run this script to verify updates: \`node update-zoho-docs.js\`\n\n`;
    } else {
      report += `All documentation appears to be up to date! 🎉\n\n`;
      report += `Consider running this check quarterly or when Zoho announces API updates.\n\n`;
    }

    report += `---\n\n`;
    report += `**How to Update Specific Documentation**:\n\n`;
    report += `\`\`\`bash\n`;
    report += `# To request Claude to update specific product documentation:\n`;
    report += `# "Update the [product-name] documentation to version X based on the latest API docs"\n\n`;
    report += `# Example:\n`;
    report += `# "Update the CRM documentation to version 8 based on https://www.zoho.com/crm/developer/docs/api/v8/"\n`;
    report += `\`\`\`\n`;

    await fs.writeFile(reportPath, report);

    console.log(`\n${colors.green}Report generated: ${reportPath}${colors.reset}`);
    return reportPath;
  }

  displaySummary() {
    const needsUpdate = this.results.filter(r => r.needsUpdate);
    const upToDate = this.results.filter(r => !r.needsUpdate && r.status === 'checked');
    const errors = this.results.filter(r => r.status === 'error' || r.status === 'inaccessible');

    console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}          UPDATE SUMMARY${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);

    console.log(`${colors.green}✅ Up to Date:     ${upToDate.length}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Needs Update:   ${needsUpdate.length}${colors.reset}`);
    console.log(`${colors.red}❌ Errors:         ${errors.length}${colors.reset}\n`);

    if (needsUpdate.length > 0) {
      console.log(`${colors.yellow}Products needing updates:${colors.reset}`);
      needsUpdate.forEach(item => {
        console.log(`  • ${item.product}: ${item.reason}`);
      });
      console.log();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  const options = {
    fullReport: args.includes('--full-report'),
    checkDeluge: args.includes('--deluge'),
    productsToCheck: []
  };

  // Filter out flags to get product names
  const productArgs = args.filter(arg => !arg.startsWith('--'));

  if (productArgs.length > 0) {
    // Check specific products
    options.productsToCheck = productArgs.filter(p => ZOHO_PRODUCTS[p]);

    // Warn about unknown products
    const unknown = productArgs.filter(p => !ZOHO_PRODUCTS[p]);
    if (unknown.length > 0) {
      console.log(`${colors.yellow}Warning: Unknown products: ${unknown.join(', ')}${colors.reset}\n`);
    }
  } else {
    // Check all products
    options.productsToCheck = Object.keys(ZOHO_PRODUCTS);

    // Remove deluge unless specifically requested
    if (!options.checkDeluge) {
      options.productsToCheck = options.productsToCheck.filter(p => p !== 'deluge');
    }
  }

  if (options.productsToCheck.length === 0) {
    console.log(`${colors.red}No valid products to check!${colors.reset}`);
    console.log(`\nUsage:`);
    console.log(`  node update-zoho-docs.js                    # Check all products`);
    console.log(`  node update-zoho-docs.js crm books desk     # Check specific products`);
    console.log(`  node update-zoho-docs.js --deluge           # Check Deluge docs`);
    console.log(`  node update-zoho-docs.js --full-report      # Generate detailed report`);
    console.log(`\nAvailable products: ${Object.keys(ZOHO_PRODUCTS).join(', ')}`);
    process.exit(1);
  }

  const checker = new ZohoDocsChecker(options);

  try {
    await checker.init();
    await checker.checkAllProducts();
    checker.displaySummary();
    await checker.generateReport();
  } catch (error) {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await checker.close();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = { ZohoDocsChecker, ZOHO_PRODUCTS };
