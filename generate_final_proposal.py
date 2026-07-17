import docx
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT, WD_TAB_LEADER

doc = docx.Document()

title = doc.add_heading('Project Proposal', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_paragraph('Sri Lanka Institute of Advanced Technological Education (SLIATE)').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Advanced Technological Institute-Kurunegala').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Higher National Diploma in Information Technology').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Batch-2324(FT)').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Indoor Sports Court Booking System').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('IT4052 | ICT Project (Individual)').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('Supervisor: Ms.K.G.D.De.A Wijesinghe').alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('M.R. Reema | KUR/IT/2324/F/0113').alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.add_page_break()

doc.add_heading('Table of Content', level=1)

toc_items = [
    ('1. Problem Statement', '3'),
    ('2. Objectives and Goals', '4'),
    ('3. Proposed Solution / Approach', '5'),
    ('   3.1. Overview of the Proposed Solution', '5'),
    ('   3.2. Dual Booking Mechanism', '5'),
    ('   3.3. Real-Time Availability Module', '5'),
    ('   3.4. Cancellation Management System', '5'),
    ('   3.5. Admin Control Panel', '6'),
    ('   3.6. Automated Email Notifications', '6'),
    ('4. Scope and Limitations', '7'),
    ('   4.1. Scope of the Project', '7'),
    ('   4.2. Limitations of the Project', '7'),
    ('5. Methodology', '8'),
    ('   5.1. Software Development Approach', '8'),
    ('   5.2. System Design', '8'),
    ('   5.3. Data Collection and Processing', '8'),
    ('   5.4. Availability Checking Implementation', '8'),
    ('   5.5. Booking and Cancellation Flow', '9'),
    ('   5.6. System Implementation', '9'),
    ('   5.7. Testing and Evaluation', '9'),
    ('6. Timeline and Milestones', '10'),
    ('7. Resources and Budget', '11'),
    ('   7.1. Resources', '11'),
    ('   7.1.1. Hardware Requirements', '11'),
    ('   7.1.2. Software Requirements', '11'),
    ('   7.2. Budget', '11'),
    ('8. Literature Review', '12'),
    ('   8.1. Existing Systems and Research', '12'),
    ('   8.2. Real-Time Database Technologies in Web Applications', '12'),
    ('   8.3. User Experience in Booking Systems', '12'),
    ('   8.4. Role-Based Access Control in Web Systems', '12'),
    ('   8.5. Research Gap', '13'),
    ('9. References', '14')
]

for item, page in toc_items:
    p = doc.add_paragraph()
    p.paragraph_format.tab_stops.add_tab_stop(Inches(6.25), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
    p.add_run(item + '\t' + page)

doc.add_page_break()

# Detailed Sections
doc.add_heading('1. Problem Statement', level=1)
doc.add_paragraph('In Sri Lanka, the management of indoor recreational facilities currently suffers from a lack of technological integration. Most sports venues continue to rely on antiquated, manual methods such as ledger books, walk-in reservations, or informal phone calls. This traditional approach leads to numerous operational bottlenecks. Scheduling conflicts frequently result in double-booking the same court, leading to customer dissatisfaction. Furthermore, customers have no way to view real-time availability without physically visiting the venue or making multiple phone calls. Venue managers spend an excessive amount of time manually recording data, calculating payments, and managing cancellations. There is an urgent need for an automated, accessible, and user-friendly platform that bridges the gap between sports enthusiasts seeking convenience and venue operators needing operational efficiency.')

doc.add_heading('2. Objectives and Goals', level=1)
doc.add_paragraph('Primary Objective:', style='List Bullet')
doc.add_paragraph('To architect and deploy a comprehensive web-based Indoor Sports Court Booking System that facilitates real-time reservations, intelligent availability tracking, and streamlined venue management.')
doc.add_paragraph('Specific Objectives:', style='List Bullet')
doc.add_paragraph('To design an intuitive UI that allows customers to effortlessly browse courts, check real-time availability, and secure bookings.', style='List Bullet')
doc.add_paragraph('To implement a sophisticated dual booking mechanism supporting both flexible Time-Based Booking and Package-Based Booking.', style='List Bullet')
doc.add_paragraph('To engineer a conflict-free, real-time availability engine utilizing Firebase Firestore to instantly lock slots upon confirmation.', style='List Bullet')
doc.add_paragraph('To develop a secure, role-based Admin Control Panel equipped with data visualization dashboards.', style='List Bullet')
doc.add_paragraph('To automate the customer communication process by integrating automated email confirmations and cancellation notices.', style='List Bullet')

doc.add_heading('3. Proposed Solution / Approach', level=1)
doc.add_heading('3.1. Overview of the Proposed Solution', level=2)
doc.add_paragraph('The proposed system will be a dynamic web platform built using React (frontend) and Firebase (backend). It supports two primary user roles: Customers (general users) and Administrators (venue managers). Customers get a fast, intuitive portal to book courts, while administrators get a command center to oversee daily operations and revenue.')
doc.add_heading('3.2. Dual Booking Mechanism', level=2)
doc.add_paragraph('Time-Based Booking allows customers to select a specific start and end time. Package-Based Booking allows customers to select discounted predefined packages (e.g., 3-hour bundles) automatically calculating end times.')
doc.add_heading('3.3. Real-Time Availability Module', level=2)
doc.add_paragraph('Leveraging WebSockets and Firebase Firestore, any booking made by a user will instantly update the availability calendar for all other users, completely eliminating double bookings in real time.')
doc.add_heading('3.4. Cancellation Management System', level=2)
doc.add_paragraph('Customers can seamlessly cancel their bookings prior to the start time from their dashboard, automatically releasing the slot back to the public pool.')
doc.add_heading('3.5. Admin Control Panel', level=2)
doc.add_paragraph('Administrators can manage the entire system, including editing court prices, creating new packages, blocking slots for maintenance, and viewing daily revenue analytics.')
doc.add_heading('3.6. Automated Email Notifications', level=2)
doc.add_paragraph('Integration with EmailJS ensures customers receive immediate, automated email receipts upon booking confirmation or cancellation.')

doc.add_heading('4. Scope and Limitations', level=1)
doc.add_heading('4.1. Scope of the Project', level=2)
doc.add_paragraph('The system will cover full user authentication (Firebase Auth), real-time booking flows, email notifications, role-based dashboards, and a complete CRUD interface for venue management.')
doc.add_heading('4.2. Limitations of the Project', level=2)
doc.add_paragraph('The system will not feature an integrated online payment gateway in this iteration (payments are handled on-site). It is currently optimized for single-venue management and does not support multi-branch networking natively.')

doc.add_heading('5. Methodology', level=1)
doc.add_heading('5.1. Software Development Approach', level=2)
doc.add_paragraph('Development will strictly follow the Agile Scrum framework, broken down into two-week sprints. This enables iterative testing and continuous UI/UX improvements based on feedback.')
doc.add_heading('5.2. System Design', level=2)
doc.add_paragraph('The architecture relies on a Serverless model: Presentation Layer (React), Application Logic (Node.js/Firebase Functions), and Data Layer (Firebase Firestore).')
doc.add_heading('5.3. Data Collection and Processing', level=2)
doc.add_paragraph('The system collects user booking habits, peak hours, and cancellation trends. This data is processed securely and presented to administrators as actionable graphs to optimize pricing strategies.')
doc.add_heading('5.4. Availability Checking Implementation', level=2)
doc.add_paragraph('The algorithm queries the Firestore collection for overlapping confirmed bookings. Blocked slots set by administrators are also dynamically fetched during checkout.')
doc.add_heading('5.5. Booking and Cancellation Flow', level=2)
doc.add_paragraph('Multi-step form architecture guides the user visually. Cancellations trigger a transactional database update, avoiding race conditions.')
doc.add_heading('5.6. System Implementation', level=2)
doc.add_paragraph('Technologies include React.js, Firebase Authentication, Firestore NoSQL, Node.js, Tailwind CSS/Bootstrap, and EmailJS.')
doc.add_heading('5.7. Testing and Evaluation', level=2)
doc.add_paragraph('Extensive unit testing and QA will be performed to ensure responsiveness across all mobile and desktop browsers, along with database stress-testing for concurrent bookings.')

doc.add_heading('6. Timeline and Milestones', level=1)
doc.add_paragraph('Week 1-2: Requirements Gathering and UI/UX Prototyping\nWeek 3-4: Database Setup, Authentication, and Customer Frontend\nWeek 5-6: Booking Engine Logic and Real-time Availability\nWeek 7-8: Admin Dashboard and Email Integration\nWeek 9-10: System Testing, Evaluation, and Documentation')

doc.add_heading('7. Resources and Budget', level=1)
doc.add_heading('7.1. Resources', level=2)
doc.add_heading('7.1.1. Hardware Requirements', level=3)
doc.add_paragraph('Personal Computer/Laptop, Smartphone for responsiveness testing, Reliable Internet Connection.')
doc.add_heading('7.1.2. Software Requirements', level=3)
doc.add_paragraph('React, Node.js, Firebase Platform, VS Code Editor, Git and GitHub for version control.')
doc.add_heading('7.2. Budget', level=2)
doc.add_paragraph('Development Tools: Open Source (0 LKR)\nDatabase and Hosting: Firebase Free Spark Plan (0 LKR)\nMiscellaneous (Printing, Internet): ~5,000 LKR\nTotal Estimated Budget: 5,000 LKR')

doc.add_heading('8. Literature Review', level=1)
doc.add_heading('8.1. Existing Systems and Research', level=2)
doc.add_paragraph('Recent studies in facility management emphasize that digital reservation systems can increase facility utilization by up to 35%. Existing local systems are largely paper-based.')
doc.add_heading('8.2. Real-Time Database Technologies in Web Applications', level=2)
doc.add_paragraph('Firebase Firestore is proven to be the most efficient NoSQL database for handling concurrent reads and writes, making it ideal for booking engines.')
doc.add_heading('8.3. User Experience in Booking Systems', level=2)
doc.add_paragraph('Research on UI/UX indicates that multi-step, visually guided forms drastically reduce user abandonment during checkout flows.')
doc.add_heading('8.4. Role-Based Access Control in Web Systems', level=2)
doc.add_paragraph('Firebase Authentication securely separates Customer and Administrator privileges through custom claims.')
doc.add_heading('8.5. Research Gap', level=2)
doc.add_paragraph('Most commercial systems are too expensive for small Sri Lankan venues. This project provides a robust, low-cost, tailored alternative.')

doc.add_heading('9. References', level=1)
doc.add_paragraph('1. Firebase Documentation (2025). Cloud Firestore.\n2. React Documentation (2025).\n3. Bootstrap/Tailwind Documentation (2025).\n4. EmailJS (2025). EmailJS Documentation.\n5. Pressman, R.S. (2014). Software Engineering: A Practitioners Approach.')

doc.save(r'C:\Users\Administrator\Desktop\Final_Aligned_Project_Proposal.docx')
doc.save(r'C:\finalproject\Final_Aligned_Project_Proposal.docx')
