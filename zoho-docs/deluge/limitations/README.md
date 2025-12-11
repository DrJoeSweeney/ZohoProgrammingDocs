# Deluge Limitations & Constraints

Understanding Deluge's limitations is crucial for writing efficient, reliable code. This guide covers execution limits, API quotas, language constraints, and performance considerations.

## Table of Contents

- [Execution Limits](#execution-limits)
- [API and Integration Limits](#api-and-integration-limits)
- [Data Size Restrictions](#data-size-restrictions)
- [Language Constraints](#language-constraints)
- [Performance Considerations](#performance-considerations)
- [Workarounds and Best Practices](#workarounds-and-best-practices)

## Execution Limits

### Statement Execution Limit

**Maximum: 5,000 statements per function**

The statement count includes **executed statements**, not just written lines. Loops multiply the count based on iterations.

```javascript
// Example: Statement counting
counter = 0;  // Statement 1

for each item in {1, 2, 3, 4, 5}  // Loop executes 5 times
{
    counter = counter + 1;  // 5 statements (one per iteration)
    info counter;           // 5 statements (one per iteration)
}

// Total: 1 + (5 * 2) = 11 statements executed
```

#### Loop Statement Explosion

```javascript
// Dangerous: Nested loops
outerList = {1, 2, 3, ...., 100};  // 100 items
innerList = {1, 2, 3, ...., 100};  // 100 items

for each outer in outerList
{
    for each inner in innerList
    {
        process(outer, inner);  // Executes 10,000 times!
    }
}

// This could easily exceed 5,000 statement limit
```

#### Mitigation Strategies

```javascript
// Good: Limit iterations
maxIterations = 500;
counter = 0;

for each item in largeList
{
    if(counter >= maxIterations)
    {
        break;
    }

    processItem(item);
    counter = counter + 1;
}

// Good: Process in batches
batchSize = 200;
batch = largeList.subList(0, batchSize);

for each item in batch
{
    processItem(item);
}
```

### Function Call Limit

**Maximum: 75 function calls per function**

Includes both custom function calls and built-in function calls.

```javascript
// Example: Function call counting
void myFunction()
{
    // Function call 1
    data1 = fetchData();

    // Function call 2
    data2 = processData(data1);

    // Function call 3
    result = saveData(data2);

    // 3 function calls so far
}

// Dangerous: Recursive function
void recursiveFunction(int count)
{
    if(count > 75)  // Will hit limit!
    {
        return;
    }

    recursiveFunction(count + 1);  // Each recursion is a function call
}
```

#### Avoiding Function Limit

```javascript
// Poor: Too many function calls
for each record in records  // 200 records
{
    processRecord(record);  // 200 function calls in loop!
    validateRecord(record);  // 200 more calls!
}

// Better: Batch processing
processBatch(records);  // Single function call

void processBatch(list records)
{
    for each record in records
    {
        // Process inline without additional function calls
        validated = record.get("Status") == "Active";
        if(validated)
        {
            // Direct operations
        }
    }
}
```

## API and Integration Limits

### Daily InvokeUrl Limits

**Default: 2,000 calls per day** (varies by Zoho product and plan)

```javascript
// Track API usage
apiCallsToday = 0;
maxAPICalls = 2000;

if(apiCallsToday < maxAPICalls)
{
    response = invokeurl [url: apiUrl type: GET];
    apiCallsToday = apiCallsToday + 1;
}
else
{
    info "Daily API limit reached";
    // Use cached data or alternative method
}
```

### Integration Task Limits

**Default: 2,000 integration tasks per day**

Integration tasks include:
- zoho.crm.getRecords()
- zoho.crm.createRecord()
- zoho.crm.updateRecord()
- zoho.crm.searchRecords()
- Other Zoho service integrations

```javascript
// Each CRM operation counts toward limit
leads = zoho.crm.getRecords("Leads", 1, 200);  // 1 task

for each lead in leads
{
    // Be cautious: this could be 200 tasks!
    zoho.crm.updateRecord("Leads", lead.get("id"), updateData);
}

// Better: Batch updates when possible
```

### Timeout Limits

**Maximum: 40 seconds per invokeUrl call**

```javascript
try
{
    // This will timeout if response takes > 40 seconds
    response = invokeurl
    [
        url: "https://very-slow-api.com/data"
        type: GET
    ];
}
catch(e)
{
    if(e.message.contains("timeout") || e.message.contains("socket"))
    {
        info "Request timed out after 40 seconds";

        // Implement retry with exponential backoff
        // or use alternative endpoint
    }
}
```

### Concurrent API Calls

API calls are subject to **organization-level concurrency limits** depending on your Zoho edition. Multiple scripts running simultaneously share this limit.

## Data Size Restrictions

### Email Attachments

**Maximum: 15 MB per sendmail task**

```javascript
// Check file size before sending
fileSize = 16 * 1024 * 1024;  // 16 MB

if(fileSize <= 15 * 1024 * 1024)  // 15 MB limit
{
    sendmail
    [
        from: zoho.adminuserid
        to: recipient
        subject: "Your File"
        attachments: file
    ]
}
else
{
    // Alternative: Upload to cloud storage and send link
    info "File too large for email attachment";
}
```

### API Response Size

**Maximum: 5 MB response content length for invokeUrl**

```javascript
try
{
    // May fail if response > 5 MB
    response = invokeurl
    [
        url: "https://api.example.com/large-dataset"
        type: GET
    ];
}
catch(e)
{
    info "Response too large or request failed";

    // Solution: Use pagination
    page = 1;
    pageSize = 100;

    response = invokeurl
    [
        url: "https://api.example.com/large-dataset?page=" + page + "&size=" + pageSize
        type: GET
    ];
}
```

### Collection Element Limits

**Zoho Creator: 25,000 elements maximum**
**Other Zoho Services: 50,000 elements maximum**

```javascript
// Using addAll() function
largeList = {};

// This will fail if trying to add > 25,000 items at once
largeList.addAll(hugeDataSet);  // Error if > 25,000

// Solution: Add in batches or use add() individually
for each item in hugeDataSet
{
    if(largeList.size() < 25000)
    {
        largeList.add(item);
    }
    else
    {
        break;
    }
}
```

## Language Constraints

### No Traditional For/While Loops

Deluge **does not support**:
- `for(i = 0; i < 10; i++)`
- `while(condition)`
- `do-while` loops

```javascript
// Not available in Deluge:
// for(i = 0; i < 10; i++) { }
// while(condition) { }

// Must use:
for each item in collection { }

// Workaround for counter-based iteration:
indices = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
for each i in indices
{
    info "Iteration: " + i;
}
```

### No Global Variables

All variables have **local scope only** - cannot be accessed across different scripts.

```javascript
// Script 1
userName = "John Smith";
// userName only exists in Script 1

// Script 2
// Cannot access userName from Script 1
// Must pass as parameter or fetch from CRM/database
```

### Case Sensitivity

Variable names and most operations are **case-sensitive**.

```javascript
// These are different variables
customerName = "John";
CustomerName = "Jane";
customername = "Bob";

// String comparison is case-sensitive
status = "Active";
if(status == "active")  // False! Case doesn't match
{
    // Won't execute
}

// Use toLowerCase() for case-insensitive comparison
if(status.toLowerCase() == "active")  // True
{
    // Executes
}
```

### No Switch/Case Statement

Deluge doesn't have switch-case, use if-else if-else instead.

```javascript
// Not available:
// switch(status) {
//     case "New": ...
//     case "Active": ...
// }

// Must use:
if(status == "New")
{
    // Handle New
}
else if(status == "Active")
{
    // Handle Active
}
else if(status == "Closed")
{
    // Handle Closed
}
else
{
    // Default
}
```

### No Ternary Operator (in some contexts)

Traditional ternary operator may not be available in all Deluge contexts.

```javascript
// May not work:
// result = (condition) ? value1 : value2;

// Use if-else instead:
if(condition)
{
    result = value1;
}
else
{
    result = value2;
}

// Or use ifNull for null handling:
result = ifNull(value, defaultValue);
```

## Performance Considerations

### Large Dataset Processing

```javascript
// Poor: Process all records at once
allRecords = zoho.crm.getRecords("Leads", 1, 200);  // Up to 200 records

for each record in allRecords
{
    // Heavy processing for each record
    complexCalculation(record);
    zoho.crm.updateRecord("Leads", record.get("id"), updates);
}
// Risk: Statement limit, function limit, slow execution

// Better: Batch processing with limits
maxProcess = 50;
counter = 0;

for each record in allRecords
{
    if(counter >= maxProcess)
    {
        break;
    }

    complexCalculation(record);
    counter = counter + 1;
}
```

### Nested Loops

```javascript
// Dangerous: O(n²) complexity
products = zoho.crm.getRecords("Products", 1, 200);
orders = zoho.crm.getRecords("Orders", 1, 200);

for each product in products  // 200 iterations
{
    for each order in orders  // 200 iterations each
    {
        // Executes 40,000 times!
        compare(product, order);
    }
}

// Better: Use maps for O(n) lookups
productMap = Map();
for each product in products
{
    productMap.put(product.get("id"), product);
}

for each order in orders
{
    productId = order.get("Product_Id");
    product = productMap.get(productId);  // O(1) lookup
    if(product != null)
    {
        compare(product, order);
    }
}
```

### String Concatenation in Loops

```javascript
// Poor: String concatenation in loop (slow)
result = "";
for each item in largeList  // 1000 items
{
    result = result + item + ",";  // Creates new string each time
}

// Better: Use list and join
items = {};
for each item in largeList
{
    items.add(item);
}
result = items.toString();  // Single operation
```

### Excessive API Calls

```javascript
// Poor: API call in loop
leads = zoho.crm.getRecords("Leads", 1, 200);

for each lead in leads
{
    // 200 API calls!
    account = zoho.crm.getRelatedRecords("Accounts", "Leads", lead.get("id"));
}

// Better: Batch fetch or use COQL
coqlQuery = "SELECT Name, Email, Account_Name FROM Leads WHERE Status = 'Qualified'";
results = zoho.crm.invokeConnector("crm.coql", coqlQuery);
```

## Workarounds and Best Practices

### 1. Paginate Large Operations

```javascript
// Process records in pages to avoid limits
pageSize = 100;
page = 1;
hasMore = true;

while(page <= 10)  // Safety limit: max 10 pages
{
    records = zoho.crm.getRecords("Leads", page, pageSize);

    if(records.size() == 0)
    {
        break;
    }

    // Process page
    for each record in records
    {
        processRecord(record);
    }

    page = page + 1;

    if(records.size() < pageSize)
    {
        break;  // Last page
    }
}
```

### 2. Cache Frequently Used Data

```javascript
// Poor: Repeated API calls for same data
for each order in orders
{
    customerId = order.get("Customer_Id");
    customer = zoho.crm.getRecordById("Accounts", customerId);  // Repeated calls!
    processOrder(order, customer);
}

// Better: Cache customer data
customerCache = Map();

for each order in orders
{
    customerId = order.get("Customer_Id");

    // Check cache first
    if(!customerCache.containsKey(customerId))
    {
        customer = zoho.crm.getRecordById("Accounts", customerId);
        customerCache.put(customerId, customer);
    }

    customer = customerCache.get(customerId);
    processOrder(order, customer);
}
```

### 3. Use Bulk Operations

```javascript
// Poor: Individual updates
for each lead in leads
{
    updateMap = {"Status": "Contacted"};
    zoho.crm.updateRecord("Leads", lead.get("id"), updateMap);
}

// Better: Bulk update (if available)
leadIds = {};
for each lead in leads
{
    leadIds.add(lead.get("id"));
}

// Use bulk API or batch updates
```

### 4. Implement Timeouts and Retries

```javascript
// Retry failed API calls
maxRetries = 3;
retryCount = 0;
success = false;

while(retryCount < maxRetries && !success)
{
    try
    {
        response = invokeurl [url: apiUrl type: GET];
        success = true;
    }
    catch(e)
    {
        retryCount = retryCount + 1;

        if(retryCount < maxRetries)
        {
            info "Retry attempt " + retryCount;
            // Optional: Add delay between retries
        }
        else
        {
            info "Max retries reached";
            // Fallback action
        }
    }
}
```

### 5. Monitor and Log Resource Usage

```javascript
// Track execution metrics
startTime = now;
apiCallCount = 0;
recordsProcessed = 0;

// ... your code ...

endTime = now;
duration = (endTime - startTime).toSeconds();

info "Execution Summary:";
info "Duration: " + duration + " seconds";
info "API Calls: " + apiCallCount;
info "Records Processed: " + recordsProcessed;
```

### 6. Split Large Operations

```javascript
// Instead of one massive function:
void processEverything()
{
    // 5000 statements here - may hit limit!
}

// Split into smaller functions:
void mainProcess()
{
    data = fetchData();         // Function 1
    validated = validateData(data);  // Function 2
    results = processData(validated);  // Function 3
    saveResults(results);       // Function 4
}

// Each function stays under statement limit
```

## Summary

### Key Limits Quick Reference

| Limit Type | Maximum | Notes |
|------------|---------|-------|
| Statements per function | 5,000 | Includes loop iterations |
| Function calls per function | 75 | Includes built-in functions |
| invokeUrl calls per day | 2,000 | Varies by plan |
| Integration tasks per day | 2,000 | CRM operations, etc. |
| API request timeout | 40 seconds | Per request |
| Email attachment size | 15 MB | Per email |
| API response size | 5 MB | Per invokeUrl |
| Collection elements (Creator) | 25,000 | Using addAll() |
| Collection elements (Other) | 50,000 | Using addAll() |

### Language Constraints

- No traditional for/while loops
- No global variables (local scope only)
- No switch/case statement
- Case-sensitive operations
- No concrete syntax (stored as AST)

### Best Practices Summary

1. **Monitor limits**: Track statement counts and API calls
2. **Batch operations**: Process data in manageable chunks
3. **Cache data**: Avoid repeated API calls
4. **Error handling**: Always use try-catch for external operations
5. **Pagination**: Break large datasets into pages
6. **Optimize loops**: Avoid nested loops when possible
7. **Use maps**: For O(1) lookups instead of nested loops
8. **Split functions**: Keep under statement/function call limits

## Additional Resources

- [Error Handling](../error-handling/README.md) - Handle limit-related errors
- [API Integration](../api-integration/README.md) - Optimize API usage
- [Best Practices](../examples/README.md) - Efficient code patterns

## References

- [Zoho Deluge Limitations](https://www.zoho.com/deluge/help/limitations.html)
- [API Limits](https://www.zoho.com/developer/docs/vertical-solutions/api/v2/api-limits.html)

## Notes

**Important**: The limits specified may change as Zoho analyzes usage patterns. Always refer to the [official documentation](https://www.zoho.com/deluge/help/limitations.html) for current limits specific to your Zoho product and plan.
