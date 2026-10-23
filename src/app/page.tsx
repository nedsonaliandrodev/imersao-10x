import HeroCinema from "@/components/HeroCinema";
import SmoothScroll from "@/components/SmoothScroll";
import { Nav, Manifesto, Numbers, Anatomia, Galeria, NoPulso, Specs, Reserva, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Nav />
      <HeroCinema />
      <Manifesto />
      <Numbers />
      <Anatomia />
      <Galeria />
      <NoPulso />
      <Specs />
      <Reserva />
      <Footer />
    </main>
  );
}
