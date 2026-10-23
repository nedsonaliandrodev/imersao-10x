import HeroCinema from "@/components/HeroCinema";
import SmoothScroll from "@/components/SmoothScroll";
import { Nav, Manifesto, Eclipse, Lupa, Materia, Specs, Reserva, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Nav />
      <HeroCinema />
      <Manifesto />
      <Eclipse />
      <Lupa />
      <Materia />
      <Specs />
      <Reserva />
      <Footer />
    </main>
  );
}
