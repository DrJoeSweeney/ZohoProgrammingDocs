# Deluge Operators

Operators perform actions on values (operands). This guide covers all operator types in Deluge including arithmetic, assignment, comparison, and logical operators.

## Table of Contents

- [Overview](#overview)
- [Arithmetic Operators](#arithmetic-operators)
- [Assignment Operators](#assignment-operators)
- [Comparison (Relational) Operators](#comparison-relational-operators)
- [Logical Operators](#logical-operators)
- [String Operators](#string-operators)
- [Operator Precedence](#operator-precedence)
- [Best Practices](#best-practices)

## Overview

An **operator** represents an action that manipulates values. In the expression `3 + 2`, the `+` symbol is the operator, while `3` and `2` are operands.

**Operands can be**:
- Literal values: `5`, `"Hello"`, `true`
- Variables: `price`, `customerName`
- Zoho service fields: `input.Email`, `leadInfo.get("Status")`
- Expressions: `(a + b) * c`

### Operator Categories

Deluge provides four main operator categories:

1. **Arithmetic Operators** - Mathematical calculations
2. **Assignment Operators** - Value assignment
3. **Relational Operators** - Comparison operations
4. **Logical Operators** - Boolean logic

## Arithmetic Operators

Perform mathematical calculations on numeric values. The `+` operator also concatenates strings.

### Operators Table

| Operator | Name | Description | Example | Result |
|----------|------|-------------|---------|--------|
| `+` | Addition | Adds two numbers or concatenates strings | `5 + 3` | `8` |
| `-` | Subtraction | Subtracts second number from first | `10 - 4` | `6` |
| `*` | Multiplication | Multiplies two numbers | `6 * 7` | `42` |
| `/` | Division | Divides first number by second | `20 / 4` | `5` |
| `%` | Modulus | Returns remainder of division | `10 % 3` | `1` |

### Addition (+)

```javascript
// Numeric addition
a = 5;
b = 10;
sum = a + b;  // 15

// Decimal addition
price1 = 29.99;
price2 = 19.99;
total = price1 + price2;  // 49.98

// String concatenation
firstName = "John";
lastName = "Smith";
fullName = firstName + " " + lastName;  // "John Smith"

// Mixed string and number
age = 30;
message = "Age: " + age;  // "Age: 30"
```

### Subtraction (-)

```javascript
// Basic subtraction
total = 100;
discount = 15;
finalAmount = total - discount;  // 85

// Negative numbers
temperature = 20;
drop = 35;
newTemp = temperature - drop;  // -15

// Decimal subtraction
balance = 1000.50;
withdrawal = 250.75;
remaining = balance - withdrawal;  // 749.75
```

### Multiplication (*)

```javascript
// Basic multiplication
quantity = 5;
pricePerUnit = 10;
total = quantity * pricePerUnit;  // 50

// Decimal multiplication
rate = 0.08;
amount = 100;
tax = amount * rate;  // 8.0

// Area calculation
length = 10;
width = 5;
area = length * width;  // 50
```

### Division (/)

```javascript
// Basic division
total = 100;
parts = 4;
perPart = total / parts;  // 25

// Decimal result
numerator = 10;
denominator = 3;
result = numerator / denominator;  // 3.33333...

// Percentage calculation
score = 85;
maxScore = 100;
percentage = (score / maxScore) * 100;  // 85.0
```

**Important Notes**:
- Division by zero will cause an error
- Division always returns a decimal result
- Use rounding functions for display purposes

### Modulus (%)

Returns the remainder after division.

```javascript
// Basic modulus
a = 10;
b = 3;
remainder = a % b;  // 1 (10 ÷ 3 = 3 remainder 1)

// Check if even or odd
number = 7;
isOdd = (number % 2 == 1);  // true
isEven = (number % 2 == 0);  // false

// Cyclic operations
index = 15;
arraySize = 10;
wrappedIndex = index % arraySize;  // 5

// Time calculations
totalMinutes = 125;
hours = totalMinutes / 60;  // 2 (integer part)
minutes = totalMinutes % 60;  // 5
```

### Complex Arithmetic Expressions

```javascript
// Order of operations (PEMDAS/BODMAS)
result = 10 + 5 * 2;  // 20 (multiplication first)
result = (10 + 5) * 2;  // 30 (parentheses first)

// Multi-step calculation
subtotal = 100;
taxRate = 0.08;
discountPercent = 10;

discount = subtotal * (discountPercent / 100);  // 10
afterDiscount = subtotal - discount;  // 90
tax = afterDiscount * taxRate;  // 7.2
finalTotal = afterDiscount + tax;  // 97.2

// Compound interest calculation
principal = 1000;
rate = 0.05;
time = 3;
amount = principal * (1 + rate) * (1 + rate) * (1 + rate);  // 1157.625
```

## Assignment Operators

Assign values to variables.

### Simple Assignment

| Operator | Example | Equivalent To |
|----------|---------|---------------|
| `=` | `x = 5` | Assigns 5 to x |

```javascript
// Basic assignment
name = "John Smith";
age = 30;
isActive = true;

// Assign result of expression
total = price * quantity;
fullName = firstName + " " + lastName;

// Assign from function return
currentDate = today;
recordCount = products.size();

// Chain assignments (not recommended)
// a = b = c = 10;  // Not standard in Deluge
```

### Compound Assignment Operators

Combine arithmetic operation with assignment.

| Operator | Example | Equivalent To | Description |
|----------|---------|---------------|-------------|
| `+=` | `x += 5` | `x = x + 5` | Add and assign |
| `-=` | `x -= 3` | `x = x - 3` | Subtract and assign |
| `*=` | `x *= 2` | `x = x * 2` | Multiply and assign |
| `/=` | `x /= 4` | `x = x / 4` | Divide and assign |
| `%=` | `x %= 3` | `x = x % 3` | Modulus and assign |

```javascript
// Add and assign
counter = 10;
counter += 5;  // counter = 15

// Accumulate values
total = 0;
total += 100;  // 100
total += 50;   // 150
total += 25;   // 175

// Subtract and assign
balance = 1000;
balance -= 250;  // 750

// Multiply and assign
value = 5;
value *= 3;  // 15

// Divide and assign
amount = 100;
amount /= 4;  // 25

// String concatenation with +=
message = "Hello";
message += " ";
message += "World";  // "Hello World"

// List operations
items = {"Apple", "Banana"};
items += {"Orange"};  // May work depending on context
```

## Comparison (Relational) Operators

Compare two values and return a boolean result (`true` or `false`).

### Operators Table

| Operator | Name | Description | Example | Result |
|----------|------|-------------|---------|--------|
| `==` | Equal to | Values are equal | `5 == 5` | `true` |
| `!=` | Not equal to | Values are not equal | `5 != 3` | `true` |
| `>` | Greater than | Left > right | `10 > 5` | `true` |
| `<` | Less than | Left < right | `3 < 8` | `true` |
| `>=` | Greater than or equal | Left >= right | `5 >= 5` | `true` |
| `<=` | Less than or equal | Left <= right | `4 <= 7` | `true` |

### Equal To (==)

```javascript
// Number comparison
age = 25;
isQuarterCentury = (age == 25);  // true

// String comparison (case-sensitive)
status = "Active";
isActive = (status == "Active");  // true
isInactive = (status == "active");  // false (case matters!)

// Boolean comparison
hasPermission = true;
canAccess = (hasPermission == true);  // true

// Date comparison
appointmentDate = '15-Jan-2025';
isToday = (appointmentDate == today);
```

### Not Equal To (!=)

```javascript
// Number comparison
quantity = 10;
isNotZero = (quantity != 0);  // true

// String comparison
status = "Pending";
isNotComplete = (status != "Completed");  // true

// Null check
email = leadRecord.get("Email");
hasEmail = (email != null);
```

### Greater Than (>)

```javascript
// Number comparison
score = 85;
isPassing = (score > 70);  // true

// Date comparison
dueDate = '31-Dec-2025';
isOverdue = (today > dueDate);

// Decimal comparison
balance = 1000.50;
hasMinimum = (balance > 1000);  // true
```

### Less Than (<)

```javascript
// Number comparison
age = 16;
isMinor = (age < 18);  // true

// Price comparison
price = 49.99;
isAffordable = (price < 50);  // true

// Date comparison
startDate = '01-Jan-2025';
hasStarted = (today < startDate);  // false if today is after
```

### Greater Than or Equal To (>=)

```javascript
// Number comparison
age = 18;
canVote = (age >= 18);  // true

// Minimum threshold
orderAmount = 100;
qualifiesForFreeShipping = (orderAmount >= 100);  // true

// Grade calculation
score = 90;
isAGrade = (score >= 90);  // true
```

### Less Than or Equal To (<=)

```javascript
// Number comparison
temperature = 32;
isFreezing = (temperature <= 32);  // true

// Maximum limit
fileSize = 5000000;  // 5 MB
isWithinLimit = (fileSize <= 5000000);  // true

// Range check
age = 65;
isSenior = (age >= 60 && age <= 120);  // true
```

### Comparison Examples

```javascript
// Range validation
age = 25;
isValidAge = (age >= 18 && age <= 100);

// Multiple conditions
price = 99.99;
quantity = 5;
canProceed = (price > 0 && quantity > 0);

// Status checking
orderStatus = "Shipped";
needsAction = (orderStatus != "Delivered" && orderStatus != "Cancelled");

// Date range
startDate = '01-Jan-2025';
endDate = '31-Dec-2025';
currentDate = today;
isWithinRange = (currentDate >= startDate && currentDate <= endDate);
```

## Logical Operators

Combine multiple conditions and return boolean results.

### Operators Table

| Operator | Name | Description | Example | Result |
|----------|------|-------------|---------|--------|
| `&&` | AND | True if both conditions are true | `true && true` | `true` |
| `\|\|` | OR | True if at least one condition is true | `true \|\| false` | `true` |
| `!` | NOT | Inverts boolean value | `!true` | `false` |

### AND Operator (&&)

Both conditions must be `true` for the result to be `true`.

**Truth Table**:
| Condition 1 | Condition 2 | Result |
|-------------|-------------|--------|
| true | true | true |
| true | false | false |
| false | true | false |
| false | false | false |

```javascript
// Basic AND
age = 25;
hasLicense = true;
canDrive = (age >= 18 && hasLicense == true);  // true

// Multiple conditions
isActive = true;
hasStock = true;
inStock = (isActive && hasStock);  // true

// Null and value check
email = "user@example.com";
isValidEmail = (email != null && email != "" && email.contains("@"));

// Range validation
score = 85;
isPassingGrade = (score >= 70 && score <= 100);  // true

// Complex validation
orderAmount = 150;
isVIP = true;
location = "US";
qualifiesForPromo = (orderAmount >= 100 && isVIP == true && location == "US");  // true
```

### OR Operator (||)

At least one condition must be `true` for the result to be `true`.

**Truth Table**:
| Condition 1 | Condition 2 | Result |
|-------------|-------------|--------|
| true | true | true |
| true | false | true |
| false | true | true |
| false | false | false |

```javascript
// Basic OR
isWeekend = (day == "Saturday" || day == "Sunday");

// Multiple status checks
status = "Shipped";
isInTransit = (status == "Processing" || status == "Shipped" || status == "Out for Delivery");

// Alternative conditions
hasEmail = false;
hasPhone = true;
canContact = (hasEmail || hasPhone);  // true

// Payment methods
paymentMethod = "Credit Card";
acceptsCard = (paymentMethod == "Credit Card" || paymentMethod == "Debit Card");  // true

// Emergency conditions
temperature = 105;
pressure = 80;
isEmergency = (temperature > 100 || pressure > 140 || pressure < 60);  // true
```

### NOT Operator (!)

Inverts/negates a boolean value.

```javascript
// Basic NOT
isActive = true;
isInactive = !isActive;  // false

// Negate condition
age = 16;
isNotAdult = !(age >= 18);  // true

// Complex negation
hasPermission = false;
isDenied = !hasPermission;  // true

// Double negative (not recommended)
isEnabled = true;
result = !!isEnabled;  // true (but confusing)

// Useful patterns
isEmpty = false;
hasContent = !isEmpty;  // true

status = "Active";
isNotActive = !(status == "Active");  // false
```

### Combining Logical Operators

```javascript
// AND + OR
age = 25;
country = "US";
hasLicense = true;
canRentCar = ((age >= 21 && country == "US") || (age >= 25 && country != "US")) && hasLicense;

// Complex validation
price = 99.99;
quantity = 5;
inStock = true;
isVIP = false;
canPurchase = (price > 0 && quantity > 0 && inStock) || isVIP;

// Multiple conditions with NOT
status = "Pending";
isExpired = false;
needsReview = (status != "Approved" && status != "Rejected" && !isExpired);

// Parentheses for clarity
result = (a && b) || (c && d);  // Clear grouping
result = a && b || c && d;      // Same but less clear
```

### Short-Circuit Evaluation

Logical operators use short-circuit evaluation:
- **AND (&&)**: If first condition is `false`, second is not evaluated
- **OR (||)**: If first condition is `true`, second is not evaluated

```javascript
// AND short-circuit
value = null;
// Second condition not evaluated if first is false
if(value != null && value.length() > 0)  // Safe!
{
    // Process value
}

// OR short-circuit
hasEmail = true;
// Second condition not evaluated if first is true
if(hasEmail || hasPhone)  // Efficient!
{
    sendNotification();
}
```

## String Operators

### Concatenation (+)

The `+` operator joins strings together.

```javascript
// Basic concatenation
firstName = "John";
lastName = "Smith";
fullName = firstName + " " + lastName;  // "John Smith"

// Multiple strings
greeting = "Hello" + ", " + "World" + "!";  // "Hello, World!"

// String and number
age = 30;
message = "Age: " + age;  // "Age: 30"

// Building messages
customerName = "John";
orderNumber = "12345";
notification = "Dear " + customerName + ", your order #" + orderNumber + " has shipped.";

// Multi-line building
address = "";
address = address + "123 Main St" + "\n";
address = address + "Suite 456" + "\n";
address = address + "San Francisco, CA 94102";

// Accumulating with +=
html = "<html>";
html += "<body>";
html += "<h1>Welcome</h1>";
html += "</body>";
html += "</html>";
```

## Operator Precedence

When multiple operators appear in an expression, they are evaluated in a specific order.

### Precedence Order (Highest to Lowest)

1. **Parentheses** - `()`
2. **NOT** - `!`
3. **Multiplication, Division, Modulus** - `*`, `/`, `%`
4. **Addition, Subtraction** - `+`, `-`
5. **Comparison** - `<`, `>`, `<=`, `>=`
6. **Equality** - `==`, `!=`
7. **AND** - `&&`
8. **OR** - `||`
9. **Assignment** - `=`, `+=`, `-=`, etc.

### Precedence Examples

```javascript
// Multiplication before addition
result = 10 + 5 * 2;  // 20 (not 30)
// Evaluated as: 10 + (5 * 2)

// Use parentheses to override
result = (10 + 5) * 2;  // 30

// Division before subtraction
result = 100 - 50 / 2;  // 75 (not 25)
// Evaluated as: 100 - (50 / 2)

// Comparison before AND
result = 5 > 3 && 10 < 20;  // true
// Evaluated as: (5 > 3) && (10 < 20)

// AND before OR
result = true || false && false;  // true
// Evaluated as: true || (false && false)
result = (true || false) && false;  // false (with parentheses)

// Complex expression
price = 100;
quantity = 5;
discount = 10;
taxRate = 0.08;

total = (price * quantity - discount) * (1 + taxRate);
// Step 1: price * quantity = 500
// Step 2: 500 - discount = 490
// Step 3: 1 + taxRate = 1.08
// Step 4: 490 * 1.08 = 529.2
```

### Best Practice: Use Parentheses

```javascript
// Less clear
result = a + b * c / d - e;

// More clear
result = a + ((b * c) / d) - e;

// Complex condition without parentheses
if(age >= 18 && country == "US" || hasParentalConsent)  // Ambiguous!

// Clear with parentheses
if((age >= 18 && country == "US") || hasParentalConsent)  // Clear!
```

## Best Practices

### 1. Use Parentheses for Clarity

```javascript
// Good: Clear intent
total = (price * quantity) * (1 + taxRate);

// Okay but less clear
total = price * quantity * (1 + taxRate);
```

### 2. Avoid Deep Nesting

```javascript
// Poor: Hard to read
if(a && (b || (c && (d || e))))

// Better: Break into steps
condition1 = c && (d || e);
condition2 = b || condition1;
result = a && condition2;
```

### 3. Use Comparison Operators Consistently

```javascript
// Good: Consistent style
if(status == "Active")

// Avoid: Yoda conditions (confusing)
if("Active" == status)
```

### 4. Check for Null Before Operations

```javascript
// Good: Safe
if(value != null && value > 0)
{
    process(value);
}

// Risky: May error if value is null
if(value > 0)
{
    process(value);
}
```

### 5. Use Compound Assignment When Appropriate

```javascript
// Good: Concise
counter += 1;
total += itemPrice;

// Okay but verbose
counter = counter + 1;
total = total + itemPrice;
```

### 6. Be Aware of Type Coercion

```javascript
// String + Number = String
result = "Price: " + 99.99;  // "Price: 99.99"

// Number + Number = Number
result = 50 + 50;  // 100

// String + String = String
result = "50" + "50";  // "5050" (concatenation, not addition!)
```

### 7. Use Descriptive Variable Names in Conditions

```javascript
// Good: Self-documenting
isEligibleForDiscount = (totalPurchases > 1000 && membershipYears >= 2);
if(isEligibleForDiscount)
{
    applyDiscount();
}

// Poor: Hard to understand
if(totalPurchases > 1000 && membershipYears >= 2)
{
    applyDiscount();
}
```

## Summary

### Quick Reference

| Category | Operators | Purpose |
|----------|-----------|---------|
| Arithmetic | `+` `-` `*` `/` `%` | Mathematical operations |
| Assignment | `=` `+=` `-=` `*=` `/=` `%=` | Value assignment |
| Comparison | `==` `!=` `>` `<` `>=` `<=` | Value comparison |
| Logical | `&&` `\|\|` `!` | Boolean logic |
| String | `+` | Concatenation |

### Common Patterns

```javascript
// Increment
counter += 1;

// Accumulate
total += itemPrice;

// Range check
isValid = (value >= min && value <= max);

// Multiple status check
isActive = (status == "Active" || status == "Pending");

// Null-safe string operation
if(text != null && text.length() > 0)

// Building strings
message = "Hello " + name + "!";
```

## Additional Resources

- [Control Structures](../control-structures/README.md) - Using operators in if/else statements
- [Data Types](../data-types/README.md) - Understanding operand types
- [Functions](../functions/README.md) - Functions for complex operations

## References

- [Zoho Deluge Operators](https://www.zoho.com/deluge/help/operators.html)
- [Arithmetic Operators](https://www.zoho.com/deluge/help/operators/arithmetic-operators.html)
- [Logical Operators](https://www.zoho.com/deluge/help/operators/logical-operators.html)
