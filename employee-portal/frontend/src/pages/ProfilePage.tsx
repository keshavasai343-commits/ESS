import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, MapPin, Building, Calendar, Shield, CreditCard, Edit3, Check, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfile } from "@/hooks/useProfile";
import type { EmployeeUpdate } from "@/types";

const schema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank_ifsc: z.string().optional(),
});

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<EmployeeUpdate>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: user?.phone || "",
      address: user?.address || "",
      emergency_contact_name: user?.emergency_contact_name || "",
      emergency_contact_phone: user?.emergency_contact_phone || "",
      emergency_contact_relation: user?.emergency_contact_relation || "",
      bank_name: user?.bank_name || "",
      bank_account_number: user?.bank_account_number || "",
      bank_ifsc: user?.bank_ifsc || "",
    },
  });

  const onSubmit = (data: EmployeeUpdate) => {
    updateProfile.mutate(data, {
      onSuccess: () => setEditing(null),
    });
  };

  const startEdit = (section: string) => {
    reset({
      phone: user?.phone || "",
      address: user?.address || "",
      emergency_contact_name: user?.emergency_contact_name || "",
      emergency_contact_phone: user?.emergency_contact_phone || "",
      emergency_contact_relation: user?.emergency_contact_relation || "",
      bank_name: user?.bank_name || "",
      bank_account_number: user?.bank_account_number || "",
      bank_ifsc: user?.bank_ifsc || "",
    });
    setEditing(section);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold">
            {user.first_name[0]}{user.last_name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.first_name} {user.last_name}</h2>
            <p className="text-gray-500">{user.designation}</p>
            <p className="text-sm text-gray-400">{user.employee_id} · {user.department}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={18} className="text-primary-600" />
              <h3 className="font-semibold text-gray-900">Personal Info</h3>
            </div>
            {editing !== "personal" ? (
              <button type="button" onClick={() => startEdit("personal")} className="text-primary-600 text-sm flex items-center gap-1 hover:underline">
                <Edit3 size={14} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button type="submit" className="text-green-600 text-sm flex items-center gap-1 hover:underline"><Check size={14} /> Save</button>
                <button type="button" onClick={() => setEditing(null)} className="text-gray-500 text-sm flex items-center gap-1 hover:underline"><X size={14} /> Cancel</button>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <InfoRow icon={<Building size={14} />} label="Department" value={user.department} />
            <InfoRow icon={<MapPin size={14} />} label="Location" value={user.location || "—"} />
            <InfoRow icon={<Calendar size={14} />} label="Hire Date" value={user.hire_date} />
            <InfoRow icon={<User size={14} />} label="Manager" value={user.manager_name || "—"} />
            {editing === "personal" ? (
              <>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <input {...register("phone")} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Address</label>
                  <textarea {...register("address")} rows={2} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
              </>
            ) : (
              <>
                <InfoRow icon={<Phone size={14} />} label="Phone" value={user.phone || "—"} />
                <InfoRow icon={<MapPin size={14} />} label="Address" value={user.address || "—"} />
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-red-500" />
                <h3 className="font-semibold text-gray-900">Emergency Contact</h3>
              </div>
              {editing !== "emergency" ? (
                <button type="button" onClick={() => startEdit("emergency")} className="text-primary-600 text-sm flex items-center gap-1 hover:underline">
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button type="submit" className="text-green-600 text-sm flex items-center gap-1 hover:underline"><Check size={14} /> Save</button>
                  <button type="button" onClick={() => setEditing(null)} className="text-gray-500 text-sm flex items-center gap-1 hover:underline"><X size={14} /> Cancel</button>
                </div>
              )}
            </div>
            {editing === "emergency" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Name</label>
                  <input {...register("emergency_contact_name")} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <input {...register("emergency_contact_phone")} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Relation</label>
                  <input {...register("emergency_contact_relation")} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow icon={<User size={14} />} label="Name" value={user.emergency_contact_name || "—"} />
                <InfoRow icon={<Phone size={14} />} label="Phone" value={user.emergency_contact_phone || "—"} />
                <InfoRow icon={<User size={14} />} label="Relation" value={user.emergency_contact_relation || "—"} />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-green-600" />
                <h3 className="font-semibold text-gray-900">Bank Details</h3>
              </div>
              {editing !== "bank" ? (
                <button type="button" onClick={() => startEdit("bank")} className="text-primary-600 text-sm flex items-center gap-1 hover:underline">
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button type="submit" className="text-green-600 text-sm flex items-center gap-1 hover:underline"><Check size={14} /> Save</button>
                  <button type="button" onClick={() => setEditing(null)} className="text-gray-500 text-sm flex items-center gap-1 hover:underline"><X size={14} /> Cancel</button>
                </div>
              )}
            </div>
            {editing === "bank" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Bank Name</label>
                  <input {...register("bank_name")} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Account Number</label>
                  <input {...register("bank_account_number")} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">IFSC / SWIFT</label>
                  <input {...register("bank_ifsc")} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow icon={<Building size={14} />} label="Bank" value={user.bank_name || "—"} />
                <InfoRow icon={<CreditCard size={14} />} label="Account" value={user.bank_account_number || "—"} />
                <InfoRow icon={<CreditCard size={14} />} label="IFSC" value={user.bank_ifsc || "—"} />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs text-gray-500 w-20">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}
