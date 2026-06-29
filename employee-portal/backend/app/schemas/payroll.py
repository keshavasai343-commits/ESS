from datetime import date

from pydantic import BaseModel


class PayslipItemResponse(BaseModel):
    category: str
    label: str
    amount: float

    model_config = {"from_attributes": True}


class PayslipSummary(BaseModel):
    id: int
    month: str
    pay_date: date
    net_pay: float

    model_config = {"from_attributes": True}


class PayslipDetail(BaseModel):
    id: int
    month: str
    pay_date: date
    gross_earnings: float
    total_deductions: float
    net_pay: float
    items: list[PayslipItemResponse]

    model_config = {"from_attributes": True}


class BenefitResponse(BaseModel):
    id: int
    benefit_type: str
    name: str
    description: str | None = None
    amount: float | None = None
    frequency: str | None = None

    model_config = {"from_attributes": True}
