import api from "./client";
import type { PayslipSummary, PayslipDetail, Benefit } from "@/types";

export const getPayslips = () =>
  api.get<PayslipSummary[]>("/payroll/payslips").then((r) => r.data);

export const getPayslip = (month: string) =>
  api.get<PayslipDetail>(`/payroll/payslips/${month}`).then((r) => r.data);

export const getBenefits = () =>
  api.get<Benefit[]>("/payroll/benefits").then((r) => r.data);
