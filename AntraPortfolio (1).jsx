import { useState, useEffect, useRef } from "react";

// ── Colour & type tokens (derived from design plan) ──────────────────────────
// bg: #0A0F1E  card: #111827  accent: #6366F1  text: #F0F4FF  muted: #8892B0
// fonts: Space Grotesk (display), Inter (body) — loaded via <style> below

const ROLES = [
  "Machine Learning Engineer",
  "Computer Vision Researcher",
  "Data Scientist",
  "AI Builder",
];

// ── Utility ──────────────────────────────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Small reusable pieces ────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ color: "#6366F1", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.15em", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "0.5rem" }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: "#F0F4FF", lineHeight: 1.15, marginBottom: "1rem" }}>
      {children}
    </h2>
  );
}

function Tag({ children }) {
  return (
    <span style={{ display: "inline-block", background: "rgba(99,102,241,0.13)", color: "#818CF8", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "6px", padding: "2px 10px", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.04em", marginRight: "6px", marginBottom: "6px" }}>
      {children}
    </span>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["About", "Skills", "Projects", "Experience", "Contact"];
  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "0 2rem",
    background: scrolled ? "rgba(10,15,30,0.92)" : "transparent",
    backdropFilter: scrolled ? "blur(14px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(99,102,241,0.15)" : "none",
    transition: "all 0.3s ease",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: "64px",
  };

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav style={navStyle}>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#F0F4FF", letterSpacing: "0.02em" }}>
        AN<span style={{ color: "#6366F1" }}>.</span>
      </span>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "2rem" }} className="nav-links-desktop">
        {links.map((l) => (
          <button key={l} onClick={() => scrollTo(l)}
            style={{ background: "none", border: "none", color: "#8892B0", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 500, transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#F0F4FF"}
            onMouseLeave={e => e.target.style.color = "#8892B0"}
          >{l}</button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(m => !m)}
        style={{ display: "none", background: "none", border: "none", color: "#F0F4FF", cursor: "pointer", fontSize: "1.4rem" }}
        className="hamburger"
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: "fixed", top: "64px", left: 0, right: 0, background: "rgba(10,15,30,0.97)", backdropFilter: "blur(14px)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.2rem", borderBottom: "1px solid rgba(99,102,241,0.2)" }}>
          {links.map((l) => (
            <button key={l} onClick={() => scrollTo(l)}
              style={{ background: "none", border: "none", color: "#F0F4FF", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 600, textAlign: "left" }}
            >{l}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-links-desktop { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const role = useTypewriter(ROLES);
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", position: "relative", overflow: "hidden" }}>
      {/* Ambient gradient orbs */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: "420px", height: "420px", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "8%", width: "320px", height: "320px", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "780px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#6366F1", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.2em", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "1.4rem", opacity: 0, animation: "fadeUp 0.7s ease 0.1s forwards" }}>
          👋 Hi, I'm
        </p>

        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.8rem, 8vw, 5.5rem)", fontWeight: 800, color: "#F0F4FF", lineHeight: 1.05, marginBottom: "1.2rem", opacity: 0, animation: "fadeUp 0.7s ease 0.25s forwards" }}>
          Antra Nayudu
        </h1>

        {/* Typewriter role display */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "8px", padding: "0.55rem 1.4rem", marginBottom: "1.8rem", opacity: 0, animation: "fadeUp 0.7s ease 0.4s forwards" }}>
          <span style={{ color: "#A5B4FC", fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", fontWeight: 600 }}>{role}</span>
          <span style={{ color: "#6366F1", animation: "blink 1s step-end infinite" }}>▌</span>
        </div>

        <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "clamp(1rem, 2.5vw, 1.15rem)", lineHeight: 1.75, maxWidth: "560px", margin: "0 auto 2.4rem", opacity: 0, animation: "fadeUp 0.7s ease 0.55s forwards" }}>
          I turn raw data into practical ML systems — from financial forecasting workflows to curb-detection models for infrastructure imagery. Graduate of AI + Cybersecurity at Humber Polytechnic.
        </p>

        <div style={{ opacity: 0, animation: "fadeUp 0.7s ease 0.7s forwards", display: "flex", justifyContent: "center", gap: "0.8rem", flexWrap: "wrap" }}>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "#6366F1", color: "#fff", border: "none", borderRadius: "8px", padding: "0.75rem 1.8rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 0 36px rgba(99,102,241,0.6)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 0 24px rgba(99,102,241,0.4)"; }}
          >
            View My Work
          </button>
          <a
            href="/Antra_Nayudu_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#F0F4FF", border: "1px solid rgba(165,180,252,0.55)", borderRadius: "8px", padding: "0.75rem 1.8rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}
          >
            View Résumé
          </a>
          <a
            href="https://www.linkedin.com/in/antranayudu"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#A5B4FC", border: "1px solid rgba(99,102,241,0.35)", borderRadius: "8px", padding: "0.75rem 1.4rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}
          >
            LinkedIn
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  );
}

// ── Why Hire Me ───────────────────────────────────────────────────────────────
function WhyMe() {
  const cards = [
    { icon: "🔬", title: "Research → Application", body: "I take projects from raw data and experimentation through evaluation and practical inference workflows." },
    { icon: "📈", title: "Metric-Driven Mindset", body: "I compare model variants, validate results with appropriate metrics, and document the trade-offs behind each decision." },
    { icon: "🤝", title: "Stakeholder-Ready", body: "I write formal reports and deliver technical presentations to academic and project stakeholders — bridging research and decision-making." },
    { icon: "⚡", title: "Fast Learner, Broad Stack", body: "My work combines Python, PyTorch, TensorFlow, OpenCV, AWS, and SQL with an added foundation in AI security and networking." },
  ];

  return (
    <section id="why" style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>Why Hire Me</SectionLabel>
        <SectionHeading>What sets me apart</SectionHeading>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginTop: "2rem" }}>
        {cards.map((c, i) => (
          <FadeIn key={c.title} delay={i * 0.1}>
            <div
              style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "12px", padding: "1.6rem", height: "100%", transition: "border-color 0.25s, transform 0.25s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.55)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{c.icon}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#F0F4FF", fontSize: "1rem", marginBottom: "0.5rem" }}>{c.title}</h3>
              <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "6rem 2rem", background: "rgba(17,24,39,0.5)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
        <FadeIn>
          <SectionLabel>About Me</SectionLabel>
          <SectionHeading>I build AI that works in the real world.</SectionHeading>
          <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.97rem" }}>
            I'm an AI & ML researcher based in the Greater Toronto Area with a Bachelor of Engineering in Computer Science and two Humber Polytechnic graduate certificates: Artificial Intelligence & Machine Learning and Artificial Intelligence with Cybersecurity. My work spans computer vision, NLP, and financial time-series forecasting.
          </p>
          <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, fontSize: "0.97rem" }}>
            I care deeply about AI that solves tangible problems — accessibility tools for the Deaf community, automated infrastructure inspection, and market intelligence. I enjoy turning research ideas into testable systems and communicating what the results actually mean.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { num: "1,672+", label: "Images annotated" },
              { num: "13,974", label: "Gesture images prepared" },
              { num: "4+", label: "End-to-end AI projects" },
              { num: "Dean's", label: "List of Honour" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "12px", padding: "1.4rem", textAlign: "center" }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "1.9rem", color: "#818CF8", lineHeight: 1 }}>{s.num}</p>
                <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", marginTop: "0.35rem" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function Skills() {
  const groups = [
    {
      label: "ML & AI", color: "#6366F1",
      items: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "Time-Series Forecasting", "Semantic Segmentation", "Transfer Learning", "Prompt Engineering"],
    },
    {
      label: "Frameworks & Libraries", color: "#8B5CF6",
      items: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "YOLO", "Matplotlib"],
    },
    {
      label: "Data Engineering", color: "#06B6D4",
      items: ["Data Cleaning", "Web Scraping", "Feature Engineering", "Hyperparameter Tuning", "Model Validation", "API Data Ingestion", "CVAT Annotation"],
    },
    {
      label: "Programming & Cloud", color: "#10B981",
      items: ["Python", "SQL", "PostgreSQL", "AWS", "AWS S3", "Docker", "Git", "MLflow"],
    },
  ];

  return (
    <section id="skills" style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>Skills</SectionLabel>
        <SectionHeading>Tools I use to build and evaluate ML systems</SectionHeading>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginTop: "2.5rem" }}>
        {groups.map((g, i) => (
          <FadeIn key={g.label} delay={i * 0.1}>
            <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "1.6rem" }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: g.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>{g.label}</p>
              <div>{g.items.map(s => <Tag key={s}>{s}</Tag>)}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function Projects() {
  const projects = [
    {
      title: "Indian Sign Language → Text",
      icon: "🤟",
      impact: "Real-time accessibility for the Deaf community",
      description: "Developed a computer vision prototype that translates Indian Sign Language hand gestures into text in real time. Built and validated a consistent image dataset, refined preprocessing, and iterated on an EfficientNet-based classifier after reviewing misclassifications.",
      tech: ["Python", "TensorFlow", "OpenCV", "Transfer Learning", "CNN"],
      metrics: ["13,974 images prepared", "38 gesture classes", "Real-time text predictions"],
    },
    {
      title: "Curb Detection via YOLO Segmentation",
      icon: "🛣️",
      impact: "Automated infrastructure inspection at Kevares",
      description: "Engineered a semantic segmentation pipeline for automated curb detection. Annotated and quality-checked 1,672 images, diagnosed data-quality limitations, strengthened the dataset, and benchmarked nano, small, and medium YOLOv8 variants.",
      tech: ["PyTorch", "YOLO", "Python", "OpenCV", "Semantic Segmentation"],
      metrics: ["1,672 images annotated", "3 model sizes benchmarked", "Trade-offs documented for stakeholders"],
    },
    {
      title: "Financial Time Series Forecasting",
      icon: "📈",
      impact: "Short-term forecasting from historical and live market data",
      description: "Built a Python workflow that ingests historical and live market data through the Alpaca Markets API. Engineered lag, rolling-statistic, trend, and seasonality features, then evaluated forecasts with RMSE and MAPE.",
      tech: ["Python", "Alpaca API", "Pandas", "MLflow", "Feature Engineering"],
      metrics: ["1–7 day forecast horizon", "30–60 timestep lookback", "Periodic retraining workflow"],
    },
    {
      title: "NLP Model Experiments",
      icon: "📝",
      impact: "Sentiment classification and meeting summarization",
      description: "Compared BiLSTM and DistilBERT for three-class Yelp review sentiment classification, using validation performance and error analysis. Separately fine-tuned T5-small to turn meeting transcripts into concise summaries and action-focused bullet points.",
      tech: ["Python", "BiLSTM", "DistilBERT", "T5-small", "NLP"],
      metrics: ["Three-class sentiment task", "Model comparison and error analysis", "Transcript-to-summary fine-tuning"],
    },
  ];

  return (
    <section id="projects" style={{ padding: "6rem 2rem", background: "rgba(17,24,39,0.5)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>Projects</SectionLabel>
          <SectionHeading>Things I've built that matter</SectionHeading>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
          {projects.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <div
                style={{ background: "#0D1422", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "14px", padding: "1.8rem", display: "flex", flexDirection: "column", gap: "0.9rem", transition: "border-color 0.25s, transform 0.25s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.18)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                  <span style={{ fontSize: "2rem", lineHeight: 1 }}>{p.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#F0F4FF", fontSize: "1.05rem", marginBottom: "0.2rem" }}>{p.title}</h3>
                    <p style={{ color: "#6366F1", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600 }}>{p.impact}</p>
                  </div>
                </div>

                <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: 1.7 }}>{p.description}</p>

                <div>
                  {p.metrics.map(m => (
                    <div key={m} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      <span style={{ color: "#6366F1", fontSize: "0.7rem" }}>▶</span>
                      <span style={{ color: "#A5B4FC", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" }}>{m}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {p.tech.map(t => <Tag key={t}>{t}</Tag>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────
function Experience() {
  const jobs = [
    {
      role: "AI / ML Researcher",
      company: "Oracle Lens",
      period: "Oct 2025 – Apr 2026",
      location: "Toronto, Canada",
      bullets: [
        "Built a financial time-series forecasting system with real-time ingestion via Alpaca Markets API.",
        "Engineered lag features, rolling statistics, and trend/seasonality components.",
        "Structured 30–60 timestep lookback windows and 1–7 day forecast horizons, validating performance with RMSE and MAPE.",
        "Managed experiments and model versions with MLflow and implemented a periodic retraining workflow.",
      ],
    },
    {
      role: "AI & ML Researcher (Co-op)",
      company: "Kevares",
      period: "Oct 2024 – Apr 2025",
      location: "Canada",
      bullets: [
        "Engineered a semantic segmentation pipeline using PyTorch and YOLOv8 for automated curb detection.",
        "Annotated 1,672 images and migrated to a higher-quality external dataset for improved training signal.",
        "Benchmarked nano, small, and medium YOLOv8 variants and documented their accuracy and efficiency trade-offs.",
        "Documented accuracy, efficiency, failure modes, and practical trade-offs through reports, visualizations, and stakeholder presentations.",
      ],
    },
    {
      role: "Machine Learning Intern",
      company: "Learn and Empower Pvt Ltd",
      period: "Jun 2023 – Jun 2024",
      location: "India",
      bullets: [
        "Built an Indian Sign Language-to-text translation system using Python, OpenCV, and TensorFlow.",
        "Collected, cleaned, transformed, and validated 13,974 images across 38 gesture classes.",
        "Applied transfer learning and iterative optimisation to improve classification accuracy.",
        "Investigated misclassifications and refined image preprocessing and training inputs.",
        "Documented methodology and evaluation results to support knowledge transfer.",
      ],
    },
  ];

  return (
    <section id="experience" style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <FadeIn>
        <SectionLabel>Experience</SectionLabel>
        <SectionHeading>Where I've done the work</SectionHeading>
      </FadeIn>

      <div style={{ marginTop: "2.5rem", position: "relative" }}>
        {/* vertical line */}
        <div style={{ position: "absolute", left: "0", top: "8px", bottom: "8px", width: "2px", background: "linear-gradient(180deg, #6366F1, #8B5CF6, transparent)", borderRadius: "2px" }} />

        {jobs.map((j, i) => (
          <FadeIn key={j.company} delay={i * 0.12}>
            <div style={{ marginLeft: "2rem", marginBottom: "3rem", position: "relative" }}>
              {/* dot */}
              <div style={{ position: "absolute", left: "-2.45rem", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: "#6366F1", border: "2px solid #0A0F1E", boxShadow: "0 0 10px rgba(99,102,241,0.6)" }} />

              <div style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "12px", padding: "1.6rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#F0F4FF", fontSize: "1.05rem" }}>{j.role}</h3>
                    <p style={{ color: "#6366F1", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", fontWeight: 600, marginTop: "0.15rem" }}>{j.company}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" }}>{j.period}</p>
                    <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" }}>{j.location}</p>
                  </div>
                </div>

                <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                  {j.bullets.map(b => (
                    <li key={b} style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "0.35rem" }}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────
function Education() {
  const edu = [
    { school: "Humber Polytechnic", degree: "Graduate Certificate — Artificial Intelligence with Cybersecurity", period: "2025 – 2026", note: "✓ Completed" },
    { school: "Humber Polytechnic", degree: "Graduate Certificate — Artificial Intelligence & Machine Learning", period: "2024 – 2025" },
    { school: "G.H. Raisoni College of Engineering", degree: "Bachelor of Engineering — Computer Science", period: "2020 – 2024", note: "Dean's List of Honour" },
  ];

  return (
    <section style={{ padding: "3rem 2rem 5rem", background: "rgba(17,24,39,0.5)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <FadeIn>
          <SectionLabel>Education</SectionLabel>
          <SectionHeading>Academic foundation</SectionHeading>
        </FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
          {edu.map((e, i) => (
            <FadeIn key={e.degree} delay={i * 0.1}>
              <div style={{ background: "#111827", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "12px", padding: "1.2rem 1.6rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                <div>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "#F0F4FF", fontSize: "0.98rem" }}>{e.degree}</p>
                  <p style={{ color: "#6366F1", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", marginTop: "0.15rem" }}>
                    {e.school}
                    {e.note && e.note.startsWith("✓") && (
                      <span style={{ marginLeft: "0.5rem", background: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "4px", padding: "1px 7px", fontSize: "0.75rem", fontWeight: 700 }}>✓ Completed</span>
                    )}
                    {e.note && !e.note.startsWith("✓") && ` · ${e.note}`}
                  </p>
                </div>
                <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" }}>{e.period}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" style={{ padding: "7rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      <FadeIn>
        <SectionLabel>Contact</SectionLabel>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#F0F4FF", lineHeight: 1.1, marginBottom: "1rem" }}>
          Let's build something together.
        </h2>
        <p style={{ color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "1rem", lineHeight: 1.75, maxWidth: "460px", margin: "0 auto 2.5rem" }}>
          Open to full-time machine learning, AI, computer vision, and data-focused opportunities. Feel free to reach out.
        </p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: "#111827", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "12px", padding: "1rem 2rem" }}>
          <span style={{ fontSize: "1.2rem" }}>📧</span>
          <a href="mailto:antranaidu2608@gmail.com" style={{ color: "#A5B4FC", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "1rem", textDecoration: "none" }}>antranaidu2608@gmail.com</a>
        </div>
      </FadeIn>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "1.5rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)", color: "#8892B0", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem" }}>
      Built by Antra Nayudu · {new Date().getFullYear()} · Toronto, Canada
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      {/* Load fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0A0F1E; color: #F0F4FF; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0A0F1E; }
        ::-webkit-scrollbar-thumb { background: #6366F1; border-radius: 3px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <Nav />
      <main>
        <Hero />
        <WhyMe />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
