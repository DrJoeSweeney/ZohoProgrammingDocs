# Zoho API Endpoints Index

Searchable index of all API endpoints across all Zoho products.

---

## How to Use This Index

- **Ctrl+F / Cmd+F** to search for specific operations
- Each endpoint includes HTTP method, URL pattern, and brief description
- Click product name to jump to that section

---

## Products Index

- [CRM](#crm)
- [Campaigns](#campaigns)
- [Analytics](#analytics)
- [SalesIQ](#salesiq)
- [Flow](#flow)
- [Books](#books)
- [Desk](#desk)
- [Projects](#projects)
- [People](#people)
- [Recruit](#recruit)
- [Inventory](#inventory)
- [Sign](#sign)
- [Forms](#forms)
- [Survey](#survey)
- [Sheet](#sheet)
- [Writer](#writer)
- [Show](#show)
- [Mail](#mail)
- [Meeting](#meeting)
- [Cliq](#cliq)
- [Connect](#connect)
- [Bookings](#bookings)
- [Creator](#creator)
- [WorkDrive](#workdrive)
- [Backstage](#backstage)
- [Sprints](#sprints)
- [Invoice](#invoice)
- [Social](#social)
- [Expense](#expense)
- [Subscriptions](#subscriptions)
- [Commerce](#commerce)
- [Sites](#sites)
- [PageSense](#pagesense)
- [Webinar](#webinar)
- [Lens](#lens)
- [Assist](#assist)
- [Vault](#vault)
- [Learn](#learn)
- [BugTracker](#bugtracker)
- [TestHub](#testhub)
- [Notebook](#notebook)
- [Office Integrator](#office-integrator)
- [Workerly](#workerly)
- [IoT](#iot)
- [Thrive](#thrive)
- [DataPrep](#dataprep)
- [Catalyst](#catalyst)
- [Bigin](#bigin)
- [Marketing Automation](#marketing-automation)
- [Finance Plus](#finance-plus)
- [Payroll](#payroll)

---

## CRM

**Base URL**: `https://www.zohoapis.com/crm/v8`

### Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Leads` | Get all leads |
| GET | `/Leads/{id}` | Get lead by ID |
| POST | `/Leads` | Create leads (max 100) |
| PUT | `/Leads/{id}` | Update lead |
| DELETE | `/Leads/{id}` | Delete lead |
| GET | `/Contacts` | Get all contacts |
| GET | `/Contacts/{id}` | Get contact by ID |
| POST | `/Contacts` | Create contacts |
| PUT | `/Contacts/{id}` | Update contact |
| DELETE | `/Contacts/{id}` | Delete contact |
| GET | `/Accounts` | Get all accounts |
| GET | `/Accounts/{id}` | Get account by ID |
| POST | `/Accounts` | Create accounts |
| PUT | `/Accounts/{id}` | Update account |
| DELETE | `/Accounts/{id}` | Delete account |
| GET | `/Deals` | Get all deals |
| GET | `/Deals/{id}` | Get deal by ID |
| POST | `/Deals` | Create deals |
| PUT | `/Deals/{id}` | Update deal |
| DELETE | `/Deals/{id}` | Delete deal |

### Search & Query

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Leads/search?criteria={criteria}` | Search leads |
| GET | `/coql` | COQL query |
| POST | `/coql` | Complex COQL query |

### Related Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{module}/{id}/{relatedModule}` | Get related records |
| PUT | `/{module}/{id}/{relatedModule}` | Update related records |
| DELETE | `/{module}/{id}/{relatedModule}/{relatedId}` | Delete related record |

### Metadata

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings/modules` | Get all modules |
| GET | `/settings/fields?module={module}` | Get module fields |
| GET | `/settings/layouts?module={module}` | Get module layouts |
| GET | `/settings/related_lists?module={module}` | Get related lists |
| GET | `/settings/custom_views?module={module}` | Get custom views |

### Bulk Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bulk/v2/read` | Bulk read job |
| GET | `/bulk/v2/read/{jobId}` | Check bulk read status |
| GET | `/bulk/v2/read/{jobId}/result` | Download bulk read results |
| POST | `/bulk/v2/write` | Bulk write job |
| GET | `/bulk/v2/write/{jobId}` | Check bulk write status |

---

## Campaigns

**Base URL**: `https://campaigns.zoho.com/api/v1.1`

### Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getcampaigns` | Get all campaigns |
| GET | `/getcampaign?campaignkey={key}` | Get campaign details |
| POST | `/createcampaign` | Create campaign |
| POST | `/updatecampaign` | Update campaign |
| POST | `/schedulecampaign` | Schedule campaign |
| POST | `/deletecampaign` | Delete campaign |

### Lists

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getmailinglists` | Get all mailing lists |
| GET | `/getlistsubscribers?listkey={key}` | Get list subscribers |
| POST | `/listsubscribe` | Subscribe to list |
| POST | `/listunsubscribe` | Unsubscribe from list |
| POST | `/addlistcontacts` | Add contacts to list |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getemailcampaignstats?campaignkey={key}` | Get campaign stats |
| GET | `/getsentcampaigndetails?campaignkey={key}` | Get sent campaign details |
| GET | `/getbounceddetails?campaignkey={key}` | Get bounced emails |

---

## Analytics

**Base URL**: `https://analyticsapi.zoho.com/restapi/v2`

### Views

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workspaces` | Get all workspaces |
| GET | `/workspaces/{workspaceId}/views` | Get workspace views |
| GET | `/workspaces/{workspaceId}/views/{viewId}` | Get view data |
| POST | `/workspaces/{workspaceId}/views` | Create view |
| PUT | `/workspaces/{workspaceId}/views/{viewId}` | Update view |
| DELETE | `/workspaces/{workspaceId}/views/{viewId}` | Delete view |

### Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/workspaces/{workspaceId}/views/{viewId}/data` | Add data to view |
| PUT | `/workspaces/{workspaceId}/views/{viewId}/data` | Update view data |
| DELETE | `/workspaces/{workspaceId}/views/{viewId}/data` | Delete view data |

### Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workspaces/{workspaceId}/views/{viewId}/export` | Export view data |
| GET | `/workspaces/{workspaceId}/views/{viewId}/export/{format}` | Export in format (PDF, XLS, CSV) |

---

## SalesIQ

**Base URL**: `https://salesiq.zoho.com/api/v2`

### Visitors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{portalName}/visitors` | Get all visitors |
| GET | `/{portalName}/visitors/{visitorId}` | Get visitor details |
| POST | `/{portalName}/visitors/{visitorId}/ban` | Ban visitor |

### Chats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{portalName}/chats` | Get all chats |
| GET | `/{portalName}/chats/{chatId}` | Get chat details |
| GET | `/{portalName}/chats/{chatId}/messages` | Get chat messages |
| POST | `/{portalName}/chats/{chatId}/messages` | Send chat message |

### Operators

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{portalName}/operators` | Get all operators |
| GET | `/{portalName}/operators/{operatorId}` | Get operator details |
| PUT | `/{portalName}/operators/{operatorId}/status` | Update operator status |

---

## Flow

**Base URL**: `https://flow.zoho.com/api/v1`

### Flows

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/flows` | Get all flows |
| GET | `/flows/{flowId}` | Get flow details |
| POST | `/flows/{flowId}/trigger` | Trigger flow |
| POST | `/flows` | Create flow |
| PUT | `/flows/{flowId}` | Update flow |
| DELETE | `/flows/{flowId}` | Delete flow |

### Executions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/flows/{flowId}/executions` | Get flow executions |
| GET | `/flows/{flowId}/executions/{executionId}` | Get execution details |

---

## Books

**Base URL**: `https://www.zohoapis.com/books/v3`

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts?organization_id={orgId}` | Get all contacts |
| GET | `/contacts/{contactId}?organization_id={orgId}` | Get contact |
| POST | `/contacts?organization_id={orgId}` | Create contact |
| PUT | `/contacts/{contactId}?organization_id={orgId}` | Update contact |
| DELETE | `/contacts/{contactId}?organization_id={orgId}` | Delete contact |

### Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices?organization_id={orgId}` | Get all invoices |
| GET | `/invoices/{invoiceId}?organization_id={orgId}` | Get invoice |
| POST | `/invoices?organization_id={orgId}` | Create invoice |
| PUT | `/invoices/{invoiceId}?organization_id={orgId}` | Update invoice |
| DELETE | `/invoices/{invoiceId}?organization_id={orgId}` | Delete invoice |
| POST | `/invoices/{invoiceId}/status/sent?organization_id={orgId}` | Mark as sent |
| POST | `/invoices/{invoiceId}/status/void?organization_id={orgId}` | Void invoice |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/items?organization_id={orgId}` | Get all items |
| GET | `/items/{itemId}?organization_id={orgId}` | Get item |
| POST | `/items?organization_id={orgId}` | Create item |
| PUT | `/items/{itemId}?organization_id={orgId}` | Update item |
| DELETE | `/items/{itemId}?organization_id={orgId}` | Delete item |

### Bills

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bills?organization_id={orgId}` | Get all bills |
| GET | `/bills/{billId}?organization_id={orgId}` | Get bill |
| POST | `/bills?organization_id={orgId}` | Create bill |
| PUT | `/bills/{billId}?organization_id={orgId}` | Update bill |
| DELETE | `/bills/{billId}?organization_id={orgId}` | Delete bill |

---

## Desk

**Base URL**: `https://desk.zoho.com/api/v1`

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets?orgId={orgId}` | Get all tickets |
| GET | `/tickets/{ticketId}?orgId={orgId}` | Get ticket |
| POST | `/tickets?orgId={orgId}` | Create ticket |
| PATCH | `/tickets/{ticketId}?orgId={orgId}` | Update ticket |
| DELETE | `/tickets/{ticketId}?orgId={orgId}` | Delete ticket |

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contacts?orgId={orgId}` | Get all contacts |
| GET | `/contacts/{contactId}?orgId={orgId}` | Get contact |
| POST | `/contacts?orgId={orgId}` | Create contact |
| PATCH | `/contacts/{contactId}?orgId={orgId}` | Update contact |
| DELETE | `/contacts/{contactId}?orgId={orgId}` | Delete contact |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/agents?orgId={orgId}` | Get all agents |
| GET | `/agents/{agentId}?orgId={orgId}` | Get agent |

---

## Projects

**Base URL**: `https://projectsapi.zoho.com/api/v3`

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portal/{portalId}/projects` | Get all projects |
| GET | `/portal/{portalId}/projects/{projectId}` | Get project |
| POST | `/portal/{portalId}/projects` | Create project |
| POST | `/portal/{portalId}/projects/{projectId}` | Update project |
| DELETE | `/portal/{portalId}/projects/{projectId}` | Delete project |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portal/{portalId}/projects/{projectId}/tasks` | Get all tasks |
| GET | `/portal/{portalId}/projects/{projectId}/tasks/{taskId}` | Get task |
| POST | `/portal/{portalId}/projects/{projectId}/tasks` | Create task |
| POST | `/portal/{portalId}/projects/{projectId}/tasks/{taskId}` | Update task |
| DELETE | `/portal/{portalId}/projects/{projectId}/tasks/{taskId}` | Delete task |

### Milestones

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portal/{portalId}/projects/{projectId}/milestones` | Get all milestones |
| GET | `/portal/{portalId}/milestones/{milestoneId}` | Get milestone |
| POST | `/portal/{portalId}/projects/{projectId}/milestones` | Create milestone |
| POST | `/portal/{portalId}/milestones/{milestoneId}` | Update milestone |
| DELETE | `/portal/{portalId}/milestones/{milestoneId}` | Delete milestone |

---

## People

**Base URL**: `https://people.zoho.com/people/api`

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms/employee/getRecords` | Get all employees |
| GET | `/forms/employee/getRecordById?recordId={id}` | Get employee |
| POST | `/forms/employee/insertRecord` | Create employee |
| POST | `/forms/employee/updateRecord` | Update employee |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance/getAttendanceEntries` | Get attendance entries |
| POST | `/attendance/checkIn` | Check in |
| POST | `/attendance/checkOut` | Check out |

### Leave

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leave/getLeaveTypeDetails` | Get leave types |
| GET | `/leave/getLeaves` | Get leave requests |
| POST | `/leave/applyLeave` | Apply for leave |
| POST | `/leave/approveLeave` | Approve leave |

---

## Recruit

**Base URL**: `https://recruit.zoho.com/recruit/v2`

### Candidates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Candidates` | Get all candidates |
| GET | `/Candidates/{id}` | Get candidate |
| POST | `/Candidates` | Create candidates |
| PUT | `/Candidates/{id}` | Update candidate |
| DELETE | `/Candidates/{id}` | Delete candidate |

### Job Openings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/JobOpenings` | Get all job openings |
| GET | `/JobOpenings/{id}` | Get job opening |
| POST | `/JobOpenings` | Create job opening |
| PUT | `/JobOpenings/{id}` | Update job opening |
| DELETE | `/JobOpenings/{id}` | Delete job opening |

### Interviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Interviews` | Get all interviews |
| GET | `/Interviews/{id}` | Get interview |
| POST | `/Interviews` | Schedule interview |
| PUT | `/Interviews/{id}` | Update interview |

---

## Inventory

**Base URL**: `https://inventory.zoho.com/api/v1`

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/items?organization_id={orgId}` | Get all items |
| GET | `/items/{itemId}?organization_id={orgId}` | Get item |
| POST | `/items?organization_id={orgId}` | Create item |
| PUT | `/items/{itemId}?organization_id={orgId}` | Update item |
| DELETE | `/items/{itemId}?organization_id={orgId}` | Delete item |

### Sales Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salesorders?organization_id={orgId}` | Get all sales orders |
| GET | `/salesorders/{soId}?organization_id={orgId}` | Get sales order |
| POST | `/salesorders?organization_id={orgId}` | Create sales order |
| PUT | `/salesorders/{soId}?organization_id={orgId}` | Update sales order |
| DELETE | `/salesorders/{soId}?organization_id={orgId}` | Delete sales order |

### Purchase Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/purchaseorders?organization_id={orgId}` | Get all purchase orders |
| GET | `/purchaseorders/{poId}?organization_id={orgId}` | Get purchase order |
| POST | `/purchaseorders?organization_id={orgId}` | Create purchase order |
| PUT | `/purchaseorders/{poId}?organization_id={orgId}` | Update purchase order |

---

## Sign

**Base URL**: `https://sign.zoho.com/api/v1`

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/requests` | Get all sign requests |
| GET | `/requests/{requestId}` | Get sign request |
| POST | `/requests` | Create sign request |
| PUT | `/requests/{requestId}` | Update sign request |
| DELETE | `/requests/{requestId}` | Delete sign request |
| POST | `/requests/{requestId}/submit` | Submit for signing |
| POST | `/requests/{requestId}/remind` | Send reminder |

### Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/templates` | Get all templates |
| GET | `/templates/{templateId}` | Get template |
| POST | `/templates/{templateId}/createdocument` | Create document from template |

---

## Forms

**Base URL**: `https://forms.zoho.com/api/v1`

### Forms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forms` | Get all forms |
| GET | `/forms/{formLinkName}` | Get form details |
| GET | `/forms/{formLinkName}/entries` | Get form entries |

### Submissions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/forms/{formLinkName}/entries` | Submit form entry |
| GET | `/forms/{formLinkName}/entries/{entryId}` | Get entry details |

---

## Survey

**Base URL**: `https://survey.zoho.com/api/v1`

### Surveys

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/surveys` | Get all surveys |
| GET | `/surveys/{surveyId}` | Get survey details |
| GET | `/surveys/{surveyId}/responses` | Get survey responses |

---

## Sheet

**Base URL**: `https://sheet.zoho.com/api/v2`

### Workbooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workbooks` | Get all workbooks |
| GET | `/workbooks/{workbookId}` | Get workbook |
| POST | `/workbooks` | Create workbook |
| DELETE | `/workbooks/{workbookId}` | Delete workbook |

### Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workbooks/{workbookId}/sheets/{sheetId}/records` | Get records |
| POST | `/workbooks/{workbookId}/sheets/{sheetId}/records` | Add records |
| PUT | `/workbooks/{workbookId}/sheets/{sheetId}/records` | Update records |

---

## Writer

**Base URL**: `https://writer.zoho.com/api/v1`

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents` | Get all documents |
| GET | `/documents/{documentId}` | Get document |
| POST | `/documents` | Create document |
| PUT | `/documents/{documentId}` | Update document |
| DELETE | `/documents/{documentId}` | Delete document |
| GET | `/documents/{documentId}/content` | Get document content |
| POST | `/documents/{documentId}/merge` | Merge document |

---

## Show

**Base URL**: `https://show.zoho.com/api/v1`

### Presentations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/presentations` | Get all presentations |
| GET | `/presentations/{presentationId}` | Get presentation |
| POST | `/presentations` | Create presentation |
| PUT | `/presentations/{presentationId}` | Update presentation |
| DELETE | `/presentations/{presentationId}` | Delete presentation |

---

## Mail

**Base URL**: `https://mail.zoho.com/api`

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts/{accountId}/messages` | Get messages |
| GET | `/accounts/{accountId}/messages/{messageId}` | Get message |
| POST | `/accounts/{accountId}/messages` | Send message |
| DELETE | `/accounts/{accountId}/messages/{messageId}` | Delete message |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts/{accountId}/folders` | Get folders |
| POST | `/accounts/{accountId}/folders` | Create folder |
| PUT | `/accounts/{accountId}/folders/{folderId}` | Update folder |

---

## Meeting

**Base URL**: `https://meeting.zoho.com/api/v2`

### Meetings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings` | Get all meetings |
| GET | `/meetings/{meetingKey}` | Get meeting details |
| POST | `/meetings` | Schedule meeting |
| PUT | `/meetings/{meetingKey}` | Update meeting |
| DELETE | `/meetings/{meetingKey}` | Delete meeting |

### Participants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings/{meetingKey}/participants` | Get participants |
| POST | `/meetings/{meetingKey}/participants` | Add participants |

---

## Cliq

**Base URL**: `https://cliq.zoho.com/api/v2`

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/channelsbyname/{channelName}/message` | Send channel message |
| POST | `/chats/{chatId}/message` | Send chat message |
| POST | `/buddies/{userId}/message` | Send direct message |

### Channels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/channels` | Get all channels |
| POST | `/channels` | Create channel |
| GET | `/channels/{channelId}` | Get channel details |

---

## Connect

**Base URL**: `https://connect.zoho.com/api/v1`

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feeds` | Get feed posts |
| GET | `/posts/{postId}` | Get post |
| POST | `/posts` | Create post |
| PUT | `/posts/{postId}` | Update post |
| DELETE | `/posts/{postId}` | Delete post |

### Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups` | Get all groups |
| GET | `/groups/{groupId}` | Get group details |
| POST | `/groups` | Create group |

---

## Bookings

**Base URL**: `https://bookings.zoho.com/api/v1`

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/services` | Get all services |
| GET | `/services/{serviceId}` | Get service details |
| POST | `/services` | Create service |
| PUT | `/services/{serviceId}` | Update service |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments` | Get all appointments |
| GET | `/appointments/{appointmentId}` | Get appointment |
| POST | `/appointments` | Book appointment |
| PUT | `/appointments/{appointmentId}` | Update appointment |
| DELETE | `/appointments/{appointmentId}` | Cancel appointment |

---

## Creator

**Base URL**: `https://creator.zoho.com/api/v2`

### Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{accountOwner}/{appLinkName}/report/{reportLinkName}` | Get records |
| GET | `/{accountOwner}/{appLinkName}/report/{reportLinkName}/{recordId}` | Get record |
| POST | `/{accountOwner}/{appLinkName}/form/{formLinkName}` | Add record |
| PATCH | `/{accountOwner}/{appLinkName}/report/{reportLinkName}/{recordId}` | Update record |
| DELETE | `/{accountOwner}/{appLinkName}/report/{reportLinkName}/{recordId}` | Delete record |

### ZCQL

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/{accountOwner}/{appLinkName}/query` | Execute ZCQL query |

---

## WorkDrive

**Base URL**: `https://www.zohoapis.com/workdrive/api/v1`

### Files

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/files/{fileId}` | Get file details |
| POST | `/upload` | Upload file |
| GET | `/download/{fileId}` | Download file |
| PUT | `/files/{fileId}` | Update file |
| DELETE | `/files/{fileId}` | Delete file |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/folders/{folderId}` | Get folder details |
| POST | `/folders` | Create folder |
| PUT | `/folders/{folderId}` | Update folder |
| DELETE | `/folders/{folderId}` | Delete folder |

---

## Backstage

**Base URL**: `https://backstage.zoho.com/api/v1`

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portal/{portalName}/events` | Get all events |
| GET | `/portal/{portalName}/events/{eventKey}` | Get event details |
| POST | `/portal/{portalName}/events` | Create event |
| PUT | `/portal/{portalName}/events/{eventKey}` | Update event |

### Attendees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portal/{portalName}/events/{eventKey}/attendees` | Get attendees |
| POST | `/portal/{portalName}/events/{eventKey}/attendees` | Add attendee |

---

## Sprints

**Base URL**: `https://sprints.zoho.com/api`

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/team/{teamId}/projects` | Get all projects |
| POST | `/team/{teamId}/projects` | Create project |

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/team/{teamId}/projects/{projectId}/items` | Get items |
| POST | `/team/{teamId}/projects/{projectId}/items` | Create item |
| PATCH | `/team/{teamId}/projects/{projectId}/items/{itemId}` | Update item |

---

## Invoice

**Base URL**: `https://invoice.zoho.com/api/v3`

### Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices?organization_id={orgId}` | Get all invoices |
| GET | `/invoices/{invoiceId}?organization_id={orgId}` | Get invoice |
| POST | `/invoices?organization_id={orgId}` | Create invoice |
| PUT | `/invoices/{invoiceId}?organization_id={orgId}` | Update invoice |

---

## Social

**Base URL**: `https://social.zoho.com/api/v2`

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/brands/{brandId}/posts` | Get posts |
| POST | `/brands/{brandId}/posts` | Create post |
| GET | `/brands/{brandId}/posts/{postId}` | Get post details |

---

## Expense

**Base URL**: `https://expense.zoho.com/api/v1`

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses?organization_id={orgId}` | Get all expenses |
| GET | `/expenses/{expenseId}?organization_id={orgId}` | Get expense |
| POST | `/expenses?organization_id={orgId}` | Create expense |
| PUT | `/expenses/{expenseId}?organization_id={orgId}` | Update expense |

---

## Subscriptions

**Base URL**: `https://subscriptions.zoho.com/api/v1`

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscriptions?organization_id={orgId}` | Get all subscriptions |
| GET | `/subscriptions/{subscriptionId}?organization_id={orgId}` | Get subscription |
| POST | `/subscriptions?organization_id={orgId}` | Create subscription |
| PUT | `/subscriptions/{subscriptionId}?organization_id={orgId}` | Update subscription |
| POST | `/subscriptions/{subscriptionId}/cancel?organization_id={orgId}` | Cancel subscription |

---

## Commerce

**Base URL**: `https://commerce.zoho.com/api/v1`

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/{productId}` | Get product |
| POST | `/products` | Create product |
| PUT | `/products/{productId}` | Update product |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get all orders |
| GET | `/orders/{orderId}` | Get order |
| POST | `/orders` | Create order |
| PUT | `/orders/{orderId}` | Update order |

---

## Sites

**Base URL**: `https://sites.zoho.com/api/v1`

### Sites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sites` | Get all sites |
| GET | `/sites/{siteId}` | Get site details |

---

## PageSense

**Base URL**: `https://pagesense.zoho.com/api/v1`

### Experiments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/experiments` | Get all experiments |
| GET | `/experiments/{experimentId}` | Get experiment details |
| POST | `/experiments` | Create experiment |

---

## Webinar

**Base URL**: `https://webinar.zoho.com/api/v1`

### Webinars

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/webinars` | Get all webinars |
| GET | `/webinars/{webinarKey}` | Get webinar details |
| POST | `/webinars` | Create webinar |
| PUT | `/webinars/{webinarKey}` | Update webinar |

---

## Lens

**Base URL**: `https://lens.zoho.com/api/v1`

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports` | Get all reports |
| GET | `/reports/{reportId}` | Get report data |

---

## Assist

**Base URL**: `https://assist.zoho.com/api/v1`

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions` | Get all sessions |
| POST | `/sessions` | Create session |
| GET | `/sessions/{sessionId}` | Get session details |

---

## Vault

**Base URL**: `https://vault.zoho.com/api/v1`

### Secrets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/secrets` | Get all secrets |
| GET | `/secrets/{secretId}` | Get secret |
| POST | `/secrets` | Create secret |
| DELETE | `/secrets/{secretId}` | Delete secret |

---

## Learn

**Base URL**: `https://learn.zoho.com/api/v1`

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Get all courses |
| GET | `/courses/{courseId}` | Get course details |

---

## BugTracker

**Base URL**: `https://projectsapi.zoho.com/api/v3`

### Bugs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portal/{portalId}/projects/{projectId}/bugs` | Get bugs |
| POST | `/portal/{portalId}/projects/{projectId}/bugs` | Create bug |
| POST | `/portal/{portalId}/projects/{projectId}/bugs/{bugId}` | Update bug |

---

## TestHub

**Base URL**: `https://testhub.zoho.com/api/v1`

### Tests

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tests` | Get all tests |
| GET | `/tests/{testId}` | Get test details |
| POST | `/tests` | Create test |

---

## Notebook

**Base URL**: `https://notebook.zoho.com/api/v1`

### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get all notes |
| GET | `/notes/{noteId}` | Get note |
| POST | `/notes` | Create note |
| PUT | `/notes/{noteId}` | Update note |

---

## Office Integrator

**Base URL**: `https://sheet.zoho.com/api/v2`

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/document` | Create document session |
| POST | `/sheet` | Create sheet session |
| POST | `/show` | Create presentation session |

---

## Workerly

**Base URL**: `https://workerly.zoho.com/api/v1`

### Workers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workers` | Get all workers |
| POST | `/workers` | Create worker |

---

## IoT

**Base URL**: `https://iot.zoho.com/api/v1`

### Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/devices` | Get all devices |
| GET | `/devices/{deviceId}` | Get device details |
| POST | `/devices/{deviceId}/commands` | Send command |

---

## Thrive

**Base URL**: `https://thrive.zoho.com/api/v1`

### Wellness

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activities` | Get activities |
| POST | `/activities` | Log activity |

---

## DataPrep

**Base URL**: `https://dataprep.zoho.com/api/v1`

### Pipelines

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pipelines` | Get all pipelines |
| POST | `/pipelines/{pipelineId}/run` | Run pipeline |

---

## Catalyst

**Base URL**: `https://catalyst.zoho.com/baas/v1`

### Data Store

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/table/{tableId}/row` | Get all rows |
| POST | `/table/{tableId}/row` | Insert row |
| PUT | `/table/{tableId}/row/{rowId}` | Update row |
| DELETE | `/table/{tableId}/row/{rowId}` | Delete row |

### Functions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/project/{projectId}/function/{functionId}/execute` | Execute function |

---

## Bigin

**Base URL**: `https://www.zohoapis.com/bigin/v1`

### Contacts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Contacts` | Get all contacts |
| GET | `/Contacts/{id}` | Get contact |
| POST | `/Contacts` | Create contacts |
| PUT | `/Contacts/{id}` | Update contact |

---

## Marketing Automation

**Base URL**: `https://www.zohoapis.com/marketingautomation/v1`

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | Get all leads |
| POST | `/leads` | Create lead |
| GET | `/leads/{leadId}` | Get lead details |

---

## Finance Plus

**Base URL**: `https://financeplus.zoho.com/api/v1`

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts` | Get all accounts |
| POST | `/accounts` | Create account |

---

## Payroll

**Base URL**: `https://payroll.zoho.com/api/v1`

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | Get all employees |
| POST | `/employees` | Create employee |

### Payroll

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payrolls` | Get payrolls |
| POST | `/payrolls/{payrollId}/run` | Run payroll |

---

**Last Updated**: December 2025
**Total Products**: 51
**Total Endpoints**: 500+
