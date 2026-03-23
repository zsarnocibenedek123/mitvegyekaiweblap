import { useRef } from "react";
import "@/App.css";
import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { Pipeline } from "./components/landing/Pipeline";
import { WidgetDemo } from "./components/landing/WidgetDemo";
import { DeveloperAPI } from "./components/landing/DeveloperAPI";
import { AnalyticsPreview } from "./components/landing/AnalyticsPreview";
import { PartnerAdmin } from "./components/landing/PartnerAdmin";
import { Footer } from "./components/landing/Footer";

function App() {
  const widgetRef = useRef(null);

  const scrollToDemo = () => {
    const el = document.getElementById("widget-demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero onDemoClick={scrollToDemo} />
      <Pipeline />
      <WidgetDemo ref={widgetRef} />
      <DeveloperAPI />
      <AnalyticsPreview />
      <PartnerAdmin />
      <Footer />
    </div>
  );
}

export default App;
