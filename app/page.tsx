import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      
      <div style={{ position: 'relative', zIndex: 1000 }}>
          <Header />
        </div>
        <CTA/>
       
        {/* <Main /> */}
        {/* <Hero /> */}
        
        {/* <WithWithout/> */}
        <FAQ />
      <Footer />
    </>
  );
}