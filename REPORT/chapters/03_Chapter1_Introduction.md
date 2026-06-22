# CHAPTER 1: INTRODUCTION

## 1.1 Introduction

The car rental industry in Malaysia has experienced significant growth over the past decade, driven by increasing urbanization, the rise of domestic tourism, and a growing preference for flexible transportation options. According to the Malaysian Automotive Association (MAA, 2025), the demand for short-term vehicle rentals has surged, particularly in tourist-centric states such as Melaka, Penang, and Sabah. Despite this growing demand, many car rental businesses in Malaysia continue to rely on traditional, manual-based processes for managing their operations. These conventional methods often involve fragmented systems where bookings are handled through phone calls or WhatsApp messages, fleet management is tracked using spreadsheets, and customer records are maintained in physical logbooks or disconnected software applications.

This reliance on outdated systems presents several operational challenges. Customers frequently encounter difficulties in obtaining accurate, real-time information about vehicle availability, pricing, and booking status. The lack of a centralized digital platform results in prolonged response times, booking errors, and an overall substandard customer experience. From the business perspective, car rental operators struggle with inefficient fleet utilization, where vehicles may sit idle due to poor visibility into demand patterns, and revenue is lost through manual booking conflicts and the absence of data-driven decision-making tools.

The emergence of Artificial Intelligence (AI) technologies, particularly in the form of conversational chatbots and intelligent recommendation systems, offers transformative potential for the car rental industry. AI-powered chatbots can provide 24/7 customer assistance, handle routine inquiries autonomously, and guide customers through the booking process without human intervention. Furthermore, AI-driven analytics can help businesses optimize fleet utilization, predict demand patterns, and deliver personalized recommendations to customers based on their preferences and rental history.

In response to these challenges and opportunities, this project proposes the development of WeDRIVE, an AI-Assisted Car Rental Management System with Chatbot Support. WeDRIVE is designed as a comprehensive, web-based platform that consolidates all car rental operations into a single, unified system. The platform serves three primary user categories: customers who can browse, book, and manage vehicle rentals through an intuitive interface; administrators who can manage the vehicle fleet, monitor bookings, and generate business reports through a feature-rich dashboard; and guests who can explore available vehicles and pricing information without requiring account registration.

The system distinguishes itself from existing solutions through several innovative features, including an interactive 360-degree vehicle viewer that allows customers to inspect vehicles from all angles before booking, a dual-theme interface supporting both Day and Night modes, bilingual support for English and Bahasa Melayu, and a premium user interface design incorporating modern glassmorphism aesthetics. The integration of AI chatbot technology, powered by Google Gemini and xAI Grok models, further enhances the system by providing intelligent, context-aware customer assistance.

Figure 1.1 presents a high-level overview of the WeDRIVE system, illustrating the relationship between the main system modules and user types.

> *[Figure 1.1: WeDRIVE System Overview - To be inserted]*

## 1.2 Problem Statement(s)

The following problem statements have been identified through analysis of the current car rental landscape in Malaysia:

**Problem Statement 1: Fragmented and Inefficient Car Rental Management Systems**

Many car rental businesses in Malaysia operate using disconnected and manual-based management systems. Fleet information, booking records, customer details, and payment data are often maintained across separate platforms or physical records, leading to data inconsistency, duplication of effort, and operational inefficiencies. Car rental operators lack a unified platform that integrates all aspects of their business operations, from vehicle inventory management to customer relationship handling. This fragmentation results in booking conflicts, delayed responses to customer inquiries, and difficulty in generating accurate business reports for strategic decision-making (Kumar and Singh, 2025).

**Problem Statement 2: Poor Customer Experience and Limited Digital Engagement**

Traditional car rental services offer limited digital engagement channels for customers. The booking process typically requires customers to make phone calls, send messages through WhatsApp, or visit physical offices to inquire about vehicle availability and complete reservations. This process is time-consuming, restricted to business operating hours, and prone to human errors. Customers are unable to view detailed vehicle information, compare options, or track their booking status in real-time. The absence of 24/7 digital support channels means that customer inquiries outside business hours go unanswered, leading to potential loss of business and customer dissatisfaction (Duong et al., 2025).

**Problem Statement 3: Underutilization of AI Technology in Car Rental Services**

Despite the rapid advancement of AI technologies in the transportation and hospitality sectors, the Malaysian car rental industry has been slow to adopt AI-driven solutions. Existing systems lack intelligent features such as automated customer support through chatbots, personalized vehicle recommendations based on customer preferences, and data-driven insights for business optimization. The absence of AI integration represents a missed opportunity to improve operational efficiency, enhance customer engagement, and gain competitive advantage in an increasingly digital marketplace (Zhang and Wang, 2026).

## 1.3 Objectives

Based on the problem statements identified, this project aims to achieve the following objectives:

1. **To analyze** the current challenges in car rental management systems in Malaysia and identify functional and non-functional requirements for an improved, integrated solution.

2. **To design and develop** a web-based AI-Assisted Car Rental Management System (WeDRIVE) with integrated chatbot support that provides a unified platform for vehicle browsing, booking management, fleet administration, and customer engagement.

3. **To evaluate** the system's functionality, usability, and AI chatbot effectiveness through comprehensive testing, including unit testing, integration testing, and user acceptance testing.

## 1.4 Scope

The scope of this project encompasses the following areas:

### System Modules

1. **Customer Booking Portal:** A user-friendly web interface that enables registered customers to browse available vehicles with detailed specifications and 360-degree views, make reservations by selecting dates and add-on services, complete payments through an integrated checkout process, manage their booking history and profile information, and receive booking confirmations with QR codes.

2. **Admin Dashboard:** A comprehensive backend interface that allows system administrators to manage the vehicle fleet (add, edit, delete vehicles and update availability status), monitor and manage all customer bookings, view customer profiles and rental history, generate business reports and analytics (revenue charts, utilization rates), manage marketing campaigns (banners, promo codes, seasonal pricing), configure system settings (company information, tax rates, operating hours), and oversee AI chatbot settings and API configurations.

3. **AI Chatbot:** An intelligent conversational assistant integrated into the customer and guest interfaces, powered by Google Gemini and xAI Grok AI models. The chatbot handles customer inquiries regarding vehicle availability and recommendations, assists with the booking process and provides booking status updates, answers frequently asked questions about rental policies, pricing, and procedures, and operates 24/7 to provide continuous customer support.

4. **Guest Browsing Interface:** A publicly accessible interface that allows potential customers to explore the vehicle fleet and pricing information without requiring account registration. Guest users can view vehicle details, pricing tiers, and explore Melaka attractions, but are redirected to the login page when attempting to make a booking.

### Technical Scope

- **Platform:** Web-based application accessible through modern web browsers
- **Frontend Technologies:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend/Database:** Supabase (PostgreSQL) with Row Level Security
- **Authentication:** Supabase Auth with email/password and Google OAuth 2.0
- **Hosting:** Vercel with automatic deployment from GitHub
- **AI Integration:** Google Gemini API and xAI Grok API for chatbot functionality
- **Design:** Responsive design with mobile compatibility, dual-theme (Day/Night), bilingual (EN/BM)

### Out of Scope

The following areas are explicitly excluded from the current project scope:

- Real payment gateway integration (demo mode only; future integration with Stripe/Billplz planned)
- Native mobile application development (iOS/Android)
- Real-time GPS vehicle tracking
- Physical key management and IoT vehicle access
- Multi-branch or franchise management
- Integration with external insurance or road tax systems

## 1.5 Project Significance

This project carries significance across multiple dimensions:

**Academic Significance:** The project demonstrates the practical application of software engineering principles, web development technologies, and AI integration in solving a real-world business problem. It serves as a comprehensive case study in full-stack web application development, encompassing requirements analysis, system design, database architecture, and user interface design. The project also explores the integration of modern AI language models (Google Gemini and xAI Grok) into a functional web application, contributing to the academic understanding of AI-enhanced business systems.

**Industry Significance:** WeDRIVE addresses genuine pain points experienced by car rental businesses in Malaysia. The system provides a scalable, cost-effective solution that small to medium-sized car rental operators can adopt to digitize their operations. By leveraging free-tier cloud services (Supabase, Vercel), the system demonstrates that advanced, AI-powered business solutions can be developed and deployed with minimal infrastructure costs, making digital transformation accessible to smaller businesses.

**Technological Significance:** The project showcases the use of modern web development approaches, including Backend-as-a-Service (BaaS) architecture with Supabase, serverless deployment on Vercel, and the integration of multiple AI language models for chatbot functionality. The implementation of features such as interactive 360-degree vehicle visualization, glassmorphism UI design, and dual-language support demonstrates the capability of vanilla web technologies (without heavy frameworks) to deliver premium, feature-rich applications.

**Social Significance:** By improving the car rental booking experience, particularly in tourist destinations like Melaka, the system contributes to enhancing the overall tourism experience in Malaysia. The bilingual support ensures accessibility for both English-speaking and Malay-speaking users, promoting inclusivity in digital services.

## 1.6 Expected Output

Upon completion, this project is expected to produce the following deliverables:

1. **A fully functional web-based car rental management system (WeDRIVE)** deployed at wedrive.website, comprising the Customer Booking Portal, Admin Dashboard, AI Chatbot, and Guest Browsing Interface.

2. **A responsive, premium user interface** featuring glassmorphism design, dual-theme support (Day/Night mode), and bilingual capability (English/Bahasa Melayu), accessible across desktop, tablet, and mobile devices.

3. **An AI-powered chatbot** integrated with Google Gemini and xAI Grok APIs, capable of handling customer inquiries, providing vehicle recommendations, and assisting with the booking process.

4. **A comprehensive database** built on Supabase PostgreSQL, storing vehicle inventory (8 models), customer profiles (5 registered users), booking records (110 bookings), and system configuration data, with Row Level Security (RLS) enforcement.

5. **An interactive 360-degree vehicle viewer** using 200-frame exterior rotation and cubemap interior panorama, enabling customers to inspect vehicles in detail before booking.

6. **Complete project documentation** including this PSM I report (Chapters 1-4), system flowcharts, database schemas, and user interface designs.

## 1.7 Conclusion

This chapter has provided an introduction to the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE) project. The chapter outlined the background and motivation for the project, identified three key problem statements relating to fragmented management systems, poor customer digital experience, and underutilization of AI technology in the car rental industry. Three corresponding project objectives were defined, along with the detailed scope covering four system modules and the technical architecture. The significance of the project was discussed from academic, industry, technological, and social perspectives, and the expected outputs were enumerated.

The subsequent chapters will elaborate on the project in greater detail. Chapter 2 will present a comprehensive literature review of related works and the project methodology. Chapter 3 will provide a detailed analysis of system requirements. Chapter 4 will describe the system design, including architecture, user interface, and database design.
