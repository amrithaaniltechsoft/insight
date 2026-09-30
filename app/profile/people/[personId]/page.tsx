"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Users, Pencil, Check, Calendar, Clock, Tag, Stethoscope, FileText, ArrowUpRight, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/profile/DashboardLayout";
import Button from "@/components/ui/Button";
import { deletePerson, fetchPeople, savePerson, getPersonFullName, Person } from "@/lib/people";
import {
  Appointment,
  fetchAppointments,
  formatDate,
  formatPrice,
  formatTime,
  resolveServiceSlug,
} from "@/lib/appointments";

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

/** Offered in the title dropdown. `patients.title` itself is free text. */
const TITLE_OPTIONS = ["Mr", "Mrs", "Ms", "Miss", "Dr"];

interface PersonBooking {
  id: string;
  serviceSlug: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  price: string;
  appointmentCode: string;
  status: string;
  paymentStatus: string;
}

/**
 * Bookings come from the `appointments` table, which is written when the wizard
 * reaches Continue. The browser copy under `user_bookings` is only a cache of
 * the final confirmation step, so it misses anything booked without finishing
 * the wizard.
 */
function toPersonBooking(appointment: Appointment): PersonBooking {
  return {
    id: String(appointment.id),
    serviceSlug: resolveServiceSlug(appointment),
    serviceName: appointment.service_name || "General Consultation",
    category: appointment.category_name || "Consultations",
    date: appointment.appointment_date,
    time: formatTime(appointment.start_time),
    price: formatPrice(appointment.service_price),
    appointmentCode: appointment.appointment_code,
    status: appointment.status,
    paymentStatus: appointment.payment_status,
  };
}

export default function PersonDetailsPage() {
  const params = useParams<{ personId: string }>();
  const personId = params?.personId || "";
  const router = useRouter();

  // The person is a `patients` row, so it is fetched rather than read from
  // browser storage. A guest has no customer record, so there is nothing to
  // show and the "not found" state handles it.
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<PersonBooking[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Only removable while they have no bookings. Anyone with appointments keeps
  // their record, so the action is absent rather than offered and then refused.
  const canRemove = !isEditing && bookings.length === 0;

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
    country: "",
    relationship: "Family",
  });

  useEffect(() => {
    const customerEmail =
      localStorage.getItem("is_signed_in") === "true"
        ? localStorage.getItem("user_email") || ""
        : "";

    let cancelled = false;
    // State is set inside the async callback, not in the effect body, so this
    // does not cascade a render on mount.
    (async () => {
      try {
        const [people, appointments] = await Promise.all([
          customerEmail ? fetchPeople(customerEmail) : Promise.resolve([]),
          // The person id is the `patients.id`, so this is the same person's
          // appointments and nothing else.
          customerEmail
            ? fetchAppointments(customerEmail, personId)
            : Promise.resolve([]),
        ]);
        if (cancelled) return;
        const found = people.find((p) => p.id === personId) || null;
        setPerson(found);
        setBookings(appointments.map(toPersonBooking));
      } catch {
        if (cancelled) return;
        setError("Failed to load this person.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
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
      // The address fields are packed into the one `patients.address` column and
      // come back individually. Addresses saved before that format existed cannot
      // be told apart, so they fill Address Line 1 and the rest start empty.
      ...(person.addressIsSplit
        ? person.addressParts
        : {
            address1: person.address,
            address2: "",
            suburb: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          }),
      relationship: person.relationship,
    });
    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Mobile accepts digits only — drop any other characters as they are typed.
    setForm((prev) => ({
      ...prev,
      [name]: name === "mobile" ? value.replace(/\D/g, "").slice(0, 20) : value,
    }));
    setError("");
  };

  const handleSaveEdit = async () => {
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
    // The address parts are stored field by field, so a new address needs a city
    // and postcode to be readable back into the right inputs. An address the
    // user has not touched is left as it was found — otherwise changing only a
    // phone number on a record saved before the fields were separated would be
    // blocked until the whole address was retyped.
    const savedParts = person.addressIsSplit
      ? person.addressParts
      : {
          address1: person.address,
          address2: "",
          suburb: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        };
    const addressChanged =
      form.address1.trim() !== savedParts.address1.trim() ||
      form.address2.trim() !== savedParts.address2.trim() ||
      form.suburb.trim() !== savedParts.suburb.trim() ||
      form.city.trim() !== savedParts.city.trim() ||
      form.state.trim() !== savedParts.state.trim() ||
      form.zipCode.trim() !== savedParts.zipCode.trim() ||
      form.country.trim() !== savedParts.country.trim();

    if (addressChanged && !form.address1.trim()) {
      setError("Address Line 1 is required.");
      return;
    }
    if (addressChanged && (!form.city.trim() || !form.zipCode.trim())) {
      setError("City and Zip / Post Code are required.");
      return;
    }

    const customerEmail = localStorage.getItem("user_email") || "";
    if (!customerEmail) {
      setError("Please sign in before editing this person.");
      return;
    }

    const formattedDob = `${form.dobYear}-${form.dobMonth.padStart(2, "0")}-${form.dobDay.padStart(2, "0")}`;

    setSaving(true);
    try {
      const updatedPerson = await savePerson({
        customerEmail,
        // Editing an existing patient, so the API updates that row rather than
        // looking for a match to overwrite.
        patientId: person.patientId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender,
        dob: formattedDob,
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        // The parts are sent individually; the API packs them into the single
        // `patients.address` column field by field.
        address: {
          address1: form.address1.trim(),
          address2: form.address2.trim(),
          suburb: form.suburb.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          zipCode: form.zipCode.trim(),
          country: form.country.trim(),
        },
        title: form.title.trim(),
        relationship: form.relationship,
      });

      setPerson(updatedPerson);
      // Bookings are keyed on the patient id, which an edit does not change, so
      // the list already on screen stays correct.
      setIsEditing(false);
      setMessage("Person details updated successfully.");
      window.dispatchEvent(new Event("people-changed"));
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update this person."
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * Removes this person and returns to the list. Only offered when they have no
   * appointments, and the API refuses it either way — `appointments.patient_id`
   * is ON DELETE CASCADE, so this is the only thing standing between a misclick
   * and a deleted appointment history.
   */
  const handleDelete = async () => {
    const customerEmail = localStorage.getItem("user_email") || "";
    if (!customerEmail) {
      setError("Please sign in before removing this person.");
      return;
    }

    setDeleting(true);
    setError("");
    try {
      await deletePerson(customerEmail, personId);
      // Keeps the sidebar "My People" count in step with the deletion.
      window.dispatchEvent(new Event("people-changed"));
      router.push("/profile");
    } catch (deleteError) {
      setConfirmingDelete(false);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to remove this person."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      {!loading && !person && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Users size={28} className="text-zinc-300" />
          <h2 className="font-display text-lg font-bold text-[#2D2136]">Person not found</h2>
          <p className="font-body text-sm text-zinc-500">
            This person is no longer on your account.
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

      {loading && (
        <div className="py-16 text-center">
          <p className="font-body text-sm text-zinc-400">Loading&hellip;</p>
        </div>
      )}

      {!loading && person && (
        <div className="flex flex-col gap-6">
          {/* Header: back link on the left, every action grouped on the right.
              Keeping this to two children stops the code, Edit and Remove from
              being spread across the full width by justify-between. */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 font-body text-sm font-bold text-[#1E227D] transition-colors hover:text-[#F000E2]"
              >
                <ArrowLeft size={16} />
                Back to My Profile
              </Link>

              <div className="flex items-center gap-2">
                {person.patientCode && (
                  <span className="rounded-lg bg-zinc-100 px-2.5 py-1.5 font-body text-[10px] font-bold tracking-wider text-zinc-500">
                    {person.patientCode}
                  </span>
                )}

                {!isEditing && (
                  <button
                    onClick={openEdit}
                    className="flex items-center gap-1.5 rounded-xl border border-[#1E227D]/20 bg-[#1E227D]/5 px-4 py-2.5 font-body text-xs font-bold text-[#1E227D] transition-colors hover:bg-[#1E227D]/10 cursor-pointer"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                )}

                {canRemove && !confirmingDelete && (
                  <button
                    onClick={() => setConfirmingDelete(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 font-body text-xs font-bold text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Its own row, so the confirmation never has to share horizontal
                space with the header actions. */}
            {confirmingDelete && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="font-body text-xs font-bold text-red-700">
                  Remove {person.firstName} {person.lastName}? This cannot be
                  undone.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg bg-red-600 px-4 py-2 font-body text-xs font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                  >
                    {deleting ? "Removing…" : "Yes, remove"}
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    disabled={deleting}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 font-body text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
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
                      {/* `patients.title` holds free text, so a title set in the
                          admin portal (Dr, Prof, …) may not be one of the
                          options below. It has to stay selectable, otherwise the
                          select would show blank and saving would wipe it. */}
                      {form.title &&
                        !TITLE_OPTIONS.includes(form.title) && (
                          <option value={form.title}>{form.title}</option>
                        )}
                      {TITLE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
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
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="address1" className="font-body text-xs font-bold text-[#2D2136]">Address Line 1 *</label>
                    <input
                      id="address1"
                      type="text"
                      name="address1"
                      placeholder="e.g. 12 High Street"
                      value={form.address1}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="address2" className="font-body text-xs font-bold text-[#2D2136]">Address Line 2</label>
                    <input
                      id="address2"
                      type="text"
                      name="address2"
                      placeholder="Apartment, Flat or Unit (Optional)"
                      value={form.address2}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="suburb" className="font-body text-xs font-bold text-[#2D2136]">Suburb</label>
                    <input
                      id="suburb"
                      type="text"
                      name="suburb"
                      placeholder="e.g. Blakenall (Optional)"
                      value={form.suburb}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="font-body text-xs font-bold text-[#2D2136]">City *</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="e.g. Walsall"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="font-body text-xs font-bold text-[#2D2136]">State / County</label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      placeholder="e.g. West Midlands (Optional)"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="zipCode" className="font-body text-xs font-bold text-[#2D2136]">Zip / Post Code *</label>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      placeholder="e.g. WS5 4QL"
                      value={form.zipCode}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="country" className="font-body text-xs font-bold text-[#2D2136]">Country</label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      placeholder="e.g. United Kingdom (Optional)"
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
                <Button
                  variant="primary"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="!px-6 !py-2.5 !text-xs font-bold shadow-none"
                >
                  <Check size={14} className="mr-1.5" />
                  {saving ? "Saving..." : "Save Changes"}
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
                    {person.address && (
                      <span className="flex items-center gap-1.5 font-body text-xs text-zinc-500">
                        <MapPin size={13} className="text-[#F000E2]" />
                        {person.address}
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
                  <DetailField label="Address" value={person.address} className="sm:col-span-2" />
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
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1E227D]/5 text-[10px] font-bold tracking-wider text-[#1E227D]">
                                {booking.appointmentCode}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold tracking-wider text-emerald-700">
                                {booking.status}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold tracking-wider text-amber-700">
                                {booking.paymentStatus}
                              </span>
                            </div>
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