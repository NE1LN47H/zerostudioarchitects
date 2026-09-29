import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Approach from "./components/Approach";
import Journal from "./components/Journal";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Projects />
      <Approach />
      <Journal />
      <Contact />
    </main>
  );
}
