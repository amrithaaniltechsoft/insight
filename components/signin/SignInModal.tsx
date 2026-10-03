"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (email: string) => void;
}

export default function SignInModal({ isOpen, onClose, onSignInSuccess }: SignInModalProps) {
  const [signInStep, setSignInStep] = useState(1); // 1 = Email, 2 = OTP, 3 = Profile Details, 4 = Success
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);

  // Profile details state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  const resetForm = () => {
    setSignInStep(1);
    setEmail("");
    setOtpValues(Array(6).fill(""));
    setFirstName("");
    setLastName("");
    setGender("");
    setDobDay("");
    setDobMonth("");
    setDobYear("");
    setError("");
    setDevOtp("");
    onClose();
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);
      return;
    }

    const val = cleaned[cleaned.length - 1];
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);
    setError("");

    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtp = [...otpValues];
        newOtp[index - 1] = "";
        setOtpValues(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otpValues];
        newOtp[index] = "";
        setOtpValues(newOtp);
      }
      setError("");
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length > 0) {
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtpValues(newOtp);
      setError("");

      const targetIndex = Math.min(pastedData.length, 5);
      otpRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={resetForm}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 z-[210] mx-auto -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl p-8 text-[#2D2136]"
          >
            <div className="flex items-center justify-between pb-2 mb-3">
              <h2 className="font-display text-xl font-bold text-[#1E227D]">
                {signInStep === 1 && "Sign In"}
                {signInStep === 2 && "Enter Verification Code"}
                {signInStep === 3 && "OTP Verified - Complete Your Profile"}
              </h2>
              <button
                onClick={resetForm}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-[#2D2136] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl p-3">
                {error}
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {signInStep === 1 && (
              <div className="flex flex-col gap-4">
                <p className="font-body text-sm text-zinc-600 leading-relaxed text-left">
                  Please enter your email to receive a verification code.
                </p>
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Email</label>
                  <input
                    type="email"
                    placeholder="e.g. you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                    required
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  disabled={loading}
                  onClick={async () => {
                    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                      setError("Please enter a valid email address.");
                      return;
                    }
                    setLoading(true);
                    setError("");
                    try {
                      const res = await fetch(`${API_URL}/auth/send-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.trim() }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        setError(data.message || 'Failed to send OTP.');
                        setLoading(false);
                        return;
                      }
                      if (data.otp) {
                        setDevOtp(data.otp);
                        const digits = data.otp.split("");
                        setOtpValues(digits);
                      }
                      setSignInStep(2);
                    } catch {
                      setError('Network error. Please try again.');
                    }
                    setLoading(false);
                  }}
                >
                  {loading ? 'Sending...' : 'Send OTP Code'}
                </Button>
              </div>
            )}

            {/* STEP 2: OTP */}
            {signInStep === 2 && (
              <div className="flex flex-col gap-4">
                <p className="font-body text-sm text-zinc-600 leading-relaxed text-left">
                  We sent a 6-digit code to <span className="font-bold text-[#2D2136]">{email}</span>. Enter it below to verify.
                </p>
                {devOtp && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-left">
                    <p className="font-body text-xs font-bold text-amber-700">Dev Mode — Your OTP:</p>
                    <p className="mt-1 font-display text-lg font-bold tracking-[0.3em] text-amber-800">{devOtp}</p>
                  </div>
                )}
                <div className="flex flex-col gap-3 text-left">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Verification Code (OTP)</label>
                  <div className="flex justify-between gap-2.5 py-1">
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        onPaste={handleOtpPaste}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border-1 border-zinc-500 bg-zinc-50 outline-none transition-all focus:border-[#1E227D] focus:bg-white text-[#2D2136]"
                        required
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setSignInStep(1);
                      setError("");
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    disabled={loading}
                    onClick={async () => {
                      const fullOtp = otpValues.join("");
                      if (fullOtp.length !== 6) {
                        setError("Please enter all 6 digits of your verification code.");
                        return;
                      }
                      setLoading(true);
                      setError("");
                      try {
                        const res = await fetch(`${API_URL}/auth/verify-otp`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: email.trim(), otp: fullOtp }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          setError(data.message || 'Invalid OTP.');
                          setLoading(false);
                          return;
                        }
                        // Check if customer already exists
                        try {
                          const checkRes = await fetch(`${API_URL}/auth/check`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: email.trim() }),
                          });
                          const checkData = await checkRes.json();
                          if (checkData.exists) {
                            // Existing user — log them in directly
                            const c = checkData.customer;
                            localStorage.setItem("is_signed_in", "true");
                            localStorage.setItem("user_email", c.email || email);
                            localStorage.setItem("user_first_name", c.first_name || "");
                            localStorage.setItem("user_last_name", c.last_name || "");
                            localStorage.setItem("user_gender", c.gender || "");
                            localStorage.setItem("user_dob", c.dob || "");
                            localStorage.setItem("user_title", c.title || "");
                            localStorage.setItem("user_mobile", c.phone || "");
                            localStorage.setItem("user_address1", c.address_line_1 || "");
                            localStorage.setItem("user_address2", c.address_line_2 || "");
                            localStorage.setItem("user_suburb", c.suburb || "");
                            localStorage.setItem("user_city", c.city || "");
                            localStorage.setItem("user_state", c.state || "");
                            localStorage.setItem("user_zip", c.zip_code || "");
                            localStorage.setItem("user_country", c.country || "");
                            setFirstName(c.first_name || "");
                            onSignInSuccess(c.email || email);
                            setSignInStep(4);
                          } else {
                            // New user — show registration form
                            setSignInStep(3);
                          }
                        } catch {
                          setSignInStep(3);
                        }
                      } catch {
                        setError('Network error. Please try again.');
                      }
                      setLoading(false);
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: ADD DETAILS */}
            {signInStep === 3 && (
              <div className="flex flex-col gap-4 text-left max-h-[60vh] overflow-y-auto pr-1">
                <p className="font-body text-sm text-zinc-600 leading-relaxed mb-2">
                  Please provide your basic details to complete your account setup.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-xs font-bold text-[#2D2136]">First Name *</label>
                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setError("");
                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-body text-xs font-bold text-[#2D2136]">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setError("");
                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setError("");
                    }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">I&rsquo;d rather not say</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs font-bold text-[#2D2136]">Date of Birth *</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <select
                      value={dobMonth}
                      onChange={(e) => {
                        setDobMonth(e.target.value);
                        setError("");
                      }}
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
                      value={dobDay}
                      onChange={(e) => {
                        setDobDay(e.target.value);
                        setError("");
                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                      required
                    >
                      <option value="">Day</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select
                      value={dobYear}
                      onChange={(e) => {
                        setDobYear(e.target.value);
                        setError("");
                      }}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-body text-sm text-[#2D2136] outline-none transition-colors focus:border-[#1E227D] focus:bg-white"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>{year}</option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setSignInStep(2);
                      setError("");
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    disabled={loading}
                    onClick={async () => {
                      if (!firstName.trim() || !lastName.trim() || !gender || !dobDay || !dobMonth || !dobYear) {
                        setError("Please fill out all required fields.");
                        return;
                      }
                      setLoading(true);
                      setError("");
                      try {
                        const res = await fetch(`${API_URL}/auth/register`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: email.trim(),
                            first_name: firstName.trim(),
                            last_name: lastName.trim(),
                            gender,
                            dob: `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`,
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          setError(data.message || 'Registration failed.');
                          setLoading(false);
                          return;
                        }
                        localStorage.setItem("is_signed_in", "true");
                        localStorage.setItem("user_email", email);
                        localStorage.setItem("user_first_name", firstName);
                        localStorage.setItem("user_last_name", lastName);
                        localStorage.setItem("user_gender", gender);
                        localStorage.setItem("user_dob", `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`);

                        onSignInSuccess(email);
                        setSignInStep(4);
                      } catch {
                        setError('Network error. Please try again.');
                      }
                      setLoading(false);
                    }}
                  >
                    {loading ? 'Saving...' : 'Save & Complete'}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {signInStep === 4 && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="h-16 w-16 flex items-center justify-center rounded-full bg-green-50 text-green-500 mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <CheckCircle size={36} strokeWidth={2.5} />
                  </motion.div>
                </div>
                <h3 className="font-display text-xl font-bold text-[#1E227D]">Welcome, {firstName}!</h3>
                <p className="font-body text-sm text-zinc-500 max-w-xs leading-relaxed">
                  Your account is now ready. You can proceed to book appointments and manage your health profile.
                </p>
                <Button
                  variant="primary"
                  className="w-full mt-4"
                  onClick={() => {
                    // resetForm clears the modal, so the redirect happens after.
                    resetForm();
                    router.push("/profile");
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
