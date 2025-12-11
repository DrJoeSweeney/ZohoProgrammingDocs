# Deluge File Operations

File handling in Deluge allows you to work with files from URLs, cloud storage, and attachments. This guide covers all file operations supported in Deluge scripts.

## Table of Contents

- [Overview](#overview)
- [File Data Type](#file-data-type)
- [Fetching Files from URLs](#fetching-files-from-urls)
- [File Uploads](#file-uploads)
- [File Attachments](#file-attachments)
- [Cloud Storage Integration](#cloud-storage-integration)
- [File Downloads](#file-downloads)
- [Working with File URLs](#working-with-file-urls)
- [File Size and Type](#file-size-and-type)
- [Common Use Cases](#common-use-cases)
- [Limitations](#limitations)
- [Best Practices](#best-practices)

## Overview

Deluge provides file handling capabilities for various scenarios across Zoho products.

### Key Capabilities

- **Fetch from URL**: Download files from web URLs
- **Cloud integration**: Access files from Zoho WorkDrive, Google Drive, etc.
- **Email attachments**: Attach files to emails
- **CRM attachments**: Upload files to CRM records
- **File downloads**: Generate and provide files for download
- **URL handling**: Work with file URLs and links

### Important Note

Files in Deluge **cannot be created directly** in the script. Files must be:
- Fetched from external URLs
- Retrieved from cloud storage
- Accessed from existing records
- Uploaded via forms/interfaces

## File Data Type

The File data type represents file objects in Deluge.

### Creating File Objects

```javascript
// Fetch file from URL (most common method)
imageFile = invokeurl
[
    url: "https://example.com/image.png"
    type: GET
];

// File from Zoho WorkDrive (with connection)
documentFile = invokeurl
[
    url: "https://www.zohoapis.com/workdrive/api/v1/files/FILE_ID"
    type: GET
    connection: "zohoworkdrive"
];

// File cannot be created directly like this:
// file = File("data");  // NOT SUPPORTED
```

### File Properties

```javascript
// Files typically have:
// - Content (binary data)
// - Name (if available)
// - Type/Extension
// - Size (depending on context)

// Note: Property access depends on Zoho product
// Some properties may not be directly accessible
```

## Fetching Files from URLs

### invokeUrl with GET

The primary method to fetch files from web URLs.

```javascript
// Syntax
fileObject = invokeurl
[
    url: "file_url"
    type: GET
];
```

### Examples

#### Basic File Fetch

```javascript
// Fetch image from URL
imageURL = "https://example.com/logo.png";
imageFile = invokeurl
[
    url: imageURL
    type: GET
];

// Fetch PDF
pdfURL = "https://example.com/document.pdf";
pdfFile = invokeurl
[
    url: pdfURL
    type: GET
];

// Fetch CSV
csvURL = "https://example.com/data.csv";
csvFile = invokeurl
[
    url: csvURL
    type: GET
];
```

#### With Headers

```javascript
// Fetch with authentication
apiURL = "https://api.example.com/files/12345";
fileData = invokeurl
[
    url: apiURL
    type: GET
    headers: {"Authorization": "Bearer YOUR_TOKEN"}
];

// With custom headers
fileData = invokeurl
[
    url: fileURL
    type: GET
    headers: {
        "User-Agent": "Zoho-Deluge",
        "Accept": "application/pdf"
    }
];
```

#### Error Handling

```javascript
// Safe file fetch
try
{
    fileURL = "https://example.com/file.pdf";
    fileData = invokeurl
    [
        url: fileURL
        type: GET
    ];

    info "File fetched successfully";
}
catch(e)
{
    info "Error fetching file: " + e;
}
```

## File Uploads

### Upload to CRM Records

```javascript
// Attach file to CRM record
fileURL = "https://example.com/contract.pdf";
contractFile = invokeurl
[
    url: fileURL
    type: GET
];

// Upload to record
recordId = "123456789";
attachmentResponse = zoho.crm.attachFile(
    "Deals",
    recordId,
    contractFile
);

info "File attached: " + attachmentResponse;
```

### Upload via Creator

```javascript
// In Zoho Creator, files can be uploaded to file fields
// Typically done through forms, not directly in scripts

// Access uploaded file from form
uploadedFile = input.FileField;

// Use the file (e.g., store URL)
if(uploadedFile != null)
{
    fileURL = uploadedFile.getUrl();
    // Store URL in record
}
```

### Multi-file Upload

```javascript
// Upload multiple files to record
files = {file1, file2, file3};

for each file in files
{
    try
    {
        response = zoho.crm.attachFile("Deals", recordId, file);
        info "Attached: " + file;
    }
    catch(e)
    {
        info "Error attaching file: " + e;
    }
}
```

## File Attachments

### Email Attachments

#### Single Attachment

```javascript
// Fetch and attach to email
pdfURL = "https://example.com/report.pdf";
pdfFile = invokeurl
[
    url: pdfURL
    type: GET
];

// Send email with attachment
sendmail
[
    from: zoho.adminuserid
    to: "user@example.com"
    subject: "Monthly Report"
    message: "Please find attached the monthly report."
    attachments: pdfFile
]
```

#### Multiple Attachments

```javascript
// Fetch multiple files
file1 = invokeurl
[
    url: "https://example.com/report1.pdf"
    type: GET
];

file2 = invokeurl
[
    url: "https://example.com/report2.pdf"
    type: GET
];

// Send email with multiple attachments
sendmail
[
    from: zoho.adminuserid
    to: "user@example.com"
    subject: "Reports"
    message: "Please find attached reports."
    attachments: {file1, file2}
]
```

#### Dynamic Attachments

```javascript
// Build attachment list dynamically
attachments = {};

// Add files based on conditions
if(includeReport)
{
    reportFile = invokeurl
    [
        url: reportURL
        type: GET
    ];
    attachments.add(reportFile);
}

if(includeInvoice)
{
    invoiceFile = invokeurl
    [
        url: invoiceURL
        type: GET
    ];
    attachments.add(invoiceFile);
}

// Send email
if(attachments.size() > 0)
{
    sendmail
    [
        from: zoho.adminuserid
        to: customerEmail
        subject: "Your Documents"
        message: "Please find your documents attached."
        attachments: attachments
    ]
}
```

### Attach to CRM Records

```javascript
// Attach file to Lead
leadId = "123456789";
documentURL = "https://example.com/proposal.pdf";
documentFile = invokeurl
[
    url: documentURL
    type: GET
];

// Attach to CRM
zoho.crm.attachFile("Leads", leadId, documentFile);

// Attach to Contact
contactId = "987654321";
contractURL = "https://example.com/contract.pdf";
contractFile = invokeurl
[
    url: contractURL
    type: GET
];

zoho.crm.attachFile("Contacts", contactId, contractFile);

// Attach to Deal
dealId = "456789123";
presentationURL = "https://example.com/presentation.pdf";
presentationFile = invokeurl
[
    url: presentationURL
    type: GET
];

zoho.crm.attachFile("Deals", dealId, presentationFile);
```

## Cloud Storage Integration

### Zoho WorkDrive

```javascript
// Create connection in Zoho (one-time setup)
// Then use in scripts with connection name

// Fetch file from WorkDrive
workdriveFileId = "abc123xyz";
apiURL = "https://www.zohoapis.com/workdrive/api/v1/files/" + workdriveFileId;

fileData = invokeurl
[
    url: apiURL
    type: GET
    connection: "zohoworkdrive"  // Pre-configured connection
];

// Use the file
sendmail
[
    from: zoho.adminuserid
    to: "user@example.com"
    subject: "Document from WorkDrive"
    message: "Here is your document"
    attachments: fileData
]
```

### Google Drive (via API)

```javascript
// Requires OAuth connection setup

fileId = "1abc-xyz-789";
driveURL = "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media";

fileData = invokeurl
[
    url: driveURL
    type: GET
    connection: "googledrive"  // Pre-configured OAuth connection
];

// Use the file
zoho.crm.attachFile("Deals", dealId, fileData);
```

### Dropbox (via API)

```javascript
// Requires OAuth connection setup

filePath = "/Documents/contract.pdf";
apiURL = "https://content.dropboxapi.com/2/files/download";

fileData = invokeurl
[
    url: apiURL
    type: POST
    connection: "dropbox"
    headers: {
        "Dropbox-API-Arg": "{\"path\":\"" + filePath + "\"}"
    }
];

// Use the file
sendmail
[
    from: zoho.adminuserid
    to: clientEmail
    subject: "Contract"
    message: "Please review the attached contract"
    attachments: fileData
]
```

## File Downloads

### Generate Download Links

```javascript
// In Zoho Creator - Get public file URL
// (Feature availability depends on product)

fileField = record.FileField;
if(fileField != null)
{
    // Get public URL
    publicURL = fileField.getPublicUrl();
    info "Download link: " + publicURL;

    // Send link to user
    sendmail
    [
        from: zoho.adminuserid
        to: userEmail
        subject: "Your File"
        message: "Download your file: " + publicURL
    ]
}
```

### PDF Generation and Download

```javascript
// Generate PDF from template (product-specific)
// Example for Zoho CRM

recordId = "123456789";
templateId = "987654321";

// Merge template and get PDF
pdfContent = zoho.crm.mergePDF(
    "Deals",
    recordId,
    templateId
);

// Email the PDF
sendmail
[
    from: zoho.adminuserid
    to: clientEmail
    subject: "Your Proposal"
    message: "Please find your proposal attached"
    attachments: pdfContent
]
```

## Working with File URLs

### getUrl() / getPublicUrl()

```javascript
// Get file URL (availability depends on product)

// In Creator forms
uploadedFile = input.FileUpload;
if(uploadedFile != null)
{
    // Get file URL
    fileURL = uploadedFile.getUrl();
    info "File URL: " + fileURL;

    // Store URL in database
    updateMap = Map();
    updateMap.put("Document_URL", fileURL);
    // ... update record
}

// Get public URL (shareable)
publicURL = uploadedFile.getPublicUrl();
info "Public URL: " + publicURL;

// Store public URL for external access
recordData.put("Public_Document_Link", publicURL);
```

### File URL Patterns

```javascript
// CRM attachment URLs (example pattern)
// Format varies by Zoho product
crmFileURL = "https://crm.zoho.com/crm/EntityFile?id=FILE_ID";

// WorkDrive URLs
workdriveURL = "https://workdrive.zoho.com/file/FILE_ID";

// Creator file URLs
creatorURL = "https://creator.zoho.com/APP/FILE";

// Fetch file from Zoho URL
fileData = invokeurl
[
    url: zohoFileURL
    type: GET
    connection: "zoho_oauth"  // If auth required
];
```

## File Size and Type

### Checking File Properties

```javascript
// Note: Direct property access limited in Deluge
// Workarounds:

// Get file info from API response
fileURL = "https://example.com/document.pdf";
response = invokeurl
[
    url: fileURL
    type: GET
];

// Response headers may contain file info
// Access depends on API

// Validate file type by extension
fileName = "document.pdf";
if(fileName.endsWith(".pdf"))
{
    info "PDF file";
}
else if(fileName.endsWith(".jpg") || fileName.endsWith(".png"))
{
    info "Image file";
}
else if(fileName.endsWith(".doc") || fileName.endsWith(".docx"))
{
    info "Word document";
}
```

### File Size Validation

```javascript
// Check file size (in Creator forms)
uploadedFile = input.FileField;

// Size validation (exact method depends on product)
// Some products provide size in bytes

// Example validation
maxSizeBytes = 15 * 1024 * 1024;  // 15 MB
// if(uploadedFile.size() > maxSizeBytes)
// {
//     info "File too large. Maximum 15 MB allowed.";
//     // Cancel upload
// }
```

### Allowed File Types

```javascript
// Validate file type
string getFileExtension(string fileName)
{
    if(fileName.contains("."))
    {
        lastDot = fileName.lastIndexOf(".");
        return fileName.substring(lastDot + 1).toLowerCase();
    }
    return "";
}

boolean isAllowedFileType(string fileName)
{
    allowedExtensions = {"pdf", "doc", "docx", "xls", "xlsx", "jpg", "png", "gif"};
    extension = getFileExtension(fileName);
    return allowedExtensions.contains(extension);
}

// Usage
fileName = input.FileName;
if(isAllowedFileType(fileName))
{
    info "File type allowed";
    // Process file
}
else
{
    info "File type not allowed";
    // Reject upload
}
```

## Common Use Cases

### Use Case 1: Fetch and Email Invoice

```javascript
// Generate or fetch invoice PDF
invoiceId = "INV-12345";
invoiceURL = "https://api.example.com/invoices/" + invoiceId + "/pdf";

// Fetch invoice
invoicePDF = invokeurl
[
    url: invoiceURL
    type: GET
    headers: {"Authorization": "Bearer " + apiToken}
];

// Get customer email
customerEmail = record.Email;

// Send invoice
if(customerEmail != null && customerEmail != "")
{
    sendmail
    [
        from: zoho.adminuserid
        to: customerEmail
        subject: "Invoice " + invoiceId
        message: "Dear Customer,\n\nPlease find your invoice attached.\n\nThank you!"
        attachments: invoicePDF
    ]

    info "Invoice sent to: " + customerEmail;
}
```

### Use Case 2: Attach Contract to Deal

```javascript
// Fetch contract from external system
contractURL = "https://contracts.example.com/api/contracts/12345/pdf";
contractFile = invokeurl
[
    url: contractURL
    type: GET
    headers: {"API-Key": apiKey}
];

// Get deal ID
dealId = record.Deal_ID;

// Attach to CRM deal
try
{
    response = zoho.crm.attachFile("Deals", dealId, contractFile);
    info "Contract attached to deal: " + dealId;

    // Update deal status
    updateMap = Map();
    updateMap.put("Contract_Attached", true);
    updateMap.put("Contract_Date", today);
    zoho.crm.updateRecord("Deals", dealId, updateMap);
}
catch(e)
{
    info "Error attaching contract: " + e;
}
```

### Use Case 3: Bulk File Distribution

```javascript
// Distribute file to multiple contacts
documentURL = "https://example.com/newsletter.pdf";
documentFile = invokeurl
[
    url: documentURL
    type: GET
];

// Get active contacts
contacts = zoho.crm.getRecords("Contacts", 1, 200);

for each contact in contacts
{
    email = contact.get("Email");
    name = contact.get("First_Name");
    status = contact.get("Status");

    if(email != null && status == "Active")
    {
        try
        {
            sendmail
            [
                from: zoho.adminuserid
                to: email
                subject: "Monthly Newsletter"
                message: "Dear " + name + ",\n\nPlease find our monthly newsletter attached."
                attachments: documentFile
            ]

            info "Sent to: " + email;
        }
        catch(e)
        {
            info "Failed to send to " + email + ": " + e;
        }
    }
}
```

### Use Case 4: Generate and Store Report

```javascript
// Generate report PDF (example)
reportData = generateReportData();
reportHTML = buildReportHTML(reportData);

// Convert HTML to PDF (if supported by product)
// Method varies by Zoho product

// Example for Creator
pdfContent = reportHTML.toPDF();  // If available

// Get file URL
reportURL = pdfContent.getUrl();

// Store in database
reportRecord = Map();
reportRecord.put("Report_Name", "Monthly Sales Report");
reportRecord.put("Report_Date", today);
reportRecord.put("Report_URL", reportURL);
reportRecord.put("Generated_By", zoho.loginuserid);

// Create record
zoho.creator.createRecord("Reports", reportRecord);

// Email report
sendmail
[
    from: zoho.adminuserid
    to: "manager@company.com"
    subject: "Monthly Sales Report - " + today.toString("MMM yyyy")
    message: "Please find the monthly sales report attached."
    attachments: pdfContent
]
```

### Use Case 5: Multi-File Package

```javascript
// Create package of multiple files
files = {};
fileNames = {};

// Add files to package
// File 1: Contract
contractURL = "https://example.com/contract.pdf";
contractFile = invokeurl
[
    url: contractURL
    type: GET
];
files.add(contractFile);
fileNames.add("Contract.pdf");

// File 2: Terms and Conditions
termsURL = "https://example.com/terms.pdf";
termsFile = invokeurl
[
    url: termsURL
    type: GET
];
files.add(termsFile);
fileNames.add("Terms_and_Conditions.pdf");

// File 3: User Guide
guideURL = "https://example.com/guide.pdf";
guideFile = invokeurl
[
    url: guideURL
    type: GET
];
files.add(guideFile);
fileNames.add("User_Guide.pdf");

// Send all files
customerEmail = record.Email;
sendmail
[
    from: zoho.adminuserid
    to: customerEmail
    subject: "Welcome Package"
    message: "Dear Customer,\n\nWelcome! Please find attached:\n- Contract\n- Terms and Conditions\n- User Guide\n\nPlease review and let us know if you have questions."
    attachments: files
]

info "Package sent with " + files.size() + " files";
```

### Use Case 6: File Backup to Cloud

```javascript
// Backup CRM attachments to WorkDrive
dealId = "123456789";

// Get deal attachments
attachments = zoho.crm.getRelatedRecords("Attachments", "Deals", dealId);

for each attachment in attachments
{
    attachmentId = attachment.get("id");
    fileName = attachment.get("File_Name");

    // Get file content
    fileURL = "https://crm.zoho.com/crm/EntityFile?id=" + attachmentId;
    fileContent = invokeurl
    [
        url: fileURL
        type: GET
        connection: "zohocrm"
    ];

    // Upload to WorkDrive
    workdriveURL = "https://www.zohoapis.com/workdrive/api/v1/upload";
    uploadResponse = invokeurl
    [
        url: workdriveURL
        type: POST
        files: {"file": fileContent}
        parameters: {"filename": fileName, "parent_id": workdriveFolderId}
        connection: "zohoworkdrive"
    ];

    info "Backed up: " + fileName;
}
```

## Limitations

### Size Limits

```javascript
// File size limits (varies by product):
// - Email attachments: Typically 15-25 MB total
// - API responses: Typically 5-10 MB
// - Upload limits: Varies by product and plan

// Example: Check before sending
maxEmailAttachmentSize = 15 * 1024 * 1024;  // 15 MB in bytes

// Note: Actual size checking depends on product capabilities
```

### File Type Restrictions

```javascript
// Common restrictions:
// - Executable files (.exe, .bat, .sh) usually blocked
// - Script files (.js, .vbs) may be blocked
// - Archive files (.zip) may have restrictions

// Allowed types typically include:
// - Documents: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx
// - Images: .jpg, .jpeg, .png, .gif
// - Text: .txt, .csv
// - Archives: .zip (sometimes)

allowedTypes = {
    "pdf", "doc", "docx", "xls", "xlsx",
    "ppt", "pptx", "txt", "csv",
    "jpg", "jpeg", "png", "gif"
};
```

### API Limitations

```javascript
// invokeUrl file fetching limits:
// - Response size: Usually 5 MB
// - Timeout: 40 seconds
// - Connection required for authenticated APIs

// Workarounds:
// - Break large files into chunks
// - Use direct download links when possible
// - Stream large files if supported
```

### Product-Specific Limitations

```javascript
// Limitations vary by Zoho product:
// - CRM: File attachment limits per record
// - Creator: File storage limits per app
// - WorkDrive: Storage limits per organization

// Always check current product documentation
```

## Best Practices

### 1. Error Handling

```javascript
// Good: Handle errors when fetching files
try
{
    fileURL = "https://example.com/file.pdf";
    fileData = invokeurl
    [
        url: fileURL
        type: GET
    ];

    // Use file
    sendEmail(fileData);
}
catch(e)
{
    info "Error fetching file: " + e;
    // Implement fallback or notification
}

// Poor: No error handling
fileData = invokeurl [ url: fileURL type: GET ];
```

### 2. Validate File Types

```javascript
// Good: Validate before processing
if(isAllowedFileType(fileName))
{
    processFile(file);
}
else
{
    info "File type not allowed: " + fileName;
}

// Poor: Process without validation
processFile(file);
```

### 3. Check for Null

```javascript
// Good: Verify file exists
if(fileData != null)
{
    sendmail
    [
        from: zoho.adminuserid
        to: userEmail
        subject: "Your File"
        message: "File attached"
        attachments: fileData
    ]
}
else
{
    info "File data is null";
}
```

### 4. Use Meaningful Names

```javascript
// Good: Descriptive names
invoiceFile = fetchInvoiceFile(invoiceId);
contractPDF = generateContractPDF(dealId);

// Poor: Generic names
file1 = fetchFile(id);
data = getData();
```

### 5. Limit File Operations

```javascript
// Good: Limit iterations
maxFiles = 10;
count = 0;

for each file in fileList
{
    if(count >= maxFiles)
    {
        break;
    }

    processFile(file);
    count = count + 1;
}

// Poor: Unlimited processing
for each file in fileList
{
    processFile(file);  // Could exceed limits
}
```

### 6. Cache Files When Possible

```javascript
// Good: Fetch once, use multiple times
reportPDF = fetchReport();

// Use the same file multiple times
sendmail [ to: "user1@example.com" attachments: reportPDF ]
sendmail [ to: "user2@example.com" attachments: reportPDF ]
sendmail [ to: "user3@example.com" attachments: reportPDF ]

// Poor: Fetch multiple times
sendmail [ to: "user1@example.com" attachments: fetchReport() ]
sendmail [ to: "user2@example.com" attachments: fetchReport() ]
sendmail [ to: "user3@example.com" attachments: fetchReport() ]
```

### 7. Document File Sources

```javascript
// Good: Document source and requirements
/**
 * Fetches invoice PDF from billing system
 * @param invoiceId - Invoice identifier
 * @return File object containing PDF
 * @requires API token in apiToken variable
 */
file fetchInvoicePDF(string invoiceId)
{
    url = "https://billing.example.com/api/invoices/" + invoiceId + "/pdf";
    return invokeurl
    [
        url: url
        type: GET
        headers: {"Authorization": "Bearer " + apiToken}
    ];
}
```

### 8. Clean Up Resources

```javascript
// Good: Clear references after use
fileData = fetchLargeFile();
processFile(fileData);
fileData = null;  // Allow garbage collection

// Poor: Keep large files in memory
fileData = fetchLargeFile();
processFile(fileData);
// fileData still referenced
```

## Summary

### File Operations Quick Reference

| Operation | Method | Example |
|-----------|--------|---------|
| Fetch from URL | `invokeurl` | `invokeurl [ url: fileURL type: GET ]` |
| Email attachment | `sendmail` | `sendmail [ attachments: file ]` |
| Attach to CRM | `attachFile` | `zoho.crm.attachFile(module, id, file)` |
| Get file URL | `getUrl()` | `file.getUrl()` |
| Get public URL | `getPublicUrl()` | `file.getPublicUrl()` |

### Common File Types

| Type | Extensions | Common Use |
|------|------------|------------|
| PDF | .pdf | Documents, reports, contracts |
| Images | .jpg, .png, .gif | Photos, logos, graphics |
| Documents | .doc, .docx | Word documents |
| Spreadsheets | .xls, .xlsx | Excel files, data |
| Presentations | .ppt, .pptx | PowerPoint files |
| Text | .txt, .csv | Plain text, data exports |

## Additional Resources

- [API Integration](../api-integration/README.md) - Using invokeUrl
- [Data Types](../data-types/README.md) - File data type
- [Examples](../examples/README.md) - File handling examples

## References

- [Zoho Deluge File Operations](https://www.zoho.com/deluge/help/file-operations.html)
- [Zoho CRM Attachments API](https://www.zoho.com/crm/developer/docs/api/v2/attachments.html)
- [Zoho WorkDrive API](https://www.zoho.com/workdrive/api/)
