# WeDRIVE Full System Flowchart

This file describes the complete operational flow of the WeDRIVE system. The diagrams are structured using Mermaid syntax and represent the actual, active implementation of the system using Supabase PostgreSQL, Authentication, and dynamic layouts.

---

## 1. Overall System Architecture

```mermaid
flowchart TD
    START["User opens WeDRIVE Portal"] --> DOMAIN["http://localhost:5500 or https://wedrive.website"]
    DOMAIN --> CHOOSE_ROLE{"Authenticated?"}

    CHOOSE_ROLE -->|No| GUEST_FLOW["Guest Portal (guest/pages/)"]
    CHOOSE_ROLE -->|Yes| AUTH_CHECK["Read Supabase Session"]

    GUEST_FLOW --> BROWSE_GUEST["Browse cars, explore Melaka, view pricing"]
    BROWSE_GUEST --> BOOK_GUEST["Click Book Now"]
    BOOK_GUEST --> REDIRECT_AUTH["Redirect to account/pages/login/"]

    AUTH_CHECK --> USER_ROLE{"Admin or Customer?"}

    USER_ROLE -->|Admin| ADMIN_DASH["admin/pages/dashboard/admin.html"]
    USER_ROLE -->|Customer| PROFILE_VERIFY{"Profile Verified Status?"}

    PROFILE_VERIFY -->|Incomplete/Pending| SPLASH["account/pages/welcome/welcome.html"]
    SPLASH --> COMPLETE_FLOW["Complete Profile Form (IC, License, Phone)"]
    COMPLETE_FLOW --> UPLOAD_DOCS["Upload documents for verification"]
    UPLOAD_DOCS --> PENDING_PAGE["account/pages/verification-pending/verification-pending.html"]
    PENDING_PAGE -->|Awaiting Admin Approval| PENDING_PAGE

    PROFILE_VERIFY -->|Active| CUSTOMER_DASH["customer/pages/dashboard/customer.html"]

    CUSTOMER_DASH --> CUSTOMER_MODULES["Customer modules:<br/>Browse fleet, 360 viewer, book car,<br/>chat with support, view my bookings"]
```

---

## 2. Authentication and Profile Verification Flow

This flow details how users register, authenticate via Email or Google OAuth, and proceed through the profile verification compliance gate.

```mermaid
flowchart TD
    USER["New or returning user"] --> ENTRY["account/pages/login/login.html"]
    
    ENTRY --> EMAIL_SIGNUP["Click Sign Up"]
    ENTRY --> EMAIL_LOGIN["Enter Email & Password"]
    ENTRY --> GOOGLE_LOGIN["Click Sign in with Google"]

    EMAIL_SIGNUP --> SIGNUP_UI["account/pages/signup/signup.html"]
    SIGNUP_UI --> CALL_SIGNUP["WeDriveAPI.signupUser()"]
    CALL_SIGNUP --> SUPABASE_SIGNUP["supabase.auth.signUp()"]
    SUPABASE_SIGNUP --> CREATE_CUST_RECORD["Create 'customers' record (status='Pending')"]
    CREATE_CUST_RECORD --> AUTO_CONFIRM["Auto-confirm authentication email (dev mode)"]
    AUTO_CONFIRM --> REDIRECT_WELCOME["Redirect to welcome.html"]

    GOOGLE_LOGIN --> SUPABASE_OAUTH["supabase.auth.signInWithOAuth(provider='google')"]
    SUPABASE_OAUTH --> OAUTH_CALLBACK["Google Callback Redirect"]
    OAUTH_CALLBACK --> CREATE_OAUTH_CUST["Verify / Insert record in 'customers' table"]
    CREATE_OAUTH_CUST --> REDIRECT_WELCOME

    EMAIL_LOGIN --> CALL_LOGIN["WeDriveAPI.loginUser()"]
    CALL_LOGIN --> SUPABASE_LOGIN["supabase.auth.signInWithPassword()"]
    SUPABASE_LOGIN --> LOGIN_CHECK_ADMIN{"Email exists in 'admins' table?"}
    
    LOGIN_CHECK_ADMIN -->|Yes| REDIRECT_ADMIN["Redirect to admin dashboard"]
    LOGIN_CHECK_ADMIN -->|No| REDIRECT_WELCOME

    REDIRECT_WELCOME --> WELCOME_JS["welcome.js checks verification status"]
    WELCOME_JS --> STATUS_CHECK{"Status in 'customers' table?"}

    STATUS_CHECK -->|Active| GO_CUST_DASH["Redirect to customer/pages/dashboard/customer.html"]
    STATUS_CHECK -->|Pending / Incomplete| GO_COMPLETE["Redirect to account/pages/complete-profile/complete-profile.html"]

    GO_COMPLETE --> UPLOAD_VERIFICATION["User uploads IC, License, formats Phone with country code"]
    UPLOAD_VERIFICATION --> SAVE_PROFILE["WeDriveAPI.updateCustomerProfile()"]
    SAVE_PROFILE --> UPDATE_DB_PENDING["Update status='Pending' in 'customers' table"]
    UPDATE_DB_PENDING --> GO_PENDING_PAGE["Redirect to verification-pending.html"]
```

---

## 3. Customer Booking and Calendar Blocking Flow

```mermaid
flowchart TD
    CUST_START["Customer opens customer.html"] --> LOAD_FLEET["WeDriveAPI.getCars()"]
    LOAD_FLEET --> RENDER_GRID["Render vehicle grid with placeholders"]
    RENDER_GRID --> CHOOSE_CAR["Select vehicle (Click View Details)"]
    CHOOSE_CAR --> DETAILS["customer/pages/car-details/car-details.html?id=carId"]
    DETAILS --> VIEWER_360["Render 360-degree exterior & Three.js interior panorama"]
    DETAILS --> CLICK_BOOK["Click Book Now"]

    CLICK_BOOK --> BOOK_FORM["customer/pages/car-details/booking/booking.html"]
    BOOK_FORM --> GET_DATES["WeDriveAPI.getBookedDatesForCar(carId)"]
    GET_DATES --> QUERY_BOOKINGS["Query 'bookings' where status IN ('Active','Pending','Confirmed')"]
    QUERY_BOOKINGS --> DISABLE_DATES["Disable date ranges in Flatpickr calendar"]
    
    BOOK_FORM --> SELECT_DATES["User selects available dates"]
    SELECT_DATES --> FILL_CONTACT["Enter contact details & format phone number"]
    FILL_CONTACT --> GO_CHECKOUT["Click Proceed to Payment"]

    GO_CHECKOUT --> CHECKOUT_UI["booking/payment/payment.html"]
    CHECKOUT_UI --> SUBMIT_PAYMENT["Enter payment details (demo checkout)"]
    SUBMIT_PAYMENT --> CALL_CREATE_BOOKING["WeDriveAPI.createBooking()"]
    
    CALL_CREATE_BOOKING --> DB_INSERT_BOOKING["Insert record in 'bookings' table (status='Pending', payment='Paid')"]
    DB_INSERT_BOOKING --> DB_UPDATE_CAR["Update status='Rented' in 'cars' table"]
    DB_UPDATE_CAR --> CONFIRMATION["Redirect to booking-confirmed.html"]
    CONFIRMATION --> DISPLAY_RECEIPT["Display dynamic booking receipt and QR code"]
```

---

## 4. Admin Management and Real-Time Dashboard Flow

```mermaid
flowchart TD
    ADMIN_START["Admin opens admin.html"] --> QUERY_DASH["WeDriveAPI.getAdminData()"]
    
    QUERY_DASH --> QUERY_STATS["Compute statistics from 'bookings', 'cars', and 'customers' tables"]
    QUERY_STATS --> DISPLAY_STATS["Display total revenue, active rentals, fleet, and new customers"]
    QUERY_DASH --> DISPLAY_CARS["Display active vehicle inventory table"]

    ADMIN_START --> NAV_MODULES["Select Admin Modules"]

    NAV_MODULES --> MODULE_CARS["Cars Management (cars.html)"]
    MODULE_CARS --> CARS_CRUD["Perform vehicle CRUD operations"]
    CARS_CRUD --> UPDATE_DB_CARS["Insert/Update/Delete cars in database"]

    NAV_MODULES --> MODULE_BOOKINGS["Bookings Management (bookings.html)"]
    MODULE_BOOKINGS --> VIEW_DETAIL_MODAL["Click booking -> opens receipt-style modal"]
    VIEW_DETAIL_MODAL --> FILTER_SEARCH["Search and filter by date range, status, or vehicle"]
    VIEW_DETAIL_MODAL --> CHANGE_STATUS["Select status dropdown (Pending, Confirmed, Active, Completed, Cancelled)"]
    CHANGE_STATUS --> UPDATE_DB_BOOKING["Update record in 'bookings' table"]

    NAV_MODULES --> MODULE_CUSTOMERS["Customers Management (customers.html)"]
    MODULE_CUSTOMERS --> VIEW_DOCUMENTS["Inspect verification files and user details"]
    MODULE_CUSTOMERS --> TOGGLE_BLOCK["Toggle status (Active / Suspended)"]
    TOGGLE_BLOCK --> UPDATE_DB_CUSTOMER["Update customer status in database"]

    NAV_MODULES --> MODULE_REPORTS["Analytics & Reports (reports.html)"]
    MODULE_REPORTS --> GENERATE_CHARTS["Query real database data and render utilization charts"]

    NAV_MODULES --> MODULE_SETTINGS["Settings Config (settings.html)"]
    MODULE_SETTINGS --> DYNAMIC_SETTINGS["Update rental terms or system variables"]
    DYNAMIC_SETTINGS --> UPSERT_DB_SETTINGS["Upsert changes to 'settings' table"]
```

---

## 5. Unified Database Integration Architecture

The following diagram illustrates how the frontend components are decoupled from direct query calls, routing all operations through a unified API layer.

```mermaid
flowchart LR
    HTML["HTML Halaman"] --> CLIENT_JS["Halaman JavaScript"]
    CLIENT_JS --> API_LAYER["shared/js/api.js (WeDriveAPI)"]
    API_LAYER --> SDK_CLIENT["shared/js/supabase-config.js (supabase)"]
    SDK_CLIENT --> DB_CLOUD["Supabase PostgreSQL Cloud Database"]

    DB_CLOUD --> T_ADMINS["Table: admins"]
    DB_CLOUD --> T_CUSTOMERS["Table: customers"]
    DB_CLOUD --> T_CARS["Table: cars"]
    DB_CLOUD --> T_BOOKINGS["Table: bookings"]
    DB_CLOUD --> T_SETTINGS["Table: settings"]
    DB_CLOUD --> T_MARKETING["Table: marketing"]
```
