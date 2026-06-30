import { useState } from "react";
import { IndianRupee, Download, Heart, PiggyBank, Gift } from "lucide-react";
import { usePayslips, usePayslip, useBenefits } from "@/hooks/usePayroll";

const benefitIcons: Record<string, React.ElementType> = {
  health: Heart,
  pf: PiggyBank,
  allowance: Gift,
};

const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export default function PayPage() {
  const { data: payslips } = usePayslips();
  const [selectedMonth, setSelectedMonth] = useState("");
  const activeMonth = selectedMonth || payslips?.[0]?.month || "";
  const { data: detail } = usePayslip(activeMonth);
  const { data: benefits } = useBenefits();

  const earnings = detail?.items.filter((i) => i.category === "earning") || [];
  const deductions = detail?.items.filter((i) => i.category === "deduction") || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pay & Benefits</h1>
        <p className="text-gray-500 mt-1">View payslips and benefit details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Payslip Detail</h2>
              <select
                value={activeMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none"
              >
                {payslips?.map((p) => (
                  <option key={p.month} value={p.month}>
                    {p.month}
                  </option>
                ))}
              </select>
            </div>

            {detail && (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-600 font-medium">Gross Earnings</p>
                    <p className="text-2xl font-bold text-green-700">
                      {inr(detail.gross_earnings)}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-red-600 font-medium">Deductions</p>
                    <p className="text-2xl font-bold text-red-700">
                      {inr(detail.total_deductions)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-600 font-medium">Net Pay</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {inr(detail.net_pay)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                      Earnings
                    </h3>
                    <div className="space-y-2">
                      {earnings.map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between text-sm py-1.5"
                        >
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-medium text-gray-900">
                            {inr(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                      Deductions
                    </h3>
                    <div className="space-y-2">
                      {deductions.map((item) => (
                        <div
                          key={item.label}
                          className="flex justify-between text-sm py-1.5"
                        >
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-medium text-red-600">
                            -{inr(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Past Payslips</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {payslips?.map((p) => (
                <div
                  key={p.month}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedMonth(p.month)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.month}</p>
                    <p className="text-xs text-gray-500">Paid on {p.pay_date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {inr(p.net_pay)}
                    </span>
                    <Download size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Benefits</h2>
          {benefits?.map((b) => {
            const Icon = benefitIcons[b.benefit_type] || IndianRupee;
            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Icon size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{b.benefit_type}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{b.description}</p>
                {b.amount && (
                  <p className="text-sm font-semibold text-gray-900">
                    {inr(b.amount)}{" "}
                    <span className="text-xs text-gray-400 font-normal">
                      / {b.frequency}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
