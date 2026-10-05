import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Journal from "./components/Journal";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <Projects />
      <Journal />
      <Contact />
    </main>
  );
}
