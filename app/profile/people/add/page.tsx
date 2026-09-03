"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Check } from "lucide-react";
import DashboardLayout from "@/components/profile/DashboardLayout";
import Button from "@/components/ui/Button";
import { getPeople, savePeople, Person } from "@/lib/people";

export default function AddPersonPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    gender: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    address1: "",
    address2: "",
    suburb: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United Kingdom",
    relationship: "Family",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAddPerson = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First Name and Last Name are required.");
      return;
    }
    if (!form.gender) {
      setError("Please select a gender.");
      return;
    }
    if (!form.dobDay || !form.dobMonth || !form.dobYear) {
      setError("Please specify the person's full Date of Birth.");
      return;
    }

    const formattedDob = `${form.dobYear}-${form.dobMonth.padStart(2, "0")}-${form.dobDay.padStart(2, "0")}`;
    const newPerson: Person = {
      id: `person-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: form.title,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dob: formattedDob,
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      address1: form.address1.trim(),
      address2: form.address2.trim(),
      suburb: form.suburb.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      country: form.country.trim(),
      relationship: form.relationship,
    };

    const updated = [...getPeople(), newPerson];
    savePeople(updated);
    window.dispatchEvent(new Event("storage"));
    router.push("/profile");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 text-left">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 font-body text-sm font-bold text-[#1E227D] transition-colors hover:text-[#F000E2]"
          >
            <ArrowLeft size={16} />
            Back to My Profile
          </Link>
          <div className="flex items-center gap-2">
            <UserPlus size={16} className="text-[#1E227D]" />
            <h3 className="font-display text-lg font-bold text-[#1E227D]">Add a New Person</h3>
          </div>
        </div>

        <p className="font-body text-xs text-zinc-500">
          Add a family member or friend so you can book appointments on their behalf.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-body text-xs">
            {error}
          </div>
        )}

        <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50/50 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Title</label>
              <select
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              >
                <option value="">Select</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Miss">Miss</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Mobile / Cell</label>
              <input
                type="tel"
                name="mobile"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.mobile}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-body text-xs font-bold text-[#2D2136]">Address</label>
              <input
                type="text"
                name="address1"
                placeholder="Address Line 1"
                value={form.address1}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] mb-1.5"
              />
              <input
                type="text"
                name="address2"
                placeholder="Address Line 2 (Optional)"
                value={form.address2}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Suburb</label>
              <input
                type="text"
                name="suburb"
                value={form.suburb}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">State</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Zip / Post Code</label>
              <input
                type="text"
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-body text-xs font-bold text-[#2D2136]">Country</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-body text-xs font-bold text-[#2D2136]">Date of Birth *</label>
              <div className="grid grid-cols-3 gap-3">
                <select name="dobMonth" value={form.dobMonth} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                  ))}
                </select>
                <select name="dobDay" value={form.dobDay} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <select name="dobYear" value={form.dobYear} onChange={handleChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-body text-xs font-bold text-[#2D2136]">Relationship *</label>
              <select
                name="relationship"
                value={form.relationship}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
              >
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => router.push("/profile")} className="!px-5 !py-2.5 !text-xs font-bold shadow-none">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddPerson} className="!px-6 !py-2.5 !text-xs font-bold shadow-none">
            <Check size={14} className="mr-1.5" />
            Save Person
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}