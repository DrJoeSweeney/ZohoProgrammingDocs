# Deluge Language Basics

This guide covers the fundamental concepts of Deluge scripting including syntax, variables, comments, and code structure.

## Table of Contents

- [Syntax Overview](#syntax-overview)
- [Variables](#variables)
- [Comments](#comments)
- [Code Structure](#code-structure)
- [Naming Conventions](#naming-conventions)
- [Scope](#scope)
- [Best Practices](#best-practices)

## Syntax Overview

Deluge features a clean, natural syntax designed for readability. The language is:

- **Dynamically Typed**: No need to declare variable types
- **Case Sensitive**: `myVar` and `MyVar` are different variables
- **Whitespace Friendly**: Indentation improves readability but isn't enforced
- **Statement-Based**: Each operation is a statement
- **No Semicolons Required**: Line breaks separate statements (though semicolons are accepted)

### Basic Syntax Example

```javascript
// Simple variable assignment
companyName = "Zoho Corporation";
yearFounded = 1996;
isPublic = false;

// Conditional logic
if(yearFounded < 2000)
{
    info "Company established in the 20th century";
}

// String concatenation
message = "Welcome to " + companyName;
```

## Variables

### Declaration and Assignment

Deluge uses **dynamic typing** - you don't need to declare variable types explicitly. Variables are created the moment you assign a value to them.

```javascript
// Variable declaration and assignment
productName = "Zoho Creator";
version = 5;
price = 299.99;
isActive = true;
launchDate = '01-Jan-2006';
```

### Dynamic Typing

Variables can hold any data type, and you can reassign them to different types:

```javascript
data = "Hello World";  // String
data = 42;            // Now a number
data = true;          // Now a boolean
data = {"key": "value"};  // Now a map
```

### Variable Assignment Timing

Variables should be assigned either:
1. **At the top of the script** - if used widely throughout the code
2. **Close to where they're used** - for better readability and maintenance

```javascript
// Good: Declare at top for wide usage
taxRate = 0.1;
discountPercent = 15;

// Calculate order total
subtotal = itemPrice * quantity;
discount = subtotal * (discountPercent / 100);
tax = subtotal * taxRate;
total = subtotal - discount + tax;
```

## Comments

Comments help document your code and are ignored during execution.

### Single-Line Comments

Use `//` for single-line comments:

```javascript
// This is a single-line comment
productName = "Zoho CRM";  // Comment after code
```

### Multi-Line Comments

Use `/* */` for multi-line comments:

```javascript
/*
This is a multi-line comment
that spans multiple lines.
Useful for longer explanations.
*/
```

### Documentation Comments

```javascript
/*
Function: calculateDiscount
Purpose: Calculate discount amount based on order value
Parameters: orderTotal (decimal), customerType (text)
Returns: Discount amount as decimal
*/
```

## Code Structure

### Basic Script Structure

```javascript
// 1. Variable initialization
customerName = "John Smith";
orderAmount = 1500;
customerType = "Premium";

// 2. Data processing
discount = 0;
if(customerType == "Premium")
{
    discount = orderAmount * 0.15;
}
else if(customerType == "Regular")
{
    discount = orderAmount * 0.05;
}

// 3. Output or action
finalAmount = orderAmount - discount;
info "Final amount for " + customerName + ": $" + finalAmount;
```

### Block Structure

Code blocks use curly braces `{ }`:

```javascript
if(condition)
{
    // Code block
    statement1;
    statement2;
}
```

### Indentation

While not enforced, consistent indentation improves readability:

```javascript
// Good indentation
if(status == "Active")
{
    if(balance > 0)
    {
        processPayment();
        sendReceipt();
    }
}

// Poor indentation (works but hard to read)
if(status == "Active")
{
if(balance > 0)
{
processPayment();
sendReceipt();
}
}
```

## Naming Conventions

### Variable Naming Rules

Variable names must follow these rules:

1. **Start with**: Letters (a-z, A-Z) or underscore (_)
2. **Contain**: Letters, numbers (0-9), underscores
3. **Cannot contain**: Spaces (use underscores instead)
4. **Case sensitive**: `userName` ≠ `username` ≠ `UserName`
5. **Cannot be reserved keywords**: `true`, `false`, `null`, `void`, `return`

### Valid Variable Names

```javascript
// Valid names
firstName = "John";
last_name = "Smith";
age2 = 30;
_privateVar = "hidden";
totalAmount = 1000;
Total_Amount_USD = 1000;
```

### Invalid Variable Names

```javascript
// Invalid names
2ndPlace = "Silver";        // Cannot start with number
first-name = "John";        // Hyphens not allowed
first name = "John";        // Spaces not allowed
true = "yes";              // Reserved keyword
class = "A";               // Reserved keyword
```

### Recommended Naming Styles

**CamelCase** (recommended for variables):
```javascript
firstName = "John";
totalOrderAmount = 1500;
isActiveCustomer = true;
```

**Snake_case** (also acceptable):
```javascript
first_name = "John";
total_order_amount = 1500;
is_active_customer = true;
```

**Descriptive Names** (best practice):
```javascript
// Good: Clear and descriptive
customerEmailAddress = "john@example.com";
monthlySubscriptionFee = 49.99;
hasCompletedOnboarding = true;

// Poor: Cryptic abbreviations
custEmail = "john@example.com";
mthSubFee = 49.99;
hasOnb = true;
```

## Scope

### Local Scope Only

**Important**: All variables in Deluge have **local scope** only. Variables can only be used within the script where they are declared.

```javascript
// Script 1
userName = "John Smith";
// userName is only available in this script
```

```javascript
// Script 2
// Cannot access userName from Script 1
// Must redeclare or pass as parameter
```

### No Global Variables

Unlike many programming languages, Deluge does not support global variables. Each script maintains its own variable namespace.

### Workarounds for Shared Data

To share data between scripts:

1. **Pass as function parameters**
```javascript
// Custom function
void processOrder(string customerName, decimal amount)
{
    // Process logic here
}

// Call from another script
processOrder("John Smith", 1500);
```

2. **Use Zoho CRM fields or variables**
```javascript
// Store in a CRM field
update_record = {"Custom_Field": "shared_value"};
zoho.crm.updateRecord("Leads", recordId, update_record);

// Retrieve in another script
record = zoho.crm.getRecordById("Leads", recordId);
sharedValue = record.get("Custom_Field");
```

3. **Use application variables** (in some Zoho products)
```javascript
// Application-level settings or constants
```

## Best Practices

### 1. Use Descriptive Variable Names

```javascript
// Good
customerLifetimeValue = 15000;
nextRenewalDate = '01-Jan-2025';

// Bad
clv = 15000;
nrd = '01-Jan-2025';
```

### 2. Initialize Variables Early

```javascript
// Initialize constants and config at the top
apiEndpoint = "https://api.example.com/v1";
maxRetries = 3;
timeoutSeconds = 30;

// Then use them in logic
response = invokeurl
[
    url: apiEndpoint + "/customers"
    type: GET
];
```

### 3. Group Related Variables

```javascript
// Customer information
customerName = "John Smith";
customerEmail = "john@example.com";
customerPhone = "+1-555-0123";

// Order information
orderNumber = "ORD-12345";
orderDate = today;
orderTotal = 1500;
```

### 4. Use Constants for Fixed Values

```javascript
// Define at top of script
TAX_RATE = 0.08;
SHIPPING_FEE = 15.99;
FREE_SHIPPING_THRESHOLD = 100;

// Use in calculations
if(orderSubtotal >= FREE_SHIPPING_THRESHOLD)
{
    shippingCost = 0;
}
else
{
    shippingCost = SHIPPING_FEE;
}
```

### 5. Comment Complex Logic

```javascript
// Calculate prorated refund for early cancellation
// Formula: (months_remaining / total_months) * annual_fee
monthsRemaining = 12 - monthsElapsed;
refundPercent = monthsRemaining / 12;
refundAmount = annualFee * refundPercent;
```

### 6. Keep Scripts Focused

Each script should have a single, clear purpose:

```javascript
// Good: Focused script for email validation
emailAddress = input.Email;

if(emailAddress.contains("@") && emailAddress.contains("."))
{
    isValid = true;
}
else
{
    isValid = false;
    alert "Please enter a valid email address";
}
```

### 7. Handle Null Values

```javascript
// Always check for null before operations
leadEmail = leadRecord.get("Email");

if(leadEmail != null && leadEmail != "")
{
    // Safe to use email
    sendWelcomeEmail(leadEmail);
}
else
{
    info "No email address found for lead";
}
```

### 8. Use Meaningful Boolean Names

```javascript
// Good: Clear intent
isEligibleForDiscount = true;
hasActiveSubscription = false;
canEditRecord = true;

// Bad: Unclear meaning
flag1 = true;
check = false;
ok = true;
```

## Reserved Keywords

The following keywords are reserved and cannot be used as variable names:

- `true`
- `false`
- `null`
- `void`
- `return`
- `if`
- `else`
- `for`
- `break`
- `continue`
- `try`
- `catch`
- `throw`

## Code Examples

### Complete Script Example

```javascript
/*
Lead Qualification Script
Purpose: Qualify leads based on company size and budget
Author: Sales Team
Last Updated: 2025-01-15
*/

// Get lead information
leadId = input.LeadId;
leadInfo = zoho.crm.getRecordById("Leads", leadId);

// Extract relevant fields
companyName = leadInfo.get("Company");
employeeCount = leadInfo.get("No_of_Employees");
annualRevenue = leadInfo.get("Annual_Revenue");
leadSource = leadInfo.get("Lead_Source");

// Define qualification criteria
minEmployees = 50;
minRevenue = 100000;

// Initialize qualification result
isQualified = false;
qualificationScore = 0;

// Score based on company size
if(employeeCount >= minEmployees)
{
    qualificationScore = qualificationScore + 30;
}

// Score based on revenue
if(annualRevenue >= minRevenue)
{
    qualificationScore = qualificationScore + 40;
}

// Bonus for referral source
if(leadSource == "Referral")
{
    qualificationScore = qualificationScore + 30;
}

// Determine qualification
if(qualificationScore >= 70)
{
    isQualified = true;
    leadStatus = "Qualified";
}
else
{
    isQualified = false;
    leadStatus = "Unqualified";
}

// Update lead record
updateMap = Map();
updateMap.put("Lead_Status", leadStatus);
updateMap.put("Qualification_Score", qualificationScore);

zoho.crm.updateRecord("Leads", leadId, updateMap);

// Notify sales team if qualified
if(isQualified)
{
    sendmail
    [
        from: zoho.adminuserid
        to: "sales@company.com"
        subject: "New Qualified Lead: " + companyName
        message: "A new qualified lead has been identified with score: " + qualificationScore
    ]
}

info "Lead qualification completed. Status: " + leadStatus;
```

## Summary

- Deluge uses **dynamic typing** - no type declarations needed
- Variables have **local scope** only
- Use **descriptive names** following naming conventions
- **Case sensitive** - be consistent with capitalization
- **Comments** document your code
- Follow **best practices** for maintainable code
- Variables cannot use **reserved keywords**
- Initialize variables **early** and **close to usage**

## Additional Resources

- [Data Types](../data-types/README.md) - Learn about available data types
- [Operators](../operators/README.md) - Arithmetic, logical, and comparison operators
- [Control Structures](../control-structures/README.md) - If/else and loops
- [Functions](../functions/README.md) - Built-in and custom functions

## References

- [Zoho Deluge Variables Documentation](https://www.zoho.com/deluge/help/variables.html)
- [Zoho Deluge Declare Variable](https://www.zoho.com/deluge/help/misc-statements/set-variable/declare-variable.html)
