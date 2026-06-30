"""Seed the database with realistic sample data (India HR/Payroll)."""
from datetime import date

from app.database import SessionLocal, engine, Base
from app.models import (
    Employee, LeaveBalance, LeaveRequest,
    Payslip, PayslipItem, Benefit,
    Goal, Review, Kudos, Document,
)
from app.auth.password import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Employee).first():
        print("Database already seeded. Skipping.")
        db.close()
        return

    password = hash_password("password123")

    # --- Employees ---
    manager = Employee(
        email="sarah.chen@company.com",
        hashed_password=password,
        employee_id="EMP001",
        first_name="Sarah",
        last_name="Chen",
        phone="+91 98765 43210",
        date_of_birth=date(1985, 3, 15),
        hire_date=date(2018, 6, 1),
        department="Engineering",
        designation="Engineering Manager",
        role="manager",
        location="Bengaluru",
        emergency_contact_name="Michael Chen",
        emergency_contact_phone="+91 98765 43211",
        emergency_contact_relation="Spouse",
        bank_name="HDFC Bank",
        bank_account_number="****4521",
        bank_ifsc="HDFC0001234",
        address="Flat 302, Prestige Lakeside Habitat, Varthur, Bengaluru, Karnataka 560087",
    )
    db.add(manager)
    db.flush()

    emp1 = Employee(
        email="john.doe@company.com",
        hashed_password=password,
        employee_id="EMP002",
        first_name="John",
        last_name="Doe",
        phone="+91 98765 12345",
        date_of_birth=date(1992, 7, 22),
        hire_date=date(2021, 1, 15),
        department="Engineering",
        designation="Senior Software Engineer",
        role="employee",
        manager_id=manager.id,
        location="Bengaluru",
        emergency_contact_name="Jane Doe",
        emergency_contact_phone="+91 98765 12346",
        emergency_contact_relation="Sister",
        bank_name="ICICI Bank",
        bank_account_number="****8832",
        bank_ifsc="ICIC0001234",
        address="A-204, Sobha Dream Acres, Panathur, Bengaluru, Karnataka 560103",
    )

    emp2 = Employee(
        email="priya.sharma@company.com",
        hashed_password=password,
        employee_id="EMP003",
        first_name="Priya",
        last_name="Sharma",
        phone="+91 98220 54321",
        date_of_birth=date(1990, 11, 8),
        hire_date=date(2020, 3, 10),
        department="Product",
        designation="Product Manager",
        role="employee",
        manager_id=manager.id,
        location="Mumbai",
        emergency_contact_name="Raj Sharma",
        emergency_contact_phone="+91 98220 54322",
        emergency_contact_relation="Father",
        bank_name="State Bank of India",
        bank_account_number="****6614",
        bank_ifsc="SBIN0001234",
        address="601, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076",
    )

    emp3 = Employee(
        email="ananya.iyer@company.com",
        hashed_password=password,
        employee_id="EMP004",
        first_name="Ananya",
        last_name="Iyer",
        phone="+91 99450 67890",
        date_of_birth=date(1995, 5, 30),
        hire_date=date(2022, 8, 20),
        department="Design",
        designation="UX Designer",
        role="employee",
        manager_id=manager.id,
        location="Hyderabad",
    )

    emp4 = Employee(
        email="rahul.verma@company.com",
        hashed_password=password,
        employee_id="EMP005",
        first_name="Rahul",
        last_name="Verma",
        phone="+91 97171 22334",
        date_of_birth=date(1988, 9, 14),
        hire_date=date(2019, 11, 5),
        department="Engineering",
        designation="Staff Engineer",
        role="employee",
        manager_id=manager.id,
        location="Pune",
    )

    db.add_all([emp1, emp2, emp3, emp4])
    db.flush()

    # --- Leave balances for emp1 (John) ---
    db.add_all([
        LeaveBalance(employee_id=emp1.id, leave_type="annual", total=18, used=5, pending=2),
        LeaveBalance(employee_id=emp1.id, leave_type="sick", total=10, used=2, pending=0),
        LeaveBalance(employee_id=emp1.id, leave_type="casual", total=8, used=1, pending=0),
    ])

    # --- Leave requests for emp1 ---
    db.add_all([
        LeaveRequest(
            employee_id=emp1.id, leave_type="annual",
            from_date=date(2026, 3, 10), to_date=date(2026, 3, 14),
            days=5, reason="Family vacation", status="approved",
            reviewer_id=manager.id, created_at=date(2026, 2, 20),
        ),
        LeaveRequest(
            employee_id=emp1.id, leave_type="annual",
            from_date=date(2026, 7, 21), to_date=date(2026, 7, 22),
            days=2, reason="Personal errands", status="pending",
            created_at=date(2026, 6, 15),
        ),
        LeaveRequest(
            employee_id=emp1.id, leave_type="sick",
            from_date=date(2026, 5, 5), to_date=date(2026, 5, 6),
            days=2, reason="Flu", status="approved",
            reviewer_id=manager.id, created_at=date(2026, 5, 5),
        ),
    ])

    # --- Payslips for emp1 (last 3 months) — India payroll structure ---
    for month_str, pay_dt in [
        ("2026-06", date(2026, 6, 30)),
        ("2026-05", date(2026, 5, 31)),
        ("2026-04", date(2026, 4, 30)),
    ]:
        ps = Payslip(
            employee_id=emp1.id, month=month_str, pay_date=pay_dt,
            gross_earnings=158000.00, total_deductions=31600.00, net_pay=126400.00,
        )
        db.add(ps)
        db.flush()
        db.add_all([
            PayslipItem(payslip_id=ps.id, category="earning", label="Basic Salary", amount=79000.00),
            PayslipItem(payslip_id=ps.id, category="earning", label="House Rent Allowance (HRA)", amount=31600.00),
            PayslipItem(payslip_id=ps.id, category="earning", label="Special Allowance", amount=23700.00),
            PayslipItem(payslip_id=ps.id, category="earning", label="Conveyance Allowance", amount=3700.00),
            PayslipItem(payslip_id=ps.id, category="earning", label="Performance Bonus", amount=20000.00),
            PayslipItem(payslip_id=ps.id, category="deduction", label="Income Tax (TDS)", amount=18500.00),
            PayslipItem(payslip_id=ps.id, category="deduction", label="Provident Fund (PF)", amount=9480.00),
            PayslipItem(payslip_id=ps.id, category="deduction", label="Professional Tax", amount=200.00),
            PayslipItem(payslip_id=ps.id, category="deduction", label="Health Insurance Premium", amount=3420.00),
        ])

    # --- Benefits for emp1 ---
    db.add_all([
        Benefit(employee_id=emp1.id, benefit_type="health", name="Group Mediclaim Insurance",
                description="Family floater health cover for employee + dependents", amount=500000.00, frequency="annual"),
        Benefit(employee_id=emp1.id, benefit_type="health", name="Personal Accident Cover",
                description="Accidental death and disability coverage", amount=1000000.00, frequency="annual"),
        Benefit(employee_id=emp1.id, benefit_type="pf", name="Provident Fund (Employer Contribution)",
                description="12% of basic salary contributed by employer (EPFO)", amount=9480.00, frequency="monthly"),
        Benefit(employee_id=emp1.id, benefit_type="pf", name="Gratuity",
                description="Payable as per Payment of Gratuity Act after 5 years of service", amount=None, frequency=None),
        Benefit(employee_id=emp1.id, benefit_type="allowance", name="Leave Travel Allowance (LTA)",
                description="Tax-exempt travel reimbursement, claimable twice in a block of 4 years", amount=60000.00, frequency="annual"),
        Benefit(employee_id=emp1.id, benefit_type="allowance", name="Learning & Development",
                description="Annual budget for courses, certifications and conferences", amount=50000.00, frequency="annual"),
    ])

    # --- Goals for emp1 ---
    db.add_all([
        Goal(employee_id=emp1.id, title="Complete AWS Certification",
             description="Pass the AWS Solutions Architect exam", category="technical",
             progress=65, status="in_progress", due_date=date(2026, 9, 30), created_at=date(2026, 1, 15)),
        Goal(employee_id=emp1.id, title="Lead API Redesign Project",
             description="Architect and implement the v2 REST API", category="leadership",
             progress=40, status="in_progress", due_date=date(2026, 12, 31), created_at=date(2026, 2, 1)),
        Goal(employee_id=emp1.id, title="Mentorship Program",
             description="Mentor two junior engineers this quarter", category="personal",
             progress=100, status="completed", due_date=date(2026, 6, 30), created_at=date(2026, 4, 1)),
    ])

    # --- Reviews for emp1 ---
    db.add_all([
        Review(employee_id=emp1.id, reviewer_id=manager.id, period="H1-2026",
               rating=4.2, strengths="Strong technical skills, great team player",
               improvements="Could improve documentation practices",
               comments="John has been a consistent performer this half.", created_at=date(2026, 6, 20)),
    ])

    # --- Kudos ---
    db.add_all([
        Kudos(sender_id=emp2.id, receiver_id=emp1.id,
              message="Thanks for helping debug the payment integration issue!", category="teamwork",
              created_at=date(2026, 6, 10)),
        Kudos(sender_id=manager.id, receiver_id=emp1.id,
              message="Great job leading the sprint demo!", category="leadership",
              created_at=date(2026, 6, 18)),
        Kudos(sender_id=emp1.id, receiver_id=emp2.id,
              message="Your product specs are always crystal clear.", category="innovation",
              created_at=date(2026, 6, 5)),
    ])

    db.commit()
    db.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    seed()
