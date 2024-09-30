import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Hero from "@/components/Hero";
import FAQ from "@/components/FAQ";
import WithWithout from "@/components/WithWithout";

import Main from "@/components/Main";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <CTA/>
       
        {/* <Main /> */}
        {/* <Hero /> */}
        
        {/* <WithWithout/> */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}