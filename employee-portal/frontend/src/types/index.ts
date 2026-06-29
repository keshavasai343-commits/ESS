export interface User {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  hire_date: string;
  department: string;
  designation: string;
  role: string;
  location?: string;
  manager_name?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
  address?: string;
}

export interface EmployeeUpdate {
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_ifsc?: string;
}

export interface EmployeeDirectory {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  designation: string;
  location?: string;
  avatar_url?: string;
  phone?: string;
}

export interface PaginatedEmployees {
  items: EmployeeDirectory[];
  total: number;
  page: number;
  pages: number;
}

export interface LeaveBalance {
  id: number;
  leave_type: string;
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

export interface LeaveRequest {
  id: number;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: number;
  reason?: string;
  status: string;
  created_at: string;
  reviewer_name?: string;
}

export interface LeaveRequestCreate {
  leave_type: string;
  from_date: string;
  to_date: string;
  reason?: string;
}

export interface PayslipSummary {
  id: number;
  month: string;
  pay_date: string;
  net_pay: number;
}

export interface PayslipItem {
  category: string;
  label: string;
  amount: number;
}

export interface PayslipDetail {
  id: number;
  month: string;
  pay_date: string;
  gross_earnings: number;
  total_deductions: number;
  net_pay: number;
  items: PayslipItem[];
}

export interface Benefit {
  id: number;
  benefit_type: string;
  name: string;
  description?: string;
  amount?: number;
  frequency?: string;
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  category?: string;
  progress: number;
  status: string;
  due_date?: string;
  created_at: string;
}

export interface GoalCreate {
  title: string;
  description?: string;
  category?: string;
  due_date?: string;
}

export interface GoalUpdate {
  progress?: number;
  status?: string;
  title?: string;
  description?: string;
}

export interface Review {
  id: number;
  reviewer_name: string;
  period: string;
  rating?: number;
  strengths?: string;
  improvements?: string;
  comments?: string;
  created_at: string;
}

export interface KudosCreate {
  receiver_id: number;
  message: string;
  category?: string;
}

export interface Kudos {
  id: number;
  sender_name: string;
  receiver_name: string;
  message: string;
  category?: string;
  created_at: string;
}

export interface Document {
  id: number;
  filename: string;
  original_name: string;
  file_type?: string;
  file_size?: number;
  category?: string;
  uploaded_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
