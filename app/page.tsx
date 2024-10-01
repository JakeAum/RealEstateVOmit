import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      {/* <Suspense fallback={<div>Loading search...</div>}> */}
      {/* <div style={{ position: 'relative', zIndex: 1000 }}> */}
          <Header />
        {/* </div> */}
      {/* </Suspense> */}
      <main>
        <CTA/>
        <div style={{ position: 'relative', zIndex: 0 }}>
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}