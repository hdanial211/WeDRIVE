<!-- converted from WeDRIVE_PSM1_Draft_Report.docx -->

# BORANG PENGESAHAN STATUS LAPORAN

JUDUL: AI-Assisted Car Rental Management System with Chatbot Support

SESI PENGAJIAN: 2025 / 2026

## Saya: MUHAMMAD DANIAL HAKIM BIN MOHD SAOFI

mengaku membenarkan tesis Projek Sarjana Muda ini disimpan di Perpustakaan Universiti Teknikal Malaysia Melaka dengan syarat-syarat kegunaan seperti berikut:
- Tesis dan projek adalah hakmilik Universiti Teknikal Malaysia Melaka.

- Perpustakaan Fakulti Teknologi Maklumat dan Komunikasi dibenarkan membuat salinan untuk tujuan pengajian sahaja.
- Perpustakaan Fakulti Teknologi Maklumat dan Komunikasi dibenarkan membuat salinan tesis ini sebagai bahan pertukaran antara institusi pengajian tinggi.

Sila tandakan:











AI-ASSISTED CAR RENTAL MANAGEMENT SYSTEM WITH CHATBOT SUPPORT



MUHAMMAD DANIAL HAKIM BIN MOHD SAOFI




This report is submitted in partial fulfillment of the requirements for the

Bachelor of Computer Science (Software Development) with Honours.






FACULTY OF INFORMATION AND COMMUNICATION TECHNOLOGY
UNIVERSITI TEKNIKAL MALAYSIA MELAKA


2026

# DECLARATION


I hereby declare that this project report entitled

"AI-Assisted Car Rental Management System with Chatbot Support"

is written by me and is my own effort and that no part has been plagiarized without citations.


STUDENT	: MUHAMMAD DANIAL HAKIM BIN MOHD SAOFI

Date	:   1 JUN 2026


I hereby declare that I have read this project report and found that it has complied with the partial fulfillment for awarding the degree of Bachelor of Computer Science (Software Development) with Honours.


SUPERVISOR    : MUHAMMAD FAIZ BIN SUPIAN

Date	:

# DEDICATION


This project is dedicated to my beloved family for their unwavering support and encouragement throughout my academic journey. To my parents, who have always believed in my ability and provided endless motivation. To my friends and coursemates who have shared this journey with me, and to my supervisor, Mr. Muhammad Faiz Bin Supian, whose guidance and expertise have been invaluable in shaping this project.

# ACKNOWLEDGEMENTS


First and foremost, I would like to express my deepest gratitude to Allah S.W.T. for granting me the strength, patience, and knowledge to complete this project.
I would like to extend my heartfelt appreciation to my supervisor, Mr. Muhammad Faiz Bin Supian, for his continuous guidance, constructive feedback, and encouragement throughout the development of this project. His expertise and insights have been instrumental in the successful completion of this work.
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


Sistem Pengurusan Kereta Sewa Berbantukan AI dengan Sokongan Chatbot, yang dijenamakan sebagai WeDRIVE, ialah sebuah platform berasaskan web yang dibangunkan untuk memodenkan dan mengoptimumkan proses penyewaan kereta di Malaysia. Projek ini menangani cabaran utama yang dihadapi oleh perniagaan penyewaan kereta, termasuk sistem pengurusan yang berpecah-pecah, penglibatan pelanggan yang lemah, dan penggunaan kenderaan yang tidak cekap.

Projek ini mengikuti metodologi Agile (Iteratif) dalam rangka kerja Kitaran Hayat Pembangunan Perisian (SDLC), membolehkan penambahbaikan secara progresif melalui kitaran pembangunan yang berterusan. Seni bina sistem menggunakan model pelayan-pelanggan dengan HTML, CSS dan JavaScript untuk bahagian hadapan, manakala Supabase (PostgreSQL) bertindak sebagai pangkalan data bahagian belakang dan penyedia pengesahan. Platform ini dikerahkan di Vercel dengan domain tersuai (wedrive.website) dan mempunyai reka bentuk responsif dengan sokongan dwi-tema, keupayaan dwi-bahasa, serta estetik UI premium yang menggabungkan corak reka bentuk glassmorphism.

WeDRIVE terdiri daripada empat modul teras: Portal Tempahan Pelanggan, Papan Pemuka Pentadbir, Chatbot AI untuk bantuan pelanggan 24/7, dan antara muka Pelayaran Tetamu.

Kata Kunci: Sistem Penyewaan Kereta, Chatbot AI, Aplikasi Web, Supabase, Metodologi Agile

# TABLE OF CONTENTS


# LIST OF TABLES


Table 2.1 Comparison of Existing Car Rental Systems	17
Table 2.2 Software Requirements	26
Table 2.3 Hardware Requirements	27
Table 2.4 Project Schedule and Milestones	29
Table 3.1 Data Dictionary - Cars Table	36
Table 3.2 Data Dictionary - Bookings Table	36
Table 3.3 Data Dictionary - Customers Table	37
Table 3.4 Functional Requirements Summary	40
Table 3.5 Non-functional Requirements	42
Table 4.1 Database Tables and Descriptions	58
Table 4.2 Cars Table Schema (DDL)	64
Table 4.3 Bookings Table Schema (DDL)	65
Table 4.4 Customers Table Schema (DDL)	65

# LIST OF FIGURES
Figure 1.1 WeDRIVE System Overview	2
Figure 2.1 SOCAR Mobile Application Interface	14
Figure 2.2 GoCar Booking Platform	15
Figure 2.3 KAYAK Car Rental Search Interface	16
Figure 2.4 Agile (Iterative) SDLC Model	23
Figure 2.5 Project Gantt Chart	29
Figure 3.1 Current Car Rental Process (Manual)	33
Figure 3.2 Proposed Car Rental Process (WeDRIVE)	34
Figure 3.3 Context Diagram	38
Figure 3.4 Data Flow Diagram Level 0	39
Figure 3.5 Data Flow Diagram Level 1	41
Figure 4.1 System Architecture Diagram	47
Figure 4.2 Deployment Architecture	48
Figure 4.3 Landing Page (Guest View)	50
Figure 4.4 Customer Dashboard	51
Figure 4.5 Car Details Page with 360-Degree Viewer	52
Figure 4.6 Booking Flow Interface	53
Figure 4.7 Admin Dashboard	54
Figure 4.8 Admin Car Management	55
Figure 4.9 Navigation Flow Diagram	56
Figure 4.10 Entity Relationship Diagram (ERD)	59
Figure 4.11 Logical Database Design	60
Figure 4.12 Module Architecture Diagram	62

# LIST OF ABBREVIATIONS





# CHAPTER 1: INTRODUCTION


## Introduction

The car rental industry in Malaysia has experienced significant growth over the past decade, driven by increasing urbanization, the rise of domestic tourism, and a growing preference for flexible transportation options. According to the Malaysian Automotive Association (MAA, 2025), the demand for short-term vehicle rentals has surged, particularly in tourist-centric states such as Melaka, Penang, and Sabah. Despite this growing demand, many car rental businesses in Malaysia continue to rely on traditional, manual-based processes for managing their operations. These conventional methods often involve fragmented systems where bookings are handled through phone calls or WhatsApp messages, fleet management is tracked using spreadsheets, and customer records are maintained in physical logbooks or disconnected software applications.

This reliance on outdated systems presents several operational challenges. Customers frequently encounter difficulties in obtaining accurate, real-time information about vehicle availability, pricing, and booking status. The lack of a centralized digital platform results in prolonged response times, booking errors, and an overall substandard customer experience. From the business perspective, car rental operators struggle with inefficient fleet utilization, where vehicles may sit idle due to poor visibility into demand patterns, and revenue is lost through manual booking conflicts and the absence of data-driven decision-making tools.

The emergence of Artificial Intelligence (AI) technologies, particularly in the form of conversational chatbots and intelligent recommendation systems, offers transformative potential for the car rental industry. AI-powered chatbots can provide 24/7 customer assistance, handle routine inquiries autonomously, and

guide customers through the booking process without human intervention. Furthermore, AI-driven analytics can help businesses optimize fleet utilization, predict demand patterns, and deliver personalized recommendations to customers based on their preferences and rental history.

In response to these challenges and opportunities, this project proposes the development of WeDRIVE, an AI-Assisted Car Rental Management System with Chatbot Support. WeDRIVE is designed as a comprehensive, web-based platform that consolidates all car rental operations into a single, unified system. The platform serves three primary user categories: customers who can browse, book, and manage vehicle rentals through an intuitive interface; administrators who can manage the vehicle fleet, monitor bookings, and generate business reports through a feature-rich dashboard; and guests who can explore available vehicles and pricing information without requiring account registration.

The system distinguishes itself from existing solutions through several innovative features, including an interactive 360-degree vehicle viewer, a dual-theme interface supporting both Day and Night modes, bilingual support for English and Bahasa Melayu, and a premium user interface design incorporating modern glassmorphism aesthetics. The integration of AI chatbot technology, powered by Google Gemini and xAI Grok models, further enhances the system by providing intelligent, context-aware customer assistance.

Figure 1.1 presents a high-level overview of the WeDRIVE system, illustrating the relationship between the main system modules and user types.

[Figure 1.1: WeDRIVE System Overview — To be inserted]

## Problem Statement(s)

The following problem statements have been identified through analysis of the current car rental landscape in Malaysia:

### Problem Statement 1: Fragmented and Inefficient Car Rental Management Systems
Many car rental businesses in Malaysia operate using disconnected and manual-based management systems. Fleet information, booking records, customer details, and payment data are often maintained across separate platforms or physical records, leading to data inconsistency, duplication of effort, and operational inefficiencies. Car rental operators lack a unified platform that integrates all aspects of their business operations, from vehicle inventory management to customer relationship handling. This fragmentation results in booking conflicts, delayed responses to customer inquiries, and difficulty in generating accurate business reports for strategic decision-making (Kumar and Singh, 2025).

### Problem Statement 2: Poor Customer Experience and Limited Digital Engagement
Traditional car rental services offer limited digital engagement channels for customers. The booking process typically requires customers to make phone calls, send messages through WhatsApp, or visit physical offices to inquire about vehicle availability and complete reservations. This process is time-consuming, restricted to business operating hours, and prone to human errors. The absence of 24/7 digital support channels means that customer inquiries outside business hours go unanswered, leading to potential loss of business and customer dissatisfaction (Duong et al., 2025).

### Problem Statement 3: Underutilization of AI Technology in Car Rental Services

Despite the rapid advancement of AI technologies in the transportation and hospitality sectors, the Malaysian car rental industry has been slow to adopt AI-driven solutions. Existing systems lack intelligent features such as automated customer support through chatbots, personalized vehicle recommendations, and data-driven insights for business optimization. The absence of AI integration represents a missed opportunity to improve operational efficiency and gain competitive advantage in an increasingly digital marketplace (Zhang and Wang, 2026).

## Objectives

Based on the problem statements identified, this project aims to achieve the following objectives:
- To analyze the current challenges in car rental management systems in Malaysia and identify functional and non-functional requirements for an improved, integrated solution.
- To design and develop a web-based AI-Assisted Car Rental Management System (WeDRIVE) with integrated chatbot support that provides a unified platform for vehicle browsing, booking management, fleet administration, and customer engagement.
- To evaluate the system's functionality, usability, and AI chatbot effectiveness through comprehensive testing, including unit testing, integration testing, and user acceptance testing.

## Scope

The scope of this project encompasses the following areas:


### System Modules

- Customer Booking Portal: A user-friendly web interface enabling registered customers to browse available vehicles with 360-degree views, make reservations, complete payments, manage booking history, and receive booking confirmations with QR codes.
- Admin Dashboard: A comprehensive backend interface allowing administrators to manage the vehicle fleet, monitor and manage all customer bookings, generate business reports and analytics, manage marketing campaigns, configure system settings, and oversee AI chatbot settings.
- AI Chatbot: An intelligent conversational assistant powered by Google Gemini and xAI Grok AI models, providing 24/7 customer support for vehicle inquiries, booking assistance, and FAQ responses.
- Guest Browsing Interface: A publicly accessible interface allowing potential customers to explore the vehicle fleet and pricing information without account registration.

### Technical Scope

- Platform: Web-based application accessible through modern web browsers

- Frontend: HTML5, CSS3, JavaScript (Vanilla)

- Backend/Database: Supabase (PostgreSQL) with Row Level Security

- Authentication: Supabase Auth with email/password and Google OAuth 2.0

- Hosting: Vercel with automatic deployment from GitHub

- AI Integration: Google Gemini API and xAI Grok API for chatbot functionality

- Design: Responsive design, dual-theme (Day/Night), bilingual (EN/BM)

### Out of Scope

- Real payment gateway integration (demo mode only)

- Native mobile application development (iOS/Android)

- Real-time GPS vehicle tracking

- Physical key management and IoT vehicle access

- Multi-branch or franchise management

- Integration with external insurance or road tax systems

## Project Significance

Academic Significance: The project demonstrates practical application of software engineering principles, web development technologies, and AI integration in solving a real-world business problem.
Industry Significance: WeDRIVE addresses genuine pain points experienced by car rental businesses in Malaysia, providing a scalable, cost-effective solution for small to medium-sized operators.
Technological Significance: The project showcases modern web development approaches including BaaS architecture with Supabase, serverless deployment on Vercel, and integration of multiple AI language models.
Social Significance: By improving the car rental booking experience in tourist destinations like Melaka, the system contributes to enhancing the overall tourism experience in Malaysia.


## Expected Output

Upon completion, this project is expected to produce the following deliverables:

- A fully functional web-based car rental management system (WeDRIVE) deployed at wedrive.website.
- A responsive, premium user interface featuring glassmorphism design, dual-theme support, and bilingual capability.
- An AI-powered chatbot integrated with Google Gemini and xAI Grok APIs.

- A comprehensive database built on Supabase PostgreSQL with Row Level Security enforcement.
- An interactive 360-degree vehicle viewer using 200-frame exterior rotation and cubemap interior panorama.
- Complete project documentation including this PSM I report (Chapters 1-4).

## Conclusion

This chapter has provided an introduction to the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE) project. The chapter outlined the background and motivation for the project, identified three key problem statements relating to fragmented management systems, poor customer digital experience, and underutilization of AI technology in the car rental industry. Three corresponding project objectives were defined, along with the detailed scope covering four system modules and the technical architecture. The significance of the project was discussed from academic, industry, technological, and social perspectives, and the expected outputs were enumerated. Chapter 2 will present a comprehensive literature review of related works and the project methodology.

# CHAPTER 2: LITERATURE REVIEW AND PROJECT METHODOLOGY
## Introduction

This chapter presents a comprehensive review of the literature related to the development of WeDRIVE. The chapter covers the domain of car rental management systems, an analysis of existing platforms, the techniques and technologies applicable to the project, the selected Agile (Iterative) methodology, project requirements, and the project schedule and milestones.

## Facts and Findings

### Domain

The car rental industry in Malaysia is a vital component of the nation's transportation and tourism sectors. With Malaysia attracting over 26 million tourists annually (Tourism Malaysia, 2024), the demand for flexible, short-term vehicle rental services has steadily increased. Many small and medium-sized operators still manage their fleets using spreadsheets, WhatsApp communication, and manual record-keeping (Kumar and Singh, 2025).
Research by Zhang and Wang (2026) on the landscape of AI chatbot adoption in tourism and hospitality reveals that while AI chatbots are widely used in hotels and airlines, their adoption in the car rental sector remains relatively low, particularly in Southeast Asian markets. This gap presents an opportunity for innovation which WeDRIVE aims to address.




### Existing Systems

Three existing car rental platforms were analyzed to inform the design of WeDRIVE:
- SOCAR (socar.my): A leading car-sharing platform in Malaysia with mobile-first approach, keyless vehicle access, and 24-hour live chat support. Lacks AI-powered chatbot, 360-degree vehicle preview, and accessible administrative tools for small operators.
- GoCar (gocar.my): A comprehensive mobility ecosystem offering car sharing, subscription, garage, and insurance services. No AI-driven customer support or interactive vehicle preview.
- KAYAK (kayak.com.my): A global travel metasearch engine aggregating car rental deals with AI Mode for natural language queries. Functions only as a comparison platform with no direct booking or fleet management capabilities.

[Figure 2.1: SOCAR Mobile Application Interface — To be inserted] [Figure 2.2: GoCar Booking Platform — To be inserted]
[Figure 2.3: KAYAK Car Rental Search Interface — To be inserted]

Table 2.1: Comparison of Existing Car Rental Systems


### Technique

Frontend Web Technologies (HTML5, CSS3, JavaScript): WeDRIVE is built using vanilla HTML5, CSS3, and JavaScript without heavy frameworks, ensuring faster page loads, greater control, and simplified maintenance.
Backend-as-a-Service — Supabase: Supabase was selected for its PostgreSQL database, Row Level Security, built-in authentication, open-source nature, and automatically generated REST API.
AI Chatbot Integration: A dual-model architecture uses Google Gemini (gemini-2.0-flash) as primary and xAI Grok (grok-3-mini-fast) as fallback, configured through the admin dashboard.
360-Degree Vehicle Visualization: Each vehicle is represented by 200 photographs for exterior rotation and a cubemap panorama using Three.js for interior views.
Deployment: Vercel provides continuous deployment from GitHub, with the custom domain wedrive.website.


## Project Methodology

The development of WeDRIVE follows the Agile (Iterative) methodology within the SDLC framework. The Agile approach was selected over traditional Waterfall methodology for its support of incremental development, flexibility for changing requirements, continuous feedback integration, and natural alignment with version control practices.

[Figure 2.4: Agile (Iterative) SDLC Model — To be inserted]

The methodology is structured into six iterative phases: (1) Requirements Gathering and Analysis, (2) System Design, (3) Iteration 1 — Core Modules, (4)

Iteration 2 — Advanced Features, (5) Iteration 3 — Polish and Enhancement, and
(6) Testing and Deployment.

## Project Requirements

### Software Requirements

Table 2.2: Software Requirements


### Hardware Requirements

Table 2.3: Hardware Requirements


### Other Requirements

- Supabase free-tier account (PostgreSQL, Auth, Storage)

- Vercel Hobby plan for hosting and CI/CD

- Google Cloud Console for OAuth and Gemini API key

- xAI account for Grok API key

- GitHub account for version control

- Custom domain: wedrive.website

## Project Schedule and Milestones

The project spans two semesters following the Agile iterative approach.

Table 2.4: Project Schedule and Milestones

[Figure 2.5: Project Gantt Chart — To be inserted]

## Conclusion

This chapter presented a comprehensive literature review covering the car rental industry domain, analysis of three existing platforms, and the techniques applicable to WeDRIVE. The Agile (Iterative) methodology was selected for its

flexibility and incremental delivery capabilities. Project requirements and a detailed schedule spanning both PSM I and PSM II were documented. Chapter 3 will present detailed system requirements analysis.

# CHAPTER 3: ANALYSIS


## Introduction

This chapter presents a detailed analysis of the WeDRIVE system requirements. Section 3.2 conducts a thorough problem analysis comparing the current manual process with the proposed WeDRIVE solution. Section 3.3 provides comprehensive requirement analysis covering data requirements, functional requirements, non-functional requirements, and other supporting requirements.

## Problem Analysis

The current car rental process in Malaysia among small to medium-sized operators follows a predominantly manual workflow with six identified inefficiencies:
- Lack of Real-Time Availability Information — customers cannot view vehicle availability in real-time, leading to booking conflicts.
- Absence of Visual Vehicle Information — customers make decisions based on limited static photos or verbal descriptions.
- No Centralized Data Management — business data is scattered across multiple formats.
- Limited Operating Hours — support restricted to business hours results in lost potential bookings.
- Manual Error-Prone Processes — double bookings and incorrect pricing occur frequently.
- No Data-Driven Decision Making — operators cannot assess fleet utilization or identify business trends.

Figure 3.1: Current Car Rental Process (Manual)

Figure 3.2: Proposed Car Rental Process (WeDRIVE)

## Requirement Analysis

### Data Requirement

The WeDRIVE system manages three primary data entities:

Table 3.1: Data Dictionary — Cars Table

Table 3.2: Data Dictionary — Bookings Table

Table 3.3: Data Dictionary — Customers Table



### Functional Requirement

The functional requirements are illustrated through a Context Diagram, DFD Level 0, and DFD Level 1.
Table 3.4: Functional Requirements Summary



### Non-functional Requirement

Table 3.5: Non-functional Requirements


### Other Requirements

- Stable internet connection for Supabase and AI API access

- Visual Studio Code with Live Server extension for local development

- Git and GitHub for version control

- Regular database backups via Supabase built-in backup functionality

- AI API keys stored securely in admin chatbot settings panel

## Conclusion

This chapter presented a comprehensive analysis of WeDRIVE system requirements. Six key inefficiencies in the current manual car rental process were identified, and data requirements through detailed data dictionaries for three

primary entities were documented. Fourteen functional requirements and ten non-functional requirements were defined. Chapter 4 will translate these requirements into a concrete system design.

# CHAPTER 4: DESIGN


## Introduction

This chapter presents the system design for WeDRIVE. Section 4.2 covers the high-level design including system architecture, user interface design, and database design. Section 4.3 presents the detailed software module design and physical database schema.

## High-Level Design

### System Architecture

WeDRIVE adopts a client-server architecture utilizing a Backend-as-a-Service (BaaS) model with four primary layers:
- Presentation Layer (Frontend): Vanilla HTML5, CSS3, JavaScript running in the user's web browser, organized into four modules: Guest, Account, Customer, and Admin.
- Application Layer (API): Supabase auto-generated RESTful API with a centralized api.js file serving as the unified data access layer (window.WeDriveAPI).
- Service Layer (External): Supabase Auth, Supabase Storage, Google Gemini API, xAI Grok API, and Resend email API.
- Data Layer (Database): PostgreSQL on Supabase (Singapore region) with Row Level Security policies for data access control.

[Figure 4.1: System Architecture Diagram — To be inserted] [Figure 4.2: Deployment Architecture — To be inserted]

### User Interface Design

The WeDRIVE UI follows modern design principles with glassmorphism effects, smooth gradient accents, and micro-animations. Key design features include:
- Dual-Theme Support — Day Mode and Night Mode via separate CSS files (theme_day.css, theme_night.css)
- Responsive Design — adapts to desktop (1200px+), tablet (768px–1100px), and mobile (below 768px)
- Bilingual Support — dynamic EN/BM switching via JSON language files without page reload
- Consistent Typography — Inter font family (Google Fonts) throughout the system
- Premium Aesthetics — glassmorphism, gradient accents, and smooth UI transitions
[Figure 4.3: Landing Page (Guest View) — To be inserted] [Figure 4.4: Customer Dashboard — To be inserted]
[Figure 4.5: Car Details Page with 360-Degree Viewer — To be inserted] [Figure 4.6: Booking Flow Interface — To be inserted]
[Figure 4.7: Admin Dashboard — To be inserted] [Figure 4.8: Admin Car Management — To be inserted] [Figure 4.9: Navigation Flow Diagram — To be inserted]
### Database Design

The WeDRIVE database is designed around six key entities: Customers, Cars, Bookings, Admins, Marketing, and Config. The primary relationships are: a Customer can make many Bookings (one-to-many), a Car can have many

Bookings (one-to-many), and a Booking belongs to one Customer and one Car (many-to-one).

[Figure 4.10: Entity Relationship Diagram (ERD) — To be inserted] [Figure 4.11: Logical Database Design — To be inserted]
Table 4.1: Database Tables and Descriptions


## Detailed Design

### Software Design

WeDRIVE follows a modular design pattern organized into five modules:

- Shared Module (shared/): Reusable components including api.js (centralized data access), auth-guard.js (route protection), chatbot.js, vehicle-viewer.js, theme CSS files, and language JSON files.
- Account Module (account/): Authentication pages: login, signup, forgot password, welcome screen, complete profile, and verification pending.
- Guest Module (guest/): Browsing for unauthenticated users: explore Melaka page, how-it-works, and pricing tiers.
- Customer Module (customer/): Full customer experience: vehicle browsing, car details with 360° viewer, booking flow, booking history, profile

management, and support center.

- Admin Module (admin/): Comprehensive dashboard: overview, fleet management, booking management, customer management, reports, calendar, marketing, AI chatbot configuration, and system settings.

[Figure 4.12: Module Architecture Diagram — To be inserted]

### Physical Database Design

Table 4.2: Cars Table Schema (DDL)

Table 4.3: Bookings Table Schema (DDL)

Table 4.4: Customers Table Schema (DDL)


## Conclusion

This chapter presented the comprehensive system design for WeDRIVE. The high-level design established a client-server architecture utilizing Supabase as a BaaS provider with Vercel for hosting. The user interface design was described with attention to glassmorphism aesthetics, dual-theme support, bilingual capability, and responsive layouts. The database design was presented through ERD and normalized table structures following Third Normal Form. The detailed design documented five modular components and physical DDL schemas with RLS security policies. Chapter 4 concludes the PSM I report; PSM II will focus on implementation, testing, and deployment.

# REFERENCES


Adamopoulou, E. and Moussiades, L. (2020) 'An overview of chatbot technology', IFIP Advances in Information and Communication Technology, 584, pp. 373-383. doi: 10.1007/978-3-030-49186-4_31.
Agentive AI (2024) 7 best smart AI agent systems for car rental management in 2024. Available at: https://agentiveaiq.com/listicles/7-best-smart-ai-agent-s ystems-for-car-rental (Accessed: 23 April 2026).
AirentoSoft (2024) All-in-one car rental software for fleet management and online booking. Available at: https://airentosoft.com/car-rental-software (Accessed: 23 April 2026).
Ali, M. and Rahman, S. (2025) 'Driving consumer engagement through AI chatbot experience',	IEEE	Xplore.	Available	at: https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11088190 (Accessed: 23 April 2026).
Duong, T., Pham, Q., Oh, J. and Do, A. (2025) 'Can AI chatbot adoption bridge the gap between intention and e-booking behavior?', Sustainability. Available at: https://www.mdpi.com/2071-1050/17/17/7673 (Accessed: 23 April 2026).
GoCar Malaysia (2024) GoCar — Car sharing and subscription platform.
Available at: https://www.gocar.my (Accessed: 15 May 2026).

Gupta, R. (2024) 'AI-driven fleet analytics: Revolutionizing modern fleet management', ResearchGate, pp. 1-15. Available at: https://www.researchgate.net/publication/390194424 (Accessed: 23 April 2026).

KAYAK (2024) Car rental search and comparison. Available at: https://www.kayak.com.my (Accessed: 15 May 2026).
Kumar, S. and Singh, P. (2025) 'Advanced car rental system: Integrating blockchain, AI and real-time inventory management for enhanced user experience', ResearchGate, pp. 1-12. Available at: https://www.researchgate.net/publication/394119741 (Accessed: 23 April 2026).
MDN Web Docs (2024) Web technology for developers. Available at: https://developer.mozilla.org/en-US/ (Accessed: 1 May 2026).
Nguyen, Q. H. and Do, T. K. (2026) 'The impact of AI chatbot on customer willingness to pay: An empirical investigation', Journal of Open Innovation: Technology, Market, and Complexity. Available at: https://www.mdpi.com/2673-5768/7/3/68 (Accessed: 23 April 2026).
Rybo AI (2024) Transforming car rentals with AI chatbots: Benefits and use cases. Available at: https://www.rybo.ai/car-rental-chatbot/ (Accessed: 23 April 2026).
SOCAR Malaysia (2024) SOCAR — Car sharing app. Available at: https://www.socar.my (Accessed: 15 May 2026).
Supabase (2024) Supabase documentation: The open source Firebase alternative.
Available at: https://supabase.com/docs (Accessed: 1 May 2026).

Tourism Malaysia (2024) Malaysia tourism statistics. Available at: https://www.tourism.gov.my (Accessed: 10 May 2026).
Zhang, L. and Wang, H. (2026) 'Mapping the research landscape of AI chatbot adoption in tourism and hospitality', Journal of Hospitality and Tourism

Management.	Available	at: https://www.sciencedirect.com/org/science/article/pii/S1947820826000048 (Accessed: 23 April 2026).
|  | Pelajar / Student | Penyelia / Supervisor |
| --- | --- | --- |
| Nama: | MUHAMMAD DANIAL
BIN MOHD SAOFI | FAIZ BIN SUPIAN |
| Tandatangan: |  |  |
| Tarikh: | 1 JUN 2026 |  |
| AI | Artificial Intelligence |
| --- | --- |
| API | Application Programming Interface |
| BaaS | Backend as a Service |
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
| --- | --- |
| UI | User Interface |
| UML | Unified Modeling Language |
| URL | Uniform Resource Locator |
| UTeM | Universiti Teknikal Malaysia Melaka |
| UX | User Experience |
| Feature | SOCAR | GoCar | KAYAK | WeDRIVE |
| --- | --- | --- | --- | --- |
| Platform | Mobile App | Mobile + We | bWeb Search | Web App |
| AI Chatbot | No | No | AI Mode | Yes (Gemini+Grok) |
| 360° View | No | No | No | Yes (200 frames) |
| Admin Panel | Internal | Internal | N/A | Full Dashboard |
| Dark Mode | No | No | No | Yes |
| Bilingual | EN/BM | EN/BM | Multi | EN/BM Toggle |
| Analytics | Internal | Internal | N/A | Built-in |
| No. | Software | Version | Purpose |
| --- | --- | --- | --- |
| 1 | Visual Studio Code | Latest | Primary code editor |
| 2 | Supabase | - | Backend-as-a-Service (DB, Auth, Storage) |
| 3 | Vercel | - | Hosting and CI/CD deployment |
| 4 | HTML5 / CSS3 / JS | ES6+ | Frontend technologies |
| 5 | PostgreSQL | 15+ | Relational database via Supabase |
| 6 | Three.js | Latest | 3D rendering for interior viewer |
| 7 | Google Gemini API | gemini-2.0-flash | Primary AI chatbot model |
| 8 | xAI Grok API | grok-3-mini-fast | Fallback AI chatbot model |
| 9 | Resend | - | Email delivery service |
| 10 | GitHub | - | Version control and repository |
| No. | Hardware | Specification | Purpose |
| --- | --- | --- | --- |
| 1 | Laptop/PC | Intel i5/Ryzen 5+, 8GB RAM, 256GB | SDSeDvelopment machine |
| 2 | Smartphone | Modern device with latest browser | Mobile responsive testing |
| 3 | Internet | Stable broadband, min. 10 Mbps | Cloud services and API access |
| 4 | Monitor | Full HD (1920x1080) minimum | UI development and testing |
| Phase | Activity | Period | Deliverable |
| --- | --- | --- | --- |
| PSM I | Requirements Gathering | Feb–Mar 2026 | Problem statements, scope |
| PSM I | Literature Review | Mar–Apr 2026 | Ch.2 — Literature review |
| PSM I | System Analysis | Apr 2026 | Ch.3 — DFD, data dictionary |
| PSM I | System Design | Apr–May 2026 | Ch.4 — Architecture, ERD |
| PSM I | Report Writing | May–Jun 2026 | Complete PSM I report |
| PSM I | Presentation | Jun 2026 | PSM I defense |
| PSM II | Iteration 1: Core Modules | Jul–Aug 2026 | Auth, dashboards |
| PSM II | Iteration 2: Advanced | Aug–Sep 2026 | Booking, chatbot, 360° |
| PSM II | Iteration 3: Polish | Sep–Oct 2026 | Responsive, themes, i18n |
| PSM II | Testing & Deployment | Oct 2026 | UAT, production release |
| PSM II | Report Writing | Oct–Nov 2026 | Complete PSM II report |
| PSM II | Final Presentation | Nov 2026 | Final defense |
| Field | Data Type | Description | Constraint |
| --- | --- | --- | --- |
| id | INTEGER | Unique car identifier | PK, Auto-increment |
| name | VARCHAR(255) | Full car name and model | Not Null |
| plate | VARCHAR(20) | Vehicle registration plate | Not Null, Unique |
| type | VARCHAR(50) | Vehicle category (Sedan, SUV, etc.) | Not Null |
| rate | DECIMAL(10,2) | Daily rental rate in MYR | Not Null |
| status | VARCHAR(20) | Availability status | Default 'Available' |
| images | JSONB | Array of image URLs | Nullable |
| features | JSONB | Array of vehicle features | Nullable |
| Field | Data Type | Description | Constraint |
| --- | --- | --- | --- |
| id | INTEGER | Unique booking identifier | PK, Auto-increment |
| booking_id | VARCHAR(20) | Human-readable reference (BK-YYY | YN-NotNNNu)ll, Unique |
| customer_id | UUID | Reference to customer account | FK  customers.id |
| car_id | INTEGER | Reference to booked vehicle | FK  cars.id |
| pickup_date | DATE | Rental start date | Not Null |
| return_date | DATE | Rental end date | Not Null |
| total | DECIMAL(10,2) | Total booking amount | Not Null |
| status | VARCHAR(20) | Booking status | Default 'Pending' |
| Field | Data Type | Description | Constraint |
| --- | --- | --- | --- |
| id | UUID | Unique customer identifier (Supab | aPsKe Auth) |
| email | VARCHAR(255) | Customer email address | Not Null, Unique |
| --- | --- | --- | --- |
| full_name | VARCHAR(255) | Customer full name | Not Null |
| phone | VARCHAR(20) | Contact phone number | Nullable |
| ic_number | VARCHAR(20) | Malaysian IC number | Nullable |
| status | VARCHAR(20) | Account status | Default 'Active' |
| total_bookings | INTEGER | Count of all bookings | Default 0 |
| total_spent | DECIMAL(10,2) | Total amount spent | Default 0.00 |
| ID | Requirement | Module | Priority |
| --- | --- | --- | --- |
| FR-01 | Register using email/password | Authentication | High |
| FR-02 | Login using Google OAuth 2.0 | Authentication | High |
| FR-03 | Browse available vehicles with filters | Customer Portal | High |
| FR-04 | View 360-degree vehicle viewer | Customer Portal | High |
| FR-05 | Select rental dates and calculate cost | Booking | High |
| FR-06 | Generate booking confirmation with QR code | Booking | Medium |
| FR-07 | AI chatbot for customer inquiries | AI Chatbot | High |
| FR-08 | Admin: add, edit, delete vehicles | Admin — Cars | High |
| FR-09 | Admin: view and manage all bookings | Admin — Bookings | High |
| FR-10 | Generate revenue and utilization reports | Admin — Reports | Medium |
| FR-11 | Manage marketing campaigns | Admin — Marketing | Medium |
| FR-12 | Dual-theme (Day/Night) toggle | UI/UX | Medium |
| FR-13 | Bilingual (English/Bahasa Melayu) switching | UI/UX | Medium |
| --- | --- | --- | --- |
| FR-14 | Responsive design for mobile devices | UI/UX | High |
| ID | Category | Requirement | Measure |
| --- | --- | --- | --- |
| NFR-01 | Performance | Pages load within 3 seconds | < 3 seconds |
| NFR-02 | Performance | Chatbot responds within 5 seconds | < 5 seconds |
| NFR-03 | Usability | Accessible on desktop, tablet, mobile | Cross-browser tested |
| NFR-04 | Security | Passwords hashed using bcrypt | No plaintext storage |
| NFR-05 | Security | All API calls via HTTPS | SSL/TLS enforced |
| NFR-06 | Security | Database RLS policies active | RLS enforced |
| NFR-07 | Reliability | Chatbot failover from Gemini to Grok | Dual-model architecture |
| NFR-08 | Reliability | System uptime 99.9% (Vercel SLA) | Uptime monitoring |
| NFR-09 | Scalability | Support thousands of database records | PostgreSQL scalability |
| NFR-10 | Localization | Dynamic EN/BM language switching | JSON language files |
| Table | Description | Primary Key | Records |
| --- | --- | --- | --- |
| customers | Registered customer accounts and profiles | id (UUID) | 5 |
| cars | Vehicle fleet inventory and specifications | id (INTEGER) | 8 |
| bookings | Rental booking transactions | id (INTEGER) | 110 |
| admins | System administrator accounts | id (INTEGER) | 1 |
| marketing | Promotional banners, promo codes, season | id (INTEGER) | Variable |
| config | System configuration and settings | id (INTEGER) | 1 |