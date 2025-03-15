import { Contact } from "./_components/contacts";
import { Feature } from "./_components/features";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";
import { Pricing } from "./_components/pricing";

const GetStarted = () => {
  return (
    <>
      <Header />
      <Hero />
      <Feature />
      <Pricing />
      <Contact />
      <Footer />
    </>
  );
};

export default GetStarted;
