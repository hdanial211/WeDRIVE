# CHAPTER 3: ANALYSIS

## 3.1 Introduction
This chapter focuses on the system analysis phase of the WeDRIVE AI-Enabled Car Rental System. It outlines the problem analysis by comparing the conventional car rental workflow with WeDRIVE's proposed workflow. Section 3.2 details the As-Is and To-Be workflows. Section 3.3 presents the data requirements by mapping the cloud database table schemas. Section 3.4 outlines the functional requirements including use cases, and Section 3.5 discusses the non-functional requirements such as security policies, responsive viewports, and system performance.

---

## 3.2 Problem Analysis (Workflow Comparison)
To justify the system architecture, the operational workflows of traditional car rental agencies (As-Is) were analyzed against WeDRIVE's digital, automated workflow (To-Be).

### 3.2.1 As-Is Workflow (Conventional Rental)
In a traditional car rental agency:
1. **Selection:** The customer visits a basic website or physical office, viewing static stock photos of the car model (not the actual vehicle).
2. **Booking & Verification:** The customer makes a booking request via phone, WhatsApp, or email. The agent manually checks paper sheets or spreadsheets for vehicle availability. The customer takes photos of their Identity Card and Driving License and sends them over unsecured chat applications.
3. **Approval & Payment:** The agent manually reviews the documents. Payment is processed via cash deposit or manual bank transfer. The agent confirms the booking manually, which often takes hours or days.
4. **Inspection & Handover:** Upon pickup, the customer and agent inspect the car for scratches and write them on a physical paper form. Disputes are common upon return if new scratches are discovered.
5. **Support:** The customer relies on external navigation tools and manual itineraries during their travel.

### 3.2.2 To-Be Workflow (WeDRIVE System)
With WeDRIVE:
1. **Selection:** The customer browses the online catalog. They interact with the 360-degree virtual exterior inspection tool and step inside the cabin using the 3D panorama interior cubemap to verify the exact vehicle condition.
2. **Authentication & Profile Completion:** The customer logs in via Email or Google OAuth. First-time users are redirected to the complete profile wizard to upload their IC, license, and phone number (which auto-formats with country codes).
3. **Verification:** The customer's profile is sent to the admin dashboard for verification. The user cannot book until status is active.
4. **Interactive Booking:** Once active, the user selects rental dates. The Flatpickr calendar automatically blocks and disables dates already reserved for that car_id in the database.
5. **Instant Payment & Confirmation:** The customer inputs payment details. The system creates the record, updates the car status, and generates a dynamic booking receipt.
6. **Support:** The customer uses the built-in Gemini-powered support chatbot for local travel route planning.

---

## 3.3 Data Requirements (Database Schemas)
The database for WeDRIVE is hosted on Supabase (PostgreSQL). The logical data schemas for the database tables are defined below.

### 3.3.1 Table: admins
This table stores administrative credentials and authorization roles.
- **Primary Key:** `id` (SERIAL)
- **RLS Status:** Enabled (Only accessible to authenticated administrators)

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique identifier for each admin. |
| `email` | TEXT | UNIQUE, NOT NULL | Authentication email. |
| `name` | TEXT | NOT NULL | Full name of the administrator. |
| `role` | TEXT | DEFAULT 'Admin' | Security role mapping. |

### 3.3.2 Table: customers
This table holds the verified user profile details.
- **Primary Key:** `id` (SERIAL)
- **RLS Status:** Enabled (Users can read/write their own profile; admins have global read/write access)

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique internal customer ID. |
| `customer_id` | TEXT | UNIQUE | External formatted customer ID. |
| `name` | TEXT | NOT NULL | Full name matching IC/Passport. |
| `email` | TEXT | UNIQUE, NOT NULL | Customer contact and login email. |
| `phone` | TEXT | | Phone number including country code. |
| `ic` | TEXT | | National Identity Card number. |
| `license` | TEXT | | Driving license identification number. |
| `status` | TEXT | DEFAULT 'Pending' | Profile status: Pending, Active, Suspended. |
| `joined` | TIMESTAMPTZ | DEFAULT NOW() | Date when the account was created. |
| `auth_uid` | UUID | REFERENCES auth.users | Link to Supabase Auth user record. |

### 3.3.3 Table: cars
This table stores the vehicle fleet properties and media links.
- **Primary Key:** `id` (SERIAL)
- **RLS Status:** Enabled (Read-only for guests/customers; write/modify for admins)

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique vehicle ID. |
| `name` | TEXT | NOT NULL | Car make and model name. |
| `plate` | TEXT | UNIQUE | Vehicle registration plate number. |
| `type` | TEXT | | Category: Sedan, SUV, Hatchback, MPV. |
| `label` | TEXT | | Promotion label (e.g. Popular, Best Value). |
| `status` | TEXT | DEFAULT 'Available' | Availability: Available, Rented, Maintenance. |
| `rate` | NUMERIC | NOT NULL | Rental price per day (e.g. RM 450.00). |
| `fuel` | TEXT | | Fuel source: Petrol, Diesel, Hybrid, Electric. |
| `transmission` | TEXT | CHECK (Auto/Manual) | Transmission system type. |
| `seats` | INTEGER | | Vehicle passenger capacity. |
| `year` | INTEGER | | Manufacturing year. |
| `color` | TEXT | | Exterior paint color. |
| `rating` | NUMERIC | | Average rating from user reviews. |
| `reviews` | INTEGER | | Number of reviews submitted. |
| `ai` | TEXT | | AI summary description of the car. |
| `images` | JSONB | | File paths for exterior frames & panoramas. |

### 3.3.4 Table: bookings
This table records all vehicle reservations.
- **Primary Key:** `id` (SERIAL)
- **RLS Status:** Enabled (Users read/write their own bookings; admins full access)

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | PRIMARY KEY | Unique booking database record ID. |
| `booking_id` | TEXT | UNIQUE | Booking ID (Format: BK-YYYY-XXX). |
| `car_id` | INTEGER | REFERENCES cars(id) | Foreign key linked to vehicle. |
| `car` | TEXT | | Car model name. |
| `plate` | TEXT | | Vehicle license plate. |
| `customer` | TEXT | | Full name of the customer. |
| `email` | TEXT | | Customer contact email. |
| `phone` | TEXT | | Customer contact phone. |
| `ic` | TEXT | | Customer identity card reference. |
| `start_date` | DATE | NOT NULL | Rental commencement date. |
| `end_date` | DATE | NOT NULL | Rental completion date. |
| `days` | INTEGER | NOT NULL | Total rental duration in days. |
| `daily` | NUMERIC | | Rental rate per day. |
| `total` | NUMERIC | NOT NULL | Aggregate billing amount (Days * Daily). |
| `status` | TEXT | DEFAULT 'Pending' | Booking status: Pending, Confirmed, Active, Completed, Cancelled. |
| `payment` | TEXT | DEFAULT 'Unpaid' | Payment status: Unpaid, Paid, Refunded. |
| `type` | TEXT | | Payment channel type. |
| `pickup` | TEXT | | Pickup location address. |
| `dropoff` | TEXT | | Return drop-off location address. |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Booking timestamp. |

---

## 3.4 Functional Requirements (Use Cases & Navigation Flow)
The functional requirements describe what actions actors can perform in the system.

### 3.4.1 Primary Actors
1. **Guest:** Can view home page, explore vehicles, toggle themes, select language.
2. **Customer:** Can manage user profile, upload documents, select available dates, process payment checkouts, view digital receipts, query AI chatbot.
3. **Admin:** Can verify profiles, add/edit/delete vehicles, modify booking statuses, review system analytics.

### 3.4.2 Use Cases List
- **UC 1: Authenticate User:** Guests sign up or log in using email credentials or Google OAuth.
- **UC 2: Complete User Profile:** New users upload national ID (IC), driving license, and format phone numbers.
- **UC 3: View 360 Vehicle Inspection:** Users interact with the drag-to-rotate exterior and look-around interior panorama.
- **UC 4: Search & Select Vehicle:** Users filter vehicles by type (Sedan, SUV) and check date ranges on flatpickr.
- **UC 5: Submit Booking & Checkout:** Customers input billing details to confirm reservation.
- **UC 6: Query AI Travel Assistant:** Customers chat with the chatbot for itinerary suggestions.
- **UC 7: Manage Cars Inventory (Admin):** Admin updates vehicle list (rates, transmission type, availability).
- **UC 8: Verify Profiles & Bookings (Admin):** Admin reviews documents, updates user statuses, and overrides bookings.

---

## 3.5 Non-Functional Requirements
Non-functional requirements describe system performance constraints, accessibility, and visual guidelines:

### 3.5.1 Security & Data Integrity
- **Database Row Level Security (RLS):** Policies are enabled for critical tables. For example, bookings are protected using the rule:
  ```sql
  CREATE POLICY "allow_user_bookings" ON bookings
  FOR ALL TO authenticated
  USING (auth.uid() = auth_uid);
  ```
  This ensures that users can only view and update their own bookings, preventing unauthorized access.
- **Password Safety:** Managed by Supabase Auth, which hashes user passwords using the bcrypt algorithm. Plaintext passwords are never saved.
- **Secure Communication:** Enforces HTTPS for all client-to-database requests.

### 3.5.2 Responsive Viewport Breakpoints
To ensure usability across all devices (desktops, tablets, and smartphones), the CSS implements specific breakpoints:
- **Desktop/Laptop (Standard):** Widths greater than 1100px. Standard sidebar is fully expanded.
- **Tablet Landscape:** Maximum width of 1100px. Layout elements shift from columns to compact rows.
- **Tablet Portrait:** Maximum width of 900px. Sidebar collapses automatically.
- **Mobile Landscape:** Maximum width of 768px. Touch targets are scaled to a minimum of 44x44px.
- **Mobile Portrait:** Maximum width of 600px. Text sizes and grid structures shift to a single-column layout.

### 3.5.3 Performance & Availability
- **Hosting Latency:** Hosted on Vercel with serverless routing. Dynamic database requests are routed to the Singapore (ap-southeast-1) region, resulting in low latency for users in Malaysia.
- **File Assets Optimization:** Image assets for the 360-degree viewer are compressed to reduce page size, ensuring fast initial page loads.

---

## 3.6 Conclusion
This chapter has analyzed the operational, logical, and structural requirements of WeDRIVE. The To-Be workflow resolves transparency issues with the 360-degree virtual viewer and addresses security concerns via a structured profile completion flow. The database schemas, use cases, and non-functional requirements detailed here establish the blueprint for implementation.
