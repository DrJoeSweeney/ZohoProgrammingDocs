# Deluge Examples

This comprehensive guide provides 20+ real-world Deluge examples covering common use cases across Zoho applications. Each example includes complete code, explanations, and best practices.

## Table of Contents

### CRM Automation
1. [Lead Scoring Automation](#1-lead-scoring-automation)
2. [Auto-Assign Leads by Territory](#2-auto-assign-leads-by-territory)
3. [Deal Stage Update Notifications](#3-deal-stage-update-notifications)
4. [Automated Follow-Up Tasks](#4-automated-follow-up-tasks)
5. [Duplicate Detection and Merge](#5-duplicate-detection-and-merge)

### Data Synchronization
6. [Sync CRM Contacts to Books](#6-sync-crm-contacts-to-books)
7. [Two-Way Contact Sync](#7-two-way-contact-sync)
8. [Order Status Updates](#8-order-status-updates)

### API Integrations
9. [Send Slack Notifications](#9-send-slack-notifications)
10. [Create Trello Cards from Tasks](#10-create-trello-cards-from-tasks)
11. [Sync with Google Sheets](#11-sync-with-google-sheets)
12. [Integrate with External Payment Gateway](#12-integrate-with-external-payment-gateway)

### Reports and Analytics
13. [Weekly Sales Report](#13-weekly-sales-report)
14. [Customer Activity Dashboard](#14-customer-activity-dashboard)
15. [Revenue Forecasting](#15-revenue-forecasting)

### Workflows
16. [Invoice Generation Workflow](#16-invoice-generation-workflow)
17. [Approval Workflow with Escalation](#17-approval-workflow-with-escalation)
18. [Automated Email Sequences](#18-automated-email-sequences)

### Advanced Patterns
19. [Rate-Limited API Calls](#19-rate-limited-api-calls)
20. [Batch Data Processing](#20-batch-data-processing)
21. [Error Handling and Retry Logic](#21-error-handling-and-retry-logic)
22. [Dynamic Field Mapping](#22-dynamic-field-mapping)

---

## CRM Automation

### 1. Lead Scoring Automation

**Use Case**: Automatically score leads based on company size, budget, and engagement level.

**Trigger**: When a lead is created or updated in CRM

```javascript
// Lead Scoring Script
leadId = zoho.crm.getRecordById("Leads", input.leadId);

// Initialize score
score = 0;

// Score based on annual revenue
annualRevenue = leadId.get("Annual_Revenue");
if(annualRevenue != null)
{
    if(annualRevenue > 1000000)
    {
        score = score + 30;
    }
    else if(annualRevenue > 500000)
    {
        score = score + 20;
    }
    else if(annualRevenue > 100000)
    {
        score = score + 10;
    }
}

// Score based on number of employees
employees = leadId.get("No_of_Employees");
if(employees != null)
{
    if(employees > 500)
    {
        score = score + 25;
    }
    else if(employees > 100)
    {
        score = score + 15;
    }
    else if(employees > 50)
    {
        score = score + 10;
    }
}

// Score based on industry
industry = leadId.get("Industry");
targetIndustries = {"Technology", "Finance", "Healthcare"};
if(targetIndustries.contains(industry))
{
    score = score + 15;
}

// Score based on lead source
leadSource = leadId.get("Lead_Source");
if(leadSource == "Website" || leadSource == "Referral")
{
    score = score + 10;
}

// Determine rating based on score
rating = "Cold";
if(score >= 60)
{
    rating = "Hot";
}
else if(score >= 40)
{
    rating = "Warm";
}

// Update lead with score and rating
updateData = Map();
updateData.put("Lead_Score", score);
updateData.put("Rating", rating);

response = zoho.crm.updateRecord("Leads", input.leadId, updateData);

info "Lead scored: " + score + " (" + rating + ")";
```

**Explanation**:
- Scores leads on multiple criteria (revenue, employees, industry, source)
- Assigns rating based on total score
- Updates CRM record with calculated values
- Can be triggered on lead creation or field updates

---

### 2. Auto-Assign Leads by Territory

**Use Case**: Automatically assign leads to sales reps based on geographic territory.

```javascript
// Territory-Based Lead Assignment
leadId = input.leadId;
lead = zoho.crm.getRecordById("Leads", leadId);

// Get lead state
state = lead.get("State");

// Territory mapping
territoryMap = Map();
territoryMap.put("California", "12345000000123456");  // John's ID
territoryMap.put("New York", "12345000000234567");    // Sarah's ID
territoryMap.put("Texas", "12345000000345678");       // Mike's ID
territoryMap.put("Florida", "12345000000456789");     // Lisa's ID

// Default owner for unmapped territories
defaultOwner = "12345000000567890";  // Manager's ID

// Determine owner
ownerId = defaultOwner;
if(state != null && territoryMap.containsKey(state))
{
    ownerId = territoryMap.get(state);
}

// Update lead owner
updateData = Map();
owner = Map();
owner.put("id", ownerId);
updateData.put("Owner", owner);

// Add territory note
updateData.put("Description", "Auto-assigned based on territory: " + state);

response = zoho.crm.updateRecord("Leads", leadId, updateData);

// Send notification to new owner
ownerRecord = zoho.crm.getRecordById("users", ownerId);
ownerEmail = ownerRecord.get("email");

sendmail
[
    from: zoho.adminuserid
    to: ownerEmail
    subject: "New Lead Assigned: " + lead.get("Full_Name")
    message: "A new lead from " + state + " has been assigned to you.<br><br>" +
             "Company: " + lead.get("Company") + "<br>" +
             "Email: " + lead.get("Email") + "<br>" +
             "Phone: " + lead.get("Phone")
]

info "Lead assigned to: " + ownerEmail;
```

---

### 3. Deal Stage Update Notifications

**Use Case**: Send customized notifications when deal stages change.

```javascript
// Deal Stage Change Notification
dealId = input.dealId;
deal = zoho.crm.getRecordById("Deals", dealId);

stage = deal.get("Stage");
dealName = deal.get("Deal_Name");
amount = deal.get("Amount");
owner = deal.get("Owner");
ownerId = owner.get("id");

// Get owner email
ownerRecord = zoho.crm.getRecordById("users", ownerId);
ownerEmail = ownerRecord.get("email");

// Stage-specific actions
if(stage == "Qualification")
{
    // Send welcome email to customer
    accountId = deal.get("Account_Name").get("id");
    account = zoho.crm.getRecordById("Accounts", accountId);
    accountEmail = account.get("Email");

    sendmail
    [
        from: zoho.adminuserid
        to: accountEmail
        subject: "Welcome! Let's discuss " + dealName
        message: "Thank you for your interest. We're excited to work with you."
    ]
}
else if(stage == "Proposal")
{
    // Create task for proposal review
    taskData = Map();
    taskData.put("Subject", "Prepare proposal for " + dealName);
    taskData.put("Due_Date", today + 3);
    taskData.put("Status", "Not Started");
    taskData.put("Priority", "High");

    whatId = Map();
    whatId.put("id", dealId);
    taskData.put("What_Id", whatId);

    ownerMap = Map();
    ownerMap.put("id", ownerId);
    taskData.put("Owner", ownerMap);

    zoho.crm.createRecord("Tasks", taskData);
}
else if(stage == "Negotiation")
{
    // Alert sales manager
    managerEmail = "sales.manager@company.com";

    sendmail
    [
        from: zoho.adminuserid
        to: managerEmail
        subject: "Deal in Negotiation: " + dealName
        message: "Deal: " + dealName + "<br>" +
                 "Amount: $" + amount + "<br>" +
                 "Owner: " + ownerEmail + "<br><br>" +
                 "Deal has moved to negotiation stage. Please review."
    ]
}
else if(stage == "Closed Won")
{
    // Celebration notification
    sendmail
    [
        from: zoho.adminuserid
        to: ownerEmail
        subject: "🎉 Deal Closed: " + dealName
        message: "Congratulations! You closed " + dealName + " for $" + amount + "!"
    ]

    // Create onboarding task
    taskData = Map();
    taskData.put("Subject", "Customer onboarding for " + dealName);
    taskData.put("Due_Date", today + 1);
    taskData.put("Status", "Not Started");
    taskData.put("Priority", "High");

    whatId = Map();
    whatId.put("id", dealId);
    taskData.put("What_Id", whatId);

    zoho.crm.createRecord("Tasks", taskData);
}
else if(stage == "Closed Lost")
{
    // Schedule follow-up
    taskData = Map();
    taskData.put("Subject", "Follow up on lost deal: " + dealName);
    taskData.put("Due_Date", today + 90);
    taskData.put("Status", "Not Started");
    taskData.put("Priority", "Low");

    whatId = Map();
    whatId.put("id", dealId);
    taskData.put("What_Id", whatId);

    zoho.crm.createRecord("Tasks", taskData);
}

info "Stage notification sent for: " + dealName;
```

---

### 4. Automated Follow-Up Tasks

**Use Case**: Create follow-up tasks based on lead or contact activity.

```javascript
// Automated Follow-Up Task Creation
recordId = input.recordId;
moduleName = input.module;  // "Leads" or "Contacts"

record = zoho.crm.getRecordById(moduleName, recordId);

// Get record details
recordName = record.get("Full_Name");
lastActivityDate = record.get("Last_Activity_Time");
leadStatus = record.get("Lead_Status");  // For leads
owner = record.get("Owner");
ownerId = owner.get("id");

// Determine if follow-up is needed
daysSinceActivity = 0;
if(lastActivityDate != null)
{
    daysSinceActivity = today.daysBetween(lastActivityDate);
}

createTask = false;
taskSubject = "";
taskDue = today + 1;
taskPriority = "Normal";

if(daysSinceActivity > 30)
{
    // No activity in 30 days
    createTask = true;
    taskSubject = "Re-engage: " + recordName + " (No activity in 30+ days)";
    taskPriority = "High";
    taskDue = today;
}
else if(leadStatus == "Contacted" && daysSinceActivity > 7)
{
    // Contacted but no follow-up
    createTask = true;
    taskSubject = "Follow up with " + recordName;
    taskPriority = "Normal";
    taskDue = today + 1;
}
else if(leadStatus == "Qualified" && daysSinceActivity > 3)
{
    // Qualified lead needs attention
    createTask = true;
    taskSubject = "Urgent: Connect with qualified lead " + recordName;
    taskPriority = "High";
    taskDue = today;
}

if(createTask)
{
    taskData = Map();
    taskData.put("Subject", taskSubject);
    taskData.put("Due_Date", taskDue);
    taskData.put("Status", "Not Started");
    taskData.put("Priority", taskPriority);

    // Link to record
    whoId = Map();
    whoId.put("id", recordId);
    taskData.put("Who_Id", whoId);

    // Assign to record owner
    ownerMap = Map();
    ownerMap.put("id", ownerId);
    taskData.put("Owner", ownerMap);

    response = zoho.crm.createRecord("Tasks", taskData);

    info "Follow-up task created: " + taskSubject;
}
else
{
    info "No follow-up task needed for: " + recordName;
}
```

---

### 5. Duplicate Detection and Merge

**Use Case**: Detect duplicate contacts based on email and merge them.

```javascript
// Duplicate Detection and Merge
searchEmail = input.email;

// Search for contacts with this email
searchCriteria = "(Email:equals:" + searchEmail + ")";
contacts = zoho.crm.searchRecords("Contacts", searchCriteria);

if(contacts.size() > 1)
{
    info "Found " + contacts.size() + " duplicate contacts";

    // Sort by created time to keep the oldest
    oldestContact = null;
    oldestDate = null;

    for each contact in contacts
    {
        createdTime = contact.get("Created_Time");

        if(oldestDate == null || createdTime < oldestDate)
        {
            oldestDate = createdTime;
            oldestContact = contact;
        }
    }

    masterId = oldestContact.get("id");
    info "Master contact ID: " + masterId;

    // Merge others into master
    for each contact in contacts
    {
        contactId = contact.get("id");

        if(contactId != masterId)
        {
            // Get related records (deals, tasks, etc.)
            deals = zoho.crm.getRelatedRecords("Deals", "Contacts", contactId);

            // Re-associate deals with master contact
            for each deal in deals
            {
                dealId = deal.get("id");
                updateData = Map();

                masterContact = Map();
                masterContact.put("id", masterId);
                updateData.put("Contact_Name", masterContact);

                zoho.crm.updateRecord("Deals", dealId, updateData);
            }

            // Merge custom fields if master is missing data
            masterData = Map();

            if(oldestContact.get("Phone") == null && contact.get("Phone") != null)
            {
                masterData.put("Phone", contact.get("Phone"));
            }

            if(oldestContact.get("Description") == null && contact.get("Description") != null)
            {
                masterData.put("Description", contact.get("Description"));
            }

            if(masterData.size() > 0)
            {
                zoho.crm.updateRecord("Contacts", masterId, masterData);
            }

            // Delete duplicate
            zoho.crm.deleteRecord("Contacts", contactId);

            info "Merged and deleted duplicate: " + contactId;
        }
    }

    info "Merge complete. Master contact: " + masterId;
}
else
{
    info "No duplicates found for: " + searchEmail;
}
```

---

## Data Synchronization

### 6. Sync CRM Contacts to Books

**Use Case**: Synchronize contacts from CRM to Books for invoicing.

```javascript
// CRM to Books Contact Sync
contactId = input.contactId;
contact = zoho.crm.getRecordById("Contacts", contactId);

// Get contact details
firstName = contact.get("First_Name");
lastName = contact.get("Last_Name");
email = contact.get("Email");
phone = contact.get("Phone");
accountId = contact.get("Account_Name");

companyName = "";
if(accountId != null)
{
    account = zoho.crm.getRecordById("Accounts", accountId.get("id"));
    companyName = account.get("Account_Name");
}

// Check if contact already exists in Books
booksResponse = invokeurl
[
    url: "https://www.zohoapis.com/books/v3/contacts?email=" + email
    type: GET
    connection: "books_connection"
];

existingContacts = booksResponse.get("contacts");

if(existingContacts.size() == 0)
{
    // Create new contact in Books
    contactData = Map();
    contactData.put("contact_name", firstName + " " + lastName);
    contactData.put("company_name", companyName);
    contactData.put("email", email);
    contactData.put("phone", phone);
    contactData.put("contact_type", "customer");

    params = Map();
    params.put("JSONString", contactData.toString());

    createResponse = invokeurl
    [
        url: "https://www.zohoapis.com/books/v3/contacts"
        type: POST
        parameters: params
        connection: "books_connection"
    ];

    if(createResponse.get("code") == 0)
    {
        booksContactId = createResponse.get("contact").get("contact_id");
        info "Contact created in Books: " + booksContactId;

        // Store Books ID in CRM custom field
        updateData = Map();
        updateData.put("Books_Contact_ID", booksContactId);
        zoho.crm.updateRecord("Contacts", contactId, updateData);
    }
    else
    {
        info "Error creating contact in Books: " + createResponse;
    }
}
else
{
    info "Contact already exists in Books";
}
```

---

### 7. Two-Way Contact Sync

**Use Case**: Bidirectional sync between CRM and external system.

```javascript
// Two-Way Contact Sync Example
contactId = input.contactId;
contact = zoho.crm.getRecordById("Contacts", contactId);

// Get sync tracking field
lastSyncTime = contact.get("Last_Sync_Time");
externalId = contact.get("External_System_ID");

// Current CRM data
crmData = Map();
crmData.put("name", contact.get("Full_Name"));
crmData.put("email", contact.get("Email"));
crmData.put("phone", contact.get("Phone"));
crmData.put("company", contact.get("Account_Name"));

if(externalId != null)
{
    // Contact exists in external system - check for updates
    externalResponse = invokeurl
    [
        url: "https://api.external.com/contacts/" + externalId
        type: GET
        headers: {"Authorization": "Bearer " + input.apiKey}
    ];

    externalData = externalResponse.get("contact");
    externalModified = externalData.get("modified_time");

    // Compare modification times
    if(externalModified > lastSyncTime)
    {
        // External system has newer data - update CRM
        updateData = Map();

        if(externalData.get("phone") != contact.get("Phone"))
        {
            updateData.put("Phone", externalData.get("phone"));
        }

        if(externalData.get("email") != contact.get("Email"))
        {
            updateData.put("Email", externalData.get("email"));
        }

        if(updateData.size() > 0)
        {
            updateData.put("Last_Sync_Time", zoho.currenttime);
            zoho.crm.updateRecord("Contacts", contactId, updateData);
            info "Updated CRM from external system";
        }
    }
    else
    {
        // CRM has newer data - update external system
        updateResponse = invokeurl
        [
            url: "https://api.external.com/contacts/" + externalId
            type: PUT
            parameters: crmData.toString()
            headers: {"Authorization": "Bearer " + input.apiKey}
        ];

        // Update sync time
        updateData = Map();
        updateData.put("Last_Sync_Time", zoho.currenttime);
        zoho.crm.updateRecord("Contacts", contactId, updateData);
        info "Updated external system from CRM";
    }
}
else
{
    // Create in external system
    createResponse = invokeurl
    [
        url: "https://api.external.com/contacts"
        type: POST
        parameters: crmData.toString()
        headers: {"Authorization": "Bearer " + input.apiKey}
    ];

    newExternalId = createResponse.get("id");

    // Store external ID in CRM
    updateData = Map();
    updateData.put("External_System_ID", newExternalId);
    updateData.put("Last_Sync_Time", zoho.currenttime);
    zoho.crm.updateRecord("Contacts", contactId, updateData);

    info "Created contact in external system: " + newExternalId;
}
```

---

### 8. Order Status Updates

**Use Case**: Update CRM deals when order status changes in e-commerce system.

```javascript
// Order Status Update Handler
orderId = input.orderId;
newStatus = input.status;

// Get order details from external system
orderResponse = invokeurl
[
    url: "https://api.store.com/orders/" + orderId
    type: GET
    headers: {"Authorization": "Bearer " + input.storeApiKey}
];

order = orderResponse.get("order");
orderNumber = order.get("order_number");
customerEmail = order.get("customer").get("email");
totalAmount = order.get("total_amount");

// Find associated deal in CRM
searchCriteria = "(Order_Number:equals:" + orderNumber + ")";
deals = zoho.crm.searchRecords("Deals", searchCriteria);

if(deals.size() > 0)
{
    deal = deals.get(0);
    dealId = deal.get("id");

    updateData = Map();
    updateData.put("Order_Status", newStatus);

    // Update deal stage based on order status
    if(newStatus == "paid")
    {
        updateData.put("Stage", "Closed Won");
        updateData.put("Closed_Time", zoho.currenttime);
    }
    else if(newStatus == "shipped")
    {
        updateData.put("Stage", "Closed Won");
        updateData.put("Shipped_Date", today);
    }
    else if(newStatus == "cancelled")
    {
        updateData.put("Stage", "Closed Lost");
        updateData.put("Closed_Time", zoho.currenttime);
        updateData.put("Loss_Reason", "Order cancelled");
    }
    else if(newStatus == "refunded")
    {
        updateData.put("Stage", "Closed Lost");
        updateData.put("Closed_Time", zoho.currenttime);
        updateData.put("Loss_Reason", "Order refunded");
    }

    response = zoho.crm.updateRecord("Deals", dealId, updateData);

    // Add note
    noteData = Map();
    noteData.put("Note_Title", "Order Status Update");
    noteData.put("Note_Content", "Order " + orderNumber + " status updated to: " + newStatus);

    parentId = Map();
    parentId.put("id", dealId);
    noteData.put("Parent_Id", parentId);

    zoho.crm.createRecord("Notes", noteData);

    info "Deal updated with order status: " + newStatus;
}
else
{
    info "No deal found for order: " + orderNumber;
}
```

---

## API Integrations

### 9. Send Slack Notifications

**Use Case**: Send notifications to Slack when important CRM events occur.

```javascript
// Slack Notification for New High-Value Deal
dealId = input.dealId;
deal = zoho.crm.getRecordById("Deals", dealId);

dealName = deal.get("Deal_Name");
amount = deal.get("Amount");
stage = deal.get("Stage");
owner = deal.get("Owner");

// Only notify for high-value deals
if(amount > 50000)
{
    // Prepare Slack message
    slackMessage = Map();
    slackMessage.put("text", "🎯 New High-Value Deal!");

    attachments = List();
    attachment = Map();
    attachment.put("color", "#36a64f");
    attachment.put("title", dealName);
    attachment.put("title_link", "https://crm.zoho.com/crm/org123/tab/Deals/" + dealId);

    fields = List();

    // Amount field
    amountField = Map();
    amountField.put("title", "Amount");
    amountField.put("value", "$" + amount);
    amountField.put("short", true);
    fields.add(amountField);

    // Stage field
    stageField = Map();
    stageField.put("title", "Stage");
    stageField.put("value", stage);
    stageField.put("short", true);
    fields.add(stageField);

    // Owner field
    ownerField = Map();
    ownerField.put("title", "Owner");
    ownerField.put("value", owner.get("name"));
    ownerField.put("short", true);
    fields.add(ownerField);

    attachment.put("fields", fields);
    attachments.add(attachment);

    slackMessage.put("attachments", attachments);

    // Send to Slack
    slackResponse = invokeurl
    [
        url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
        type: POST
        parameters: slackMessage.toString()
    ];

    info "Slack notification sent for deal: " + dealName;
}
```

---

### 10. Create Trello Cards from Tasks

**Use Case**: Automatically create Trello cards when CRM tasks are created.

```javascript
// Create Trello Card from CRM Task
taskId = input.taskId;
task = zoho.crm.getRecordById("Tasks", taskId);

taskSubject = task.get("Subject");
taskDescription = task.get("Description");
dueDate = task.get("Due_Date");
priority = task.get("Priority");

// Determine Trello list based on priority
trelloListId = "";
if(priority == "High")
{
    trelloListId = "123abc456def";  // High Priority list
}
else if(priority == "Normal")
{
    trelloListId = "456def789ghi";  // Normal Priority list
}
else
{
    trelloListId = "789ghi012jkl";  // Low Priority list
}

// Prepare Trello card data
cardData = Map();
cardData.put("name", taskSubject);
cardData.put("desc", taskDescription);
cardData.put("idList", trelloListId);

if(dueDate != null)
{
    // Format due date for Trello (ISO 8601)
    cardData.put("due", dueDate.toString("yyyy-MM-dd'T'HH:mm:ss'Z'"));
}

// Create Trello card
trelloResponse = invokeurl
[
    url: "https://api.trello.com/1/cards"
    type: POST
    parameters: cardData
    headers: {"Authorization": "OAuth oauth_consumer_key=\"YOUR_KEY\", oauth_token=\"YOUR_TOKEN\""}
];

trelloCardId = trelloResponse.get("id");
trelloCardUrl = trelloResponse.get("url");

// Store Trello card ID in CRM task
updateData = Map();
updateData.put("Trello_Card_ID", trelloCardId);
updateData.put("Trello_Card_URL", trelloCardUrl);

zoho.crm.updateRecord("Tasks", taskId, updateData);

info "Trello card created: " + trelloCardUrl;
```

---

### 11. Sync with Google Sheets

**Use Case**: Export CRM data to Google Sheets for external reporting.

```javascript
// Export Deals to Google Sheets
sheetId = "YOUR_GOOGLE_SHEET_ID";
range = "Sheet1!A2:F";  // Starting from A2 to preserve headers

// Get deals from last 30 days
thirtyDaysAgo = today - 30;
searchCriteria = "(Created_Time:greater_than:" + thirtyDaysAgo.toString("yyyy-MM-dd") + ")";
deals = zoho.crm.searchRecords("Deals", searchCriteria, 1, 200);

// Prepare data for Google Sheets
values = List();

for each deal in deals
{
    row = List();
    row.add(deal.get("Deal_Name"));
    row.add(deal.get("Amount"));
    row.add(deal.get("Stage"));
    row.add(deal.get("Closing_Date"));
    row.add(deal.get("Owner").get("name"));
    row.add(deal.get("Created_Time"));

    values.add(row);
}

// Prepare request body
bodyData = Map();
bodyData.put("values", values);
bodyData.put("majorDimension", "ROWS");

// Clear existing data
clearResponse = invokeurl
[
    url: "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/" + range + ":clear"
    type: POST
    connection: "google_sheets"
];

// Write new data
updateResponse = invokeurl
[
    url: "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/" + range + "?valueInputOption=RAW"
    type: PUT
    parameters: bodyData.toString()
    connection: "google_sheets"
];

updatedRows = updateResponse.get("updatedRows");
info "Exported " + updatedRows + " deals to Google Sheets";
```

---

### 12. Integrate with External Payment Gateway

**Use Case**: Process payments and update CRM records.

```javascript
// Process Payment via Stripe
invoiceId = input.invoiceId;
invoice = zoho.crm.getRecordById("Invoices", invoiceId);

amount = invoice.get("Grand_Total");
customerEmail = invoice.get("Contact_Name").get("Email");
invoiceNumber = invoice.get("Invoice_Number");

// Create Stripe payment intent
paymentData = Map();
paymentData.put("amount", amount * 100);  // Stripe uses cents
paymentData.put("currency", "usd");
paymentData.put("receipt_email", customerEmail);
paymentData.put("description", "Invoice " + invoiceNumber);

stripeResponse = invokeurl
[
    url: "https://api.stripe.com/v1/payment_intents"
    type: POST
    parameters: paymentData
    headers: {"Authorization": "Bearer " + input.stripeSecretKey}
];

paymentIntentId = stripeResponse.get("id");
clientSecret = stripeResponse.get("client_secret");

// Store payment intent ID in CRM
updateData = Map();
updateData.put("Payment_Intent_ID", paymentIntentId);
updateData.put("Payment_Status", "Pending");

zoho.crm.updateRecord("Invoices", invoiceId, updateData);

info "Payment intent created: " + paymentIntentId;
info "Client secret: " + clientSecret;

// Return client secret for frontend processing
return Map{"client_secret": clientSecret};
```

---

## Reports and Analytics

### 13. Weekly Sales Report

**Use Case**: Generate and email weekly sales summary.

```javascript
// Weekly Sales Report Generator
// Get deals closed this week
weekStart = today.getWeekDay(1);  // Monday
weekEnd = today.getWeekDay(7);    // Sunday

searchCriteria = "(Stage:equals:Closed Won)and(Closing_Date:between:" +
                 weekStart.toString("yyyy-MM-dd") + ":" + weekEnd.toString("yyyy-MM-dd") + ")";

closedDeals = zoho.crm.searchRecords("Deals", searchCriteria, 1, 200);

// Calculate metrics
totalRevenue = 0;
dealCount = 0;
ownerMap = Map();

for each deal in closedDeals
{
    amount = deal.get("Amount");
    if(amount != null)
    {
        totalRevenue = totalRevenue + amount;
        dealCount = dealCount + 1;
    }

    // Track deals by owner
    owner = deal.get("Owner").get("name");
    if(ownerMap.containsKey(owner))
    {
        ownerCount = ownerMap.get(owner);
        ownerMap.put(owner, ownerCount + 1);
    }
    else
    {
        ownerMap.put(owner, 1);
    }
}

avgDealSize = 0;
if(dealCount > 0)
{
    avgDealSize = totalRevenue / dealCount;
}

// Build HTML report
htmlReport = "<html><body>";
htmlReport = htmlReport + "<h2>Weekly Sales Report</h2>";
htmlReport = htmlReport + "<h3>Week of " + weekStart.toString("MMM dd") + " - " + weekEnd.toString("MMM dd, yyyy") + "</h3>";

htmlReport = htmlReport + "<table border='1' cellpadding='10'>";
htmlReport = htmlReport + "<tr><th>Metric</th><th>Value</th></tr>";
htmlReport = htmlReport + "<tr><td>Deals Closed</td><td>" + dealCount + "</td></tr>";
htmlReport = htmlReport + "<tr><td>Total Revenue</td><td>$" + totalRevenue.round(2) + "</td></tr>";
htmlReport = htmlReport + "<tr><td>Average Deal Size</td><td>$" + avgDealSize.round(2) + "</td></tr>";
htmlReport = htmlReport + "</table>";

htmlReport = htmlReport + "<h3>Deals by Owner</h3>";
htmlReport = htmlReport + "<table border='1' cellpadding='10'>";
htmlReport = htmlReport + "<tr><th>Owner</th><th>Deals Closed</th></tr>";

for each owner in ownerMap.keys()
{
    count = ownerMap.get(owner);
    htmlReport = htmlReport + "<tr><td>" + owner + "</td><td>" + count + "</td></tr>";
}

htmlReport = htmlReport + "</table>";
htmlReport = htmlReport + "</body></html>";

// Send report
sendmail
[
    from: zoho.adminuserid
    to: "sales.team@company.com"
    subject: "Weekly Sales Report - " + weekStart.toString("MMM dd, yyyy")
    message: htmlReport
]

info "Weekly sales report sent";
```

---

### 14. Customer Activity Dashboard

**Use Case**: Generate customer activity summary for account managers.

```javascript
// Customer Activity Dashboard
accountId = input.accountId;
account = zoho.crm.getRecordById("Accounts", accountId);

accountName = account.get("Account_Name");

// Get related contacts
contacts = zoho.crm.getRelatedRecords("Contacts", "Accounts", accountId);

// Get related deals
deals = zoho.crm.getRelatedRecords("Deals", "Accounts", accountId);

// Get recent activities
thirtyDaysAgo = today - 30;
searchCriteria = "(Created_Time:greater_than:" + thirtyDaysAgo.toString("yyyy-MM-dd") + ")";

// Calculate metrics
totalDeals = deals.size();
activeDeals = 0;
wonDeals = 0;
totalRevenue = 0;

for each deal in deals
{
    stage = deal.get("Stage");
    if(stage == "Closed Won")
    {
        wonDeals = wonDeals + 1;
        amount = deal.get("Amount");
        if(amount != null)
        {
            totalRevenue = totalRevenue + amount;
        }
    }
    else if(stage != "Closed Lost")
    {
        activeDeals = activeDeals + 1;
    }
}

// Build dashboard HTML
dashboard = "<html><body>";
dashboard = dashboard + "<h2>Customer Activity Dashboard</h2>";
dashboard = dashboard + "<h3>" + accountName + "</h3>";

dashboard = dashboard + "<table border='1' cellpadding='10'>";
dashboard = dashboard + "<tr><td><b>Total Contacts</b></td><td>" + contacts.size() + "</td></tr>";
dashboard = dashboard + "<tr><td><b>Total Deals</b></td><td>" + totalDeals + "</td></tr>";
dashboard = dashboard + "<tr><td><b>Active Deals</b></td><td>" + activeDeals + "</td></tr>";
dashboard = dashboard + "<tr><td><b>Won Deals</b></td><td>" + wonDeals + "</td></tr>";
dashboard = dashboard + "<tr><td><b>Total Revenue</b></td><td>$" + totalRevenue + "</td></tr>";
dashboard = dashboard + "</table>";

dashboard = dashboard + "<h3>Active Deals</h3>";
dashboard = dashboard + "<ul>";

for each deal in deals
{
    stage = deal.get("Stage");
    if(stage != "Closed Won" && stage != "Closed Lost")
    {
        dealName = deal.get("Deal_Name");
        amount = deal.get("Amount");
        dashboard = dashboard + "<li>" + dealName + " - " + stage + " - $" + amount + "</li>";
    }
}

dashboard = dashboard + "</ul>";
dashboard = dashboard + "</body></html>";

// Send dashboard
owner = account.get("Owner");
ownerEmail = owner.get("email");

sendmail
[
    from: zoho.adminuserid
    to: ownerEmail
    subject: "Customer Activity: " + accountName
    message: dashboard
]

info "Dashboard sent to: " + ownerEmail;
```

---

### 15. Revenue Forecasting

**Use Case**: Calculate revenue forecast based on deal pipeline.

```javascript
// Revenue Forecasting Calculator
// Get all open deals
searchCriteria = "(Stage:not_equal:Closed Won)and(Stage:not_equal:Closed Lost)";
openDeals = zoho.crm.searchRecords("Deals", searchCriteria, 1, 200);

// Stage probability map
stageProbability = Map();
stageProbability.put("Qualification", 0.10);
stageProbability.put("Needs Analysis", 0.20);
stageProbability.put("Value Proposition", 0.40);
stageProbability.put("Proposal", 0.60);
stageProbability.put("Negotiation", 0.80);

// Calculate forecast by month
monthlyForecast = Map();

for each deal in openDeals
{
    stage = deal.get("Stage");
    amount = deal.get("Amount");
    closingDate = deal.get("Closing_Date");

    if(amount != null && closingDate != null && stageProbability.containsKey(stage))
    {
        probability = stageProbability.get(stage);
        weightedAmount = amount * probability;

        month = closingDate.toString("yyyy-MM");

        if(monthlyForecast.containsKey(month))
        {
            currentAmount = monthlyForecast.get(month);
            monthlyForecast.put(month, currentAmount + weightedAmount);
        }
        else
        {
            monthlyForecast.put(month, weightedAmount);
        }
    }
}

// Generate report
forecastReport = "<html><body>";
forecastReport = forecastReport + "<h2>Revenue Forecast</h2>";
forecastReport = forecastReport + "<table border='1' cellpadding='10'>";
forecastReport = forecastReport + "<tr><th>Month</th><th>Forecasted Revenue</th></tr>";

totalForecast = 0;
for each month in monthlyForecast.keys()
{
    forecast = monthlyForecast.get(month);
    totalForecast = totalForecast + forecast;
    forecastReport = forecastReport + "<tr><td>" + month + "</td><td>$" + forecast.round(2) + "</td></tr>";
}

forecastReport = forecastReport + "<tr><td><b>Total</b></td><td><b>$" + totalForecast.round(2) + "</b></td></tr>";
forecastReport = forecastReport + "</table>";
forecastReport = forecastReport + "</body></html>";

// Send report
sendmail
[
    from: zoho.adminuserid
    to: "sales.leadership@company.com"
    subject: "Revenue Forecast Report"
    message: forecastReport
]

info "Forecast report sent. Total forecast: $" + totalForecast.round(2);
```

---

## Workflows

### 16. Invoice Generation Workflow

**Use Case**: Automatically generate invoice when deal is closed.

```javascript
// Auto-Generate Invoice from Closed Deal
dealId = input.dealId;
deal = zoho.crm.getRecordById("Deals", dealId);

stage = deal.get("Stage");

if(stage == "Closed Won")
{
    // Get deal details
    dealName = deal.get("Deal_Name");
    amount = deal.get("Amount");
    accountId = deal.get("Account_Name").get("id");
    contactId = deal.get("Contact_Name").get("id");

    // Get account details
    account = zoho.crm.getRecordById("Accounts", accountId);
    companyName = account.get("Account_Name");

    // Get contact details
    contact = zoho.crm.getRecordById("Contacts", contactId);
    contactName = contact.get("Full_Name");
    contactEmail = contact.get("Email");

    // Create invoice in Zoho Books
    invoiceData = Map();
    invoiceData.put("customer_name", companyName);
    invoiceData.put("date", today.toString("yyyy-MM-dd"));
    invoiceData.put("payment_terms", 30);
    invoiceData.put("payment_terms_label", "Net 30");

    // Add line items
    lineItems = List();
    lineItem = Map();
    lineItem.put("description", dealName);
    lineItem.put("rate", amount);
    lineItem.put("quantity", 1);
    lineItems.add(lineItem);

    invoiceData.put("line_items", lineItems);

    params = Map();
    params.put("JSONString", invoiceData.toString());

    // Create invoice via Books API
    booksResponse = invokeurl
    [
        url: "https://www.zohoapis.com/books/v3/invoices"
        type: POST
        parameters: params
        connection: "books_connection"
    ];

    if(booksResponse.get("code") == 0)
    {
        invoice = booksResponse.get("invoice");
        invoiceId = invoice.get("invoice_id");
        invoiceNumber = invoice.get("invoice_number");

        // Update deal with invoice details
        updateData = Map();
        updateData.put("Invoice_ID", invoiceId);
        updateData.put("Invoice_Number", invoiceNumber);
        updateData.put("Invoice_Status", "Sent");

        zoho.crm.updateRecord("Deals", dealId, updateData);

        // Send invoice to customer
        sendInvoiceResponse = invokeurl
        [
            url: "https://www.zohoapis.com/books/v3/invoices/" + invoiceId + "/email"
            type: POST
            connection: "books_connection"
        ];

        info "Invoice generated and sent: " + invoiceNumber;
    }
    else
    {
        info "Error creating invoice: " + booksResponse;
    }
}
```

---

### 17. Approval Workflow with Escalation

**Use Case**: Multi-level approval workflow with automatic escalation.

```javascript
// Approval Workflow with Escalation
requestId = input.requestId;
request = zoho.crm.getRecordById("Approval_Requests", requestId);

requestType = request.get("Request_Type");
amount = request.get("Amount");
status = request.get("Status");
submittedDate = request.get("Submitted_Date");
currentApprover = request.get("Current_Approver");

// Determine approval level based on amount
approvalLevel = 1;
if(amount > 10000)
{
    approvalLevel = 3;  // VP approval required
}
else if(amount > 5000)
{
    approvalLevel = 2;  // Manager approval required
}

// Check for escalation (pending for more than 48 hours)
hoursSinceSubmission = zoho.currenttime.hoursBetween(submittedDate);

if(status == "Pending" && hoursSinceSubmission > 48)
{
    // Escalate to next level
    if(approvalLevel == 1)
    {
        // Escalate to manager
        updateData = Map();

        manager = Map();
        manager.put("id", "12345000000234567");  // Manager ID
        updateData.put("Current_Approver", manager);

        updateData.put("Escalation_Count", 1);
        updateData.put("Last_Escalation_Date", zoho.currenttime);

        zoho.crm.updateRecord("Approval_Requests", requestId, updateData);

        // Notify manager
        sendmail
        [
            from: zoho.adminuserid
            to: "manager@company.com"
            subject: "ESCALATED: Approval Request " + requestId
            message: "An approval request has been escalated to you due to delayed response."
        ]

        info "Request escalated to manager";
    }
    else if(approvalLevel == 2)
    {
        // Escalate to VP
        updateData = Map();

        vp = Map();
        vp.put("id", "12345000000345678");  // VP ID
        updateData.put("Current_Approver", vp);

        updateData.put("Escalation_Count", 2);
        updateData.put("Last_Escalation_Date", zoho.currenttime);

        zoho.crm.updateRecord("Approval_Requests", requestId, updateData);

        // Notify VP
        sendmail
        [
            from: zoho.adminuserid
            to: "vp@company.com"
            subject: "ESCALATED: High-Priority Approval Request"
            message: "A high-value approval request requires your immediate attention."
        ]

        info "Request escalated to VP";
    }
}
else if(status == "Pending")
{
    // Send reminder to current approver
    approverEmail = currentApprover.get("email");

    sendmail
    [
        from: zoho.adminuserid
        to: approverEmail
        subject: "Reminder: Pending Approval Request"
        message: "You have a pending approval request that requires your attention."
    ]

    info "Reminder sent to: " + approverEmail;
}
```

---

### 18. Automated Email Sequences

**Use Case**: Drip email campaign based on lead behavior.

```javascript
// Automated Email Sequence
leadId = input.leadId;
lead = zoho.crm.getRecordById("Leads", leadId);

leadStatus = lead.get("Lead_Status");
email = lead.get("Email");
firstName = lead.get("First_Name");
sequenceStage = lead.get("Email_Sequence_Stage");

// Initialize sequence if new lead
if(sequenceStage == null || sequenceStage == "")
{
    sequenceStage = 0;
}

// Send appropriate email based on sequence stage
if(sequenceStage == 0)
{
    // Welcome email
    sendmail
    [
        from: zoho.adminuserid
        to: email
        subject: "Welcome, " + firstName + "!"
        message: "Thank you for your interest. We're excited to help you succeed."
    ]

    updateData = Map();
    updateData.put("Email_Sequence_Stage", 1);
    updateData.put("Last_Email_Sent", zoho.currenttime);
    zoho.crm.updateRecord("Leads", leadId, updateData);

    info "Sent welcome email to: " + email;
}
else if(sequenceStage == 1 && leadStatus == "New")
{
    // Follow-up email (3 days after welcome)
    lastEmailSent = lead.get("Last_Email_Sent");
    daysSinceEmail = today.daysBetween(lastEmailSent);

    if(daysSinceEmail >= 3)
    {
        sendmail
        [
            from: zoho.adminuserid
            to: email
            subject: "Quick question for you, " + firstName
            message: "I wanted to follow up and see if you had any questions about our solution."
        ]

        updateData = Map();
        updateData.put("Email_Sequence_Stage", 2);
        updateData.put("Last_Email_Sent", zoho.currenttime);
        zoho.crm.updateRecord("Leads", leadId, updateData);

        info "Sent follow-up email to: " + email;
    }
}
else if(sequenceStage == 2 && leadStatus == "New")
{
    // Case study email (5 days after follow-up)
    lastEmailSent = lead.get("Last_Email_Sent");
    daysSinceEmail = today.daysBetween(lastEmailSent);

    if(daysSinceEmail >= 5)
    {
        sendmail
        [
            from: zoho.adminuserid
            to: email
            subject: "See how companies like yours succeed with us"
            message: "I thought you might find this case study relevant to your business."
        ]

        updateData = Map();
        updateData.put("Email_Sequence_Stage", 3);
        updateData.put("Last_Email_Sent", zoho.currenttime);
        zoho.crm.updateRecord("Leads", leadId, updateData);

        info "Sent case study email to: " + email;
    }
}
else if(leadStatus == "Contacted" || leadStatus == "Qualified")
{
    // Stop automated sequence
    updateData = Map();
    updateData.put("Email_Sequence_Stage", "Stopped");
    zoho.crm.updateRecord("Leads", leadId, updateData);

    info "Sequence stopped - lead is " + leadStatus;
}
```

---

## Advanced Patterns

### 19. Rate-Limited API Calls

**Use Case**: Handle external API rate limits with queueing.

```javascript
// Rate-Limited API Call Handler
endpoint = input.endpoint;
payload = input.payload;

// Check rate limit status
rateLimitKey = "api_calls_" + today.toString("yyyy-MM-dd-HH");
rateLimitCount = zoho.encryption.decrypt(rateLimitKey);  // Use custom storage

if(rateLimitCount == null)
{
    rateLimitCount = 0;
}

maxCallsPerHour = 100;

if(rateLimitCount >= maxCallsPerHour)
{
    // Rate limit exceeded - queue for later
    queueData = Map();
    queueData.put("endpoint", endpoint);
    queueData.put("payload", payload);
    queueData.put("scheduled_time", zoho.currenttime.addHour(1));

    // Store in queue (Creator table or similar)
    insert into APIQueue
    [
        Endpoint = endpoint,
        Payload = payload.toString(),
        Status = "Queued",
        Scheduled_Time = zoho.currenttime.addHour(1)
    ];

    info "API call queued due to rate limit";
    return Map{"status": "queued", "message": "Rate limit reached. Call scheduled for next hour."};
}
else
{
    // Make API call
    try
    {
        response = invokeurl
        [
            url: endpoint
            type: POST
            parameters: payload.toString()
            headers: {"Authorization": "Bearer " + input.apiKey}
        ];

        // Increment rate limit counter
        rateLimitCount = rateLimitCount + 1;
        zoho.encryption.encrypt(rateLimitKey, rateLimitCount.toString());  // Store count

        info "API call successful. Calls this hour: " + rateLimitCount;
        return response;
    }
    catch (e)
    {
        // Check if it's a rate limit error
        if(e.contains("429") || e.contains("rate limit"))
        {
            // Queue for retry
            insert into APIQueue
            [
                Endpoint = endpoint,
                Payload = payload.toString(),
                Status = "Queued",
                Scheduled_Time = zoho.currenttime.addMinute(15)
            ];

            info "Rate limit hit. Queued for retry.";
            return Map{"status": "queued", "message": "Rate limit error. Retry scheduled."};
        }
        else
        {
            throw "API call failed: " + e;
        }
    }
}
```

---

### 20. Batch Data Processing

**Use Case**: Process large datasets in manageable batches.

```javascript
// Batch Data Processor
operation = input.operation;  // "export", "update", "cleanup"
module = input.module;
batchSize = 200;

if(operation == "export")
{
    // Export all records in batches
    allRecords = List();
    page = 1;
    hasMore = true;

    while(hasMore)
    {
        fromIndex = (page - 1) * batchSize + 1;
        toIndex = page * batchSize;

        records = zoho.crm.getRecords(module, fromIndex, toIndex);

        if(records.size() > 0)
        {
            allRecords.addAll(records);
            info "Processed batch " + page + ": " + records.size() + " records";
            page = page + 1;
        }
        else
        {
            hasMore = false;
        }

        // Pause to avoid rate limits
        if(page % 5 == 0)
        {
            // Sleep for 1 second after every 5 batches
            zoho.crm.invokeUrl
            (
                url: "https://httpbin.org/delay/1",
                type: GET
            );
        }
    }

    info "Total records exported: " + allRecords.size();
    return allRecords;
}
else if(operation == "update")
{
    // Batch update records
    searchCriteria = input.criteria;
    updateField = input.field;
    updateValue = input.value;

    records = zoho.crm.searchRecords(module, searchCriteria, 1, 200);
    updatedCount = 0;

    for each record in records
    {
        recordId = record.get("id");

        updateData = Map();
        updateData.put(updateField, updateValue);

        try
        {
            response = zoho.crm.updateRecord(module, recordId, updateData);
            updatedCount = updatedCount + 1;

            if(updatedCount % 50 == 0)
            {
                info "Updated " + updatedCount + " records so far...";
            }
        }
        catch (e)
        {
            info "Failed to update record " + recordId + ": " + e;
        }
    }

    info "Batch update complete. Updated " + updatedCount + " records.";
    return updatedCount;
}
```

---

### 21. Error Handling and Retry Logic

**Use Case**: Robust error handling with exponential backoff retry.

```javascript
// API Call with Retry Logic
function callExternalAPI(endpoint, payload, maxRetries)
{
    retryCount = 0;
    success = false;

    while(retryCount <= maxRetries && !success)
    {
        try
        {
            response = invokeurl
            [
                url: endpoint
                type: POST
                parameters: payload.toString()
                headers: {"Authorization": "Bearer " + input.apiKey}
            ];

            success = true;
            info "API call successful on attempt " + (retryCount + 1);
            return response;
        }
        catch (e)
        {
            retryCount = retryCount + 1;
            info "API call failed (attempt " + retryCount + "): " + e;

            if(retryCount <= maxRetries)
            {
                // Exponential backoff: 2^retryCount seconds
                waitTime = 2 ^ retryCount;
                info "Retrying in " + waitTime + " seconds...";

                // Simulate wait using delay API
                zoho.crm.invokeUrl
                (
                    url: "https://httpbin.org/delay/" + waitTime,
                    type: GET
                );
            }
            else
            {
                // Log final failure
                errorLog = Map();
                errorLog.put("Endpoint", endpoint);
                errorLog.put("Error", e);
                errorLog.put("Timestamp", zoho.currenttime);
                errorLog.put("Retry_Count", retryCount);

                // Store error log
                insert into ErrorLogs
                [
                    Endpoint = endpoint,
                    Error_Message = e,
                    Retry_Count = retryCount,
                    Timestamp = zoho.currenttime
                ];

                throw "API call failed after " + maxRetries + " retries: " + e;
            }
        }
    }
}

// Usage
try
{
    result = callExternalAPI("https://api.example.com/endpoint", {"data": "value"}, 3);
    info "Result: " + result;
}
catch (e)
{
    info "All retry attempts failed: " + e;
}
```

---

### 22. Dynamic Field Mapping

**Use Case**: Map fields between different systems dynamically.

```javascript
// Dynamic Field Mapper
sourceSystem = input.source;  // "CRM", "Books", "External"
targetSystem = input.target;  // "CRM", "Books", "External"
sourceData = input.data;

// Define field mappings
fieldMappings = Map();

if(sourceSystem == "CRM" && targetSystem == "Books")
{
    fieldMappings.put("Account_Name", "company_name");
    fieldMappings.put("Email", "email");
    fieldMappings.put("Phone", "phone");
    fieldMappings.put("Billing_Street", "billing_address.street");
    fieldMappings.put("Billing_City", "billing_address.city");
    fieldMappings.put("Billing_State", "billing_address.state");
}
else if(sourceSystem == "Books" && targetSystem == "CRM")
{
    fieldMappings.put("company_name", "Account_Name");
    fieldMappings.put("email", "Email");
    fieldMappings.put("phone", "Phone");
    fieldMappings.put("billing_address.street", "Billing_Street");
    fieldMappings.put("billing_address.city", "Billing_City");
}

// Apply mappings
targetData = Map();

for each sourceField in fieldMappings.keys()
{
    targetField = fieldMappings.get(sourceField);

    // Handle nested fields
    if(sourceField.contains("."))
    {
        // Parse nested field (e.g., "billing_address.street")
        parts = sourceField.split(".");
        value = sourceData.get(parts.get(0)).get(parts.get(1));
    }
    else
    {
        value = sourceData.get(sourceField);
    }

    // Map to target field
    if(value != null)
    {
        if(targetField.contains("."))
        {
            // Create nested structure
            parts = targetField.split(".");
            nestedMap = Map();
            nestedMap.put(parts.get(1), value);
            targetData.put(parts.get(0), nestedMap);
        }
        else
        {
            targetData.put(targetField, value);
        }
    }
}

info "Field mapping complete";
info "Source fields: " + sourceData.keys().size();
info "Mapped fields: " + targetData.keys().size();

return targetData;
```

---

## Conclusion

These examples demonstrate common Deluge patterns and best practices for:
- CRM automation and workflow optimization
- Data synchronization across Zoho and external systems
- API integrations with popular third-party services
- Reporting and analytics generation
- Complex workflows with approval and escalation
- Error handling and resilience patterns
- Performance optimization with batching and rate limiting

Adapt these examples to your specific use cases and always test thoroughly before deploying to production.

---

**Related Documentation**:
- [Database Operations](../database/README.md)
- [API Integration](../api-integration/README.md)
- [Error Handling](../error-handling/README.md)
- [Functions](../functions/README.md)

**Last Updated**: December 2025
