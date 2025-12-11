# Documentation Update Request Format

## Overview

This guide explains the best way to request updates to the Zoho documentation. Following these formats ensures efficient, accurate updates.

---

## Quick Start

### 1. Automated Check (Recommended)

Run the automated update checker first to identify what needs updating:

```bash
# Windows
check-updates.bat

# macOS/Linux
node update-zoho-docs.js
```

This generates a report showing which documentation is outdated.

### 2. Request Update from Claude

Use one of the formats below based on your needs.

---

## Update Request Formats

### Format 1: Simple Product Update

**When to use**: Update entire product documentation to latest version

**Format**:
```
Update the [PRODUCT] documentation to version [VERSION]
```

**Examples**:
```
Update the CRM documentation to version 8
Update the Books documentation to version 3
Update the Desk documentation to the latest version
```

---

### Format 2: Specific Section Update

**When to use**: Update only a specific section or feature

**Format**:
```
Update the [SECTION] section in [PRODUCT] documentation for [REASON]
```

**Examples**:
```
Update the Authentication section in CRM documentation for OAuth 2.1 changes
Update the Webhooks section in Desk documentation to add new event types
Update the Rate Limits section in Analytics documentation for new tier limits
```

---

### Format 3: Version Migration Update

**When to use**: Zoho announces API version deprecation/upgrade

**Format**:
```
Migrate [PRODUCT] documentation from version [OLD] to version [NEW] with breaking changes
```

**Examples**:
```
Migrate Projects documentation from version 3 to version 4 with breaking changes
Migrate CRM documentation from v6 to v8 with breaking changes
```

---

### Format 4: New Feature Addition

**When to use**: Zoho releases new API features/endpoints

**Format**:
```
Add [FEATURE] to [PRODUCT] documentation based on [SOURCE]
```

**Examples**:
```
Add Blueprint API to CRM documentation based on https://www.zoho.com/crm/developer/docs/api/v8/blueprints.html
Add Mass Email API to Campaigns documentation based on latest release notes
Add Custom Functions to Deluge documentation
```

---

### Format 5: Automated Report-Based Update

**When to use**: After running check-updates.bat/update-zoho-docs.js

**Format**:
```
Update the following products based on the [DATE] update report:
- [PRODUCT 1]: [REASON]
- [PRODUCT 2]: [REASON]
- [PRODUCT 3]: [REASON]
```

**Example**:
```
Update the following products based on the 2025-12-12 update report:
- CRM: Version mismatch (Remote v8 vs Local v6)
- Books: Missing last updated date
- Desk: New API endpoints not documented
```

---

### Format 6: Deluge Language Update

**When to use**: Updating Deluge language reference

**Format**:
```
Update Deluge [TOPIC] documentation for [CHANGE]
```

**Examples**:
```
Update Deluge functions documentation for new string manipulation functions
Update Deluge API integration documentation for OAuth 2.1 support
Update Deluge limitations documentation for increased execution time limits
```

---

### Format 7: Cross-Product Update

**When to use**: Feature affects multiple products

**Format**:
```
Update OAuth/Rate Limits/[COMMON FEATURE] across all products for [CHANGE]
```

**Examples**:
```
Update OAuth flow across all products for PKCE support
Update rate limits across all products for January 2025 tier changes
Update webhook signature verification across all products for new algorithm
```

---

## Update Request Template

For comprehensive updates, use this template:

```markdown
## Documentation Update Request

**Product(s)**: [Product names]
**Section(s)**: [Specific sections or "Complete documentation"]
**Version**: [Current version → New version]
**Source**: [URL to official Zoho documentation]
**Priority**: [High/Medium/Low]
**Reason**: [Why this update is needed]

### Changes Needed:
- [ ] Update version number
- [ ] Add new endpoints/features
- [ ] Update code examples
- [ ] Update rate limits
- [ ] Update authentication flow
- [ ] Update error codes
- [ ] Other: [specify]

### Additional Context:
[Any relevant details, breaking changes, migration notes]
```

---

## Best Practices

### 1. Check Before Requesting

Always run the automated checker first:
```bash
check-updates.bat
```

This identifies what actually needs updating and provides specific reasons.

### 2. Provide Source URLs

Include links to official Zoho documentation when possible:
```
Update CRM documentation based on:
https://www.zoho.com/crm/developer/docs/api/v8/
```

### 3. Be Specific About Scope

Don't say: "Update CRM docs"
Do say: "Update CRM documentation Authentication section for OAuth 2.1 changes"

### 4. Batch Related Updates

If multiple products have the same change, request them together:
```
Update rate limits for CRM, Books, Desk, and Projects based on new tier structure
```

### 5. Specify Breaking Changes

If Zoho announces breaking changes, mention it:
```
Update Projects documentation from v3 to v4 - BREAKING CHANGES include:
- Removed deprecated endpoints
- Changed authentication flow
- Updated request/response formats
```

---

## Update Triggers

### When to Request Updates

1. **Quarterly Review** (Every 3 months)
   - Run automated checker
   - Review Zoho changelog
   - Update all flagged products

2. **Version Changes**
   - Zoho releases new API version (e.g., CRM v8 → v9)
   - Deprecation notices

3. **New Features**
   - Zoho announces new API endpoints
   - New products added to Zoho One

4. **Breaking Changes**
   - API changes that break existing code
   - Authentication flow changes

5. **Rate Limit Changes**
   - Tier restructuring
   - New limits announced

6. **User Discovery**
   - You find outdated information while coding
   - API returns unexpected responses

---

## Automation Workflow

### Step 1: Run Automated Check

```bash
# Check all products
check-updates.bat

# Check specific products
check-updates.bat crm books desk

# Generate detailed report
check-updates.bat --full-report
```

### Step 2: Review Generated Report

The script creates `update-report-YYYY-MM-DD.md` with:
- Products needing updates
- Reason for each update
- Version mismatches
- Missing information

### Step 3: Request Updates

Use the report to create specific update requests:

```
Based on today's update report, please update:

1. CRM - Version mismatch (Remote v8 vs Local v6)
   Source: https://www.zoho.com/crm/developer/docs/api/v8/

2. Books - Missing last updated date
   Source: https://www.zoho.com/books/api/v3/

3. Desk - New webhook events
   Source: https://desk.zoho.com/DeskAPIDocument#Webhooks
```

---

## Manual Verification

After updates, verify changes:

### 1. Check Version Numbers
```bash
# Search for version declarations
grep -r "API Version" zoho-docs/api-reference/
```

### 2. Check Last Updated Dates
```bash
# Search for last updated metadata
grep -r "Last Updated" zoho-docs/api-reference/
```

### 3. Verify Code Examples
- Ensure examples use current API version
- Test authentication flows
- Validate endpoint URLs

### 4. Check Cross-References
- Links to other documentation work
- Related sections updated consistently

---

## Examples by Scenario

### Scenario 1: After Running Automated Check

```
The automated checker found 3 products needing updates.
Please update:

1. CRM: Version mismatch (Remote v8.1 vs Local v8.0)
2. Books: New endpoint /api/v3/invoices/bulk_export not documented
3. Desk: Rate limits changed (100K → 150K per day for Enterprise tier)

Sources:
- CRM: https://www.zoho.com/crm/developer/docs/api/v8/
- Books: https://www.zoho.com/books/api/v3/
- Desk: https://desk.zoho.com/DeskAPIDocument
```

### Scenario 2: Zoho Announces Breaking Change

```
URGENT: Projects API v3 deprecated effective March 2025

Migrate Projects documentation from v3 to v4 with the following breaking changes:
- /restapi/portal/[PORTALID]/ → /api/v4/
- Basic Auth removed (OAuth 2.0 required)
- All date formats changed to ISO 8601

Source: https://www.zoho.com/projects/help/rest-api/migration-guide.html
Priority: High
```

### Scenario 3: New Product Release

```
Add Zoho Thrive API documentation

Create new API reference for Zoho Thrive based on:
https://www.zoho.com/thrive/api/

Include:
- Authentication (OAuth 2.0)
- Core endpoints (OKRs, Goals, Check-ins)
- Rate limits
- Code examples (JavaScript, Python, Deluge)
- Webhooks (if available)
```

### Scenario 4: Quarterly Maintenance

```
Quarterly Documentation Update - Q1 2025

Please review and update all documentation based on:
1. Run check-updates.bat results
2. Zoho Q1 2025 changelog: https://www.zoho.com/developer/changelog/
3. Any deprecated endpoints or features

Focus areas:
- Rate limit changes
- New authentication requirements
- Deprecated API versions
- New products/features

Generate report after completion.
```

### Scenario 5: Deluge Update

```
Update Deluge documentation for new features announced in January 2025:

1. functions/README.md
   - Add new string functions: stringReverse(), stringPad()
   - Add new date functions: getQuarter(), getWeekOfYear()

2. api-integration/README.md
   - Update invokeUrl for HTTP/2 support
   - Add examples for OAuth 2.1 with PKCE

3. limitations/README.md
   - Update execution time limit (5 min → 10 min)
   - Update API call limit per script (100 → 200)

Source: https://www.zoho.com/deluge/help/whats-new/
```

---

## Monitoring Zoho Updates

### Official Sources to Monitor

1. **Zoho Developer Portal**
   - https://www.zoho.com/developer/
   - Announcements and changelogs

2. **Product-Specific Changelogs**
   - https://www.zoho.com/crm/developer/docs/api/changelog.html
   - https://www.zoho.com/books/api/v3/changelog/
   - (Each product has its own)

3. **Zoho Blog**
   - https://www.zoho.com/blog/
   - New feature announcements

4. **Zoho Forums**
   - https://help.zoho.com/portal/en/community/
   - Community discussions and issues

5. **API Status Pages**
   - Check for planned maintenance and updates

### Recommended Schedule

| Frequency | Action |
|-----------|--------|
| **Weekly** | Check Zoho Developer Portal for announcements |
| **Monthly** | Run automated checker on frequently used products |
| **Quarterly** | Full documentation review and update |
| **As Needed** | When Zoho emails API changes or deprecations |

---

## Troubleshooting Update Requests

### Issue: "Documentation seems complete but checker shows update needed"

**Solution**: Check these specific items:
- Version number in header section
- "Last Updated" metadata at bottom
- Code examples use current API version
- Rate limits match current tiers

### Issue: "Can't find official documentation for update"

**Solution**:
1. Check product's main website → Developer section
2. Search Zoho Developer Portal
3. Contact Zoho support for API documentation
4. Check if product has API access at all (some don't)

### Issue: "Update checker can't access product documentation"

**Solution**:
- Some products require authentication to view docs
- Check if documentation URL changed
- Update `ZOHO_PRODUCTS` object in `update-zoho-docs.js`
- Add product-specific authentication if needed

### Issue: "Breaking changes but no migration guide"

**Solution**:
- Document breaking changes with clear warnings
- Provide both old and new examples
- Add migration notes section
- Contact Zoho for official migration guide

---

## Quick Reference

### Most Common Update Commands

```bash
# Run full check
check-updates.bat

# Check specific products
check-updates.bat crm books desk

# Check with detailed report
check-updates.bat --full-report

# Check Deluge documentation
check-updates.bat --deluge
```

### Most Common Update Requests

```
# Simple version update
Update the [product] documentation to version [X]

# Section-specific update
Update the [section] in [product] for [reason]

# Batch update
Update rate limits across all products for new tier structure

# Urgent breaking change
URGENT: Migrate [product] from v[X] to v[Y] - Breaking Changes
```

---

## Summary

**Best Practice Workflow**:
1. 🔍 Run automated checker monthly
2. 📋 Review generated report
3. 📝 Create specific update requests using formats above
4. ✅ Verify updates after completion
5. 📅 Schedule next quarterly review

**Key Principles**:
- Be specific about what needs updating
- Provide source URLs when possible
- Batch related updates together
- Specify breaking changes clearly
- Verify updates after completion

---

**Last Updated**: December 2025
**Script Version**: 1.0
