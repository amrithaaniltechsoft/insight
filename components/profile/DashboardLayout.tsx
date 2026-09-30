"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, CalendarDays, FileText, Users, UserPlus, ChevronRight, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPeople, getPersonFullName, Person } from "@/lib/people";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userMobile, setUserMobile] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [peopleOpen, setPeopleOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("is_signed_in") === "true";
    if (!loggedIn) {
      // Redirect to home or show alert if not logged in
      router.push("/");
      return;
    }
    setIsSignedIn(true);
    setUserMobile(localStorage.getItem("user_mobile") || "");
    setUserFirstName(localStorage.getItem("user_first_name") || "");
    setUserLastName(localStorage.getItem("user_last_name") || "");
  }, [router]);

  // The people count comes from the `patients` table, so it matches what the
  // profile page lists. Re-reads on sign-in and on the custom event the profile
  // page fires after adding someone.
  useEffect(() => {
    const loadPeople = () => {
      const customerEmail = localStorage.getItem("user_email") || "";
      if (!customerEmail) {
        setPeople([]);
        return;
      }
      fetchPeople(customerEmail)
        .then(setPeople)
        .catch(() => setPeople([]));
    };
    loadPeople();
    window.addEventListener("auth-state-changed", loadPeople);
    window.addEventListener("people-changed", loadPeople);
    return () => {
      window.removeEventListener("auth-state-changed", loadPeople);
      window.removeEventListener("people-changed", loadPeople);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("is_signed_in");
    localStorage.removeItem("user_mobile");
    localStorage.removeItem("user_first_name");
    localStorage.removeItem("user_last_name");
    localStorage.removeItem("user_gender");
    localStorage.removeItem("user_dob");
    localStorage.removeItem("user_title");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_address1");
    localStorage.removeItem("user_address2");
    localStorage.removeItem("user_suburb");
    localStorage.removeItem("user_city");
    localStorage.removeItem("user_state");
    localStorage.removeItem("user_zip");
    localStorage.removeItem("user_country");

    // Force refresh header states
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#FCFAFD] flex items-center justify-center text-zinc-500 font-body text-sm">
        Loading secure dashboard...
      </div>
    );
  }

  const menuItems = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
    { name: "My Results", href: "/my-results", icon: FileText },
  ];

  const initials = `${userFirstName.charAt(0)}${userLastName.charAt(0)}`.toUpperCase() || "U";
  const fullName = `${userFirstName} ${userLastName}`.trim() || "User Profile";

  return (
    <div className="bg-[#FCFAFD] min-h-screen py-12 text-[#2D2136]">
      <div className="container mx-auto max-w-6xl px-4 lg:px-6">
        {/* <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E227D] mb-8 text-left">
          Dashboard
        </h1> */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
            {/* User Profile Summary Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 text-left">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#1E227D] to-[#F000E2] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="font-display text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Welcome</span>
                <span className="font-display text-sm font-bold text-[#1E227D] truncate leading-tight mt-0.5">{fullName}</span>
                <span className="font-body text-xs text-zinc-500 mt-0.5 truncate">{userMobile}</span>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col gap-1.5">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-display text-sm font-bold transition-all ${isActive
                      ? "bg-[#1E227D] text-white"
                      : "text-[#2D2136]/80 hover:bg-[#1E227D]/5 hover:text-[#1E227D]"
                      }`}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-[#1E227D]/70"} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* My People — shown under My Results */}
              <div className="border-t border-black/10 my-2" />
              <button
                type="button"
                onClick={() => setPeopleOpen((o) => !o)}
                aria-expanded={peopleOpen}
                className="w-full px-4 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2 font-display text-sm font-bold text-[#2D2136]/80">
                  <Users size={18} className="text-[#F000E2]" />
                  My People
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F000E2] px-1.5 text-[10px] font-bold text-white">
                    {people.length}
                  </span>
                  <ChevronRight
                    size={15}
                    className={`shrink-0 text-zinc-400 transition-transform duration-200 ${peopleOpen ? "rotate-90" : ""}`}
                  />
                </span>
              </button>
              {peopleOpen && (people.length > 0 ? (
                <div className="flex flex-col gap-1 mt-1">
                  {people.map((person) => (
                    <Link
                      key={person.id}
                      href={`/profile/people/${person.id}`}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl font-body text-sm transition-all hover:bg-[#1E227D]/5 text-left"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1E227D] to-[#F000E2] text-[10px] font-bold text-white">
                        {getPersonFullName(person).charAt(0).toUpperCase()}
                        {getPersonFullName(person).split(" ").pop()?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex flex-col flex-1">
                        <span className="font-body text-sm font-semibold text-[#2D2136] truncate leading-tight">
                          {getPersonFullName(person)}
                        </span>
                        <span className="font-body text-xs text-zinc-500 truncate">{person.relationship}</span>
                      </div>
                      <ChevronRight size={15} className="shrink-0 text-zinc-400" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-2 font-body text-xs text-zinc-500">
                  No people added yet.
                </p>
              ))}
              <Link
                href="/profile/people/add"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-body text-xs font-bold text-[#1E227D] transition-all hover:bg-[#1E227D]/10"
              >
                <UserPlus size={15} className="text-[#F000E2]" />
                Add Person
              </Link>

              <div className="border-t border-black/10 my-2" />

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-display text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left cursor-pointer"
              >
                <LogOut size={18} className="text-red-500/80" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
