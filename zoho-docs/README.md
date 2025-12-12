# Zoho Complete API & Deluge Reference Documentation

This comprehensive documentation covers the entire Zoho ecosystem including all product APIs and the Deluge programming language. Optimized for AI-assisted code generation.

---

## ⚡ **[START HERE: Quick Start Guide](./QUICK-START.md)**

**Get coding in 5 minutes** with copy-paste ready examples for the 10 most common Zoho operations:
- 🔐 Get OAuth Token (60 seconds)
- 📝 Create CRM Lead / Contact / Deal
- 🧾 Create Books Invoice
- 🎫 Create Desk Ticket
- 🗄️ Creator: Add/Query Records
- 📧 Send Email via Deluge
- 🔄 Auto-refresh Token Pattern
- ⚠️ Common Errors & Quick Fixes

**[→ View Quick Start Guide](./QUICK-START.md)**

---

## Quick Navigation

### 📚 [API Reference](./api-reference/README.md)
Complete API documentation for all 50+ Zoho products with endpoints, parameters, examples, and rate limits.

### 🔧 [Deluge Language Reference](./deluge/README.md)
Complete Deluge programming language documentation with syntax, functions, examples, and limitations.

### 📖 [Integration Guides](./guides/README.md)
Authentication, best practices, common patterns, and cross-product integration guides.

### ⚡ [Quick Reference](./quick-reference/README.md)
Cheat sheets and quick lookups for common operations.

---

## Zoho Products by Category

### 💼 Sales & Marketing
- [CRM](./api-reference/crm/README.md) - Customer Relationship Management
- [Campaigns](./api-reference/campaigns/README.md) - Email Marketing
- [Social](./api-reference/social/README.md) - Social Media Management
- [SalesIQ](./api-reference/salesiq/README.md) - Live Chat & Analytics
- [PageSense](./api-reference/pagesense/README.md) - Conversion Optimization
- [Marketing Automation](./api-reference/marketing-automation/README.md) - Marketing Workflows
- [Bigin](./api-reference/bigin/README.md) - Small Business CRM

### 📊 Analytics & BI
- [Analytics](./api-reference/analytics/README.md) - Business Intelligence & Reporting
- [DataPrep](./api-reference/dataprep/README.md) - ETL & Data Preparation

### 💰 Finance & Accounting
- [Books](./api-reference/books/README.md) - Accounting Software
- [Invoice](./api-reference/invoice/README.md) - Invoicing
- [Expense](./api-reference/expense/README.md) - Expense Management
- [Inventory](./api-reference/inventory/README.md) - Inventory Management
- [Subscriptions](./api-reference/subscriptions/README.md) - Recurring Billing
- [Finance Plus](./api-reference/finance-plus/README.md) - Financial Management Suite
- [Payroll](./api-reference/payroll/README.md) - Payroll Management

### 🛒 E-Commerce
- [Commerce](./api-reference/commerce/README.md) - E-Commerce Platform
- [Sites](./api-reference/sites/README.md) - Website Builder

### 👥 HR & Recruitment
- [People](./api-reference/people/README.md) - HR Management
- [Recruit](./api-reference/recruit/README.md) - Applicant Tracking System
- [Workerly](./api-reference/workerly/README.md) - Workforce Management

### 📋 Project Management
- [Projects](./api-reference/projects/README.md) - Project Management
- [Sprints](./api-reference/sprints/README.md) - Agile Project Management
- [BugTracker](./api-reference/bugtracker/README.md) - Bug Tracking

### 🎫 Customer Support
- [Desk](./api-reference/desk/README.md) - Help Desk Software
- [Assist](./api-reference/assist/README.md) - Remote Support
- [Lens](./api-reference/lens/README.md) - AR Remote Assistance

### 📝 Productivity & Collaboration
- [Mail](./api-reference/mail/README.md) - Email Service
- [Writer](./api-reference/writer/README.md) - Word Processor
- [Sheet](./api-reference/sheet/README.md) - Spreadsheet
- [Show](./api-reference/show/README.md) - Presentation Software
- [Notebook](./api-reference/notebook/README.md) - Note Taking
- [WorkDrive](./api-reference/workdrive/README.md) - Cloud Storage
- [Meeting](./api-reference/meeting/README.md) - Video Conferencing
- [Cliq](./api-reference/cliq/README.md) - Team Chat
- [Connect](./api-reference/connect/README.md) - Collaboration Platform

### 📋 Forms & Surveys
- [Forms](./api-reference/forms/README.md) - Online Forms
- [Survey](./api-reference/survey/README.md) - Survey Tool
- [Sign](./api-reference/sign/README.md) - Electronic Signatures
- [Bookings](./api-reference/bookings/README.md) - Appointment Scheduling

### 🔧 Development & Integration
- [Creator](./api-reference/creator/README.md) - Low-Code Platform
- [Flow](./api-reference/flow/README.md) - Workflow Automation
- [Catalyst](./api-reference/catalyst/README.md) - Serverless Platform
- [Office Integrator](./api-reference/office-integrator/README.md) - Office Suite Integration

### 🎪 Events & Learning
- [Backstage](./api-reference/backstage/README.md) - Event Management
- [Webinar](./api-reference/webinar/README.md) - Webinar Platform
- [Learn](./api-reference/learn/README.md) - Learning Management System

### 🔒 Security & IT
- [Vault](./api-reference/vault/README.md) - Password Manager
- [IoT](./api-reference/iot/README.md) - IoT Platform

### 📝 Testing
- [TestHub](./api-reference/testhub/README.md) - Test Management

### 🎯 Customer Success
- [Thrive](./api-reference/thrive/README.md) - Referral Marketing

---

## Documentation Structure

Each product's API reference includes:
- **Overview** - Product description and use cases
- **Authentication** - OAuth setup and token management
- **Endpoints** - Complete endpoint reference with examples
- **Data Models** - Entity schemas and relationships
- **Rate Limits** - API quotas and throttling
- **Common Operations** - Typical use case examples
- **Error Codes** - Error handling and troubleshooting
- **Webhooks** - Real-time event notifications (where available)
- **SDKs** - Available SDKs and libraries
- **Changelog** - API version history

---

## Deluge Programming Language

Deluge is Zoho's proprietary scripting language used across 40+ Zoho products for:
- Custom functions and automation
- Workflow scripts
- API integrations
- Data transformations
- Custom business logic

See the [Deluge Reference](./deluge/README.md) for complete language documentation.

---

## Getting Started

1. **Authentication**: Start with the [Authentication Guide](./guides/authentication.md)
2. **Choose Your Product**: Navigate to the specific product API reference
3. **Common Patterns**: Check [Common Patterns](./guides/common-patterns.md) for typical implementations
4. **Deluge Scripts**: Reference the [Deluge documentation](./deluge/README.md) for scripting

---

## API Versions

Most Zoho products are currently on these API versions:
- **CRM**: v6, v8 available
- **Books**: v3
- **Desk**: v1
- **Analytics**: v2
- **Campaigns**: v1.1
- **Projects**: v3 (mandatory migration by Dec 31, 2025)

Always check the specific product documentation for the latest version.

---

## Additional Resources

- [Zoho Developer Portal](https://www.zoho.com/developer/)
- [API Rate Limits Guide](./guides/rate-limits.md)
- [Best Practices](./guides/best-practices.md)
- [Error Handling Patterns](./guides/error-handling.md)
- [Cross-Product Integration](./guides/integration-patterns.md)

---

**Last Updated**: December 2025
**Coverage**: 50+ Zoho Products + Deluge Language
**Purpose**: Optimized for AI-assisted code generation with Claude
