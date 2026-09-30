"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, Trash2, UserPlus, Users } from "lucide-react";
import DashboardLayout from "@/components/profile/DashboardLayout";
import Button from "@/components/ui/Button";
import {
  deletePerson,
  fetchPeople,
  savePerson,
  getPersonFullName,
  getPersonInitials,
  Person,
} from "@/lib/people";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
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
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [buttonState, setButtonState] = useState<"idle" | "saving" | "saved">("idle");

  const [people, setPeople] = useState<Person[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [peopleError, setPeopleError] = useState("");
  const [savingPerson, setSavingPerson] = useState(false);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [personForm, setPersonForm] = useState({
    title: "",
    firstName: "",
    lastName: "",
    gender: "",
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
  const [personError, setPersonError] = useState("");
  /** Person id being removed, and the one awaiting confirmation. */
  const [removingPersonId, setRemovingPersonId] = useState<string | null>(null);
  const [confirmingPersonId, setConfirmingPersonId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  // Email the user signed in with — used to detect duplicate email changes
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    // Load existing information from localStorage
    const mobile = localStorage.getItem("user_mobile") || "";
    const fName = localStorage.getItem("user_first_name") || "";
    const lName = localStorage.getItem("user_last_name") || "";
    const gender = localStorage.getItem("user_gender") || "";
    const email = localStorage.getItem("user_email") || "";
    const dobStr = localStorage.getItem("user_dob") || "";

    setOriginalEmail(email);
    
    let dobYear = "";
    let dobMonth = "";
    let dobDay = "";
    if (dobStr && dobStr.includes("-")) {
      const parts = dobStr.split("-");
      dobYear = parts[0] || "";
      dobMonth = parts[1] ? String(parseInt(parts[1], 10)) : "";
      dobDay = parts[2] ? String(parseInt(parts[2], 10)) : "";
    }

    setFormData({
      title: localStorage.getItem("user_title") || "",
      gender: gender,
      firstName: fName,
      lastName: lName,
      email: email,
      mobile: mobile,
      dobDay: dobDay,
      dobMonth: dobMonth,
      dobYear: dobYear,
      address1: localStorage.getItem("user_address1") || "",
      address2: localStorage.getItem("user_address2") || "",
      suburb: localStorage.getItem("user_suburb") || "",
      city: localStorage.getItem("user_city") || "",
      state: localStorage.getItem("user_state") || "",
      zipCode: localStorage.getItem("user_zip") || "",
      country: localStorage.getItem("user_country") || "United Kingdom",
    });
  }, []);

  // "My People" is read from the `patients` table rather than browser storage, so
  // it is the same on every device. Guests have no customer record yet, which
  // the API reports as an empty list rather than an error.
  useEffect(() => {
    const customerEmail =
      localStorage.getItem("is_signed_in") === "true"
        ? localStorage.getItem("user_email") || ""
        : "";

    let cancelled = false;
    // Every state update happens in a promise callback rather than in the effect
    // body, so this does not cascade a render on mount.
    (async () => {
      if (!customerEmail) {
        setPeople([]);
        setPeopleLoading(false);
        return;
      }
      try {
        const loaded = await fetchPeople(customerEmail);
        if (cancelled) return;
        setPeople(loaded);
      } catch (error) {
        if (cancelled) return;
        setPeopleError(
          error instanceof Error
            ? error.message
            : "Failed to load your people."
        );
      } finally {
        if (!cancelled) setPeopleLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const openAddPerson = () => {
    setPersonForm({
      title: "",
      firstName: "",
      lastName: "",
      gender: "",
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
    setPersonError("");
    setShowAddPerson(true);
  };

  const handlePersonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonForm((prev) => ({ ...prev, [name]: value }));
    setPersonError("");
  };

  const handleAddPerson = async () => {
    if (!personForm.firstName.trim() || !personForm.lastName.trim()) {
      setPersonError("First Name and Last Name are required.");
      return;
    }
    if (!personForm.gender) {
      setPersonError("Please select a gender.");
      return;
    }
    if (!personForm.dobDay || !personForm.dobMonth || !personForm.dobYear) {
      setPersonError("Please specify the person's full Date of Birth.");
      return;
    }

    const customerEmail = localStorage.getItem("user_email") || "";
    if (!customerEmail) {
      setPersonError("Please sign in before adding someone to book for.");
      return;
    }

    const formattedDob = `${personForm.dobYear}-${personForm.dobMonth.padStart(2, "0")}-${personForm.dobDay.padStart(2, "0")}`;

    setSavingPerson(true);
    setPersonError("");
    try {
      const newPerson = await savePerson({
        customerEmail,
        firstName: personForm.firstName.trim(),
        lastName: personForm.lastName.trim(),
        gender: personForm.gender,
        dob: formattedDob,
        email: personForm.email.trim(),
        mobile: personForm.mobile.trim(),
        // The parts are sent individually; the API packs them into the single
        // `patients.address` column field by field.
        address: {
          address1: personForm.address1.trim(),
          address2: personForm.address2.trim(),
          suburb: personForm.suburb.trim(),
          city: personForm.city.trim(),
          state: personForm.state.trim(),
          zipCode: personForm.zipCode.trim(),
          country: personForm.country.trim(),
        },
        title: personForm.title.trim(),
        relationship: personForm.relationship,
      });

      setPeople((prev) => [newPerson, ...prev]);
      setShowAddPerson(false);
      setPersonError("");
      // Keeps the sidebar count in step with this list.
      window.dispatchEvent(new Event("people-changed"));
    } catch (error) {
      setPersonError(
        error instanceof Error ? error.message : "Failed to add this person."
      );
    } finally {
      setSavingPerson(false);
    }
  };

  /**
   * Removes someone from "My People". Only offered for a person with no
   * appointments: `appointments.patient_id` is ON DELETE CASCADE, so removing
   * someone who has booked would take their appointment history with them. The
   * API enforces the same rule.
   */
  const handleRemovePerson = async (person: Person) => {
    const customerEmail = localStorage.getItem("user_email") || "";
    if (!customerEmail) {
      setPeopleError("Please sign in before removing a person.");
      return;
    }

    setRemovingPersonId(person.patientId);
    setPeopleError("");
    try {
      await deletePerson(customerEmail, person.patientId);
      setPeople((prev) => prev.filter((p) => p.patientId !== person.patientId));
      window.dispatchEvent(new Event("people-changed"));
    } catch (error) {
      setPeopleError(
        error instanceof Error ? error.message : "Failed to remove this person."
      );
    } finally {
      setRemovingPersonId(null);
      setConfirmingPersonId(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setMessage("");
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First Name and Last Name are required.");
      return;
    }
    if (!formData.gender) {
      setError("Please select your gender.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) {
      setError("Please specify your full Date of Birth.");
      return;
    }
    if (!formData.address1.trim()) {
      setError("Address Line 1 is required.");
      return;
    }
    if (!formData.city.trim()) {
      setError("City is required.");
      return;
    }
    if (!formData.zipCode.trim()) {
      setError("Zip/Post Code is required.");
      return;
    }

    setButtonState("saving");
    setError("");
    setMessage("");

    // Duplicate email check — one email can only belong to one person
    if (formData.email.trim().toLowerCase() !== originalEmail.toLowerCase()) {
      try {
        const checkRes = await fetch(`${API_URL}/auth/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email.trim() }),
        });
        const checkData = await checkRes.json();
        if (checkData.exists) {
          setError("This email is already registered to another account. One email can only be used by one person.");
          setButtonState("idle");
          return;
        }
      } catch {
        setError("Could not verify email availability. Please try again.");
        setButtonState("idle");
        return;
      }
    }

    const formattedDob = `${formData.dobYear}-${formData.dobMonth.padStart(2, "0")}-${formData.dobDay.padStart(2, "0")}`;

    // Save to localStorage
    localStorage.setItem("user_title", formData.title);
    localStorage.setItem("user_gender", formData.gender);
    localStorage.setItem("user_first_name", formData.firstName.trim());
    localStorage.setItem("user_last_name", formData.lastName.trim());
    localStorage.setItem("user_email", formData.email.trim());
    localStorage.setItem("user_mobile", formData.mobile.trim());
    localStorage.setItem("user_dob", formattedDob);
    localStorage.setItem("user_address1", formData.address1.trim());
    localStorage.setItem("user_address2", formData.address2.trim());
    localStorage.setItem("user_suburb", formData.suburb.trim());
    localStorage.setItem("user_city", formData.city.trim());
    localStorage.setItem("user_state", formData.state.trim());
    localStorage.setItem("user_zip", formData.zipCode.trim());
    localStorage.setItem("user_country", formData.country.trim());

    window.dispatchEvent(new Event("storage"));

    // Save to backend
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          gender: formData.gender,
          dob: formattedDob,
          title: formData.title,
          phone: formData.mobile.trim(),
          address_line_1: formData.address1.trim(),
          address_line_2: formData.address2.trim(),
          suburb: formData.suburb.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip_code: formData.zipCode.trim(),
          country: formData.country.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to save profile to server.');
        setButtonState("idle");
        return;
      }
    } catch {
      // localStorage already saved; server save failed
      setError("Saved locally but server sync failed. Please try again later.");
    }

    setMessage("Profile details saved successfully!");
    setButtonState("saved");

    setTimeout(() => {
      setButtonState("idle");
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 text-left">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1E227D] mb-1">
            My Profile
          </h2>
          <p className="font-body text-xs text-zinc-500">
            View and update your personal dashboard information.
          </p>
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

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Title & Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Title</label>
              <select
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
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
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              />
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-[#2D2136]">Mobile / Cell *</label>
              <input
                type="tel"
                name="mobile"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              />
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-body text-xs font-bold text-[#2D2136]">Date of Birth *</label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  name="dobMonth"
                  value={formData.dobMonth}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
                
                <select
                  name="dobDay"
                  value={formData.dobDay}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                  required
                >
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                
                <select
                  name="dobYear"
                  value={formData.dobYear}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                  required
                >
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newAddress1" className="font-body text-xs font-bold text-[#2D2136]">Address Line 1 *</label>
              <input
                id="newAddress1"
                type="text"
                name="address1"
                placeholder="e.g. 12 High Street"
                value={formData.address1}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newAddress2" className="font-body text-xs font-bold text-[#2D2136]">Address Line 2</label>
              <input
                id="newAddress2"
                type="text"
                name="address2"
                placeholder="Apartment, Flat or Unit (Optional)"
                value={formData.address2}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newSuburb" className="font-body text-xs font-bold text-[#2D2136]">Suburb</label>
              <input
                id="newSuburb"
                type="text"
                name="suburb"
                placeholder="e.g. Blakenall (Optional)"
                value={formData.suburb}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newCity" className="font-body text-xs font-bold text-[#2D2136]">City *</label>
              <input
                id="newCity"
                type="text"
                name="city"
                placeholder="e.g. Walsall"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newState" className="font-body text-xs font-bold text-[#2D2136]">State / County</label>
              <input
                id="newState"
                type="text"
                name="state"
                placeholder="e.g. West Midlands (Optional)"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="newZipCode" className="font-body text-xs font-bold text-[#2D2136]">Zip / Post Code *</label>
              <input
                id="newZipCode"
                type="text"
                name="zipCode"
                placeholder="e.g. WS5 4QL"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="newCountry" className="font-body text-xs font-bold text-[#2D2136]">Country</label>
              <input
                id="newCountry"
                type="text"
                name="country"
                placeholder="e.g. United Kingdom (Optional)"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="primary"
              type="submit"
              className="!px-8 !py-3 font-body text-sm font-bold shadow-none min-w-[150px]"
              disabled={buttonState === 'saving' || buttonState === 'saved'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={buttonState}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2"
                >
                  {buttonState === "idle" && "Save Profile"}
                  {buttonState === "saving" && "Saving..."}
                  {buttonState === "saved" && (
                    <>
                      <Check size={16} />
                      <span>Saved!</span>
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </Button>
          </div>
        </form>

        {/* FAMILY & FRIENDS */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-[#1E227D]">
                People You Can Book For
              </h3>
              <p className="font-body text-xs text-zinc-500">
                Add family members or friends so you can book appointments on their behalf.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={openAddPerson}
              className="!px-5 !py-2.5 !text-xs font-bold shadow-none"
            >
              <UserPlus size={15} className="mr-1.5" />
              Add Person
            </Button>
          </div>

          {personError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-body text-xs">
              {personError}
            </div>
          )}

          {showAddPerson && (
            <div className="border border-zinc-200 rounded-2xl p-5 bg-zinc-50/50 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <UserPlus size={16} className="text-[#1E227D]" />
                <span className="font-display text-sm font-bold text-[#2D2136]">Add a New Person</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Title</label>
                  <select
                    name="title"
                    value={personForm.title}
                    onChange={handlePersonInputChange}
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
                    value={personForm.gender}
                    onChange={handlePersonInputChange}
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
                    value={personForm.firstName}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={personForm.lastName}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={personForm.email}
                    onChange={handlePersonInputChange}
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
                    value={personForm.mobile}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Address</label>
                  <input
                    type="text"
                    name="address1"
                    placeholder="Address Line 1"
                    value={personForm.address1}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] mb-1.5"
                  />
                  <input
                    type="text"
                    name="address2"
                    placeholder="Address Line 2 (Optional)"
                    value={personForm.address2}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Suburb</label>
                  <input
                    type="text"
                    name="suburb"
                    value={personForm.suburb}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">City</label>
                  <input
                    type="text"
                    name="city"
                    value={personForm.city}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">State</label>
                  <input
                    type="text"
                    name="state"
                    value={personForm.state}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Zip / Post Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={personForm.zipCode}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={personForm.country}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Date of Birth *</label>
                  <div className="grid grid-cols-3 gap-3">
                    <select name="dobMonth" value={personForm.dobMonth} onChange={handlePersonInputChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                      ))}
                    </select>
                    <select name="dobDay" value={personForm.dobDay} onChange={handlePersonInputChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select name="dobYear" value={personForm.dobYear} onChange={handlePersonInputChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                      <option value="">Year</option>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Relationship *</label>
                  <select
                    name="relationship"
                    value={personForm.relationship}
                    onChange={handlePersonInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setShowAddPerson(false)} className="!px-5 !py-2.5 !text-xs font-bold shadow-none">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddPerson}
                  disabled={savingPerson}
                  className="!px-6 !py-2.5 !text-xs font-bold shadow-none"
                >
                  {savingPerson ? "Saving..." : "Save Person"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {peopleError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-xs font-semibold text-red-700">
                {peopleError}
              </div>
            )}
            {peopleLoading && (
              <div className="border border-dashed border-zinc-300 rounded-2xl p-8 text-center">
                <p className="font-body text-xs text-zinc-400">Loading your people&hellip;</p>
              </div>
            )}
            {!peopleLoading && people.length === 0 && !showAddPerson && (
              <div className="border border-dashed border-zinc-300 rounded-2xl p-8 text-center">
                <Users size={22} className="mx-auto text-zinc-300 mb-2" />
                <p className="font-body text-xs text-zinc-400">
                  No people added yet. Click &ldquo;Add Person&rdquo; to save a family member or friend you&rsquo;d like to book for.
                </p>
              </div>
            )}
            {people.map((person) => (
              <div key={person.id} className="border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-4 bg-white transition-colors hover:border-[#1E227D]/30">
                <Link
                  href={`/profile/people/${person.id}`}
                  className="flex items-center gap-3 min-w-0 flex-1 group"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E0A2F5] to-[#1E227D] flex items-center justify-center text-white font-display text-sm font-bold shrink-0">
                    {getPersonInitials(person)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-sm font-bold text-[#2D2136] truncate group-hover:text-[#1E227D] transition-colors">
                      {getPersonFullName(person)}
                    </span>
                    <span className="font-body text-xs text-zinc-500">
                      {[person.relationship, person.gender, person.dob ? `DOB ${person.dob}` : ""].filter(Boolean).join(" &middot; ")}
                    </span>
                    {(person.email || person.mobile) && (
                      <span className="font-body text-xs text-zinc-500">
                        {[person.email, person.mobile].filter(Boolean).join(" &middot; ")}
                      </span>
                    )}
                    {person.address && (
                      <span className="font-body text-xs text-zinc-500">
                        {person.address}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  {person.patientCode && (
                    <span className="hidden sm:inline font-body text-[10px] font-bold tracking-wider text-zinc-400">
                      {person.patientCode}
                    </span>
                  )}

                  {/* Anyone with bookings keeps their record, so the action is
                      hidden rather than offered and then refused. */}
                  {person.appointmentCount === 0 &&
                    (confirmingPersonId === person.patientId ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemovePerson(person)}
                          disabled={removingPersonId === person.patientId}
                          className="rounded-lg bg-red-600 px-3 py-2 font-body text-[11px] font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                        >
                          {removingPersonId === person.patientId
                            ? "Removing…"
                            : "Yes, remove"}
                        </button>
                        <button
                          onClick={() => setConfirmingPersonId(null)}
                          disabled={removingPersonId === person.patientId}
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 font-body text-[11px] font-bold text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-60 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingPersonId(person.patientId)}
                        title="Remove this person"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
