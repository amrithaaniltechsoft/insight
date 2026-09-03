"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Users, Pencil, Trash2, Check, X, Calendar, Clock, Tag, Stethoscope, FileText, ArrowUpRight } from "lucide-react";
import DashboardLayout from "@/components/profile/DashboardLayout";
import Button from "@/components/ui/Button";
import { getPeople, savePeople, getPersonFullName, Person } from "@/lib/people";

function DetailField({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <p className="font-body text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
      <p className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136]">
        {value || "—"}
      </p>
    </div>
  );
}

function splitDob(dob: string): { year: string; month: string; day: string } {
  if (!dob) return { year: "", month: "", day: "" };
  const [year, month, day] = dob.split("-");
  return {
    year: year || "",
    month: month ? String(parseInt(month, 10)) : "",
    day: day ? String(parseInt(day, 10)) : "",
  };
}

interface PersonBooking {
  id: string;
  serviceSlug: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  price: string;
}

interface StoredBooking {
  id?: string;
  serviceSlug?: string;
  serviceName?: string;
  category?: string;
  date?: string;
  time?: string;
  price?: string;
  patientName?: string | null;
  patientEmail?: string | null;
}

function loadBookingsForPerson(person: Person): PersonBooking[] {
  try {
    const raw = localStorage.getItem("user_bookings");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredBooking[];
    if (!Array.isArray(parsed)) return [];
    const fullName = getPersonFullName(person);
    return parsed
      .filter((b) =>
        (person.email &&
          b.patientEmail &&
          b.patientEmail.trim().toLowerCase() === person.email.trim().toLowerCase()) ||
        (fullName &&
          b.patientName &&
          b.patientName.trim().toLowerCase() === fullName.trim().toLowerCase())
      )
      .map((b) => ({
        id: b.id || Math.random().toString(36).substr(2, 9),
        serviceSlug: b.serviceSlug || "general-consultation",
        serviceName: b.serviceName || "General Consultation",
        category: b.category || "Consultations",
        date: b.date || "",
        time: b.time || "",
        price: b.price || "£95.00",
      }));
  } catch {
    return [];
  }
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function PersonDetailsPage() {
  const params = useParams<{ personId: string }>();
  const personId = params?.personId || "";
  const router = useRouter();

  const [person, setPerson] = useState<Person | null>(
    () => getPeople().find((p) => p.id === personId) || null
  );

  const [bookings, setBookings] = useState<PersonBooking[]>(() => {
    const found = getPeople().find((p) => p.id === personId);
    return found ? loadBookingsForPerson(found) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState(() => {
    const found = getPeople().find((p) => p.id === personId);
    const dob = found ? splitDob(found.dob) : { year: "", month: "", day: "" };
    return {
      title: found?.title || "",
      gender: found?.gender || "",
      firstName: found?.firstName || "",
      lastName: found?.lastName || "",
      email: found?.email || "",
      mobile: found?.mobile || "",
      dobDay: dob.day,
      dobMonth: dob.month,
      dobYear: dob.year,
      address1: found?.address1 || "",
      address2: found?.address2 || "",
      suburb: found?.suburb || "",
      city: found?.city || "",
      state: found?.state || "",
      zipCode: found?.zipCode || "",
      country: found?.country || "",
      relationship: found?.relationship || "Family",
    };
  });

  useEffect(() => {
    const syncPerson = () => {
      const found = getPeople().find((p) => p.id === personId) || null;
      setPerson(found);
      setBookings(found ? loadBookingsForPerson(found) : []);
    };
    window.addEventListener("storage", syncPerson);
    window.addEventListener("auth-state-changed", syncPerson);
    return () => {
      window.removeEventListener("storage", syncPerson);
      window.removeEventListener("auth-state-changed", syncPerson);
    };
  }, [personId]);

  const openEdit = () => {
    if (!person) return;
    const dob = splitDob(person.dob);
    setForm({
      title: person.title,
      gender: person.gender,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      mobile: person.mobile,
      dobDay: dob.day,
      dobMonth: dob.month,
      dobYear: dob.year,
      address1: person.address1,
      address2: person.address2,
      suburb: person.suburb,
      city: person.city,
      state: person.state,
      zipCode: person.zipCode,
      country: person.country,
      relationship: person.relationship,
    });
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSaveEdit = () => {
    if (!person) return;
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
    const updatedPerson: Person = {
      ...person,
      title: form.title,
      gender: form.gender,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      dob: formattedDob,
      address1: form.address1.trim(),
      address2: form.address2.trim(),
      suburb: form.suburb.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      country: form.country.trim(),
      relationship: form.relationship,
    };

    const updated = getPeople().map((p) => (p.id === personId ? updatedPerson : p));
    savePeople(updated);
    window.dispatchEvent(new Event("storage"));
    setPerson(updatedPerson);
    setBookings(loadBookingsForPerson(updatedPerson));
    setIsEditing(false);
    setMessage("Person details updated successfully.");
  };

  const handleDelete = () => {
    const updated = getPeople().filter((p) => p.id !== personId);
    savePeople(updated);
    window.dispatchEvent(new Event("storage"));
    router.push("/profile");
  };

  return (
    <DashboardLayout>
      {!person && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Users size={28} className="text-zinc-300" />
          <h2 className="font-display text-lg font-bold text-[#2D2136]">Person not found</h2>
          <p className="font-body text-sm text-zinc-500">
            This person may have been removed from your saved people.
          </p>
          <Link
            href="/profile"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1E227D] to-[#F000E2] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Back to My Profile
          </Link>
        </div>
      )}

      {person && (
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 font-body text-sm font-bold text-[#1E227D] transition-colors hover:text-[#F000E2]"
            >
              <ArrowLeft size={16} />
              Back to My Profile
            </Link>

            {!isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={openEdit}
                  className="flex items-center gap-1.5 rounded-xl border border-[#1E227D]/20 bg-[#1E227D]/5 px-4 py-2.5 font-body text-xs font-bold text-[#1E227D] transition-colors hover:bg-[#1E227D]/10 cursor-pointer"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                {confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-4 py-2.5 font-body text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-50 cursor-pointer"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 font-body text-xs font-bold text-white transition-colors hover:bg-red-600 cursor-pointer"
                    >
                      <Trash2 size={14} />
                      Confirm Delete
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-body text-xs font-bold text-red-500 transition-colors hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-body text-xs">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-body text-xs">
              {error}
            </div>
          )}

          {confirmDelete && (
            <div className="border border-red-200 bg-red-50/50 rounded-2xl p-4 text-left">
              <p className="font-display text-sm font-bold text-red-600">
                Delete {getPersonFullName(person)}?
              </p>
              <p className="font-body text-xs text-zinc-500 mt-1">
                This will permanently remove this person from your saved people. This action cannot be undone.
              </p>
            </div>
          )}

          {isEditing ? (
            /* EDIT FORM */
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Pencil size={16} className="text-[#1E227D]" />
                <h3 className="font-display text-lg font-bold text-[#1E227D]">Edit Person Details</h3>
              </div>
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
                <Button variant="secondary" onClick={() => { setIsEditing(false); setError(""); }} className="!px-5 !py-2.5 !text-xs font-bold shadow-none">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSaveEdit} className="!px-6 !py-2.5 !text-xs font-bold shadow-none">
                  <Check size={14} className="mr-1.5" />
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Profile summary card */}
              <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-gradient-to-r from-[#1E227D]/5 to-[#F000E2]/5 p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E227D] to-[#F000E2] text-lg font-bold text-white">
                  {person.firstName.charAt(0)}
                  {person.lastName.charAt(0)}
                </div>
                <div className="min-w-0 flex flex-col">
                  <span className="font-display text-xl font-bold text-[#2D2136] truncate">
                    {person.title && `${person.title} `}{getPersonFullName(person)}
                  </span>
                  <span className="font-body text-sm text-zinc-500">
                    {person.relationship}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    {person.email && (
                      <span className="flex items-center gap-1.5 font-body text-xs text-zinc-500">
                        <Mail size={13} className="text-[#F000E2]" />
                        {person.email}
                      </span>
                    )}
                    {person.mobile && (
                      <span className="flex items-center gap-1.5 font-body text-xs text-zinc-500">
                        <Phone size={13} className="text-[#F000E2]" />
                        {person.mobile}
                      </span>
                    )}
                    {person.country && (
                      <span className="flex items-center gap-1.5 font-body text-xs text-zinc-500">
                        <MapPin size={13} className="text-[#F000E2]" />
                        {person.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="flex flex-col gap-4">
                <h3 className="font-display text-lg font-bold text-[#1E227D]">Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailField label="Title" value={person.title} />
                  <DetailField label="Gender" value={person.gender} />
                  <DetailField label="Date of Birth" value={person.dob} />
                  <DetailField label="Relationship" value={person.relationship} />
                  <DetailField label="Email" value={person.email} />
                  <DetailField label="Mobile" value={person.mobile} />
                  <DetailField label="Address Line 1" value={person.address1} />
                  <DetailField label="Address Line 2" value={person.address2} />
                  <DetailField label="Suburb" value={person.suburb} />
                  <DetailField label="City" value={person.city} />
                  <DetailField label="State" value={person.state} />
                  <DetailField label="Zip Code" value={person.zipCode} />
                  <DetailField label="Country" value={person.country} className="sm:col-span-2" />
                </div>
              </div>

              {/* Bookings */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-[#1E227D]">Bookings</h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1E227D]/5 text-[11px] font-bold text-[#1E227D]">
                    {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
                  </span>
                </div>
                {bookings.length === 0 ? (
                  <div className="border border-zinc-200 rounded-2xl p-8 text-center text-zinc-400 font-body text-xs">
                    No bookings found for this person.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white transition-colors hover:border-[#1E227D]/30"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-[#1E227D]/5 flex items-center justify-center text-[#1E227D] shrink-0">
                            <Stethoscope size={18} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-display text-xs font-bold text-zinc-400 uppercase tracking-wider leading-none">
                              {booking.category}
                            </span>
                            <h4 className="font-display text-base font-bold text-[#1E227D] mt-1.5 leading-tight">
                              {booking.serviceName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 font-body text-xs text-zinc-600">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-[#1E227D]/70" />
                                <span>{formatDate(booking.date)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock size={14} className="text-[#1E227D]/70" />
                                <span>{booking.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-semibold text-[#1E227D]">
                                <Tag size={14} className="text-[#1E227D]/70" />
                                <span>{booking.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-[#1E227D]">Results</h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1E227D]/5 text-[11px] font-bold text-[#1E227D]">
                    {bookings.length} {bookings.length === 1 ? "result" : "results"}
                  </span>
                </div>
                {bookings.length === 0 ? (
                  <div className="border border-zinc-200 rounded-2xl p-8 text-center text-zinc-400 font-body text-xs">
                    No results available for this person yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {bookings.map((booking) => (
                      <div
                        key={`res-${booking.id}`}
                        className="border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white transition-colors hover:border-[#1E227D]/30"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-[#1E227D]/5 flex items-center justify-center text-[#1E227D] shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-xs font-bold text-zinc-400 uppercase tracking-wider leading-none">
                                {booking.category}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700">
                                Completed
                              </span>
                            </div>
                            <h4 className="font-display text-base font-bold text-[#1E227D] mt-2 leading-tight">
                              {booking.serviceName} Report
                            </h4>
                            <div className="flex items-center gap-1.5 mt-2.5 font-body text-xs text-zinc-600">
                              <Calendar size={14} className="text-[#1E227D]/70" />
                              <span>Released: {formatDate(booking.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex sm:justify-end">
                          <a
                            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-300 text-sm font-bold text-[#2D2136] bg-white hover:border-[#1E227D] hover:text-[#1E227D] transition-all w-full sm:w-auto hover:bg-zinc-50"
                          >
                            <span>View Result</span>
                            <ArrowUpRight size={14} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}