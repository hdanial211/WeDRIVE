<!-- converted from REPORT_FYP_backup.docx -->










































UNIVERSITI TEKNIKAL MALAYSIA MELAKA































This report is submitted in partial fulfillment of the requirements for the











FACULTY OF INFORMATION AND COMMUNICATION TECHNOLOGY UNIVERSITI TEKNIKAL MALAYSIA MELAKA






















































# DEDICATION

This final year project report on AI-Assisted Car Rental Management System with Chatbot Support is dedicated to my family and friends. Their unwavering support and encouragement have been invaluable throughout this journey. I deeply appreciate their belief in me and the strength it has given me to pursue this project.
I would also like to extend my heartfelt gratitude to my supervisor and lecturers for their guidance and expert knowledge. Their mentorship has been instrumental in shaping this project and enhancing my learning experience.
Furthermore, this project is dedicated to all car rental operators and customers in Malaysia, whose needs for a more efficient, digital, and accessible rental experience have inspired the creation of the WeDRIVE system. In an era where technology continues to transform the way businesses operate, it is my sincere hope that the AI-Assisted Car Rental Management System with Chatbot Support will not only provide greater convenience to customers but also contribute to the modernisation and growth of the local car rental industry.
Thank you to everyone who has inspired, guided, and supported the development of the WeDRIVE project. This achievement belongs to all of you.







# ACKNOWLEDGEMENTS



I humbly express my deepest gratitude to Allah Ta'ala, the Most Gracious, the Most Merciful, for His infinite guidance, strength, and blessings throughout the course of this final year project. It is only through His will and mercy that I have been able to overcome challenges, remain steadfast, and successfully complete this academic journey.
First and foremost, I extend my heartfelt thanks to my supervisor, Mr. Muhammad Faiz Bin Supian, for his steadfast support, expertise, and guidance at every stage of this project. His insightful feedback, constructive criticism, and continuous encouragement have not only helped me navigate the technical challenges of developing an AI-powered web application, but have also driven me to achieve excellence in all aspects of the WeDRIVE system. His dedication to my academic growth has been truly inspiring.
I am also deeply thankful for the continuous support and patience of my beloved family and friends. Your belief in my vision for WeDRIVE has been a constant source of inspiration throughout this journey. Your encouragement and understanding during late nights and demanding moments have enabled me to stay focused and motivated in developing a system that aims to modernise and improve the car rental experience in Malaysia.
I also appreciate the online communities, developer forums, and open-source documentation communities where I found valuable advice, solutions, and best practices. The implementation of essential features within WeDRIVE — including the AI chatbot integration, real-time booking management, 360-degree vehicle viewer, and responsive user interface — was greatly influenced by the collective knowledge and insights of fellow developers and technology enthusiasts. Your contributions have significantly improved the functionality, performance, and usability of the application.
Special thanks also go to all individuals who participated in testing the WeDRIVE application during its development phase. Your honest feedback and constructive suggestions have been vital in refining the system's features, identifying areas for improvement, and ensuring that the platform effectively meets the needs of its intended users.
Finally, I recognise the contribution of the external technologies, frameworks, and APIs that have been seamlessly integrated with WeDRIVE — including Supabase, Vercel, OpenRouter.ai, Google Gemini, and Resend — each of which has enhanced the system's capabilities and ensured a robust and reliable user experience. To everyone who believed in the potential of WeDRIVE and supported me throughout this transformative journey, thank you sincerely for making this project both possible and meaningful.


# ABSTRACT



The AI-Assisted Car Rental Management System with Chatbot Support, branded as WeDRIVE, is a web-based platform developed to modernise and optimise the car rental process in Malaysia. This project addresses three key challenges faced by car rental businesses, namely fragmented and inefficient management systems, poor customer experience and limited digital engagement, and the underutilisation of Artificial Intelligence (AI) technology in the car rental sector. In response to these challenges, WeDRIVE was developed as a comprehensive, unified platform serving three primary user categories — guests, registered customers, and administrators — each with dedicated modules tailored to their respective needs. The project follows the Agile (Iterative) methodology within the Software Development Life Cycle (SDLC) framework, enabling progressive refinement through continuous development cycles across two semesters. The system architecture employs a client-server model using HTML5, CSS3, and JavaScript for the frontend, with Supabase (PostgreSQL) serving as the backend database and authentication provider, and Vercel handling hosting and continuous deployment via a custom domain (wedrive.website). WeDRIVE comprises four core modules: a Guest Browsing Interface for exploring vehicles and attractions without registration, a Customer Booking Portal for vehicle browsing, reservation, and profile management, an AI Chatbot powered by OpenRouter.ai (Gemini 2.5 Flash) for 24/7 intelligent customer assistance, and an Admin Dashboard for comprehensive fleet management, booking oversight, business analytics, marketing campaigns, and system configuration. The system further features an interactive 360-degree vehicle viewer using 200-frame exterior rotation and cubemap interior panorama, a responsive dual-theme interface supporting Day and Night modes, bilingual capability in English and Bahasa Melayu, and premium glassmorphism UI aesthetics. The expected outcome is a fully functional, AI-enhanced car rental management platform deployed at wedrive.website that improves operational efficiency, enhances customer satisfaction, and demonstrates the practical integration of modern AI technologies into a real-world business web application.


# ABSTRAK



Sistem Pengurusan Penyewaan Kereta Berbantukan Kecerdasan Buatan dengan Sokongan Chatbot, yang dijenamakan sebagai WeDRIVE, merupakan sebuah platform berasaskan web yang dibangunkan bagi memodenkan dan mengoptimumkan proses penyewaan kereta di Malaysia. Projek ini menangani tiga cabaran utama yang dihadapi oleh perniagaan penyewaan kereta, iaitu sistem pengurusan yang berpecah-pecah dan tidak cekap, pengalaman pelanggan yang lemah serta penglibatan digital yang terhad, dan penggunaan teknologi Kecerdasan Buatan (AI) yang masih rendah dalam sektor penyewaan kereta. Sebagai respons kepada cabaran-cabaran tersebut, WeDRIVE dibangunkan sebagai sebuah platform yang komprehensif dan bersepadu, melayani tiga kategori pengguna utama iaitu tetamu, pelanggan berdaftar, dan pentadbir sistem, dengan setiap kategori mempunyai modul yang direka khusus mengikut keperluan masing-masing. Projek ini mengikuti metodologi Agile (Iteratif) dalam rangka kerja Kitaran Hayat Pembangunan Perisian (SDLC), membolehkan penambahbaikan secara berperingkat melalui kitaran pembangunan yang berterusan merentasi dua semester pengajian. Seni bina sistem menggunakan model pelayan-pelanggan dengan HTML5, CSS3, dan JavaScript untuk bahagian hadapan, manakala Supabase (PostgreSQL) berfungsi sebagai pangkalan data bahagian belakang dan pembekal pengesahan, serta Vercel mengendalikan pengehosan dan penggunaan berterusan melalui domain tersuai (wedrive.website). WeDRIVE terdiri daripada empat modul teras, iaitu Antara Muka Pelayaran Tetamu untuk melayari kenderaan dan tarikan pelancongan tanpa pendaftaran, Portal Tempahan Pelanggan untuk melayari kenderaan, membuat tempahan, dan pengurusan profil, Chatbot AI yang dikuasakan oleh OpenRouter.ai (Gemini 2.5 Flash) bagi menyediakan bantuan pelanggan pintar sepanjang masa, serta Papan Pemuka Pentadbir untuk pengurusan armada yang komprehensif, pemantauan tempahan, analitik perniagaan, kempen pemasaran, dan konfigurasi sistem. Sistem ini turut menampilkan pemapar kenderaan 360 darjah interaktif menggunakan 200 bingkai putaran eksterior dan panorama interior cubemap, antara muka responsif dwi-tema yang menyokong mod Siang dan Malam, keupayaan dwibahasa dalam Bahasa Inggeris dan Bahasa Melayu, serta estetik UI glassmorphism premium. Hasil yang dijangkakan adalah sebuah platform pengurusan penyewaan kereta yang berfungsi sepenuhnya dan dipertingkatkan dengan AI, yang digunakan di wedrive.website bagi meningkatkan kecekapan operasi, meningkatkan kepuasan pelanggan, serta menunjukkan integrasi praktikal teknologi AI moden ke dalam aplikasi web perniagaan dunia sebenar.



















# table of contents




DECLARATION	ii
DEDICATION	iii
ACKNOWLEDGEMENTS	iv
ABSTRACT	vi
ABSTRAK	vii
table of contents	ix
list of tables	xiv
list of figures	xv
List of Abbreviations	xix
List of ATTACHMENTS	xxi
Chapter 1: INTRODUCTION	22
1.1	Introduction	22
1.2	Problem Statement(s)	25
1.3	Objectives	27
1.4	Scope	28
1.4.1	System Modules	28
1.4.2	Technical Scope	29
1.4.3	Out of Scope	30
1.5	Project Significance	31
1.6	Expected Output	33
1.7	Conclusion	35
Chapter 2: literature review AND PROJECT METHODOLOGY	36
2.1	Introduction	36
2.2	Facts and Findings	37
2.2.1	Domain	37
2.2.1.1	Car Rental Industry in Malaysia	37
2.2.1.2	AI in the Transportation and Hospitality Sector	38
2.2.1.3	Web-Based Management Systems	39
2.2.2	Existing System	40
2.2.2.1	SOCAR (socar.my)	41
2.2.2.2	GoCar (gocar.my)	43
2.2.2.3	KAYAK (kayak.com.my)	45
2.2.3	Technique	48
2.2.3.1	Frontend Web Technologies (HTML5, CSS3, JavaScript)	48
2.2.3.2	Backend-as-a-Service: Supabase	49
2.2.3.3	AI Chatbot Integration	50
2.2.3.4	360-Degree Vehicle Visualization	51
2.2.3.5	Deployment and Hosting	51
2.3	Project Methodology	52
2.4	Project Requirements	56
2.4.1	Software Requirements	56
2.4.2	Hardware Requirement	58
2.4.3	Other Requirement	59
2.5	Project Schedule and Milestones	60
2.6	Conclusion	61
Chapter 3: ANALYSIS	62
3.1	Introduction	62
3.2	Problem Analysis	63
3.2.1	Current System Scenario	63
3.2.2	Problems Identified in the Current Process	66
3.2.3	Proposed Solution: WeDRIVE System	67
3.3	Requirement Analysis	69
3.3.1	Data Requirement	69
3.3.2	Functional Requirement	73
3.3.2.1	Context Diagram	73
3.3.2.2	Data Flow Diagram Level 0	75
3.3.2.3	Data Flow Diagram Level 1	77
3.3.3	Non-functional Requirement:	79
3.3.4	Other Requirement	81
3.4	Conclusion	82
Chapter 4: DESIGN	83
4.1	Introduction	83
4.2	High-Level Design	84
4.2.1	System Architecture	84
4.2.1.1	Architecture Overview	84
4.2.1.2	Deployment Architecture	86
4.2.2	User Interface Design	88
4.2.2.1	Design Principles	88
4.2.2.2	Navigation Design	89
4.2.2.3	Input Design	91
4.2.2.4	Output Design	120
4.2.3	Database Design	155
4.2.3.1	Conceptual and Logical Database Design	155
4.2.3.2	Data Dictionary and Normalisation	159
4.3	Detailed Design	163
4.3.1	Software Design	163
4.3.2	Physical Database Design	168
4.4	Conclusion	172
Chapter 5: IMPLEMENTATION	173
5.1	Introduction	173
5.2	Software Development Environment Setup	173
5.3	Version Control Procedure	173
5.4	Implementation Status	173
5.5	Conclusion	173
Chapter 6: TESTING	174
6.1	Introduction	174
6.2	Test Plan	174
6.2.1	Test Organization	174
6.2.2	Test Environment	174
6.2.3	Test Schedule	174
6.3	Test Strategy	174
6.3.1	Classes of Test	174
6.4	Test Design	175
6.4.1	Test Description	175
6.4.2	Test Data	175
6.5	Test Result and Analysis	175
6.6	Conclusion	175
Chapter 7: CONCLUSION	176
7.1	Observation and Weakness Strength	176
7.2	Proposition and Improvements	176
7.3	Project Contribution	176
7.4	Conclusion	176
references	177
APPENDIX A	180




# list of tables




Table 2.1: Comparison of Existing Car Rental Systems	46
Table 2.2: Software Requirements	56
Table 2.3: Hardware Requirements	58
Table 3.1: Proposed Solution	67
Table 3.2: Data Dictionary - Cars Table	69
Table 3.3: Data Dictionary - Bookings Table	70
Table 3.4: Data Dictionary - Customers Table	71
Table 3.5: Functional Requirements Summary	77
Table 3.6: Non-functional Requirements	79
Table 4.1: Navigation Component	89
Table 4.2: Cars	159
Table 4.3: Bookings	160
Table 4.4: Customers	161












# list of figures




Figure 1.1: WeDRIVE System Overview	24
Figure 2.2.2.1: SOCAR Mobile Application Interface	42
Figure 2.2.2.2: GoCar Website Interface	44
Figure 2.2.2.3: KAYAK Car Rental Search Interface	46
Figure 2.4: Agile (Iterative) SDLC Model	53
Figure 2.5: Gantt Chart	60
Figure 3.1: Current Car Rental Process - Manual Flowchart	65
Figure 3.2: Proposed Car Rental Process (WeDRIVE) – Flowchart	68
Figure 3.3: Context Diagram	73
Figure 3.3.4: Data Flow Diagram Level 0	75
Figure 3.3.5: Data Flow Diagram Level 1	77
Figure 4.1: System Architecture Diagram	85
Figure 4.2: Deployment Architecture	87
Figure 4.3: Navigation Flow Diagram	90
Figure 4.4: Landing Page	91
Figure 4.5: Welcome Page	92
Figure 4.6: Login Form	93
Figure 4.7: Register Form	94
Figure 4.8: Authenticator Google	94
Figure 4.9: 2FA	95
Figure 4.10: Google 2FA	96
Figure 4.11: Check Available Username	97
Figure 4.12: Username Already Taken	98
Figure 4.13: Username is Available	98
Figure 4.14: Document Upload	99
Figure 4.15: Reset Password	100
Figure 4.16: Send Reset Password to Email	101
Figure 4.17: Receive Reset Password Email	102
Figure 4.18: Wait for Verified Account	103
Figure 4.19: Admin Approve Account - Step 1	104
Figure 4.20: Notification Account Verified In Email - Step 2	105
Figure 4.21: Account Verified - Step 3	106
Figure 4.22:Admin Reject Account - Step 1	107
Figure 4.23: Notification Account Unverified In Email - Step 2	108
Figure 4.24: Account Unverified - Step 3	109
Figure 4.25: Reupload Account Unverified - Step 4	109
Figure 4.26: Booking Flow Interface — Part 1	110
Figure 4.27: Booking Flow Interface — Part 2	111
Figure 4.28: Pick Date Available — Part 1	111
Figure 4.29: Continue Booking — Part 2	112
Figure 4.30: Checkout — Part 3	113
Figure 4.31: Add Extra Item — Part 3	113
Figure 4.32: Complete Information Driver— Part 4	114
Figure 4.33: Complete Payment Method— Part 4	114
Figure 4.34: Choose Full Payment— Part 5	115
Figure 4.35: Choose Deposit Payment Only— Part 6	115
Figure 4.36: Car Already Wait To Collect— Part 7	116
Figure 4.37: Car Already Handovers & Pickups — Part 8	116
Figure 4.38: Admin Car Management — Add New Car	117
Figure 4.39: AI Chatbot In Customer Dashboard	118
Figure 4.40: AI Chatbot In Guest Dashboard	119
Figure 4.41: Landing Page (Guest View) – Page 1	120
Figure 4.42: Landing Page (Guest View) – Page 2	121
Figure 4.43: Landing Page (Guest View) – Page 3	121
Figure 4.44: Explore Melaka – Page 1	122
Figure 4.45: Explore Melaka – Page 2	122
Figure 4.46: Explore Melaka – Page 3	123
Figure 4.47: Explore Melaka – Page 4	123
Figure 4.48: How It Works – Welcome Page	124
Figure 4.49: How It Works – Page 1	124
Figure 4.50: How It Works – Page 2	125
Figure 4.51: How It Works – Page 3	125
Figure 4.52: How It Works – Page 4	126
Figure 4.53: How It Works – Page 5	126
Figure 4.54: How It Works – Page 6	127
Figure 4.55: How It Works – Page 7	127
Figure 4.56: How It Works – Page 8	128
Figure 4.57: Car Details Page with 360-Degree Viewer — Exterior	129
Figure 4.58: Car Details Page with 360-Degree Viewer — Interior	130
Figure 4.59: Customer Dashboard – Page 1	131
Figure 4.60: Customer Dashboard – Page 2	132
Figure 4.61: My Bookings Customer	132
Figure 4.62: Personal Info Setting – Page 1	133
Figure 4.63: Personal Info Setting – Page 2	134
Figure 4.64: Personal Info Setting – Double Confirmation Page	134
Figure 4.65: Security Info Setting	135
Figure 4.66: Security Info Setting - Double Confirmation Page	135
Figure 4.67: Card Setting	136
Figure 4.68: Preferences Individual Setting	136
Figure 4.69: Preferences Individual Setting - Double Confirmation Page	137
Figure 4.70: Notification Setting	137
Figure 4.71: Notification Setting - Double Confirmation Page	138
Figure 4.72: Email — Deposit Payment Receipt	139
Figure 4.73: Email — Full Payment Receipt	140
Figure 4.74: Admin Dashboard	141
Figure 4.75: Admin Booking Management	142
Figure 4.76: Report Management	143
Figure 4.77: Dashboard Calendar Admin	144
Figure 4.78: Check Calendar Admin	144
Figure 4.79: Dashboard Marketing — Banner	145
Figure 4.80: Dashboard Marketing — Promo Codes	146
Figure 4.81: Dashboard Marketing — Seasonal Pricing	146
Figure 4.82: Dashboard Marketing — Using AI Page 1	147
Figure 4.83: Dashboard Marketing — Using AI Page 2	147
Figure 4.84: Dashboard Marketing — Using AI Page 3	148
Figure 4.85: Dashboard Marketing — Using AI Page 4	148
Figure 4.86: AI Setting Dashboard Admin	149
Figure 4.87: Admin Setting	150
Figure 4.88: Footer	151
Figure 4.89: Privacy Policy	151
Figure 4.90: Car Connectivity	152
Figure 4.91: Frequently Asked Questions (FAQ)	152
Figure 4.92: Contact	153
Figure 4.93: Error Page	154
Figure 4.94: Entity Relationship Diagram (ERD)	157
Figure 4.95: Logical Database Design	158
Figure 4.96: Module Architecture Diagram	167













# List of Abbreviations







# List of ATTACHMENTS





# INTRODUCTION
## Introduction
The car rental industry in Malaysia has experienced significant growth over the past decade, driven by increasing urbanization, the rise of domestic tourism, and a growing preference for flexible transportation options. According to the Malaysian Automotive Association (MAA, 2025), the demand for short-term vehicle rentals has surged, particularly in tourist-centric states such as Melaka, Penang, and Sabah. Despite this growing demand, many car rental businesses in Malaysia continue to rely on traditional, manual-based processes for managing their operations. These conventional methods often involve fragmented systems where bookings are handled through phone calls or WhatsApp messages, fleet management is tracked using spreadsheets, and customer records are maintained in physical logbooks or disconnected software applications.

This reliance on outdated systems presents several operational challenges. Customers frequently encounter difficulties in obtaining accurate, real-time information about vehicle availability, pricing, and booking status. The lack of a centralized digital platform results in prolonged response times, booking errors, and an overall substandard customer experience. From the business perspective, car rental operators struggle with inefficient fleet utilization, where vehicles may sit idle due to poor visibility into demand patterns, and revenue is lost through manual booking conflicts and the absence of data-driven decision-making tools.

The emergence of Artificial Intelligence (AI) technologies, particularly in the form of conversational chatbots and intelligent recommendation systems, offers transformative potential for the car rental industry. AI-powered chatbots can provide 24/7 customer assistance, handle routine inquiries autonomously, and guide customers through the booking process without human intervention. Furthermore, AI-driven analytics can help businesses optimize fleet utilization, predict demand patterns, and deliver personalized recommendations to customers based on their preferences and rental history.

In response to these challenges and opportunities, this project proposes the development of WeDRIVE, an AI-Assisted Car Rental Management System with Chatbot Support. WeDRIVE is designed as a comprehensive, web-based platform that consolidates all car rental operations into a single, unified system. The platform serves three primary user categories: customers who can browse, book, and manage vehicle rentals through an intuitive interface; administrators who can manage the vehicle fleet, monitor bookings, and generate business reports through a feature-rich dashboard; and guests who can explore available vehicles and pricing information without requiring account registration.

The system distinguishes itself from existing solutions through several innovative features, including an interactive 360-degree vehicle viewer that allows customers to inspect vehicles from all angles before booking, a dual-theme interface supporting both Day and Night modes, bilingual support for English and Bahasa Melayu, and a premium user interface design incorporating modern glassmorphism aesthetics. The integration of AI chatbot technology, powered by OpenRouter.ai (Gemini 2.5 Flash) for the customer chatbot and Google Gemini API for the admin marketing generator, further enhances the system by providing intelligent, context-aware customer assistance.

Figure 1.1 presents a high-level overview of the WeDRIVE system, illustrating the relationship between the main system modules and user types.


Figure 1.1: WeDRIVE System Overview








## Problem Statement(s)
The car rental industry in Malaysia continues to face significant operational and technological challenges that hinder its ability to meet the growing expectations of modern consumers. Despite the increasing demand for vehicle rental services, particularly in tourist-centric states such as Melaka, Penang, and Sabah, many car rental operators — especially small and medium-sized businesses — still rely on outdated, manual-based processes to manage their day-to-day operations. This reliance on conventional methods not only limits the efficiency of business operations but also negatively impacts the overall customer experience. The following three problem statements have been identified as the primary motivations for the development of the WeDRIVE system.

Problem Statement 1: Fragmented and Inefficient Car Rental Management Systems
Many car rental businesses in Malaysia operate using disconnected and manual-based management systems. Fleet information, booking records, customer details, and payment data are often maintained across separate platforms or physical records such as spreadsheets, WhatsApp conversations, and paper logbooks. This fragmentation leads to data inconsistency, duplication of effort, and significant operational inefficiencies. Without a centralised digital platform that integrates all aspects of the business — from vehicle inventory management to customer relationship handling — operators face frequent booking conflicts, delayed responses to customer inquiries, and considerable difficulty in generating accurate business reports for strategic decision-making. The absence of a unified system ultimately results in lost revenue and reduced business competitiveness (Kumar and Singh, 2025).

Problem Statement 2: Poor Customer Experience and Limited Digital Engagement
Traditional car rental services in Malaysia offer limited digital engagement channels for customers. The booking process typically requires customers to make phone calls, send messages through WhatsApp, or visit physical offices to inquire about vehicle availability and complete reservations. This process is time-consuming, restricted to business operating hours, and highly prone to human errors. Customers are unable to view detailed vehicle information, compare available options, or track their booking status in real-time. Furthermore, the absence of 24/7 digital support channels means that customer inquiries made outside business hours go unanswered, leading to potential loss of business opportunities and declining customer satisfaction. The lack of visual vehicle inspection tools, such as 360-degree viewers, further limits the customer's ability to make informed booking decisions (Duong et al., 2025).

Problem Statement 3: Underutilisation of Artificial Intelligence (AI) Technology in Car Rental Services
Despite the rapid advancement of Artificial Intelligence (AI) technologies across the transportation and hospitality sectors globally, the Malaysian car rental industry has been notably slow in adopting AI-driven solutions. Existing systems lack intelligent features such as automated customer support through AI-powered chatbots, personalised vehicle recommendations based on customer preferences and rental history, and data-driven insights for business performance optimisation. The absence of AI integration represents a significant missed opportunity for car rental operators to improve operational efficiency, enhance customer engagement, and gain a competitive advantage in an increasingly digital marketplace. Research by Zhang and Wang (2026) confirms that while AI chatbots are widely adopted in hotels and airlines, their penetration in the car rental sector — particularly in Southeast Asian markets — remains considerably low, highlighting a clear gap that WeDRIVE aims to address.















## Objectives
Based on the problem statements identified, this project aims to achieve the following objectives:
- To analyze the current challenges in car rental management systems in Malaysia and identify functional and non-functional requirements for an improved, integrated solution.
- To design and develop a web-based AI-Assisted Car Rental Management System (WeDRIVE) with integrated chatbot support that provides a unified platform for vehicle browsing, booking management, fleet administration, and customer engagement.
- To evaluate the system's functionality, usability, and AI chatbot effectiveness through comprehensive testing, including unit testing, integration testing, and user acceptance testing.













## Scope
The scope of this project encompasses the following areas:

### System Modules

- Customer Booking Portal: A user-friendly web interface that enables registered customers to browse available vehicles with detailed specifications and 360-degree views, make reservations by selecting dates and add-on services, complete payments through an integrated checkout process, manage their booking history and profile information, and receive booking confirmations with QR codes.

- Admin Dashboard: A comprehensive backend interface that allows system administrators to manage the vehicle fleet (add, edit, delete vehicles and update availability status), monitor and manage all customer bookings, view customer profiles and rental history, generate business reports and analytics (revenue charts, utilization rates), manage marketing campaigns (banners, promo codes, seasonal pricing), configure system settings (company information, tax rates, operating hours), and oversee AI chatbot settings and API configurations.

- AI Chatbot: An intelligent conversational assistant...powered by OpenRouter.ai using the Gemini 2.5 Flash model. The chatbot handles customer inquiries regarding vehicle availability and recommendations, assists with the booking process and provides booking status updates, answers frequently asked questions about rental policies, pricing, and procedures, and operates 24/7 to provide continuous customer support.

- Guest Browsing Interface: A publicly accessible interface that allows potential customers to explore the vehicle fleet and pricing information without requiring account registration. Guest users can view vehicle details, pricing tiers, and explore Melaka attractions, but are redirected to the login page when attempting to make a booking.










### Technical Scope
- Platform: Web-based application accessible through modern web browsers
- Frontend Technologies: HTML5, CSS3, JavaScript (Vanilla)
- Backend/Database: Supabase (PostgreSQL) with Row Level Security
- Authentication: Supabase Auth with email/password and Google OAuth 2.0
- Hosting: Vercel with automatic deployment from GitHub
- AI Integration: Google Gemini API for marketing ai and OpenRouter API for chatbot functionality
- Design: Responsive design with mobile compatibility, dual-theme (Day/Night), bilingual (EN/BM)











### Out of Scope
The following areas are explicitly excluded from the current project scope:
- Real payment gateway integration (demo mode only; future integration with Stripe/Billplz planned)
- Native mobile application development (iOS/Android)
- Real-time GPS vehicle tracking
- Physical key management and IoT vehicle access
- Multi-branch or franchise management
- Integration with external insurance or road tax systems



















## Project Significance
This project carries significance across multiple dimensions:

Academic Significance: The project demonstrates the practical application of software engineering principles, web development technologies, and AI integration in solving a real-world business problem. It serves as a comprehensive case study in full-stack web application development, encompassing requirements analysis, system design, database architecture, and user interface design. The project also explores the integration of modern AI services — OpenRouter.ai for the customer chatbot and Google Gemini API for marketing content generation — into a functional web application., contributing to the academic understanding of AI-enhanced business systems.

Industry Significance: WeDRIVE addresses genuine pain points experienced by car rental businesses in Malaysia. The system provides a scalable, cost-effective solution that small to medium-sized car rental operators can adopt to digitize their operations. By leveraging free-tier cloud services (Supabase, Vercel), the system demonstrates that advanced, AI-powered business solutions can be developed and deployed with minimal infrastructure costs, making digital transformation accessible to smaller businesses.

Technological Significance: The project showcases the use of modern web development approaches, including Backend-as-a-Service (BaaS) architecture with Supabase, serverless deployment on Vercel, and the integration of multiple AI language models for chatbot functionality. The implementation of features such as interactive 360-degree vehicle visualization, glassmorphism UI design, and dual-language support demonstrates the capability of vanilla web technologies to deliver premium, feature-rich applications.

Social Significance: By improving the car rental booking experience, particularly in tourist destinations like Melaka, the system contributes to enhancing the overall tourism experience in Malaysia. The bilingual support ensures accessibility for both English-speaking and Malay-speaking users, promoting inclusivity in digital services.










## Expected Output
Upon completion, this project is expected to produce the following deliverables:

- A fully functional web-based car rental management system (WeDRIVE) deployed at wedrive.website, comprising the Customer Booking Portal, Admin Dashboard, AI Chatbot, and Guest Browsing Interface.
- A responsive, premium user interface featuring glassmorphism design, dual-theme support (Day/Night mode), and bilingual capability (English/Bahasa Melayu), accessible across desktop, tablet, and mobile devices.
- An AI-powered chatbot integrated with OpenRouter.ai (Gemini 2.5 Flash model) for customer support, and Google Gemini API for admin marketing content generation, capable of handling customer inquiries, providing vehicle recommendations, and assisting with the booking process.
- A comprehensive database built on Supabase PostgreSQL, storing vehicle inventory (8 models), customer profiles (5 registered users), booking records (110 bookings), and system configuration data, with Row Level Security (RLS) enforcement.
- An interactive 360-degree vehicle viewer using 200-frame exterior rotation and cubemap interior panorama, enabling customers to inspect vehicles in detail before booking.
- Complete project documentation including this PSM I report (Chapters 1-4), system flowcharts, database schemas, and user interface designs.


## Conclusion
This chapter has provided an introduction to the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE) project. The chapter outlined the background and motivation for the project, identified three key problem statements relating to fragmented management systems, poor customer digital experience, and underutilization of AI technology in the car rental industry. Three corresponding project objectives were defined, along with the detailed scope covering four system modules and the technical architecture. The significance of the project was discussed from academic, industry, technological, and social perspectives, and the expected outputs were enumerated.

The subsequent chapters will elaborate on the project in greater detail. Chapter 2 will present a comprehensive literature review of related works and the project methodology. Chapter 3 will provide a detailed analysis of system requirements. Chapter 4 will describe the system design, including architecture, user interface, and database design.




# literature review AND PROJECT METHODOLOGY
## Introduction
This chapter presents a comprehensive review of the literature related to the development of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The chapter is organized into several key sections that collectively provide the theoretical and practical foundation for the project.

Section 2.2 discusses the facts and findings gathered through research, covering three main areas: the domain of car rental management systems and the current state of the industry, an analysis of existing car rental platforms in Malaysia, and the techniques and technologies applicable to the project. Section 2.3 describes the selected project methodology, explaining the Agile (Iterative) approach adopted for the development process. Section 2.4 details the project requirements, including software, hardware, and other resources needed. Finally, Section 2.5 presents the project schedule and milestones through a Gantt chart, outlining the planned activities and their timelines across the PSM I and PSM II phases.



## Facts and Findings
### Domain
Car Rental Industry in Malaysia
The car rental industry in Malaysia is a vital component of the nation's transportation and tourism sectors. With Malaysia attracting over 26 million tourists annually (Tourism Malaysia, 2024) and a growing domestic travel culture, the demand for flexible, short-term vehicle rental services has steadily increased. Major tourist destinations such as Melaka, Penang, Langkawi, and Sabah have particularly high demand for car rental services, as public transportation options in these areas may be limited.

Traditionally, car rental businesses in Malaysia have operated through a combination of walk-in offices, phone bookings, and basic websites. Many small and medium-sized operators still manage their fleets using spreadsheets, WhatsApp communication, and manual record-keeping. While larger companies such as Hertz, Avis, and Europcar have established digital booking platforms, the majority of local car rental businesses lack comprehensive digital management solutions (Kumar and Singh, 2025).




AI in the Transportation and Hospitality Sector
The integration of Artificial Intelligence (AI) into transportation and hospitality services has accelerated significantly in recent years. AI technologies, particularly chatbots and recommendation systems, have demonstrated substantial benefits in enhancing customer engagement, reducing operational costs, and improving service personalization (Adamopoulou and Moussiades, 2020).

In the context of car rental services, AI can be applied in several key areas. First, AI chatbots can provide instant responses to customer inquiries regarding vehicle availability, pricing, and booking procedures, operating 24/7 without human intervention (Nguyen and Do, 2026). Second, AI-driven recommendation engines can suggest suitable vehicles based on customer preferences, trip requirements, and historical data (Rybo AI, 2024). Third, AI-powered analytics can help operators optimize fleet utilization, predict demand patterns, and adjust pricing strategies dynamically (Gupta, 2024).

Research by Zhang and Wang (2026) on the landscape of AI chatbot adoption in tourism and hospitality reveals that while AI chatbots are widely used in hotels and airlines, their adoption in the car rental sector remains relatively low, particularly in Southeast Asian markets. This gap presents an opportunity for innovation, which the WeDRIVE project aims to address.

Web-Based Management Systems
Modern web-based management systems have evolved beyond simple informational websites to become comprehensive business platforms. The adoption of cloud computing and Backend-as-a-Service (BaaS) platforms such as Supabase, Firebase, and AWS Amplify has significantly lowered the barrier to developing full-featured web applications (Agentive AI, 2024). These platforms provide integrated services including database management, user authentication, file storage, and real-time data synchronization.

For the car rental domain, a web-based management system offers several advantages over desktop applications or manual processes: accessibility from any device with a web browser, real-time data synchronization across all users, lower deployment and maintenance costs, and the ability to scale resources based on demand (AirentoSoft, 2024).






### Existing System
To inform the design and development of WeDRIVE, three existing car rental platforms operating in Malaysia were analyzed. These systems were selected to represent different approaches to car rental management: SOCAR as a mobile-first car-sharing platform, GoCar as a comprehensive mobility ecosystem, and KAYAK as a metasearch comparison engine.













SOCAR (socar.my)
SOCAR is a leading car-sharing platform in Malaysia that operates primarily through a mobile application. Founded in 2017, SOCAR provides on-demand car rental services across major cities in Malaysia, including Kuala Lumpur, Selangor, Penang, and Johor Bahru.

Key Features:
- Mobile-first approach with iOS and Android applications
- Keyless vehicle access using Bluetooth technology via the app
- Hourly, daily, weekly, and monthly rental options with a minimum 30-minute booking
- Over 30 different car models available
- SOCAR-2-YOU delivery service and SOCAR+ personal driver service
- 24-hour live chat customer support



Strengths:
- Seamless mobile experience with keyless access eliminates the need for physical key handover
- Flexible rental durations from as short as 30 minutes
- Wide geographic coverage across Malaysia
- Integrated live chat support for real-time assistance

Limitations:
- Heavily reliant on mobile app; limited web browser functionality
- No AI-powered chatbot or intelligent recommendations
- No 360-degree vehicle preview before booking
- Limited administrative tools for fleet operators



Figure 2.2.2.1: SOCAR Mobile Application Interface






GoCar (gocar.my)
GoCar is a comprehensive on-demand mobility platform in Malaysia that extends beyond traditional car rental to offer a full ecosystem of automotive services. GoCar's platform includes car sharing, car subscription, vehicle maintenance (GoCar Garage), and insurance services (GoInsuran).

Key Features:
- On-demand car sharing available 24/7 with rent-by-minute, hour, or day options
- GoCar Subs subscription service as an alternative to car ownership
- GoCar Garage integrated car servicing and repair platform
- GoInsuran insurance renewal service (within 3 minutes)
- Zero human interaction booking process via mobile app
- Collision Damage Waiver (CDW) and FLEX insurance packages

Strengths:
- Comprehensive ecosystem covering multiple automotive needs
- Flexible subscription model as an alternative to ownership
- Well-designed zero-touch booking experience

Limitations:
- Complex service offering may overwhelm new users
- No AI-driven customer support or chatbot integration
- No interactive vehicle preview (360-degree viewer)
- Pricing model can be complex with multiple add-on packages


Figure 2.2.2.2: GoCar Website Interface









KAYAK (kayak.com.my)
KAYAK is a global travel metasearch engine that aggregates car rental deals from hundreds of different travel sites and rental providers. Unlike SOCAR and GoCar, KAYAK does not own or operate a vehicle fleet; instead, it functions as a comparison platform.

Key Features:
- Metasearch engine aggregating deals from multiple providers
- Advanced filtering by vehicle type, rental company, fuel policy, and special features
- One-way rental search capability
- AI Mode for natural language travel queries and personalized recommendations

Strengths:
- Excellent price comparison across multiple providers
- AI Mode provides some level of intelligent assistance
- Broad international coverage

Limitations:
- No direct booking or fleet management capabilities
- Redirects users to external providers for actual booking
- No admin dashboard for fleet operators
- No 360-degree vehicle viewer



Figure 2.2.2.3: KAYAK Car Rental Search Interface




Table 2.1: Comparison of Existing Car Rental Systems

The comparison reveals that while existing platforms such as SOCAR and GoCar excel in mobile-first car-sharing experiences with IoT-enabled keyless access, they lack AI-powered customer support, interactive vehicle previews, and accessible fleet management tools for small operators. WeDRIVE aims to fill this gap by providing a comprehensive, web-based solution with integrated AI chatbot support, 360-degree vehicle visualization, and a full administrative dashboard accessible to small and medium-sized car rental operators.





### Technique
Frontend Web Technologies (HTML5, CSS3, JavaScript)
The WeDRIVE frontend is built using vanilla HTML5, CSS3, and JavaScript without relying on heavy frontend frameworks such as React, Vue, or Angular. This approach was chosen for several reasons: it reduces dependency on external libraries, ensures faster page load times, provides greater control over the application's behavior and appearance, and simplifies the development and maintenance process for a project of this scale.

HTML5 provides the semantic structure for all pages, CSS3 handles styling including responsive layouts, animations, glassmorphism effects, and dual-theme support, while JavaScript manages all dynamic functionality including API interactions, DOM manipulation, and client-side routing (MDN Web Docs, 2024).






Backend-as-a-Service: Supabase
Supabase is an open-source Backend-as-a-Service (BaaS) platform that provides a suite of backend tools built on top of PostgreSQL. For the WeDRIVE project, Supabase was selected over alternatives such as Firebase for several reasons:
- PostgreSQL Database: Supabase uses PostgreSQL, a powerful relational database that supports complex queries, transactions, and data integrity constraints, making it more suitable for a system with relational data.
- Row Level Security (RLS): Supabase's RLS feature allows fine-grained access control at the database level, ensuring that users can only access data they are authorized to view or modify.
- Built-in Authentication: Supabase Auth provides email/password and OAuth (Google) authentication with JWT token management.
- Open Source: Unlike Firebase, Supabase is fully open-source, avoiding vendor lock-in.
- REST API: Supabase automatically generates RESTful APIs for all database tables, simplifying frontend-backend communication (Supabase Documentation, 2024).






AI Chatbot Integration
The WeDRIVE AI chatbot utilizes a dual-model architecture with automatic failover:
- Primary Model - OpenRouter.ai (Gemini 2.5 Flash): OpenRouter.ai serves as the AI gateway for the customer chatbot, routing queries to the Gemini 2.5 Flash model for fast and accurate responses.
- Marketing AI - Google Gemini API (gemini-2.5-flash): The admin marketing content generator connects directly to the Google Gemini API to generate promotional content, campaign ideas, and marketing copy.

The chatbot is configured through the admin dashboard, where administrators can set system prompts, promotional context, greeting messages, and API keys. This architecture ensures high availability and allows the business to customize the chatbot's personality and knowledge base (Ali and Rahman, 2025).







360-Degree Vehicle Visualization
WeDRIVE implements an interactive 360-degree vehicle viewer using a frame-sequence approach. Each vehicle is represented by 200 high-resolution photographs taken at evenly spaced angles around the vehicle. As the user drags or swipes across the viewer, the system dynamically loads and displays the corresponding frame, creating a smooth rotation effect. Interior views are rendered using a cubemap panorama technique with six directional images processed through Three.js, a JavaScript 3D rendering library.



Deployment and Hosting
The application is deployed using Vercel, a cloud platform optimized for frontend applications. Vercel integrates directly with the project's GitHub repository, enabling automatic deployment whenever code changes are pushed to the main branch. This continuous deployment approach aligns with the Agile methodology adopted for the project, supporting rapid iteration and feedback cycles.




## Project Methodology
The development of WeDRIVE follows the Agile (Iterative) methodology within the Software Development Life Cycle (SDLC) framework. The Agile approach was selected over traditional Waterfall methodology for several reasons:

- Incremental Development: The project involves multiple interconnected modules (Customer Portal, Admin Dashboard, AI Chatbot, Guest Interface) that benefit from incremental development and testing, allowing each module to be built, tested, and refined independently before integration.
- Flexibility for Change: Requirements for AI chatbot behavior, UI design preferences, and feature priorities may evolve as the project progresses. Agile's iterative nature accommodates these changes without disrupting the overall project timeline.
- Continuous Feedback: The iterative approach allows for regular feedback from the supervisor and potential users, enabling course corrections and improvements throughout the development process.
- Version Control Integration: The project uses GitHub for version control with structured version numbering (Major.Minor.Patch), which naturally aligns with Agile sprint deliverables and iterative releases.



Figure 2.4: Agile (Iterative) SDLC Model

The Agile methodology for this project is structured into the following iterative phases:

Phase 1: Requirements Gathering and Analysis (PSM I)
- Identify stakeholders and their needs
- Define functional and non-functional requirements
- Analyze existing systems and identify gaps
- Document problem statements and project objectives

Phase 2: System Design (PSM I)
- Design system architecture and database schema
- Create user interface wireframes and mockups
- Define API structure and data flow diagrams
- Plan the module hierarchy and navigation flow

Phase 3: Implementation - Iteration 1: Core Modules (PSM II)
- Develop the landing page and authentication system (login, signup, forgot password)
- Implement the customer dashboard and vehicle browsing functionality
- Build the admin dashboard with basic fleet management
- Set up database tables and API integration

Phase 4: Implementation - Iteration 2: Advanced Features (PSM II)
- Develop the booking flow (vehicle selection, date picker, payment, confirmation)
- Implement the AI chatbot with OpenRouter integration and admin marketing AI with Gemini API
- Build the 360-degree vehicle viewer
- Develop marketing management and calendar overview modules

Phase 5: Implementation - Iteration 3: Polish and Enhancement (PSM II)
- Implement responsive design and mobile optimization
- Add dual-theme (Day/Night) and bilingual (EN/BM) support
- Integrate email notification services
- Develop reporting and analytics features

Phase 6: Testing and Deployment (PSM II)
- Conduct unit testing for individual modules
- Perform integration testing across modules
- Execute user acceptance testing (UAT)
- Deploy to production (Vercel) with custom domain
- Prepare final documentation and user manual




















## Project Requirements
### Software Requirements
Table lists the software tools and technologies required for the development, testing, and deployment of the WeDRIVE system.

Table 2.2: Software Requirements

















### Hardware Requirement
Table 2.3 lists the hardware requirements for development and testing.

Table 2.3: Hardware Requirements














### Other Requirement
- Supabase Account: Free-tier Supabase account for PostgreSQL database, authentication, and edge functions (500MB database, 1GB storage, unlimited API requests).
- Vercel Account: Free-tier Hobby plan account for hosting and automatic deployment from GitHub repository.
- Google Cloud Console Account: For obtaining Google OAuth 2.0 client credentials (Google Sign-In integration) and Google Gemini API key for the admin marketing content generator.
- OpenRouter.ai Account: For obtaining OpenRouter API key for the customer AI chatbot module (routes queries to Gemini 2.5 Flash model).
- GitHub Account: For version control, code repository management, and Vercel integration.
- Domain Name: wedrive.website domain for production deployment.
- Resend Account: Free-tier account for transactional email delivery (booking confirmations, reminders).







## Project Schedule and Milestones
The project is planned across two semesters: PSM I (Semester 6, Session 2025/2026) and PSM II (Semester 7, Session 2025/2026). The schedule follows the Agile iterative methodology, with each iteration producing a working increment of the system.


Figure 2.5: Gantt Chart







## Conclusion
This chapter has presented a comprehensive literature review covering the car rental industry domain, existing systems analysis, and the techniques and technologies applicable to the WeDRIVE project. The analysis of three existing platforms (SOCAR, GoCar, and KAYAK) revealed key gaps in AI-powered customer support, interactive vehicle visualization, and accessible fleet management tools for small operators, which WeDRIVE aims to address.

The Agile (Iterative) methodology was selected as the project development approach, offering flexibility, incremental delivery, and continuous improvement capabilities that align well with the project's multi-module architecture. The project requirements, including software, hardware, and other resources, were documented, and a detailed project schedule was presented with milestones spanning both PSM I and PSM II semesters.

The next chapter will present a detailed analysis of the system requirements, including problem analysis, data requirements, functional requirements, and non-functional requirements.








# ANALYSIS
## Introduction
This chapter presents a detailed analysis of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The analysis phase is a critical component of the software development process, serving as the bridge between the requirements identified in the literature review and the system design that follows.

Section 3.2 conducts a thorough problem analysis, examining the current car rental process and its inefficiencies, and contrasts it with the proposed WeDRIVE solution. Section 3.3 provides a comprehensive requirement analysis covering data requirements, functional requirements (illustrated through Context Diagrams and Data Flow Diagrams), non-functional requirements, and other supporting requirements. The chapter concludes with a summary of the analysis findings and their implications for the system design phase.










## Problem Analysis
### Current System Scenario
The current car rental process in Malaysia, particularly among small to medium-sized operators, follows a predominantly manual workflow. Through investigation and analysis, the following typical scenario has been identified:

- Customer Inquiry: A customer contacts the car rental company via phone call, WhatsApp message, or by visiting the physical office. The customer asks about vehicle availability for specific dates, vehicle types, and pricing.
- Manual Availability Check: The rental operator manually checks their records, which may be stored in Excel spreadsheets, physical logbooks, or basic calendar applications, to determine vehicle availability for the requested dates. This process is prone to errors, particularly when multiple staff members are managing bookings simultaneously.
- Quotation and Negotiation: The operator provides a verbal or text-based quotation to the customer. Pricing may be inconsistent as it depends on the operator's memory of current rates, any ongoing promotions, or seasonal adjustments.
- Booking Confirmation: If the customer agrees to the quotation, the booking is recorded manually. A deposit may be collected via bank transfer, and confirmation is communicated via WhatsApp or phone call. There is no standardized booking reference system.
- Vehicle Handover: On the pickup date, the customer visits the rental location. Vehicle inspection and documentation are completed manually, often with paper-based forms.
- Return and Settlement: Upon vehicle return, the final payment is calculated manually, accounting for rental duration, fuel charges, and any damages. Receipts may or may not be issued systematically.

Figure 3.1: Current Car Rental Process - Manual Flowchart


### Problems Identified in the Current Process
- Lack of Real-Time Availability Information: Customers cannot view vehicle availability in real-time, leading to frustrating back-and-forth communication and potential booking conflicts when multiple customers inquire about the same vehicle simultaneously.
- Absence of Visual Vehicle Information: Customers make booking decisions based on limited information, typically a few static photos or verbal descriptions. They cannot inspect vehicle condition, interior quality, or detailed specifications before committing to a booking.
- No Centralized Data Management: Business data (vehicles, bookings, customers, payments) is scattered across multiple formats and locations, making it difficult to generate accurate reports, track performance metrics, or identify business trends.
- Limited Operating Hours: Customer support and booking services are restricted to business operating hours, resulting in lost potential bookings from customers who wish to make reservations outside these hours, particularly international tourists in different time zones.
- Manual Error Prone Processes: Manual data entry and record-keeping increase the likelihood of errors such as double bookings, incorrect pricing, and lost customer information.
- No Data-Driven Decision Making: Without centralized analytics, operators cannot easily assess fleet utilization rates, identify popular vehicles, determine peak booking periods, or evaluate the effectiveness of marketing campaigns.

### Proposed Solution: WeDRIVE System
WeDRIVE addresses each of these problems through its integrated, web-based platform:

Table 3.1: Proposed Solution


Figure 3.2: Proposed Car Rental Process (WeDRIVE) – Flowchart
## Requirement Analysis
### Data Requirement
The WeDRIVE system requires the management of several interconnected data entities. The following data dictionaries define the structure and attributes of the primary data entities in the system.

Table 3.2: Data Dictionary - Cars Table


Table 3.3: Data Dictionary - Bookings Table


Table 3.4: Data Dictionary - Customers Table

Additional Data Entities:
- Admins Table: Stores administrator account information (email, role), used to determine admin access during login.
- Marketing Data: Stores banner advertisements, promotional codes, and seasonal pricing adjustments. Currently managed through localStorage with database persistence planned.
- Config/Settings: Stores system configuration including company information, tax rates, deposit policies, operating hours, and pickup locations.







### Functional Requirement
The functional requirements of WeDRIVE are illustrated through a hierarchical set of diagrams: Context Diagram, Data Flow Diagram (DFD) Level 0, and DFD Level 1.

Context Diagram
The context diagram shows the WeDRIVE system as a single process and its interactions with external entities.


Figure 3.3: Context Diagram
The system interacts with four external entities:
- Customer: Registers account, browses vehicles, makes bookings, views booking history, uses AI chatbot, manages profile.
- Administrator: Manages vehicles, manages bookings, manages customers, views reports, configures settings, manages marketing, configures AI chatbot.
- Guest: Browses vehicles, views pricing, uses AI chatbot (limited), redirected to login for booking.
- AI Service Provider (OpenRouter/Gemini): Receives AI requests from the system — OpenRouter.ai handles customer chatbot queries via Gemini 2.5 Flash, while Google Gemini API directly powers the admin marketing content generator..












Data Flow Diagram Level 0
The DFD Level 0 provides a more detailed view of the major processes within the WeDRIVE system.


Figure 3.3.4: Data Flow Diagram Level 0
The major processes identified are:
- P1 - Authentication Process: Handles user registration, login (email/password and Google OAuth), session management, and role-based access control.
- P2 - Vehicle Management Process: Manages the vehicle fleet including adding, editing, deleting vehicles, updating availability status, and providing vehicle data for browsing.
- P3 - Booking Management Process: Handles the complete booking lifecycle from vehicle selection through date selection, payment processing, booking confirmation, and status tracking.
- P4 - Customer Management Process: Manages customer profiles, booking history, and document verification.
- P5 - AI Chatbot Process: Processes customer queries, generates AI-powered responses via OpenRouter.ai (Gemini 2.5 Flash model), and provides vehicle recommendations.
- P6 - Reporting and Analytics Process: Generates business reports including revenue charts, fleet utilization rates, and booking statistics.
- P7 - Marketing Management Process: Manages promotional banners, discount codes, and seasonal pricing adjustments.




Data Flow Diagram Level 1
The DFD Level 1 decomposes each Level 0 process into sub-processes, providing detailed data flow information.


Figure 3.3.5: Data Flow Diagram Level 1

Table 3.5: Functional Requirements Summary
### Non-functional Requirement:
Table 3.6 documents the non-functional requirements that define the quality attributes of the WeDRIVE system.

Table 3.6: Non-functional Requirements














### Other Requirement
Development Environment Requirements:
- A stable internet connection is required for accessing Supabase cloud services, Vercel deployment, and AI API calls.
- Visual Studio Code with Live Server extension for local development and testing.
- Git and GitHub for version control and collaborative development.

Operational Requirements:
- System administrators must have basic technical knowledge to manage vehicle listings, configure chatbot settings, and interpret business reports.
- Regular database backups should be scheduled through Supabase's built-in backup functionality.
- AI API keys (OpenRouter API key for the customer chatbot, Google Gemini API key for the admin marketing generator) must be kept confidential and stored securely in the admin settings panel.

User Training Requirements:
- A user manual shall be provided as an appendix to the final report (PSM II).
- The system shall incorporate intuitive UI design with clear navigation to minimize the learning curve.
- Tooltips and helper text shall be provided for complex form inputs.

## Conclusion
This chapter has presented a comprehensive analysis of the WeDRIVE system requirements. The problem analysis revealed six key inefficiencies in the current manual car rental process and demonstrated how WeDRIVE's integrated platform addresses each of these issues. The requirement analysis documented the data requirements through detailed data dictionaries for the three primary entities (Cars, Bookings, Customers), defined 24 functional requirements organized by module and priority, established 14 non-functional requirements covering performance, security, usability, and maintainability, and identified additional development and operational requirements.

The analysis confirms that WeDRIVE's proposed feature set comprehensively addresses the problem statements identified in Chapter 1. The documented requirements provide a solid foundation for the system design phase, which is presented in the next chapter. Chapter 4 will translate these requirements into a concrete system architecture, user interface design, and database design.




# DESIGN
## Introduction
This chapter presents the system design for the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE). The design phase translates the requirements documented in Chapter 3 into a concrete technical blueprint that guides the implementation phase. The design decisions outlined in this chapter reflect best practices in modern web application development, prioritizing modularity, scalability, and user experience.

Section 4.2 covers the high-level design, including the overall system architecture, user interface design with navigation, input, and output considerations, and the database design encompassing both conceptual and logical models. Section 4.3 presents the detailed design, breaking down the software architecture into modules and defining the physical database schema. The chapter concludes with a summary of the design decisions and their alignment with the project objectives.






## High-Level Design
### System Architecture
The WeDRIVE system adopts a client-server architecture utilizing a Backend-as-a-Service (BaaS) model. This architecture separates the presentation layer (frontend) from the data and business logic layer (backend), enabling independent development and deployment of each component.

Architecture Overview
The system architecture consists of four primary layers:
- Presentation Layer (Frontend): Built with vanilla HTML5, CSS3, and JavaScript, the frontend runs entirely in the user's web browser. It is responsible for rendering the user interface, handling user interactions, and communicating with the backend through API calls. The frontend is organized into four modules: Guest, Account (Authentication), Customer, and Admin.
- Application Layer (API): Supabase provides an automatically generated RESTful API for all database tables. The shared/js/api.js file serves as the centralized API configuration module, abstracting all data operations and providing a unified interface (window.WeDriveAPI) for all frontend modules to access backend services.
- Service Layer (External Services): Several external services are integrated into the system: Supabase Auth (authentication), Supabase Storage (file uploads), OpenRouter.ai API (customer AI chatbot, model: Gemini 2.5 Flash), Google Gemini API (admin marketing content generator), and Resend API (email delivery).
- Data Layer (Database): PostgreSQL database hosted on Supabase (Singapore region, ap-southeast-1) stores all persistent application data including vehicles, bookings, customers, admins, and system configuration. Row Level Security (RLS) policies enforce data access control at the database level.


Figure 4.1: System Architecture Diagram







Deployment Architecture
The deployment architecture leverages cloud services to minimize infrastructure management overhead:
- Frontend Hosting: Vercel (vercel.com) hosts the static frontend files with global CDN distribution. Automatic deployment is triggered on every push to the GitHub main branch.
- Backend Services: Supabase (supabase.com) provides PostgreSQL database, authentication, storage, and edge functions as managed cloud services.
- Domain: The custom domain wedrive.website points to the Vercel deployment.
- Version Control: GitHub repository (github.com/hdanial211/WeDRIVE) manages source code with structured versioning (Major.Minor.Patch format).


Figure 4.2: Deployment Architecture
The deployment flow follows a continuous deployment model: Developer commits code → GitHub Repository → Vercel auto-deploys → wedrive.website updated. This architecture supports the Agile methodology by enabling rapid iteration and deployment of changes.
### User Interface Design
The WeDRIVE user interface is designed following modern web design principles, drawing inspiration from premium platforms such as Airbnb (booking flow), Stripe (glassmorphism and micro-animations), Apple (typography and whitespace), Linear (dark mode), and Vercel (minimalist dashboard). The interface prioritizes clarity, accessibility, and visual consistency across all user modules.


Design Principles
The following core design principles were applied throughout the WeDRIVE interface:
Premium Aesthetics: The system adopts glassmorphism design patterns, incorporating frosted-glass effects with semi-transparent backgrounds, smooth gradient accents, and subtle micro-animations. These elements collectively deliver a visually premium user experience that differentiates WeDRIVE from conventional car rental platforms.
Dual-Theme Support: WeDRIVE provides both Day Mode (light theme) and Night Mode (dark theme) to accommodate different user preferences and lighting conditions. The themes are implemented through separate CSS files (theme_day.css and theme_night.css), and the user's selected preference is automatically saved and restored via localStorage across sessions.
Responsive Design: All pages are built with a fully responsive layout that adapts seamlessly across three breakpoints — desktop (1200px and above), tablet (768px to 1100px), and mobile (below 768px). On smaller screens, the sidebar navigation collapses into a hamburger menu to preserve usable screen space.
Bilingual Support: The system supports dynamic language switching between English and Bahasa Melayu without requiring a page reload. Translation is managed through JSON language files (en.json and ms.json), with all text elements linked to their corresponding translation keys via data-key attributes in the HTML markup.
Consistent Typography: The Inter font family (loaded via Google Fonts) is used uniformly across all pages to maintain a clean and modern typographic appearance throughout the system.

Navigation Design
The navigation structure of WeDRIVE differs based on the user module being accessed. Guest users are presented with a top navigation bar, while authenticated Customer and Admin users navigate through a persistent sidebar. Authentication pages (login, register, forgot password) are standalone self-contained pages with no navigation component, as they are accessed before a session is established. Table 4.1 summarises the navigation component used for each module.

Table 4.1: Navigation Component

Figure 4.3 illustrates the complete navigation flow across all three user types, showing the pathways available from the landing page through to each module's internal pages.



Figure 4.3: Navigation Flow Diagram








Input Design
Input interfaces in WeDRIVE are designed to minimise user effort and reduce the likelihood of input errors. The following subsections describe the key input interfaces implemented in the system.

i. Authentication — Landing and Welcome Page


Figure 4.4: Landing Page

When a user first visits WeDRIVE, they are presented with a Landing Page that introduces the platform. From here, users may choose to log in, register, or continue browsing as a guest. Figure 4.5 illustrates the welcome page interface.

Figure 4.5: Welcome Page










ii. Authentication — Login and Registration
The login interface provides two authentication methods: email and password entry, and single-click sign-in via Google OAuth 2.0. The form includes auto-fill support and real-time validation feedback. For new users, the registration flow collects basic account information before redirecting to a profile completion step. Figures 4.6 and 4.7 illustrate the login form and Google OAuth authenticator respectively.


Figure 4.6: Login Form

Figure 4.7: Register Form



Figure 4.8: Authenticator Google
iii. Authentication — Two-Factor Authentication (2FA)
To enhance account security, WeDRIVE supports two-factor authentication (2FA). Upon login, users who have enabled this feature are prompted to enter a verification code. Figure 4.9 & Figure 4.10 shows the 2FA verification interface.


Figure 4.9: 2FA

Figure 4.10: Google 2FA






iv. Authentication — Username & Document Upload Setup
During profile completion, customers are required to select a unique username. The system performs a real-time availability check and provides immediate feedback indicating whether the entered username is available or already taken. Figures 4.11 to 4.14 illustrate both outcomes of this check.


Figure 4.11: Check Available Username


Figure 4.12: Username Already Taken


Figure 4.13: Username is Available

Figure 4.14: Document Upload














v. Authentication — Password Reset
Customers who have forgotten their password can initiate a reset through the Forgot Password page. The system sends a reset link to the registered email address. Figures 4.16 through 4.17 illustrate the complete password reset flow from request to email receipt.


Figure 4.15: Reset Password


Figure 4.16: Send Reset Password to Email


Figure 4.17: Receive Reset Password Email






vi. Authentication — Account Verification
New customer accounts require email verification before full access is granted. The system displays a pending verification notice after registration, and the account status is updated once the verification link is clicked. Figures 4.21 and 4.24 show the verified and unverified account states respectively.

Pending

Figure 4.18: Wait for Verified Account






Verified Account

Figure 4.19: Admin Approve Account - Step 1


Figure 4.20: Notification Account Verified In Email - Step 2


Figure 4.21: Account Verified - Step 3










Unverified Account


Figure 4.22:Admin Reject Account - Step 1



Figure 4.23: Notification Account Unverified In Email - Step 2


Figure 4.24: Account Unverified - Step 3


Figure 4.25: Reupload Account Unverified - Step 4

vii. Booking Form
The booking input interface guides customers through the rental process in a structured multi-step flow. Customers first select their preferred pickup and return dates using the Flatpickr date picker, which automatically calculates the rental duration and total cost. Optional add-ons including GPS navigation, child seat, and insurance coverage can be selected via checkboxes. The subsequent step captures payment information to complete the reservation. Figures 4.26 to Figure 4.37 illustrate the booking interface across both steps.


Figure 4.26: Booking Flow Interface — Part 1


Figure 4.27: Booking Flow Interface — Part 2



Figure 4.28: Pick Date Available — Part 1



Figure 4.29: Continue Booking — Part 2



Figure 4.30: Checkout — Part 3


Figure 4.31: Add Extra Item — Part 3


Figure 4.32: Complete Information Driver— Part 4


Figure 4.33: Complete Payment Method— Part 4


Figure 4.34: Choose Full Payment— Part 5


Figure 4.35: Choose Deposit Payment Only— Part 6


Figure 4.36: Car Already Wait To Collect— Part 7


Figure 4.37: Car Already Handovers & Pickups — Part 8

viii. Admin — Add/Edit Vehicle Form
The Admin Car Management interface provides a comprehensive form for adding and editing vehicle records. Input fields include vehicle name, registration plate number, vehicle type, fuel type, transmission, seating capacity, daily rental rate, availability status, and vehicle image upload. Figure 4.38 illustrates the Add New Car form interface.


Figure 4.38: Admin Car Management — Add New Car









ix. AI Chatbot Input
The AI Chatbot is accessible from all customer-facing and guest pages via a floating chat button. The input interface consists of a free-text message field and a send button, allowing users to submit natural language queries. The chatbot processes the input and returns a contextually relevant response powered by OpenRouter.ai using the Gemini 2.5 Flash model. Figure 4.39 and Figure 4.40 illustrates the chatbot input interface.


Figure 4.39: AI Chatbot In Customer Dashboard


Figure 4.40: AI Chatbot In Guest Dashboard




















Output Design
Output interfaces in WeDRIVE are designed to present information clearly and efficiently, ensuring users can act on the data presented without confusion. The following subsections describe the primary output interfaces across all modules.

i. Guest Interface — Landing, Explore and How It Works

The landing page serves as the primary entry point for all users, presenting an overview of the WeDRIVE platform, featured vehicles, and a call-to-action for registration or login. The Explore Melaka page showcases tourist attractions in Melaka to encourage car rental bookings in the region. The How It Works page provides a step-by-step guide to the booking process for new users. Figures illustrate these pages respectively.


Figure 4.41: Landing Page (Guest View) – Page 1




Figure 4.42: Landing Page (Guest View) – Page 2


Figure 4.43: Landing Page (Guest View) – Page 3


Figure 4.44: Explore Melaka – Page 1


Figure 4.45: Explore Melaka – Page 2


Figure 4.46: Explore Melaka – Page 3


Figure 4.47: Explore Melaka – Page 4


Figure 4.48: How It Works – Welcome Page


Figure 4.49: How It Works – Page 1

Figure 4.50: How It Works – Page 2


Figure 4.51: How It Works – Page 3


Figure 4.52: How It Works – Page 4


Figure 4.53: How It Works – Page 5


Figure 4.54: How It Works – Page 6


Figure 4.55: How It Works – Page 7



Figure 4.56: How It Works – Page 8













ii. Vehicle Details and 360-Degree Viewer
The Car Details page presents comprehensive vehicle specifications including model name, fuel type, transmission, seating capacity, daily rate, and a list of included features. The page also integrates the interactive 360-degree vehicle viewer, which renders 200 high-resolution exterior frames in a draggable canvas, allowing customers to rotate and inspect the vehicle from any angle. An interior panorama viewer using a cubemap rendered through Three.js provides an immersive interior preview. Figures 4.57 (Exterior) and 4.58 (Interior) illustrate both viewer modes.


Figure 4.57: Car Details Page with 360-Degree Viewer — Exterior

Figure 4.58: Car Details Page with 360-Degree Viewer — Interior














iii. Customer Dashboard and Booking History
The Customer Dashboard serves as the central hub for registered users after login. It presents a personalised welcome message, quick-access navigation cards, and an overview of recent booking activity. The My Bookings section displays all past and active reservations with their current status, booking reference, and rental details. Figures 4.4 to 4.61 illustrate the customer dashboard and booking history views respectively.


Figure 4.59: Customer Dashboard – Page 1



Figure 4.60: Customer Dashboard – Page 2


Figure 4.61: My Bookings Customer


iv. Customer Profile Settings
The Profile Settings section allows customers to manage their personal information across multiple subsections. The Personal Info tab enables editing of full name, phone number, IC number, and driving license details. The Security tab handles password changes and 2FA configuration. The Card tab manages saved payment methods. The Preferences tab provides options for notification preferences and individual settings, with a double-confirmation prompt for critical changes. The Notification Settings tab controls communication preferences. Figures 4.62 through 4.71 illustrate each settings subsection.


Figure 4.62: Personal Info Setting – Page 1

Figure 4.63: Personal Info Setting – Page 2


Figure 4.64: Personal Info Setting – Double Confirmation Page


Figure 4.65: Security Info Setting


Figure 4.66: Security Info Setting - Double Confirmation Page


Figure 4.67: Card Setting


Figure 4.68: Preferences Individual Setting


Figure 4.69: Preferences Individual Setting - Double Confirmation Page


Figure 4.70: Notification Setting


Figure 4.71: Notification Setting - Double Confirmation Page














v. Email Notifications
WeDRIVE sends automated email notifications at key stages of the booking lifecycle via the Resend email service. Customers receive a deposit payment receipt upon initial booking confirmation, and a full payment receipt upon completion of the rental. Figures 4.72 and 4.73 illustrate the email templates for deposit and full payment receipts respectively.


Figure 4.72: Email — Deposit Payment Receipt


Figure 4.73: Email — Full Payment Receipt








vi. Admin Dashboard
The Admin Dashboard provides a real-time operational overview of the WeDRIVE platform. Stats cards at the top display key metrics including total vehicles in the fleet, number of active rentals, revenue generated today, and new customer registrations. Below the stats cards, a table shows the current status of each vehicle, and quick-action cards provide navigation shortcuts to the most frequently used admin functions. Figure 4.74 illustrates the Admin Dashboard interface.


Figure 4.74: Admin Dashboard







vii. Admin Booking Management
The Booking Management interface presents a complete list of all customer bookings with filtering and search capabilities. Administrators can view booking details, update booking status (confirm, activate, complete, or cancel), and access the associated customer and vehicle records. Figure 4.X illustrates the Admin Booking Management interface.


Figure 4.75: Admin Booking Management








viii. Reports and Analytics
The Reports module presents business performance data in a visual format. Revenue trends are displayed as CSS-rendered bar charts segmented by month, while fleet utilisation rates are shown as percentage indicators per vehicle. This allows administrators to identify high-demand periods, underperforming assets, and overall business trends at a glance. Figure 4.76 illustrates the Report Management interface.


Figure 4.76: Report Management









ix. Admin Calendar Overview
The Calendar Overview provides a monthly calendar view annotated with booking indicators, allowing administrators to visualise booking density across the fleet for any given period. Figures 4.77 and 4.78 illustrate the calendar dashboard and a detailed day-view respectively.

Figure 4.77: Dashboard Calendar Admin

Figure 4.78: Check Calendar Admin
x. Marketing Management
The Marketing module enables administrators to create and manage promotional content across three subsections. The Banner Management section allows creation of homepage promotional banners. The Promo Codes section supports discount code generation with configurable value and expiry. The Seasonal Pricing section allows dynamic rate adjustments for peak and off-peak periods. WeDRIVE also integrates an AI-assisted marketing tool that uses the configured chatbot to generate promotional content and campaign ideas. Figures 4.79 through 4.85 illustrate each marketing subsection and the AI-assisted content generation flow.


Figure 4.79: Dashboard Marketing — Banner


Figure 4.80: Dashboard Marketing — Promo Codes


Figure 4.81: Dashboard Marketing — Seasonal Pricing


Figure 4.82: Dashboard Marketing — Using AI Page 1


Figure 4.83: Dashboard Marketing — Using AI Page 2


Figure 4.84: Dashboard Marketing — Using AI Page 3


Figure 4.85: Dashboard Marketing — Using AI Page 4

xi. AI Chatbot Settings (Admin)
The AI Chatbot Settings page in the Admin Dashboard allows administrators to configure the chatbot behaviour without modifying the source code. Settings include the OpenRouter API key for the customer chatbot and the Google Gemini API key for the marketing content generator, the system prompt that defines the chatbot's personality and knowledge scope, and a greeting message displayed to users when they open the chat. Figure 4.86 illustrates the AI Settings Dashboard.


Figure 4.86: AI Setting Dashboard Admin









xii. System Settings
The System Settings page provides controls for core platform configuration including company name, contact information, operating hours, deposit policy, tax rate, and vehicle pickup locations. Figure 4.87 illustrates the Admin System Settings interface.


Figure 4.87: Admin Setting










xiii. Footer and Supporting Pages
The system footer is displayed consistently across all guest-facing and customer-facing pages, providing links to supporting content. The Privacy Policy page outlines data handling practices. The Car Connectivity page describes the vehicle technology features available. The FAQ page addresses common customer queries. The Contact page provides the rental operator's contact information and an enquiry submission form. Figures 4.88 through 4.92 illustrate these supporting pages.


Figure 4.88: Footer


Figure 4.89: Privacy Policy


Figure 4.90: Car Connectivity


Figure 4.91: Frequently Asked Questions (FAQ)


Figure 4.92: Contact














xiv. Error Page
The Error Page (404 Not Found) is designed to gracefully handle invalid URLs or broken links within the WeDRIVE system. Instead of displaying a default browser error, users are presented with a custom, user-friendly interface that informs them the requested page does not exist or has been moved. To ensure a seamless user experience and prevent navigation dead-ends, the page provides quick action buttons allowing users to easily return to the Home page, browse available cars, or access the support section for further assistance. Figure 4.93 illustrates the custom 404 Error Page.


Figure 4.93: Error Page







### Database Design
The database design phase translates the data requirements identified in Chapter 3 into a structured, implementable database schema. This section presents the conceptual and logical database design through an Entity Relationship Diagram (ERD), followed by the detailed data dictionary and normalisation process applied to ensure data integrity and eliminate redundancy.

Conceptual and Logical Database Design
The conceptual database design represents the high-level structure of the WeDRIVE database using a Logical Data Model (LDM), commonly visualised through an Entity Relationship Diagram (ERD). The ERD identifies the key entities within the system, their attributes, and the relationships that exist between them, independent of any specific database management system (DBMS) implementation. This conceptual model serves as the foundation upon which the physical database design, presented in Section 4.3.2, is later constructed.
The WeDRIVE database consists of seven primary entities: Customers, Cars, Bookings, Admins, Marketing, Config, and Settings. Each entity and its relationships were defined based on the business rules governing the car rental operation, as described below.
Car – Booking Relationship (One-to-Many): A single vehicle can be associated with multiple bookings across different rental periods, but each booking record refers to exactly one vehicle. This rule ensures that the system can track the complete rental history of any given car while preventing ambiguity in which vehicle a particular booking pertains to. This relationship is the only formally enforced foreign key relationship in the schema, implemented through the car_id foreign key in the Bookings table, which references the primary key id in the Cars table.
Customer – Booking Relationship (Logical, Application-Enforced): A registered customer is permitted to make multiple bookings over time. However, unlike the Car–Booking relationship, this is not enforced as a database-level foreign key. Instead, the Bookings table stores a denormalised snapshot of customer details — including name, email, and contact information — directly within each booking record at the time the reservation is made. This design decision ensures that each booking retains an accurate historical record of the customer's details exactly as they were at the time of booking, even if the customer's profile is later updated. The logical association between a customer and their bookings is instead established at the application layer, by matching the customer_email or auth_uid field against the corresponding record in the Customers table.
Admin – System Entities Relationship (Administrative, Non-Foreign-Key): Administrators are responsible for managing the Cars, Bookings, Marketing, Config, and Settings entities. This is not represented as a direct foreign key relationship in the database, as admin actions are performed through the application layer rather than being tied to specific records at the schema level. Administrator accounts are stored separately in the Admins table, and access control to these entities is governed by Row Level Security (RLS) policies rather than relational foreign keys.
Marketing, Config, and Settings (Independent Key-Value Entities): The Marketing, Config, and Settings entities operate independently of the Customers and Cars entities and follow a flexible key-value store pattern, with each record consisting of a unique key field and a corresponding value field stored as JSONB. This design allows the admin dashboard to store varied configuration data — such as promotional banners, tax rates, operating hours, and chatbot settings — without requiring frequent schema changes. None of these three entities hold a direct foreign key relationship with Customers, Cars, or Bookings, as their data applies system-wide rather than to specific transactional records.
Figure 4.94 presents the complete Entity Relationship Diagram for the WeDRIVE system, illustrating all seven entities and the cardinality of their relationships as described above.

Figure 4.94: Entity Relationship Diagram (ERD)

Building upon the conceptual ERD, the logical database design refines each entity into its complete column-level structure, defining every attribute, data type, and constraint required for implementation. Figure 4.95 presents the logical database design diagram, showing the refined table structures and their interconnecting keys prior to physical implementation.


Figure 4.95: Logical Database Design





Data Dictionary and Normalisation
The data dictionary defines the precise structure of each table in the WeDRIVE database, including column names, data types, and descriptive comments. Tables 4.2 through 4.4 below document the complete data dictionary for the three core transactional entities, reflecting the actual implemented schema.

Table 4.2: Cars

Table 4.3: Bookings




Table 4.4: Customers

The database design applies normalisation principles up to Third Normal Form (3NF) where applicable, with deliberate denormalisation in specific areas to support the system's reporting and historical accuracy requirements:
First Normal Form (1NF): All attributes within each table hold atomic, single values with no repeating groups. JSONB columns used for complex or array-type data (such as features, gallery, specs, and insurance in the Cars table) are treated as a single atomic value at the application layer, with the application responsible for parsing their internal structure.
Second Normal Form (2NF): All non-key attributes are fully functionally dependent on the entire primary key, with no partial dependencies present, as every table in the schema uses a single-column primary key.
Third Normal Form (3NF) with Deliberate Denormalisation: While the schema largely avoids transitive dependencies, the Bookings table intentionally retains denormalised fields such as car, customer, and customer_email rather than relying solely on foreign key lookups. This is a deliberate architectural decision rather than a normalisation oversight: it ensures that each booking record preserves an accurate historical snapshot of the vehicle and customer details exactly as they existed at the time of booking, which is essential for generating accurate historical business reports even if the underlying Car or Customer record is later modified.
























## Detailed Design
This section elaborates on the detailed design of the WeDRIVE system, focusing on the internal logic of each software component and the approach taken to satisfy the functional requirements defined in Chapter 3. As WeDRIVE follows a modular, function-based JavaScript architecture rather than an object-oriented design, the software design is described using a procedural/functional specification approach, detailing each module's responsibilities, inputs, outputs, and underlying logic.
### Software Design
The WeDRIVE software architecture is organised into five functional modules, each responsible for a distinct set of operations corresponding to the processes defined in the Data Flow Diagrams (Figure 3.3.4 and Figure 3.3.5). The following describes each core function in the system, structured in a program specification format consisting of function description, input/output, and processing logic. It should be noted that several validation responsibilities — such as date-conflict checking and filtering — are deliberately handled at the frontend application layer rather than within the database functions themselves, reflecting the system's lightweight, client-driven architecture.

Function: loginUser(email, password)
Description: Authenticates a user against Supabase Auth, retrieves their specific role (admin/customer) by checking the Admins table, and returns the session object. Redirection to the appropriate dashboard is handled separately by the frontend UI logic.
Input: email (string), password (string)
Output: Object { success, role, user }
Processing logic:



BEGIN
CALL Supabase.auth.signInWithPassword(email, password);
IF auth_success THEN
SELECT role INTO user_role FROM admins WHERE email = input.email;
IF FOUND THEN
SET role = 'admin';
ELSE
SET role = 'customer';
END IF;
RETURN { success: true, role, user };
ELSE
RETURN { success: false, error: error_message };
END IF;
END;


Function: getCars(filters)
Description: Retrieves the list of available vehicles, optionally filtered by type, fuel, or price range.
Input: filters (object: type, fuel, minPrice, maxPrice)
Output: Array of car objects
Processing logic:
BEGIN
SELECT * FROM cars;
IF query_success THEN
RETURN Results_as_JSON_Array;
ELSE
RETURN Empty_Array_or_Error;
END IF;
END;





Function: getCars()
Description: Retrieves the full list of vehicles from the Supabase database. Filtering, sorting, and availability checks are applied dynamically by the frontend application layer rather than within the query itself.
Input: None
Output: Array of Car objects
Processing logic:
BEGIN
SELECT * FROM cars;
IF query_success THEN
RETURN Results_as_JSON_Array;
ELSE
RETURN Empty_Array_or_Error;
END IF;
END;


Function: createBooking(bookingData)
Description: Inserts a complete booking record into the database. Date conflict validation is performed on the client-side calendar interface before this function is invoked.
Input: bookingData (object containing car_id, customer details, dates, total, status, etc.)
Output: Object { success, id }
Processing logic:


BEGIN
INSERT INTO bookings (data) VALUES (bookingData);
IF insert_success THEN
RETURN { success: true, id: new_booking_id };
ELSE
RETURN { success: false, error: error_message };
END IF;
END;

Function: sendChat(userMessage, conversationHistory)
Description: Processes a chatbot query by combining system instructions, live database car details, and the logged-in customer's profile and booking history, then generates a response via the OpenRouter API.
Input: userMessage (string), conversationHistory (array of prior messages)
Output: AI response (string)
Processing logic:

BEGIN
FETCH live company settings and available cars from Supabase;
FETCH current user profile, verification status, and booking history (if logged in);
BUILD full system prompt;
APPEND userMessage to conversationHistory;
CALL OpenRouter API (model: google/gemini-2.5-flash);
IF API_success THEN
PARSE response for interactive elements;
RETURN AI response;
ELSE
RETURN Fallback Error Message;
END IF;
END;

Function: getAdminData()
Description: Retrieves all necessary datasets — bookings, cars, customers, and admins — in a single call to generate statistics and charts for the Admin Dashboard.
Input: None
Output: JSON Object containing data arrays for bookings, cars, customers, and admins.
Processing logic:



BEGIN
SELECT * FROM bookings;
SELECT * FROM cars;
SELECT * FROM customers;
SELECT * FROM admins;
IF all_queries_success THEN
RETURN grouped JSON Object;
ELSE
RETURN Error;
END IF;
END;

Figure 4.96 illustrates the overall module architecture, showing how these functions are organised within the Shared, Account, Guest, Customer, and Admin modules described in this section.


Figure 4.96: Module Architecture Diagram








### Physical Database Design
The physical database design translates the logical data model into a Data Definition Language (DDL) implementation on the target DBMS, which for WeDRIVE is PostgreSQL hosted on Supabase. This section presents the base table definitions, constraint rules, and indexing strategy applied to the physical schema, reflecting the actual production database structure.

Base Table Definitions (DDL):
CREATE TABLE public.cars (
car_id SERIAL PRIMARY KEY,
brand VARCHAR(100),
name VARCHAR(255) NOT NULL,
type VARCHAR(50),
price_per_day DECIMAL(10,2),
price_per_hour DECIMAL(10,2),
year INTEGER,
seats INTEGER,
transmission VARCHAR(20),
fuel VARCHAR(30),
engine VARCHAR(100),
color VARCHAR(50),
plate VARCHAR(20),
mileage VARCHAR(50),
status VARCHAR(20) DEFAULT 'Available',
rating DECIMAL(3,2),
reviews INTEGER DEFAULT 0,
features JSONB DEFAULT '[]'::jsonb,
image TEXT,
gallery JSONB DEFAULT '[]'::jsonb,
specs JSONB,
insurance JSONB,
description TEXT
);

CREATE TABLE public.customers (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
customer_id VARCHAR(30) UNIQUE,
auth_uid UUID UNIQUE,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
phone VARCHAR(20),
ic VARCHAR(20),
license VARCHAR(30),
total_bookings INTEGER DEFAULT 0,
total_spent DECIMAL(10,2) DEFAULT 0.00,
status VARCHAR(20) DEFAULT 'Active',
joined DATE DEFAULT CURRENT_DATE,
last_booking VARCHAR(30),
verification_status VARCHAR(20) DEFAULT 'Pending'
);

CREATE TABLE public.bookings (
id SERIAL PRIMARY KEY,
booking_id VARCHAR(20) UNIQUE,
car VARCHAR(255),
car_id INTEGER REFERENCES public.cars(car_id),
customer VARCHAR(255),
customer_email VARCHAR(255),
pickup_date DATE NOT NULL,
return_date DATE NOT NULL,
pickup_time VARCHAR(10),
return_time VARCHAR(10),
pickup_location VARCHAR(100),
return_location VARCHAR(100),
duration VARCHAR(30),
total DECIMAL(10,2) NOT NULL,
status VARCHAR(20) DEFAULT 'Pending',
payment_method VARCHAR(50),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

Business Rule Constraints (Validation):
Field-level validation constraints were applied to enforce data integrity beyond basic data typing:


ALTER TABLE public.bookings ADD CONSTRAINT chk_dates
CHECK (return_date > pickup_date);

ALTER TABLE public.cars ADD CONSTRAINT chk_price_positive
CHECK (price_per_day > 0);

ALTER TABLE public.cars ADD CONSTRAINT chk_seats_valid
CHECK (seats BETWEEN 2 AND 15);


Access Control (DCL — Row Level Security):
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers view own profile"
ON public.customers FOR SELECT
USING (auth.uid() = auth_uid);

CREATE POLICY "Customers view own bookings"
ON public.bookings FOR SELECT
USING (customer_email = auth.email());



File Organisation and Indexing:
As WeDRIVE uses PostgreSQL via Supabase, file organisation is managed internally by the DBMS using its native heap storage structure. To optimise query performance for frequently executed operations — particularly those involving the denormalised lookup fields used in place of formal foreign keys — the following indexes were defined on high-traffic columns:
CREATE INDEX idx_bookings_car_id ON public.bookings(car_id);
CREATE INDEX idx_bookings_customer_email ON public.bookings(customer_email);
CREATE INDEX idx_cars_type_status ON public.cars(type, status);
CREATE INDEX idx_bookings_dates ON public.bookings(pickup_date, return_date);
CREATE INDEX idx_customers_auth_uid ON public.customers(auth_uid);



These indexes significantly reduce query execution time for common operations such as retrieving a customer's booking history by email, checking vehicle availability for a date range, and filtering vehicles by type and status during browsing.














## Conclusion
This chapter has presented the complete system design for the WeDRIVE AI-Assisted Car Rental Management System with Chatbot Support. The high-level design established a client-server architecture built on a Backend-as-a-Service model using Supabase, with Vercel handling frontend hosting and continuous deployment. The user interface design was detailed across input and output interfaces spanning all four system modules, supported by navigation flow diagrams that map the complete user journey for guests, customers, and administrators. The database design translated the requirements identified in Chapter 3 into a normalised Entity Relationship Diagram and logical data model, with clearly defined business rules governing the relationships between Cars and Bookings entities, while deliberately documenting the application-level handling of customer-booking associations.
The detailed design further elaborated the internal logic of key software functions through program specifications, illustrating the precise input, output, and processing steps for core operations such as authentication, vehicle retrieval, booking creation, customer AI chatbot communication via OpenRouter.ai (Gemini 2.5 Flash model) and admin marketing content generation via the Google Gemini API, and admin dashboard data aggregation. The physical database design concluded the chapter by translating the logical model into concrete PostgreSQL DDL statements, complete with constraint-based validation rules, Row Level Security policies for access control, and a targeted indexing strategy to optimise query performance.
Collectively, the design decisions presented in this chapter provide a complete and implementable blueprint for the development phase of this project. With the requirements analysis (Chapter 3) and system design (Chapter 4) now finalised, the next phase of this project — to be undertaken in PSM II — will focus on the actual implementation of each module according to the Agile iterative methodology outlined in Chapter 2, followed by comprehensive testing encompassing unit testing, integration testing, and user acceptance testing (UAT), and culminating in the final deployment of the WeDRIVE system to production at wedrive.website.

# IMPLEMENTATION
## Introduction
Introductory preview to this chapter.
Briefly describe the activity involved in the implementation phase and what is the expected output after you complete this phase. Provide chapter outline diagram of Chapter 5.
## Software Development Environment Setup
Define your development environment setup.
Use diagram to view/present the environment architecture. Examples: deployment diagram, draw the software (client s/w, server s/w), hardware (server configuration e.g. port no., IP address, database instance name, table space etc.) and network setup..
## Version Control Procedure
Describe the procedure and control in managing your source code version.
## Implementation Status
Describe the progress of the development status for each of the component/module. For example: component/module name, description, duration to complete, date completed, size of software etc.
## Conclusion
Summarize the chapter and explain the next activities to be developed.


# TESTING
## Introduction
Introductory preview to this chapter. E.g. briefly describe the activity involved in testing phase and what is the testing strategy to be adopted in your project. Provide chapter outline diagram of Chapter 6.

## Test Plan
Introductory
### Test Organization
Describe personnel involved.
### Test Environment
Describe the location/environment of testing to be carried out.
Define hardware, firmware configurations, preparations and training prior to testing.

### Test Schedule
Define how many cycles and duration of your test to be conducted.

## Test Strategy
Explain the strategy to be selected such as bottom-up or top-down and black-box/white- box classes of tests.

### Classes of Test
Output correctness or functionality test, Security test, Stress test and etc.

## Test Design
### Test Description
Test case identification, test cases and expected result for each module are designed and documented.
### Test Data
Real life or synthetic data will be selected.
## Test Result and Analysis
Test case identification, tester identification, test case results (Success/Fail), and detailed documentation on the failed test case.
How satisfied overall your intended users and yourself with the system.
## Conclusion
Summarize the chapter and explain the next activities to be developed.




# CONCLUSION
## Observation and Weakness Strength
State the weaknesses and strength of your project.
You also may state other’s responses regarding project topics.

## Proposition and Improvements
Present your suggestions on how your system can be improved better.
Elaborate each of your suggestions in paragraph.
## Project Contribution
State your project contribution to the university/faculty/company/individual.
State where to find the user manual - e.g. Appendix XX.
## Conclusion
State whether you think your project meets your set objectives conclusively.
Concluding phrases to conclude the project.



# references

Adamopoulou, E. and Moussiades, L. (2020) 'An overview of chatbot technology', IFIP Advances in Information and Communication Technology, 584, pp. 373-383. doi: 10.1007/978-3-030-49186-4_31.
Agentive AI (2024) 7 best smart AI agent systems for car rental management in 2024. Available at: https://agentiveaiq.com/listicles/7-best-smart-ai-agent-systems-for-car-rental (Accessed: 23 April 2026).
AirentoSoft (2024) All-in-one car rental software for fleet management and online booking. Available at: https://airentosoft.com/car-rental-software (Accessed: 23 April 2026).
Ali, M. and Rahman, S. (2025) 'Driving consumer engagement through AI chatbot experience', IEEE Xplore. Available at: https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=11088190 (Accessed: 23 April 2026).
Duong, T., Pham, Q., Oh, J. and Do, A. (2025) 'Can AI chatbot adoption bridge the gap between intention and e-booking behavior?', Sustainability. Available at: https://www.mdpi.com/2071-1050/17/17/7673 (Accessed: 23 April 2026).
GoCar Malaysia (2024) GoCar - Car sharing and subscription platform. Available at: https://www.gocar.my (Accessed: 15 May 2026).
Gupta, R. (2024) 'AI-driven fleet analytics: Revolutionizing modern fleet management', ResearchGate, pp. 1-15. Available at: https://www.researchgate.net/publication/390194424 (Accessed: 23 April 2026).
KAYAK (2024) Car rental search and comparison. Available at: https://www.kayak.com.my (Accessed: 15 May 2026).
Kumar, S. and Singh, P. (2025) 'Advanced car rental system: Integrating blockchain, AI and real-time inventory management for enhanced user experience', ResearchGate, pp. 1-12. Available at: https://www.researchgate.net/publication/394119741 (Accessed: 23 April 2026).
MDN Web Docs (2024) Web technology for developers. Available at: https://developer.mozilla.org/en-US/ (Accessed: 1 May 2026).
Nguyen, Q. H. and Do, T. K. (2026) 'The impact of AI chatbot on customer willingness to pay: An empirical investigation', Journal of Open Innovation: Technology, Market, and Complexity. Available at: https://www.mdpi.com/2673-5768/7/3/68 (Accessed: 23 April 2026).
Rybo AI (2024) Transforming car rentals with AI chatbots: Benefits and use cases. Available at: https://www.rybo.ai/car-rental-chatbot/ (Accessed: 23 April 2026).
SOCAR Malaysia (2024) SOCAR - Car sharing app. Available at: https://www.socar.my (Accessed: 15 May 2026).
Supabase (2024) Supabase documentation: The open source Firebase alternative. Available at: https://supabase.com/docs (Accessed: 1 May 2026).
Tourism Malaysia (2024) Malaysia tourism statistics. Available at: https://www.tourism.gov.my (Accessed: 10 May 2026).
Zhang, L. and Wang, H. (2026) 'Mapping the research landscape of AI chatbot adoption in tourism and hospitality', Journal of Hospitality and Tourism Management. Available at: https://www.sciencedirect.com/org/science/article/pii/S1947820826000048 (Accessed: 23 April 2026).
Malaysian Automotive Association (MAA) (2025) Malaysia automotive industry statistics 2025. Available at: https://www.maa.org.my (Accessed: 10 May 2026).









# APPENDIX A

|  | PAGE |
| --- | --- |
|  | PAGE |
| --- | --- |
|  | PAGE |
| --- | --- |
| FYP | Final Year Project |
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
| MAA | Malaysian Automotive Association |
|  |  |  | PAGE |
| --- | --- | --- | --- |
|  |  |  |  |
| Appendix A |  | Sample of data | 19 |
| Appendix B |  | Analysis of data collection | 78 |
| …….. |  | ………… |  |
| …….. |  | ………… |  |
|  |  |  |  |
| Feature | SOCAR | GoCar | KAYAK | WeDRIVE (Proposed) |
| --- | --- | --- | --- | --- |
| Platform Type | Mobile App | Mobile App + Web | Web Metasearch | Web Application |
| Fleet Ownership | Own Fleet | Own Fleet | No Fleet (Aggregator) | Own Fleet Management |
| AI Chatbot | No | No | AI Mode (Search) | Yes (OpenRouter) |
| 360-Degree Vehicle View | No | No | No | Yes (200 frames) |
| Admin Dashboard | Internal Only | Internal Only | N/A | Full Admin Panel |
| Customer Support | Live Chat (Human) | FAQ/Support | Provider-dependent | AI Chatbot 24/7 |
| Multi-language | EN/BM | EN/BM | Multi-language | EN/BM Toggle |
| Dark Mode | No | No | No | Yes (Day/Night) |
| Responsive Design | Mobile-first | Mobile-first | Yes | Yes (All devices) |
| Marketing Tools | N/A | N/A | N/A | Banners/Promo/Seasonal |
| Reports & Analytics | Internal | Internal | N/A | Built-in Dashboard |
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
| 14 | OpenRouter.ai API | google/gemini-2.5-flash | Primary AI model for chatbot |
| 15 | Google Gemini API | gemini-2.5-flash | For admin marketing |
| 16 | Resend | - | Email delivery service for notifications |
| 17 | Figma / Stitch | - | UI/UX design reference |
| 18 | Windows 11 / macOS | Latest | Development operating system |
| No. | Hardware | Specification | Purpose |
| --- | --- | --- | --- |
| 1 | Development Laptop/PC | Intel i5/AMD Ryzen 5/M1 Apple chip or above, 8GB RAM minimum, 256GB SSD | Primary development machine |
| 2 | Smartphone (Android/iOS) | Modern smartphone with latest browser | Mobile responsive testing |
| 3 | Internet Connection | Stable broadband connection (minimum 10 Mbps) | Cloud services access, deployment, API calls |
| 4 | Display Monitor | Full HD (1920x1080) minimum | UI development and testing |
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
| status | VARCHAR | 20 | Current availability (Available, Rented, Maintenance) | Not Null, Default 'Available' |
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
| status | VARCHAR | 20 | Account status (Active, Inactive, Pending) | Default 'Active' |
| total_bookings | INTEGER | - | Count of all bookings | Default 0 |
| total_spent | DECIMAL | 10,2 | Total amount spent on bookings | Default 0.00 |
| joined_date | TIMESTAMP | - | Account creation date | Auto-generated |
| verification_status | VARCHAR | 20 | Document verification status | Default 'Pending' |
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
| NFR-09 | Reliability | AI chatbot shall route queries through OpenRouter.ai with automatic model fallback capability | Dual-model architecture |
| NFR-10 | Reliability | System shall be available 99.9% of the time (Vercel SLA) | Uptime monitoring |
| NFR-11 | Scalability | Database shall support growth to thousands of records | PostgreSQL scalability |
| NFR-12 | Maintainability | Code shall follow modular architecture (1 module = 1 CSS, structured JS) | Code review compliance |
| NFR-13 | Compatibility | System shall work on latest versions of Chrome, Firefox, Safari, Edge | Cross-browser testing |
| NFR-14 | Localization | System shall support dynamic language switching without page reload | EN/BM JSON language files |
| Module | Navigation Type | Component |
| --- | --- | --- |
| Guest | Top Navbar | shared/components/navbar.html loaded by navbar-loader.js |
| Account (Auth) | Standalone(no navigation) | Self-contained pages |
| Customer | Sidebar | Generated by customer/js/sidebar-loader.js |
| Admin | Sidebar | admin/components/sidebar/sidebar-admin.html loaded by sidebar-loader.js |
| Column | Type | Comments |
| --- | --- | --- |
| car_id | integer | Primary key for uniquely identifying a vehicle. |
| brand | varchar | Vehicle manufacturer brand. |
| name | varchar | Full model name of the vehicle. |
| type | varchar | Vehicle category (Sedan, SUV, Hatchback, etc). |
| price_per_day | decimal | Daily rental rate in MYR. |
| price_per_hour | decimal | Hourly rental rate in MYR. |
| year | integer | Manufacturing year of the vehicle. |
| seats | integer | Number of passenger seats. |
| transmission | varchar | Transmission type (Automatic, Manual). |
| fuel | varchar | Fuel type (Petrol, Diesel, Hybrid, Electric). |
| engine | varchar | Engine specification. |
| color | varchar | Vehicle exterior colour. |
| plate | varchar | Vehicle registration plate number. |
| mileage | varchar | Current vehicle mileage. |
| status | varchar | Current availability status (Available, Rented, Maintenance). |
| rating | decimal | Average customer rating. |
| reviews | integer | Total number of reviews received. |
| features | jsonb | Array of vehicle features. |
| image | text | Primary vehicle image URL. |
| gallery | jsonb | Array of additional image URLs (incl. 360° frames). |
| specs | jsonb | Detailed technical specifications object. |
| insurance | jsonb | Insurance coverage options object. |
| description | text | Detailed vehicle description. |
| Column | Type | Comments |
| --- | --- | --- |
| id | integer | Primary key for uniquely identifying a booking. |
| booking_id | varchar | Human-readable booking reference. |
| car | varchar | Vehicle name snapshot at time of booking. |
| car_id | integer | Foreign key referencing Cars.car_id. |
| customer | varchar | Customer name (denormalised snapshot, no FK). |
| customer_email | varchar | Customer email (denormalised snapshot, no FK). |
| pickup_date | date | Rental start date. |
| return_date | date | Rental end date. |
| pickup_time | varchar | Scheduled pickup time. |
| return_time | varchar | Scheduled return time. |
| pickup_location | varchar | Vehicle pickup location. |
| return_location | varchar | Vehicle return location. |
| duration | varchar | Calculated rental duration. |
| total | decimal | Total booking amount. |
| status | varchar | Booking status (Pending, Confirmed, Active, Completed, Cancelled). |
| payment_method | varchar | Payment method used. |
| created_at | timestamp | Booking creation timestamp. |
| Column | Type | Comments |
| --- | --- | --- |
| id | uuid | Primary key for the customer record. |
| customer_id | varchar | Human-readable customer reference. |
| auth_uid | uuid | Linked Supabase Auth user identifier. |
| name | varchar | Full name of the customer. |
| email | varchar | Customer email address. |
| phone | varchar | Contact phone number. |
| ic | varchar | Malaysian identity card number. |
| license | varchar | Driving license number. |
| total_bookings | integer | Running count of all bookings made. |
| total_spent | decimal | Cumulative amount spent on bookings. |
| status | varchar | Account status (Active, Inactive, Pending). |
| joined | date | Account registration date. |
| last_booking | varchar | Date of the most recent booking. |
| verification_status | varchar | Document verification status (Pending, Verified, Rejected). |