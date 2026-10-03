"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, CalendarDays, CreditCard, Lock, User, FileText, ClipboardList, Users, UserPlus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { servicesData } from "@/components/servicelistingpage/servicesData";
import { fetchPeople, savePerson, getPersonFullName, Person } from "@/lib/people";

const steps = [
  { id: 1, title: "Date & Time", icon: CalendarDays },
  { id: 2, title: "Your Details", icon: User },
  { id: 3, title: "Notes & Terms", icon: FileText },
  { id: 4, title: "Review & Confirm", icon: ClipboardList },
];

/**
 * Only quote a price inside the pay button when it is a real amount — services
 * priced "POA" would otherwise read as "Pay POA Now".
 */
function isPayablePrice(price: string): boolean {
  return /^[£$€]\s?\d/.test(price.trim());
}

export default function BookAppointmentWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service") || "";
  const categorySlug = searchParams.get("category") || "";

  /**
   * A test that is not in the static `servicesData` catalog — every blood test,
   * since that list only hardcodes a handful. Loaded from the API by exact slug
   * so the summary shows the test that was actually chosen rather than falling
   * back to "General Consultation".
   */
  const [apiService, setApiService] = useState<{ title: string; price: string | null; service_name: string | null } | null>(null);

  useEffect(() => {
    if (!serviceSlug || !categorySlug) {
      setApiService(null);
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const controller = new AbortController();

    fetch(`${API_URL}/services/category/${categorySlug}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const match = (data?.services || []).find((s: { slug: string }) => s.slug === serviceSlug);
        if (match) {
          setApiService({ title: match.title, price: match.price, service_name: match.service_name });
        }
      })
      .catch(() => {
        // Leave the static catalog fallback in place.
      });

    return () => controller.abort();
  }, [serviceSlug, categorySlug]);

  const [currentStep, setCurrentStep] = useState(1);
  const [numberOfMonths, setNumberOfMonths] = useState(2);
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("self");
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [addPersonError, setAddPersonError] = useState("");
  const [newPersonForm, setNewPersonForm] = useState({
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
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    address1: "",
    address2: "",
    suburb: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dobMonth: "",
    dobDay: "",
    dobYear: "",
    title: "",
    notes: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    const handleResize = () => {
      // Tailwind's `md` breakpoint is 768px
      if (window.innerWidth < 768) {
        setNumberOfMonths(1);
      } else {
        setNumberOfMonths(2);
      }
    };

    // Set the initial number of months on component mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const prefillFromProfile = () => {
    // Every field is replaced, never kept from the previous value. Switching
    // from a family member back to "My Self" would otherwise leave that person's
    // name, date of birth and address in the form. A missing localStorage entry
    // means the value is genuinely unknown, so it clears rather than carrying
    // over whatever was there.
    const read = (key: string) => localStorage.getItem(key) || "";

    const dobStr = read("user_dob");
    let dobYear = "";
    let dobMonth = "";
    let dobDay = "";
    if (dobStr && dobStr.includes("-")) {
      const parts = dobStr.split("-");
      dobYear = parts[0] || "";
      dobMonth = parts[1] ? String(parseInt(parts[1], 10)) : "";
      dobDay = parts[2] ? String(parseInt(parts[2], 10)) : "";
    }

    setFormData((prev) => ({
      ...prev,
      title: read("user_title"),
      gender: read("user_gender"),
      firstName: read("user_first_name"),
      lastName: read("user_last_name"),
      email: read("user_email"),
      mobile: read("user_mobile"),
      dobYear,
      dobMonth,
      dobDay,
      // `customers` keeps these in separate columns, so each one is read from
      // its own key and lands in the matching field.
      address1: read("user_address1"),
      address2: read("user_address2"),
      suburb: read("user_suburb"),
      city: read("user_city"),
      state: read("user_state"),
      zipCode: read("user_zip"),
      country: read("user_country"),
    }));
  };

  // Auto-fill patient details from profile whenever the user reaches Step 2
  useEffect(() => {
    if (currentStep !== 2) return;
    prefillFromProfile();
  }, [currentStep]);

  // The person chips come from the `patients` table, so a signed-in customer
  // sees the same people on every device. Guests have no customer record yet,
  // so the list stays empty and they book for themselves.
  useEffect(() => {
    if (localStorage.getItem("is_signed_in") !== "true") return;

    const customerEmail = localStorage.getItem("user_email") || "";
    if (!customerEmail) return;

    let cancelled = false;
    fetchPeople(customerEmail)
      .then((loaded) => {
        if (!cancelled) setPeople(loaded);
      })
      .catch(() => {
        // A failed lookup should not block booking; the customer can still book
        // for themselves or add a person inline.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectPerson = (personId: string) => {
    setSelectedPersonId(personId);
    if (personId === "self") {
      // The customer's own profile keeps each address part separately, so City
      // and Post Code are filled in individually and stay required.
      setAddressOnFile(false);
      prefillFromProfile();
      return;
    }
    const person = people.find((p) => p.id === personId);
    if (!person) return;
    prefillFromPerson(person);
  };

  /**
   * `patients.address` is a single column, so the seven address fields are packed
   * into it. They are now stored field-separated and come back individually, so
   * this is only true for addresses written before that format existed: those
   * have ", " between their parts with the empty ones dropped, and the city and
   * postcode cannot be told apart. In that case City and Post Code are not
   * required, because the address is already on file. Set false as soon as the
   * user touches any address field, when they are entering one from scratch.
   */
  const [addressOnFile, setAddressOnFile] = useState(false);

  const prefillFromPerson = (person: Person) => {
    let dobYear = "";
    let dobMonth = "";
    let dobDay = "";
    if (person.dob && person.dob.includes("-")) {
      const parts = person.dob.split("-");
      dobYear = parts[0] || "";
      dobMonth = parts[1] ? String(parseInt(parts[1], 10)) : "";
      dobDay = parts[2] ? String(parseInt(parts[2], 10)) : "";
    }
    const savedAddress = (person.address || "").trim();
    // Legacy addresses have no recoverable line boundaries, so they fall back to
    // a single Line 1 and City / Post Code stay optional.
    const parts = person.addressIsSplit
      ? person.addressParts
      : {
          address1: savedAddress,
          address2: "",
          suburb: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        };

    setFormData((prev) => ({
      ...prev,
      title: person.title || "",
      gender: person.gender || "",
      firstName: person.firstName,
      lastName: person.lastName,
      dobYear: dobYear,
      dobMonth: dobMonth,
      dobDay: dobDay,
      email: person.email || "",
      mobile: person.mobile || "",
      address1: parts.address1,
      address2: parts.address2,
      suburb: parts.suburb,
      city: parts.city,
      state: parts.state,
      zipCode: parts.zipCode,
      country: parts.country,
    }));
    setAddressOnFile(!person.addressIsSplit && savedAddress.length > 0);
  };

  const ADDRESS_FIELDS = [
    "address1",
    "address2",
    "suburb",
    "city",
    "state",
    "zipCode",
    "country",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    // Mobile accepts digits only — drop any other characters as they are typed.
    if (name === "mobile") {
      val = String(val).replace(/\D/g, "").slice(0, 20);
    }
    // Editing any address field means the user is entering one by hand, so City
    // and Post Code become required again.
    if (ADDRESS_FIELDS.includes(name)) {
      setAddressOnFile(false);
    }
    setFormData((prev) => ({ ...prev, [name]: val }));
    setSaveError("");
    // Ticking the box clears the prompt to accept the terms.
    if (name === "agreeToTerms") setTermsError("");
    // Clear error when field is edited
    if (step2Errors[name] || name === "dobMonth" || name === "dobDay" || name === "dobYear") {
      setStep2Errors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        if (name === "dobMonth" || name === "dobDay" || name === "dobYear") {
          delete newErrors.dob;
        }
        return newErrors;
      });
    }
  };

  const handleNewPersonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let val = value;
    // Mobile accepts digits only — drop any other characters as they are typed.
    if (name === "mobile") {
      val = value.replace(/\D/g, "").slice(0, 20);
    }
    setNewPersonForm((prev) => ({ ...prev, [name]: val }));
    setAddPersonError("");
  };

  const handleAddPerson = async () => {
    if (!newPersonForm.firstName.trim() || !newPersonForm.lastName.trim()) {
      setAddPersonError("First Name and Last Name are required.");
      return;
    }
    if (!newPersonForm.gender) {
      setAddPersonError("Please select a gender.");
      return;
    }
    if (!newPersonForm.dobDay || !newPersonForm.dobMonth || !newPersonForm.dobYear) {
      setAddPersonError("Please specify the person's full Date of Birth.");
      return;
    }
    if (!newPersonForm.address1.trim()) {
      setAddPersonError("Address Line 1 is required.");
      return;
    }
    if (!newPersonForm.city.trim()) {
      setAddPersonError("City is required.");
      return;
    }
    if (!newPersonForm.zipCode.trim()) {
      setAddPersonError("Zip/Post Code is required.");
      return;
    }

    const formattedDob = `${newPersonForm.dobYear}-${newPersonForm.dobMonth.padStart(2, "0")}-${newPersonForm.dobDay.padStart(2, "0")}`;

    const customerEmail = localStorage.getItem("user_email") || "";
    if (!customerEmail) {
      setAddPersonError("Please sign in before adding someone to book for.");
      return;
    }

    let newPerson: Person;
    try {
      newPerson = await savePerson({
        customerEmail,
        firstName: newPersonForm.firstName.trim(),
        lastName: newPersonForm.lastName.trim(),
        gender: newPersonForm.gender,
        dob: formattedDob,
        email: newPersonForm.email.trim(),
        mobile: newPersonForm.mobile.trim(),
        // The parts are sent individually; the API packs them into the single
        // `patients.address` column field by field.
        address: {
          address1: newPersonForm.address1.trim(),
          address2: newPersonForm.address2.trim(),
          suburb: newPersonForm.suburb.trim(),
          city: newPersonForm.city.trim(),
          state: newPersonForm.state.trim(),
          zipCode: newPersonForm.zipCode.trim(),
          country: newPersonForm.country.trim(),
        },
        title: newPersonForm.title.trim(),
        relationship: newPersonForm.relationship,
      });
    } catch (error) {
      setAddPersonError(
        error instanceof Error ? error.message : "Failed to add this person."
      );
      return;
    }

    setPeople((prev) => [...prev, newPerson]);
    setShowAddPerson(false);
    setAddPersonError("");
    setNewPersonForm({
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
    setSelectedPersonId(newPerson.id);
    prefillFromPerson(newPerson);
  };

  const resolveService = () => {
    let resolvedServiceName = "General Consultation";
    let resolvedCategory = "Consultations";
    let resolvedPrice = "£95.00";

    if (serviceSlug) {
      for (const catKey in servicesData) {
        const cat = servicesData[catKey];
        const foundScan = cat.scans.find((s) => s.slug === serviceSlug);
        if (foundScan) {
          resolvedServiceName = foundScan.title;
          resolvedCategory = catKey === "pregnancy-scans" ? "Pregnancy Scans" : catKey === "diagnostics" ? "Diagnostics" : "Blood Tests";
          resolvedPrice = foundScan.price || "£95.00";
          break;
        }
      }

      // Not in the static catalog, so it came from the database.
      if (resolvedServiceName === "General Consultation" && apiService) {
        resolvedServiceName = apiService.title;
        resolvedCategory = apiService.service_name || "Blood Tests";
        resolvedPrice = apiService.price || "POA";
      }
    }
    return { serviceName: resolvedServiceName, category: resolvedCategory, price: resolvedPrice };
  };

  const [step2Errors, setStep2Errors] = useState<{ [key: string]: string }>({});
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [saveError, setSaveError] = useState("");
  /**
   * The `patients.id` step 2 wrote, carried to step 4 so the appointment is
   * attached to that exact person.
   */
  const [savedPatientId, setSavedPatientId] = useState("");
  /** Shown when Continue is pressed on step 3 without the terms being accepted. */
  const [termsError, setTermsError] = useState("");
  /** Step 4 reviews first; the card form is revealed by the "Pay" button. */
  const [paymentOpen, setPaymentOpen] = useState(false);

  const validateStep2 = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    if (!formData.firstName.trim()) {
      errors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last Name is required";
    }
    // A relative or friend may not have their own email, but the customer's own
    // booking does — it is the unique key their customer record is matched on.
    const bookingForSelf = selectedPersonId === "self";
    if (!formData.email.trim()) {
      if (bookingForSelf) {
        errors.email = "Email is required";
      }
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile / Cell is required";
    }
    if (!formData.dobMonth || !formData.dobDay || !formData.dobYear) {
      errors.dob = "Date of Birth is required";
    }
    if (!formData.address1.trim()) {
      errors.address1 = "Address Line 1 is required";
    }
    // Only required when the address is being typed from scratch. An address
    // pre-filled from a saved person normally arrives with its city and postcode
    // already filled in; the exception is a record saved before the address
    // fields were stored separately, which can only be shown as one line.
    if (!addressOnFile) {
      if (!formData.city.trim()) {
        errors.city = "City is required";
      }
      if (!formData.zipCode.trim()) {
        errors.zipCode = "Zip Code is required";
      }
    }

    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // Sends the details for whoever this appointment is for. A self-booking is
  // upserted into customers (keyed on its unique email) and into patients; a
  // booking for someone else only ever creates or updates a patients row.
  const saveBookingDetails = async (): Promise<boolean> => {
    setSavingCustomer(true);
    setSaveError("");

    const pad = (value: string) => value.padStart(2, "0");

    // Booking for myself means the person paying is the patient, so the details
    // belong in customers as well. Booking for a relative or friend means they
    // are only a patient — a family member must never become a customer record.
    const bookingFor = selectedPersonId === "self" ? "self" : "other";
    const bookedByEmail =
      localStorage.getItem("is_signed_in") === "true"
        ? localStorage.getItem("user_email") || ""
        : "";

    // Sent to the Laravel API rather than a Next.js route. The database is on
    // the Laravel host, where DB_HOST is 127.0.0.1, so a Vercel function cannot
    // open a connection to it at all.
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_for: bookingFor,
          booked_by_email: bookedByEmail,
          appointment_date: formData.date,
          start_time: formData.time,
          service_name: resolveService().serviceName,
          notes: formData.notes.trim() || null,
          email: formData.email.trim(),
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          gender: formData.gender,
          dob: `${formData.dobYear}-${pad(formData.dobMonth)}-${pad(formData.dobDay)}`,
          title: formData.title || null,
          phone: formData.mobile.trim() || null,
          address_line_1: formData.address1.trim() || null,
          address_line_2: formData.address2.trim() || null,
          suburb: formData.suburb.trim() || null,
          city: formData.city.trim() || null,
          state: formData.state.trim() || null,
          zip_code: formData.zipCode.trim() || null,
          country: formData.country.trim() || null,
          // Defer writing the appointment until payment is confirmed.
          defer_appointment: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSaveError(data.message || "We could not save your details. Please try again.");
        return false;
      }

      // The id of the `patients` row just written. Step 4 sends it back so the
      // appointment is attached to exactly this person: a relative has no
      // customer account to be found by, and a shared surname is not unique
      // enough to look them up by name.
      if (data?.patient?.id) {
        setSavedPatientId(String(data.patient.id));
      }

      // Keep the signed-in profile in localStorage in sync with what we saved,
      // so the header and prefill on later steps show the same values. Only a
      // self-booking may do this — writing a relative's details here would
      // overwrite the signed-in customer's own profile.
      if (bookingFor === "self") {
        localStorage.setItem("user_title", formData.title);
        localStorage.setItem("user_gender", formData.gender);
        localStorage.setItem("user_first_name", formData.firstName.trim());
        localStorage.setItem("user_last_name", formData.lastName.trim());
        localStorage.setItem("user_email", formData.email.trim());
        localStorage.setItem("user_mobile", formData.mobile.trim());
        localStorage.setItem("user_dob", `${formData.dobYear}-${pad(formData.dobMonth)}-${pad(formData.dobDay)}`);
        localStorage.setItem("user_address1", formData.address1.trim());
        localStorage.setItem("user_address2", formData.address2.trim());
        localStorage.setItem("user_suburb", formData.suburb.trim());
        localStorage.setItem("user_city", formData.city.trim());
        localStorage.setItem("user_state", formData.state.trim());
        localStorage.setItem("user_zip", formData.zipCode.trim());
        localStorage.setItem("user_country", formData.country.trim());
        window.dispatchEvent(new Event("storage"));
      }

      return true;
    } catch {
      setSaveError("We could not reach the server to save your details. Please try again.");
      return false;
    } finally {
      setSavingCustomer(false);
    }
  };

  const [confirmingPayment, setConfirmingPayment] = useState(false);
  /** The appointment row id held by "Continue to Payment", paid for by "Pay". */
  const [heldAppointmentId, setHeldAppointmentId] = useState("");

  /** The payload both step-4 buttons send, so the two calls cannot drift apart. */
  const buildConfirmPayload = () => ({
    booking_for: (localStorage.getItem("booking_for") as "self" | "other" | null) || "self",
    // The account that owns the booking. This is the person paying, which is
    // not the patient when booking for a relative or friend, so it is sent
    // explicitly rather than left to be inferred from the patient's email.
    booked_by_email:
      localStorage.getItem("is_signed_in") === "true"
        ? localStorage.getItem("user_email") || ""
        : "",
    patient_id: savedPatientId || null,
    appointment_date: formData.date,
    start_time: formData.time,
    service_name: resolveService().serviceName,
    notes: formData.notes.trim() || null,
    email: formData.email.trim(),
    first_name: formData.firstName.trim(),
    last_name: formData.lastName.trim(),
    title: formData.title || null,
    phone: formData.mobile.trim() || null,
    address_line_1: formData.address1.trim() || null,
    address_line_2: formData.address2.trim() || null,
    suburb: formData.suburb.trim() || null,
    city: formData.city.trim() || null,
    state: formData.state.trim() || null,
    zip_code: formData.zipCode.trim() || null,
    country: formData.country.trim() || null,
    amount: resolveService().price,
    payment_method: "Card",
  });

  const postConfirm = async (payload: Record<string, unknown>) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    const res = await fetch(`${API_URL}/bookings/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Failed to confirm the booking.");
    }

    return data;
  };

  /**
   * "Continue to Payment" — writes the appointment and nothing else.
   *
   * No payment is taken and no redirect happens here: the slot is held as
   * Pending and the user stays on step 4 to enter their card. `record_payment`
   * is false so the `payments` row waits for the Pay button.
   */
  const holdAppointment = async () => {
    setConfirmingPayment(true);
    setSaveError("");

    try {
      const data = await postConfirm({ ...buildConfirmPayload(), record_payment: false });

      if (data?.appointment?.id) {
        setHeldAppointmentId(String(data.appointment.id));
      }

      setPaymentOpen(true);
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save your appointment.");
      window.scrollTo(0, 0);
      return false;
    } finally {
      setConfirmingPayment(false);
    }
  };

  /**
   * "Pay" — takes the payment, then shows the confirmation page.
   *
   * This is the only step that writes to `payments` and the only one that
   * leaves step 4, so the booking is not announced as confirmed until the
   * customer has actually paid for it.
   */
  const payAndFinish = async () => {
    setConfirmingPayment(true);
    setSaveError("");

    try {
      // `appointment_id` points at the row "Continue to Payment" inserted, so the
      // payment settles that booking instead of inserting a second one.
      await postConfirm({
        ...buildConfirmPayload(),
        record_payment: true,
        appointment_id: heldAppointmentId || null,
      });

      // Kept for the confirmation page and the local "My Bookings" list.
      const { serviceName: resolvedServiceName, category: resolvedCategory, price: resolvedPrice } = resolveService();
      const newBooking = {
        id: Math.random().toString(36).substr(2, 9),
        serviceSlug,
        serviceName: resolvedServiceName,
        category: resolvedCategory,
        date: formData.date,
        time: formData.time,
        price: resolvedPrice,
        patientName: [formData.title, formData.firstName, formData.lastName].filter(Boolean).join(" ").trim() || null,
        patientEmail: formData.email || null,
      };
      const existingBookings = JSON.parse(localStorage.getItem("user_bookings") || "[]");
      existingBookings.push(newBooking);
      localStorage.setItem("user_bookings", JSON.stringify(existingBookings));

      // The name is passed through because most services — every blood test in
      // particular — are not in the small static catalog, so the confirmation
      // page cannot resolve the slug on its own and would say
      // "General Consultation".
      const queryParams = new URLSearchParams();
      if (serviceSlug) queryParams.set("service", serviceSlug);
      if (resolvedServiceName) queryParams.set("name", resolvedServiceName);
      if (formData.date) queryParams.set("date", formData.date);
      if (formData.time) queryParams.set("time", formData.time);
      router.push(`/booking-confirmation?${queryParams.toString()}`);
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to take the payment.");
      window.scrollTo(0, 0);
      return false;
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleNext = async () => {
    // The terms box is a hard requirement, but the button stays enabled so the
    // reason is explained rather than the button silently doing nothing.
    if (currentStep === 3 && !formData.agreeToTerms) {
      setTermsError("Please accept the Booking Terms and Conditions before continuing.");
      return;
    }

    if (currentStep === 2) {
      if (!validateStep2()) {
        window.scrollTo(0, 0);
        return;
      }

      const saved = await saveBookingDetails();
      if (!saved) {
        window.scrollTo(0, 0);
        return;
      }

      // Step 2 may have been revisited to change who the appointment is for. Any
      // slot held for the previous person no longer applies, so step 4 has to
      // hold the new one rather than settle the old appointment.
      if (heldAppointmentId) {
        setHeldAppointmentId("");
        setPaymentOpen(false);
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
    // On the last step the step-4 buttons drive the commit, not this handler.
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Mock data for dates and times
  const availableDates = ["2026-07-08", "2026-07-09", "2026-07-10", "2026-07-11", "2026-07-12"];
  const availableTimes = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

  /**
   * The service and category picked via `?service=`, shown at the top of each
   * step so it is always clear what is being booked. Step 4 is excluded because
   * its own "Appointment Summary" already lists these. `null` when no service was
   * passed in the URL, so the panel stays hidden rather than advertising a
   * default that was never chosen.
   */
  const selectedService = serviceSlug ? resolveService() : null;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white shadow-xl shadow-[#1E227D]/5 border border-zinc-100 overflow-hidden">
      {/* STEPS HEADER */}
      <div className="bg-white px-6 sm:px-8 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center gap-3">
                <div 
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    isActive
                      ? "bg-[#1E227D] text-white"
                      : isCompleted
                      ? "bg-[#E0A2F5] text-white"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-display text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Step {step.id}
                  </span>
                  <span 
                    className={`font-display text-sm font-bold ${
                      isActive || isCompleted ? "text-[#2D2136]" : "text-zinc-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight size={20} className="hidden sm:block text-zinc-300 ml-4" />
                )}
              </div>
            );
          })}
        </div>
        {/* Progress Bar */}
        <div className="mt-6 h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#E0A2F5] to-[#1E227D] rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        {/* SELECTED SERVICE & CATEGORY — every step except the review, which
            already shows these in its own "Appointment Summary". */}
        {selectedService && currentStep !== 4 && (
          <div className="mt-6 rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-[#1E227D] px-5 py-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Selected Service
              </h3>
            </div>
            <dl className="divide-y divide-zinc-100">
              {[
                { label: "Service", value: selectedService.serviceName },
                { label: "Category", value: selectedService.category },
                { label: "Price", value: selectedService.price },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-6 px-5 py-3">
                  <dt className="font-body text-sm font-semibold text-zinc-500 shrink-0">{row.label}</dt>
                  <dd className="font-body text-sm font-semibold text-[#2D2136] text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* FORM CONTENT */}
      <div className="pb-8 lg:pb-12 pl-8 lg:pl-12 pr-8 lg:pr-12 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* STEP 1: DATE & TIME */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#1E227D] mb-2">Select Date & Time</h2>
                  <p className="font-body text-sm text-zinc-500">Choose an available slot for your appointment.</p>
                </div>

                <style>{`
                  .rdp {
                    --rdp-cell-size: 48px;
                    --rdp-accent-color: #1E227D;
                    --rdp-background-color: #E0A2F5;
                    --rdp-accent-color-dark: #1E227D;
                    --rdp-background-color-dark: #E0A2F5;
                    --rdp-outline: 2px solid #1E227D;
                    --rdp-outline-selected: 3px solid #1E227D;
                    margin: 0;
                    --rdp-months-gap: 2.5rem;
                  }
                  .rdp-caption_label {
                    font-family: 'Clash Display', sans-serif;
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #1E227D;
                  }
                  .rdp-head_cell {
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    font-size: 0.8rem;
                    color: #2D2136;
                  }
                  .rdp-day {
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                  }
                  .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                    background-color: #1E227D;
                    color: white;
                    font-weight: 700;
                  }
                  .rdp-day_today {
                    font-weight: 700;
                    color: #1E227D;
                  }
                `}</style>
                <DayPicker
                  mode="single"
                  numberOfMonths={numberOfMonths}
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(day) => {
                    if (day) {
                      const selectedDate = new Date(day);
                      // Prevent timezone conversion issues by manually formatting the date
                      const year = selectedDate.getFullYear();
                      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                      const date = selectedDate.getDate().toString().padStart(2, '0');
                      const formattedDate = `${year}-${month}-${date}`;

                      setFormData({ ...formData, date: formattedDate, time: "" });
                    }
                  }}
                  disabled={(date) => {
                    // Disable dates before today (today is selectable)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;
                    return false;
                  }}
                  className="mx-auto"
                  showOutsideDays
                  fixedWeeks
                />

                {formData.date && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <label className="font-display text-sm font-bold text-[#2D2136]">Available Slots</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setFormData({ ...formData, time })}
                          className={`px-4 py-3 rounded-xl border font-body text-sm font-semibold transition-all ${
                            formData.time === time
                              ? "border-[#1E227D] bg-[#1E227D] text-white shadow-md"
                              : "border-zinc-200 bg-white text-[#2D2136] hover:border-[#1E227D]/30 hover:bg-zinc-50"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: PATIENT DETAILS */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#1E227D] mb-2">Patient Details</h2>
                  <p className="font-body text-sm text-zinc-500">Who is this appointment for? We&rsquo;ll pre-fill their details where possible.</p>
                </div>

                {saveError && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-xs font-semibold text-red-700">
                    {saveError}
                  </div>
                )}

                {/* WHO IS THIS FOR */}
                <div className="flex flex-col gap-3">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Who is this appointment for? *</label>
                  <div className="flex flex-wrap gap-2">
                    {localStorage.getItem("is_signed_in") === "true" && (
                      <button
                        type="button"
                        onClick={() => handleSelectPerson("self")}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs font-semibold border transition-all ${
                          selectedPersonId === "self"
                            ? "bg-[#1E227D] text-white border-[#1E227D]"
                            : "bg-white border-zinc-200 text-[#2D2136] hover:border-[#1E227D]/30"
                        }`}
                      >
                        <User size={13} />
                        My Self
                      </button>
                    )}
                    {people.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => handleSelectPerson(person.id)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs font-semibold border transition-all ${
                          selectedPersonId === person.id
                            ? "bg-[#1E227D] text-white border-[#1E227D]"
                            : "bg-white border-zinc-200 text-[#2D2136] hover:border-[#1E227D]/30"
                        }`}
                      >
                        <Users size={13} />
                        {getPersonFullName(person)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowAddPerson((prev) => !prev)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs font-semibold border border-dashed transition-all ${
                        showAddPerson
                          ? "bg-[#F000E2]/10 text-[#F000E2] border-[#F000E2]/50"
                          : "bg-white border-[#1E227D]/40 text-[#1E227D] hover:bg-[#1E227D]/5"
                      }`}
                    >
                      <UserPlus size={13} />
                      {showAddPerson ? "Cancel" : "Add Person"}
                    </button>
                  </div>
                  <p className="font-body text-xs text-zinc-400">
                    Selecting a person pre-fills their name, gender and date of birth. You can still edit the fields below.
                  </p>
                </div>

                {/* ADD PERSON INLINE FORM */}
                {showAddPerson && (
                  <div className="border border-dashed border-[#1E227D]/30 rounded-2xl p-5 bg-zinc-50/50 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserPlus size={16} className="text-[#1E227D]" />
                        <span className="font-display text-sm font-bold text-[#2D2136]">Add a New Person</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddPerson(false)}
                        className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-[#2D2136] transition-colors"
                        aria-label="Close add person"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {addPersonError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-body text-xs">
                        {addPersonError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-xs font-bold text-[#2D2136]">Title</label>
                        <select
                          name="title"
                          value={newPersonForm.title}
                          onChange={handleNewPersonChange}
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
                          value={newPersonForm.gender}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">I&rsquo;d rather not say</option>
                          {/* Retired from the list, but anyone saved with it
                              before must still show their stored value. */}
                          {newPersonForm.gender === "Other" && <option value="Other">Other</option>}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-xs font-bold text-[#2D2136]">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={newPersonForm.firstName}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-xs font-bold text-[#2D2136]">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={newPersonForm.lastName}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-xs font-bold text-[#2D2136]">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={newPersonForm.email}
                          onChange={handleNewPersonChange}
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
                          maxLength={20}
                          placeholder="Digits only"
                          value={newPersonForm.mobile}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="newAddress1" className="font-body text-xs font-bold text-[#2D2136]">Address Line 1 *</label>
                        <input
                          id="newAddress1"
                          type="text"
                          name="address1"
                          placeholder="House number and street"
                          value={newPersonForm.address1}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="newAddress2" className="font-body text-xs font-bold text-[#2D2136]">Address Line 2</label>
                        <input
                          id="newAddress2"
                          type="text"
                          name="address2"
                          placeholder="Apartment, floor, building (optional)"
                          value={newPersonForm.address2}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="newSuburb" className="font-body text-xs font-bold text-[#2D2136]">Suburb</label>
                        <input
                          id="newSuburb"
                          type="text"
                          name="suburb"
                          placeholder="Optional"
                          value={newPersonForm.suburb}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="newCity" className="font-body text-xs font-bold text-[#2D2136]">City *</label>
                        <input
                          id="newCity"
                          type="text"
                          name="city"
                          placeholder="Town or city"
                          value={newPersonForm.city}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="newState" className="font-body text-xs font-bold text-[#2D2136]">State</label>
                        <input
                          id="newState"
                          type="text"
                          name="state"
                          placeholder="Optional"
                          value={newPersonForm.state}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="newZip" className="font-body text-xs font-bold text-[#2D2136]">Zip / Post Code *</label>
                        <input
                          id="newZip"
                          type="text"
                          name="zipCode"
                          placeholder="Postcode or ZIP"
                          value={newPersonForm.zipCode}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="newCountry" className="font-body text-xs font-bold text-[#2D2136]">Country</label>
                        <input
                          id="newCountry"
                          type="text"
                          name="country"
                          placeholder="Optional"
                          value={newPersonForm.country}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-body text-xs font-bold text-[#2D2136]">Date of Birth *</label>
                        <div className="grid grid-cols-3 gap-3">
                          <select name="dobMonth" value={newPersonForm.dobMonth} onChange={handleNewPersonChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString("default", { month: "long" })}</option>
                            ))}
                          </select>
                          <select name="dobDay" value={newPersonForm.dobDay} onChange={handleNewPersonChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                          <select name="dobYear" value={newPersonForm.dobYear} onChange={handleNewPersonChange} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]">
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
                          value={newPersonForm.relationship}
                          onChange={handleNewPersonChange}
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D]"
                        >
                          <option value="Family">Family</option>
                          <option value="Friend">Friend</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddPerson(false)}
                        className="rounded-xl border border-zinc-200 px-5 py-2.5 font-body text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPerson}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#1E227D] to-[#F000E2] px-6 py-2.5 font-body text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 cursor-pointer"
                      >
                        <Check size={14} />
                        Save & Continue
                      </button>
                    </div>
                  </div>
                )}

                {!showAddPerson && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Title & Gender */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-xs font-bold text-[#2D2136]">Title</label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Miss">Miss</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-xs font-bold text-[#2D2136]">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${step2Errors.gender ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">I&rsquo;d rather not say</option>
                      {/* Retired from the list, but anyone saved with it
                          before must still show their stored value. */}
                      {formData.gender === "Other" && <option value="Other">Other</option>}
                    </select>
                    {step2Errors.gender && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.gender}</p>}
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-xs font-bold text-[#2D2136]">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${step2Errors.firstName ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}
                      required
                    />
                    {step2Errors.firstName && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.firstName}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-xs font-bold text-[#2D2136]">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${step2Errors.lastName ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}
                      required
                    />
                    {step2Errors.lastName && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.lastName}</p>}
                  </div>

                  {/* Contact */}
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-xs font-bold text-[#2D2136]">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${step2Errors.email ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}
                      required
                    />
                    {step2Errors.email && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.email}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-body text-xs font-bold text-[#2D2136]">Mobile / Cell *</label>
                    <input
                      type="tel"
                      name="mobile"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={20}
                      placeholder="Digits only"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${step2Errors.mobile ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}
                      required
                    />
                    {step2Errors.mobile && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.mobile}</p>}
                  </div>

                  {/* DOB */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label className="font-body text-xs font-bold text-[#2D2136]">Date of Birth *</label>
                    <div className="grid grid-cols-3 gap-3">
                      <select name="dobMonth" value={formData.dobMonth} onChange={handleInputChange} className={`w-full rounded-xl border ${step2Errors.dob ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}>
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => (<option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>))}
                      </select>
                      <select name="dobDay" value={formData.dobDay} onChange={handleInputChange} className={`w-full rounded-xl border ${step2Errors.dob ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}>
                        <option value="">Day</option>
                        {Array.from({ length: 31 }, (_, i) => (<option key={i+1} value={i+1}>{i+1}</option>))}
                      </select>
                      <select name="dobYear" value={formData.dobYear} onChange={handleInputChange} className={`w-full rounded-xl border ${step2Errors.dob ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}>
                        <option value="">Year</option>
                        {Array.from({ length: 100 }, (_, i) => { const year = new Date().getFullYear() - i; return (<option key={year} value={year}>{year}</option>); })}
                      </select>
                    </div>
                    {step2Errors.dob && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.dob}</p>}
                  </div>

                  {/* Address — one field per column, each with its own label.
                      Line 1 and Line 2 used to be stacked inside a single
                      grid cell, which left Line 2 looking like a stray
                      placeholder under an empty box. */}
                  {addressOnFile && (
                    <p className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-body text-xs text-amber-800">
                      This person&rsquo;s address was saved before the address
                      fields were stored separately, so it can only be shown as a
                      single line — there is no way to tell which part is the
                      city and which is the postcode. City and Post Code are
                      therefore not required here. Type a full address in the
                      fields below and it will be saved properly this time.
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="address1" className="font-body text-xs font-bold text-[#2D2136]">Address Line 1 *</label>
                    <input
                      id="address1"
                      type="text"
                      name="address1"
                      placeholder="House number and street"
                      value={formData.address1}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border ${step2Errors.address1 ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`}
                      required
                    />
                    {step2Errors.address1 && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.address1}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="address2" className="font-body text-xs font-bold text-[#2D2136]">Address Line 2</label>
                    <input
                      id="address2"
                      type="text"
                      name="address2"
                      placeholder="Apartment, floor, building (optional)"
                      value={formData.address2}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="suburb" className="font-body text-xs font-bold text-[#2D2136]">Suburb</label>
                    <input id="suburb" type="text" name="suburb" placeholder="Optional" value={formData.suburb} onChange={handleInputChange} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="font-body text-xs font-bold text-[#2D2136]">City{addressOnFile ? "" : " *"}</label>
                    <input id="city" type="text" name="city" placeholder={addressOnFile ? "Not needed" : "Town or city"} value={formData.city} onChange={handleInputChange} className={`w-full rounded-xl border ${step2Errors.city ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`} required={!addressOnFile} />
                    {step2Errors.city && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.city}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="state" className="font-body text-xs font-bold text-[#2D2136]">State</label>
                    <input id="state" type="text" name="state" placeholder="Optional" value={formData.state} onChange={handleInputChange} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="zipCode" className="font-body text-xs font-bold text-[#2D2136]">Zip / Post Code{addressOnFile ? "" : " *"}</label>
                    <input id="zipCode" type="text" name="zipCode" placeholder={addressOnFile ? "Not needed" : "Postcode or ZIP"} value={formData.zipCode} onChange={handleInputChange} className={`w-full rounded-xl border ${step2Errors.zipCode ? 'border-red-500' : 'border-zinc-200'} bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white`} required={!addressOnFile} />
                    {step2Errors.zipCode && <p className="font-body text-xs text-red-500 mt-1">{step2Errors.zipCode}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="country" className="font-body text-xs font-bold text-[#2D2136]">Country</label>
                    <input id="country" type="text" name="country" placeholder="Optional" value={formData.country} onChange={handleInputChange} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white" />
                  </div>
                </div>
                )}
              </div>
            )}

            {/* STEP 3: NOTES & TERMS */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#1E227D] mb-2">Booking Notes & Terms</h2>
                  <p className="font-body text-sm text-zinc-500">Add any notes for our clinicians and accept our terms.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Booking Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                    placeholder="Any specific requirements or information we should know before your appointment..."
                  />
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300">
                  <h3 className="font-display text-lg font-bold text-[#2D2136] mb-4">Insight Health Services &ndash; Booking Terms & Conditions:</h3>
                  <div className="prose prose-sm font-body text-zinc-600">
                    <p>By booking an appointment with Insight Health Services, you agree to the following terms and conditions.</p>
                    <p><strong>1. Appointments and Bookings</strong><br/>Appointments can be booked online through our booking system, by telephone or directly with the clinic. Patients are responsible for ensuring that all information provided during the booking process is accurate and complete.</p>
                    <p><strong>2. Payment</strong><br/>Payment for services is not taken at the time of online booking. All appointments must be paid for at the clinic before the consultation or treatment begins. Insight Health Services accepts debit cards, credit cards and other payment methods available at the clinic.</p>
                    <p><em>*Prices may vary depending on the specific blood test required. Please contact the clinic directly for pricing and further information before booking your appointment.*</em></p>
                    <p><strong>3. Arrival Time</strong><br/>Patients are requested to arrive 5&ndash;10 minutes before their scheduled appointment time to allow sufficient time for check-in and payment. Late arrival may result in the appointment being shortened or rescheduled.</p>
                    <p><strong>4. Cancellation and Rescheduling</strong><br/>If you need to cancel or reschedule your appointment, please provide at least 24 hours&rsquo; notice. This allows us to offer the appointment slot to another patient.</p>
                    <p><strong>5. Missed Appointments</strong><br/>Patients who fail to attend their appointment without prior notice may be refused future bookings or may be required to pay in advance for future appointments.</p>
                    <p><strong>6. Ultrasound Services</strong><br/>Ultrasound scans provided by Insight Health Services are diagnostic screening services and do not replace consultation, diagnosis or treatment from your GP or specialist. If findings require further medical investigation, you may be advised to seek medical advice from your GP or another healthcare professional.</p>
                    <p><strong>7. Physiotherapy Services</strong><br/>Physiotherapy treatments are provided following a professional clinical assessment. Treatment outcomes may vary depending on individual conditions and adherence to recommended treatment plans.</p>
                    <p><strong>8. Phlebotomy / Blood Testing Services</strong><br/>Our phlebotomy service involves the collection of blood samples for laboratory testing where applicable. Patients must follow any preparation instructions provided (for example fasting if required). Insight Health Services is not responsible for delays caused by external laboratories.</p>
                    <p><em>*Prices may vary depending on the specific blood test required. Please contact the clinic directly for pricing and further information before booking your appointment.*</em></p>
                    <p><strong>9. Medical Information</strong><br/>Patients must provide accurate and complete medical information when requested to ensure safe and appropriate care.</p>
                    <p><strong>10. Age Requirement</strong><br/>Patients booking appointments must be 18 years of age or older. By making a booking, you confirm that you meet this requirement.</p>
                    <p><strong>11. Privacy and Confidentiality</strong><br/>Insight Health Services respects patient confidentiality and processes personal data in accordance with applicable UK data protection legislation.</p>
                    <p><strong>12. Changes to Appointments</strong><br/>Insight Health Services reserves the right to reschedule or cancel appointments due to unforeseen circumstances such as clinician availability or equipment issues. Where possible, an alternative appointment will be offered.</p>
                    <p><strong>13. Acceptance of Terms</strong><br/>By booking an appointment with Insight Health Services, you confirm that you have read, understood, and agree to these booking terms and conditions.</p>
                  </div>
                </div>

                {termsError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-xs font-semibold text-red-700"
                  >
                    {termsError}
                  </div>
                )}

                <div
                  className={`flex items-center gap-3 border p-4 rounded-xl ${
                    termsError
                      ? "border-red-200 bg-red-50/60"
                      : "bg-[#E0A2F5]/10 border-[#E0A2F5]/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-[#1E227D] cursor-pointer"
                  />
                  <label htmlFor="agreeToTerms" className="font-body text-sm font-semibold text-[#2D2136] cursor-pointer select-none">
                    I have read and agree to the Booking Terms and Conditions.
                  </label>
                </div>
              </div>
            )}
            {/* STEP 4: REVIEW & CONFIRM */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#1E227D] mb-2">Review & Pay</h2>
                  <p className="font-body text-sm text-zinc-500">Review your booking details and complete your secure online payment.</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 overflow-hidden">
                  <div className="bg-[#1E227D] px-5 py-3">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Appointment Summary</h3>
                  </div>
                  <dl className="divide-y divide-zinc-100">
                    {[
                      { label: "Service", value: `${resolveService().serviceName}${formData.date ? "" : ""}` },
                      { label: "Category", value: resolveService().category },
                      { label: "Date", value: formData.date ? new Date(formData.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—" },
                      { label: "Time", value: formData.time || "—" },
                      { label: "Patient", value: [formData.title, formData.firstName, formData.lastName].filter(Boolean).join(" ") || "—" },
                      { label: "Email", value: formData.email || "—" },
                      { label: "Mobile", value: formData.mobile || "—" },
                      { label: "Notes", value: formData.notes || "None" },
                      { label: "Price", value: resolveService().price },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start justify-between gap-6 px-5 py-3">
                        <dt className="font-body text-sm font-semibold text-zinc-500 shrink-0">{row.label}</dt>
                        <dd className="font-body text-sm font-semibold text-[#2D2136] text-right">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {saveError && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-xs font-semibold text-red-700">
                    {saveError}
                  </div>
                )}

                {/* Step 4 reviews the booking first; the card form is only
                    revealed once the visitor commits to paying. Labelled
                    "Continue to Payment" rather than "Pay" so exactly one
                    button on the page reads "Pay" — the real commit action. */}
                {!paymentOpen && (
                  <div className="rounded-2xl border border-dashed border-[#1E227D]/25 bg-[#1E227D]/[0.03] px-5 py-6 flex flex-col items-center gap-4 text-center">
                    <p className="font-body text-sm text-zinc-500">
                      Ready to book? Continue to secure payment to confirm your appointment.
                    </p>
                    <Button
                      variant="primary"
                      onClick={holdAppointment}
                      className="w-full !py-4 shadow-lg shadow-[#F000E2]/20"
                      icon={<CreditCard size={16} />}
                      iconPosition="left"
                      disabled={confirmingPayment}
                    >
                      {confirmingPayment ? "Saving appointment…" : "Continue to Payment"}
                    </Button>
                    <span className="inline-flex items-center gap-1.5 font-body text-xs text-zinc-500">
                      <Lock size={12} />
                      Secure 256-bit encrypted payment
                    </span>
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {paymentOpen && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                <div className="rounded-2xl border border-zinc-200 overflow-hidden">
                  <div className="bg-[#1E227D] px-5 py-3 flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Online Payment</h3>
                    <span className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
                      256-bit Secured
                    </span>
                  </div>
                  <div className="p-5 flex flex-col gap-5">
                    <div className="flex items-center justify-between rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-body text-xs text-zinc-500">Amount Due</span>
                        <span className="font-display text-xl font-bold text-[#1E227D]">{resolveService().price}</span>
                      </div>
                      <span className="font-body text-xs text-zinc-500">{resolveService().serviceName}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="font-body text-xs font-bold text-[#2D2136]">Card Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm tracking-widest outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-[#2D2136]">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-body text-xs font-bold text-[#2D2136]">CVC</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="123"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="font-body text-xs font-bold text-[#2D2136]">Name on Card</label>
                        <input
                          type="text"
                          placeholder="Full name as shown on card"
                          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-body text-sm outline-none transition-colors focus:border-[#1E227D]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-1">
                      {["Visa", "Mastercard", "Amex", "PayPal"].map((m) => (
                        <span key={m} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 font-body text-xs font-semibold text-zinc-500">
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* The only "Pay" button — it takes the payment and then shows the
                        confirmation page. Nothing before this point writes to
                        `payments` or claims the booking is confirmed. */}
                    <Button
                      variant="primary"
                      onClick={payAndFinish}
                      className="w-full !py-4 shadow-lg shadow-[#F000E2]/20"
                      icon={<Lock size={16} />}
                      iconPosition="left"
                      disabled={confirmingPayment}
                    >
                      {confirmingPayment
                        ? "Processing…"
                        : isPayablePrice(resolveService().price)
                        ? `Pay ${resolveService().price} Now`
                        : "Pay Now"}
                    </Button>
                  </div>
                </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION BUTTONS */}
        <div className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-6">
          <Button
            variant="secondary"
            onClick={handleBack}
            className={`!px-6 !py-3 ${currentStep === 1 ? 'invisible' : ''}`}
          >
            Back
          </Button>

          {/* Hidden on step 4: that step commits through "Continue to
              Payment" and "Pay" in the card above, so there is no
              "Confirm Booking" button here — just "Back". */}
          <Button
            variant="primary"
            onClick={handleNext}
            className={`!px-8 !py-3 shadow-lg shadow-[#F000E2]/20 ${currentStep === 4 ? 'invisible' : ''}`}
            disabled={
              savingCustomer ||
              (currentStep === 1 && (!formData.date || !formData.time))
            }
            icon={currentStep < 4 ? <ChevronRight size={16} /> : undefined}
            iconPosition="left"
          >
            {savingCustomer ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
