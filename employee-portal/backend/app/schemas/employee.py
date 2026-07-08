from datetime import date

from pydantic import BaseModel, EmailStr


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    department: str
    designation: str
    location: str | None = None


class EmployeeProfile(EmployeeBase):
    id: int
    employee_id: str
    avatar_url: str | None = None
    date_of_birth: date | None = None
    hire_date: date
    role: str
    is_active: bool = True
    manager_name: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    emergency_contact_relation: str | None = None
    bank_name: str | None = None
    bank_account_number: str | None = None
    bank_ifsc: str | None = None
    address: str | None = None

    model_config = {"from_attributes": True}


class EmployeeUpdate(BaseModel):
    phone: str | None = None
    address: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None
    emergency_contact_relation: str | None = None
    bank_name: str | None = None
    bank_account_number: str | None = None
    bank_ifsc: str | None = None


class EmployeeDirectory(BaseModel):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    email: EmailStr
    department: str
    designation: str
    location: str | None = None
    avatar_url: str | None = None
    phone: str | None = None

    model_config = {"from_attributes": True}


class PaginatedEmployees(BaseModel):
    items: list[EmployeeDirectory]
    total: int
    page: int
    pages: int
