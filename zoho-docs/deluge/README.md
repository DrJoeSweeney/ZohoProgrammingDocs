# Deluge Programming Language Reference

> **Deluge** (Data Enriched Language for the Universal Grid Environment) is Zoho's proprietary online scripting language that powers automation and customization across 25+ Zoho products. This comprehensive reference guide covers all aspects of Deluge programming.

## What is Deluge?

Deluge is a scripting language designed to create powerful applications and automations within the Zoho ecosystem. Unlike traditional programming languages requiring extensive setup, Deluge allows you to write scripts directly and execute them within Zoho applications with minimal dependencies.

### Key Characteristics

- **Easy-to-Read Syntax**: Natural, intuitive syntax that's simple to understand and write
- **Query Integrated**: Bridges program logic with data operations seamlessly
- **No Concrete Syntax**: Code is stored as abstract syntax in database tables
- **Platform-Integrated**: Works natively across all Zoho services
- **Minimal Dependencies**: Platform handles most infrastructure concerns

## Documentation Sections

### Core Language Concepts

1. **[Language Basics](./language-basics/README.md)**
   - Syntax fundamentals
   - Variables and naming conventions
   - Comments and code structure
   - Scope and best practices

2. **[Data Types](./data-types/README.md)**
   - Text/String
   - Number and Decimal
   - Boolean
   - Date-Time and Time
   - List
   - Map/Key-Value
   - Collection
   - File
   - Null values

3. **[Operators](./operators/README.md)**
   - Arithmetic operators
   - Assignment operators
   - Comparison/Relational operators
   - Logical operators
   - String concatenation
   - Operator precedence

4. **[Control Structures](./control-structures/README.md)**
   - If/else statements
   - Conditional if (ternary)
   - For each loops
   - Break and continue
   - ifNull operator

### Advanced Topics

5. **[Functions](./functions/README.md)**
   - Built-in functions overview
   - Custom function creation
   - Function parameters and return values
   - Scope and function calls
   - Function limitations

6. **[Collections](./collections/README.md)**
   - Lists: creation, manipulation, methods
   - Maps: key-value pairs, operations
   - Collection data type
   - Iteration and access patterns
   - Best practices

7. **[Date & Time](./date-time/README.md)**
   - Date-Time data type
   - Time data type
   - Date formatting and parsing
   - Date arithmetic (addDay, addMonth, etc.)
   - Current date/time functions

8. **[String Manipulation](./strings/README.md)**
   - String functions
   - Text operations
   - Pattern matching
   - String formatting
   - Common string tasks

### Integration & Data

9. **[File Operations](./file-operations/README.md)**
   - File data type
   - Fetching files from web/cloud
   - File handling in Deluge
   - Attachments and uploads

10. **[API Integration](./api-integration/README.md)**
    - invokeUrl function
    - REST API calls (GET, POST, PUT, DELETE, PATCH)
    - Connections for authentication
    - OAuth integration
    - API request/response handling
    - External API limits

11. **[Database Operations](./database/README.md)**
    - COQL (CRM Object Query Language)
    - Fetching records from Zoho CRM
    - Search and query operations
    - Related records
    - Data manipulation

12. **[Error Handling](./error-handling/README.md)**
    - Try-catch statements
    - Exception handling
    - Error messages and debugging
    - Throw custom exceptions
    - Best practices

### Practical Resources

13. **[Common Examples](./examples/README.md)**
    - Real-world code patterns
    - Common use cases
    - Best practices
    - Code snippets
    - Integration examples

14. **[Limitations & Constraints](./limitations/README.md)**
    - Execution limits (5000 statements)
    - Function call limits (75 calls)
    - API and webhook quotas
    - Data size restrictions
    - Language constraints
    - Performance considerations

## Quick Start Example

```javascript
// Fetch a record from CRM
leadInfo = zoho.crm.getRecordById("Leads", leadId);

// Extract and manipulate data
leadName = leadInfo.get("Last_Name");
leadEmail = leadInfo.get("Email");

// Conditional logic
if(leadEmail != null && leadEmail.contains("@"))
{
    // Send email notification
    sendmail
    [
        from: zoho.adminuserid
        to: leadEmail
        subject: "Welcome " + leadName
        message: "Thank you for your interest!"
    ]
}
else
{
    // Log error
    info "Invalid email for lead: " + leadName;
}
```

## Important Notes

- **Dynamic Typing**: Variables don't require type declaration
- **Local Scope**: All variables are local to their script
- **Case Sensitive**: Variable names and keywords are case-sensitive
- **Zero-Based Indexing**: Lists use 0-based indexing
- **No While Loops**: Use for-each loops instead
- **40-Second Timeout**: API calls timeout after 40 seconds

## Official Resources

- [Zoho Deluge Official Documentation](https://www.zoho.com/deluge/help/)
- [Deluge Functions Reference](https://deluge.zoho.com/help/)
- [Zoho Developer Portal](https://www.zoho.com/developer/)
- [Deluge Resources & Tutorials](https://www.zoho.com/deluge/resources.html)

## Use Cases

Deluge is used across all Zoho products for:

- Workflow automation
- Custom business logic
- Data validation and transformation
- Third-party API integration
- Custom functions and triggers
- Email automation
- Report generation
- Record manipulation
- Field calculations
- Approval processes

## Version Information

This documentation is current as of **January 2025** and covers Deluge as implemented across Zoho Creator, CRM, and other Zoho services. Some features may vary by product.

---

**Note**: This is a community-maintained reference guide. Always refer to the [official Zoho Deluge documentation](https://www.zoho.com/deluge/help/) for the most up-to-date information.
