# CHAPTER 4: DESIGN

## 4.1 Introduction

This chapter presents the system design for the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The design phase translates the requirements documented in Chapter 3 into a concrete technical blueprint that guides the implementation phase. The design decisions outlined in this chapter reflect best practices in modern web application development, prioritizing modularity, scalability, and user experience.

Section 4.2 covers the high-level design, including the overall system architecture, user interface design with navigation, input, and output considerations, and the database design encompassing both conceptual and logical models. Section 4.3 presents the detailed design, breaking down the software architecture into modules and defining the physical database schema. The chapter concludes with a summary of the design decisions and their alignment with the project objectives.

## 4.2 High-Level Design

### 4.2.1 System Architecture

The WeDRIVE system adopts a **client-server architecture** utilizing a Backend-as-a-Service (BaaS) model. This architecture separates the presentation layer (frontend) from the data and business logic layer (backend), enabling independent development and deployment of each component.

**Architecture Overview**

The system architecture consists of four primary layers:

1. **Presentation Layer (Frontend):** Built with vanilla HTML5, CSS3, and JavaScript, the frontend runs entirely in the user's web browser. It is responsible for rendering the user interface, handling user interactions, and communicating with the backend through API calls. The frontend is organized into four modules: Guest, Account (Authentication), Customer, and Admin.

2. **Application Layer (API):** Supabase provides an automatically generated RESTful API for all database tables. The `shared/js/api.js` file serves as the centralized API configuration module, abstracting all data operations and providing a unified interface (`window.WeDriveAPI`) for all frontend modules to access backend services.

3. **Service Layer (External Services):** Several external services are integrated into the system:
   - **Supabase Auth:** Handles user authentication (email/password, Google OAuth 2.0) and session management with JWT tokens.
   - **Supabase Storage:** Manages file uploads including vehicle images and customer documents.
   - **Google Gemini API:** Primary AI language model for chatbot responses.
   - **xAI Grok API:** Fallback AI language model for chatbot (automatic failover).
   - **Resend API:** Email delivery service for booking notifications via Supabase Edge Functions.

4. **Data Layer (Database):** PostgreSQL database hosted on Supabase (Singapore region, ap-southeast-1) stores all persistent application data including vehicles, bookings, customers, admins, and system configuration. Row Level Security (RLS) policies enforce data access control at the database level.

> *[Figure 4.1: System Architecture Diagram - To be inserted]*

**Deployment Architecture**

The deployment architecture leverages cloud services to minimize infrastructure management overhead:

- **Frontend Hosting:** Vercel (vercel.com) hosts the static frontend files with global CDN distribution. Automatic deployment is triggered on every push to the GitHub main branch.
- **Backend Services:** Supabase (supabase.com) provides PostgreSQL database, authentication, storage, and edge functions as managed cloud services.
- **Domain:** The custom domain wedrive.website points to the Vercel deployment.
- **Version Control:** GitHub repository (github.com/hdanial211/WeDRIVE) manages source code with structured versioning (Major.Minor.Patch format).

> *[Figure 4.2: Deployment Architecture - To be inserted]*

The deployment flow follows a continuous deployment model:

```
Developer commits code -> GitHub Repository -> Vercel auto-deploys -> wedrive.website updated
```

This architecture supports the Agile methodology by enabling rapid iteration and deployment of changes.

### 4.2.2 User Interface Design

The WeDRIVE user interface is designed following modern web design principles, drawing inspiration from premium platforms such as Airbnb (booking flow), Stripe (glassmorphism and micro-animations), Apple (typography and whitespace), Linear (dark mode), and Vercel (minimalist dashboard).

**Design Principles:**

- **Premium Aesthetics:** Glassmorphism effects (frosted glass with semi-transparent backgrounds), smooth gradient accents, and micro-animations create a visually premium experience.
- **Dual-Theme Support:** Day Mode (light theme) and Night Mode (dark theme) are supported through separate CSS files (`theme_day.css` and `theme_night.css`), with user preference persisted in localStorage.
- **Responsive Design:** All pages are fully responsive, adapting to desktop (1200px+), tablet (768px-1100px), and mobile (below 768px) viewports. The sidebar collapses to a hamburger menu on mobile.
- **Bilingual Support:** Dynamic language switching between English and Bahasa Melayu is implemented through JSON language files (`en.json`, `ms.json`), with text elements linked via `data-key` attributes.
- **Consistent Typography:** Inter font family (Google Fonts) is used throughout the system for a clean, modern appearance.

**Navigation Design**

The navigation structure differs based on the user module:

| Module | Navigation Type | Component |
|---|---|---|
| Guest | Top Navbar | `shared/components/navbar.html` loaded by `navbar-loader.js` |
| Account (Auth) | Standalone (no navigation) | Self-contained pages |
| Customer | Sidebar | Generated by `customer/js/sidebar-loader.js` |
| Admin | Sidebar | `admin/components/sidebar/sidebar-admin.html` loaded by `sidebar-loader.js` |

The Admin sidebar provides navigation to the following sections: Dashboard, Cars Management, Bookings, Customers, Reports, Calendar Overview, Marketing, AI Chatbot Settings, and System Settings.

The Customer sidebar provides navigation to: Dashboard (Browse Cars), My Bookings, Profile, and Support.

> *[Figure 4.9: Navigation Flow Diagram - To be inserted]*

**Input Design**

Key input interfaces in the WeDRIVE system include:

1. **Login Form:** Email and password fields with Google Sign-In button. Auto-fill support and form validation with real-time error feedback.

2. **Signup Form:** Email, password, and confirm password fields with password strength validation. Google Sign-In alternative with automatic account creation.

3. **Complete Profile Form:** Full name, phone number, IC number, driving license number, and username fields. Document upload capability for ID verification.

4. **Booking Form:** Date picker (Flatpickr) for pickup and return dates, add-on selection checkboxes (GPS, child seat, insurance), and payment information capture.

5. **Admin Car Form:** Vehicle name, plate number, type selection, fuel type, transmission, seats, daily rate, status, description, and image upload fields.

6. **Admin Settings Form:** Company name, email, phone, address, currency, tax rate, maximum rental days, deposit amount, and operating hours configuration.

7. **Chatbot Input:** Free-text message input with send button, supporting natural language queries to the AI chatbot.

**Output Design**

Key output interfaces include:

1. **Vehicle Cards:** Grid display of available vehicles showing image, name, type, fuel, transmission, seats, daily rate, status badge, and Book Now button.

2. **360-Degree Vehicle Viewer:** Interactive canvas displaying 200-frame exterior rotation with drag/swipe interaction, and cubemap interior panorama using Three.js.

3. **Booking Confirmation:** Summary card showing booking reference (QR code), vehicle details, rental dates, duration, total cost, and payment method.

4. **Admin Dashboard:** Stats cards (total vehicles, active rentals, revenue today, new customers), current car status table, and quick action navigation cards.

5. **Revenue Report Charts:** CSS-based bar charts displaying monthly revenue trends and vehicle utilization percentages.

6. **Calendar Overview:** Monthly calendar grid with booking indicators (dots), event markers, seasonal pricing badges, and daily detail panels on click.

**User Interface Screenshots**

The following figures illustrate the key interfaces of the WeDRIVE system:

> *[Figure 4.3: Landing Page (Guest View) - Screenshot to be inserted]*
> *[Figure 4.4: Customer Dashboard - Screenshot to be inserted]*
> *[Figure 4.5: Car Details Page with 360-Degree Viewer - Screenshot to be inserted]*
> *[Figure 4.6: Booking Flow Interface - Screenshot to be inserted]*
> *[Figure 4.7: Admin Dashboard - Screenshot to be inserted]*
> *[Figure 4.8: Admin Car Management - Screenshot to be inserted]*

### 4.2.3 Database Design

**Conceptual Database Design**

The WeDRIVE database is designed around the following key entities and their relationships:

1. **Customers** (registered users who can make bookings)
2. **Cars** (vehicles available for rental)
3. **Bookings** (rental transactions linking customers to cars)
4. **Admins** (system administrators)
5. **Marketing** (promotional campaigns and pricing)
6. **Config** (system configuration settings)

The primary relationships are:
- A **Customer** can make many **Bookings** (one-to-many)
- A **Car** can have many **Bookings** (one-to-many)
- A **Booking** belongs to one **Customer** and one **Car** (many-to-one)
- An **Admin** manages **Cars**, **Bookings**, **Marketing**, and **Config** (administrative relationship)

**Entity Relationship Diagram (ERD)**

> *[Figure 4.10: Entity Relationship Diagram (ERD) - To be inserted]*

The ERD illustrates the following relationships:

```
CUSTOMERS ||--o{ BOOKINGS : "makes"
CARS ||--o{ BOOKINGS : "is booked in"
ADMINS ||--|| CONFIG : "manages"
ADMINS ||--o{ MARKETING : "manages"
```

Where:
- `||--o{` denotes a one-to-many relationship
- `||--||` denotes a one-to-one relationship

**Logical Database Design**

The logical data model refines the ERD into normalized table structures suitable for implementation in PostgreSQL.

> *[Figure 4.11: Logical Database Design - To be inserted]*

**Table 4.1: Database Tables and Descriptions**

| Table Name | Description | Primary Key | Foreign Keys | Records |
|---|---|---|---|---|
| customers | Registered customer accounts and profiles | id (UUID) | - | 5 |
| cars | Vehicle fleet inventory and specifications | id (INTEGER) | - | 8 |
| bookings | Rental booking transactions | id (INTEGER) | customer_id -> customers.id, car_id -> cars.id | 110 |
| admins | System administrator accounts | id (INTEGER) | - | 1 |
| marketing | Promotional banners, promo codes, seasonal pricing | id (INTEGER) | - | Variable |
| config | System configuration and settings | id (INTEGER) | - | 1 |

**Normalization:**

The database design follows Third Normal Form (3NF) with the following considerations:

- **First Normal Form (1NF):** All tables have atomic values in each column, with no repeating groups. JSONB columns (features, images in cars table) store structured arrays that are treated as atomic values by the application layer.

- **Second Normal Form (2NF):** All non-key attributes are fully functionally dependent on the primary key. No partial dependencies exist.

- **Third Normal Form (3NF):** No transitive dependencies exist between non-key attributes. Note: The bookings table includes denormalized fields (customer_name, car_name, car_plate) for query performance optimization, as booking records are frequently displayed without joining to the customers and cars tables.

## 4.3 Detailed Design

### 4.3.1 Software Design

The WeDRIVE software architecture follows a modular design pattern, organized by functional modules. Each module has its own HTML pages, JavaScript logic, and (where applicable) CSS styling, promoting separation of concerns and maintainability.

**Module Architecture**

> *[Figure 4.12: Module Architecture Diagram - To be inserted]*

The system is organized into the following modules:

**1. Shared Module (`shared/`)**

The shared module contains reusable components and utilities used across all other modules:

- `js/api.js` - Centralized API configuration and data access layer (WeDriveAPI)
- `js/main.js` - Theme management, language switching, footer loading, animation initialization
- `js/supabase-config.js` - Supabase client initialization (Auth + DB)
- `js/auth-guard.js` - Route protection based on user role
- `js/chatbot.js` - Reusable AI chatbot component
- `js/navbar-loader.js` - Dynamic navbar generation
- `js/sidebar-loader.js` - Admin sidebar loading
- `js/vehicle-viewer.js` - 360-degree vehicle viewer component
- `js/animate.js` - Page transition and scroll reveal animations
- `css/theme_day.css`, `css/theme_night.css` - Theme stylesheets
- `lang/en.json`, `lang/ms.json` - Language translation files
- `components/navbar.html`, `components/footer.html` - Shared HTML components

**2. Account Module (`account/`)**

Handles all authentication-related pages:

- `pages/login/login.html` - User sign-in page
- `pages/signup/signup.html` - New account registration
- `pages/forgot-password/forgot-password.html` - Password reset flow
- `pages/welcome/welcome.html` - Post-login welcome screen
- `pages/complete-profile/complete-profile.html` - Profile completion (IC, license, phone, documents)
- `pages/verification-pending/verification-pending.html` - Document verification waiting screen
- `css/auth.css` - Authentication pages styling

**3. Guest Module (`guest/`)**

Provides browsing capabilities for unauthenticated users:

- `pages/explore-melaka/explore-melaka.html` - Tourist attractions guide
- `pages/how-it-works/how-it-works.html` - Rental process tutorial with scrollytelling
- `pages/pricing/pricing.html` - Pricing tiers and plans
- `css/guest.css` - Guest pages styling
- `js/how-it-works.js` - Interactive animations for the tutorial page

**4. Customer Module (`customer/`)**

Full customer experience for registered users:

- `pages/dashboard/customer.html` - Vehicle browsing dashboard
- `pages/car-details/car-details.html` - Vehicle detail with 360-degree viewer
- `pages/car-details/booking/booking.html` - Booking form
- `pages/car-details/booking/payment/payment.html` - Payment and checkout
- `pages/car-details/booking/payment/booking-confirmed/booking-confirmed.html` - Confirmation with QR
- `pages/my-bookings/my-bookings.html` - Booking history and management
- `pages/my-bookings/receipt/receipt.html` - Booking receipt/invoice
- `pages/profile/profile.html` - Profile management
- `pages/support/support.html` - Help and support center
- `css/customer.css` - Customer pages styling
- `js/customer.js` - Customer logic (vehicle browsing, booking, details)
- `js/sidebar-loader.js` - Customer sidebar generation

**5. Admin Module (`admin/`)**

Comprehensive administration dashboard:

- `pages/dashboard/admin.html` - Admin overview dashboard
- `pages/car/cars.html` - Fleet management
- `pages/car/car-detail/car-detail.html` - Individual vehicle management
- `pages/booking/bookings.html` - Booking management
- `pages/customer/customers.html` - Customer management
- `pages/report/reports.html` - Business reports and analytics
- `pages/calendar/calendar.html` - Calendar overview
- `pages/marketing/marketing.html` - Marketing campaign management
- `pages/chatbot/chatbot.html` - AI chatbot configuration
- `pages/setting/settings.html` - System settings
- `css/admin.css` - Admin pages styling
- `js/admin.js`, `js/cars.js`, `js/car-detail.js`, `js/bookings.js`, `js/customers.js`, `js/reports.js`, `js/calendar.js`, `js/marketing.js`, `js/marketing-ai.js`, `js/chatbot-admin.js`, `js/settings.js` - Module-specific logic

**API Layer Design (api.js)**

The `shared/js/api.js` file serves as the single source of truth for all data operations. It provides the following key methods through the `window.WeDriveAPI` global object:

| Method | Description | Module(s) |
|---|---|---|
| `loginUser(email, password)` | Authenticate user via Supabase Auth | Account |
| `getCars()` | Retrieve all vehicles | Customer, Guest, Admin |
| `getCarById(id)` | Retrieve single vehicle details | Customer, Admin |
| `getBookings()` | Retrieve all bookings | Customer, Admin |
| `getCustomers()` | Retrieve all customers | Admin |
| `getAdminData()` | Retrieve complete admin dataset | Admin |
| `getMarketing()` | Retrieve marketing data | Admin, Guest, Customer |
| `saveMarketing(data)` | Persist marketing changes | Admin |
| `getChatbotSettings()` | Retrieve chatbot configuration | AI Chatbot |
| `saveChatbotSettings(data)` | Persist chatbot configuration | Admin |

### 4.3.2 Physical Database Design

The physical database design translates the logical model into PostgreSQL Data Definition Language (DDL) statements for the Supabase PostgreSQL database.

**Table 4.2: Cars Table Schema (DDL)**

```sql
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plate VARCHAR(20) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    fuel VARCHAR(30) NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    seats INTEGER NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Available',
    image TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Table 4.3: Bookings Table Schema (DDL)**

```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(20) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id),
    car_id INTEGER REFERENCES cars(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    car_name VARCHAR(255) NOT NULL,
    car_plate VARCHAR(20) NOT NULL,
    pickup_date DATE NOT NULL,
    return_date DATE NOT NULL,
    days INTEGER NOT NULL,
    daily_rate DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Table 4.4: Customers Table Schema (DDL)**

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    ic_number VARCHAR(20),
    license_number VARCHAR(30),
    username VARCHAR(50),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    joined_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_booking TIMESTAMP WITH TIME ZONE,
    verification_status VARCHAR(20) DEFAULT 'Pending'
);
```

**Row Level Security (RLS) Policies:**

```sql
-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Customers can only read their own data
CREATE POLICY "Customers can view own profile"
ON customers FOR SELECT
USING (auth.uid() = id);

-- Cars are publicly readable
CREATE POLICY "Anyone can view cars"
ON cars FOR SELECT
USING (true);

-- Customers can only view their own bookings
CREATE POLICY "Customers can view own bookings"
ON bookings FOR SELECT
USING (auth.uid() = customer_id);
```

**Indexes for Query Optimization:**

```sql
-- Index for booking queries by customer
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);

-- Index for booking queries by car
CREATE INDEX idx_bookings_car_id ON bookings(car_id);

-- Index for filtering cars by type and status
CREATE INDEX idx_cars_type_status ON cars(type, status);

-- Index for booking date range queries
CREATE INDEX idx_bookings_dates ON bookings(pickup_date, return_date);
```

## 4.4 Conclusion

This chapter has presented the comprehensive system design for the WeDRIVE project. The high-level design established a client-server architecture utilizing Supabase as a Backend-as-a-Service provider, with Vercel handling frontend hosting and continuous deployment. The user interface design was described with attention to modern design principles including glassmorphism aesthetics, dual-theme support, bilingual capability, and responsive layouts. The database design was presented through an Entity Relationship Diagram and normalized table structures following Third Normal Form.

The detailed design broke down the software into five modular components (Shared, Account, Guest, Customer, Admin), each with clearly defined responsibilities and file structures. The centralized API layer (`api.js`) was documented with its key methods and the modules they serve. The physical database design provided complete DDL statements for the primary tables, along with Row Level Security policies and performance-oriented indexes.

This design provides a solid, implementable blueprint for the development phase in PSM II. The modular architecture ensures that each component can be developed, tested, and deployed independently, aligning with the Agile iterative methodology adopted for the project. The next phase (PSM II) will focus on implementing this design, followed by comprehensive testing and final deployment.
