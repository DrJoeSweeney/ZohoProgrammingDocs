# Integration Patterns for Zoho Products

## Overview

This guide provides patterns for integrating multiple Zoho products together and with external systems.

---

## Table of Contents

1. [CRM + Books Integration](#crm--books-integration)
2. [CRM + Desk Integration](#crm--desk-integration)
3. [Desk + Projects Integration](#desk--projects-integration)
4. [Creator + Multi-Product Integration](#creator--multi-product-integration)
5. [External System Integration](#external-system-integration)

---

## CRM + Books Integration

### Pattern: Sync Customers Between CRM and Books

```javascript
async function syncCRMContactToBooks(contactId) {
  // Get contact from CRM
  const contact = await zohoCRM.getRecord('Contacts', contactId);

  // Transform to Books format
  const customer = {
    contact_name: `${contact.First_Name} ${contact.Last_Name}`,
    company_name: contact.Account_Name?.name || '',
    customer_email: contact.Email,
    customer_phone: contact.Phone,
    billing_address: {
      attention: `${contact.First_Name} ${contact.Last_Name}`,
      address: contact.Mailing_Street,
      city: contact.Mailing_City,
      state: contact.Mailing_State,
      zip: contact.Mailing_Zip,
      country: contact.Mailing_Country
    }
  };

  // Create customer in Books
  const result = await zohoBooks.createRecord('contacts', customer, orgId);

  // Store Books customer ID in CRM
  await zohoCRM.updateRecord('Contacts', contactId, {
    Books_Customer_ID: result.contact.contact_id
  });

  return result;
}
```

### Pattern: Create Invoice When Deal is Closed

```javascript
async function createInvoiceForClosedDeal(dealId) {
  // Get deal details from CRM
  const deal = await zohoCRM.getRecord('Deals', dealId);

  if (deal.Stage !== 'Closed Won') {
    throw new Error('Deal is not closed won');
  }

  // Get associated contact
  const contact = await zohoCRM.getRecord('Contacts', deal.Contact_Id.id);

  // Get Books customer ID or create customer
  let booksCustomerId = contact.Books_Customer_ID;

  if (!booksCustomerId) {
    const customer = await syncCRMContactToBooks(contact.id);
    booksCustomerId = customer.contact.contact_id;
  }

  // Get deal products
  const products = await zohoCRM.getRelatedRecords('Deals', dealId, 'Products');

  // Create invoice in Books
  const invoice = {
    customer_id: booksCustomerId,
    invoice_number: `INV-${deal.Deal_Name.replace(/[^a-zA-Z0-9]/g, '')}`,
    date: new Date().toISOString().split('T')[0],
    line_items: products.map(p => ({
      item_id: p.Books_Item_ID,
      quantity: p.Quantity,
      rate: p.List_Price
    }))
  };

  const result = await zohoBooks.createRecord('invoices', invoice, orgId);

  // Update deal with invoice reference
  await zohoCRM.updateRecord('Deals', dealId, {
    Books_Invoice_ID: result.invoice.invoice_id,
    Books_Invoice_Number: result.invoice.invoice_number
  });

  return result;
}
```

---

## CRM + Desk Integration

### Pattern: Create Support Ticket from CRM Lead

```javascript
async function createTicketFromLead(leadId) {
  // Get lead from CRM
  const lead = await zohoCRM.getRecord('Leads', leadId);

  // Find or create contact in Desk
  let deskContactId = lead.Desk_Contact_ID;

  if (!deskContactId) {
    const deskContact = await zohoDesk.createRecord('contacts', {
      firstName: lead.First_Name,
      lastName: lead.Last_Name,
      email: lead.Email,
      phone: lead.Phone
    }, orgId);

    deskContactId = deskContact.id;

    // Store Desk contact ID in CRM
    await zohoCRM.updateRecord('Leads', leadId, {
      Desk_Contact_ID: deskContactId
    });
  }

  // Create ticket
  const ticket = {
    contactId: deskContactId,
    subject: `Inquiry from ${lead.First_Name} ${lead.Last_Name}`,
    departmentId: 'SALES_DEPARTMENT_ID',
    description: `Lead inquiry for: ${lead.Company}\nLead Source: ${lead.Lead_Source}`,
    status: 'Open',
    priority: 'High'
  };

  const result = await zohoDesk.createRecord('tickets', ticket, orgId);

  // Update lead with ticket reference
  await zohoCRM.updateRecord('Leads', leadId, {
    Desk_Ticket_ID: result.id,
    Desk_Ticket_Number: result.ticketNumber
  });

  return result;
}
```

### Pattern: Update CRM When Ticket is Closed

```javascript
async function handleTicketClosed(ticketId) {
  // Get ticket from Desk
  const ticket = await zohoDesk.getRecord('tickets', ticketId, orgId);

  // Find related CRM record
  const crmRecordId = ticket.cf_crm_lead_id || ticket.cf_crm_contact_id;
  const crmModule = ticket.cf_crm_lead_id ? 'Leads' : 'Contacts';

  if (!crmRecordId) {
    console.log('No CRM record linked to ticket');
    return;
  }

  // Update CRM record
  await zohoCRM.updateRecord(crmModule, crmRecordId, {
    Last_Support_Ticket_Status: 'Closed',
    Last_Support_Ticket_Date: ticket.closedTime,
    Support_Notes: ticket.resolution
  });

  // If lead, check if should be qualified
  if (crmModule === 'Leads') {
    await zohoCRM.updateRecord('Leads', crmRecordId, {
      Lead_Status: 'Qualified'
    });
  }
}
```

---

## Desk + Projects Integration

### Pattern: Create Project Task from Support Ticket

```javascript
async function createTaskFromTicket(ticketId) {
  // Get ticket from Desk
  const ticket = await zohoDesk.getRecord('tickets', ticketId, orgId);

  // Only create task for bug/feature tickets
  if (!['Bug', 'Feature Request'].includes(ticket.category)) {
    return;
  }

  // Create task in Projects
  const task = {
    name: `[${ticket.category}] ${ticket.subject}`,
    description: ticket.description,
    priority: ticket.priority,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    custom_fields: [
      {
        label_name: 'Desk Ticket ID',
        value: ticketId
      },
      {
        label_name: 'Ticket Number',
        value: ticket.ticketNumber
      }
    ]
  };

  const result = await zohoProjects.createRecord(
    'tasks',
    task,
    portalId,
    projectId
  );

  // Update ticket with task reference
  await zohoDesk.updateRecord('tickets', ticketId, {
    cf_project_task_id: result.tasks[0].id,
    cf_project_task_link: result.tasks[0].link
  }, orgId);

  return result;
}
```

---

## Creator + Multi-Product Integration

### Pattern: Creator as Integration Hub

```javascript
// Deluge script in Creator application

// Triggered when new order is submitted
void OnOrderSubmit(string orderId)
{
    // Get order details
    order = Creator_App.Orders[ID == orderId];

    // 1. Create contact in CRM if not exists
    crmContactId = order.CRM_Contact_ID;

    if(crmContactId == null || crmContactId == "")
    {
        contactData = {
            "First_Name": order.Customer_First_Name,
            "Last_Name": order.Customer_Last_Name,
            "Email": order.Customer_Email,
            "Phone": order.Customer_Phone
        };

        crmResponse = zoho.crm.createRecord("Contacts", contactData);

        if(crmResponse.get("id") != null)
        {
            crmContactId = crmResponse.get("id");

            // Update Creator record
            order.CRM_Contact_ID = crmContactId;
        }
    }

    // 2. Create deal in CRM
    dealData = {
        "Deal_Name": "Order " + order.Order_Number,
        "Stage": "Qualification",
        "Amount": order.Total_Amount,
        "Contact_Id": crmContactId,
        "Closing_Date": (today + 30).toString("yyyy-MM-dd")
    };

    dealResponse = zoho.crm.createRecord("Deals", dealData);
    dealId = dealResponse.get("id");

    // 3. Create invoice in Books
    booksInvoice = {
        "customer_id": order.Books_Customer_ID,
        "line_items": [
            {
                "item_id": order.Product_Books_ID,
                "quantity": order.Quantity,
                "rate": order.Unit_Price
            }
        ]
    };

    booksResponse = zoho.books.createRecord("invoices", "YOUR_ORG_ID", booksInvoice);
    invoiceId = booksResponse.get("invoice").get("invoice_id");

    // 4. Create support ticket in Desk (if high-value order)
    if(order.Total_Amount > 10000)
    {
        ticketData = {
            "contactId": order.Desk_Contact_ID,
            "subject": "VIP Order - " + order.Order_Number,
            "departmentId": "VIP_DEPT_ID",
            "priority": "High",
            "description": "High-value order placed. Contact customer within 24 hours."
        };

        deskResponse = zoho.desk.createRecord("tickets", "YOUR_ORG_ID", ticketData);
    }

    // 5. Send notifications
    sendmail
    [
        from: zoho.adminuserid
        to: order.Customer_Email
        subject: "Order Confirmation - " + order.Order_Number
        message: "Thank you for your order! Your order number is " + order.Order_Number
    ]

    // 6. Update order status
    order.Status = "Processing";
    order.CRM_Deal_ID = dealId;
    order.Books_Invoice_ID = invoiceId;
}
```

---

## External System Integration

### Pattern: Sync with External CRM (Salesforce, HubSpot, etc.)

```javascript
class ExternalCRMSync {
  constructor(zohoAPI, externalAPI) {
    this.zoho = zohoAPI;
    this.external = externalAPI;
  }

  async syncContactToExternal(zohoContactId) {
    // Get contact from Zoho
    const zohoContact = await this.zoho.getRecord('Contacts', zohoContactId);

    // Transform to external format
    const externalContact = this.transformToExternal(zohoContact);

    // Check if contact exists in external system
    const externalId = zohoContact.External_System_ID;

    if (externalId) {
      // Update existing
      await this.external.updateContact(externalId, externalContact);
    } else {
      // Create new
      const result = await this.external.createContact(externalContact);

      // Store external ID in Zoho
      await this.zoho.updateRecord('Contacts', zohoContactId, {
        External_System_ID: result.id
      });
    }
  }

  transformToExternal(zohoContact) {
    return {
      first_name: zohoContact.First_Name,
      last_name: zohoContact.Last_Name,
      email: zohoContact.Email,
      phone: zohoContact.Phone,
      company: zohoContact.Account_Name?.name,
      custom_fields: {
        zoho_contact_id: zohoContact.id,
        sync_date: new Date().toISOString()
      }
    };
  }
}
```

### Pattern: Webhook-Based Real-Time Sync

```javascript
// Zoho webhook handler
app.post('/webhooks/zoho/crm', async (req, res) => {
  const webhook = req.body;

  // Respond immediately
  res.status(200).send('OK');

  // Process webhook
  if (webhook.module === 'Contacts') {
    switch (webhook.operation) {
      case 'create':
        await syncNewContactToExternal(webhook.ids[0]);
        break;

      case 'update':
        await syncUpdatedContactToExternal(webhook.ids[0]);
        break;

      case 'delete':
        await deleteContactFromExternal(webhook.ids[0]);
        break;
    }
  }
});

// External system webhook handler
app.post('/webhooks/external/contacts', async (req, res) => {
  const webhook = req.body;

  // Respond immediately
  res.status(200).send('OK');

  // Process webhook
  switch (webhook.event) {
    case 'contact.created':
      await syncNewContactToZoho(webhook.contact_id);
      break;

    case 'contact.updated':
      await syncUpdatedContactToZoho(webhook.contact_id);
      break;

    case 'contact.deleted':
      await deleteContactFromZoho(webhook.contact_id);
      break;
  }
});

async function syncNewContactToExternal(zohoContactId) {
  const zohoContact = await zohoCRM.getRecord('Contacts', zohoContactId);

  const externalContact = {
    first_name: zohoContact.First_Name,
    last_name: zohoContact.Last_Name,
    email: zohoContact.Email,
    zoho_id: zohoContactId
  };

  const result = await externalAPI.createContact(externalContact);

  // Store external ID in Zoho
  await zohoCRM.updateRecord('Contacts', zohoContactId, {
    External_System_ID: result.id
  });
}
```

### Pattern: Scheduled Batch Sync

```javascript
const cron = require('node-cron');

// Run sync every hour
cron.schedule('0 * * * *', async () => {
  console.log('Starting scheduled sync');

  try {
    await syncModifiedRecords();
    console.log('Sync completed successfully');
  } catch (error) {
    console.error('Sync failed:', error);
  }
});

async function syncModifiedRecords() {
  const lastSyncTime = await getLastSyncTime();

  // Get modified contacts from Zoho
  const modifiedContacts = await zohoCRM.getModifiedRecords(
    'Contacts',
    lastSyncTime
  );

  for (const contact of modifiedContacts) {
    try {
      if (contact.External_System_ID) {
        // Update in external system
        await externalAPI.updateContact(
          contact.External_System_ID,
          transformContact(contact)
        );
      } else {
        // Create in external system
        const result = await externalAPI.createContact(transformContact(contact));

        // Store external ID
        await zohoCRM.updateRecord('Contacts', contact.id, {
          External_System_ID: result.id
        });
      }
    } catch (error) {
      console.error(`Failed to sync contact ${contact.id}:`, error);
    }
  }

  // Update last sync time
  await setLastSyncTime(new Date());
}
```

---

**Last Updated**: December 2025
**Guide Version**: 1.0
