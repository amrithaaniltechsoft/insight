export interface Person {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  email: string;
  mobile: string;
  address1: string;
  address2: string;
  suburb: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  relationship: string;
}

const STORAGE_KEY = "profile_people";

export function getPeople(): Person[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Person[]) : [];
  } catch {
    return [];
  }
}

export function savePeople(people: Person[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

export function getPersonFullName(person: Person): string {
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}