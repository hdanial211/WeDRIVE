# CHAPTER 3: ANALYSIS

## 3.1 Introduction

This chapter presents a detailed analysis of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The analysis phase is a critical component of the software development process, serving as the bridge between the requirements identified in the literature review and the system design that follows. Through systematic analysis, the project ensures that all stakeholder needs are captured, system boundaries are clearly defined, and the proposed solution adequately addresses the identified problem statements.

Section 3.2 conducts a thorough problem analysis, examining the current car rental process and its inefficiencies, and contrasts it with the proposed WeDRIVE solution. Section 3.3 provides a comprehensive requirement analysis covering data requirements, functional requirements (illustrated through Context Diagrams and Data Flow Diagrams), non-functional requirements, and other supporting requirements. The chapter concludes with a summary of the analysis findings and their implications for the system design phase.

## 3.2 Problem Analysis

### Current System Scenario

The current car rental process in Malaysia, particularly among small to medium-sized operators, follows a predominantly manual workflow. Through investigation and analysis, the following typical scenario has been identified:

**Step 1 - Customer Inquiry:** A customer contacts the car rental company via phone call, WhatsApp message, or by visiting the physical office. The customer asks about vehicle availability for specific dates, vehicle types, and pricing.

**Step 2 - Manual Availability Check:** The rental operator manually checks their records, which may be stored in Excel spreadsheets, physical logbooks, or basic calendar applications, to determine vehicle availability for the requested dates. This process is prone to errors, particularly when multiple staff members are managing bookings simultaneously.

**Step 3 - Quotation and Negotiation:** The operator provides a verbal or text-based quotation to the customer. Pricing may be inconsistent as it depends on the operator's memory of current rates, any ongoing promotions, or seasonal adjustments. Customers often need to contact multiple operators to compare prices.

**Step 4 - Booking Confirmation:** If the customer agrees to the quotation, the booking is recorded manually. A deposit may be collected via bank transfer, and confirmation is communicated via WhatsApp or phone call. There is no standardized booking reference system.

**Step 5 - Vehicle Handover:** On the pickup date, the customer visits the rental location. Vehicle inspection and documentation are completed manually, often with paper-based forms.

**Step 6 - Return and Settlement:** Upon vehicle return, the final payment is calculated manually, accounting for rental duration, fuel charges, and any damages. Receipts may or may not be issued systematically.

> *[Figure 3.1: Current Car Rental Process (Manual) - Flowchart to be inserted]*

**Problems Identified in the Current Process:**

1. **Lack of Real-Time Availability Information:** Customers cannot view vehicle availability in real-time, leading to frustrating back-and-forth communication and potential booking conflicts when multiple customers inquire about the same vehicle simultaneously.

2. **Absence of Visual Vehicle Information:** Customers make booking decisions based on limited information, typically a few static photos or verbal descriptions. They cannot inspect vehicle condition, interior quality, or detailed specifications before committing to a booking.

3. **No Centralized Data Management:** Business data (vehicles, bookings, customers, payments) is scattered across multiple formats and locations, making it difficult to generate accurate reports, track performance metrics, or identify business trends.

4. **Limited Operating Hours:** Customer support and booking services are restricted to business operating hours, resulting in lost potential bookings from customers who wish to make reservations outside these hours, particularly international tourists in different time zones.

5. **Manual Error Prone Processes:** Manual data entry and record-keeping increase the likelihood of errors such as double bookings, incorrect pricing, and lost customer information.

6. **No Data-Driven Decision Making:** Without centralized analytics, operators cannot easily assess fleet utilization rates, identify popular vehicles, determine peak booking periods, or evaluate the effectiveness of marketing campaigns.

**Proposed Solution: WeDRIVE System**

WeDRIVE addresses each of these problems through its integrated, web-based platform:

| Current Problem | WeDRIVE Solution |
|---|---|
| No real-time availability | Live vehicle availability updated through Supabase database |
| Limited vehicle information | 360-degree vehicle viewer with 200-frame rotation and interior panorama |
| Scattered data management | Centralized Supabase PostgreSQL database for all system data |
| Limited operating hours | 24/7 online booking portal with AI chatbot support |
| Manual errors | Automated booking management with conflict detection |
| No analytics | Built-in reporting dashboard with revenue and utilization charts |

> *[Figure 3.2: Proposed Car Rental Process (WeDRIVE) - Flowchart to be inserted]*

## 3.3 Requirement Analysis

### 3.3.1 Data Requirement

The WeDRIVE system requires the management of several interconnected data entities. The following data dictionaries define the structure and attributes of the primary data entities in the system.

**Table 3.1: Data Dictionary - Cars Table**

| Field Name | Data Type | Size | Description | Constraint |
|---|---|---|---|---|
| id | INTEGER | - | Unique car identifier | Primary Key, Auto-increment |
| name | VARCHAR | 255 | Full car name and model | Not Null |
| plate | VARCHAR | 20 | Vehicle registration plate number | Not Null, Unique |
| type | VARCHAR | 50 | Vehicle category (Sedan, SUV, Hatchback, etc.) | Not Null |
| fuel | VARCHAR | 30 | Fuel type (Petrol, Diesel, Hybrid, Electric) | Not Null |
| transmission | VARCHAR | 20 | Transmission type (Automatic, Manual) | Not Null |
| seats | INTEGER | - | Number of passenger seats | Not Null |
| rate | DECIMAL | 10,2 | Daily rental rate in MYR | Not Null |
| status | VARCHAR | 20 | Current availability (Available, Rented, Maintenance) | Not Null, Default 'Available' |
| image | TEXT | - | Primary vehicle image URL | Nullable |
| images | JSONB | - | Array of additional image URLs | Nullable |
| features | JSONB | - | Array of vehicle features | Nullable |
| description | TEXT | - | Detailed vehicle description | Nullable |
| created_at | TIMESTAMP | - | Record creation timestamp | Auto-generated |

**Table 3.2: Data Dictionary - Bookings Table**

| Field Name | Data Type | Size | Description | Constraint |
|---|---|---|---|---|
| id | INTEGER | - | Unique booking identifier | Primary Key, Auto-increment |
| booking_id | VARCHAR | 20 | Human-readable booking reference (BK-YYYY-NNN) | Not Null, Unique |
| customer_id | UUID | - | Reference to customer account | Foreign Key (customers.id) |
| car_id | INTEGER | - | Reference to booked vehicle | Foreign Key (cars.id) |
| customer_name | VARCHAR | 255 | Customer full name | Not Null |
| customer_phone | VARCHAR | 20 | Customer contact phone | Not Null |
| car_name | VARCHAR | 255 | Vehicle name (denormalized for performance) | Not Null |
| car_plate | VARCHAR | 20 | Vehicle plate number (denormalized) | Not Null |
| pickup_date | DATE | - | Rental start date | Not Null |
| return_date | DATE | - | Rental end date | Not Null |
| days | INTEGER | - | Number of rental days | Not Null |
| daily_rate | DECIMAL | 10,2 | Daily rate at time of booking | Not Null |
| total | DECIMAL | 10,2 | Total booking amount | Not Null |
| status | VARCHAR | 20 | Booking status (Pending, Confirmed, Active, Completed, Cancelled) | Not Null |
| payment_method | VARCHAR | 50 | Payment method used | Nullable |
| created_at | TIMESTAMP | - | Booking creation timestamp | Auto-generated |

**Table 3.3: Data Dictionary - Customers Table**

| Field Name | Data Type | Size | Description | Constraint |
|---|---|---|---|---|
| id | UUID | - | Unique customer identifier (from Supabase Auth) | Primary Key |
| email | VARCHAR | 255 | Customer email address | Not Null, Unique |
| full_name | VARCHAR | 255 | Customer full name | Not Null |
| phone | VARCHAR | 20 | Contact phone number | Nullable |
| ic_number | VARCHAR | 20 | Malaysian IC number | Nullable |
| license_number | VARCHAR | 30 | Driving license number | Nullable |
| username | VARCHAR | 50 | Display username | Nullable |
| avatar_url | TEXT | - | Profile picture URL | Nullable |
| status | VARCHAR | 20 | Account status (Active, Inactive, Pending) | Default 'Active' |
| total_bookings | INTEGER | - | Count of all bookings | Default 0 |
| total_spent | DECIMAL | 10,2 | Total amount spent on bookings | Default 0.00 |
| joined_date | TIMESTAMP | - | Account creation date | Auto-generated |
| last_booking | TIMESTAMP | - | Most recent booking date | Nullable |
| verification_status | VARCHAR | 20 | Document verification status | Default 'Pending' |

**Additional Data Entities:**

- **Admins Table:** Stores administrator account information (email, role), used to determine admin access during login.
- **Marketing Data:** Stores banner advertisements, promotional codes, and seasonal pricing adjustments. Currently managed through localStorage with database persistence planned.
- **Config/Settings:** Stores system configuration including company information, tax rates, deposit policies, operating hours, and pickup locations.

### 3.3.2 Functional Requirement

The functional requirements of WeDRIVE are illustrated through a hierarchical set of diagrams: Context Diagram, Data Flow Diagram (DFD) Level 0, and DFD Level 1.

**Context Diagram**

The context diagram shows the WeDRIVE system as a single process and its interactions with external entities.

> *[Figure 3.3: Context Diagram - To be inserted]*

The system interacts with four external entities:

1. **Customer:** Registers account, browses vehicles, makes bookings, views booking history, uses AI chatbot, manages profile.
2. **Administrator:** Manages vehicles, manages bookings, manages customers, views reports, configures settings, manages marketing, configures AI chatbot.
3. **Guest:** Browses vehicles, views pricing, uses AI chatbot (limited), redirected to login for booking.
4. **AI Service Provider (Gemini/Grok):** Receives chat prompts and system context, returns AI-generated responses for the chatbot module.

**Data Flow Diagram Level 0**

The DFD Level 0 provides a more detailed view of the major processes within the WeDRIVE system.

> *[Figure 3.4: Data Flow Diagram Level 0 - To be inserted]*

The major processes identified are:

- **P1 - Authentication Process:** Handles user registration, login (email/password and Google OAuth), session management, and role-based access control.
- **P2 - Vehicle Management Process:** Manages the vehicle fleet including adding, editing, deleting vehicles, updating availability status, and providing vehicle data for browsing.
- **P3 - Booking Management Process:** Handles the complete booking lifecycle from vehicle selection through date selection, payment processing, booking confirmation, and status tracking.
- **P4 - Customer Management Process:** Manages customer profiles, booking history, and document verification.
- **P5 - AI Chatbot Process:** Processes customer queries, generates AI-powered responses using Gemini/Grok APIs, and provides vehicle recommendations.
- **P6 - Reporting and Analytics Process:** Generates business reports including revenue charts, fleet utilization rates, and booking statistics.
- **P7 - Marketing Management Process:** Manages promotional banners, discount codes, and seasonal pricing adjustments.

**Data Flow Diagram Level 1**

The DFD Level 1 decomposes each Level 0 process into sub-processes, providing detailed data flow information.

> *[Figure 3.5: Data Flow Diagram Level 1 - To be inserted]*

**Table 3.4: Functional Requirements Summary**

| ID | Requirement | Module | Priority |
|---|---|---|---|
| FR-01 | System shall allow users to register using email/password | Authentication | High |
| FR-02 | System shall allow users to login using Google OAuth 2.0 | Authentication | High |
| FR-03 | System shall authenticate users and redirect based on role (admin/customer) | Authentication | High |
| FR-04 | System shall allow customers to browse available vehicles with filters | Customer Portal | High |
| FR-05 | System shall display vehicle details with 360-degree exterior view | Customer Portal | High |
| FR-06 | System shall allow customers to select rental dates and calculate total cost | Booking | High |
| FR-07 | System shall process booking with payment information capture | Booking | High |
| FR-08 | System shall generate booking confirmation with QR code | Booking | Medium |
| FR-09 | System shall allow customers to view their booking history | Customer Portal | High |
| FR-10 | System shall allow customers to manage their profile information | Customer Portal | Medium |
| FR-11 | System shall provide AI chatbot for customer inquiries | AI Chatbot | High |
| FR-12 | System shall allow admin to add, edit, and delete vehicles | Admin - Cars | High |
| FR-13 | System shall allow admin to view and manage all bookings | Admin - Bookings | High |
| FR-14 | System shall allow admin to view customer profiles and history | Admin - Customers | Medium |
| FR-15 | System shall generate revenue and utilization reports | Admin - Reports | Medium |
| FR-16 | System shall allow admin to manage marketing campaigns | Admin - Marketing | Medium |
| FR-17 | System shall display a calendar overview with booking indicators | Admin - Calendar | Medium |
| FR-18 | System shall allow admin to configure system settings | Admin - Settings | Medium |
| FR-19 | System shall allow admin to configure AI chatbot settings and API keys | Admin - Chatbot | Medium |
| FR-20 | System shall allow guests to browse vehicles without registration | Guest | High |
| FR-21 | System shall support dual-theme (Day/Night mode) toggle | UI/UX | Medium |
| FR-22 | System shall support bilingual (English/Bahasa Melayu) switching | UI/UX | Medium |
| FR-23 | System shall send email notifications for booking events | Notification | Low |
| FR-24 | System shall support responsive design for mobile devices | UI/UX | High |

### 3.3.3 Non-functional Requirement

Table 3.5 documents the non-functional requirements that define the quality attributes of the WeDRIVE system.

**Table 3.5: Non-functional Requirements**

| ID | Category | Requirement | Measure |
|---|---|---|---|
| NFR-01 | Performance | Pages shall load within 3 seconds on a standard broadband connection | Load time < 3 seconds |
| NFR-02 | Performance | AI chatbot shall respond within 5 seconds under normal conditions | Response time < 5 seconds |
| NFR-03 | Usability | The system shall be accessible on desktop, tablet, and mobile browsers | Tested on Chrome, Safari, Firefox |
| NFR-04 | Usability | Touch targets shall be minimum 44x44 pixels for mobile users | Compliant with WCAG guidelines |
| NFR-05 | Security | User passwords shall be hashed using bcrypt algorithm | No plaintext password storage |
| NFR-06 | Security | All API communications shall use HTTPS encryption | SSL/TLS enforced |
| NFR-07 | Security | Database access shall be controlled through Row Level Security | RLS policies active |
| NFR-08 | Security | Authentication tokens (JWT) shall expire after a defined period | Token expiry enforced |
| NFR-09 | Reliability | AI chatbot shall have automatic failover from Gemini to Grok | Dual-model architecture |
| NFR-10 | Reliability | System shall be available 99.9% of the time (Vercel SLA) | Uptime monitoring |
| NFR-11 | Scalability | Database shall support growth to thousands of records | PostgreSQL scalability |
| NFR-12 | Maintainability | Code shall follow modular architecture (1 module = 1 CSS, structured JS) | Code review compliance |
| NFR-13 | Compatibility | System shall work on latest versions of Chrome, Firefox, Safari, Edge | Cross-browser testing |
| NFR-14 | Localization | System shall support dynamic language switching without page reload | EN/BM JSON language files |

### 3.3.4 Other Requirements

**Development Environment Requirements:**
- A stable internet connection is required for accessing Supabase cloud services, Vercel deployment, and AI API calls.
- Visual Studio Code with Live Server extension for local development and testing.
- Git and GitHub for version control and collaborative development.

**Operational Requirements:**
- System administrators must have basic technical knowledge to manage vehicle listings, configure chatbot settings, and interpret business reports.
- Regular database backups should be scheduled through Supabase's built-in backup functionality.
- AI API keys (Google Gemini, xAI Grok) must be kept confidential and stored securely in the admin chatbot settings panel.

**User Training Requirements:**
- A user manual shall be provided as an appendix to the final report (PSM II).
- The system shall incorporate intuitive UI design with clear navigation to minimize the learning curve.
- Tooltips and helper text shall be provided for complex form inputs.

## 3.4 Conclusion

This chapter has presented a comprehensive analysis of the WeDRIVE system requirements. The problem analysis revealed six key inefficiencies in the current manual car rental process and demonstrated how WeDRIVE's integrated platform addresses each of these issues. The requirement analysis documented the data requirements through detailed data dictionaries for the three primary entities (Cars, Bookings, Customers), defined 24 functional requirements organized by module and priority, established 14 non-functional requirements covering performance, security, usability, and maintainability, and identified additional development and operational requirements.

The analysis confirms that WeDRIVE's proposed feature set comprehensively addresses the problem statements identified in Chapter 1. The documented requirements provide a solid foundation for the system design phase, which is presented in the next chapter. Chapter 4 will translate these requirements into a concrete system architecture, user interface design, and database design.
