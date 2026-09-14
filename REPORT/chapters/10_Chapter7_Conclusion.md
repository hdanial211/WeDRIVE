# CHAPTER 7: CONCLUSION

## 7.1 Observation on Weaknesses and Strengths

The development, implementation, and empirical evaluation of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE) have provided profound insights into the modernization of regional mobility platforms. Throughout the iterative development lifecycle—spanning requirement analysis, architectural design, cloud database configuration, frontend engineering, and multi-layered testing—the system exhibited distinct technical strengths while uncovering realistic operational limitations.

### 7.1.1 Strengths of the System

The WeDRIVE platform demonstrates several critical strengths that distinguish it from conventional web-based car rental systems:

1. **Strict Apple Human Interface Guidelines (HIG) & Bento Grid Architecture:**
   The entire user interface across guest, customer, and administrative modules conforms to Apple HIG design principles. The implementation incorporates responsive squircle Bento Grid cards (`border-radius: 24px/28px`), authentic frosted glass surfaces (`backdrop-filter: blur(20px) saturate(180%)`), tactile micro-interactions with gentle compression physics (`scale(0.97)`), and tabular numerals (`font-variant-numeric: tabular-nums`) for currency and date calculations. Crucially, the mandatory Zero Oval Rule guarantees that all circular action buttons maintain an absolute 1:1 aspect ratio (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important`), while text buttons expand horizontally into symmetric capsule pills (`border-radius: 9999px !important`), eliminating geometric distortion across MacBook (1440px), iPad (820px), and iPhone (393px) displays.

2. **Interactive 360-Degree Turntable Visual Studio & Panorama:**
   Unlike traditional car rental websites that rely on static 2D thumbnail photographs, WeDRIVE features an interactive 360-degree vehicle exterior inspection player and interior panoramic cube viewer. Utilizing sequenced multi-angle frame rendering with smooth pointer drag physics, prospective renters can inspect vehicle bodywork, paint finish, and interior seating from every perspective prior to committing to a reservation. This visual transparency eliminates customer ambiguity, builds rental confidence, and significantly reduces post-rental handover condition disputes.

3. **Hybrid Multi-Model Conversational AI with Automatic Failover:**
   The integrated AI customer support assistant employs an asynchronous dual-engine failover mechanism. Inquiries are primarily routed to Google Gemini 2.5 Flash for high-speed, multi-turn reasoning and real-time inventory context synthesis. If the primary endpoint encounters rate limiting, latency spikes, or network interruptions, the system autonomously fails over to the xAI Grok model without user disruption. Grounded in a strict system prompt that restricts answers to verified Malaysian rental policies and live Supabase vehicle data, the chatbot operates 24/7 with zero hallucination of fabricated inventory.

4. **Deterministic Single-Depot Conflict-Free Reservation Engine:**
   WeDRIVE addresses double-booking vulnerabilities through an intelligent date-locking pipeline. Configured around the dedicated WeDRIVE Melaka Sentral Headquarters depot, the booking system dynamically reads confirmed reservations and active rental intervals from the PostgreSQL backend. The interactive calendar blocks occupied dates automatically, while the `findFirstAvailableRange` algorithm selects the earliest valid rental window for newly chosen vehicles, ensuring that base daily tariffs, insurance add-ons, service fees, and SST calculations are computed deterministically.

5. **Cloud-Native Row Level Security (RLS) & Hardened Backend:**
   The system leverages Supabase PostgreSQL with comprehensive Row Level Security policies enforced at the database layer. Customers can only read and mutate their respective profile records and bookings (`auth.uid() = user_id`), while public access is strictly restricted to available vehicle listings. Administrative mutations are safeguarded behind verified administrative role checks. Input sanitization utilities prevent Cross-Site Scripting (XSS) and SQL injection vulnerabilities, validated through ethical penetration testing.

6. **Automated End-to-End Test Suite with 100% Pass Rate:**
   Software quality is continuously enforced through an automated Playwright CLI test suite residing in `tests/`. Encompassing 22 test cases across 5 major test specifications, the automated harness verifies session inactivity timeout safeguards, dedicated administrative sidebar routing, paired Flatpickr calendar selection, full bilingual (English and Bahasa Melayu) language parity, and regression defect resolution with a 100% pass rate.

### 7.1.2 Weaknesses and Technical Limitations

Despite its comprehensive architectural foundation and successful empirical validation, the current iteration of WeDRIVE possesses several inherent limitations that must be acknowledged:

1. **Dependency on External Cloud AI APIs and Network Connectivity:**
   The intelligence of the WeDRIVE conversational chatbot relies directly on external third-party Large Language Model APIs (Google Gemini and xAI Grok). Consequently, the response latency of the conversational agent is subject to external network latency, cloud service availability, and API quota thresholds. In the event of a simultaneous outage across both external cloud providers, the conversational chatbot degrades to rule-based fallback responses, temporarily limiting interactive contextual assistance.

2. **Single Operational Depot Geographic Constraint:**
   WeDRIVE is architected around a single operational headquarters depot located at Melaka Sentral. While this focus guarantees operational excellence and vehicle turnover control within Melaka, the platform currently lacks multi-branch inter-city drop-off capabilities. Customers desiring to pick up a vehicle in Melaka and return it in Kuala Lumpur International Airport (KLIA) or Johor Bahru cannot be accommodated automatically, requiring manual administrative logistics.

3. **Browser-Based Optical Character Recognition (OCR) vs. Biometric Hardware:**
   The customer identity and driving license verification module operates via browser-based document image capture and automated OCR parsing. While highly convenient for online onboarding, this approach is susceptible to image quality variations (e.g., glare, motion blur, poor lighting) and cannot replicate the cryptographic security of physical biometric smart chip MyKad readers utilized by government institutions.

4. **Absence of Real-Time In-Vehicle IoT Telematics:**
   The system currently relies on customer-reported and administrative handover checklists for vehicle mileage and fuel levels. The absence of integrated onboard IoT OBD-II telematics dongles precludes real-time automated tracking of vehicle location, battery health, fuel consumption, and electronic tampering during active rental periods.

### 7.1.3 User and Evaluator Observations

The qualitative and quantitative findings gathered during the User Acceptance Testing (UAT) phase involving 20 diverse participants (comprising university students, local Melaka residents, inbound tourists, and operations administrators) yielded positive evaluations that corroborate the system's operational viability:

- **System Usability Scale (SUS) Score:** The platform attained a mean SUS score of **86.5 out of 100**, placing WeDRIVE comfortably within the **Grade A ("Excellent")** bracket. Participants praised the layout simplicity, immediate visual feedback, and seamless transition from vehicle browsing to final receipt generation.
- **Visual Confidence & Transparency:** 95% of test participants remarked that the 360-degree turntable viewer and transparent price breakdown (separating base rent, optional child seat/GPS add-ons, and SST) instilled a sense of commercial trust that is absent from legacy rental websites.
- **Administrative Operational Efficiency:** Administrative evaluators highlighted that the dedicated 6-module navigation structure (Dashboard, Cars, Bookings, Customers, Reports, and AI Intelligence) significantly reduced cognitive load compared to single-page cluttered management dashboards.
- **Refinement Suggestions:** Constructive feedback from evaluators underscored the desirability of native smartphone push notifications for countdown alerts and integration with digital wallet payment gateways, which have been channeled into future enhancement propositions.

---

## 7.2 Propositions for Improvement

To ensure the sustained commercial competitiveness and technological scalability of WeDRIVE beyond the Final Year Project scope, several strategic enhancements are proposed across hardware integration, machine learning analytics, mobile application ecosystems, and logistics expansion:

### 7.2.1 Proposition 1: In-Vehicle IoT Telematics and Smart Keyless Access

The most transformative hardware proposition involves equipping the WeDRIVE rental vehicles with onboard Internet of Things (IoT) OBD-II telematics dongles and Bluetooth Low Energy (BLE) smart access controllers:

- **Keyless Mobile Handover:** By integrating BLE smart relays with the vehicle's central locking mechanism, authorized customers who hold a valid, paid digital booking pass could unlock and start the vehicle directly via their smartphone when within 5 meters of the vehicle. This would eliminate physical key handovers at the depot counter, enabling true 24/7 contactless self-service pickup and drop-off.
- **Automated Vehicle Telematics:** The OBD-II dongle would transmit real-time telemetry—including GPS coordinates, fuel gauge percentage, odometer readings, tire pressure, and engine diagnostic trouble codes (DTC)—directly to the Supabase PostgreSQL backend via cellular IoT (NB-IoT/LTE-M). This would automate vehicle condition auditing upon return and trigger predictive maintenance tickets before mechanical failures occur.

### 7.2.2 Proposition 2: Predictive Machine Learning for Dynamic Pricing & Demand Forecasting

While the current system implements administrative seasonal price toggles, future iterations should incorporate automated machine learning models for dynamic tariff optimization:

- **Predictive Demand Forecasting:** By training time-series forecasting models (e.g., Prophet or XGBoost) on historical Melaka tourism arrivals, public holiday calendars (e.g., Hari Raya, Chinese New Year, Melaka Historical City Day), and local hotel occupancy data, the system could predict vehicle demand spikes 30 to 60 days in advance.
- **Algorithmic Yield Management:** The pricing engine would dynamically optimize daily rental tariffs based on real-time vehicle availability, competitor rate scraping, and booking velocity, maximizing vehicle utilization and operator revenue while maintaining fair, transparent pricing for early-bird consumers.

### 7.2.3 Proposition 3: Native Mobile Application Ecosystem with Offline Digital Pass

While the responsive web application operates smoothly across mobile browsers, developing native mobile companion applications for iOS (SwiftUI) and Android (Kotlin/Flutter) would offer substantial user experience enhancements:

- **Apple Wallet & Google Wallet Integration:** Customers could add their cryptographically signed WeDRIVE Rental Pass directly into Apple Wallet or Google Wallet. This provides offline access to the booking QR code and pickup instructions even in basement parking structures with zero cellular connectivity.
- **Native Push Notifications & Live Activities:** Utilizing Apple iOS Live Activities and Dynamic Island widgets, renters could monitor a real-time countdown of their remaining rental duration, receive turn-by-turn navigation back to the Melaka Sentral depot, and receive instant alerts when return deadlines approach.

### 7.2.4 Proposition 4: Nationwide Depot Network Expansion & Multi-Branch Dispatch

Expanding the operational footprint of WeDRIVE from its Melaka headquarters into a nationwide mobility network represents a major commercial opportunity:

- **Transit Hub Gateways:** Establishing secondary depots at strategic transit gateways, including Kuala Lumpur International Airport (KLIA Terminal 1 & 2), Penang Sentral, and Johor Bahru Sentral.
- **Cross-Depot Drop-Off Routing:** Upgrading the booking engine to support one-way inter-city rentals, supported by automated vehicle redistribution algorithms that balance inventory across depots and calculate equitable relocation surcharges.

---

## 7.3 Project Contribution

The WeDRIVE project represents an impactful multidisciplinary software engineering endeavor that delivers tangible benefits across academia, the mobility industry, and the general public:

### 7.3.1 Contribution to the University and Faculty (FTMK, UTeM)

From an academic perspective, WeDRIVE demonstrates how theoretical knowledge in software engineering, distributed database management, user experience design, and artificial intelligence can be synthesized into a production-ready application:

- **Curriculum Demonstration:** The project serves as an exemplary case study for the Faculty of Information and Communication Technology (FTMK), Universiti Teknikal Malaysia Melaka (UTeM), illustrating the end-to-end realization of the Agile SDLC from formal requirement modeling (DFDs, Data Dictionaries) to hardened cloud implementation and automated Playwright E2E testing.
- **Benchmark for AI-Augmented Software Engineering:** WeDRIVE establishes an academic benchmark for integrating generative AI APIs (Google Gemini and xAI Grok) within strict domain guardrails, proving that modern web systems can deliver resilient, hallucination-free conversational interfaces.
- **Open Reference Repository:** The cleanly documented codebase, comprehensive Git SemVer release history, and modular architecture provide a valuable educational reference for future undergraduate and postgraduate students researching digital commerce and transport informatics.

### 7.3.2 Contribution to Industry and Local Car Rental Operators in Melaka

For car rental enterprises and local transport operators in Melaka, WeDRIVE delivers a modernized operational blueprint:

- **Elimination of Fragmented Manual Workflows:** The system replaces obsolete, error-prone manual administrative practices—such as recording bookings in physical logbooks or handling reservations through informal WhatsApp chats—with an automated, centralized cloud platform.
- **Conflict-Free Operational Turnover:** By enforcing deterministic calendar scheduling and strict vehicle status tracking, local operators eliminate customer dissatisfaction caused by accidental double-bookings.
- **Support for Regional Tourism Initiatives:** In alignment with state tourism campaigns (such as Visit Melaka Year), WeDRIVE offers international and out-of-state visitors a trustworthy, transparent digital booking channel that enhances the overall tourist mobility experience in Melaka.

### 7.3.3 Contribution to Individual Users and Society

On an individual consumer level, WeDRIVE delivers measurable improvements in accessibility, transparency, and digital convenience:

- **Empowered Decision-Making:** Consumers gain unprecedented visibility into vehicle condition through interactive 360-degree turntable views and detailed technical specifications, eliminating unpleasant surprises upon vehicle collection.
- **Transparent and Fair Pricing:** The clear itemization of base rental charges, optional accessories, and government taxes eliminates hidden fees and unexpected counter surcharges.
- **24/7 Bilingual Accessibility:** Domestic tourists and international visitors alike benefit from instantaneous conversational assistance in both English and Bahasa Melayu, democratizing access to reliable transportation regardless of time or language preference.

### 7.3.4 System Documentation and User Manual Reference

To ensure that the system's operational benefits can be readily realized by non-technical operators and end-users, an exhaustive, illustrated **WeDRIVE System User Manual** has been authored and is included in **Appendix A** of this report. The manual provides detailed, step-by-step visual walkthroughs for:

1. **Guest Exploration & Pricing Simulation:** Navigating the vehicle catalog, filtering by category, and calculating daily versus weekly rental glider savings.
2. **Customer Registration, 360° Studio & Booking:** Onboarding, interactive vehicle inspection, date selection, add-on configuration, payment checkout, and digital QR pass retrieval.
3. **Administrative Depot Management:** Managing vehicle inventory, executing the 3-step onboarding wizard, verifying customer KYC documents, monitoring live operations rosters, and inspecting AI analytics.

---

## 7.4 Conclusion

The development of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE) was undertaken to resolve the persistent inefficiencies, technological fragmentation, and customer distrust that characterize the traditional car rental sector in Melaka, Malaysia. Through systematic adherence to software engineering standards, user-centric interface design, and cloud-native architecture, the project has successfully addressed these challenges and achieved all formulated objectives.

### 7.4.1 Evaluation of Project Objectives

The project's success is substantiated by evaluating the degree of achievement for each specific objective established in Chapter 1:

*Table 7.1: Project Objectives Achievement Matrix*

| No. | Project Objective | Implementation Strategy & Modules | Empirical Verification & Outcome | Status |
|:---:|:---|:---|:---|:---:|
| **1** | **To analyze** the current challenges in car rental management systems in Malaysia and identify functional and non-functional requirements for an improved, integrated solution. | Conducted extensive domain investigation, comparative analysis of existing platforms (SOCAR, GoCar, KAYAK), and formulated detailed Context Diagrams, DFDs Level 0/1, and functional/non-functional specifications in Chapter 3. | Rigorous requirement traceability matrix established; 7 core functional modules and 5 non-functional parameters fully specified and mapped to design models. | **100% Achieved** |
| **2** | **To design and develop** a web-based AI-Assisted Car Rental Management System (WeDRIVE) with integrated chatbot support that provides a unified platform for vehicle browsing, booking management, car administration, and customer engagement. | Developed production web application hosted at `https://wedrive.website` utilizing Apple HIG Bento Grid UI, interactive 360° visual studio, Supabase PostgreSQL with RLS, and hybrid dual-model conversational AI (Google Gemini + xAI Grok fallback). | All 4 primary portals (Guest, Customer, Admin, Auth) and 20+ dedicated web interfaces fully operational, adhering to the Zero Oval Rule and bilingual parity. | **100% Achieved** |
| **3** | **To evaluate** the system's functionality, usability, and AI chatbot effectiveness through comprehensive testing, including unit testing, integration testing, and user acceptance testing. | Executed multi-layered testing regimen comprising automated Playwright CLI E2E test suites, ethical AI cybersecurity penetration testing (Strix Security Guardian), and User Acceptance Testing with 20 real users. | Automated test suite achieved a 100% pass rate (22/22 tests passed); zero critical/high security vulnerabilities; UAT evaluation yielded an outstanding SUS score of 86.5/100 (Grade A). | **100% Achieved** |

### 7.4.2 Concluding Remarks

In conclusion, WeDRIVE stands as a comprehensive, technically robust, and empirically validated solution that demonstrates the transformative potential of combining modern web engineering with generative artificial intelligence in the transportation domain. By bridging the gap between sophisticated rental operations management and intuitive consumer experiences, WeDRIVE not only fulfills its academic mandate as a Bachelor of Computer Science Final Year Project but also lays a resilient foundation for the next generation of smart urban mobility in Malaysia.
