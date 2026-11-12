import Nav from "@/components/layout/Nav";
import Hero from "@/components/sections/hero/Hero";
import Statement from "@/components/sections/statement/Statement";
import TrustStrip from "@/components/sections/trust/TrustStrip";
import FeatureStory from "@/components/sections/feature/FeatureStory";
import MachineFlow from "@/components/sections/machine/MachineFlow";
import Compliance from "@/components/sections/compliance/Compliance";
import Stories from "@/components/sections/stories/Stories";
import Faq from "@/components/sections/faq/Faq";
import ClosingCta from "@/components/sections/closing/ClosingCta";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/motion/PageBackdrop";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <TrustStrip />
        <FeatureStory />
        <MachineFlow />
        <Compliance />
        <Stories />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
      {/* After the sections so it measures them last (Fruitful initPageBackground). */}
      <PageBackdrop />
    </>
  );
}
