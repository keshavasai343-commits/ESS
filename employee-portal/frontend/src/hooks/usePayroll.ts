import { useQuery } from "@tanstack/react-query";
import * as payrollApi from "@/api/payroll";

export function usePayslips() {
  return useQuery({
    queryKey: ["payroll", "payslips"],
    queryFn: payrollApi.getPayslips,
  });
}

export function usePayslip(month: string) {
  return useQuery({
    queryKey: ["payroll", "payslips", month],
    queryFn: () => payrollApi.getPayslip(month),
    enabled: !!month,
  });
}

export function useBenefits() {
  return useQuery({
    queryKey: ["payroll", "benefits"],
    queryFn: payrollApi.getBenefits,
  });
}
