# Deluge Control Structures

Control structures direct the flow of program execution based on conditions and enable iteration through data. This guide covers all control flow mechanisms in Deluge.

## Table of Contents

- [Overview](#overview)
- [If Statement](#if-statement)
- [Else If Statement](#else-if-statement)
- [Else Statement](#else-statement)
- [Conditional If (Ternary)](#conditional-if-ternary)
- [ifNull Operator](#ifnull-operator)
- [For Each Loop](#for-each-loop)
- [Break Statement](#break-statement)
- [Continue Statement](#continue-statement)
- [Loop Alternatives](#loop-alternatives)
- [Best Practices](#best-practices)

## Overview

Conditional statements examine specified criteria and execute different code paths based on whether conditions are met or not.

### Available Control Structures

**Conditional Statements**:
- `if` - Execute code when condition is true
- `else if` - Alternative condition
- `else` - Execute when all conditions are false
- Conditional if (ternary operator)
- `ifNull` - Handle null values

**Loop Statements**:
- `for each` - Iterate through collections
- `break` - Exit loop early
- `continue` - Skip to next iteration

**Important Note**: Deluge **does not support**:
- Traditional `for` loops with counter
- `while` loops
- `do-while` loops

## If Statement

Executes a block of code when a condition evaluates to `true`.

### Syntax

```javascript
if(<criteria>)
{
    // Code to execute if criteria is true
}
```

### Basic Examples

```javascript
// Simple condition
age = 25;
if(age >= 18)
{
    info "You are an adult";
}

// With comparison operator
status = "Active";
if(status == "Active")
{
    info "Account is active";
}

// With logical operators
balance = 1000;
isVIP = true;
if(balance > 500 && isVIP == true)
{
    info "Eligible for premium features";
}

// Null check
email = leadRecord.get("Email");
if(email != null && email != "")
{
    sendWelcomeEmail(email);
}
```

### Practical Examples

```javascript
// Lead qualification
annualRevenue = 500000;
employeeCount = 75;

if(annualRevenue > 100000 && employeeCount >= 50)
{
    leadStatus = "Qualified";
    assignedTo = "Senior Sales Rep";

    // Send notification
    sendmail
    [
        from: zoho.adminuserid
        to: "sales@company.com"
        subject: "New Qualified Lead"
        message: "A high-value lead has been identified"
    ]
}

// Discount application
orderTotal = 1500;
customerType = "Premium";

if(orderTotal >= 1000 && customerType == "Premium")
{
    discountPercent = 15;
    discount = orderTotal * (discountPercent / 100);
    finalAmount = orderTotal - discount;

    info "Discount applied: $" + discount;
}

// Date-based logic
appointmentDate = '20-Jan-2025';
currentDate = today;

if(appointmentDate < currentDate)
{
    appointmentStatus = "Overdue";
    sendReminder = true;
}
```

## Else If Statement

Provides an alternative condition when the previous `if` or `else if` is false.

### Syntax

```javascript
if(<criteria1>)
{
    // Code if criteria1 is true
}
else if(<criteria2>)
{
    // Code if criteria1 is false and criteria2 is true
}
```

### Examples

```javascript
// Grade assignment
score = 85;

if(score >= 90)
{
    grade = "A";
}
else if(score >= 80)
{
    grade = "B";
}
else if(score >= 70)
{
    grade = "C";
}
else if(score >= 60)
{
    grade = "D";
}

// Customer tier
totalPurchases = 5000;

if(totalPurchases >= 10000)
{
    tier = "Platinum";
    discountRate = 0.20;
}
else if(totalPurchases >= 5000)
{
    tier = "Gold";
    discountRate = 0.15;
}
else if(totalPurchases >= 1000)
{
    tier = "Silver";
    discountRate = 0.10;
}
else if(totalPurchases > 0)
{
    tier = "Bronze";
    discountRate = 0.05;
}

// Order status handling
orderStatus = "Shipped";

if(orderStatus == "Pending")
{
    message = "Your order is being processed";
    allowCancellation = true;
}
else if(orderStatus == "Processing")
{
    message = "Your order is being prepared";
    allowCancellation = true;
}
else if(orderStatus == "Shipped")
{
    message = "Your order is on the way";
    allowCancellation = false;
    trackingAvailable = true;
}
else if(orderStatus == "Delivered")
{
    message = "Your order has been delivered";
    allowCancellation = false;
    allowReturn = true;
}
```

### Multiple Else If Statements

```javascript
// Day of week logic
dayOfWeek = today.getDay();  // 1=Sunday, 2=Monday, etc.

if(dayOfWeek == 1)
{
    dayName = "Sunday";
    isWeekend = true;
}
else if(dayOfWeek == 2)
{
    dayName = "Monday";
    isWeekend = false;
}
else if(dayOfWeek == 3)
{
    dayName = "Tuesday";
    isWeekend = false;
}
else if(dayOfWeek == 4)
{
    dayName = "Wednesday";
    isWeekend = false;
}
else if(dayOfWeek == 5)
{
    dayName = "Thursday";
    isWeekend = false;
}
else if(dayOfWeek == 6)
{
    dayName = "Friday";
    isWeekend = false;
}
else if(dayOfWeek == 7)
{
    dayName = "Saturday";
    isWeekend = true;
}
```

## Else Statement

Executes when all previous `if` and `else if` conditions are false. Must be the **last** statement in a conditional block.

### Syntax

```javascript
if(<criteria1>)
{
    // Code if criteria1 is true
}
else if(<criteria2>)
{
    // Code if criteria2 is true
}
else
{
    // Code if all previous conditions are false
}
```

### Examples

```javascript
// Age category
age = 70;

if(age < 13)
{
    category = "Child";
}
else if(age < 20)
{
    category = "Teenager";
}
else if(age < 65)
{
    category = "Adult";
}
else
{
    category = "Senior";
}

// Temperature alert
temperature = 105;

if(temperature < 60)
{
    alert = "Too Cold";
    color = "Blue";
}
else if(temperature >= 60 && temperature <= 80)
{
    alert = "Comfortable";
    color = "Green";
}
else if(temperature > 80 && temperature <= 95)
{
    alert = "Warm";
    color = "Yellow";
}
else
{
    alert = "Too Hot";
    color = "Red";
}

// Default handling
paymentMethod = "Bitcoin";

if(paymentMethod == "Credit Card")
{
    processor = "Stripe";
}
else if(paymentMethod == "PayPal")
{
    processor = "PayPal API";
}
else if(paymentMethod == "Bank Transfer")
{
    processor = "ACH Network";
}
else
{
    // Default case
    processor = "Manual Processing";
    requiresReview = true;
    info "Unsupported payment method: " + paymentMethod;
}
```

### Complete If-Else If-Else Example

```javascript
// Loan approval logic
creditScore = 720;
income = 75000;
debtToIncomeRatio = 0.30;

if(creditScore >= 750 && income >= 80000 && debtToIncomeRatio < 0.35)
{
    // Excellent candidate
    loanStatus = "Approved";
    interestRate = 3.5;
    loanAmount = 500000;
    approvalMessage = "Congratulations! You qualify for our best rates.";
}
else if(creditScore >= 700 && income >= 60000 && debtToIncomeRatio < 0.40)
{
    // Good candidate
    loanStatus = "Approved";
    interestRate = 4.25;
    loanAmount = 350000;
    approvalMessage = "Your loan has been approved.";
}
else if(creditScore >= 650 && income >= 50000 && debtToIncomeRatio < 0.45)
{
    // Fair candidate
    loanStatus = "Conditional Approval";
    interestRate = 5.5;
    loanAmount = 250000;
    approvalMessage = "Approval pending additional documentation.";
    requiresReview = true;
}
else
{
    // Does not qualify
    loanStatus = "Denied";
    interestRate = 0;
    loanAmount = 0;
    approvalMessage = "We're unable to approve your loan at this time.";

    // Provide feedback
    reasons = {};
    if(creditScore < 650)
    {
        reasons.add("Credit score below minimum");
    }
    if(income < 50000)
    {
        reasons.add("Income below minimum threshold");
    }
    if(debtToIncomeRatio >= 0.45)
    {
        reasons.add("Debt-to-income ratio too high");
    }
}
```

## Conditional If (Ternary)

A shorthand conditional that returns one of two values based on a condition. Useful for simple assignments.

### Syntax

```javascript
result = <condition> ? <value_if_true> : <value_if_false>;
```

**Note**: The exact syntax may vary in Deluge. Check official documentation for your specific Zoho product.

### Examples

```javascript
// Simple conditional assignment
age = 20;
status = (age >= 18) ? "Adult" : "Minor";

// Discount calculation
orderAmount = 150;
discount = (orderAmount >= 100) ? 10 : 0;

// Message selection
hasStock = true;
message = hasStock ? "In Stock" : "Out of Stock";

// Price display
isVIP = true;
price = isVIP ? 79.99 : 99.99;
```

### Use Cases

```javascript
// Set default values
finalAmount = (discount != null) ? orderAmount - discount : orderAmount;

// Display formatting
count = 1;
label = (count == 1) ? "item" : "items";
displayText = count + " " + label;

// Status badge
isActive = true;
badgeColor = isActive ? "green" : "red";
badgeText = isActive ? "Active" : "Inactive";

// Permission check
hasPermission = false;
actionText = hasPermission ? "Edit" : "View";
```

## ifNull Operator

Returns a default value when the first expression evaluates to `null`.

### Syntax

```javascript
result = ifNull(<expression1>, <expression2>);
```

If `expression1` is `null`, returns `expression2`. Otherwise, returns `expression1`.

### Examples

```javascript
// Simple default value
middleName = ifNull(inputMiddleName, "");

// CRM field with default
leadEmail = leadRecord.get("Email");
email = ifNull(leadEmail, "no-email@example.com");

// Nested ifNull
workEmail = leadRecord.get("Work_Email");
personalEmail = leadRecord.get("Personal_Email");
contactEmail = ifNull(workEmail, ifNull(personalEmail, "noemail@example.com"));

// Numeric defaults
discount = ifNull(memberDiscount, 0);
finalPrice = price - discount;

// Optional field handling
companyName = ifNull(input.Company, "Individual");
phoneNumber = ifNull(input.Phone, "Not Provided");
```

### Practical Examples

```javascript
// User profile with defaults
userProfile = zoho.crm.getRecordById("Contacts", contactId);

displayName = ifNull(userProfile.get("Nickname"), userProfile.get("Full_Name"));
bio = ifNull(userProfile.get("Bio"), "No bio provided");
avatar = ifNull(userProfile.get("Avatar_URL"), "https://example.com/default-avatar.png");

// Configuration with fallbacks
appConfig = getConfiguration();
maxRetries = ifNull(appConfig.get("max_retries"), 3);
timeout = ifNull(appConfig.get("timeout"), 30);
apiEndpoint = ifNull(appConfig.get("api_endpoint"), "https://api.default.com");

// Form processing
formData = input.FormData;
firstName = ifNull(formData.get("first_name"), "");
lastName = ifNull(formData.get("last_name"), "");
company = ifNull(formData.get("company"), "Not Specified");
```

## For Each Loop

Iterates through elements in a collection (List, Map, or Collection).

### Syntax

```javascript
for each <variable> in <collection>
{
    // Code to execute for each element
}
```

### List Iteration

```javascript
// Simple list iteration
products = {"Zoho CRM", "Zoho Creator", "Zoho Books"};

for each product in products
{
    info "Product: " + product;
}

// Processing list items
prices = {29.99, 49.99, 99.99};
total = 0;

for each price in prices
{
    total = total + price;
}
info "Total: $" + total;

// Conditional processing in loop
orderQuantities = {5, 15, 30, 50};

for each quantity in orderQuantities
{
    if(quantity >= 20)
    {
        discount = 0.10;
    }
    else
    {
        discount = 0;
    }

    info "Quantity: " + quantity + ", Discount: " + (discount * 100) + "%";
}
```

### Map Iteration

```javascript
// Iterate through map keys
customer = {"Name": "John Smith", "Email": "john@example.com", "Phone": "555-1234"};

for each key in customer.keys()
{
    value = customer.get(key);
    info key + ": " + value;
}

// Process map values
productPrices = {"Widget A": 29.99, "Widget B": 49.99, "Widget C": 79.99};
totalValue = 0;

for each productName in productPrices.keys()
{
    price = productPrices.get(productName);
    totalValue = totalValue + price;
    info productName + " costs $" + price;
}

info "Total inventory value: $" + totalValue;
```

### CRM Records Iteration

```javascript
// Fetch and iterate through CRM records
leads = zoho.crm.getRecords("Leads", 1, 200);

for each lead in leads
{
    leadName = lead.get("Last_Name");
    leadEmail = lead.get("Email");
    leadStatus = lead.get("Lead_Status");

    info "Processing lead: " + leadName;

    // Conditional processing
    if(leadStatus == "Qualified")
    {
        // Convert to opportunity
        info "Converting qualified lead: " + leadName;
    }
}

// Update multiple records
accounts = zoho.crm.getRecords("Accounts", 1, 100);

for each account in accounts
{
    accountId = account.get("id");
    lastContactDate = account.get("Last_Contact_Date");

    // Check if contact is overdue
    if(lastContactDate != null)
    {
        daysSinceContact = (today - lastContactDate).days();

        if(daysSinceContact > 90)
        {
            updateMap = {"Status": "Needs Attention", "Follow_Up_Required": true};
            zoho.crm.updateRecord("Accounts", accountId, updateMap);
        }
    }
}
```

### Nested Loops

```javascript
// Process categories and products
categories = {"Electronics", "Clothing", "Books"};

for each category in categories
{
    info "Category: " + category;

    // Get products in this category
    products = getProductsByCategory(category);

    for each product in products
    {
        productName = product.get("Name");
        productPrice = product.get("Price");

        info "  - " + productName + ": $" + productPrice;
    }
}

// Matrix operations
rows = {1, 2, 3};
cols = {1, 2, 3};

for each row in rows
{
    for each col in cols
    {
        product = row * col;
        info row + " x " + col + " = " + product;
    }
}
```

## Break Statement

Exits a `for each` loop immediately, skipping remaining iterations.

### Syntax

```javascript
for each <variable> in <collection>
{
    if(<condition>)
    {
        break;
    }
}
```

### Examples

```javascript
// Find first match
products = {"Apple", "Banana", "Orange", "Grape"};
searchTerm = "Orange";
found = false;

for each product in products
{
    if(product == searchTerm)
    {
        found = true;
        info "Found: " + product;
        break;  // Stop searching
    }
}

// Limit processing
leads = zoho.crm.getRecords("Leads", 1, 200);
processedCount = 0;
maxToProcess = 50;

for each lead in leads
{
    if(processedCount >= maxToProcess)
    {
        break;  // Stop after processing 50
    }

    // Process lead
    processLead(lead);
    processedCount = processedCount + 1;
}

// Error condition
orderItems = getOrderItems(orderId);
hasError = false;

for each item in orderItems
{
    stockLevel = item.get("Stock_Level");
    quantity = item.get("Quantity");

    if(stockLevel < quantity)
    {
        info "Insufficient stock for: " + item.get("Name");
        hasError = true;
        break;  // Stop processing on first error
    }
}

if(!hasError)
{
    confirmOrder();
}
```

### Break with Conditions

```javascript
// Find qualifying lead
leads = zoho.crm.getRecords("Leads", 1, 200);
qualifiedLead = null;

for each lead in leads
{
    revenue = lead.get("Annual_Revenue");
    employees = lead.get("No_of_Employees");

    // Check qualification criteria
    if(revenue >= 1000000 && employees >= 100)
    {
        qualifiedLead = lead;
        info "Found qualified lead: " + lead.get("Company");
        break;  // Stop at first qualified lead
    }
}

if(qualifiedLead != null)
{
    assignToSalesTeam(qualifiedLead);
}
```

## Continue Statement

Skips the rest of the current iteration and moves to the next iteration.

### Syntax

```javascript
for each <variable> in <collection>
{
    if(<condition>)
    {
        continue;
    }
    // This code is skipped when continue executes
}
```

### Examples

```javascript
// Skip certain items
products = {"Product A", "Product B", "Product C", "Product D"};

for each product in products
{
    // Skip Product B
    if(product == "Product B")
    {
        continue;
    }

    info "Processing: " + product;
    // Product B is never processed
}

// Process only valid records
leads = zoho.crm.getRecords("Leads", 1, 200);

for each lead in leads
{
    email = lead.get("Email");

    // Skip leads without email
    if(email == null || email == "")
    {
        continue;
    }

    // Only reached for leads with email
    sendEmailCampaign(email);
}

// Skip based on multiple conditions
orders = getAllOrders();

for each order in orders
{
    status = order.get("Status");
    amount = order.get("Amount");

    // Skip cancelled or low-value orders
    if(status == "Cancelled" || amount < 100)
    {
        continue;
    }

    // Process only active, high-value orders
    processOrder(order);
}
```

### Continue with Counter

```javascript
// Process with selective skipping
products = getAllProducts();
processedCount = 0;
skippedCount = 0;

for each product in products
{
    isActive = product.get("Active");
    hasStock = product.get("Stock") > 0;

    // Skip inactive or out-of-stock products
    if(!isActive || !hasStock)
    {
        skippedCount = skippedCount + 1;
        continue;
    }

    // Process active products with stock
    updateProductListing(product);
    processedCount = processedCount + 1;
}

info "Processed: " + processedCount + ", Skipped: " + skippedCount;
```

## Loop Alternatives

Since Deluge doesn't support traditional `for` and `while` loops, here are alternative patterns.

### Counter-Based Iteration (Workaround)

```javascript
// Create list of numbers to iterate
indices = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

for each i in indices
{
    info "Iteration: " + i;
    // Your code here
}

// Or use a function to generate range
numberList = {};
count = 1;
while(count <= 10)
{
    numberList.add(count);
    count = count + 1;
}

// Note: Traditional while not available, this is pseudocode
```

### Recursive Function Pattern

```javascript
// Use recursive function for while-loop behavior
void processUntilCondition(int counter, int maxCount)
{
    if(counter > maxCount)
    {
        return;
    }

    // Do work
    info "Processing iteration: " + counter;

    // Recursive call
    processUntilCondition(counter + 1, maxCount);
}

// Call the function
processUntilCondition(1, 10);
```

### Page-Based Iteration

```javascript
// Iterate through paginated API results
page = 1;
hasMore = true;
maxPages = 10;  // Safety limit

for each pageNum in {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
{
    // Fetch page of records
    records = zoho.crm.getRecords("Leads", pageNum, 200);

    // Check if we got records
    if(records.size() == 0)
    {
        break;  // No more records
    }

    // Process records
    for each record in records
    {
        processRecord(record);
    }

    // Stop if this page wasn't full
    if(records.size() < 200)
    {
        break;  // Last page
    }
}
```

## Best Practices

### 1. Use Clear Conditions

```javascript
// Good: Clear and readable
if(age >= 18 && hasLicense == true)
{
    canDrive = true;
}

// Poor: Unclear logic
if(!(age < 18) && hasLicense)
{
    canDrive = true;
}
```

### 2. Avoid Deep Nesting

```javascript
// Poor: Deep nesting
if(condition1)
{
    if(condition2)
    {
        if(condition3)
        {
            if(condition4)
            {
                // Code here
            }
        }
    }
}

// Better: Early returns or combined conditions
if(!condition1)
{
    return;
}
if(!condition2)
{
    return;
}
if(!condition3)
{
    return;
}
if(!condition4)
{
    return;
}
// Code here

// Or combine conditions
if(condition1 && condition2 && condition3 && condition4)
{
    // Code here
}
```

### 3. Use Else If for Mutually Exclusive Conditions

```javascript
// Good: Else if for exclusive conditions
if(status == "New")
{
    priority = 1;
}
else if(status == "In Progress")
{
    priority = 2;
}
else if(status == "Completed")
{
    priority = 3;
}

// Poor: Multiple ifs (all checked even after match)
if(status == "New")
{
    priority = 1;
}
if(status == "In Progress")
{
    priority = 2;
}
if(status == "Completed")
{
    priority = 3;
}
```

### 4. Check Null Before Operations

```javascript
// Good: Null check first
if(value != null && value > 0)
{
    process(value);
}

// Risky: May error if value is null
if(value > 0 && value != null)
{
    process(value);
}
```

### 5. Limit Loop Iterations

```javascript
// Good: Safety limit
records = zoho.crm.getRecords("Leads", 1, 200);
maxProcess = 100;
counter = 0;

for each record in records
{
    if(counter >= maxProcess)
    {
        break;
    }

    processRecord(record);
    counter = counter + 1;
}

// Risky: Unlimited processing
for each record in records
{
    processRecord(record);  // Could hit execution limits
}
```

### 6. Use Break and Continue Wisely

```javascript
// Good: Early exit on error
for each item in items
{
    if(item.get("Error") != null)
    {
        info "Error found, stopping";
        break;
    }
    processItem(item);
}

// Good: Skip invalid items
for each item in items
{
    if(!isValid(item))
    {
        continue;
    }
    processItem(item);
}
```

### 7. Extract Complex Conditions

```javascript
// Good: Named conditions
isQualified = (revenue > 100000 && employees >= 50 && location == "US");
hasApproval = (approvalStatus == "Approved" && approver != null);

if(isQualified && hasApproval)
{
    processApplication();
}

// Poor: Complex inline condition
if(revenue > 100000 && employees >= 50 && location == "US" && approvalStatus == "Approved" && approver != null)
{
    processApplication();
}
```

## Summary

### Control Flow Quick Reference

| Statement | Purpose | Syntax |
|-----------|---------|--------|
| `if` | Execute if true | `if(condition) { }` |
| `else if` | Alternative condition | `else if(condition) { }` |
| `else` | Default case | `else { }` |
| `for each` | Iterate collection | `for each item in list { }` |
| `break` | Exit loop | `break;` |
| `continue` | Skip iteration | `continue;` |
| `ifNull` | Default for null | `ifNull(value, default)` |

### Common Patterns

```javascript
// Simple if
if(condition)
{
    action();
}

// If-else
if(condition)
{
    actionA();
}
else
{
    actionB();
}

// Multiple conditions
if(condition1)
{
    action1();
}
else if(condition2)
{
    action2();
}
else
{
    defaultAction();
}

// Loop with break
for each item in items
{
    if(foundTarget)
    {
        break;
    }
    processItem(item);
}

// Loop with continue
for each item in items
{
    if(shouldSkip)
    {
        continue;
    }
    processItem(item);
}
```

## Additional Resources

- [Operators](../operators/README.md) - Comparison and logical operators
- [Data Types](../data-types/README.md) - Collections for iteration
- [Functions](../functions/README.md) - Functions in control flow

## References

- [Zoho Deluge Conditional Statements](https://www.zoho.com/deluge/help/conditional-statements/condition.html)
- [For Each Record](https://www.zoho.com/deluge/help/data-access/for-each-record.html)
- [Break Statement](https://www.zoho.com/deluge/help/misc-statements/break.html)
- [Continue Statement](https://www.zoho.com/deluge/help/misc-statements/continue.html)
