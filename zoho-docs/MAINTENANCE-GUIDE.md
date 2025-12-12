# Documentation Maintenance Guide

## Overview

This guide explains how to maintain, update, and keep the Zoho documentation current. It's designed for maintainers who need to update documentation as Zoho's APIs evolve.

---

## Table of Contents

1. [Maintenance Workflow](#maintenance-workflow)
2. [Manual Update Process](#manual-update-process)
3. [Adding New Products](#adding-new-products)
4. [Updating Existing Products](#updating-existing-products)
5. [Deluge Updates](#deluge-updates)
6. [Quality Checklist](#quality-checklist)
7. [Version Control](#version-control)
8. [Troubleshooting](#troubleshooting)

---

## Maintenance Workflow

### Regular Schedule

```
Monthly → Check core products for updates
          ↓
Quarterly → Full review of assigned product set
          ↓
Annually → Complete documentation audit
```

### Monthly Maintenance (1st Monday of Month)

**Time Required**: 30-45 minutes

**Core Products to Check**:
- CRM, Books, Desk (most commonly used)
- Analytics, Projects, Creator
- Any products recently updated by Zoho

**Steps**:
1. Visit Zoho Developer Portal for each product
2. Check API version and compare with local docs
3. Note any version changes or new features
4. Update documentation as needed
5. Update `UPDATE-TRACKER.md` with changes

### Quarterly Maintenance (First Week of Quarter)

**Time Required**: 2-3 hours

**Q1 (March)**: Products 1-13 + Deluge
**Q2 (June)**: Products 14-26 + Guides
**Q3 (September)**: Products 27-39 + Quick Reference
**Q4 (December)**: Products 40-51 + Full Audit

**Steps**:
1. Review Zoho changelog for assigned products
   - Visit each product's API documentation
   - Check for version changes
   - Note new features/deprecations

2. Update documentation systematically
   - One product at a time
   - Follow update checklist below

3. Update `UPDATE-TRACKER.md`
   - Mark products as reviewed
   - Note any upcoming changes
   - Set next review date

4. Test all code examples
   - Verify JavaScript examples
   - Verify Python examples
   - Verify Deluge examples

### Annual Maintenance (December)

**Time Required**: 8-10 hours

**Steps**:
1. Full audit of all 51 API references
2. Verify all Deluge documentation
3. Test all code examples
4. Verify all links work
5. Update all rate limits
6. Update version numbers
7. Review and update guides
8. Review and update quick references

---

## Manual Update Process

### When to Update

1. Zoho announces API changes
2. You discover outdated information
3. New features are released
4. Breaking changes announced
5. Monthly/quarterly review schedule

### Step-by-Step Update Process

#### 1. Identify What Needs Updating

**Sources to Monitor**:
- [Zoho Developer Portal](https://www.zoho.com/developer/) - Main API documentation
- [Zoho Blog](https://www.zoho.com/blog/) - Feature announcements
- [API Console](https://api-console.zoho.com/) - Live API testing
- [Zoho Status Page](https://status.zoho.com/) - Service updates

**What to Look For**:
- API version changes (v7 → v8)
- New endpoints or features
- Deprecated endpoints
- Rate limit changes
- Authentication changes
- Data format changes

#### 2. Prepare for Update

```bash
# Navigate to project directory
cd C:\Users\jswee\Documents\GitHub\ZohoProgrammingDocs

# Open the product documentation
code zoho-docs/api-reference/[product-name]/README.md
```

#### 3. Research the Changes

Visit the official Zoho documentation:
- Read through all sections
- Note version changes
- Identify new features
- Check for deprecations
- Review rate limit changes
- Save example responses

**Key URLs by Product**:
- CRM: https://www.zoho.com/crm/developer/docs/api/
- Books: https://www.zoho.com/books/api/v3/
- Desk: https://desk.zoho.com/DeskAPIDocument
- Creator: https://www.zoho.com/creator/help/api/
- Analytics: https://www.zoho.com/analytics/api/
- [See full list in README.md]

#### 4. Update Documentation

**Update Header Section**:
```markdown
## Overview

**Current API Version**: v8  ← Update if changed
**Base URL**: `https://www.zohoapis.com/crm/v8/`  ← Update if changed
**Last Updated**: January 2026  ← Update to current month
```

**Update Rate Limits**:
```markdown
| Edition | API Calls per Day |
|---------|-------------------|
| Free | 5,000 |  ← Verify current limits
| Standard | 10,000 |
```

**Add New Features**:
```markdown
### What's New in v8.1

- Blueprint API for approval workflows
- Enhanced COQL with JOIN support
- New webhook events
```

**Update Code Examples**:
```javascript
// Ensure examples use current API version
const response = await axios.get(
  'https://www.zohoapis.com/crm/v8/Leads',  // Current version
  { /* ... */ }
);
```

**Add Deprecation Warnings**:
```markdown
> **⚠️ DEPRECATED**: The v6 API will be sunset on March 31, 2026.
> Migrate to v8 by following the [migration guide](#migration-guide).
```

#### 5. Test Examples

Create a test file to verify examples work:

```javascript
// test-examples.js
// Copy and test each code example to ensure it works

const testCRMExample = async () => {
  // Test the example code here
};
```

#### 6. Update Cross-References

Check if changes affect other files:
- Update guides if authentication changed
- Update quick reference if endpoints changed
- Update Deluge docs if Zoho built-in functions changed

#### 7. Update Metadata

Update the file's footer:
```markdown
---

**Last Updated**: January 2026  ← Current month
**API Version**: v8.1  ← Current version
```

#### 8. Update Tracker

Edit `zoho-docs/UPDATE-TRACKER.md`:
```markdown
| **CRM** | v8.1 | 1.1 | January 2026 | April 2026 | ✅ Current | Updated for v8.1 features |
```

---

## Adding New Products

### When Zoho Releases a New Product

#### 1. Create Directory Structure

```bash
# From project root
mkdir zoho-docs/api-reference/[product-name]
```

#### 2. Create README.md

Use this template:

```markdown
# Zoho [Product Name] API Reference

## Overview

[Product description and purpose]

**Current API Version**: v1
**Base URL**: `https://www.zohoapis.com/[product]/v1/`
**Protocol**: REST
**Data Format**: JSON
**Authentication**: OAuth 2.0

---

## Quick Links

- [Authentication](#authentication)
- [Core APIs](#core-apis)
- [Rate Limits](#rate-limits)
- [Code Examples](#code-examples)

---

## Core APIs

### Get Resources

[Document main endpoints]

---

## Authentication

[OAuth 2.0 flow specific to this product]

---

## Rate Limits

[Document rate limits]

---

## Code Examples

### JavaScript

[Example code]

### Python

[Example code]

### Deluge

[Example code]

---

## Best Practices

[Product-specific best practices]

---

## Additional Resources

- [Official Documentation](URL)

---

**Last Updated**: [Month Year]
**API Version**: v1
```

#### 3. Add to Master Index

Edit `zoho-docs/README.md`:
```markdown
### [Category Name]
- [Product Name](./api-reference/[product-name]/README.md) - Brief description
```

#### 4. Add to Update Tracker

Edit `zoho-docs/UPDATE-TRACKER.md`:
```markdown
| **New Product** | v1 | 1.0 | [Month Year] | [+3 months] | ✅ Current | Initial documentation |
```

---

## Updating Existing Products

### Version Updates

#### Minor Version Updates (v8.0 → v8.1)

**Impact**: Low - Usually additive features

**Process**:
1. Update version number in header
2. Add "What's New" section
3. Document new features/endpoints
4. Update code examples if needed
5. Update last updated date

#### Major Version Updates (v7 → v8)

**Impact**: High - May include breaking changes

**Process**:
1. Create migration section
2. Document breaking changes
3. Update all endpoints
4. Update all code examples
5. Add deprecation warnings
6. Update version in all references

**Template for Migration Section**:
```markdown
## Migrating from v7 to v8

### Breaking Changes

1. **Authentication**: Basic Auth removed, OAuth 2.0 required
   - **Before**: `Authorization: Basic base64(username:password)`
   - **After**: `Authorization: Zoho-oauthtoken {access_token}`

2. **Endpoint Changes**: Base URL updated
   - **Before**: `https://www.zohoapis.com/crm/v7/`
   - **After**: `https://www.zohoapis.com/crm/v8/`

3. **Request Format**: Field names changed
   - **Before**: `LastName`
   - **After**: `Last_Name`

### Migration Steps

1. Update authentication to OAuth 2.0
2. Update base URL in all requests
3. Update field names in request/response handling
4. Test all integrations thoroughly
5. Monitor API calls after migration

### Timeline

- **Now**: v7 still supported
- **March 2026**: v7 deprecated
- **June 2026**: v7 sunset (will stop working)
```

### Rate Limit Changes

When Zoho changes rate limits:

1. Update rate limit table
2. Add note about when change took effect
3. Update code examples if limits affect patterns
4. Notify users in a "Recent Changes" section

```markdown
### Recent Changes

**January 2026**: Rate limits increased for Enterprise tier
- Previous: 50,000 calls/day
- New: 75,000 calls/day
```

### New Feature Additions

When Zoho adds new features:

1. Add new section for the feature
2. Document all new endpoints
3. Provide code examples
4. Update table of contents
5. Add to "What's New" section

```markdown
### What's New in v8.1 (January 2026)

- **Blueprint API**: Automate approval workflows
- **Enhanced COQL**: JOIN support for related modules
- **New Webhooks**: Deal stage change events
- **Bulk Operations**: Increased limit to 100 records per call
```

---

## Deluge Updates

### Monitoring Deluge Changes

**Sources**:
- https://www.zoho.com/deluge/help/
- Zoho blog announcements
- Developer forum discussions

### Types of Deluge Updates

#### 1. New Functions

When Zoho adds new built-in functions:

**Update**: `deluge/functions/README.md`

```markdown
### String Functions

#### stringReverse()
**Added**: January 2026

Reverses a string.

**Syntax**:
```javascript
result = stringReverse(string);
```

**Example**:
```javascript
reversed = stringReverse("hello");
// Result: "olleh"
```
```

#### 2. Increased Limitations

When execution limits change:

**Update**: `deluge/limitations/README.md`

```markdown
## Execution Time Limits

| Context | Previous Limit | Current Limit | Updated |
|---------|---------------|---------------|---------|
| Workflow | 5 minutes | 10 minutes | January 2026 |
```

#### 3. New Capabilities

When new integration patterns are supported:

**Update**: `deluge/api-integration/README.md`

```markdown
### OAuth 2.1 with PKCE

**Added**: January 2026

Deluge now supports OAuth 2.1 with PKCE for enhanced security.

[Documentation and examples]
```

#### 4. New Examples

Regularly add examples to `deluge/examples/README.md`:

```markdown
### 23. [New Example Name]

**Added**: January 2026
**Category**: [Category]
**Use Case**: [Description]

[Complete example code]
```

---

## Quality Checklist

### Before Committing Updates

Use this checklist for every update:

#### Content Quality
- [ ] All code examples tested and working
- [ ] Examples provided in JavaScript, Python, and Deluge
- [ ] All links verified (no 404s)
- [ ] API version correct in header
- [ ] Rate limits verified against official docs
- [ ] Authentication section up to date
- [ ] Error codes section complete

#### Formatting
- [ ] Consistent markdown formatting
- [ ] Proper code block syntax highlighting
- [ ] Tables formatted correctly
- [ ] Headers use proper hierarchy (H1, H2, H3)
- [ ] Lists formatted consistently

#### Metadata
- [ ] "Last Updated" date is current month/year
- [ ] "API Version" matches latest version
- [ ] UPDATE-TRACKER.md updated
- [ ] Next review date set (3 months for API, 6 months for Deluge)

#### Cross-References
- [ ] Links to related documentation work
- [ ] Guides updated if authentication changed
- [ ] Quick reference updated if endpoints changed
- [ ] Examples updated if API changed

#### Documentation Standards
- [ ] Clear and concise explanations
- [ ] Jargon explained or avoided
- [ ] Examples demonstrate real use cases
- [ ] Error handling shown in examples
- [ ] Best practices included

---

## Version Control

### Commit Messages

Use clear, descriptive commit messages:

**Format**:
```
[Product/Section]: Brief description

- Detailed change 1
- Detailed change 2
- Detailed change 3
```

**Examples**:

Good:
```
CRM: Update to API v8.1

- Added Blueprint API documentation
- Updated COQL with JOIN examples
- Increased rate limits for Enterprise tier
- Added migration guide from v8.0
```

Bad:
```
Updated CRM docs
```

### Git Workflow

```bash
# 1. Check status
git status

# 2. Add updated files
git add zoho-docs/api-reference/crm/README.md
git add zoho-docs/UPDATE-TRACKER.md

# 3. Commit with descriptive message
git commit -m "CRM: Update to API v8.1

- Added Blueprint API documentation
- Updated COQL with JOIN examples
- Increased rate limits for Enterprise tier"

# 4. Push changes
git push origin main
```

### Branching Strategy

For major updates:

```bash
# Create feature branch
git checkout -b update-crm-v8.1

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "CRM: Update to v8.1"

# Push branch
git push origin update-crm-v8.1

# Create pull request for review
# Merge after review
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Can't Find Official Documentation

**Symptoms**: Can't locate the API documentation for a product

**Solutions**:
1. Check [Zoho Developer Portal](https://www.zoho.com/developer/)
2. Google: "Zoho [Product] API documentation"
3. Check product's help section: `https://www.zoho.com/[product]/help/api/`
4. Try API console: `https://api-console.zoho.com/`

#### Issue 2: Code Examples Not Working

**Symptoms**: Examples return errors when tested

**Solutions**:
1. Verify API version in endpoint URL
2. Check authentication token is valid
3. Verify request body format matches current API
4. Check rate limits not exceeded
5. Verify required fields

**Fix**:
```javascript
// Test the example
const testExample = async () => {
  try {
    const response = await /* example code */;
    console.log('Success:', response);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
```

#### Issue 3: Links Broken After Update

**Symptoms**: Internal links return 404

**Solutions**:
1. Verify file paths are correct
2. Check for renamed files
3. Use relative paths for internal links
4. Test all links after updates

**Fix**:
```markdown
<!-- Use relative paths -->
[Authentication](./authentication.md)  <!-- Relative -->
[Authentication](/zoho-docs/api-reference/crm/authentication.md)  <!-- Absolute -->
```

#### Issue 4: Version Number Confusion

**Symptoms**: Multiple version numbers listed, unclear which is current

**Solutions**:
1. Check official Zoho documentation header
2. Test an API call to see which version responds
3. Use API console to verify
4. Standardize format in local docs (use "v8" format)

---

## Quick Reference Commands

### File Locations
```
Documentation Root:
  zoho-docs/

API References:
  zoho-docs/api-reference/[product]/README.md

Deluge Docs:
  zoho-docs/deluge/[topic]/README.md

Guides:
  zoho-docs/guides/[guide-name]/README.md

Quick Reference:
  zoho-docs/quick-reference/[cheatsheet].md

Trackers:
  zoho-docs/UPDATE-TRACKER.md
```

### Important URLs
```
Zoho Developer Portal:
  https://www.zoho.com/developer/

Deluge Help:
  https://www.zoho.com/deluge/help/

API Console:
  https://api-console.zoho.com/

Zoho Status Page:
  https://status.zoho.com/
```

---

## Best Practices Summary

1. **Check official docs monthly** for frequently used products (CRM, Books, Desk, Creator)
2. **Follow quarterly review schedule** systematically
3. **Test all code examples** before committing
4. **Update tracker file** every time you update documentation
5. **Use descriptive commit messages** for version control
6. **Monitor Zoho announcements** for API changes (blog, forums, status page)
7. **Keep examples current** with latest API versions
8. **Document deprecations** clearly with timelines
9. **Maintain consistent formatting** across all files
10. **Verify all links work** after updates

---

## Maintenance Contacts & Resources

### Zoho Resources
- Developer Portal: https://www.zoho.com/developer/
- API Console: https://api-console.zoho.com/
- Forums: https://help.zoho.com/portal/en/community/
- Support: support@zoho.com
- Blog: https://www.zoho.com/blog/

### Documentation Repository
- Location: `C:\Users\jswee\Documents\GitHub\ZohoProgrammingDocs`
- GitHub: https://github.com/DrJoeSweeney/ZohoProgrammingDocs

---

**Last Updated**: December 2025
**Maintenance Guide Version**: 2.0
