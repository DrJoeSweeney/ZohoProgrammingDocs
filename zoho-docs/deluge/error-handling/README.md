# Deluge Error Handling

Comprehensive guide to handling errors and exceptions in Deluge using try-catch statements and best practices for robust code.

## Table of Contents

- [Overview](#overview)
- [Try-Catch Statement](#try-catch-statement)
- [Exception Variable](#exception-variable)
- [Common Error Scenarios](#common-error-scenarios)
- [Throw Statement](#throw-statement)
- [Error Types](#error-types)
- [Best Practices](#best-practices)
- [Debugging Techniques](#debugging-techniques)

## Overview

Error handling in Deluge allows you to gracefully handle runtime errors and exceptions, preventing script crashes and enabling better user experiences.

### Key Concepts

- **Try Block**: Contains code that might throw errors
- **Catch Block**: Handles errors if they occur in try block
- **Exception Variable**: Captures error details (message, line number)
- **Throw Statement**: Manually trigger custom exceptions

## Try-Catch Statement

The try-catch mechanism tests code for runtime errors and executes fallback logic when errors occur.

### Syntax

```javascript
try
{
    // Code that might throw an error
}
catch(<exception_variable>)
{
    // Error handling code
}
```

### Basic Example

```javascript
try
{
    // Potentially problematic code
    result = 100 / quantity;
    info "Result: " + result;
}
catch(e)
{
    // Handle error
    info "An error occurred: " + e.message;
}

// Code continues executing after try-catch
info "Script continues";
```

### Key Characteristics

- If no error occurs, catch block is **skipped**
- Code after try-catch **continues executing** regardless of error
- Prevents complete script failure
- Allows graceful error recovery

## Exception Variable

The exception variable captures error information when an exception occurs.

### Exception Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `.message` | Error message text | `"Division by zero"` |
| `.lineNo` | Line number where error occurred | `15` |

### Using Exception Variable

```javascript
try
{
    // Some code that errors
    value = orderData.get("total");
    result = value * 1.08;
}
catch(error)
{
    // Access error details
    errorMessage = error.message;
    errorLine = error.lineNo;

    info "Error: " + errorMessage;
    info "Occurred at line: " + errorLine;

    // Send error report
    sendmail
    [
        from: zoho.adminuserid
        to: "support@company.com"
        subject: "Script Error"
        message: "Error: " + errorMessage + " at line " + errorLine
    ]
}
```

### Practical Error Reporting

```javascript
try
{
    // Process order
    orderQuantity = orderRecord.get("Quantity");
    if(orderQuantity == null || orderQuantity == 0)
    {
        // This will cause an error
        discount = orderTotal / orderQuantity;
    }
}
catch(e)
{
    // Detailed error logging
    errorDetails = {
        "error_message": e.message,
        "error_line": e.lineNo,
        "timestamp": now.toString("yyyy-MM-dd HH:mm:ss"),
        "record_id": orderRecord.get("id"),
        "user": zoho.loginuserid
    };

    // Log to CRM
    zoho.crm.createRecord("Error_Log", errorDetails);

    // Notify admin
    info "Error logged: " + e.message;
}
```

## Common Error Scenarios

### Division by Zero

```javascript
try
{
    quantity = 0;
    result = 100 / quantity;  // Error!
}
catch(e)
{
    info "Cannot divide by zero";
    result = 0;  // Default value
}
```

### Null Reference Errors

```javascript
try
{
    leadRecord = zoho.crm.getRecordById("Leads", leadId);
    email = leadRecord.get("Email");

    // Error if email is null
    emailLength = email.length();
}
catch(e)
{
    info "Email field is null or not found";
    email = "noemail@example.com";
}

// Better: Check null first
email = leadRecord.get("Email");
if(email != null)
{
    emailLength = email.length();
}
```

### API Call Failures

```javascript
try
{
    // API call that might fail
    response = invokeurl
    [
        url: "https://api.example.com/data"
        type: GET
        headers: {"Authorization": "Bearer " + token}
    ];

    data = response.get("data");
    processData(data);
}
catch(e)
{
    info "API call failed: " + e.message;

    // Fallback action
    if(e.message.contains("timeout"))
    {
        info "Request timed out, will retry later";
    }
    else if(e.message.contains("401") || e.message.contains("unauthorized"))
    {
        info "Authentication failed, token may be expired";
        refreshToken();
    }
    else
    {
        info "Unknown API error occurred";
    }
}
```

### Invalid Data Type Operations

```javascript
try
{
    // Attempting invalid operation
    userInput = "not a number";
    calculation = userInput * 2;  // Error!
}
catch(e)
{
    info "Invalid data type for calculation";
    info "Error: " + e.message;
}

// Better: Validate first
if(userInput.isNumber())
{
    calculation = userInput.toNumber() * 2;
}
else
{
    info "Please enter a valid number";
}
```

### List/Map Access Errors

```javascript
try
{
    // Accessing non-existent index
    items = {"Apple", "Banana", "Orange"};
    item = items.get(10);  // May error or return null

    // Accessing non-existent key
    customer = {"name": "John", "email": "john@example.com"};
    phone = customer.get("phone");  // Null, safe
    phoneLength = phone.length();  // Error! phone is null
}
catch(e)
{
    info "Error accessing collection: " + e.message;
}

// Better: Check before access
if(items.size() > 10)
{
    item = items.get(10);
}

phone = customer.get("phone");
if(phone != null)
{
    phoneLength = phone.length();
}
```

### CRM Operation Failures

```javascript
try
{
    // Create record that might fail validation
    newLead = {
        "Last_Name": leadName,
        "Company": companyName,
        "Email": email  // May fail if email format invalid
    };

    response = zoho.crm.createRecord("Leads", newLead);
    leadId = response.get("id");

    info "Lead created: " + leadId;
}
catch(e)
{
    info "Failed to create lead: " + e.message;

    // Check specific error
    if(e.message.contains("INVALID_EMAIL"))
    {
        info "Email format is invalid";
    }
    else if(e.message.contains("DUPLICATE"))
    {
        info "Lead already exists";
    }
    else if(e.message.contains("MANDATORY"))
    {
        info "Required field missing";
    }
}
```

## Throw Statement

Manually trigger exceptions with custom error messages.

### Syntax

```javascript
throw "Error message";
```

### Basic Example

```javascript
// Validate age
age = input.Age;

if(age < 18)
{
    throw "Age must be 18 or older";
}

// Continues only if age >= 18
processAdultUser(age);
```

### Throwing in Functions

```javascript
void validateEmail(string email)
{
    if(email == null || email == "")
    {
        throw "Email is required";
    }

    if(!email.contains("@"))
    {
        throw "Invalid email format";
    }

    if(!email.contains("."))
    {
        throw "Email must contain domain";
    }

    info "Email is valid";
}

// Usage
try
{
    userEmail = input.Email;
    validateEmail(userEmail);

    // Continues if validation passes
    sendWelcomeEmail(userEmail);
}
catch(e)
{
    alert "Validation Error: " + e.message;
}
```

### Business Logic Validation

```javascript
try
{
    // Validate order
    orderTotal = input.OrderTotal;
    customerType = input.CustomerType;

    if(orderTotal <= 0)
    {
        throw "Order total must be greater than zero";
    }

    if(customerType != "Regular" && customerType != "Premium")
    {
        throw "Invalid customer type: " + customerType;
    }

    // Check inventory
    stockLevel = getStockLevel(productId);
    if(stockLevel < orderQuantity)
    {
        throw "Insufficient stock. Available: " + stockLevel + ", Requested: " + orderQuantity;
    }

    // All validations passed
    processOrder(orderData);
}
catch(e)
{
    // Handle validation errors
    info "Order validation failed: " + e.message;

    // Update order status
    updateMap = {"Status": "Validation Failed", "Error_Message": e.message};
    zoho.crm.updateRecord("Orders", orderId, updateMap);

    // Notify user
    alert e.message;
}
```

### API Response Validation

```javascript
try
{
    response = invokeurl
    [
        url: "https://api.example.com/data"
        type: GET
    ];

    // Validate response
    if(response == null)
    {
        throw "API returned no data";
    }

    status = response.get("status");
    if(status != "success")
    {
        errorMsg = response.get("error");
        throw "API Error: " + errorMsg;
    }

    data = response.get("data");
    if(data == null || data.size() == 0)
    {
        throw "No data available";
    }

    // Process valid data
    processData(data);
}
catch(e)
{
    info "Data retrieval failed: " + e.message;

    // Use cached data as fallback
    data = getCachedData();
}
```

## Error Types

Common error types you might encounter in Deluge.

### Runtime Errors

```javascript
// Division by zero
try { result = 10 / 0; } catch(e) { info "Math error"; }

// Null pointer
try { len = nullValue.length(); } catch(e) { info "Null reference"; }

// Invalid type conversion
try { num = "abc".toNumber(); } catch(e) { info "Conversion error"; }
```

### API Errors

```javascript
// Timeout (40 seconds)
// Authentication failures (401)
// Not found (404)
// Server errors (500)

try
{
    response = invokeurl [url: apiUrl type: GET];
}
catch(e)
{
    if(e.message.contains("timeout") || e.message.contains("socket"))
    {
        info "Timeout error";
    }
    else if(e.message.contains("401"))
    {
        info "Authentication error";
    }
    else if(e.message.contains("404"))
    {
        info "Resource not found";
    }
    else if(e.message.contains("500"))
    {
        info "Server error";
    }
}
```

### CRM Errors

```javascript
// MANDATORY_NOT_FOUND - Required field missing
// INVALID_DATA - Data validation failed
// DUPLICATE_DATA - Duplicate record
// INVALID_MODULE - Module doesn't exist
// NO_PERMISSION - User lacks permission

try
{
    response = zoho.crm.createRecord("Leads", leadData);
}
catch(e)
{
    errorMsg = e.message;

    if(errorMsg.contains("MANDATORY"))
    {
        info "Required fields missing";
    }
    else if(errorMsg.contains("DUPLICATE"))
    {
        info "Record already exists";
    }
    else if(errorMsg.contains("PERMISSION"))
    {
        info "Insufficient permissions";
    }
}
```

## Best Practices

### 1. Always Use Try-Catch for External Operations

```javascript
// Good: Wrap API calls
try
{
    response = invokeurl [url: apiUrl type: GET];
    data = response.get("data");
}
catch(e)
{
    info "API error: " + e.message;
    data = getDefaultData();
}

// Good: Wrap CRM operations
try
{
    record = zoho.crm.createRecord("Leads", leadData);
}
catch(e)
{
    info "CRM error: " + e.message;
}
```

### 2. Provide Meaningful Error Messages

```javascript
// Good: Descriptive messages
try
{
    validateInput(data);
}
catch(e)
{
    info "Input validation failed: " + e.message;
    alert "Please check your input: " + e.message;
}

// Poor: Generic messages
try
{
    validateInput(data);
}
catch(e)
{
    info "Error";  // Not helpful!
}
```

### 3. Log Errors for Debugging

```javascript
// Good: Comprehensive error logging
try
{
    processOrder(orderData);
}
catch(e)
{
    // Log error details
    errorLog = {
        "Error_Message": e.message,
        "Error_Line": e.lineNo,
        "Timestamp": now,
        "User": zoho.loginuserid,
        "Context": "Order Processing",
        "Order_ID": orderId
    };

    zoho.crm.createRecord("Error_Log", errorLog);

    // Notify admin
    sendmail
    [
        from: zoho.adminuserid
        to: "admin@company.com"
        subject: "Order Processing Error"
        message: "Error: " + e.message + " at line " + e.lineNo
    ]
}
```

### 4. Implement Fallback Logic

```javascript
// Good: Fallback when API fails
try
{
    data = fetchFromAPI();
}
catch(e)
{
    info "API failed, using cached data";
    data = fetchFromCache();
}

// Good: Default values on error
try
{
    discount = calculateDiscount(customer);
}
catch(e)
{
    info "Discount calculation failed, using default";
    discount = 0;
}
```

### 5. Don't Silently Swallow Errors

```javascript
// Poor: Silent error
try
{
    processData(data);
}
catch(e)
{
    // Nothing! Error is hidden
}

// Good: At least log the error
try
{
    processData(data);
}
catch(e)
{
    info "Error processing data: " + e.message;
    // Take appropriate action
}
```

### 6. Validate Before Operating

```javascript
// Good: Validate first, avoid errors
email = input.Email;

if(email != null && email != "" && email.contains("@"))
{
    sendEmail(email);
}
else
{
    info "Invalid email provided";
}

// Still use try-catch as safety net
try
{
    if(email != null && email.contains("@"))
    {
        sendEmail(email);
    }
}
catch(e)
{
    info "Email send failed: " + e.message;
}
```

### 7. Specific Error Handling

```javascript
// Good: Handle different error types
try
{
    response = invokeurl [url: apiUrl type: POST parameters: data];
}
catch(e)
{
    errorMsg = e.message.toLowerCase();

    if(errorMsg.contains("timeout"))
    {
        // Retry logic
        retryAPICall(apiUrl, data);
    }
    else if(errorMsg.contains("401") || errorMsg.contains("unauthorized"))
    {
        // Refresh token
        refreshAuthToken();
    }
    else if(errorMsg.contains("rate limit"))
    {
        // Wait and retry
        info "Rate limited, will retry later";
    }
    else
    {
        // General error handling
        info "Unexpected error: " + e.message;
    }
}
```

## Debugging Techniques

### Info Statements

```javascript
info "Starting process";
info "Variable value: " + myVar;

try
{
    info "Attempting API call";
    response = invokeurl [url: apiUrl type: GET];
    info "API call successful";
    info "Response: " + response;
}
catch(e)
{
    info "API call failed";
    info "Error: " + e.message;
    info "Line: " + e.lineNo;
}
```

### Checkpoint Logging

```javascript
info "Checkpoint 1: Starting";

customerData = fetchCustomerData();
info "Checkpoint 2: Customer data fetched";

orderData = fetchOrderData();
info "Checkpoint 3: Order data fetched";

try
{
    info "Checkpoint 4: Processing order";
    result = processOrder(orderData);
    info "Checkpoint 5: Order processed successfully";
}
catch(e)
{
    info "Error at checkpoint 4: " + e.message;
}
```

### Variable Inspection

```javascript
// Log variable states
info "orderTotal = " + orderTotal;
info "customerType = " + customerType;
info "discountRate = " + discountRate;

// Log collection contents
info "items.size() = " + items.size();
for each item in items
{
    info "item: " + item;
}

// Log map contents
for each key in customerMap.keys()
{
    value = customerMap.get(key);
    info key + " = " + value;
}
```

## Summary

### Quick Reference

```javascript
// Basic try-catch
try {
    // Code that might error
} catch(e) {
    info "Error: " + e.message;
    info "Line: " + e.lineNo;
}

// Throw custom error
if(invalid) {
    throw "Validation failed";
}

// API error handling
try {
    response = invokeurl [url: apiUrl type: GET];
} catch(e) {
    info "API failed: " + e.message;
}

// CRM error handling
try {
    record = zoho.crm.createRecord("Module", data);
} catch(e) {
    info "CRM error: " + e.message;
}
```

### Error Handling Checklist

- [ ] Use try-catch for external operations
- [ ] Log error messages and line numbers
- [ ] Provide meaningful error messages
- [ ] Implement fallback logic
- [ ] Don't silently swallow errors
- [ ] Validate data before operations
- [ ] Handle specific error types
- [ ] Notify admins of critical errors

## Additional Resources

- [API Integration](../api-integration/README.md) - API error handling
- [Database Operations](../database/README.md) - CRM error handling
- [Examples](../examples/README.md) - Error handling patterns

## References

- [Zoho Deluge Try-Catch](https://www.zoho.com/deluge/help/misc-statements/try-catch.html)
- [Zoho Deluge Error Messages](https://www.zoho.com/deluge/help/error-messages.html)
