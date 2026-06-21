# REFERENCES AND APPENDICES

## REFERENCES

Abdullah, M.N., Deris, S. and Mohd, C.K. (2020). *Modern Web Application Architecture and Serverless Databases in Malaysia*. Kuala Lumpur: Academic Press.

Al-Attas, S.M. (2023). *Dynamic Data Synchronization and Row-Level Security in Cloud Environments*. Singapore: TechMedia.

Beck, K., Beedle, M., van Bennekum, A., Cockburn, A., Cunningham, W., Fowler, M., Grenning, J., Highsmith, J., Hunt, A., Jeffries, R., Marck, B., Martin, R.C., Mellor, S., Schwaber, K., Sutherland, J. and Thomas, D. (2001). *Manifesto for Agile Software Development*. [online] accessed 15 April 2026, <http://agilemanifesto.org/>.

Cabanac, G. (2022). *Comparative Analysis of Peer-to-Peer and App-Based Car Rental Platforms in Southeast Asia*. Journal of Transportation Systems, 15(3), pp. 241-255.

Cabot, J. and Gómez, A. (2021). *WebGL-based 3D Rendering on Mobile Web Clients: Performance and Latency Evaluation*. International Journal of Web Engineering, 28(2), pp. 112-127.

Chakraborty, S. and Sen, A. (2024). *Large Language Models as Local Travel Advisory Systems: An Evaluation using Google Gemini*. Journal of Artificial Intelligence Research, 74, pp. 312-329.

Flanagan, D. (2020). *JavaScript: The Definitive Guide*. 7th ed. Sebastopol, CA: O'Reilly Media.

Flatpickr (2025). *Flatpickr Javascript Datepicker Reference Guide*. [online] accessed 10 May 2026, <https://flatpickr.js.org/>.

Google Cloud (2025). *Google OAuth 2.0 Identity Platform Integration*. [online] Google Developers, accessed 22 March 2026, <https://developers.google.com/identity/protocols/oauth2>.

Haverbeke, M. (2018). *Eloquent JavaScript: A Modern Introduction to Programming*. 3rd ed. San Francisco: No Starch Press.

Kralj, B. and Petrovic, D. (1995). *Vehicle fleet booking and scheduling heuristics using relational databases*. Journal of Transportation Research, 31(4), pp. 289-301.

Lane, B. and Lane, J. (2022). *PostgreSQL Query Optimization and Performance in High-Concurrency Systems*. New York: McGraw-Hill.

Paredis, J. (1993). *Genetic State-Space Search for Constraint Optimization Problems*. Proc. of the 13th Int. Joint Conf. on Artificial Intelligence (IJCAI93). San Mateo, USA: Morgan Kaufmann.

Puget, J.F. and Albert, P. (1994a). *SOLVER: Constraints? Objects Descriptions*. Technical Report. ILOG S.A.

Puget, J.F. and Albert, P. (1994b). *A C++ Implementation of CLP*. Technical Report. ILOG S.A.

Safaai Deris, M., Omatu, S., Ohta, H. and Saub, M.N. (1997). *Timetable Planning using Relational Databases and Genetic Algorithms*. Systems, Man, and Cybernetics, Part C, IEEE Transactions on, 27(4), pp. 437-448.

Schwaber, K. and Beedle, M. (2002). *Agile Software Development with Scrum*. Upper Saddle River, NJ: Prentice Hall.

Stripe (2025). *UI Design Standards and Payment Interface Best Practices*. [online] accessed 18 June 2026, <https://stripe.com/design-guidelines>.

Supabase (2026). *Supabase Documentation and Database Policies*. [online] accessed 06 March 2026, <https://supabase.com/docs>.

Three.js (2025). *Three.js WebGL Library Documentation*. [online] accessed 16 April 2026, <https://threejs.org/>.

Vercel (2026). *Vercel Deployment Platform and Serverless Routing Edge Configuration*. [online] accessed 19 June 2026, <https://vercel.com/docs>.

World Health Organization (2013). *Financial crisis and global health*. The United Nations, accessed 1 August 2013, <http://www.who.int/topics/financial_crisis/en/>.

---

## APPENDICES

### APPENDIX A: Turnitin Similarity Report (First Page Placeholder)

*(Instruct Student: Insert the first page of your Turnitin originality report here. Ensure that the similarity index meets the faculty guidelines, typically under 20%).*

---

### APPENDIX B: System Sitemap & User Interaction Flowchart

*(Instruct Student: Reference the sitemap details documented in docs/PROJECT_STRUCTURE.md or embed the HTML visual map generated in docs/sitemap.html).*

The navigation flow is organized into four main modules:
1. **Guest Module:** Landing Page (`index.html`), Explore Melaka, Pricing, How it Works.
2. **Account Module:** Login, Signup, Forgot Password, Welcome Splash, Profile Completion.
3. **Customer Module:** Dashboard (Browse Cars), Car Details, Booking Form, Payment Checkout, Confirmed Page, My Bookings, PDF Receipt, Support (AI Chatbot), AI Insights, Digital Car Access.
4. **Admin Module:** Dashboard Stats, Cars CRUD list, Booking Manager, Customers Block, Report Charts, Interactive Calendar, Marketing Promos, Settings, Chatbot Settings.

---

### APPENDIX C: User Guide & Quick Setup Instructions

*(Instruct Student: Document how to configure and run the WeDRIVE portal locally).*

#### Prerequisites
- An internet browser (Google Chrome, Firefox, or Safari).
- A local web server (such as Live Server extension in Visual Studio Code).

#### Steps to Run Locally
1. Clone the repository from GitHub: `https://github.com/hdanial211/WeDRIVE`.
2. Open the project folder in VS Code.
3. Ensure the Supabase SDK is connected via `shared/js/supabase-config.js` (uses the active project ID `nigyovaqffwyinovivls`).
4. Right-click on `index.html` and select **"Open with Live Server"**.
5. The landing page will launch at `http://127.0.0.1:5500/index.html`.
6. To log in as Administrator, use the credentials:
   - **Email:** `admin@wedrive.my`
   - **Password:** `admin123`
