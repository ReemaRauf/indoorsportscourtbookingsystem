import docx
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = docx.Document()

title = doc.add_heading('Comprehensive Project Proposal', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph('Sri Lanka Institute of Advanced Technological Education (SLIATE)').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Advanced Technological Institute-Kurunegala').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Higher National Diploma in Information Technology').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Batch-2324(FT)').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Next-Gen Indoor Sports Court Booking System').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('IT4052 | ICT Project (Individual)').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Supervisor: Ms.K.G.D.De.A Wijesinghe').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('M.R. Reema | KUR/IT/2324/F/0113').alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_page_break()

doc.add_heading('Table of Content', level=1)
toc_items = [
    '1. Executive Summary',
    '2. Problem Statement and Background',
    '3. Objectives and Goals',
    '4. Target Audience and Stakeholders',
    '5. Proposed Solution and Key Features',
    '6. System Architecture and Design',
    '7. Scope and Limitations',
    '8. Feasibility Study',
    '9. Methodology',
    '10. Timeline and Milestones',
    '11. Resources, Budget, and Risk Management',
    '12. Literature Review',
    '13. Conclusion',
    '14. References'
]
for item in toc_items:
    doc.add_paragraph(item)

doc.add_page_break()

doc.add_heading('1. Executive Summary', level=1)
doc.add_paragraph('This proposal outlines the development of a state-of-the-art, web-based Indoor Sports Court Booking System. The project aims to revolutionize the way indoor sports facilities in Sri Lanka manage their reservations by digitizing the entire process. By utilizing modern web technologies like React and Firebase, this system will eliminate the inefficiencies of manual booking methods, provide customers with a seamless reservation experience, and equip venue administrators with robust management tools to oversee operations, track revenue, and manage customer data effectively.')

doc.add_heading('2. Problem Statement and Background', level=1)
doc.add_paragraph('In Sri Lanka, the management of indoor recreational facilities currently suffers from a lack of technological integration. Most sports venues continue to rely on antiquated, manual methods such as ledger books, walk-in reservations, or informal phone calls. This traditional approach leads to numerous operational bottlenecks:')
doc.add_paragraph('1. Scheduling Conflicts: Manual tracking frequently results in double-booking the same court, leading to customer dissatisfaction.', style='List Bullet')
doc.add_paragraph('2. Lack of Transparency: Customers have no way to view real-time availability without physically visiting the venue or making multiple phone calls.', style='List Bullet')
doc.add_paragraph('3. Administrative Overhead: Venue managers spend an excessive amount of time manually recording data, calculating payments, and managing cancellations.', style='List Bullet')
doc.add_paragraph('4. Revenue Leakage: Without a centralized digital record, it is incredibly difficult for owners to audit their daily earnings or generate financial reports.', style='List Bullet')
doc.add_paragraph('There is an urgent need for an automated, accessible, and user-friendly platform that bridges the gap between sports enthusiasts seeking convenience and venue operators needing operational efficiency.')

doc.add_heading('3. Objectives and Goals', level=1)
doc.add_heading('3.1 Primary Objective', level=2)
doc.add_paragraph('To architect and deploy a comprehensive web-based Indoor Sports Court Booking System that facilitates real-time reservations, intelligent availability tracking, and streamlined venue management.')
doc.add_heading('3.2 Specific Objectives', level=2)
doc.add_paragraph('To design an intuitive user interface (UI) that allows customers to effortlessly browse courts, check real-time availability, and secure bookings.', style='List Bullet')
doc.add_paragraph('To implement a sophisticated dual booking mechanism supporting both flexible Time-Based Booking and discounted Package-Based Booking.', style='List Bullet')
doc.add_paragraph('To engineer a conflict-free, real-time availability engine utilizing Firebase Firestore to instantly lock slots upon confirmation.', style='List Bullet')
doc.add_paragraph('To develop a secure, role-based Admin Control Panel equipped with data visualization dashboards for monitoring venue performance.', style='List Bullet')
doc.add_paragraph('To automate the customer communication process by integrating automated email confirmations and cancellation notices.', style='List Bullet')

doc.add_heading('4. Target Audience and Stakeholders', level=1)
doc.add_paragraph('The system is designed to serve two primary user groups:')
doc.add_paragraph('1. Sports Enthusiasts (Customers): Individuals or teams looking to book courts (Badminton, Cricket, Futsal, etc.) for recreational or professional practice. They require a mobile-responsive, fast, and transparent platform to secure their play time.', style='List Bullet')
doc.add_paragraph('2. Venue Administrators (Managers): Facility owners and staff members who need a reliable dashboard to manage daily operations, block courts for maintenance, oversee customer bookings, and analyse financial performance.', style='List Bullet')

doc.add_heading('5. Proposed Solution and Key Features', level=1)
doc.add_paragraph('The proposed system will be a dynamic Single Page Application (SPA) providing a frictionless journey from court discovery to booking confirmation.')
doc.add_heading('5.1 Comprehensive Dashboard', level=2)
doc.add_paragraph('Customers will have a My Bookings portal to track upcoming sessions, view past history, and manage cancellations. Administrators will have a Command Center displaying daily active bookings, revenue metrics, and system alerts.')
doc.add_heading('5.2 Real-Time Synchronization', level=2)
doc.add_paragraph('By leveraging WebSockets and Firebase real-time listeners, any booking made by User A will instantly update the availability calendar for User B, completely eliminating the possibility of double bookings.')
doc.add_heading('5.3 Dynamic Pricing and Packages', level=2)
doc.add_paragraph('Administrators can configure peak and off-peak pricing, as well as create bundle packages (e.g., Book 3 hours, get 10% off) to incentivize longer playtime.')

doc.add_heading('6. System Architecture and Design', level=1)
doc.add_paragraph('The system will adopt a modern Serverless Architecture to ensure high availability and scalability.')
doc.add_paragraph('- Presentation Layer: Built with React.js, ensuring a highly responsive and interactive user experience across desktop and mobile devices.', style='List Bullet')
doc.add_paragraph('- Application Logic Layer: Node.js and Firebase Cloud Functions will handle secure operations such as booking validation, sending emails, and processing cancellations.', style='List Bullet')
doc.add_paragraph('- Data Layer: Firebase Firestore (NoSQL) will be utilized for its superior real-time data syncing capabilities, with Firebase Authentication handling secure user login.', style='List Bullet')

doc.add_heading('7. Scope and Limitations', level=1)
doc.add_heading('7.1 Scope', level=2)
doc.add_paragraph('The system will cover full user authentication, real-time booking flows, email notifications, role-based dashboards, and basic analytical reporting for administrators.')
doc.add_heading('7.2 Limitations', level=2)
doc.add_paragraph('In this initial phase, the system will not feature an integrated online payment gateway (payments will be settled at the venue). Additionally, the system is optimized for single-venue management and does not currently support franchise or multi-branch networking.')

doc.add_heading('8. Feasibility Study', level=1)
doc.add_paragraph('- Technical Feasibility: The selected tech stack (React/Firebase) is highly documented and well-supported, ensuring smooth development.', style='List Bullet')
doc.add_paragraph('- Economic Feasibility: Utilizing open-source libraries and cloud platforms with generous free tiers minimizes initial capital expenditure.', style='List Bullet')
doc.add_paragraph('- Operational Feasibility: The intuitive design guarantees a low learning curve for both administrators and customers, ensuring high adoption rates.', style='List Bullet')

doc.add_heading('9. Methodology', level=1)
doc.add_paragraph('Development will strictly follow the Agile Scrum framework. The project will be divided into two-week sprints. Sprint 1 will focus on UI/UX wireframing and database design. Sprint 2 will cover Authentication and the core Booking Engine. Sprint 3 will involve the Admin Dashboard and Notifications. Sprint 4 will be dedicated to rigorous Quality Assurance (QA) testing, bug fixing, and final deployment.')

doc.add_heading('10. Timeline and Milestones', level=1)
doc.add_paragraph('Week 1-2: Requirements Gathering and UI/UX Prototyping\nWeek 3-4: Database Setup, Authentication, and Customer Frontend\nWeek 5-6: Booking Engine Logic and Real-time Availability\nWeek 7-8: Admin Dashboard and Email Integration\nWeek 9-10: System Testing, Evaluation, and Documentation')

doc.add_heading('11. Resources, Budget, and Risk Management', level=1)
doc.add_heading('11.1 Budget', level=2)
doc.add_paragraph('Development Tools: Open Source (0 LKR)\nHosting/Database: Firebase Spark Plan (0 LKR)\nMiscellaneous (Documentation, Internet, Testing): ~5,000 LKR\nTotal Estimated Budget: 5,000 LKR')
doc.add_heading('11.2 Risk Management', level=2)
doc.add_paragraph('Potential risks include internet connectivity dropouts during a booking and data loss. These are mitigated by Firebase robust offline-sync capabilities and automatic cloud backups.')

doc.add_heading('12. Literature Review', level=1)
doc.add_paragraph('Recent studies in IT facility management emphasize that transitioning from manual to digital reservation systems can increase facility utilization by up to 35%. Furthermore, research on UI/UX indicates that multi-step, visually guided forms drastically reduce user abandonment. This project integrates these findings by providing a visually appealing, multi-step booking wizard and utilizing a robust real-time database infrastructure.')

doc.add_heading('13. Conclusion', level=1)
doc.add_paragraph('The Next-Gen Indoor Sports Court Booking System represents a significant technological leap for local sports facility management. By providing a reliable, real-time, and user-centric platform, the system promises to eliminate current operational headaches, drive up facility usage, and significantly enhance the customer experience.')

doc.add_heading('14. References', level=1)
doc.add_paragraph('1. Firebase Documentation (2025). Cloud Firestore.\n2. React Documentation (2025).\n3. Tailwind CSS & Bootstrap Documentation (2025).\n4. EmailJS (2025). EmailJS Documentation.\n5. Pressman, R.S. (2014). Software Engineering: A Practitioners Approach.')

doc.save(r'C:\Users\Administrator\Desktop\New_Project_Proposal_Expanded.docx')
doc.save(r'C:\finalproject\Indoor_Sports_Court_Booking_Proposal_Expanded.docx')
