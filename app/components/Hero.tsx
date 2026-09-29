export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="ph-fill" aria-hidden="true"></div>
      <div className="hero-panel glass glass-panel">
        <h1 id="hero-title">Buildings shaped by their place</h1>
        <p>Zero Studio Architectures designs homes, cultural spaces and workplaces with clear plans and honest materials.</p>
        <div className="btn-row">
          <a className="btn btn-primary" href="#projects">View Projects</a>
          <a className="btn" href="#contact">Get in Touch</a>
        </div>
      </div>
    </section>
  );
}