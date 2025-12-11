# Deluge Date & Time Operations

Date and time manipulation is essential for scheduling, calculations, comparisons, and formatting in Deluge. This comprehensive guide covers all date-time operations and functions.

## Table of Contents

- [Overview](#overview)
- [Date-Time Data Type](#date-time-data-type)
- [Time Data Type](#time-data-type)
- [Creating Dates](#creating-dates)
- [Date Formatting](#date-formatting)
- [Date Parsing](#date-parsing)
- [Date Calculations](#date-calculations)
- [Date Comparisons](#date-comparisons)
- [Extracting Date Components](#extracting-date-components)
- [Timezones](#timezones)
- [Common Date Tasks](#common-date-tasks)
- [Best Practices](#best-practices)

## Overview

Deluge provides comprehensive date and time handling capabilities for various scenarios.

### Key Features

- **Current date/time**: Get current date or timestamp
- **Date arithmetic**: Add or subtract days, months, years
- **Date formatting**: Convert dates to strings with custom formats
- **Date parsing**: Convert strings to dates
- **Date comparison**: Compare dates for ordering
- **Component extraction**: Get year, month, day, etc.
- **Timezone support**: Work with different timezones

### Date Format

Deluge uses **single quotes** for date literals:

```javascript
// Date-Time (with single quotes)
appointmentDate = '15-Jan-2025 14:30:00';
birthDate = '15-Mar-1990';

// String (with double quotes)
textDate = "15-Jan-2025";  // This is a string, not a date
```

## Date-Time Data Type

The Date-Time data type represents both date and time.

### Syntax

```javascript
// Format: 'DD-MMM-YYYY HH:mm:ss'
dateTimeValue = '15-Jan-2025 14:30:00';

// Date only (time defaults to 00:00:00)
dateValue = '15-Jan-2025';
```

### Examples

```javascript
// With full date and time
appointmentTime = '15-Jan-2025 14:30:00';
orderTime = '01-Dec-2024 09:15:45';

// Date without time (defaults to midnight)
birthDate = '15-Mar-1990';
startDate = '01-Jan-2025';
dueDate = '31-Dec-2025';

// Current date-time
currentDateTime = now;
currentDate = today;
```

### Date-Time Components

```javascript
// A date-time contains:
// - Year (e.g., 2025)
// - Month (1-12)
// - Day (1-31)
// - Hour (0-23)
// - Minute (0-59)
// - Second (0-59)

dt = '15-Jan-2025 14:30:45';
// Year: 2025
// Month: 1 (January)
// Day: 15
// Hour: 14 (2:30 PM)
// Minute: 30
// Second: 45
```

## Time Data Type

The Time data type represents time independently from dates.

### Syntax

```javascript
// Format: 'HH:mm:ss'
timeValue = '14:30:00';

// 12-hour format (depending on settings)
timeValue12 = '02:30 PM';
```

### Examples

```javascript
// 24-hour format
morningTime = '09:30:00';
noonTime = '12:00:00';
eveningTime = '18:45:00';
midnightTime = '00:00:00';

// Business hours
businessStart = '09:00:00';
businessEnd = '17:00:00';

// Time comparisons
currentTime = now.toString("HH:mm:ss").toTime();  // If conversion needed
if(currentTime >= businessStart && currentTime <= businessEnd)
{
    duringBusinessHours = true;
}
```

## Creating Dates

### Current Date and Time

#### now

Returns current date and time.

```javascript
// Get current timestamp
currentDateTime = now;
info "Current date-time: " + currentDateTime;

// Use in calculations
createdTime = now;
expiryTime = now.addDay(30);

// Timestamp records
recordData = Map();
recordData.put("Created_Time", now);
recordData.put("Modified_Time", now);

// Time-based logic
currentHour = now.toString("HH").toNumber();
if(currentHour >= 9 && currentHour < 17)
{
    duringBusinessHours = true;
}
```

#### today

Returns current date (time set to 00:00:00).

```javascript
// Get current date
currentDate = today;
info "Today is: " + currentDate;

// Date comparisons
appointmentDate = '25-Jan-2025';
if(appointmentDate == today)
{
    info "Appointment is today";
}
else if(appointmentDate < today)
{
    info "Appointment has passed";
}
else
{
    info "Appointment is upcoming";
}

// Calculate deadlines
deadline = today.addDay(7);

// Check if weekend
dayOfWeek = today.toString("EEEE");
if(dayOfWeek == "Saturday" || dayOfWeek == "Sunday")
{
    isWeekend = true;
}
```

### Creating Specific Dates

```javascript
// Literal dates
independenceDay = '04-Jul-2025';
newYearsDay = '01-Jan-2025';
christmasDay = '25-Dec-2025';

// With time
meetingTime = '15-Jan-2025 14:30:00';
launchTime = '01-Feb-2025 09:00:00';

// Store in variables
startDate = '01-Jan-2025';
endDate = '31-Dec-2025';

// Use in calculations
trialPeriod = 14;
signupDate = today;
trialEndDate = signupDate.addDay(trialPeriod);
```

## Date Formatting

### toString()

Converts date to string with specified format.

```javascript
// Syntax
formattedDate = dateValue.toString("format");
```

### Format Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| `dd` | Day (01-31) | 15 |
| `d` | Day (1-31) | 15 |
| `MMM` | Month abbreviation | Jan |
| `MMMM` | Month full name | January |
| `MM` | Month number (01-12) | 01 |
| `M` | Month number (1-12) | 1 |
| `yyyy` | Year (4 digits) | 2025 |
| `yy` | Year (2 digits) | 25 |
| `HH` | Hour 24-hour (00-23) | 14 |
| `hh` | Hour 12-hour (01-12) | 02 |
| `mm` | Minute (00-59) | 30 |
| `ss` | Second (00-59) | 45 |
| `a` | AM/PM marker | PM |
| `EEEE` | Day of week | Wednesday |
| `EEE` | Day abbreviation | Wed |

### Formatting Examples

```javascript
currentDate = now;

// Date formats
formatted1 = currentDate.toString("dd-MMM-yyyy");
// "15-Jan-2025"

formatted2 = currentDate.toString("MM/dd/yyyy");
// "01/15/2025"

formatted3 = currentDate.toString("yyyy-MM-dd");
// "2025-01-15"

formatted4 = currentDate.toString("MMM dd, yyyy");
// "Jan 15, 2025"

formatted5 = currentDate.toString("MMMM dd, yyyy");
// "January 15, 2025"

// With day of week
formatted6 = currentDate.toString("EEEE, MMM dd, yyyy");
// "Wednesday, Jan 15, 2025"

formatted7 = currentDate.toString("EEE, dd MMM yyyy");
// "Wed, 15 Jan 2025"

// Time formats
formatted8 = currentDate.toString("HH:mm:ss");
// "14:30:45"

formatted9 = currentDate.toString("hh:mm a");
// "02:30 PM"

formatted10 = currentDate.toString("hh:mm:ss a");
// "02:30:45 PM"

// Combined date and time
formatted11 = currentDate.toString("dd-MMM-yyyy HH:mm:ss");
// "15-Jan-2025 14:30:45"

formatted12 = currentDate.toString("MM/dd/yyyy hh:mm a");
// "01/15/2025 02:30 PM"

formatted13 = currentDate.toString("EEEE, MMMM dd, yyyy 'at' hh:mm a");
// "Wednesday, January 15, 2025 at 02:30 PM"

// Short formats
formatted14 = currentDate.toString("M/d/yy");
// "1/15/25"

// ISO 8601 format
formatted15 = currentDate.toString("yyyy-MM-dd'T'HH:mm:ss");
// "2025-01-15T14:30:45"
```

### Practical Formatting

```javascript
// Format for display
displayDate = orderDate.toString("MMM dd, yyyy");
info "Order Date: " + displayDate;

// Format for file names
timestamp = now.toString("yyyyMMdd_HHmmss");
fileName = "report_" + timestamp + ".pdf";
// "report_20250115_143045.pdf"

// Format for email
emailDate = now.toString("EEEE, MMMM dd, yyyy");
subject = "Report for " + emailDate;
// "Report for Wednesday, January 15, 2025"

// Format for database
dbDate = today.toString("yyyy-MM-dd");
// "2025-01-15"

// Format for logs
logTimestamp = now.toString("yyyy-MM-dd HH:mm:ss");
logEntry = "[" + logTimestamp + "] User logged in";
// "[2025-01-15 14:30:45] User logged in"

// Relative dates
daysUntil = (eventDate - today).days();
eventDisplay = eventDate.toString("MMM dd");
info eventDisplay + " (" + daysUntil + " days away)";
```

## Date Parsing

### toDate()

Converts string to date.

```javascript
// Syntax
dateValue = textValue.toDate();
dateValue = toDate(textValue, "format");
```

### Parsing Examples

```javascript
// Standard format (dd-MMM-yyyy)
dateText = "15-Jan-2025";
dateValue = dateText.toDate();

// Custom format
dateText2 = "2025-01-15";
dateValue2 = toDate(dateText2, "yyyy-MM-dd");

dateText3 = "01/15/2025";
dateValue3 = toDate(dateText3, "MM/dd/yyyy");

dateText4 = "January 15, 2025";
dateValue4 = toDate(dateText4, "MMMM dd, yyyy");

// With time
dateTimeText = "2025-01-15 14:30:00";
dateTimeValue = toDate(dateTimeText, "yyyy-MM-dd HH:mm:ss");

// From user input
userInput = input.DateField;
try
{
    parsedDate = toDate(userInput, "MM/dd/yyyy");
    info "Valid date: " + parsedDate;
}
catch(e)
{
    info "Invalid date format. Please use MM/DD/YYYY";
}
```

### Safe Parsing

```javascript
// Parse with error handling
date parseDate(string dateText, string format)
{
    try
    {
        return toDate(dateText, format);
    }
    catch(e)
    {
        info "Date parsing error: " + e;
        return null;
    }
}

// Usage
userDate = "01/15/2025";
parsedDate = parseDate(userDate, "MM/dd/yyyy");
if(parsedDate != null)
{
    info "Date is valid: " + parsedDate;
}
else
{
    info "Invalid date format";
}
```

## Date Calculations

### addDay()

Adds or subtracts days from a date.

```javascript
// Syntax
newDate = dateValue.addDay(numberOfDays);

// Add days
currentDate = today;
tomorrow = currentDate.addDay(1);
nextWeek = currentDate.addDay(7);
thirtyDaysLater = currentDate.addDay(30);

// Subtract days (use negative)
yesterday = currentDate.addDay(-1);
lastWeek = currentDate.addDay(-7);
thirtyDaysAgo = currentDate.addDay(-30);

// Calculate due dates
orderDate = today;
standardShipping = orderDate.addDay(5);
expressShipping = orderDate.addDay(2);
overnightShipping = orderDate.addDay(1);

// Trial period
signupDate = today;
trialDays = 14;
trialEndDate = signupDate.addDay(trialDays);
info "Trial ends on: " + trialEndDate.toString("MMM dd, yyyy");

// Payment due dates
invoiceDate = today;
paymentTerms = 30;  // Net 30
dueDate = invoiceDate.addDay(paymentTerms);

// Project milestones
projectStart = '01-Jan-2025';
phase1End = projectStart.addDay(30);
phase2End = phase1End.addDay(45);
phase3End = phase2End.addDay(60);
projectEnd = phase3End.addDay(15);
```

### addMonth()

Adds or subtracts months from a date.

```javascript
// Syntax
newDate = dateValue.addMonth(numberOfMonths);

// Add months
currentDate = today;
nextMonth = currentDate.addMonth(1);
threeMonthsLater = currentDate.addMonth(3);
nextYear = currentDate.addMonth(12);

// Subtract months (use negative)
lastMonth = currentDate.addMonth(-1);
threeMonthsAgo = currentDate.addMonth(-3);
lastYear = currentDate.addMonth(-12);

// Subscription billing
subscriptionStart = today;
firstBilling = subscriptionStart.addMonth(1);
secondBilling = subscriptionStart.addMonth(2);
thirdBilling = subscriptionStart.addMonth(3);

// Quarterly dates
fiscalStart = '01-Jan-2025';
q1End = fiscalStart.addMonth(3).addDay(-1);  // Mar 31
q2End = fiscalStart.addMonth(6).addDay(-1);  // Jun 30
q3End = fiscalStart.addMonth(9).addDay(-1);  // Sep 30
q4End = fiscalStart.addMonth(12).addDay(-1); // Dec 31

// Contract periods
contractStart = today;
sixMonthContract = contractStart.addMonth(6);
oneYearContract = contractStart.addMonth(12);
twoYearContract = contractStart.addMonth(24);

// Reminder dates
renewalDate = '01-Jan-2026';
threeMonthReminder = renewalDate.addMonth(-3);
oneMonthReminder = renewalDate.addMonth(-1);
oneWeekReminder = renewalDate.addDay(-7);
```

### addYear()

Adds or subtracts years from a date.

```javascript
// Syntax
newDate = dateValue.addYear(numberOfYears);

// Add years
currentDate = today;
nextYear = currentDate.addYear(1);
fiveYearsLater = currentDate.addYear(5);
decade = currentDate.addYear(10);

// Subtract years (use negative)
lastYear = currentDate.addYear(-1);
fiveYearsAgo = currentDate.addYear(-5);

// Age calculation
birthDate = '15-Mar-1990';
age18Date = birthDate.addYear(18);
age21Date = birthDate.addYear(21);
age65Date = birthDate.addYear(65);

// Check if 18+
if(today >= age18Date)
{
    isAdult = true;
}

// License expiration
licenseIssued = today;
licenseExpires = licenseIssued.addYear(1);  // 1-year license
info "License expires: " + licenseExpires.toString("MMM dd, yyyy");

// Contract terms
contractStart = '01-Jan-2025';
oneYearContract = contractStart.addYear(1);
threeYearContract = contractStart.addYear(3);
fiveYearContract = contractStart.addYear(5);

// Warranty periods
purchaseDate = today;
oneYearWarranty = purchaseDate.addYear(1);
twoYearWarranty = purchaseDate.addYear(2);
lifetimeWarranty = purchaseDate.addYear(99);  // Approximate

// Historical dates
today = today;
tenYearsAgo = today.addYear(-10);
twentyYearsAgo = today.addYear(-20);
```

### Complex Calculations

```javascript
// Combine operations
startDate = '01-Jan-2025';
endDate = startDate.addYear(1).addMonth(3).addDay(15);
// Result: Apr 16, 2026

// Calculate business days (simplified - doesn't account for holidays)
int calculateBusinessDays(date startDate, int days)
{
    currentDate = startDate;
    businessDaysAdded = 0;
    totalDaysAdded = 0;

    while(businessDaysAdded < days && totalDaysAdded < 100)  // Safety limit
    {
        currentDate = currentDate.addDay(1);
        totalDaysAdded = totalDaysAdded + 1;

        dayOfWeek = currentDate.toString("EEEE");
        if(dayOfWeek != "Saturday" && dayOfWeek != "Sunday")
        {
            businessDaysAdded = businessDaysAdded + 1;
        }
    }

    return currentDate;
}

// Age in years
birthDate = '15-Mar-1990';
currentYear = today.getYear();
birthYear = birthDate.getYear();
age = currentYear - birthYear;

// Adjust if birthday hasn't occurred this year
birthMonth = birthDate.getMonth();
birthDay = birthDate.getDay();
currentMonth = today.getMonth();
currentDay = today.getDay();

if(currentMonth < birthMonth || (currentMonth == birthMonth && currentDay < birthDay))
{
    age = age - 1;
}
info "Age: " + age;
```

## Date Comparisons

### Comparison Operators

```javascript
// Date comparison
date1 = '01-Jan-2025';
date2 = '15-Jan-2025';

// Less than (before)
isBefore = date1 < date2;  // true

// Greater than (after)
isAfter = date1 > date2;   // false

// Equal
date3 = '01-Jan-2025';
isEqual = date1 == date3;  // true

// Less than or equal
isBeforeOrEqual = date1 <= date2;  // true

// Greater than or equal
isAfterOrEqual = date1 >= date2;   // false

// Not equal
isNotEqual = date1 != date2;  // true
```

### Comparison Examples

```javascript
// Check if past due
dueDate = '10-Jan-2025';
if(today > dueDate)
{
    info "Payment is overdue";
    daysOverdue = (today - dueDate).days();
    info "Days overdue: " + daysOverdue;
}

// Check if upcoming
eventDate = '25-Jan-2025';
if(eventDate > today)
{
    daysUntil = (eventDate - today).days();
    info "Event in " + daysUntil + " days";
}
else if(eventDate == today)
{
    info "Event is today!";
}
else
{
    info "Event has passed";
}

// Date range check
startDate = '01-Jan-2025';
endDate = '31-Jan-2025';
checkDate = '15-Jan-2025';

if(checkDate >= startDate && checkDate <= endDate)
{
    info "Date is within range";
}

// Check if expired
expiryDate = '31-Dec-2024';
if(today > expiryDate)
{
    isExpired = true;
    info "License has expired";
}

// Sort dates
dates = {'15-Jan-2025', '01-Jan-2025', '31-Dec-2024', '10-Feb-2025'};
dates.sort();
// dates = {'31-Dec-2024', '01-Jan-2025', '15-Jan-2025', '10-Feb-2025'}

earliestDate = dates.get(0);
latestDate = dates.get(dates.size() - 1);
```

### Days Between Dates

```javascript
// Calculate difference
startDate = '01-Jan-2025';
endDate = '31-Jan-2025';

// Get difference
daysDifference = (endDate - startDate).days();
// daysDifference = 30

// Check age
birthDate = '15-Mar-1990';
ageInDays = (today - birthDate).days();
ageInYears = ageInDays / 365;  // Approximate

// Days until event
eventDate = '25-Dec-2025';
daysUntil = (eventDate - today).days();
if(daysUntil > 0)
{
    info daysUntil + " days until Christmas";
}

// Overdue calculation
dueDate = '01-Jan-2025';
if(today > dueDate)
{
    daysOverdue = (today - dueDate).days();
    info "Payment overdue by " + daysOverdue + " days";

    // Apply late fee
    if(daysOverdue > 30)
    {
        lateFee = 50;
    }
    else if(daysOverdue > 7)
    {
        lateFee = 25;
    }
    else
    {
        lateFee = 10;
    }
}

// Subscription days remaining
subscriptionStart = '01-Jan-2025';
subscriptionEnd = '31-Dec-2025';
daysElapsed = (today - subscriptionStart).days();
daysRemaining = (subscriptionEnd - today).days();
totalDays = (subscriptionEnd - subscriptionStart).days();
percentUsed = (daysElapsed / totalDays) * 100;

info "Days remaining: " + daysRemaining;
info "Subscription " + percentUsed.round(1) + "% complete";
```

## Extracting Date Components

### getYear()

Returns the year component.

```javascript
// Get year
currentDate = '15-Jan-2025 14:30:00';
year = currentDate.getYear();  // 2025

birthDate = '15-Mar-1990';
birthYear = birthDate.getYear();  // 1990

// Calculate age
currentYear = today.getYear();
age = currentYear - birthYear;  // 35 (approximately)

// Check century
if(year >= 2000 && year < 2100)
{
    century = "21st century";
}

// Fiscal year
fiscalYear = today.getYear();
if(today.getMonth() < 4)  // Before April
{
    fiscalYear = fiscalYear - 1;
}
info "Fiscal Year: " + fiscalYear;

// Filter by year
records = zoho.crm.getRecords("Deals", 1, 200);
currentYearDeals = {};
targetYear = today.getYear();

for each deal in records
{
    dealDate = deal.get("Closing_Date");
    if(dealDate != null && dealDate.getYear() == targetYear)
    {
        currentYearDeals.add(deal);
    }
}
```

### getMonth()

Returns the month number (1-12).

```javascript
// Get month
currentDate = '15-Jan-2025';
month = currentDate.getMonth();  // 1 (January)

julDate = '04-Jul-2025';
julMonth = julDate.getMonth();  // 7

decDate = '25-Dec-2025';
decMonth = decDate.getMonth();  // 12

// Month names
monthNames = {
    1: "January", 2: "February", 3: "March",
    4: "April", 5: "May", 6: "June",
    7: "July", 8: "August", 9: "September",
    10: "October", 11: "November", 12: "December"
};
monthName = monthNames.get(month);

// Seasonal logic
currentMonth = today.getMonth();
if(currentMonth == 12 || currentMonth == 1 || currentMonth == 2)
{
    season = "Winter";
}
else if(currentMonth >= 3 && currentMonth <= 5)
{
    season = "Spring";
}
else if(currentMonth >= 6 && currentMonth <= 8)
{
    season = "Summer";
}
else
{
    season = "Fall";
}

// Quarter calculation
quarter = ceil(currentMonth / 3);
info "Q" + quarter;

// Month-end check
nextDay = today.addDay(1);
if(nextDay.getMonth() != today.getMonth())
{
    info "Today is the last day of the month";
    runMonthEndProcess();
}

// Birthday check
birthDate = '15-Mar-1990';
if(today.getMonth() == birthDate.getMonth() && today.getDay() == birthDate.getDay())
{
    info "Happy Birthday!";
}
```

### getDay()

Returns the day of month (1-31).

```javascript
// Get day
currentDate = '15-Jan-2025';
day = currentDate.getDay();  // 15

firstOfMonth = '01-Jan-2025';
dayNum = firstOfMonth.getDay();  // 1

// Check if first day of month
if(today.getDay() == 1)
{
    info "First day of the month";
    runMonthlyBilling();
}

// Check if 15th (mid-month)
if(today.getDay() == 15)
{
    info "Mid-month checkpoint";
}

// Check if last day of month
tomorrow = today.addDay(1);
if(tomorrow.getDay() == 1)
{
    info "Last day of the month";
}

// Payment due date
if(today.getDay() == 5)
{
    info "Payment due today (5th of month)";
}

// Payroll dates
currentDay = today.getDay();
if(currentDay == 1 || currentDay == 15)
{
    info "Payroll processing day";
    processPayroll();
}
```

### Day of Week

```javascript
// Get day name
dayName = today.toString("EEEE");
// "Wednesday"

dayAbbrev = today.toString("EEE");
// "Wed"

// Check if weekend
if(dayName == "Saturday" || dayName == "Sunday")
{
    isWeekend = true;
    info "It's the weekend!";
}
else
{
    isWeekend = false;
    isWeekday = true;
}

// Business day check
if(dayName != "Saturday" && dayName != "Sunday")
{
    info "Business day";
}

// Specific day logic
if(dayName == "Monday")
{
    info "Start of work week";
    sendWeeklyReport();
}
else if(dayName == "Friday")
{
    info "End of work week";
    scheduleWeekendTasks();
}

// Day-specific promotions
if(dayName == "Tuesday")
{
    discount = 0.10;  // 10% off Tuesdays
}
```

### Time Components

```javascript
// Extract time parts
currentTime = now;

hour = currentTime.toString("HH").toNumber();     // 0-23
minute = currentTime.toString("mm").toNumber();   // 0-59
second = currentTime.toString("ss").toNumber();   // 0-59

// Business hours check
if(hour >= 9 && hour < 17)
{
    duringBusinessHours = true;
}

// Time of day
if(hour < 12)
{
    timeOfDay = "Morning";
}
else if(hour < 17)
{
    timeOfDay = "Afternoon";
}
else
{
    timeOfDay = "Evening";
}

// Specific time check
if(hour == 9 && minute == 0)
{
    info "Start of business day";
    sendDailyReport();
}
```

## Timezones

### Working with Timezones

```javascript
// Note: Timezone handling in Deluge depends on:
// 1. User's timezone settings
// 2. Organization timezone
// 3. Specific Zoho product capabilities

// Get current time (in user's timezone)
localTime = now;

// Format with timezone
formatted = localTime.toString("yyyy-MM-dd HH:mm:ss z");
// "2025-01-15 14:30:00 PST"

// Convert timezone (if supported by product)
// Syntax varies by Zoho product
// Check specific product documentation

// Store UTC for consistency
utcTime = now;  // Usually stored in UTC in CRM

// Display in user timezone (automatically handled)
displayTime = utcTime.toString("MMM dd, yyyy hh:mm a");
```

### Timezone Considerations

```javascript
// When scheduling across timezones:
// 1. Store in UTC
// 2. Convert for display
// 3. Account for DST

// Example: Schedule meeting
meetingTimeLocal = '15-Jan-2025 14:00:00';  // 2 PM local time

// Calculate for different timezone
// (Requires timezone conversion functions)

// Best practice: Use UTC for scheduling
meetingTimeUTC = convertToUTC(meetingTimeLocal);
```

## Common Date Tasks

### Calculate Age

```javascript
// Calculate exact age
int calculateAge(date birthDate)
{
    currentYear = today.getYear();
    birthYear = birthDate.getYear();
    age = currentYear - birthYear;

    // Adjust if birthday hasn't occurred this year
    birthMonth = birthDate.getMonth();
    birthDay = birthDate.getDay();
    currentMonth = today.getMonth();
    currentDay = today.getDay();

    if(currentMonth < birthMonth || (currentMonth == birthMonth && currentDay < birthDay))
    {
        age = age - 1;
    }

    return age;
}

// Usage
birthDate = '15-Mar-1990';
age = calculateAge(birthDate);
info "Age: " + age;

// Check if 18+
if(age >= 18)
{
    isAdult = true;
}
```

### Business Days Calculator

```javascript
// Add business days (excluding weekends)
date addBusinessDays(date startDate, int businessDays)
{
    currentDate = startDate;
    daysAdded = 0;

    while(daysAdded < businessDays)
    {
        currentDate = currentDate.addDay(1);
        dayName = currentDate.toString("EEEE");

        // Skip weekends
        if(dayName != "Saturday" && dayName != "Sunday")
        {
            daysAdded = daysAdded + 1;
        }
    }

    return currentDate;
}

// Usage
orderDate = today;
deliveryDate = addBusinessDays(orderDate, 5);  // 5 business days
info "Delivery date: " + deliveryDate.toString("MMM dd, yyyy");
```

### Date Range Generator

```javascript
// Generate list of dates in range
list generateDateRange(date startDate, date endDate)
{
    dateList = {};
    currentDate = startDate;

    while(currentDate <= endDate)
    {
        dateList.add(currentDate);
        currentDate = currentDate.addDay(1);
    }

    return dateList;
}

// Usage
start = '01-Jan-2025';
end = '07-Jan-2025';
dates = generateDateRange(start, end);
// dates = ['01-Jan-2025', '02-Jan-2025', ..., '07-Jan-2025']

for each date in dates
{
    info date.toString("MMM dd");
}
```

### Recurring Dates

```javascript
// Generate monthly recurring dates
list generateMonthlyRecurring(date startDate, int months)
{
    recurringDates = {};
    currentDate = startDate;

    for each i in {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11}
    {
        if(i < months)
        {
            nextDate = startDate.addMonth(i);
            recurringDates.add(nextDate);
        }
    }

    return recurringDates;
}

// Usage
subscriptionStart = '01-Jan-2025';
billingDates = generateMonthlyRecurring(subscriptionStart, 12);
// 12 monthly billing dates

for each date in billingDates
{
    info "Bill on: " + date.toString("MMM dd, yyyy");
}
```

### Deadline Reminders

```javascript
// Check and send deadline reminders
void checkDeadlineReminders()
{
    tasks = zoho.crm.getRecords("Tasks", 1, 200);

    for each task in tasks
    {
        dueDate = task.get("Due_Date");
        status = task.get("Status");

        if(dueDate != null && status != "Completed")
        {
            daysUntil = (dueDate - today).days();

            // 7-day warning
            if(daysUntil == 7)
            {
                sendReminder(task, "Due in 1 week");
            }
            // 1-day warning
            else if(daysUntil == 1)
            {
                sendReminder(task, "Due tomorrow!");
            }
            // Due today
            else if(daysUntil == 0)
            {
                sendReminder(task, "Due today!");
            }
            // Overdue
            else if(daysUntil < 0)
            {
                daysOverdue = abs(daysUntil);
                sendReminder(task, "Overdue by " + daysOverdue + " days");
            }
        }
    }
}
```

### Working Days in Month

```javascript
// Count working days in a month
int countWorkingDaysInMonth(int year, int month)
{
    // Create first day of month
    firstDay = toDate("01-" + month + "-" + year, "dd-M-yyyy");

    // Get last day of month
    nextMonth = firstDay.addMonth(1);
    lastDay = nextMonth.addDay(-1);

    // Count working days
    workingDays = 0;
    currentDate = firstDay;

    while(currentDate <= lastDay)
    {
        dayName = currentDate.toString("EEEE");
        if(dayName != "Saturday" && dayName != "Sunday")
        {
            workingDays = workingDays + 1;
        }
        currentDate = currentDate.addDay(1);
    }

    return workingDays;
}

// Usage
year = 2025;
month = 1;  // January
workDays = countWorkingDaysInMonth(year, month);
info "Working days in January 2025: " + workDays;
```

## Best Practices

### 1. Use Correct Quote Types

```javascript
// Good: Single quotes for dates
appointmentDate = '15-Jan-2025';

// Wrong: Double quotes (creates string, not date)
appointmentDate = "15-Jan-2025";  // This is a string
```

### 2. Always Validate Dates

```javascript
// Good: Validate before use
if(inputDate != null)
{
    daysUntil = (inputDate - today).days();
}

// Poor: No validation
daysUntil = (inputDate - today).days();  // May fail if null
```

### 3. Use Standard Formats

```javascript
// Good: Consistent format
date1 = '15-Jan-2025';
date2 = '20-Jan-2025';

// Poor: Mixed formats
date1 = '15-Jan-2025';
date2 = '01/20/2025';  // String, not date
```

### 4. Handle Timezone Carefully

```javascript
// Good: Store UTC, display local
recordData.put("Created_Time_UTC", now);
displayTime = now.toString("MMM dd, yyyy hh:mm a");

// Be aware of timezone in comparisons
```

### 5. Check for Business Days

```javascript
// Good: Account for weekends
deliveryDate = addBusinessDays(orderDate, 5);

// Poor: Simple addition (includes weekends)
deliveryDate = orderDate.addDay(5);
```

### 6. Use Appropriate Precision

```javascript
// Good: Use today for date-only comparisons
if(eventDate == today)
{
    info "Event is today";
}

// Poor: Use now (includes time)
if(eventDate == now)  // Will rarely match exactly
{
    info "Event is now";
}
```

### 7. Document Date Formats

```javascript
// Good: Document expected format
/**
 * @param dateString - Date in format "yyyy-MM-dd"
 * @return Parsed date value
 */
date parseISODate(string dateString)
{
    return toDate(dateString, "yyyy-MM-dd");
}
```

### 8. Safe Date Arithmetic

```javascript
// Good: Check before calculation
if(endDate > startDate)
{
    days = (endDate - startDate).days();
}
else
{
    info "End date must be after start date";
}

// Poor: No validation
days = (endDate - startDate).days();  // Could be negative
```

## Summary

### Date Function Quick Reference

| Function | Purpose | Example |
|----------|---------|---------|
| `now` | Current date-time | `now` → 2025-01-15 14:30:00 |
| `today` | Current date | `today` → 2025-01-15 |
| `addDay(n)` | Add/subtract days | `today.addDay(7)` |
| `addMonth(n)` | Add/subtract months | `today.addMonth(3)` |
| `addYear(n)` | Add/subtract years | `today.addYear(1)` |
| `getYear()` | Get year | `today.getYear()` → 2025 |
| `getMonth()` | Get month (1-12) | `today.getMonth()` → 1 |
| `getDay()` | Get day (1-31) | `today.getDay()` → 15 |
| `toString(format)` | Format date | `today.toString("MMM dd, yyyy")` |
| `toDate(text, format)` | Parse date | `toDate("2025-01-15", "yyyy-MM-dd")` |
| `(date1 - date2).days()` | Days between | `(endDate - startDate).days()` |

### Common Format Patterns

| Pattern | Output | Description |
|---------|--------|-------------|
| `dd-MMM-yyyy` | 15-Jan-2025 | Default format |
| `MM/dd/yyyy` | 01/15/2025 | US format |
| `yyyy-MM-dd` | 2025-01-15 | ISO format |
| `MMM dd, yyyy` | Jan 15, 2025 | Readable format |
| `EEEE, MMM dd` | Wednesday, Jan 15 | With day name |
| `HH:mm:ss` | 14:30:00 | 24-hour time |
| `hh:mm a` | 02:30 PM | 12-hour time |

## Additional Resources

- [Data Types](../data-types/README.md) - Date-Time data type
- [Functions](../functions/README.md) - Date functions reference
- [Examples](../examples/README.md) - Real-world date examples

## References

- [Zoho Deluge Date-Time Functions](https://www.zoho.com/deluge/help/functions/date-time.html)
- [Date-Time Data Type](https://www.zoho.com/deluge/help/datatypes/datetime.html)
