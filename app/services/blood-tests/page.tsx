import BloodTestsClient from "@/components/bloodtests/BloodTestsClient";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getSeoByPage(page: string) {
  try {
    const res = await fetch(`${API_URL}/seos/${page}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPage('Blood test');
  return {
    title: seo?.meta_title || "Private Blood Tests & Laboratory Diagnostics | Insight Health Services Walsall",
    description: seo?.meta_description || "Comprehensive private blood testing in Walsall. General health, fertility, hormone panels, cardiac risk & more. Rapid results from UKAS accredited laboratories.",
    keywords: seo?.meta_keywords || undefined,
  };
}

// Fetch blood tests from API
async function getBloodTests() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  
  try {
    const response = await fetch(`${API_URL}/services/category/blood-tests`, {
      next: { revalidate: 60 } // ISR: revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blood tests');
    }

    const data = await response.json();
    return data.services || [];
  } catch (error) {
    console.error('Error fetching blood tests:', error);
    return [];
  }
}

export default async function BloodTestsPage() {
  const tests = await getBloodTests();
  
  return <BloodTestsClient tests={tests} />;
}
