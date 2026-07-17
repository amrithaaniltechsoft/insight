import PageBanner from "@/components/global/PageBanner";
import ContactContent from "@/components/contact/ContactContent";

export const metadata = {
  title: "Contact Us | Insight Health Services Walsall",
  description: "Contact our Walsall private healthcare clinic. View our clinic hotline, WhatsApp numbers, opening hours, address details, and location map.",
};

interface ContactData {
  contact1: string;
  contact2: string;
  email: string;
  address: string;
  mon_fri: string;
  saturday: string;
  sunday: string;
}

async function getContact(): Promise<ContactData> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const response = await fetch(`${API_URL}/contact`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    return {
      contact1: '01922 351933',
      contact2: '07777 138 166',
      email: 'bookings@insighthealthservices.co.uk',
      address: '1a Walsall Rd, Walsall WS5 4QL, United Kingdom',
      mon_fri: '08:00 - 21:00',
      saturday: '08:00 - 21:00',
      sunday: '08:00 - 21:00',
    };
  }
}

export default async function ContactPage() {
  const contact = await getContact();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Contact Us" }
  ];

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">
      <PageBanner
        title="Contact"
        highlightedTitle="Us"
        breadcrumbs={breadcrumbs}
      />
      <ContactContent contact={contact} />
    </main>
  );
}
