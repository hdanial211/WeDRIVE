# CHAPTER 1: INTRODUCTION

## 1.1 Project Background
Melaka is one of the most prominent historical and tourism destinations in Malaysia, attracting millions of local and international visitors annually. With this high volume of tourists comes a substantial demand for transportation services, particularly car rentals, which offer travelers the flexibility and convenience needed to navigate the city's historic sites. Despite the demand, the local car rental industry still largely relies on conventional processes. Traditional rental companies often manage their operations manually or use basic, static web forms that lack transparency, real-time data processing, and modern security standards.

For customers, a primary source of friction and distrust is the vehicle inspection process. Typically, when booking a vehicle online, customers are presented with generic stock images. During vehicle pickup and drop-off, disputes frequently arise between the renter and the rental operator regarding existing body damage, paint scratches, or interior conditions. There is a lack of interactive visual verification tools that allow customers to inspect the actual vehicle virtually before confirming their rental. 

Furthermore, data management in traditional systems is often slow and prone to errors. Security and data integrity are major concerns, as customer verification documents (such as identity cards and driving licenses) are often handled insecurely over public messaging applications like WhatsApp. Modern web applications require instant data synchronization, secure role-based access, and robust authentication mechanisms to comply with data privacy standards. 

To overcome these challenges, this project proposes **WeDRIVE**, an AI-enabled car rental system designed with a premium, responsive web interface. WeDRIVE introduces a 360-degree interactive virtual inspection viewer for both the exterior and interior of vehicles, ensuring high transparency. Built using a modern frontend architecture integrated with a cloud-hosted relational database (Supabase PostgreSQL), WeDRIVE implements real-time data sync, dynamic calendar availability blocking, and a structured profile verification workflow. Additionally, the system leverages Artificial Intelligence through a built-in support chatbot capable of answering client queries and proposing optimized tour routes in Melaka.

---

## 1.2 Problem Statement
The development of WeDRIVE is driven by three main problem statements identified in the current car rental domain:

1. **Lack of Transparency and Virtual Inspection Tools:** Traditional car rental websites rely on static, generic images of vehicles. Customers cannot visually verify the exact condition of the vehicle's exterior or interior prior to booking. This lack of visual verification frequently leads to disputes over pre-existing vehicle damage (scratches, dents, or interior tears) at the time of return, reducing customer trust and satisfaction.
2. **Insecure and Inefficient Customer Verification and Data Sync:** Traditional platforms lack automated workflows for secure user authentication and document verification. Verification documents like National Identity Cards (IC) and driving licenses are often collected manually or through unencrypted chat channels, risking data leaks. Furthermore, without real-time database synchronization, systems suffer from double-booking conflicts and delayed status updates.
3. **Absence of Intelligent Support and Tourism Route Planning:** Tourists renting vehicles in Melaka frequently require recommendations for local attractions, hotel routing, and general travel support. Conventional rental websites do not provide automated, intelligent customer support, forcing renters to rely on external search engines or manual itineraries, leading to an fragmented user experience.

These problems are summarized in Table 1.1.

**Table 1.1: Summary of Problem Statements**
| Problem ID | Problem Description | Major Consequences | Proposed Solution in WeDRIVE |
| :--- | :--- | :--- | :--- |
| **PS 1** | Lack of interactive virtual inspection tools on rental platforms. | Customer disputes over vehicle body/interior damage during pickup and drop-off. | Implement a 360-degree virtual viewer using 200-frame exterior rendering and panorama cubemaps. |
| **PS 2** | Insecure verification flows and lack of real-time database sync. | Data privacy vulnerabilities, double-booking conflicts, and slow administrative tracking. | Integrate Supabase Auth (Google OAuth + Email) with a strict profile completion flow and RLS-protected database. |
| **PS 3** | Absence of localized, automated travel support for rental customers. | Disjointed tourist experience; renters struggle with route planning and attraction guidance. | Build a Gemini-powered AI support chatbot for automated client assistance and Melaka route planning. |

---

## 1.3 Project Questions
To resolve the problem statements, the project aims to answer the following research and development questions:
1. **PQ 1:** How can an interactive 360-degree virtual inspection viewer be designed and integrated into a web-based car rental platform to improve vehicle transparency and trust?
2. **PQ 2:** How can a secure, real-time database architecture be implemented to manage user authentication, document verification status, and calendar blocking?
3. **PQ 3:** How can an intelligent AI support chatbot be integrated to assist customers with system usage and localized route planning in Melaka?

---

## 1.4 Project Objectives
The primary goal of this project is to develop WeDRIVE, an AI-enabled car rental system. The specific objectives to achieve this goal are:
1. **Objective 1:** To study and analyze existing car rental platforms and design a web-based portal with 360-degree virtual vehicle inspection capabilities.
2. **Objective 2:** To develop and implement a secure authentication and user profile completion workflow integrated with a real-time cloud database (Supabase PostgreSQL).
3. **Objective 3:** To evaluate the functionality, usability, and responsiveness of the proposed system, including the integration of an AI support chatbot for route planning and client queries.

---

## 1.5 Project Scope
The scope of WeDRIVE defines the boundaries, target users, and functional modules of the system:

### 1.5.1 Target Users
1. **Guest Users:** Anonymous visitors who can browse the vehicle fleet, view pricing, read guides ("How it Works"), and explore Melaka's attractions.
2. **Registered Customers:** Verified users who have completed their profile verification (IC, driving license, and phone number). They can select vehicles, verify availability on a blocked calendar, proceed through checkout, view booking receipts, and interact with the AI chatbot.
3. **Administrator:** System operators who manage the vehicle inventory (CRUD operations), verify customer profiles, monitor booking records, track rental revenue, update configuration settings, and review chatbot analytics.

### 1.5.2 System Modules
- **Fleet Showcase and 360 Viewer:** A premium catalog displaying 8 Malaysian vehicle models with an interactive 360-degree exterior rotation viewer (utilizing 200 sequential frames) and a 3D cubemap interior panorama.
- **Authentication and Profile Verification:** Secure signup and login using Supabase Auth (Email/Password & Google OAuth). An automated splash redirect forces users with incomplete profiles to upload verification details before booking.
- **Dynamic Booking and Calendar Blocking:** A Flatpickr-based calendar integration that queries the database in real-time to disable and gray-out dates that overlap with active bookings for the selected car.
- **Admin Management Panel:** A centralized dashboard featuring real-time statistics (total revenue, active rentals, fleet utilization), sortable customer and booking tables, search filters, and an overlay-based booking modification manager.
- **AI Support Chatbot:** A responsive chat widget powered by a Large Language Model (LLM) configured to answer system FAQs and generate tourism itineraries in Melaka.

---

## 1.6 Project Significance
The implementation of WeDRIVE offers substantial benefits to multiple stakeholders:

- **For Customers:** It provides an interactive and trustworthy booking experience. The 360-degree inspection eliminates disputes regarding vehicle damage, while the real-time calendar prevents double-bookings. The localized AI chatbot acts as a virtual tour guide, improving their visit to Melaka.
- **For Rental Operators (Admins):** It automates administrative tasks. The dashboard offers immediate insights into daily operations, revenue tracking, and fleet status. Document collection is structured and secured, minimizing data handling overhead.
- **Academic and Technical Value:** The project demonstrates the feasibility of combining Serverless Database-as-a-Service (BaaS) like Supabase with lightweight, vanilla HTML5/CSS3/JS architectures to achieve premium, high-performance web applications without the overhead of heavy JavaScript frameworks.

---

## 1.7 Conclusion
This chapter has outlined the foundational context of the WeDRIVE AI-Enabled Car Rental System. By addressing the issues of limited fleet transparency, insecure verification workflows, and the absence of integrated tourist assistance, WeDRIVE introduces a secure, real-time, and interactive solution. The project objectives, questions, and scopes defined here serve as the roadmap for the system's literature review, methodology, analysis, and implementation. The next chapter will explore the academic literature and existing industry platforms to justify the chosen technical solutions.
