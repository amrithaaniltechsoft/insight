import Script from "next/script";
import PageBanner from "@/components/global/PageBanner";
import CTASection from "@/components/home/CTASection";

export const metadata = {
  title: "Patient Reviews | Insight Health Services Walsall",
  description: "Read genuine feedback and clinical testimonials from patients who visited our private ultrasound and wellness clinic in Walsall.",
};

export default function ReviewsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Reviews" }
  ];

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <PageBanner
        title="Patient"
        highlightedTitle="Reviews"
        breadcrumbs={breadcrumbs}
      />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="elfsight-app-46a1acc6-6126-4429-93c8-7e1fb83e1925" data-elfsight-app-lazy />
        </div>
      </section>
      <CTASection />
    </main>
  );
}
