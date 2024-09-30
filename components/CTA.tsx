import Image from "next/image";
import config from "@/config";
import Main from "@/components/Main";

const CTA = () => {
  return (
    <section className="relative hero  min-h-[60vh]">
      <Image
        src="/images/map_2.png"
        alt="Background Map"
        className="object-cover w-full"
        fill
      />
      <div className="relative hero-overlay bg-content bg-opacity-70"></div>
      <div className="relative hero-content text-center text-base-100 p-8">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
           Don&apos;t waste your time <br/> filling out contracts.
          </h2>
          <p className="text-lg opacity-100 mb-12 md:mb-16">
            Search an Address and Make Deals Quicker.
          </p>
          {/* <button className="btn btn-primary btn-wide">
            Get {config.appName}
          </button> */}
          <Main/>

        </div>
      </div>
    </section>
  );
};

export default CTA;
