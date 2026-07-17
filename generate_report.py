
# generate_report.py
# Generates a professional .docx project report for the Indoor Sport Courts Booking System
# matching the style of the ReliefNet project report.

from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

doc = Document()

# ─── Page Margins ──────────────────────────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin   = Inches(1.25)
    section.right_margin  = Inches(1.25)

# ─── Helper Functions ──────────────────────────────────────────────────────────
def set_font(run, name="Times New Roman", size=12, bold=False, italic=False, color=None):
    run.font.name = name
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    if color:
        run.font.color.rgb = RGBColor(*color)

def add_paragraph(text, style=None, alignment=WD_ALIGN_PARAGRAPH.LEFT,
                  font_size=12, bold=False, italic=False, space_before=0, space_after=6, color=None):
    p = doc.add_paragraph(style=style) if style else doc.add_paragraph()
    p.alignment = alignment
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after  = Pt(space_after)
    run = p.add_run(text)
    set_font(run, size=font_size, bold=bold, italic=italic, color=color)
    return p

def add_heading1(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after  = Pt(6)
    run = p.add_run(text)
    set_font(run, size=14, bold=True)
    # Underline heading
    run.underline = True
    return p

def add_heading2(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after  = Pt(4)
    run = p.add_run(text)
    set_font(run, size=12, bold=True)
    return p

def add_heading3(text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after  = Pt(3)
    run = p.add_run(text)
    set_font(run, size=12, bold=True, italic=True)
    return p

def add_body(text, space_after=6, indent=False):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_after = Pt(space_after)
    if indent:
        p.paragraph_format.first_line_indent = Inches(0.25)
    run = p.add_run(text)
    set_font(run, size=12)
    return p

def add_bullet(text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(text)
    set_font(run, size=12)
    return p

def add_page_break():
    doc.add_page_break()

def add_figure_placeholder(fig_num, caption, width_inches=5.5):
    """Adds a grey placeholder box for a figure with caption below."""
    # Thin grey bordered paragraph as placeholder
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after  = Pt(2)

    # Draw a grey box using a shaded table cell
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(width_inches)

    # Set cell height and shading
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'D9D9D9')
    tcPr.append(shd)

    # Set cell minimum height
    trPr = tbl.rows[0]._tr.get_or_add_trPr()
    trHeight = OxmlElement('w:trHeight')
    trHeight.set(qn('w:val'), '1500')
    trPr.append(trHeight)

    cell_p = cell.paragraphs[0]
    cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cell_run = cell_p.add_run("[Screenshot Placeholder]")
    set_font(cell_run, size=10, italic=True, color=(128, 128, 128))

    # Caption
    cap_p = doc.add_paragraph()
    cap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap_p.paragraph_format.space_before = Pt(4)
    cap_p.paragraph_format.space_after  = Pt(10)
    cap_run = cap_p.add_run(caption)
    set_font(cap_run, size=10, italic=True)
    return tbl

def add_two_figures(fig1_num, fig1_caption, fig2_num, fig2_caption):
    """Adds two side-by-side figure placeholders in a 2-column table."""
    tbl = doc.add_table(rows=2, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER

    for col_idx, (num, cap) in enumerate([(fig1_num, fig1_caption), (fig2_num, fig2_caption)]):
        # Figure box cell
        cell = tbl.cell(0, col_idx)
        tc = cell._tc
        tcPr = tc.get_or_add_tcPr()
        shd = OxmlElement('w:shd')
        shd.set(qn('w:val'), 'clear')
        shd.set(qn('w:color'), 'auto')
        shd.set(qn('w:fill'), 'D9D9D9')
        tcPr.append(shd)

        trPr = tbl.rows[0]._tr.get_or_add_trPr()
        trHeight = OxmlElement('w:trHeight')
        trHeight.set(qn('w:val'), '1440')
        trPr.append(trHeight)

        cell_p = cell.paragraphs[0]
        cell_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cell_run = cell_p.add_run(f"[Screenshot Placeholder]")
        set_font(cell_run, size=9, italic=True, color=(100, 100, 100))

        # Caption cell
        cap_cell = tbl.cell(1, col_idx)
        cap_p = cap_cell.paragraphs[0]
        cap_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        cap_run = cap_p.add_run(f"{num} – {cap}")
        set_font(cap_run, size=10, italic=True)
        cap_p.paragraph_format.space_after = Pt(8)

    sp = doc.add_paragraph()
    sp.paragraph_format.space_after = Pt(6)

def add_table_row(tbl, cells_data, bold=False, bg_color=None):
    row = tbl.add_row()
    for i, text in enumerate(cells_data):
        cell = row.cells[i]
        p = cell.paragraphs[0]
        run = p.add_run(text)
        set_font(run, size=11, bold=bold)
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after  = Pt(3)
        if bg_color:
            tc = cell._tc
            tcPr = tc.get_or_add_tcPr()
            shd = OxmlElement('w:shd')
            shd.set(qn('w:val'), 'clear')
            shd.set(qn('w:color'), 'auto')
            shd.set(qn('w:fill'), bg_color)
            tcPr.append(shd)
    return row


# ══════════════════════════════════════════════════════════════════════════════
# COVER PAGE
# ══════════════════════════════════════════════════════════════════════════════

add_paragraph("Sri Lanka Institute of Advanced Technological Education (SLIATE)",
              alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, bold=True, space_after=4)
add_paragraph("Advanced Technological Institute – Kurunegala",
              alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=4)
add_paragraph("Higher National Diploma in Information Technology",
              alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=24)
add_paragraph("Batch-2324(FT)",
              alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=48)

add_paragraph(
    "Indoorsport: A Comprehensive Indoor Sports Court Booking and Management Platform",
    alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=16, bold=True, space_after=12)

add_paragraph("Project Report", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, bold=True, space_after=6)
add_paragraph("IT4052 | ICT Project", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=48)

add_paragraph("Supervisor", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, bold=True, space_after=4)
add_paragraph("Ms. P.G.R.N.J Gamlath", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=24)

add_paragraph("[Your Full Name]  –  KUR/IT/2324/F/[Your Index]",
              alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=4)

# Page number placeholder
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(60)
run = p.add_run("1")
set_font(run, size=12)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 2 — Blank (matches ReliefNet structure: page 2 is blank)
# ══════════════════════════════════════════════════════════════════════════════
add_paragraph("", space_after=0)
add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# ACKNOWLEDGEMENT
# ══════════════════════════════════════════════════════════════════════════════
add_paragraph("Acknowledgement", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, bold=True, space_after=12)

add_body(
    "I'm sincerely grateful to my supervisor, Ms. P.G.R.N.J. Gamlath, for her guidance and patience throughout this project. "
    "Her feedback at every milestone review pushed Indoorsport from a rough idea into something I could actually demonstrate and document properly.",
    indent=True
)
add_body(
    "I'd also like to thank the Advanced Technological Institute – Kurunegala and SLIATE for the academic environment and resources that "
    "made this IT4052 project possible in the first place.",
    indent=True
)
add_body(
    "Thanks as well to my HNDIT batchmates in Batch 2324(FT) – the technical discussions with them got me past more than a few "
    "implementation dead ends.",
    indent=True
)
add_body(
    "And finally, thank you to my family and friends for putting up with me through this whole process.",
    indent=True
)

doc.add_paragraph()
add_paragraph("[Your Full Name]", font_size=12, space_after=2)
add_paragraph("KUR/IT/2324/F/[Your Index]", font_size=12, space_after=0)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(200)
run = p.add_run("3")
set_font(run, size=12)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 4 — Blank
# ══════════════════════════════════════════════════════════════════════════════
add_paragraph("", space_after=0)
add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# ABSTRACT
# ══════════════════════════════════════════════════════════════════════════════
add_paragraph("Abstract", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, bold=True, space_after=12)

add_body(
    "Managing sports complexes often involves manual booking processes, disjointed coach scheduling, fragmented equipment rental, and no clear "
    "way for customers to check real-time availability or pay securely online. Facility operators rely on phone calls, spreadsheets, and ledgers "
    "to manage court allocations, which leads to double bookings, scheduling conflicts, and revenue leakage. The booking systems that already exist "
    "only solve pieces of this: some handle court reservations but ignore coaching, others manage payments but lack inventory tracking, and none of "
    "them bring together court scheduling, coach availability, equipment rental, membership packages, and secure online payments in one place.",
    indent=True
)
add_body(
    "Indoorsport is a React and Node.js web application built to close that gap, giving sports complex operators a single platform to manage every "
    "aspect of their facility while letting players self-serve their bookings. It supports two roles – User and Admin – each routed to its own "
    "interface after sign-in. Users can browse available courts, view coach profiles, rent equipment, and book time-based or package-based sessions, "
    "with a real-time availability engine that prevents scheduling conflicts before they happen. Every booking flows through a Stripe-powered checkout "
    "for secure advance payments, and automated email confirmations are dispatched via Nodemailer at every stage of the booking lifecycle – "
    "confirmation, cancellation, and rejection.",
    indent=True
)
add_body(
    "The admin side provides a full management dashboard covering court and coach CRUD operations, equipment inventory tracking, package management, "
    "booking approval workflows with approve/reject/cancel actions, user management with wallet balance tracking, coach leave management, payment "
    "oversight, and a comprehensive analytics and reporting module with monthly revenue breakdowns. Development followed a component-driven approach: "
    "the React frontend was built with Vite for fast development iteration, styled with Tailwind CSS for a fully responsive layout, and connected to "
    "a Node.js/Express REST API backed by Cloud Firestore for scalable, real-time data storage.",
    indent=True
)
add_body(
    "This report covers the requirement specification, system design, database structure, and architecture of Indoorsport as built, and demonstrates "
    "that a well-designed web platform can meaningfully streamline sports complex operations and improve the booking experience for both operators and players.",
    indent=True
)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(60)
run = p.add_run("5")
set_font(run, size=12)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 6 — Blank
# ══════════════════════════════════════════════════════════════════════════════
add_paragraph("", space_after=0)
add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ══════════════════════════════════════════════════════════════════════════════
add_paragraph("Table of Contents", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, bold=True, space_after=14)

toc_items = [
    ("Acknowledgement", "3"),
    ("Abstract", "5"),
    ("Table of Contents", "7"),
    ("Table of Figures", "8"),
    ("Chapter 1: Introduction", "9"),
    ("    1.1 Purpose", "9"),
    ("    1.2 System Overview", "9"),
    ("    1.3 Problem Statement", "9"),
    ("    1.4 Goals and Vision", "10"),
    ("Chapter 2: Requirement Specification", "11"),
    ("    2.1 Requirement Gathering Process", "11"),
    ("    2.2 System Functions", "11"),
    ("    2.3 Software Requirement", "12"),
    ("    2.4 Hardware Requirement", "12"),
    ("Chapter 3: Design", "13"),
    ("    3.1 Front-End Design", "13"),
    ("        3.1.1 Module 1 – Authentication", "14"),
    ("        3.1.2 Module 2 – Public Module (Home & About)", "16"),
    ("        3.1.3 Module 3 – Court Browsing & Booking Flow", "18"),
    ("        3.1.4 Module 4 – Coach & Equipment Add-ons", "21"),
    ("        3.1.5 Module 5 – Payment & Confirmation", "23"),
    ("        3.1.6 Module 6 – User Account Management", "25"),
    ("        3.1.7 Module 7 – Admin Dashboard & Reports", "28"),
    ("        3.1.8 Module 8 – Admin Resource Management", "30"),
    ("        3.1.9 Module 9 – Admin Booking & User Management", "34"),
    ("    3.2 Database Design", "37"),
    ("    3.3 Architectural Design", "38"),
    ("    3.4 Use Case Diagram", "40"),
    ("References", "41"),
]

for item, page_num in toc_items:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after  = Pt(1)
    run_text = p.add_run(item)
    set_font(run_text, size=11)
    # Add tab stop for page number
    tab_stop = OxmlElement('w:tabs')
    tab = OxmlElement('w:tab')
    tab.set(qn('w:val'), 'right')
    tab.set(qn('w:leader'), 'dot')
    tab.set(qn('w:pos'), '8640')  # ~6 inches from left margin
    tab_stop.append(tab)
    p._p.pPr.append(tab_stop)
    run_tab = p.add_run('\t')
    run_page = p.add_run(page_num)
    set_font(run_page, size=11)

p_num = doc.add_paragraph()
p_num.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_num.paragraph_format.space_before = Pt(40)
r = p_num.add_run("7")
set_font(r, size=12)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# TABLE OF FIGURES (Page 8)
# ══════════════════════════════════════════════════════════════════════════════
add_paragraph("Table of Figures", alignment=WD_ALIGN_PARAGRAPH.CENTER, font_size=14, bold=True, space_after=14)

figures = [
    ("Figure 3.1", "Registration Page", "14"),
    ("Figure 3.2", "User Login Page", "14"),
    ("Figure 3.3", "Admin Login Page", "15"),
    ("Figure 3.4", "Home Page", "16"),
    ("Figure 3.5", "About Page", "17"),
    ("Figure 3.6", "Courts Page", "18"),
    ("Figure 3.7", "Booking Type Selection", "18"),
    ("Figure 3.8", "Time Booking Page", "19"),
    ("Figure 3.9", "Package Booking Page", "19"),
    ("Figure 3.10", "Availability Result Page", "20"),
    ("Figure 3.11", "Coach Selection Page", "21"),
    ("Figure 3.12", "Equipment Selection Page", "22"),
    ("Figure 3.13", "Booking Form & Stripe Checkout", "23"),
    ("Figure 3.14", "Booking Confirmation Page", "24"),
    ("Figure 3.15", "My Bookings Page", "25"),
    ("Figure 3.16", "Profile Page", "26"),
    ("Figure 3.17", "Coaches Page (Public View)", "26"),
    ("Figure 3.18", "Equipment Page (Public View)", "27"),
    ("Figure 3.19", "Admin Dashboard", "28"),
    ("Figure 3.20", "Admin Reports", "29"),
    ("Figure 3.21", "Manage Courts", "30"),
    ("Figure 3.22", "Manage Packages", "31"),
    ("Figure 3.23", "Manage Coaches", "31"),
    ("Figure 3.24", "Manage Coach Leaves", "32"),
    ("Figure 3.25", "Manage Equipment", "32"),
    ("Figure 3.26", "Manage Availability", "33"),
    ("Figure 3.27", "Manage Bookings", "34"),
    ("Figure 3.28", "Manage Payments", "35"),
    ("Figure 3.29", "Manage Users", "36"),
    ("Figure 3.1 (ERD)", "Entity Relationship Diagram (ERD)", "37"),
    ("Figure 3.2 (Arch)", "System Architecture Diagram", "38"),
    ("Figure 3.3 (UC)", "Use Case Diagram", "40"),
]

for fig_id, fig_title, fig_page in figures:
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after  = Pt(1)
    run_text = p.add_run(f"{fig_id} – {fig_title}")
    set_font(run_text, size=11)
    tab_stop = OxmlElement('w:tabs')
    tab = OxmlElement('w:tab')
    tab.set(qn('w:val'), 'right')
    tab.set(qn('w:leader'), 'dot')
    tab.set(qn('w:pos'), '8640')
    tab_stop.append(tab)
    p._p.pPr.append(tab_stop)
    run_tab = p.add_run('\t')
    run_pg = p.add_run(fig_page)
    set_font(run_pg, size=11)

p_num = doc.add_paragraph()
p_num.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_num.paragraph_format.space_before = Pt(20)
r = p_num.add_run("8")
set_font(r, size=12)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# CHAPTER 1: INTRODUCTION (Page 9)
# ══════════════════════════════════════════════════════════════════════════════
add_heading1("Chapter 1: Introduction")

add_heading2("1.1 Purpose")
add_body(
    "This report sets out the requirement specification, system design, and architecture of Indoorsport, a comprehensive indoor sports court "
    "booking and management platform built as the IT4052 ICT Project. It is meant to give the supervisor and other assessors a clear picture "
    "of why the system exists, what it actually does, how it was designed, and which technologies were used to build it."
)

add_heading2("1.2 System Overview")
add_body(
    "Indoorsport is built with React (Vite) on the front end and Node.js/Express on the back end, backed by Cloud Firestore as the primary "
    "data store. It connects two groups of users in a unified platform: players who need to book indoor courts, hire coaches, or rent equipment; "
    "and administrators who oversee the entire facility operation. Users can browse available courts, coaches, and equipment, check real-time "
    "availability, and make secure online payments via Stripe. Development followed a component-driven strategy, utilizing Tailwind CSS for a "
    "modern, fully responsive interface and Firebase Firestore for scalable, real-time data storage."
)
add_body(
    "Each of the two access levels – User and Admin – gets routed to its own interface after sign-in. Users land on a clean, modern homepage "
    "with quick access to courts, coaches, equipment, and their profile. Admins get a full-featured sidebar-based dashboard with access to "
    "resource management, booking oversight, financial reports, and user administration. The authentication system uses bcrypt for password "
    "hashing and JWT tokens for stateless session management, with separate login portals for users and administrators."
)

add_heading2("1.3 Problem Statement")
add_body(
    "Sports complexes deal with overlapping bookings, coach scheduling conflicts, and resource mismanagement on a daily basis. Without a "
    "centralized system, administrators are forced to manage everything manually through phone calls and paper ledgers, which leads to errors, "
    "double bookings, and revenue loss. Customers don't know whether a court is available until they call, coaches' leave schedules aren't "
    "visible to anyone making a booking, and equipment inventory is tracked – if at all – on paper."
)
add_body(
    "Existing applications sometimes solve pieces of this problem, but very few bring together court bookings, coach availability, equipment "
    "inventory, membership packages, wallet-based payments, and secure online payment processing into a single, unified workflow. The absence "
    "of automated email notifications means customers often don't know whether their booking was confirmed, cancelled, or rejected until they "
    "call the facility directly."
)

add_heading2("1.4 Goals and Vision")
add_body("Indoorsport's main goal is to provide a robust web application that automates sports complex management and empowers players to "
         "self-serve their bookings. More specifically, the project aims to:")

add_bullet("Provide a real-time booking engine for courts and coaches with scheduling conflict prevention through a dedicated availability checking system.")
add_bullet("Integrate secure, reliable payment processing using Stripe, with support for advance payments and wallet-based balance management.")
add_bullet("Manage equipment inventory and membership packages effectively, with admin CRUD operations for all resource types.")
add_bullet("Offer an administrative dashboard with comprehensive reporting and analytics, including monthly revenue breakdowns, booking statistics, and coach and equipment utilisation metrics.")
add_bullet("Ensure a highly responsive, fast, and user-friendly interface that works seamlessly across mobile and desktop devices.")
add_bullet("Automate the booking lifecycle with professional HTML email notifications for confirmations, cancellations, and rejections via Nodemailer.")

doc.add_paragraph()
add_body(
    "The broader aim is to show that a well-designed, modern web platform can genuinely streamline the operations of a sports complex, reduce "
    "manual coordination overhead, and deliver a premium booking experience for both facility operators and their customers."
)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# CHAPTER 2: REQUIREMENT SPECIFICATION (Page 11)
# ══════════════════════════════════════════════════════════════════════════════
add_heading1("Chapter 2: Requirement Specification")

add_heading2("2.1 Requirement Gathering Process")
add_body(
    "Indoorsport's requirements came from a combination of secondary research and analysis of common pain points in sports facility management. "
    "The core coordination gaps identified were the lack of unified availability checking (preventing double bookings), the absence of integrated "
    "payment processing, and the missing link between coaching schedules and court reservations."
)
add_body(
    "Functional and non-functional requirements were structured to handle multiple resource types: spaces (courts), people (coaches), items "
    "(equipment), and plans (packages). The Firestore data model, API routes, and screen flows for each user role were designed upfront, following "
    "a modular approach so new features could be added without reworking the existing architecture."
)
add_body(
    "A number of requirements were refined during development. The booking flow was expanded to support both time-based and package-based "
    "bookings. Coach availability was separated into its own module to handle leave management independently. A wallet system was introduced to "
    "allow refunds and credit-based payments. The email notification system was designed with professionally styled HTML templates covering every "
    "booking state change – confirmation, cancellation, and rejection."
)

add_heading2("2.2 System Functions")
add_body("The core functions of the Indoorsport platform are grouped by module as follows:")
doc.add_paragraph()

# System Functions Table
tbl = doc.add_table(rows=1, cols=2)
tbl.style = 'Table Grid'
tbl.alignment = WD_TABLE_ALIGNMENT.CENTER

# Header row
hdr_cells = tbl.rows[0].cells
hdr_cells[0].text = ''
hdr_cells[1].text = ''
for cell in hdr_cells:
    for para in cell.paragraphs:
        for run in para.runs:
            set_font(run, size=11, bold=True)

# Clear header and add proper headers
hdr_cells[0].paragraphs[0].clear()
hdr_cells[1].paragraphs[0].clear()
h1 = hdr_cells[0].paragraphs[0].add_run("Module")
h2 = hdr_cells[1].paragraphs[0].add_run("Key Functions")
set_font(h1, size=11, bold=True)
set_font(h2, size=11, bold=True)

# Set header background
for c in hdr_cells:
    tc = c._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'D9D9D9')
    tcPr.append(shd)

system_functions = [
    ("Authentication",
     "User registration with email/phone, login with bcrypt password hashing, JWT-based session management, role-based routing (Admin/User), separate admin login portal."),
    ("Resource Management",
     "Admin tools to dynamically add, edit, or remove courts (with image upload), coaches (with specialization and pricing), equipment (with stock tracking), and packages (with court assignment and duration)."),
    ("Availability Engine",
     "Real-time tracking of court schedules by date and time slot, coach availability management, coach leave tracking, conflict prevention before booking confirmation."),
    ("Booking & Payment",
     "End-to-end booking flow supporting time-based and package-based bookings, coach and equipment add-ons, Stripe checkout integration for advance payments, wallet balance deduction, automated email confirmations."),
    ("Admin Booking Workflow",
     "Booking approval, rejection (with reason), cancellation (with reason and wallet refund), payment status tracking, mark-as-paid functionality."),
    ("Dashboard & Reports",
     "Admin analytics dashboard with booking statistics, monthly revenue reports, booking trend charts, coach utilisation metrics, equipment rental tracking, and cancelled/rejected booking analysis."),
    ("User Management",
     "Admin view of all registered users, booking history per user, wallet balance tracking, user deletion, profile management for end users."),
    ("Email Notifications",
     "Automated, professionally styled HTML email notifications for booking confirmations, cancellations, and rejections, dispatched via Nodemailer with a Gmail SMTP transport."),
]

for module, funcs in system_functions:
    row = tbl.add_row()
    row.cells[0].paragraphs[0].clear()
    row.cells[1].paragraphs[0].clear()
    r1 = row.cells[0].paragraphs[0].add_run(module)
    r2 = row.cells[1].paragraphs[0].add_run(funcs)
    set_font(r1, size=11, bold=True)
    set_font(r2, size=11)
    for cell in row.cells:
        for para in cell.paragraphs:
            para.paragraph_format.space_before = Pt(3)
            para.paragraph_format.space_after  = Pt(3)

# Set column widths
for row in tbl.rows:
    row.cells[0].width = Inches(1.8)
    row.cells[1].width = Inches(4.2)

doc.add_paragraph()
add_heading2("2.3 Software Requirement")

# Software Requirements Table
sw_tbl = doc.add_table(rows=1, cols=2)
sw_tbl.style = 'Table Grid'
sw_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER

sw_hdr = sw_tbl.rows[0].cells
sw_hdr[0].paragraphs[0].clear()
sw_hdr[1].paragraphs[0].clear()
sh1 = sw_hdr[0].paragraphs[0].add_run("Category")
sh2 = sw_hdr[1].paragraphs[0].add_run("Tools / Technologies")
set_font(sh1, size=11, bold=True)
set_font(sh2, size=11, bold=True)
for c in sw_hdr:
    tc = c._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), 'D9D9D9')
    tcPr.append(shd)

sw_items = [
    ("Frontend Framework", "React 19 (via Vite 8)"),
    ("Styling", "Tailwind CSS 4, PostCSS, Autoprefixer"),
    ("Backend Framework", "Node.js, Express.js 4"),
    ("Database & Services", "Cloud Firestore (Firebase Admin SDK 12)"),
    ("Payment Gateway", "Stripe API (stripe-js, react-stripe-js)"),
    ("Email Services", "Nodemailer 6 (Gmail SMTP)"),
    ("Security & Auth", "bcryptjs (password hashing), jsonwebtoken (JWT session tokens)"),
    ("File Upload", "Multer 2 (image upload for courts, coaches, equipment)"),
    ("HTTP Client", "Axios (frontend API communication)"),
    ("UI Icons", "React Icons 5"),
    ("Development Tools", "Nodemon (backend hot reload), ESLint (code quality)"),
    ("Version Control", "GitHub"),
    ("IDE / Editor", "Visual Studio Code"),
    ("Design", "Figma (wireframes and screen flow diagrams)"),
]

for cat, tech in sw_items:
    row = sw_tbl.add_row()
    row.cells[0].paragraphs[0].clear()
    row.cells[1].paragraphs[0].clear()
    r1 = row.cells[0].paragraphs[0].add_run(cat)
    r2 = row.cells[1].paragraphs[0].add_run(tech)
    set_font(r1, size=11, bold=True)
    set_font(r2, size=11)
    for cell in row.cells:
        for para in cell.paragraphs:
            para.paragraph_format.space_before = Pt(3)
            para.paragraph_format.space_after  = Pt(3)

for row in sw_tbl.rows:
    row.cells[0].width = Inches(2.0)
    row.cells[1].width = Inches(4.0)

doc.add_paragraph()
add_heading2("2.4 Hardware Requirement")
add_body(
    "Development machine: Any standard laptop or desktop that can run Node.js – 8 GB RAM minimum, plus enough storage for the Node.js runtime, "
    "npm packages, and development tooling. A modern browser (Chrome, Firefox, or Edge) with developer tools is required for frontend debugging."
)
add_body(
    "End-user device: Any modern web browser on a smartphone, tablet, or desktop computer with an active internet connection. The responsive "
    "design ensures full functionality across all screen sizes without requiring any application installation."
)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# CHAPTER 3: DESIGN (Page 13)
# ══════════════════════════════════════════════════════════════════════════════
add_heading1("Chapter 3: Design")

add_heading2("3.1 Front-End Design")
add_body(
    "The interface is built in React and organized around the two user roles, each with its own screens managed through a state-based page "
    "navigation system in App.jsx. Regular users land on a clean, modern homepage where they can view available sports facilities, browse coaches "
    "and equipment, and initiate bookings. The booking interface is built around a structured selection flow: pick a court, choose between "
    "time-based or package-based booking, select an available time slot, optionally add a coach and equipment, and proceed to a secure Stripe "
    "checkout. Admins get a sidebar-based dashboard with specialized screens to manage inventory, track bookings, approve or reject reservations, "
    "and view financial reports."
)
add_body(
    "Every screen follows a consistent design system powered by Tailwind CSS, ensuring a fully responsive layout across mobile and desktop "
    "devices. The UI uses a dark theme with vibrant teal and cyan accent colors, glassmorphism effects, smooth gradient backgrounds, and "
    "micro-animations for hover states and transitions. Components were built modularly – Navbar, Footer, AdminSidebar, StripeCheckout, and "
    "CallToAction – to ensure consistency and reusability across the application."
)

# ─── MODULE 1: Authentication ──────────────────────────────────────────────────
add_heading3("3.1.1 Module 1 – Authentication")

add_two_figures(
    "Figure 3.1", "Registration Page",
    "Figure 3.2", "User Login Page"
)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.LEFT
p.paragraph_format.space_after = Pt(4)
run_label = p.add_run("Caption (Figure 3.1): ")
set_font(run_label, size=11, bold=True)
run_body = p.add_run(
    "Allows new users to create an account by providing their name, email, phone number, and password. "
    "Includes form validation and success feedback before redirecting to the login page."
)
set_font(run_body, size=11)

p2 = doc.add_paragraph()
p2.paragraph_format.space_after = Pt(10)
r2l = p2.add_run("Caption (Figure 3.2): ")
set_font(r2l, size=11, bold=True)
r2b = p2.add_run(
    "Authenticates users with email and password credentials. On success, stores the JWT token and user data in "
    "localStorage and routes the user to the homepage based on their role."
)
set_font(r2b, size=11)

add_figure_placeholder("Figure 3.3", "Figure 3.3 – Admin Login Page\nCaption: A separate, dedicated login portal for administrators "
                        "with a distinct visual design. Authenticates admin credentials and routes to the admin dashboard on success.")

add_page_break()

# ─── MODULE 2: Public Module ───────────────────────────────────────────────────
add_heading3("3.1.2 Module 2 – Public Module (Home & About)")

add_figure_placeholder("Figure 3.4", "Figure 3.4 – Home Page\nCaption: The main landing page featuring a hero section with a "
                        "call-to-action, featured courts section, facility highlights, and quick navigation to booking, coaches, and equipment pages.")

add_figure_placeholder("Figure 3.5", "Figure 3.5 – About Page\nCaption: Provides information about the sports complex, its mission, "
                        "facilities, and team. Includes sections on the complex's history, available amenities, and contact details.")

add_page_break()

# ─── MODULE 3: Court Browsing & Booking Flow ───────────────────────────────────
add_heading3("3.1.3 Module 3 – Court Browsing & Booking Flow")

add_two_figures(
    "Figure 3.6", "Courts Page",
    "Figure 3.7", "Booking Type Selection"
)

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(4)
rl = p.add_run("Caption (Figure 3.6): ")
set_font(rl, size=11, bold=True)
rb = p.add_run("Displays all available courts with images, pricing, and descriptions. Each court card features a \"Book Now\" button that initiates the booking flow.")
set_font(rb, size=11)

p2 = doc.add_paragraph()
p2.paragraph_format.space_after = Pt(10)
r2l = p2.add_run("Caption (Figure 3.7): ")
set_font(r2l, size=11, bold=True)
r2b = p2.add_run("Allows the user to choose between a time-based booking (selecting specific start and end times) or a package-based booking (choosing from predefined membership packages).")
set_font(r2b, size=11)

add_two_figures(
    "Figure 3.8", "Time Booking Page",
    "Figure 3.9", "Package Booking Page"
)

p3 = doc.add_paragraph()
p3.paragraph_format.space_after = Pt(4)
r3l = p3.add_run("Caption (Figure 3.8): ")
set_font(r3l, size=11, bold=True)
r3b = p3.add_run("Lets the user select a date, start time, and end time for their court reservation. Submits an availability check before proceeding to the next step.")
set_font(r3b, size=11)

p4 = doc.add_paragraph()
p4.paragraph_format.space_after = Pt(10)
r4l = p4.add_run("Caption (Figure 3.9): ")
set_font(r4l, size=11, bold=True)
r4b = p4.add_run("Displays available membership packages for the selected court, including duration, included sessions, and pricing. Allows selection and time slot confirmation.")
set_font(r4b, size=11)

add_figure_placeholder("Figure 3.10", "Figure 3.10 – Availability Result Page\nCaption: Shows whether the selected court and time slot is "
                        "available or already booked. If available, the user can proceed to add coaches, equipment, and complete the booking.")

add_page_break()

# ─── MODULE 4: Coach & Equipment Add-ons ──────────────────────────────────────
add_heading3("3.1.4 Module 4 – Coach & Equipment Add-ons")

add_figure_placeholder("Figure 3.11", "Figure 3.11 – Coach Selection Page\nCaption: Displays available coaches with their specializations, "
                        "experience, hourly rates, and availability status. Users can select a coach to add to their booking as an optional add-on.")

add_figure_placeholder("Figure 3.12", "Figure 3.12 – Equipment Selection Page\nCaption: Shows available equipment for rental with descriptions, "
                        "prices, and stock levels. Users can select multiple items and quantities to add to their booking.")

add_page_break()

# ─── MODULE 5: Payment & Confirmation ─────────────────────────────────────────
add_heading3("3.1.5 Module 5 – Payment & Confirmation")

add_figure_placeholder("Figure 3.13", "Figure 3.13 – Booking Form & Stripe Checkout\nCaption: Collects final booking details and displays a "
                        "comprehensive booking summary including court, time, coach, equipment, and total price. Integrates Stripe Elements for secure "
                        "credit card payment processing with advance payment options.")

add_figure_placeholder("Figure 3.14", "Figure 3.14 – Booking Confirmation Page\nCaption: Displays a confirmation receipt after successful booking, "
                        "including booking ID, court details, date, time, selected add-ons, and payment status. An automated confirmation email is also "
                        "dispatched to the user.")

add_page_break()

# ─── MODULE 6: User Account Management ────────────────────────────────────────
add_heading3("3.1.6 Module 6 – User Account Management")

add_figure_placeholder("Figure 3.15", "Figure 3.15 – My Bookings Page\nCaption: Lists all bookings made by the logged-in user with status "
                        "indicators (Pending, Confirmed, Cancelled, Rejected). Includes the ability to cancel pending bookings.")

add_two_figures(
    "Figure 3.16", "Profile Page",
    "Figure 3.17", "Coaches Page (Public View)"
)

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(4)
rl = p.add_run("Caption (Figure 3.16): ")
set_font(rl, size=11, bold=True)
rb = p.add_run("Displays the user's profile information including name, email, phone number, and wallet balance. Allows users to view their account details and booking history summary.")
set_font(rb, size=11)

p2 = doc.add_paragraph()
p2.paragraph_format.space_after = Pt(10)
r2l = p2.add_run("Caption (Figure 3.17): ")
set_font(r2l, size=11, bold=True)
r2b = p2.add_run("A public-facing page displaying all coaches with their photos, specializations, experience levels, and hourly rates, allowing users to browse coaching options before booking.")
set_font(r2b, size=11)

add_figure_placeholder("Figure 3.18", "Figure 3.18 – Equipment Page (Public View)\nCaption: A public-facing page displaying all available "
                        "equipment with images, descriptions, rental prices, and current stock availability.")

add_page_break()

# ─── MODULE 7: Admin Dashboard & Reports ──────────────────────────────────────
add_heading3("3.1.7 Module 7 – Admin Dashboard & Reports")

add_figure_placeholder("Figure 3.19", "Figure 3.19 – Admin Dashboard\nCaption: Provides administrators with an overview of platform statistics "
                        "including total bookings, pending approvals, revenue summaries, and recent booking activity with quick-action cards.")

add_figure_placeholder("Figure 3.20", "Figure 3.20 – Admin Reports\nCaption: Displays analytical charts and performance statistics including "
                        "monthly revenue trends, booking volume analysis, coach utilisation rates, equipment rental frequency, and cancellation/rejection "
                        "analytics with interactive chart visualizations.")

add_page_break()

# ─── MODULE 8: Admin Resource Management ──────────────────────────────────────
add_heading3("3.1.8 Module 8 – Admin Resource Management")

add_two_figures(
    "Figure 3.21", "Manage Courts",
    "Figure 3.22", "Manage Packages"
)

p = doc.add_paragraph()
p.paragraph_format.space_after = Pt(4)
rl = p.add_run("Caption (Figure 3.21): ")
set_font(rl, size=11, bold=True)
rb = p.add_run("Allows administrators to add new courts with images, edit existing court details (name, description, hourly rate), and delete courts. Includes image upload functionality via Multer.")
set_font(rb, size=11)

p2 = doc.add_paragraph()
p2.paragraph_format.space_after = Pt(10)
r2l = p2.add_run("Caption (Figure 3.22): ")
set_font(r2l, size=11, bold=True)
r2b = p2.add_run("Enables administrators to create, edit, and delete membership packages with configurable court assignment, duration, included sessions, and pricing.")
set_font(r2b, size=11)

add_two_figures(
    "Figure 3.23", "Manage Coaches",
    "Figure 3.24", "Manage Coach Leaves"
)

p3 = doc.add_paragraph()
p3.paragraph_format.space_after = Pt(4)
r3l = p3.add_run("Caption (Figure 3.23): ")
set_font(r3l, size=11, bold=True)
r3b = p3.add_run("Allows administrators to add coaches with profile photos, specializations, experience details, and hourly rates. Supports full CRUD operations on coach profiles.")
set_font(r3b, size=11)

p4 = doc.add_paragraph()
p4.paragraph_format.space_after = Pt(10)
r4l = p4.add_run("Caption (Figure 3.24): ")
set_font(r4l, size=11, bold=True)
r4b = p4.add_run("Provides administrators with the ability to manage coach leave schedules, mark coaches as unavailable for specific dates, and track leave history.")
set_font(r4b, size=11)

add_two_figures(
    "Figure 3.25", "Manage Equipment",
    "Figure 3.26", "Manage Availability"
)

p5 = doc.add_paragraph()
p5.paragraph_format.space_after = Pt(4)
r5l = p5.add_run("Caption (Figure 3.25): ")
set_font(r5l, size=11, bold=True)
r5b = p5.add_run("Enables administrators to manage the equipment inventory including adding new items with images, updating stock levels, editing rental prices, and removing discontinued items.")
set_font(r5b, size=11)

p6 = doc.add_paragraph()
p6.paragraph_format.space_after = Pt(10)
r6l = p6.add_run("Caption (Figure 3.26): ")
set_font(r6l, size=11, bold=True)
r6b = p6.add_run("Allows administrators to view and manage court availability by date, view booked time slots, and manually block or release time slots as needed.")
set_font(r6b, size=11)

add_page_break()

# ─── MODULE 9: Admin Booking & User Management ────────────────────────────────
add_heading3("3.1.9 Module 9 – Admin Booking & User Management")

add_figure_placeholder("Figure 3.27", "Figure 3.27 – Manage Bookings\nCaption: Displays all bookings across the platform with filtering and "
                        "search capabilities. Administrators can approve pending bookings, reject bookings with a stated reason, or cancel confirmed "
                        "bookings with an optional wallet refund dispatched to the user.")

add_figure_placeholder("Figure 3.28", "Figure 3.28 – Manage Payments\nCaption: Shows payment status for all bookings including advance payments, "
                        "wallet deductions, and outstanding balances. Allows administrators to mark bookings as fully paid.")

add_figure_placeholder("Figure 3.29", "Figure 3.29 – Manage Users\nCaption: Lists all registered users with their booking history, wallet "
                        "balances, and account details. Administrators can view detailed user profiles and delete user accounts when necessary.")

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 3.2 DATABASE DESIGN
# ══════════════════════════════════════════════════════════════════════════════
add_heading2("3.2 Database Design")
add_body(
    "Indoorsport's primary data store is Cloud Firestore, a document-oriented NoSQL database. While Firestore doesn't enforce a relational schema, "
    "the platform's collections were designed with clear logical relationships in mind, which is why they can be mapped onto an Entity Relationship "
    "Diagram (ERD) – shown in Figure 3.1. The main collections are Users, Courts, Coaches, Equipments, Packages, Bookings, Availability, and "
    "CoachAvailability."
)
add_body(
    "A user can have many bookings, and each booking references exactly one court and optionally one coach and multiple equipment items. Each court "
    "has its own Availability sub-collection tracking which time slots are booked per date. Similarly, each coach has a CoachAvailability "
    "sub-collection tracking their leave dates and unavailability periods. The availability engine checks both court availability and coach "
    "availability documents before allowing a booking to proceed, preventing double-allocations at the API level. Every completed or cancelled "
    "booking generates a corresponding payment document recording the full financial transaction, including advance paid, balance due, wallet "
    "amount used, and refund status."
)
add_body(
    "The Users collection stores name, email, phone, hashed password, role (user/admin), wallet balance, and creation timestamp. The Bookings "
    "collection is the core transactional collection, linking users to courts, coaches, equipment, time slots, Stripe payment intents, and "
    "booking statuses. Each booking document records the court name, date, time range, booking type (Time/Package), selected package, coach, "
    "equipment list, price, advance paid, payment status, booking status (Pending/Confirmed/Cancelled/Rejected), wallet usage, "
    "cancellation/rejection reason, and creation timestamp."
)

add_figure_placeholder("Figure 3.1", "Figure 3.1: Entity Relationship Diagram (ERD)")

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 3.3 ARCHITECTURAL DESIGN
# ══════════════════════════════════════════════════════════════════════════════
add_heading2("3.3 Architectural Design")
add_body(
    "Indoorsport's architecture is layered into a modern client-server model with clearly separated concerns at each level."
)
add_body(
    "Presentation Layer: A React Single Page Application (SPA) built with Vite, providing a fast, interactive user experience. The UI is "
    "organized into modular components (Navbar, Footer, AdminSidebar, StripeCheckout, CallToAction) and page-level screens, with state managed "
    "through React hooks (useState, useEffect). Navigation between pages is handled through a centralized state-based routing system in App.jsx, "
    "with role-based access control routing users and admins to their respective interfaces after sign-in."
)
add_body(
    "API Layer: An Express.js REST API running on Node.js that handles all business logic. The API is organized into twelve route modules – "
    "auth, courts, packages, bookings, availability, coachAvailability, coaches, equipments, payment, reports, users, and upload – each handling "
    "CRUD operations and business rules for their respective domain. JWT-based middleware secures all protected endpoints, and role checks within "
    "route handlers enforce admin-only access where needed. Multer handles multipart file uploads for court, coach, and equipment images, serving "
    "them as static files from the /uploads directory."
)
add_body(
    "Data Layer: Firebase Cloud Firestore handles structured data storage with real-time capabilities. The Firebase Admin SDK connects the "
    "backend to Firestore, providing server-side access to all collections. All database operations are performed server-side through the "
    "Express API rather than directly from the frontend, ensuring data security and business rule enforcement."
)
add_body(
    "Payment Integration: Stripe handles secure financial transactions through the PaymentIntents API. The backend creates payment intents with "
    "the booking amount, and the frontend uses Stripe Elements (via @stripe/react-stripe-js) to collect card details securely, ensuring PCI "
    "compliance without sensitive card data touching the application server."
)
add_body(
    "Email Service: Nodemailer dispatches automated HTML email notifications through a Gmail SMTP transport. Professional, responsive email "
    "templates are generated for booking confirmations, cancellations (with wallet refund details), and rejections (with admin-provided reasons), "
    "ensuring users stay informed at every stage of their booking lifecycle."
)

add_figure_placeholder("Figure 3.2", "Figure 3.2: System Architecture Diagram")

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# 3.4 USE CASE DIAGRAM
# ══════════════════════════════════════════════════════════════════════════════
add_heading2("3.4 Use Case Diagram")
add_body(
    "The Indoorsport system supports two primary actors: the User and the Admin. The following use case diagram illustrates the full set of "
    "interactions each actor can perform within the system."
)

add_figure_placeholder("Figure 3.3", "Figure 3.3: Use Case Diagram")

doc.add_paragraph()
add_heading3("User Actor:")
user_cases = [
    "Register and log in to the platform",
    "Browse courts, coaches, and equipment",
    "Check court availability for specific dates and times",
    "Book courts with time-based or package-based options",
    "Add coaches and equipment as booking add-ons",
    "Make secure payments via Stripe",
    "Use wallet balance for payments",
    "View booking history and manage active bookings",
    "Cancel pending bookings",
    "Receive email notifications for booking status changes",
    "View and manage user profile",
]
for uc in user_cases:
    add_bullet(uc)

add_heading3("Admin Actor:")
admin_cases = [
    "Log in via the dedicated admin portal",
    "View dashboard with platform statistics and analytics",
    "Manage courts (add, edit, delete with image upload)",
    "Manage coaches (add, edit, delete, track leaves)",
    "Manage equipment inventory (add, edit, delete, track stock)",
    "Manage membership packages (add, edit, delete)",
    "Manage court availability and time slots",
    "Approve, reject, or cancel bookings with reasons",
    "Mark bookings as paid",
    "Manage registered users and wallet balances",
    "View comprehensive monthly reports and analytics",
]
for ac in admin_cases:
    add_bullet(ac)

add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
# REFERENCES
# ══════════════════════════════════════════════════════════════════════════════
add_heading1("References")

references = [
    'React Documentation. (2024). React – The library for web and native user interfaces. https://react.dev/',
    'Meta Open Source. (2024). React Hooks – useState, useEffect. https://react.dev/reference/react',
    'Node.js & Express Documentation. (2024). Express – Fast, unopinionated, minimalist web framework for Node.js. https://expressjs.com/',
    'Google LLC. (2024). Cloud Firestore documentation. Firebase. https://firebase.google.com/docs/firestore',
    'Google LLC. (2024). Firebase Admin SDK documentation. Firebase. https://firebase.google.com/docs/admin/setup',
    'Stripe, Inc. (2024). Stripe API Documentation. https://stripe.com/docs/api',
    'Stripe, Inc. (2024). Stripe Elements for React – @stripe/react-stripe-js. https://stripe.com/docs/stripe-js/react',
    'Nodemailer Documentation. (2024). Nodemailer – Send emails from Node.js. https://nodemailer.com/',
    'Vite Documentation. (2024). Vite – Next Generation Frontend Tooling. https://vitejs.dev/',
    'Tailwind CSS Documentation. (2024). Tailwind CSS – Rapidly build modern websites. https://tailwindcss.com/docs',
    'JSON Web Tokens. (2024). Introduction to JSON Web Tokens. https://jwt.io/introduction',
    'dcodeIO. (2024). bcrypt.js – Optimized bcrypt in JavaScript with zero dependencies. https://github.com/dcodeIO/bcrypt.js',
    'Multer Documentation. (2024). Multer – Node.js middleware for handling multipart/form-data. https://github.com/expressjs/multer',
    'Axios Documentation. (2024). Axios – Promise based HTTP client for the browser and Node.js. https://axios-http.com/',
]

for i, ref in enumerate(references, 1):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.left_indent = Inches(0.5)
    p.paragraph_format.first_line_indent = Inches(-0.5)
    run = p.add_run(ref)
    set_font(run, size=11)

# ─── Save ──────────────────────────────────────────────────────────────────────
output_path = r"C:\finalproject\Indoorsport_Project_Report.docx"
doc.save(output_path)
print(f"Report saved to: {output_path}")
