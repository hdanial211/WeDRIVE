# CHAPTER 2: LITERATURE REVIEW AND PROJECT METHODOLOGY

## 2.1 Introduction

This chapter presents a comprehensive review of the literature related to the development of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The chapter is organized into several key sections that collectively provide the theoretical and practical foundation for the project.

Section 2.2 discusses the facts and findings gathered through research, covering three main areas: the domain of car rental management systems and the current state of the industry, an analysis of existing car rental platforms in Malaysia, and the techniques and technologies applicable to the project. Section 2.3 describes the selected project methodology, explaining the Agile (Iterative) approach adopted for the development process. Section 2.4 details the project requirements, including software, hardware, and other resources needed. Finally, Section 2.5 presents the project schedule and milestones through a Gantt chart, outlining the planned activities and their timelines across the PSM I and PSM II phases.

## 2.2 Facts and Findings

### 2.2.1 Domain

**Car Rental Industry in Malaysia**

The car rental industry in Malaysia is a vital component of the nation's transportation and tourism sectors. With Malaysia attracting over 26 million tourists annually (Tourism Malaysia, 2024) and a growing domestic travel culture, the demand for flexible, short-term vehicle rental services has steadily increased. Major tourist destinations such as Melaka, Penang, Langkawi, and Sabah have particularly high demand for car rental services, as public transportation options in these areas may be limited.

Traditionally, car rental businesses in Malaysia have operated through a combination of walk-in offices, phone bookings, and basic websites. Many small and medium-sized operators still manage their fleets using spreadsheets, WhatsApp communication, and manual record-keeping. While larger companies such as Hertz, Avis, and Europcar have established digital booking platforms, the majority of local car rental businesses lack comprehensive digital management solutions (Kumar and Singh, 2025).

**AI in the Transportation and Hospitality Sector**

The integration of Artificial Intelligence (AI) into transportation and hospitality services has accelerated significantly in recent years. AI technologies, particularly chatbots and recommendation systems, have demonstrated substantial benefits in enhancing customer engagement, reducing operational costs, and improving service personalization (Adamopoulou and Moussiades, 2020).

In the context of car rental services, AI can be applied in several key areas. First, AI chatbots can provide instant responses to customer inquiries regarding vehicle availability, pricing, and booking procedures, operating 24/7 without human intervention (Nguyen and Do, 2026). Second, AI-driven recommendation engines can suggest suitable vehicles based on customer preferences, trip requirements, and historical data (Rybo AI, 2024). Third, AI-powered analytics can help operators optimize fleet utilization, predict demand patterns, and adjust pricing strategies dynamically (Gupta, 2024).

Research by Zhang and Wang (2026) on the landscape of AI chatbot adoption in tourism and hospitality reveals that while AI chatbots are widely used in hotels and airlines, their adoption in the car rental sector remains relatively low, particularly in Southeast Asian markets. This gap presents an opportunity for innovation, which the WeDRIVE project aims to address.

**Web-Based Management Systems**

Modern web-based management systems have evolved beyond simple informational websites to become comprehensive business platforms. The adoption of cloud computing and Backend-as-a-Service (BaaS) platforms such as Supabase, Firebase, and AWS Amplify has significantly lowered the barrier to developing full-featured web applications (Agentive AI, 2024). These platforms provide integrated services including database management, user authentication, file storage, and real-time data synchronization, enabling developers to focus on application logic and user experience rather than infrastructure management.

For the car rental domain, a web-based management system offers several advantages over desktop applications or manual processes: accessibility from any device with a web browser, real-time data synchronization across all users, lower deployment and maintenance costs, and the ability to scale resources based on demand (AirentoSoft, 2024).

### 2.2.2 Existing Systems

To inform the design and development of WeDRIVE, three existing car rental platforms operating in Malaysia were analyzed. These systems were selected to represent different approaches to car rental management: SOCAR as a mobile-first car-sharing platform, GoCar as a comprehensive mobility ecosystem, and KAYAK as a metasearch comparison engine.

**a) SOCAR (socar.my)**

SOCAR is a leading car-sharing platform in Malaysia that operates primarily through a mobile application. Founded in 2017, SOCAR provides on-demand car rental services across major cities in Malaysia, including Kuala Lumpur, Selangor, Penang, and Johor Bahru.

*Key Features:*
- Mobile-first approach with iOS and Android applications
- Keyless vehicle access using Bluetooth technology via the app
- Hourly, daily, weekly, and monthly rental options with a minimum 30-minute booking
- Over 30 different car models available
- SOCAR-2-YOU delivery service and SOCAR+ personal driver service
- 24-hour live chat customer support
- Fuel reimbursement system and mileage package options

*Strengths:*
- Seamless mobile experience with keyless access eliminates the need for physical key handover
- Flexible rental durations from as short as 30 minutes
- Wide geographic coverage across Malaysia
- Integrated live chat support for real-time assistance

*Limitations:*
- Heavily reliant on mobile app; limited web browser functionality
- No AI-powered chatbot or intelligent recommendations
- No 360-degree vehicle preview before booking
- Limited administrative tools for fleet operators (designed for SOCAR's internal use only)

> *[Figure 2.1: SOCAR Mobile Application Interface - To be inserted]*

**b) GoCar (gocar.my)**

GoCar is a comprehensive on-demand mobility platform in Malaysia that extends beyond traditional car rental to offer a full ecosystem of automotive services. GoCar's platform includes car sharing, car subscription, vehicle maintenance (GoCar Garage), and insurance services (GoInsuran).

*Key Features:*
- On-demand car sharing available 24/7 with rent-by-minute, hour, or day options
- GoCar Subs subscription service as an alternative to car ownership (monthly to 36-month plans)
- GoCar Garage integrated car servicing and repair platform
- GoInsuran insurance renewal service (within 3 minutes)
- Zero human interaction booking process via mobile app
- Collision Damage Waiver (CDW) and FLEX insurance packages
- Available in KL, Selangor, Penang, Johor Bahru, and KLIA

*Strengths:*
- Comprehensive ecosystem covering multiple automotive needs
- Flexible subscription model as an alternative to ownership
- Well-designed zero-touch booking experience
- Additional services (maintenance, insurance) add value for regular users

*Limitations:*
- Complex service offering may overwhelm new users
- No AI-driven customer support or chatbot integration
- No interactive vehicle preview (360-degree viewer)
- Primarily mobile-focused; web experience is secondary
- Pricing model can be complex with multiple add-on packages

> *[Figure 2.2: GoCar Booking Platform - To be inserted]*

**c) KAYAK (kayak.com.my)**

KAYAK is a global travel metasearch engine that aggregates car rental deals from hundreds of different travel sites and rental providers. Unlike SOCAR and GoCar, KAYAK does not own or operate a vehicle fleet; instead, it functions as a comparison platform.

*Key Features:*
- Metasearch engine aggregating deals from multiple providers
- Advanced filtering by vehicle type, rental company, fuel policy, and special features
- One-way rental search capability
- AI Mode for natural language travel queries and personalized recommendations
- "Trips" feature for organizing travel itineraries
- Price comparison across economy, compact, luxury, SUV, and family vehicles
- Hybrid/electric vehicle filtering options

*Strengths:*
- Comprehensive price comparison across many providers in a single search
- Advanced AI-powered search assistance
- Global coverage with local market options
- Strong filtering and sorting capabilities

*Limitations:*
- Acts as intermediary only; redirects to third-party providers for actual booking
- No direct fleet management capabilities
- Final pricing may differ from displayed estimates due to provider-specific fees
- No direct customer relationship management or post-booking support
- Quality of service depends entirely on the selected third-party provider

> *[Figure 2.3: KAYAK Car Rental Search Interface - To be inserted]*

**Comparison of Existing Systems**

Table 2.1 presents a comprehensive comparison of the three existing systems against the proposed WeDRIVE system.

*Table 2.1: Comparison of Existing Car Rental Systems*

| Feature | SOCAR | GoCar | KAYAK | WeDRIVE (Proposed) |
|---|---|---|---|---|
| Platform Type | Mobile App | Mobile App + Web | Web Metasearch | Web Application |
| Fleet Ownership | Own Fleet | Own Fleet | No Fleet (Aggregator) | Own Fleet Management |
| AI Chatbot | No | No | AI Mode (Search) | Yes (Gemini + Grok) |
| 360-Degree Vehicle View | No | No | No | Yes (200 frames) |
| Admin Dashboard | Internal Only | Internal Only | N/A | Full Admin Panel |
| Booking Management | Yes | Yes | Redirect to Provider | Yes (Full CRUD) |
| Customer Support | Live Chat (Human) | FAQ/Support | Provider-dependent | AI Chatbot 24/7 |
| Payment Integration | Yes | Yes | Provider-dependent | Demo (Future: Stripe) |
| Multi-language | EN/BM | EN/BM | Multi-language | EN/BM Toggle |
| Dark Mode | No | No | No | Yes (Day/Night) |
| Responsive Design | Mobile-first | Mobile-first | Yes | Yes (All devices) |
| Pricing Model | Hourly/Daily | Minute/Hour/Day | Comparison only | Daily Rate |
| Marketing Tools | N/A | N/A | N/A | Banners/Promo/Seasonal |
| Reports & Analytics | Internal | Internal | N/A | Built-in Dashboard |
| Vehicle Categories | 30+ Models | Multiple | Aggregated | 8 Models (Expandable) |
| IoT/Keyless Access | Yes (Bluetooth) | Yes | N/A | No (Out of Scope) |

The comparison reveals that while existing platforms such as SOCAR and GoCar excel in mobile-first car-sharing experiences with IoT-enabled keyless access, they lack AI-powered customer support, interactive vehicle previews, and accessible fleet management tools for small operators. KAYAK provides excellent comparison features but does not offer direct booking or fleet management capabilities. WeDRIVE aims to fill this gap by providing a comprehensive, web-based solution with integrated AI chatbot support, 360-degree vehicle visualization, and a full administrative dashboard accessible to small and medium-sized car rental operators.

### 2.2.3 Technique

This section discusses the key techniques and technologies employed in the development of WeDRIVE.

**a) Frontend Web Technologies (HTML5, CSS3, JavaScript)**

The WeDRIVE frontend is built using vanilla HTML5, CSS3, and JavaScript without relying on heavy frontend frameworks such as React, Vue, or Angular. This approach was chosen for several reasons: it reduces dependency on external libraries, ensures faster page load times, provides greater control over the application's behavior and appearance, and simplifies the development and maintenance process for a project of this scale.

HTML5 provides the semantic structure for all pages, CSS3 handles styling including responsive layouts, animations, glassmorphism effects, and dual-theme support, while JavaScript manages all dynamic functionality including API interactions, DOM manipulation, and client-side routing (MDN Web Docs, 2024).

**b) Backend-as-a-Service: Supabase**

Supabase is an open-source Backend-as-a-Service (BaaS) platform that provides a suite of backend tools built on top of PostgreSQL. For the WeDRIVE project, Supabase was selected over alternatives such as Firebase for several reasons:

- **PostgreSQL Database:** Supabase uses PostgreSQL, a powerful relational database that supports complex queries, transactions, and data integrity constraints, making it more suitable for a system with relational data (vehicles, bookings, customers) compared to Firebase's NoSQL Firestore.
- **Row Level Security (RLS):** Supabase's RLS feature allows fine-grained access control at the database level, ensuring that users can only access data they are authorized to view or modify.
- **Built-in Authentication:** Supabase Auth provides email/password and OAuth (Google) authentication with JWT token management.
- **Open Source:** Unlike Firebase, Supabase is fully open-source, avoiding vendor lock-in.
- **REST API:** Supabase automatically generates RESTful APIs for all database tables, simplifying frontend-backend communication (Supabase Documentation, 2024).

**c) AI Chatbot Integration**

The WeDRIVE AI chatbot utilizes a dual-model architecture with automatic failover:

- **Primary Model - Google Gemini (gemini-2.0-flash):** Google's latest language model provides fast, accurate responses for customer inquiries about vehicle availability, booking procedures, and general support questions.
- **Fallback Model - xAI Grok (grok-3-mini-fast):** In cases where the Gemini API is unavailable or returns an error, the system automatically falls back to xAI's Grok model to ensure uninterrupted chatbot service.

The chatbot is configured through the admin dashboard, where administrators can set system prompts, promotional context, greeting messages, and API keys. This architecture ensures high availability and allows the business to customize the chatbot's personality and knowledge base (Ali and Rahman, 2025).

**d) 360-Degree Vehicle Visualization**

WeDRIVE implements an interactive 360-degree vehicle viewer using a frame-sequence approach. Each vehicle is represented by 200 high-resolution photographs taken at evenly spaced angles around the vehicle. As the user drags or swipes across the viewer, the system dynamically loads and displays the corresponding frame, creating a smooth rotation effect. Interior views are rendered using a cubemap panorama technique with six directional images (front, back, left, right, top, bottom) processed through Three.js, a JavaScript 3D rendering library.

**e) Deployment and Hosting**

The application is deployed using Vercel, a cloud platform optimized for frontend applications. Vercel integrates directly with the project's GitHub repository, enabling automatic deployment whenever code changes are pushed to the main branch. This continuous deployment approach aligns with the Agile methodology adopted for the project, supporting rapid iteration and feedback cycles.

## 2.3 Project Methodology

The development of WeDRIVE follows the **Agile (Iterative) methodology** within the Software Development Life Cycle (SDLC) framework. The Agile approach was selected over traditional Waterfall methodology for several reasons:

1. **Incremental Development:** The project involves multiple interconnected modules (Customer Portal, Admin Dashboard, AI Chatbot, Guest Interface) that benefit from incremental development and testing, allowing each module to be built, tested, and refined independently before integration.

2. **Flexibility for Change:** Requirements for AI chatbot behavior, UI design preferences, and feature priorities may evolve as the project progresses. Agile's iterative nature accommodates these changes without disrupting the overall project timeline.

3. **Continuous Feedback:** The iterative approach allows for regular feedback from the supervisor and potential users, enabling course corrections and improvements throughout the development process.

4. **Version Control Integration:** The project uses GitHub for version control with structured version numbering (Major.Minor.Patch), which naturally aligns with Agile sprint deliverables and iterative releases.

> *[Figure 2.4: Agile (Iterative) SDLC Model - To be inserted]*

The Agile methodology for this project is structured into the following iterative phases:

**Phase 1: Requirements Gathering and Analysis (PSM I)**
- Identify stakeholders and their needs
- Define functional and non-functional requirements
- Analyze existing systems and identify gaps
- Document problem statements and project objectives

**Phase 2: System Design (PSM I)**
- Design system architecture and database schema
- Create user interface wireframes and mockups
- Define API structure and data flow diagrams
- Plan the module hierarchy and navigation flow

**Phase 3: Implementation - Iteration 1: Core Modules (PSM II)**
- Develop the landing page and authentication system (login, signup, forgot password)
- Implement the customer dashboard and vehicle browsing functionality
- Build the admin dashboard with basic fleet management
- Set up database tables and API integration

**Phase 4: Implementation - Iteration 2: Advanced Features (PSM II)**
- Develop the booking flow (vehicle selection, date picker, payment, confirmation)
- Implement the AI chatbot with Gemini and Grok integration
- Build the 360-degree vehicle viewer
- Develop marketing management and calendar overview modules

**Phase 5: Implementation - Iteration 3: Polish and Enhancement (PSM II)**
- Implement responsive design and mobile optimization
- Add dual-theme (Day/Night) and bilingual (EN/BM) support
- Integrate email notification services
- Develop reporting and analytics features

**Phase 6: Testing and Deployment (PSM II)**
- Conduct unit testing for individual modules
- Perform integration testing across modules
- Execute user acceptance testing (UAT)
- Deploy to production (Vercel) with custom domain
- Prepare final documentation and user manual

## 2.4 Project Requirements

### 2.4.1 Software Requirements

Table 2.2 lists the software tools and technologies required for the development, testing, and deployment of the WeDRIVE system.

*Table 2.2: Software Requirements*

| No. | Software | Version | Purpose |
|---|---|---|---|
| 1 | Visual Studio Code | Latest | Primary code editor and IDE |
| 2 | Google Chrome | Latest | Primary browser for testing and debugging |
| 3 | Git | Latest | Version control system |
| 4 | GitHub | - | Remote repository hosting and collaboration |
| 5 | Supabase | - | Backend-as-a-Service (PostgreSQL, Auth, Storage) |
| 6 | Vercel | - | Hosting and continuous deployment platform |
| 7 | HTML5 | 5 | Frontend markup language |
| 8 | CSS3 | 3 | Frontend styling (responsive, glassmorphism, themes) |
| 9 | JavaScript | ES6+ | Frontend logic and API interaction |
| 10 | PostgreSQL | 15+ | Relational database (via Supabase) |
| 11 | Three.js | Latest | 3D rendering for interior cubemap viewer |
| 12 | Anime.js | v3 | Animation library for UI transitions |
| 13 | Flatpickr | Latest | Date picker library for booking calendar |
| 14 | Google Gemini API | gemini-2.0-flash | Primary AI model for chatbot |
| 15 | xAI Grok API | grok-3-mini-fast | Fallback AI model for chatbot |
| 16 | Resend | - | Email delivery service for notifications |
| 17 | Figma / Stitch | - | UI/UX design reference |
| 18 | Windows 11 / macOS | Latest | Development operating system |

### 2.4.2 Hardware Requirements

Table 2.3 lists the hardware requirements for development and testing.

*Table 2.3: Hardware Requirements*

| No. | Hardware | Specification | Purpose |
|---|---|---|---|
| 1 | Development Laptop/PC | Intel i5/AMD Ryzen 5 or above, 8GB RAM minimum, 256GB SSD | Primary development machine |
| 2 | Smartphone (Android/iOS) | Modern smartphone with latest browser | Mobile responsive testing |
| 3 | Internet Connection | Stable broadband connection (minimum 10 Mbps) | Cloud services access, deployment, API calls |
| 4 | Display Monitor | Full HD (1920x1080) minimum | UI development and testing |

### 2.4.3 Other Requirements

- **Supabase Account:** Free-tier Supabase account for PostgreSQL database, authentication, and edge functions (500MB database, 1GB storage, unlimited API requests).
- **Vercel Account:** Free-tier Hobby plan account for hosting and automatic deployment from GitHub repository.
- **Google Cloud Console Account:** For obtaining Google OAuth 2.0 client credentials (Google Sign-In integration) and Gemini API key.
- **xAI Account:** For obtaining Grok API key (chatbot fallback model).
- **GitHub Account:** For version control, code repository management, and Vercel integration.
- **Domain Name:** wedrive.website domain for production deployment.
- **Resend Account:** Free-tier account for transactional email delivery (booking confirmations, reminders).

## 2.5 Project Schedule and Milestones

The project is planned across two semesters: PSM I (Semester 6, Session 2025/2026) and PSM II (Semester 7, Session 2025/2026). The schedule follows the Agile iterative methodology, with each iteration producing a working increment of the system.

*Table 2.4: Project Schedule and Milestones*

| Phase | Activity | Duration | Period | Deliverable |
|---|---|---|---|---|
| **PSM I** | | | | |
| Phase 1 | Requirements Gathering | 3 weeks | Feb 2026 - Mar 2026 | Problem statements, objectives, scope |
| Phase 1 | Literature Review | 4 weeks | Mar 2026 - Apr 2026 | Literature review chapter, existing system analysis |
| Phase 2 | System Analysis | 3 weeks | Apr 2026 | Requirements analysis, DFD, data dictionary |
| Phase 2 | System Design | 3 weeks | Apr 2026 - May 2026 | System architecture, ERD, UI design |
| - | PSM I Report Writing | 3 weeks | May 2026 - Jun 2026 | Complete PSM I report (Ch 1-4) |
| - | PSM I Presentation | 1 week | Jun 2026 | PSM I defense presentation |
| **PSM II** | | | | |
| Phase 3 | Iteration 1: Core Modules | 4 weeks | Jul 2026 - Aug 2026 | Auth, customer dashboard, admin dashboard |
| Phase 4 | Iteration 2: Advanced Features | 4 weeks | Aug 2026 - Sep 2026 | Booking flow, AI chatbot, 360 viewer |
| Phase 5 | Iteration 3: Polish | 3 weeks | Sep 2026 - Oct 2026 | Responsive, themes, multilingual, marketing |
| Phase 6 | Testing | 2 weeks | Oct 2026 | Unit, integration, UAT testing |
| Phase 6 | Deployment | 1 week | Oct 2026 | Production deployment |
| - | PSM II Report Writing | 3 weeks | Oct 2026 - Nov 2026 | Complete PSM II report (Ch 5-7) |
| - | PSM II Presentation | 1 week | Nov 2026 | Final defense presentation |

> *[Figure 2.5: Project Gantt Chart - To be inserted]*

## 2.6 Conclusion

This chapter has presented a comprehensive literature review covering the car rental industry domain, existing systems analysis, and the techniques and technologies applicable to the WeDRIVE project. The analysis of three existing platforms (SOCAR, GoCar, and KAYAK) revealed key gaps in AI-powered customer support, interactive vehicle visualization, and accessible fleet management tools for small operators, which WeDRIVE aims to address.

The Agile (Iterative) methodology was selected as the project development approach, offering flexibility, incremental delivery, and continuous improvement capabilities that align well with the project's multi-module architecture. The project requirements, including software, hardware, and other resources, were documented, and a detailed project schedule was presented with milestones spanning both PSM I and PSM II semesters.

The next chapter will present a detailed analysis of the system requirements, including problem analysis, data requirements, functional requirements, and non-functional requirements.
