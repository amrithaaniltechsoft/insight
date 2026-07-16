import BloodTestsClient from "@/components/bloodtests/BloodTestsClient";

export const metadata = {
  title: "Private Blood Tests & Laboratory Diagnostics | Insight Health Services Walsall",
  description: "Comprehensive private blood testing in Walsall. General health, fertility, hormone panels, cardiac risk & more. Rapid results from UKAS accredited laboratories.",
};

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
