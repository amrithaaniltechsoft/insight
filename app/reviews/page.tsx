import PageBanner from "@/components/global/PageBanner";
// import ReviewsGrid from "@/components/reviews/ReviewsGrid";
import GoogleReviews from "@/components/home/GoogleReviews";
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
      <PageBanner
        title="Patient"
        highlightedTitle="Reviews"
        breadcrumbs={breadcrumbs}
      />
      {/* <ReviewsGrid /> */}
      <GoogleReviews />
      <CTASection />
    </main>
  );
}
