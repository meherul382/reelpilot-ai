"use client";

import { useEffect, useMemo, useState } from "react";

type Post = {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  read: string;
};

const posts: Post[] = [
  { id: 1, category: "Trending", title: "The internet's biggest stories and ideas in one place", excerpt: "Discover fresh stories, useful guides, technology updates and entertaining content every day.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", read: "4 min read" },
  { id: 2, category: "Technology", title: "Smart tools that can make everyday work easier", excerpt: "Simple technology tips, apps and digital tools worth trying.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", read: "5 min read" },
  { id: 3, category: "Lifestyle", title: "Small habits that make your day more productive", excerpt: "Practical ideas for routines, focus, travel and modern living.", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80", read: "3 min read" },
  { id: 4, category: "Travel", title: "Beautiful places worth adding to your travel list", excerpt: "Destination inspiration, planning tips and memorable experiences.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", read: "6 min read" },
  { id: 5, category: "Entertainment", title: "What people are watching, sharing and talking about", excerpt: "Trending entertainment, social moments and digital culture.", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80", read: "4 min read" },
  { id: 6, category: "Guides", title: "Useful online tools you can use for free", excerpt: "Quick guides and practical tools for everyday digital tasks.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80", read: "5 min read" }
];

const tools = ["Image Compressor", "Image Resizer", "QR Code Generator", "Word Counter", "Case Converter", "Password Generator"];

function AdSlot({ label }: { label: string }) {
  return <div className="adSlot"><span>Advertisement</span><strong>{label}</strong><small>Replace with your approved Adsterra unit</small></div>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [cookie, setCookie] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setCookie(localStorage.getItem("adpage-cookie") !== "accepted");
  }, []);

  const categories = ["All", "Trending", "Technology", "Lifestyle", "Travel", "Entertainment", "Guides"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (active === "All" || p.category === active) &&
        (!q || [p.title, p.excerpt, p.category].join(" ").toLowerCase().includes(q))
    );
  }, [query, active]);

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setNotice(email.includes("@") ? "Thanks! Your subscription request is saved locally for this demo." : "Enter a valid email address.");
  }

  return (
    <main className="site">
      <header className="topbar">
        <div className="container navInner">
          <a className="logo" href="#">AdPage<span>Builder</span></a>
          <nav className="desktopNav">
            {["Home", "Trending", "Technology", "Lifestyle", "Travel", "Entertainment", "Tools"].map((x) => (
              <a key={x} href={x === "Home" ? "/" : x === "Tools" ? "#tools" : "/" + x.toLowerCase()}>{x}</a>
            ))}
          </nav>
          <a className="headerButton" href="#tools">Explore Free Tools</a>
        </div>
      </header>

      <div className="container">
        <AdSlot label="Top Banner" />

        <section className="hero">
          <div className="heroCopy">
            <span className="eyebrow">MIXED CONTENT · FRESH EVERY DAY</span>
            <h1>Stories, trends, tools and ideas worth your time.</h1>
            <p>AdPage Builder brings useful guides, technology, travel, entertainment and trending stories into one fast, mobile-first destination.</p>
            <div className="heroActions">
              <a className="primaryButton" href="#latest">Explore latest</a>
              <a className="ghostButton" href="#tools">Browse free tools</a>
            </div>
            <div className="heroMeta"><span>✓ Mobile friendly</span><span>✓ Search ready</span><span>✓ Daily content</span></div>
          </div>
          <div className="heroVisual">
            <img src="https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85" alt="Editorial workspace" />
            <div className="floatingCard">
              <small>NOW TRENDING</small>
              <strong>Fresh stories, practical guides and digital discoveries.</strong>
              <span>Updated daily</span>
            </div>
          </div>
        </section>

        <section className="categoryBar">
          {categories.map((c) => (
            <button key={c} className={active === c ? "cat active" : "cat"} onClick={() => setActive(c)}>{c}</button>
          ))}
        </section>

        <section id="latest" className="contentLayout">
          <div className="mainColumn">
            <div className="sectionHeader">
              <div><span className="eyebrow">LATEST CONTENT</span><h2>What people are reading</h2></div>
              <div className="search"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stories..." aria-label="Search stories" /></div>
            </div>

            <div className="featuredGrid">
              {filtered.slice(0, 3).map((p, i) => (
                <article key={p.id} className={i === 0 ? "postCard featured" : "postCard"}>
                  <img src={p.image} alt="" />
                  <div className="postBody">
                    <span className="postCategory">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <div className="postFoot"><span>{p.read}</span><a href={"#post-" + p.id}>Read story →</a></div>
                  </div>
                </article>
              ))}
            </div>

            <AdSlot label="In-Content Rectangle" />

            <div className="moreGrid">
              {filtered.slice(3).map((p) => (
                <article key={p.id} id={"post-" + p.id} className="postCard horizontal">
                  <img src={p.image} alt="" />
                  <div className="postBody">
                    <span className="postCategory">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <div className="postFoot"><span>{p.read}</span><a href="#">Open →</a></div>
                  </div>
                </article>
              ))}
            </div>
            {!filtered.length && <div className="emptyState">No stories matched your search.</div>}
          </div>

          <aside className="sideColumn">
            <AdSlot label="Sidebar" />

            <div className="sidePanel">
              <span className="eyebrow">POPULAR</span>
              <h3>Explore by topic</h3>
              {categories.slice(1).map((c, i) => (
                <button className="topicRow" key={c} onClick={() => setActive(c)}>
                  <span>{String(i + 1).padStart(2, "0")}</span><b>{c}</b><span>→</span>
                </button>
              ))}
            </div>

            <div className="sidePanel newsletter">
              <span className="eyebrow">NEWSLETTER</span>
              <h3>Get useful stories in your inbox.</h3>
              <p>One simple email with new articles, guides and tools.</p>
              <form onSubmit={subscribe}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                <button>Subscribe</button>
              </form>
              {notice && <small className="notice">{notice}</small>}
            </div>
          </aside>
        </section>

        <section className="toolsSection"><div className="sectionHeader"><div><span className="eyebrow">READ MORE</span><h2>Explore the full article library</h2></div><a className="primaryButton" href="/articles">View all articles →</a></div><section id="tools" className="toolsSection">
          <div className="sectionHeader">
            <div><span className="eyebrow">FREE TOOLS</span><h2>Useful utilities, no signup needed</h2></div>
            <span className="sectionNote">Designed for repeat search traffic</span>
          </div>
          <div className="toolGrid">
            {tools.map((t) => (
              <a className="toolCard" href="#tools" key={t}>
                <span className="toolIcon">✦</span><strong>{t}</strong><p>Fast, simple and mobile-friendly.</p><span className="toolLink">Use tool →</span>
              </a>
            ))}
          </div>
        </section>

        <AdSlot label="Bottom Banner" />
      </div>

      <footer className="footer">
        <div className="container footerGrid">
          <div><a className="logo" href="#">AdPage<span>Builder</span></a><p>Mixed content, useful tools and fresh stories.</p></div>
          <div><h4>Explore</h4><a href="/articles">All Articles</a><a href="/technology">Technology</a><a href="/travel">Travel</a><a href="/lifestyle">Lifestyle</a><a href="#tools">Free Tools</a></div>
          <div><h4>Info</h4><a href="/about">About</a><a href="/contact">Contact</a><a href="/faq">FAQ</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
        </div>
        <div className="container copyright">© 2026 AdPage Builder. All rights reserved.</div>
      </footer>

      {cookie && (
        <div className="cookie">
          <div><strong>Privacy & cookies</strong><p>Essential browser storage may be used for preferences. Advertising partners can have separate cookie policies.</p></div>
          <button onClick={() => { localStorage.setItem("adpage-cookie", "accepted"); setCookie(false); }}>Accept</button>
        </div>
      )}
    </main>
  );
}