# Project Proposal

**Sri Lanka Institute of Advanced Technological Education (SLIATE)**
**Advanced Technological Institute-Kurunegala**
**Higher National Diploma in Information Technology**
**Batch-2324(FT)**

## Indoor Sports Court Booking System

**IT4052 | ICT Project (Individual)**

**Supervisor:** Ms.K.G.D.De.A Wijesinghe  
**Student:** M.R. Reema | KUR/IT/2324/F/0113

---

## Table of Content
1. Problem Statement
2. Objectives and Goals
3. Proposed Solution / Approach
4. Scope and Limitations
5. Methodology
6. Timeline and Milestones
7. Resources and Budget
8. Literature Review
9. References

---

## 1. Problem Statement
The current recreational sports and indoor courts facilities in Sri Lanka lack an efficient and transparent booking mechanism. Most venues rely on walk-in customers or informal phone-based reservations, which result in scheduling conflicts, overbooking, and poor customer experience.

Players and sports enthusiasts face difficulties in checking real-time availability of sports courts and slots for sports courts such as Cricket court, Badminton court, Table Tennis court. Without a centralized system, customers often travel to a venue only to find slots already occupied, resulting in wasted time and frustration.

Venue administrators also face operational challenges including manual record-keeping, difficulty in managing multiple bookings across different game types, and an inability to track revenue or analyse booking trends over time.

Furthermore, the absence of a structured cancellation and refund process creates disputes between players and venue management. There is a clear need for a digital, real-time indoor sports court booking platform that provides convenience to customers while improving operational efficiency for venue administrators.

## 2. Objectives and Goals

**Primary Objective:**
* To develop a web-based Indoor Sports Court Booking System using React and Firebase that enables customers to book, manage, and cancel game slots in real time, while providing administrators with full management capabilities.

**Specific Objectives:**
* To design and develop a user-friendly platform that allows customers to browse available courts, check real-time slot availability, and complete bookings online.
* To implement a dual booking mechanism supporting both Time-Based Booking and Package-Based Booking.
* To develop a real-time availability checking system that prevents double bookings.
* To implement a cancellation management system.
* To build a comprehensive admin panel for venue management.
* To provide automated email notifications for bookings.
* To ensure transparency in the booking process by displaying accurate pricing and availability.

## 3. Proposed Solution / Approach

### 3.1. Overview of the Proposed Solution
This project proposes the development of an Indoor Sports Court Booking System as a web-based platform built using React (frontend) and Firebase (backend and database). The platform supports two distinct user roles: Customers (general users) and Administrators (venue managers).

### 3.2. Dual Booking Mechanism
* **Time-Based Booking:** Customers select a specific start and end time.
* **Package-Based Booking:** Customers select predefined packages.

### 3.3. Real-Time Availability Module
Firebase Firestore is used to manage slot data in real time, immediately reflecting availability status to prevent overlapping bookings.

### 3.4. Cancellation Management System
Customers can cancel bookings prior to start time, automatically releasing the slot.

### 3.5. Admin Control Panel
Allows management of Courts, Packages, Availability, and Bookings.

### 3.6. Automated Email Notifications
Email notifications for successful bookings with full details.

## 4. Scope and Limitations

### 4.1. Scope of the Project
* Customer registration, login via Firebase Authentication
* Courts browsing with real-time availability checking
* Dual booking flow (Time-Based and Package-Based)
* My Bookings dashboard and Automated email confirmation
* Admin panel with full CRUD capabilities
* Responsive web interface using React

### 4.2. Limitations of the Project
* Limited to web-based access; no dedicated mobile application.
* Online payment gateway integration is not included.
* Availability operates on an hourly slot basis.
* Does not support multi-venue or multi-branch management.

## 5. Methodology

### 5.1. Software Development Approach
Adopts the Agile Software Development Life Cycle (SDLC) methodology for iterative development and continuous refinement.

### 5.2. System Design
Frontend Layer (React), Backend Layer (Node.js), and Database Layer (Firebase Firestore).

### 5.3. System Implementation
* **Frontend:** React
* **Backend & Database:** Node.js, Firebase
* **Tools:** VS Code, Google Chrome, Git & GitHub

## 6. Timeline and Milestones
[Timeline and milestones to be added based on the academic schedule]

## 7. Resources and Budget

### 7.1. Resources
* **Hardware:** Personal Computer/Laptop, Smartphone, Internet Connection.
* **Software:** React, Node.js, Firebase, VS Code, Google Chrome, Git/GitHub.

### 7.2. Budget
The total estimated cost is approximately 2,000 LKR (primarily for miscellaneous expenses like printing and documentation) as most software and platforms used have free tiers or are open-source.

## 8. Literature Review
Existing systems worldwide improve operational efficiency, but in Sri Lanka, most are paper-based or informal. Using real-time databases like Firebase and structured UX approaches (multi-step flows) fills this gap for small-to-medium indoor sports courts.

## 9. References
1. Firebase Documentation (2025). Cloud Firestore.
2. React Documentation (2025).
3. Bootstrap Team (2025). Bootstrap Documentation.
4. EmailJS (2025). EmailJS Documentation.
