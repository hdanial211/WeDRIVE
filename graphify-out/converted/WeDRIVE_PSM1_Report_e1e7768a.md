<!-- converted from WeDRIVE_PSM1_Report.docx -->

# FRONT MATTER

## BORANG PENGESAHAN STATUS LAPORAN
JUDUL: AI-Assisted Car Rental Management System with Chatbot Support
SESI PENGAJIAN: 2025 / 2026
Saya: MUHAMMAD DANIAL HAKIM BIN MOHD SAOFI
mengaku membenarkan tesis Projek Sarjana Muda ini disimpan di Perpustakaan Universiti Teknikal Malaysia Melaka dengan syarat-syarat kegunaan seperti berikut:
Tesis dan projek adalah hakmilik Universiti Teknikal Malaysia Melaka.
Perpustakaan Fakulti Teknologi Maklumat dan Komunikasi dibenarkan membuat salinan untuk tujuan pengajian sahaja.
Perpustakaan Fakulti Teknologi Maklumat dan Komunikasi dibenarkan membuat salinan tesis ini sebagai bahan pertukaran antara institusi pengajian tinggi.
Sila tandakan:
SULIT (Mengandungi maklumat yang berdarjah keselamatan atau kepentingan Malaysia seperti yang termaktub di dalam AKTA RAHSIA RASMI 1972)
TERHAD (Mengandungi maklumat TERHAD yang telah ditentukan oleh organisasi / badan di mana penyelidikan dijalankan)
TIDAK TERHAD
Alamat tetap: _______________________________
CATATAN: Jika tesis ini SULIT atau TERHAD, sila lampirkan surat daripada pihak berkuasa.

## TITLE PAGE
### AI-ASSISTED CAR RENTAL MANAGEMENT SYSTEM WITH CHATBOT SUPPORT

### MUHAMMAD DANIAL HAKIM BIN MOHD SAOFI

This report is submitted in partial fulfillment of the requirements for the Bachelor of Computer Science (Software Development) with Honours.

FACULTY OF INFORMATION AND COMMUNICATION TECHNOLOGY
UNIVERSITI TEKNIKAL MALAYSIA MELAKA
2026

## DECLARATION
I hereby declare that this project report entitled “AI-Assisted Car Rental Management System with Chatbot Support” is written by me and is my own effort and that no part has been plagiarized without citations.
I hereby declare that I have read this project report and found that it has complied with the partial fulfillment for awarding the degree of Bachelor of Computer Science (Software Development) with Honours.

## DEDICATION
This project is dedicated to my beloved family for their unwavering support and encouragement throughout my academic journey. To my parents, who have always believed in my ability and provided endless motivation. To my friends and coursemates who have shared this journey with me, and to my supervisor, Mr. Muhammad Faiz Bin Supian, whose guidance and expertise have been invaluable in shaping this project.

## ACKNOWLEDGEMENTS
First and foremost, I would like to express my deepest gratitude to Allah S.W.T. for granting me the strength, patience, and knowledge to complete this project.
I would like to extend my heartfelt appreciation to my supervisor, Mr. Muhammad Faiz Bin Supian, for his continuous guidance, constructive feedback, and encouragement throughout the development of this project. His expertise and insights have been instrumental in the successful completion of this work.
I am also grateful to the Faculty of Information and Communication Technology, Universiti Teknikal Malaysia Melaka (UTeM), for providing the facilities and resources necessary for this project.
My sincere thanks go to my family members for their moral support and understanding during the course of this project. Their encouragement has been a constant source of motivation.
Finally, I would like to thank my friends and coursemates who have contributed ideas, feedback, and moral support throughout this journey.
Thank you.
# ABSTRACT
The AI-Assisted Car Rental Management System with Chatbot Support, branded as WeDRIVE, is a web-based platform developed to modernize and optimize the car rental process in Malaysia. This project addresses key challenges faced by car rental businesses, including fragmented management systems, poor customer engagement, and inefficient vehicle utilization. The system integrates artificial intelligence (AI) capabilities, particularly an AI-powered chatbot, to enhance customer interaction and automate routine booking inquiries.
The project follows the Agile (Iterative) methodology within the Software Development Life Cycle (SDLC) framework, enabling progressive refinement through continuous development cycles. The system architecture employs a client-server model using HTML, CSS, and JavaScript for the frontend, with Supabase (PostgreSQL) serving as the backend database and authentication provider. The platform is deployed on Vercel with a custom domain (wedrive.website) and features a responsive design with dual-theme support (Day and Night modes), multilingual capability (English and Bahasa Melayu), and premium UI aesthetics incorporating glassmorphism design patterns.
WeDRIVE comprises four core modules: a Customer Booking Portal for vehicle browsing and reservation, an Admin Dashboard for fleet and booking management, an AI Chatbot for 24/7 customer assistance, and a Guest Browsing interface. The system features an interactive 360-degree vehicle viewer, real-time booking management, dynamic reporting analytics, and a marketing management module. The expected outcome is a fully functional, AI-enhanced car rental management platform that improves operational efficiency and customer satisfaction.
Keywords: Car Rental System, AI Chatbot, Web Application, Supabase, Agile Methodology

# ABSTRAK
Sistem Pengurusan Kereta Sewa Berbantukan AI dengan Sokongan Chatbot, yang dijenamakan sebagai WeDRIVE, ialah sebuah platform berasaskan web yang dibangunkan untuk memodenkan dan mengoptimumkan proses penyewaan kereta di Malaysia. Projek ini menangani cabaran utama yang dihadapi oleh perniagaan penyewaan kereta, termasuk sistem pengurusan yang berpecah-pecah, penglibatan pelanggan yang lemah, dan penggunaan kenderaan yang tidak cekap. Sistem ini mengintegrasikan keupayaan Kecerdasan Buatan (AI), khususnya chatbot berkuasa AI, untuk meningkatkan interaksi pelanggan dan mengautomasikan pertanyaan tempahan rutin.
Projek ini mengikuti metodologi Agile (Iteratif) dalam rangka kerja Kitaran Hayat Pembangunan Perisian (SDLC), membolehkan penambahbaikan secara progresif melalui kitaran pembangunan yang berterusan. Seni bina sistem menggunakan model pelayan-pelanggan dengan HTML, CSS dan JavaScript untuk bahagian hadapan, manakala Supabase (PostgreSQL) bertindak sebagai pangkalan data bahagian belakang dan penyedia pengesahan. Platform ini dikerahkan di Vercel dengan domain tersuai (wedrive.website) dan mempunyai reka bentuk responsif dengan sokongan dwi-tema (mod Siang dan Malam), keupayaan dwi-bahasa (Bahasa Inggeris dan Bahasa Melayu), serta estetik UI premium yang menggabungkan corak reka bentuk glassmorphism.
WeDRIVE terdiri daripada empat modul teras: Portal Tempahan Pelanggan untuk melayari dan menempah kenderaan, Papan Pemuka Pentadbir untuk pengurusan armada dan tempahan, Chatbot AI untuk bantuan pelanggan 24/7, dan antara muka Pelayaran Tetamu. Sistem ini mempunyai pemapar kenderaan 360 darjah interaktif, pengurusan tempahan masa nyata, analitik laporan dinamik, dan modul pengurusan pemasaran. Hasil yang dijangkakan ialah sebuah platform pengurusan penyewaan kereta yang berfungsi sepenuhnya dan dipertingkatkan AI yang meningkatkan kecekapan operasi dan kepuasan pelanggan.
Kata Kunci: Sistem Penyewaan Kereta, Chatbot AI, Aplikasi Web, Supabase, Metodologi Agile
# TABLE OF CONTENTS
## CHAPTERS

# LIST OF TABLES

# LIST OF FIGURES

# LIST OF ABBREVIATIONS
# CHAPTER 1: INTRODUCTION
## 1.1 Introduction
The car rental industry in Malaysia has experienced significant growth over the past decade, driven by increasing urbanization, the rise of domestic tourism, and a growing preference for flexible transportation options. According to the Malaysian Automotive Association (MAA, 2025), the demand for short-term vehicle rentals has surged, particularly in tourist-centric states such as Melaka, Penang, and Sabah. Despite this growing demand, many car rental businesses in Malaysia continue to rely on traditional, manual-based processes for managing their operations. These conventional methods often involve fragmented systems where bookings are handled through phone calls or WhatsApp messages, fleet management is tracked using spreadsheets, and customer records are maintained in physical logbooks or disconnected software applications.
This reliance on outdated systems presents several operational challenges. Customers frequently encounter difficulties in obtaining accurate, real-time information about vehicle availability, pricing, and booking status. The lack of a centralized digital platform results in prolonged response times, booking errors, and an overall substandard customer experience. From the business perspective, car rental operators struggle with inefficient fleet utilization, where vehicles may sit idle due to poor visibility into demand patterns, and revenue is lost through manual booking conflicts and the absence of data-driven decision-making tools.
The emergence of Artificial Intelligence (AI) technologies, particularly in the form of conversational chatbots and intelligent recommendation systems, offers transformative potential for the car rental industry. AI-powered chatbots can provide 24/7 customer assistance, handle routine inquiries autonomously, and guide customers through the booking process without human intervention. Furthermore, AI-driven analytics can help businesses optimize fleet utilization, predict demand patterns, and deliver personalized recommendations to customers based on their preferences and rental history.
In response to these challenges and opportunities, this project proposes the development of WeDRIVE, an AI-Assisted Car Rental Management System with Chatbot Support. WeDRIVE is designed as a comprehensive, web-based platform that consolidates all car rental operations into a single, unified system. The platform serves three primary user categories: customers who can browse, book, and manage vehicle rentals through an intuitive interface; administrators who can manage the vehicle fleet, monitor bookings, and generate business reports through a feature-rich dashboard; and guests who can explore available vehicles and pricing information without requiring account registration.
The system distinguishes itself from existing solutions through several innovative features, including an interactive 360-degree vehicle viewer that allows customers to inspect vehicles from all angles before booking, a dual-theme interface supporting both Day and Night modes, bilingual support for English and Bahasa Melayu, and a premium user interface design incorporating modern glassmorphism aesthetics. The integration of AI chatbot technology, powered by Google Gemini and xAI Grok models, further enhances the system by providing intelligent, context-aware customer assistance.
Figure 1.1 presents a high-level overview of the WeDRIVE system, illustrating the relationship between the main system modules and user types.
[Figure 1.1: WeDRIVE System Overview - To be inserted]
## 1.2 Problem Statement(s)
The following problem statements have been identified through analysis of the current car rental landscape in Malaysia:
Problem Statement 1: Fragmented and Inefficient Car Rental Management Systems
Many car rental businesses in Malaysia operate using disconnected and manual-based management systems. Fleet information, booking records, customer details, and payment data are often maintained across separate platforms or physical records, leading to data inconsistency, duplication of effort, and operational inefficiencies. Car rental operators lack a unified platform that integrates all aspects of their business operations, from vehicle inventory management to customer relationship handling. This fragmentation results in booking conflicts, delayed responses to customer inquiries, and difficulty in generating accurate business reports for strategic decision-making (Kumar and Singh, 2025).
Problem Statement 2: Poor Customer Experience and Limited Digital Engagement
Traditional car rental services offer limited digital engagement channels for customers. The booking process typically requires customers to make phone calls, send messages through WhatsApp, or visit physical offices to inquire about vehicle availability and complete reservations. This process is time-consuming, restricted to business operating hours, and prone to human errors. Customers are unable to view detailed vehicle information, compare options, or track their booking status in real-time. The absence of 24/7 digital support channels means that customer inquiries outside business hours go unanswered, leading to potential loss of business and customer dissatisfaction (Duong et al., 2025).
Problem Statement 3: Underutilization of AI Technology in Car Rental Services
Despite the rapid advancement of AI technologies in the transportation and hospitality sectors, the Malaysian car rental industry has been slow to adopt AI-driven solutions. Existing systems lack intelligent features such as automated customer support through chatbots, personalized vehicle recommendations based on customer preferences, and data-driven insights for business optimization. The absence of AI integration represents a missed opportunity to improve operational efficiency, enhance customer engagement, and gain competitive advantage in an increasingly digital marketplace (Zhang and Wang, 2026).
## 1.3 Objectives
Based on the problem statements identified, this project aims to achieve the following objectives:
To analyze the current challenges in car rental management systems in Malaysia and identify functional and non-functional requirements for an improved, integrated solution.
To design and develop a web-based AI-Assisted Car Rental Management System (WeDRIVE) with integrated chatbot support that provides a unified platform for vehicle browsing, booking management, fleet administration, and customer engagement.
To evaluate the system’s functionality, usability, and AI chatbot effectiveness through comprehensive testing, including unit testing, integration testing, and user acceptance testing.
## 1.4 Scope
The scope of this project encompasses the following areas:
### System Modules
Customer Booking Portal: A user-friendly web interface that enables registered customers to browse available vehicles with detailed specifications and 360-degree views, make reservations by selecting dates and add-on services, complete payments through an integrated checkout process, manage their booking history and profile information, and receive booking confirmations with QR codes.
Admin Dashboard: A comprehensive backend interface that allows system administrators to manage the vehicle fleet (add, edit, delete vehicles and update availability status), monitor and manage all customer bookings, view customer profiles and rental history, generate business reports and analytics (revenue charts, utilization rates), manage marketing campaigns (banners, promo codes, seasonal pricing), configure system settings (company information, tax rates, operating hours), and oversee AI chatbot settings and API configurations.
AI Chatbot: An intelligent conversational assistant integrated into the customer and guest interfaces, powered by Google Gemini and xAI Grok AI models. The chatbot handles customer inquiries regarding vehicle availability and recommendations, assists with the booking process and provides booking status updates, answers frequently asked questions about rental policies, pricing, and procedures, and operates 24/7 to provide continuous customer support.
Guest Browsing Interface: A publicly accessible interface that allows potential customers to explore the vehicle fleet and pricing information without requiring account registration. Guest users can view vehicle details, pricing tiers, and explore Melaka attractions, but are redirected to the login page when attempting to make a booking.
### Technical Scope
Platform: Web-based application accessible through modern web browsers
Frontend Technologies: HTML5, CSS3, JavaScript (Vanilla)
Backend/Database: Supabase (PostgreSQL) with Row Level Security
Authentication: Supabase Auth with email/password and Google OAuth 2.0
Hosting: Vercel with automatic deployment from GitHub
AI Integration: Google Gemini API and xAI Grok API for chatbot functionality
Design: Responsive design with mobile compatibility, dual-theme (Day/Night), bilingual (EN/BM)
### Out of Scope
The following areas are explicitly excluded from the current project scope:
Real payment gateway integration (demo mode only; future integration with Stripe/Billplz planned)
Native mobile application development (iOS/Android)
Real-time GPS vehicle tracking
Physical key management and IoT vehicle access
Multi-branch or franchise management
Integration with external insurance or road tax systems
## 1.5 Project Significance
This project carries significance across multiple dimensions:
Academic Significance: The project demonstrates the practical application of software engineering principles, web development technologies, and AI integration in solving a real-world business problem. It serves as a comprehensive case study in full-stack web application development, encompassing requirements analysis, system design, database architecture, and user interface design. The project also explores the integration of modern AI language models (Google Gemini and xAI Grok) into a functional web application, contributing to the academic understanding of AI-enhanced business systems.
Industry Significance: WeDRIVE addresses genuine pain points experienced by car rental businesses in Malaysia. The system provides a scalable, cost-effective solution that small to medium-sized car rental operators can adopt to digitize their operations. By leveraging free-tier cloud services (Supabase, Vercel), the system demonstrates that advanced, AI-powered business solutions can be developed and deployed with minimal infrastructure costs, making digital transformation accessible to smaller businesses.
Technological Significance: The project showcases the use of modern web development approaches, including Backend-as-a-Service (BaaS) architecture with Supabase, serverless deployment on Vercel, and the integration of multiple AI language models for chatbot functionality. The implementation of features such as interactive 360-degree vehicle visualization, glassmorphism UI design, and dual-language support demonstrates the capability of vanilla web technologies (without heavy frameworks) to deliver premium, feature-rich applications.
Social Significance: By improving the car rental booking experience, particularly in tourist destinations like Melaka, the system contributes to enhancing the overall tourism experience in Malaysia. The bilingual support ensures accessibility for both English-speaking and Malay-speaking users, promoting inclusivity in digital services.
## 1.6 Expected Output
Upon completion, this project is expected to produce the following deliverables:
A fully functional web-based car rental management system (WeDRIVE) deployed at wedrive.website, comprising the Customer Booking Portal, Admin Dashboard, AI Chatbot, and Guest Browsing Interface.
A responsive, premium user interface featuring glassmorphism design, dual-theme support (Day/Night mode), and bilingual capability (English/Bahasa Melayu), accessible across desktop, tablet, and mobile devices.
An AI-powered chatbot integrated with Google Gemini and xAI Grok APIs, capable of handling customer inquiries, providing vehicle recommendations, and assisting with the booking process.
A comprehensive database built on Supabase PostgreSQL, storing vehicle inventory (8 models), customer profiles (5 registered users), booking records (110 bookings), and system configuration data, with Row Level Security (RLS) enforcement.
An interactive 360-degree vehicle viewer using 200-frame exterior rotation and cubemap interior panorama, enabling customers to inspect vehicles in detail before booking.
Complete project documentation including this PSM I report (Chapters 1-4), system flowcharts, database schemas, and user interface designs.
## 1.7 Conclusion
This chapter has provided an introduction to the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE) project. The chapter outlined the background and motivation for the project, identified three key problem statements relating to fragmented management systems, poor customer digital experience, and underutilization of AI technology in the car rental industry. Three corresponding project objectives were defined, along with the detailed scope covering four system modules and the technical architecture. The significance of the project was discussed from academic, industry, technological, and social perspectives, and the expected outputs were enumerated.
The subsequent chapters will elaborate on the project in greater detail. Chapter 2 will present a comprehensive literature review of related works and the project methodology. Chapter 3 will provide a detailed analysis of system requirements. Chapter 4 will describe the system design, including architecture, user interface, and database design.
# CHAPTER 2: LITERATURE REVIEW AND PROJECT METHODOLOGY
## 2.1 Introduction
This chapter presents a comprehensive review of the literature related to the development of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The chapter is organized into several key sections that collectively provide the theoretical and practical foundation for the project.
Section 2.2 discusses the facts and findings gathered through research, covering three main areas: the domain of car rental management systems and the current state of the industry, an analysis of existing car rental platforms in Malaysia, and the techniques and technologies applicable to the project. Section 2.3 describes the selected project methodology, explaining the Agile (Iterative) approach adopted for the development process. Section 2.4 details the project requirements, including software, hardware, and other resources needed. Finally, Section 2.5 presents the project schedule and milestones through a Gantt chart, outlining the planned activities and their timelines across the PSM I and PSM II phases.
## 2.2 Facts and Findings
### 2.2.1 Domain
Car Rental Industry in Malaysia
The car rental industry in Malaysia is a vital component of the nation’s transportation and tourism sectors. With Malaysia attracting over 26 million tourists annually (Tourism Malaysia, 2024) and a growing domestic travel culture, the demand for flexible, short-term vehicle rental services has steadily increased. Major tourist destinations such as Melaka, Penang, Langkawi, and Sabah have particularly high demand for car rental services, as public transportation options in these areas may be limited.
Traditionally, car rental businesses in Malaysia have operated through a combination of walk-in offices, phone bookings, and basic websites. Many small and medium-sized operators still manage their fleets using spreadsheets, WhatsApp communication, and manual record-keeping. While larger companies such as Hertz, Avis, and Europcar have established digital booking platforms, the majority of local car rental businesses lack comprehensive digital management solutions (Kumar and Singh, 2025).
AI in the Transportation and Hospitality Sector
The integration of Artificial Intelligence (AI) into transportation and hospitality services has accelerated significantly in recent years. AI technologies, particularly chatbots and recommendation systems, have demonstrated substantial benefits in enhancing customer engagement, reducing operational costs, and improving service personalization (Adamopoulou and Moussiades, 2020).
In the context of car rental services, AI can be applied in several key areas. First, AI chatbots can provide instant responses to customer inquiries regarding vehicle availability, pricing, and booking procedures, operating 24/7 without human intervention (Nguyen and Do, 2026). Second, AI-driven recommendation engines can suggest suitable vehicles based on customer preferences, trip requirements, and historical data (Rybo AI, 2024). Third, AI-powered analytics can help operators optimize fleet utilization, predict demand patterns, and adjust pricing strategies dynamically (Gupta, 2024).
Research by Zhang and Wang (2026) on the landscape of AI chatbot adoption in tourism and hospitality reveals that while AI chatbots are widely used in hotels and airlines, their adoption in the car rental sector remains relatively low, particularly in Southeast Asian markets. This gap presents an opportunity for innovation, which the WeDRIVE project aims to address.
Web-Based Management Systems
Modern web-based management systems have evolved beyond simple informational websites to become comprehensive business platforms. The adoption of cloud computing and Backend-as-a-Service (BaaS) platforms such as Supabase, Firebase, and AWS Amplify has significantly lowered the barrier to developing full-featured web applications (Agentive AI, 2024). These platforms provide integrated services including database management, user authentication, file storage, and real-time data synchronization, enabling developers to focus on application logic and user experience rather than infrastructure management.
For the car rental domain, a web-based management system offers several advantages over desktop applications or manual processes: accessibility from any device with a web browser, real-time data synchronization across all users, lower deployment and maintenance costs, and the ability to scale resources based on demand (AirentoSoft, 2024).
### 2.2.2 Existing Systems
To inform the design and development of WeDRIVE, three existing car rental platforms operating in Malaysia were analyzed. These systems were selected to represent different approaches to car rental management: SOCAR as a mobile-first car-sharing platform, GoCar as a comprehensive mobility ecosystem, and KAYAK as a metasearch comparison engine.
a) SOCAR (socar.my)
SOCAR is a leading car-sharing platform in Malaysia that operates primarily through a mobile application. Founded in 2017, SOCAR provides on-demand car rental services across major cities in Malaysia, including Kuala Lumpur, Selangor, Penang, and Johor Bahru.
Key Features: - Mobile-first approach with iOS and Android applications - Keyless vehicle access using Bluetooth technology via the app - Hourly, daily, weekly, and monthly rental options with a minimum 30-minute booking - Over 30 different car models available - SOCAR-2-YOU delivery service and SOCAR+ personal driver service - 24-hour live chat customer support - Fuel reimbursement system and mileage package options
Strengths: - Seamless mobile experience with keyless access eliminates the need for physical key handover - Flexible rental durations from as short as 30 minutes - Wide geographic coverage across Malaysia - Integrated live chat support for real-time assistance
Limitations: - Heavily reliant on mobile app; limited web browser functionality - No AI-powered chatbot or intelligent recommendations - No 360-degree vehicle preview before booking - Limited administrative tools for fleet operators (designed for SOCAR’s internal use only)
[Figure 2.1: SOCAR Mobile Application Interface - To be inserted]
b) GoCar (gocar.my)
GoCar is a comprehensive on-demand mobility platform in Malaysia that extends beyond traditional car rental to offer a full ecosystem of automotive services. GoCar’s platform includes car sharing, car subscription, vehicle maintenance (GoCar Garage), and insurance services (GoInsuran).
Key Features: - On-demand car sharing available 24/7 with rent-by-minute, hour, or day options - GoCar Subs subscription service as an alternative to car ownership (monthly to 36-month plans) - GoCar Garage integrated car servicing and repair platform - GoInsuran insurance renewal service (within 3 minutes) - Zero human interaction booking process via mobile app - Collision Damage Waiver (CDW) and FLEX insurance packages - Available in KL, Selangor, Penang, Johor Bahru, and KLIA
Strengths: - Comprehensive ecosystem covering multiple automotive needs - Flexible subscription model as an alternative to ownership - Well-designed zero-touch booking experience - Additional services (maintenance, insurance) add value for regular users
Limitations: - Complex service offering may overwhelm new users - No AI-driven customer support or chatbot integration - No interactive vehicle preview (360-degree viewer) - Primarily mobile-focused; web experience is secondary - Pricing model can be complex with multiple add-on packages
[Figure 2.2: GoCar Booking Platform - To be inserted]
c) KAYAK (kayak.com.my)
KAYAK is a global travel metasearch engine that aggregates car rental deals from hundreds of different travel sites and rental providers. Unlike SOCAR and GoCar, KAYAK does not own or operate a vehicle fleet; instead, it functions as a comparison platform.
Key Features: - Metasearch engine aggregating deals from multiple providers - Advanced filtering by vehicle type, rental company, fuel policy, and special features - One-way rental search capability - AI Mode for natural language travel queries and personalized recommendations - “Trips” feature for organizing travel itineraries - Price comparison across economy, compact, luxury, SUV, and family vehicles - Hybrid/electric vehicle filtering options
Strengths: - Comprehensive price comparison across many providers in a single search - Advanced AI-powered search assistance - Global coverage with local market options - Strong filtering and sorting capabilities
Limitations: - Acts as intermediary only; redirects to third-party providers for actual booking - No direct fleet management capabilities - Final pricing may differ from displayed estimates due to provider-specific fees - No direct customer relationship management or post-booking support - Quality of service depends entirely on the selected third-party provider
[Figure 2.3: KAYAK Car Rental Search Interface - To be inserted]
Comparison of Existing Systems
Table 2.1 presents a comprehensive comparison of the three existing systems against the proposed WeDRIVE system.
Table 2.1: Comparison of Existing Car Rental Systems
The comparison reveals that while existing platforms such as SOCAR and GoCar excel in mobile-first car-sharing experiences with IoT-enabled keyless access, they lack AI-powered customer support, interactive vehicle previews, and accessible fleet management tools for small operators. KAYAK provides excellent comparison features but does not offer direct booking or fleet management capabilities. WeDRIVE aims to fill this gap by providing a comprehensive, web-based solution with integrated AI chatbot support, 360-degree vehicle visualization, and a full administrative dashboard accessible to small and medium-sized car rental operators.
### 2.2.3 Technique
This section discusses the key techniques and technologies employed in the development of WeDRIVE.
a) Frontend Web Technologies (HTML5, CSS3, JavaScript)
The WeDRIVE frontend is built using vanilla HTML5, CSS3, and JavaScript without relying on heavy frontend frameworks such as React, Vue, or Angular. This approach was chosen for several reasons: it reduces dependency on external libraries, ensures faster page load times, provides greater control over the application’s behavior and appearance, and simplifies the development and maintenance process for a project of this scale.
HTML5 provides the semantic structure for all pages, CSS3 handles styling including responsive layouts, animations, glassmorphism effects, and dual-theme support, while JavaScript manages all dynamic functionality including API interactions, DOM manipulation, and client-side routing (MDN Web Docs, 2024).
b) Backend-as-a-Service: Supabase
Supabase is an open-source Backend-as-a-Service (BaaS) platform that provides a suite of backend tools built on top of PostgreSQL. For the WeDRIVE project, Supabase was selected over alternatives such as Firebase for several reasons:
PostgreSQL Database: Supabase uses PostgreSQL, a powerful relational database that supports complex queries, transactions, and data integrity constraints, making it more suitable for a system with relational data (vehicles, bookings, customers) compared to Firebase’s NoSQL Firestore.
Row Level Security (RLS): Supabase’s RLS feature allows fine-grained access control at the database level, ensuring that users can only access data they are authorized to view or modify.
Built-in Authentication: Supabase Auth provides email/password and OAuth (Google) authentication with JWT token management.
Open Source: Unlike Firebase, Supabase is fully open-source, avoiding vendor lock-in.
REST API: Supabase automatically generates RESTful APIs for all database tables, simplifying frontend-backend communication (Supabase Documentation, 2024).
c) AI Chatbot Integration
The WeDRIVE AI chatbot utilizes a dual-model architecture with automatic failover:
Primary Model - Google Gemini (gemini-2.0-flash): Google’s latest language model provides fast, accurate responses for customer inquiries about vehicle availability, booking procedures, and general support questions.
Fallback Model - xAI Grok (grok-3-mini-fast): In cases where the Gemini API is unavailable or returns an error, the system automatically falls back to xAI’s Grok model to ensure uninterrupted chatbot service.
The chatbot is configured through the admin dashboard, where administrators can set system prompts, promotional context, greeting messages, and API keys. This architecture ensures high availability and allows the business to customize the chatbot’s personality and knowledge base (Ali and Rahman, 2025).
d) 360-Degree Vehicle Visualization
WeDRIVE implements an interactive 360-degree vehicle viewer using a frame-sequence approach. Each vehicle is represented by 200 high-resolution photographs taken at evenly spaced angles around the vehicle. As the user drags or swipes across the viewer, the system dynamically loads and displays the corresponding frame, creating a smooth rotation effect. Interior views are rendered using a cubemap panorama technique with six directional images (front, back, left, right, top, bottom) processed through Three.js, a JavaScript 3D rendering library.
e) Deployment and Hosting
The application is deployed using Vercel, a cloud platform optimized for frontend applications. Vercel integrates directly with the project’s GitHub repository, enabling automatic deployment whenever code changes are pushed to the main branch. This continuous deployment approach aligns with the Agile methodology adopted for the project, supporting rapid iteration and feedback cycles.
## 2.3 Project Methodology
The development of WeDRIVE follows the Agile (Iterative) methodology within the Software Development Life Cycle (SDLC) framework. The Agile approach was selected over traditional Waterfall methodology for several reasons:
Incremental Development: The project involves multiple interconnected modules (Customer Portal, Admin Dashboard, AI Chatbot, Guest Interface) that benefit from incremental development and testing, allowing each module to be built, tested, and refined independently before integration.
Flexibility for Change: Requirements for AI chatbot behavior, UI design preferences, and feature priorities may evolve as the project progresses. Agile’s iterative nature accommodates these changes without disrupting the overall project timeline.
Continuous Feedback: The iterative approach allows for regular feedback from the supervisor and potential users, enabling course corrections and improvements throughout the development process.
Version Control Integration: The project uses GitHub for version control with structured version numbering (Major.Minor.Patch), which naturally aligns with Agile sprint deliverables and iterative releases.
[Figure 2.4: Agile (Iterative) SDLC Model - To be inserted]
The Agile methodology for this project is structured into the following iterative phases:
Phase 1: Requirements Gathering and Analysis (PSM I) - Identify stakeholders and their needs - Define functional and non-functional requirements - Analyze existing systems and identify gaps - Document problem statements and project objectives
Phase 2: System Design (PSM I) - Design system architecture and database schema - Create user interface wireframes and mockups - Define API structure and data flow diagrams - Plan the module hierarchy and navigation flow
Phase 3: Implementation - Iteration 1: Core Modules (PSM II) - Develop the landing page and authentication system (login, signup, forgot password) - Implement the customer dashboard and vehicle browsing functionality - Build the admin dashboard with basic fleet management - Set up database tables and API integration
Phase 4: Implementation - Iteration 2: Advanced Features (PSM II) - Develop the booking flow (vehicle selection, date picker, payment, confirmation) - Implement the AI chatbot with Gemini and Grok integration - Build the 360-degree vehicle viewer - Develop marketing management and calendar overview modules
Phase 5: Implementation - Iteration 3: Polish and Enhancement (PSM II) - Implement responsive design and mobile optimization - Add dual-theme (Day/Night) and bilingual (EN/BM) support - Integrate email notification services - Develop reporting and analytics features
Phase 6: Testing and Deployment (PSM II) - Conduct unit testing for individual modules - Perform integration testing across modules - Execute user acceptance testing (UAT) - Deploy to production (Vercel) with custom domain - Prepare final documentation and user manual
## 2.4 Project Requirements
### 2.4.1 Software Requirements
Table 2.2 lists the software tools and technologies required for the development, testing, and deployment of the WeDRIVE system.
Table 2.2: Software Requirements
### 2.4.2 Hardware Requirements
Table 2.3 lists the hardware requirements for development and testing.
Table 2.3: Hardware Requirements
### 2.4.3 Other Requirements
Supabase Account: Free-tier Supabase account for PostgreSQL database, authentication, and edge functions (500MB database, 1GB storage, unlimited API requests).
Vercel Account: Free-tier Hobby plan account for hosting and automatic deployment from GitHub repository.
Google Cloud Console Account: For obtaining Google OAuth 2.0 client credentials (Google Sign-In integration) and Gemini API key.
xAI Account: For obtaining Grok API key (chatbot fallback model).
GitHub Account: For version control, code repository management, and Vercel integration.
Domain Name: wedrive.website domain for production deployment.
Resend Account: Free-tier account for transactional email delivery (booking confirmations, reminders).
## 2.5 Project Schedule and Milestones
The project is planned across two semesters: PSM I (Semester 6, Session 2025/2026) and PSM II (Semester 7, Session 2025/2026). The schedule follows the Agile iterative methodology, with each iteration producing a working increment of the system.
Table 2.4: Project Schedule and Milestones
[Figure 2.5: Project Gantt Chart - To be inserted]
## 2.6 Conclusion
This chapter has presented a comprehensive literature review covering the car rental industry domain, existing systems analysis, and the techniques and technologies applicable to the WeDRIVE project. The analysis of three existing platforms (SOCAR, GoCar, and KAYAK) revealed key gaps in AI-powered customer support, interactive vehicle visualization, and accessible fleet management tools for small operators, which WeDRIVE aims to address.
The Agile (Iterative) methodology was selected as the project development approach, offering flexibility, incremental delivery, and continuous improvement capabilities that align well with the project’s multi-module architecture. The project requirements, including software, hardware, and other resources, were documented, and a detailed project schedule was presented with milestones spanning both PSM I and PSM II semesters.
The next chapter will present a detailed analysis of the system requirements, including problem analysis, data requirements, functional requirements, and non-functional requirements.
# CHAPTER 3: ANALYSIS
## 3.1 Introduction
This chapter presents a detailed analysis of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The analysis phase is a critical component of the software development process, serving as the bridge between the requirements identified in the literature review and the system design that follows. Through systematic analysis, the project ensures that all stakeholder needs are captured, system boundaries are clearly defined, and the proposed solution adequately addresses the identified problem statements.
Section 3.2 conducts a thorough problem analysis, examining the current car rental process and its inefficiencies, and contrasts it with the proposed WeDRIVE solution. Section 3.3 provides a comprehensive requirement analysis covering data requirements, functional requirements (illustrated through Context Diagrams and Data Flow Diagrams), non-functional requirements, and other supporting requirements. The chapter concludes with a summary of the analysis findings and their implications for the system design phase.
## 3.2 Problem Analysis
### Current System Scenario
The current car rental process in Malaysia, particularly among small to medium-sized operators, follows a predominantly manual workflow. Through investigation and analysis, the following typical scenario has been identified:
Step 1 - Customer Inquiry: A customer contacts the car rental company via phone call, WhatsApp message, or by visiting the physical office. The customer asks about vehicle availability for specific dates, vehicle types, and pricing.
Step 2 - Manual Availability Check: The rental operator manually checks their records, which may be stored in Excel spreadsheets, physical logbooks, or basic calendar applications, to determine vehicle availability for the requested dates. This process is prone to errors, particularly when multiple staff members are managing bookings simultaneously.
Step 3 - Quotation and Negotiation: The operator provides a verbal or text-based quotation to the customer. Pricing may be inconsistent as it depends on the operator’s memory of current rates, any ongoing promotions, or seasonal adjustments. Customers often need to contact multiple operators to compare prices.
Step 4 - Booking Confirmation: If the customer agrees to the quotation, the booking is recorded manually. A deposit may be collected via bank transfer, and confirmation is communicated via WhatsApp or phone call. There is no standardized booking reference system.
Step 5 - Vehicle Handover: On the pickup date, the customer visits the rental location. Vehicle inspection and documentation are completed manually, often with paper-based forms.
Step 6 - Return and Settlement: Upon vehicle return, the final payment is calculated manually, accounting for rental duration, fuel charges, and any damages. Receipts may or may not be issued systematically.
[Figure 3.1: Current Car Rental Process (Manual) - Flowchart to be inserted]
Problems Identified in the Current Process:
Lack of Real-Time Availability Information: Customers cannot view vehicle availability in real-time, leading to frustrating back-and-forth communication and potential booking conflicts when multiple customers inquire about the same vehicle simultaneously.
Absence of Visual Vehicle Information: Customers make booking decisions based on limited information, typically a few static photos or verbal descriptions. They cannot inspect vehicle condition, interior quality, or detailed specifications before committing to a booking.
No Centralized Data Management: Business data (vehicles, bookings, customers, payments) is scattered across multiple formats and locations, making it difficult to generate accurate reports, track performance metrics, or identify business trends.
Limited Operating Hours: Customer support and booking services are restricted to business operating hours, resulting in lost potential bookings from customers who wish to make reservations outside these hours, particularly international tourists in different time zones.
Manual Error Prone Processes: Manual data entry and record-keeping increase the likelihood of errors such as double bookings, incorrect pricing, and lost customer information.
No Data-Driven Decision Making: Without centralized analytics, operators cannot easily assess fleet utilization rates, identify popular vehicles, determine peak booking periods, or evaluate the effectiveness of marketing campaigns.
Proposed Solution: WeDRIVE System
WeDRIVE addresses each of these problems through its integrated, web-based platform:
[Figure 3.2: Proposed Car Rental Process (WeDRIVE) - Flowchart to be inserted]
## 3.3 Requirement Analysis
### 3.3.1 Data Requirement
The WeDRIVE system requires the management of several interconnected data entities. The following data dictionaries define the structure and attributes of the primary data entities in the system.
Table 3.1: Data Dictionary - Cars Table
Table 3.2: Data Dictionary - Bookings Table
Table 3.3: Data Dictionary - Customers Table
Additional Data Entities:
Admins Table: Stores administrator account information (email, role), used to determine admin access during login.
Marketing Data: Stores banner advertisements, promotional codes, and seasonal pricing adjustments. Currently managed through localStorage with database persistence planned.
Config/Settings: Stores system configuration including company information, tax rates, deposit policies, operating hours, and pickup locations.
### 3.3.2 Functional Requirement
The functional requirements of WeDRIVE are illustrated through a hierarchical set of diagrams: Context Diagram, Data Flow Diagram (DFD) Level 0, and DFD Level 1.
Context Diagram
The context diagram shows the WeDRIVE system as a single process and its interactions with external entities.
[Figure 3.3: Context Diagram - To be inserted]
The system interacts with four external entities:
Customer: Registers account, browses vehicles, makes bookings, views booking history, uses AI chatbot, manages profile.
Administrator: Manages vehicles, manages bookings, manages customers, views reports, configures settings, manages marketing, configures AI chatbot.
Guest: Browses vehicles, views pricing, uses AI chatbot (limited), redirected to login for booking.
AI Service Provider (Gemini/Grok): Receives chat prompts and system context, returns AI-generated responses for the chatbot module.
Data Flow Diagram Level 0
The DFD Level 0 provides a more detailed view of the major processes within the WeDRIVE system.
[Figure 3.4: Data Flow Diagram Level 0 - To be inserted]
The major processes identified are:
P1 - Authentication Process: Handles user registration, login (email/password and Google OAuth), session management, and role-based access control.
P2 - Vehicle Management Process: Manages the vehicle fleet including adding, editing, deleting vehicles, updating availability status, and providing vehicle data for browsing.
P3 - Booking Management Process: Handles the complete booking lifecycle from vehicle selection through date selection, payment processing, booking confirmation, and status tracking.
P4 - Customer Management Process: Manages customer profiles, booking history, and document verification.
P5 - AI Chatbot Process: Processes customer queries, generates AI-powered responses using Gemini/Grok APIs, and provides vehicle recommendations.
P6 - Reporting and Analytics Process: Generates business reports including revenue charts, fleet utilization rates, and booking statistics.
P7 - Marketing Management Process: Manages promotional banners, discount codes, and seasonal pricing adjustments.
Data Flow Diagram Level 1
The DFD Level 1 decomposes each Level 0 process into sub-processes, providing detailed data flow information.
[Figure 3.5: Data Flow Diagram Level 1 - To be inserted]
Table 3.4: Functional Requirements Summary
### 3.3.3 Non-functional Requirement
Table 3.5 documents the non-functional requirements that define the quality attributes of the WeDRIVE system.
Table 3.5: Non-functional Requirements
### 3.3.4 Other Requirements
Development Environment Requirements: - A stable internet connection is required for accessing Supabase cloud services, Vercel deployment, and AI API calls. - Visual Studio Code with Live Server extension for local development and testing. - Git and GitHub for version control and collaborative development.
Operational Requirements: - System administrators must have basic technical knowledge to manage vehicle listings, configure chatbot settings, and interpret business reports. - Regular database backups should be scheduled through Supabase’s built-in backup functionality. - AI API keys (Google Gemini, xAI Grok) must be kept confidential and stored securely in the admin chatbot settings panel.
User Training Requirements: - A user manual shall be provided as an appendix to the final report (PSM II). - The system shall incorporate intuitive UI design with clear navigation to minimize the learning curve. - Tooltips and helper text shall be provided for complex form inputs.
## 3.4 Conclusion
This chapter has presented a comprehensive analysis of the WeDRIVE system requirements. The problem analysis revealed six key inefficiencies in the current manual car rental process and demonstrated how WeDRIVE’s integrated platform addresses each of these issues. The requirement analysis documented the data requirements through detailed data dictionaries for the three primary entities (Cars, Bookings, Customers), defined 24 functional requirements organized by module and priority, established 14 non-functional requirements covering performance, security, usability, and maintainability, and identified additional development and operational requirements.
The analysis confirms that WeDRIVE’s proposed feature set comprehensively addresses the problem statements identified in Chapter 1. The documented requirements provide a solid foundation for the system design phase, which is presented in the next chapter. Chapter 4 will translate these requirements into a concrete system architecture, user interface design, and database design.
# CHAPTER 4: DESIGN
## 4.1 Introduction
This chapter presents the system design for the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The design phase translates the requirements documented in Chapter 3 into a concrete technical blueprint that guides the implementation phase. The design decisions outlined in this chapter reflect best practices in modern web application development, prioritizing modularity, scalability, and user experience.
Section 4.2 covers the high-level design, including the overall system architecture, user interface design with navigation, input, and output considerations, and the database design encompassing both conceptual and logical models. Section 4.3 presents the detailed design, breaking down the software architecture into modules and defining the physical database schema. The chapter concludes with a summary of the design decisions and their alignment with the project objectives.
## 4.2 High-Level Design
### 4.2.1 System Architecture
The WeDRIVE system adopts a client-server architecture utilizing a Backend-as-a-Service (BaaS) model. This architecture separates the presentation layer (frontend) from the data and business logic layer (backend), enabling independent development and deployment of each component.
Architecture Overview
The system architecture consists of four primary layers:
Presentation Layer (Frontend): Built with vanilla HTML5, CSS3, and JavaScript, the frontend runs entirely in the user’s web browser. It is responsible for rendering the user interface, handling user interactions, and communicating with the backend through API calls. The frontend is organized into four modules: Guest, Account (Authentication), Customer, and Admin.
Application Layer (API): Supabase provides an automatically generated RESTful API for all database tables. The shared/js/api.js file serves as the centralized API configuration module, abstracting all data operations and providing a unified interface (window.WeDriveAPI) for all frontend modules to access backend services.
Service Layer (External Services): Several external services are integrated into the system:
Supabase Auth: Handles user authentication (email/password, Google OAuth 2.0) and session management with JWT tokens.
Supabase Storage: Manages file uploads including vehicle images and customer documents.
Google Gemini API: Primary AI language model for chatbot responses.
xAI Grok API: Fallback AI language model for chatbot (automatic failover).
Resend API: Email delivery service for booking notifications via Supabase Edge Functions.
Data Layer (Database): PostgreSQL database hosted on Supabase (Singapore region, ap-southeast-1) stores all persistent application data including vehicles, bookings, customers, admins, and system configuration. Row Level Security (RLS) policies enforce data access control at the database level.
[Figure 4.1: System Architecture Diagram - To be inserted]
Deployment Architecture
The deployment architecture leverages cloud services to minimize infrastructure management overhead:
Frontend Hosting: Vercel (vercel.com) hosts the static frontend files with global CDN distribution. Automatic deployment is triggered on every push to the GitHub main branch.
Backend Services: Supabase (supabase.com) provides PostgreSQL database, authentication, storage, and edge functions as managed cloud services.
Domain: The custom domain wedrive.website points to the Vercel deployment.
Version Control: GitHub repository (github.com/hdanial211/WeDRIVE) manages source code with structured versioning (Major.Minor.Patch format).
[Figure 4.2: Deployment Architecture - To be inserted]
The deployment flow follows a continuous deployment model:
Developer commits code -> GitHub Repository -> Vercel auto-deploys -> wedrive.website updated
This architecture supports the Agile methodology by enabling rapid iteration and deployment of changes.
### 4.2.2 User Interface Design
The WeDRIVE user interface is designed following modern web design principles, drawing inspiration from premium platforms such as Airbnb (booking flow), Stripe (glassmorphism and micro-animations), Apple (typography and whitespace), Linear (dark mode), and Vercel (minimalist dashboard).
Design Principles:
Premium Aesthetics: Glassmorphism effects (frosted glass with semi-transparent backgrounds), smooth gradient accents, and micro-animations create a visually premium experience.
Dual-Theme Support: Day Mode (light theme) and Night Mode (dark theme) are supported through separate CSS files (theme_day.css and theme_night.css), with user preference persisted in localStorage.
Responsive Design: All pages are fully responsive, adapting to desktop (1200px+), tablet (768px-1100px), and mobile (below 768px) viewports. The sidebar collapses to a hamburger menu on mobile.
Bilingual Support: Dynamic language switching between English and Bahasa Melayu is implemented through JSON language files (en.json, ms.json), with text elements linked via data-key attributes.
Consistent Typography: Inter font family (Google Fonts) is used throughout the system for a clean, modern appearance.
Navigation Design
The navigation structure differs based on the user module:
The Admin sidebar provides navigation to the following sections: Dashboard, Cars Management, Bookings, Customers, Reports, Calendar Overview, Marketing, AI Chatbot Settings, and System Settings.
The Customer sidebar provides navigation to: Dashboard (Browse Cars), My Bookings, Profile, and Support.
[Figure 4.9: Navigation Flow Diagram - To be inserted]
Input Design
Key input interfaces in the WeDRIVE system include:
Login Form: Email and password fields with Google Sign-In button. Auto-fill support and form validation with real-time error feedback.
Signup Form: Email, password, and confirm password fields with password strength validation. Google Sign-In alternative with automatic account creation.
Complete Profile Form: Full name, phone number, IC number, driving license number, and username fields. Document upload capability for ID verification.
Booking Form: Date picker (Flatpickr) for pickup and return dates, add-on selection checkboxes (GPS, child seat, insurance), and payment information capture.
Admin Car Form: Vehicle name, plate number, type selection, fuel type, transmission, seats, daily rate, status, description, and image upload fields.
Admin Settings Form: Company name, email, phone, address, currency, tax rate, maximum rental days, deposit amount, and operating hours configuration.
Chatbot Input: Free-text message input with send button, supporting natural language queries to the AI chatbot.
Output Design
Key output interfaces include:
Vehicle Cards: Grid display of available vehicles showing image, name, type, fuel, transmission, seats, daily rate, status badge, and Book Now button.
360-Degree Vehicle Viewer: Interactive canvas displaying 200-frame exterior rotation with drag/swipe interaction, and cubemap interior panorama using Three.js.
Booking Confirmation: Summary card showing booking reference (QR code), vehicle details, rental dates, duration, total cost, and payment method.
Admin Dashboard: Stats cards (total vehicles, active rentals, revenue today, new customers), current car status table, and quick action navigation cards.
Revenue Report Charts: CSS-based bar charts displaying monthly revenue trends and vehicle utilization percentages.
Calendar Overview: Monthly calendar grid with booking indicators (dots), event markers, seasonal pricing badges, and daily detail panels on click.
User Interface Screenshots
The following figures illustrate the key interfaces of the WeDRIVE system:
[Figure 4.3: Landing Page (Guest View) - Screenshot to be inserted] [Figure 4.4: Customer Dashboard - Screenshot to be inserted] [Figure 4.5: Car Details Page with 360-Degree Viewer - Screenshot to be inserted] [Figure 4.6: Booking Flow Interface - Screenshot to be inserted] [Figure 4.7: Admin Dashboard - Screenshot to be inserted] [Figure 4.8: Admin Car Management - Screenshot to be inserted]
### 4.2.3 Database Design
Conceptual Database Design
The WeDRIVE database is designed around the following key entities and their relationships:
Customers (registered users who can make bookings)
Cars (vehicles available for rental)
Bookings (rental transactions linking customers to cars)
Admins (system administrators)
Marketing (promotional campaigns and pricing)
Config (system configuration settings)
The primary relationships are: - A Customer can make many Bookings (one-to-many) - A Car can have many Bookings (one-to-many) - A Booking belongs to one Customer and one Car (many-to-one) - An Admin manages Cars, Bookings, Marketing, and Config (administrative relationship)
Entity Relationship Diagram (ERD)
[Figure 4.10: Entity Relationship Diagram (ERD) - To be inserted]
The ERD illustrates the following relationships:
CUSTOMERS ||--o{ BOOKINGS : "makes"
CARS ||--o{ BOOKINGS : "is booked in"
ADMINS ||--|| CONFIG : "manages"
ADMINS ||--o{ MARKETING : "manages"
Where: - ||--o{ denotes a one-to-many relationship - ||--|| denotes a one-to-one relationship
Logical Database Design
The logical data model refines the ERD into normalized table structures suitable for implementation in PostgreSQL.
[Figure 4.11: Logical Database Design - To be inserted]
Table 4.1: Database Tables and Descriptions
Normalization:
The database design follows Third Normal Form (3NF) with the following considerations:
First Normal Form (1NF): All tables have atomic values in each column, with no repeating groups. JSONB columns (features, images in cars table) store structured arrays that are treated as atomic values by the application layer.
Second Normal Form (2NF): All non-key attributes are fully functionally dependent on the primary key. No partial dependencies exist.
Third Normal Form (3NF): No transitive dependencies exist between non-key attributes. Note: The bookings table includes denormalized fields (customer_name, car_name, car_plate) for query performance optimization, as booking records are frequently displayed without joining to the customers and cars tables.
## 4.3 Detailed Design
### 4.3.1 Software Design
The WeDRIVE software architecture follows a modular design pattern, organized by functional modules. Each module has its own HTML pages, JavaScript logic, and (where applicable) CSS styling, promoting separation of concerns and maintainability.
Module Architecture
[Figure 4.12: Module Architecture Diagram - To be inserted]
The system is organized into the following modules:
1. Shared Module (shared/)
The shared module contains reusable components and utilities used across all other modules:
js/api.js - Centralized API configuration and data access layer (WeDriveAPI)
js/main.js - Theme management, language switching, footer loading, animation initialization
js/supabase-config.js - Supabase client initialization (Auth + DB)
js/auth-guard.js - Route protection based on user role
js/chatbot.js - Reusable AI chatbot component
js/navbar-loader.js - Dynamic navbar generation
js/sidebar-loader.js - Admin sidebar loading
js/vehicle-viewer.js - 360-degree vehicle viewer component
js/animate.js - Page transition and scroll reveal animations
css/theme_day.css, css/theme_night.css - Theme stylesheets
lang/en.json, lang/ms.json - Language translation files
components/navbar.html, components/footer.html - Shared HTML components
2. Account Module (account/)
Handles all authentication-related pages:
pages/login/login.html - User sign-in page
pages/signup/signup.html - New account registration
pages/forgot-password/forgot-password.html - Password reset flow
pages/welcome/welcome.html - Post-login welcome screen
pages/complete-profile/complete-profile.html - Profile completion (IC, license, phone, documents)
pages/verification-pending/verification-pending.html - Document verification waiting screen
css/auth.css - Authentication pages styling
3. Guest Module (guest/)
Provides browsing capabilities for unauthenticated users:
pages/explore-melaka/explore-melaka.html - Tourist attractions guide
pages/how-it-works/how-it-works.html - Rental process tutorial with scrollytelling
pages/pricing/pricing.html - Pricing tiers and plans
css/guest.css - Guest pages styling
js/how-it-works.js - Interactive animations for the tutorial page
4. Customer Module (customer/)
Full customer experience for registered users:
pages/dashboard/customer.html - Vehicle browsing dashboard
pages/car-details/car-details.html - Vehicle detail with 360-degree viewer
pages/car-details/booking/booking.html - Booking form
pages/car-details/booking/payment/payment.html - Payment and checkout
pages/car-details/booking/payment/booking-confirmed/booking-confirmed.html - Confirmation with QR
pages/my-bookings/my-bookings.html - Booking history and management
pages/my-bookings/receipt/receipt.html - Booking receipt/invoice
pages/profile/profile.html - Profile management
pages/support/support.html - Help and support center
css/customer.css - Customer pages styling
js/customer.js - Customer logic (vehicle browsing, booking, details)
js/sidebar-loader.js - Customer sidebar generation
5. Admin Module (admin/)
Comprehensive administration dashboard:
pages/dashboard/admin.html - Admin overview dashboard
pages/car/cars.html - Fleet management
pages/car/car-detail/car-detail.html - Individual vehicle management
pages/booking/bookings.html - Booking management
pages/customer/customers.html - Customer management
pages/report/reports.html - Business reports and analytics
pages/calendar/calendar.html - Calendar overview
pages/marketing/marketing.html - Marketing campaign management
pages/chatbot/chatbot.html - AI chatbot configuration
pages/setting/settings.html - System settings
css/admin.css - Admin pages styling
js/admin.js, js/cars.js, js/car-detail.js, js/bookings.js, js/customers.js, js/reports.js, js/calendar.js, js/marketing.js, js/marketing-ai.js, js/chatbot-admin.js, js/settings.js - Module-specific logic
API Layer Design (api.js)
The shared/js/api.js file serves as the single source of truth for all data operations. It provides the following key methods through the window.WeDriveAPI global object:
### 4.3.2 Physical Database Design
The physical database design translates the logical model into PostgreSQL Data Definition Language (DDL) statements for the Supabase PostgreSQL database.
Table 4.2: Cars Table Schema (DDL)
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
Table 4.3: Bookings Table Schema (DDL)
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
Table 4.4: Customers Table Schema (DDL)
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
Row Level Security (RLS) Policies:
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
Indexes for Query Optimization:
-- Index for booking queries by customer
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);

-- Index for booking queries by car
CREATE INDEX idx_bookings_car_id ON bookings(car_id);

-- Index for filtering cars by type and status
CREATE INDEX idx_cars_type_status ON cars(type, status);

-- Index for booking date range queries
CREATE INDEX idx_bookings_dates ON bookings(pickup_date, return_date);
## 4.4 Conclusion
This chapter has presented the comprehensive system design for the WeDRIVE project. The high-level design established a client-server architecture utilizing Supabase as a Backend-as-a-Service provider, with Vercel handling frontend hosting and continuous deployment. The user interface design was described with attention to modern design principles including glassmorphism aesthetics, dual-theme support, bilingual capability, and responsive layouts. The database design was presented through an Entity Relationship Diagram and normalized table structures following Third Normal Form.
The detailed design broke down the software into five modular components (Shared, Account, Guest, Customer, Admin), each with clearly defined responsibilities and file structures. The centralized API layer (api.js) was documented with its key methods and the modules they serve. The physical database design provided complete DDL statements for the primary tables, along with Row Level Security policies and performance-oriented indexes.
This design provides a solid, implementable blueprint for the development phase in PSM II. The modular architecture ensures that each component can be developed, tested, and deployed independently, aligning with the Agile iterative methodology adopted for the project. The next phase (PSM II) will focus on implementing this design, followed by comprehensive testing and final deployment.
# REFERENCES
Adamopoulou, E. and Moussiades, L. (2020) ‘An overview of chatbot technology’, IFIP Advances in Information and Communication Technology, 584, pp. 373-383. doi: 10.1007/978-3-030-49186-4_31.
Agentive AI (2024) 7 best smart AI agent systems for car rental management in 2024. Available at: https://agentiveaiq.com/listicles/7-best-smart-ai-agent-systems-for-car-rental (Accessed: 23 April 2026).
AirentoSoft (2024) All-in-one car rental software for fleet management and online booking. Available at: https://airentosoft.com/car-rental-software (Accessed: 23 April 2026).
Ali, M. and Rahman, S. (2025) ‘Driving consumer engagement through AI chatbot experience’, IEEE Xplore. Available at: https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11088190 (Accessed: 23 April 2026).
Duong, T., Pham, Q., Oh, J. and Do, A. (2025) ‘Can AI chatbot adoption bridge the gap between intention and e-booking behavior?’, Sustainability. Available at: https://www.mdpi.com/2071-1050/17/17/7673 (Accessed: 23 April 2026).
GoCar Malaysia (2024) GoCar - Car sharing and subscription platform. Available at: https://www.gocar.my (Accessed: 15 May 2026).
Gupta, R. (2024) ‘AI-driven fleet analytics: Revolutionizing modern fleet management’, ResearchGate, pp. 1-15. Available at: https://www.researchgate.net/publication/390194424 (Accessed: 23 April 2026).
KAYAK (2024) Car rental search and comparison. Available at: https://www.kayak.com.my (Accessed: 15 May 2026).
Kumar, S. and Singh, P. (2025) ‘Advanced car rental system: Integrating blockchain, AI and real-time inventory management for enhanced user experience’, ResearchGate, pp. 1-12. Available at: https://www.researchgate.net/publication/394119741 (Accessed: 23 April 2026).
MDN Web Docs (2024) Web technology for developers. Available at: https://developer.mozilla.org/en-US/ (Accessed: 1 May 2026).
Nguyen, Q. H. and Do, T. K. (2026) ‘The impact of AI chatbot on customer willingness to pay: An empirical investigation’, Journal of Open Innovation: Technology, Market, and Complexity. Available at: https://www.mdpi.com/2673-5768/7/3/68 (Accessed: 23 April 2026).
Rybo AI (2024) Transforming car rentals with AI chatbots: Benefits and use cases. Available at: https://www.rybo.ai/car-rental-chatbot/ (Accessed: 23 April 2026).
SOCAR Malaysia (2024) SOCAR - Car sharing app. Available at: https://www.socar.my (Accessed: 15 May 2026).
Supabase (2024) Supabase documentation: The open source Firebase alternative. Available at: https://supabase.com/docs (Accessed: 1 May 2026).
Tourism Malaysia (2024) Malaysia tourism statistics. Available at: https://www.tourism.gov.my (Accessed: 10 May 2026).
Zhang, L. and Wang, H. (2026) ‘Mapping the research landscape of AI chatbot adoption in tourism and hospitality’, Journal of Hospitality and Tourism Management. Available at: https://www.sciencedirect.com/org/science/article/pii/S1947820826000048 (Accessed: 23 April 2026).
|  | Student | Supervisor |
| --- | --- | --- |
| Name | MUHAMMAD DANIAL HAKIM BIN MOHD SAOFI | MUHAMMAD FAIZ BIN SUPIAN |
| Signature | _________________________ | _________________________ |
| Date | _________________________ | _________________________ |
| STUDENT | MUHAMMAD DANIAL HAKIM BIN MOHD SAOFI |
| --- | --- |
|  | (STUDENT FULL NAME) |
| Date | _________________________ |
| SUPERVISOR | MUHAMMAD FAIZ BIN SUPIAN |
| --- | --- |
|  | (SUPERVISOR FULL NAME) |
| Date | _________________________ |
|  | Page |
| --- | --- |
| DECLARATION | ii |
| DEDICATION | iii |
| ACKNOWLEDGEMENTS | iv |
| ABSTRACT | v |
| ABSTRAK | vi |
| TABLE OF CONTENTS | vii |
| LIST OF TABLES | x |
| LIST OF FIGURES | xi |
| LIST OF ABBREVIATIONS | xiii |
|  | Page |
| --- | --- |
| CHAPTER 1: INTRODUCTION |  |
| 1.1 Introduction | 1 |
| 1.2 Problem Statement(s) | 3 |
| 1.3 Objectives | 5 |
| 1.4 Scope | 5 |
| 1.5 Project Significance | 7 |
| 1.6 Expected Output | 8 |
| 1.7 Conclusion | 9 |
|  |  |
| CHAPTER 2: LITERATURE REVIEW AND PROJECT METHODOLOGY |  |
| 2.1 Introduction | 10 |
| 2.2 Facts and Findings | 11 |
| 2.2.1 Domain | 11 |
| 2.2.2 Existing Systems | 13 |
| 2.2.3 Technique | 19 |
| 2.3 Project Methodology | 22 |
| 2.4 Project Requirements | 25 |
| 2.4.1 Software Requirements | 25 |
| 2.4.2 Hardware Requirements | 27 |
| 2.4.3 Other Requirements | 28 |
| 2.5 Project Schedule and Milestones | 28 |
| 2.6 Conclusion | 30 |
|  |  |
| CHAPTER 3: ANALYSIS |  |
| 3.1 Introduction | 31 |
| 3.2 Problem Analysis | 32 |
| 3.3 Requirement Analysis | 35 |
| 3.3.1 Data Requirement | 35 |
| 3.3.2 Functional Requirement | 38 |
| 3.3.3 Non-functional Requirement | 42 |
| 3.3.4 Other Requirements | 43 |
| 3.4 Conclusion | 44 |
|  |  |
| CHAPTER 4: DESIGN |  |
| 4.1 Introduction | 45 |
| 4.2 High-Level Design | 46 |
| 4.2.1 System Architecture | 46 |
| 4.2.2 User Interface Design | 49 |
| 4.2.3 Database Design | 57 |
| 4.3 Detailed Design | 61 |
| 4.3.1 Software Design | 61 |
| 4.3.2 Physical Database Design | 64 |
| 4.4 Conclusion | 66 |
|  |  |
| REFERENCES | 67 |
| No. | Title | Page |
| --- | --- | --- |
| Table 2.1 | Comparison of Existing Car Rental Systems | 17 |
| Table 2.2 | Software Requirements | 26 |
| Table 2.3 | Hardware Requirements | 27 |
| Table 2.4 | Project Schedule and Milestones | 29 |
| Table 3.1 | Data Dictionary - Cars Table | 36 |
| Table 3.2 | Data Dictionary - Bookings Table | 36 |
| Table 3.3 | Data Dictionary - Customers Table | 37 |
| Table 3.4 | Functional Requirements Summary | 40 |
| Table 3.5 | Non-functional Requirements | 42 |
| Table 4.1 | Database Tables and Descriptions | 58 |
| Table 4.2 | Cars Table Schema (DDL) | 64 |
| Table 4.3 | Bookings Table Schema (DDL) | 65 |
| Table 4.4 | Customers Table Schema (DDL) | 65 |
| No. | Title | Page |
| --- | --- | --- |
| Figure 1.1 | WeDRIVE System Overview | 2 |
| Figure 2.1 | SOCAR Mobile Application Interface | 14 |
| Figure 2.2 | GoCar Booking Platform | 15 |
| Figure 2.3 | KAYAK Car Rental Search Interface | 16 |
| Figure 2.4 | Agile (Iterative) SDLC Model | 23 |
| Figure 2.5 | Project Gantt Chart | 29 |
| Figure 3.1 | Current Car Rental Process (Manual) | 33 |
| Figure 3.2 | Proposed Car Rental Process (WeDRIVE) | 34 |
| Figure 3.3 | Context Diagram | 38 |
| Figure 3.4 | Data Flow Diagram Level 0 | 39 |
| Figure 3.5 | Data Flow Diagram Level 1 | 41 |
| Figure 4.1 | System Architecture Diagram | 47 |
| Figure 4.2 | Deployment Architecture | 48 |
| Figure 4.3 | Landing Page (Guest View) | 50 |
| Figure 4.4 | Customer Dashboard | 51 |
| Figure 4.5 | Car Details Page with 360-Degree Viewer | 52 |
| Figure 4.6 | Booking Flow Interface | 53 |
| Figure 4.7 | Admin Dashboard | 54 |
| Figure 4.8 | Admin Car Management | 55 |
| Figure 4.9 | Navigation Flow Diagram | 56 |
| Figure 4.10 | Entity Relationship Diagram (ERD) | 59 |
| Figure 4.11 | Logical Database Design | 60 |
| Figure 4.12 | Module Architecture Diagram | 62 |
| Abbreviation | Description |
| --- | --- |
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| BaaS | Backend as a Service |
| BITC | Bachelor of Information Technology (Computer Networking) |
| BITS | Bachelor of Information Technology (Software Development) |
| CDN | Content Delivery Network |
| CRUD | Create, Read, Update, Delete |
| CSS | Cascading Style Sheets |
| DFD | Data Flow Diagram |
| ERD | Entity Relationship Diagram |
| FYP | Final Year Project |
| HTML | HyperText Markup Language |
| HTTPS | HyperText Transfer Protocol Secure |
| JS | JavaScript |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| LDM | Logical Data Model |
| OAuth | Open Authorization |
| PSM | Projek Sarjana Muda |
| REST | Representational State Transfer |
| RLS | Row Level Security |
| SDLC | Software Development Life Cycle |
| SQL | Structured Query Language |
| SSL | Secure Sockets Layer |
| SVG | Scalable Vector Graphics |
| UI | User Interface |
| UML | Unified Modeling Language |
| URL | Uniform Resource Locator |
| UTeM | Universiti Teknikal Malaysia Melaka |
| UX | User Experience |
| Feature | SOCAR | GoCar | KAYAK | WeDRIVE (Proposed) |
| --- | --- | --- | --- | --- |
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
| No. | Software | Version | Purpose |
| --- | --- | --- | --- |
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
| No. | Hardware | Specification | Purpose |
| --- | --- | --- | --- |
| 1 | Development Laptop/PC | Intel i5/AMD Ryzen 5 or above, 8GB RAM minimum, 256GB SSD | Primary development machine |
| 2 | Smartphone (Android/iOS) | Modern smartphone with latest browser | Mobile responsive testing |
| 3 | Internet Connection | Stable broadband connection (minimum 10 Mbps) | Cloud services access, deployment, API calls |
| 4 | Display Monitor | Full HD (1920x1080) minimum | UI development and testing |
| Phase | Activity | Duration | Period | Deliverable |
| --- | --- | --- | --- | --- |
| PSM I |  |  |  |  |
| Phase 1 | Requirements Gathering | 3 weeks | Feb 2026 - Mar 2026 | Problem statements, objectives, scope |
| Phase 1 | Literature Review | 4 weeks | Mar 2026 - Apr 2026 | Literature review chapter, existing system analysis |
| Phase 2 | System Analysis | 3 weeks | Apr 2026 | Requirements analysis, DFD, data dictionary |
| Phase 2 | System Design | 3 weeks | Apr 2026 - May 2026 | System architecture, ERD, UI design |
| - | PSM I Report Writing | 3 weeks | May 2026 - Jun 2026 | Complete PSM I report (Ch 1-4) |
| - | PSM I Presentation | 1 week | Jun 2026 | PSM I defense presentation |
| PSM II |  |  |  |  |
| Phase 3 | Iteration 1: Core Modules | 4 weeks | Jul 2026 - Aug 2026 | Auth, customer dashboard, admin dashboard |
| Phase 4 | Iteration 2: Advanced Features | 4 weeks | Aug 2026 - Sep 2026 | Booking flow, AI chatbot, 360 viewer |
| Phase 5 | Iteration 3: Polish | 3 weeks | Sep 2026 - Oct 2026 | Responsive, themes, multilingual, marketing |
| Phase 6 | Testing | 2 weeks | Oct 2026 | Unit, integration, UAT testing |
| Phase 6 | Deployment | 1 week | Oct 2026 | Production deployment |
| - | PSM II Report Writing | 3 weeks | Oct 2026 - Nov 2026 | Complete PSM II report (Ch 5-7) |
| - | PSM II Presentation | 1 week | Nov 2026 | Final defense presentation |
| Current Problem | WeDRIVE Solution |
| --- | --- |
| No real-time availability | Live vehicle availability updated through Supabase database |
| Limited vehicle information | 360-degree vehicle viewer with 200-frame rotation and interior panorama |
| Scattered data management | Centralized Supabase PostgreSQL database for all system data |
| Limited operating hours | 24/7 online booking portal with AI chatbot support |
| Manual errors | Automated booking management with conflict detection |
| No analytics | Built-in reporting dashboard with revenue and utilization charts |
| Field Name | Data Type | Size | Description | Constraint |
| --- | --- | --- | --- | --- |
| id | INTEGER | - | Unique car identifier | Primary Key, Auto-increment |
| name | VARCHAR | 255 | Full car name and model | Not Null |
| plate | VARCHAR | 20 | Vehicle registration plate number | Not Null, Unique |
| type | VARCHAR | 50 | Vehicle category (Sedan, SUV, Hatchback, etc.) | Not Null |
| fuel | VARCHAR | 30 | Fuel type (Petrol, Diesel, Hybrid, Electric) | Not Null |
| transmission | VARCHAR | 20 | Transmission type (Automatic, Manual) | Not Null |
| seats | INTEGER | - | Number of passenger seats | Not Null |
| rate | DECIMAL | 10,2 | Daily rental rate in MYR | Not Null |
| status | VARCHAR | 20 | Current availability (Available, Rented, Maintenance) | Not Null, Default ‘Available’ |
| image | TEXT | - | Primary vehicle image URL | Nullable |
| images | JSONB | - | Array of additional image URLs | Nullable |
| features | JSONB | - | Array of vehicle features | Nullable |
| description | TEXT | - | Detailed vehicle description | Nullable |
| created_at | TIMESTAMP | - | Record creation timestamp | Auto-generated |
| Field Name | Data Type | Size | Description | Constraint |
| --- | --- | --- | --- | --- |
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
| Field Name | Data Type | Size | Description | Constraint |
| --- | --- | --- | --- | --- |
| id | UUID | - | Unique customer identifier (from Supabase Auth) | Primary Key |
| email | VARCHAR | 255 | Customer email address | Not Null, Unique |
| full_name | VARCHAR | 255 | Customer full name | Not Null |
| phone | VARCHAR | 20 | Contact phone number | Nullable |
| ic_number | VARCHAR | 20 | Malaysian IC number | Nullable |
| license_number | VARCHAR | 30 | Driving license number | Nullable |
| username | VARCHAR | 50 | Display username | Nullable |
| avatar_url | TEXT | - | Profile picture URL | Nullable |
| status | VARCHAR | 20 | Account status (Active, Inactive, Pending) | Default ‘Active’ |
| total_bookings | INTEGER | - | Count of all bookings | Default 0 |
| total_spent | DECIMAL | 10,2 | Total amount spent on bookings | Default 0.00 |
| joined_date | TIMESTAMP | - | Account creation date | Auto-generated |
| last_booking | TIMESTAMP | - | Most recent booking date | Nullable |
| verification_status | VARCHAR | 20 | Document verification status | Default ‘Pending’ |
| ID | Requirement | Module | Priority |
| --- | --- | --- | --- |
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
| ID | Category | Requirement | Measure |
| --- | --- | --- | --- |
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
| Module | Navigation Type | Component |
| --- | --- | --- |
| Guest | Top Navbar | shared/components/navbar.html loaded by navbar-loader.js |
| Account (Auth) | Standalone (no navigation) | Self-contained pages |
| Customer | Sidebar | Generated by customer/js/sidebar-loader.js |
| Admin | Sidebar | admin/components/sidebar/sidebar-admin.html loaded by sidebar-loader.js |
| Table Name | Description | Primary Key | Foreign Keys | Records |
| --- | --- | --- | --- | --- |
| customers | Registered customer accounts and profiles | id (UUID) | - | 5 |
| cars | Vehicle fleet inventory and specifications | id (INTEGER) | - | 8 |
| bookings | Rental booking transactions | id (INTEGER) | customer_id -> customers.id, car_id -> cars.id | 110 |
| admins | System administrator accounts | id (INTEGER) | - | 1 |
| marketing | Promotional banners, promo codes, seasonal pricing | id (INTEGER) | - | Variable |
| config | System configuration and settings | id (INTEGER) | - | 1 |
| Method | Description | Module(s) |
| --- | --- | --- |
| loginUser(email, password) | Authenticate user via Supabase Auth | Account |
| getCars() | Retrieve all vehicles | Customer, Guest, Admin |
| getCarById(id) | Retrieve single vehicle details | Customer, Admin |
| getBookings() | Retrieve all bookings | Customer, Admin |
| getCustomers() | Retrieve all customers | Admin |
| getAdminData() | Retrieve complete admin dataset | Admin |
| getMarketing() | Retrieve marketing data | Admin, Guest, Customer |
| saveMarketing(data) | Persist marketing changes | Admin |
| getChatbotSettings() | Retrieve chatbot configuration | AI Chatbot |
| saveChatbotSettings(data) | Persist chatbot configuration | Admin |