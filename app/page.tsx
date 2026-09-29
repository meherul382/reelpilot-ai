"use client";

import { useEffect, useState } from "react";

const features = [
  ["🎬", "Reel Composer", "Upload a Reel, write a caption and choose a Facebook Page."],
  ["🔗", "Tracked Links", "Attach a destination or monetized landing link to your Reel."],
  ["📊", "Analytics", "Track clicks, devices, countries and campaign activity."],
  ["📅", "Scheduling", "Prepare Reels and publish them at the selected time."],
  ["🧠", "AI Caption", "Generate captions, hashtags and calls-to-action."],
  ["📄", "Page Manager", "Connect Meta and manage the Pages available to you."]
];

export default function Home() {
  const [videoName, setVideoName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [caption, setCaption] = useState("");
  const [pages, setPages] = useState<{ id: string; page_name: string }[]>([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState("");

  async function ensureSession() {
    const res = await fetch("/api/anonymous", { method: "POST" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not start workspace.");
  }

  async function connectFacebook() {
    try {
      setConnecting(true);
      await ensureSession();
      window.location.href = "/api/meta/connect";
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not connect.");
      setConnecting(false);
    }
  }

  async function loadPages() {
    const res = await fetch("/api/pages", { cache: "no-store" });
    const data = await res.json();
    if (res.ok) setPages(data.pages || []);
  }

  useEffect(() => {
    ensureSession().then(loadPages).catch(e => setMessage(e.message));
    const params = new URLSearchParams(window.location.search);
    if (params.get("facebook") === "connected") setMessage("Facebook connected successfully. Your Pages are ready.");
    if (params.get("facebook") === "connected_no_pages") setMessage("Facebook connected, but no Facebook Pages are available for this app yet.");
    if (params.get("facebook") && !["connected", "connected_no_pages"].includes(params.get("facebook")!)) setMessage("Facebook connection needs attention: " + params.get("facebook"));
  }, []);

  function generateCaption() {
    const link = productLink ? "\n\n🔗 " + productLink : "";
    setCaption("🔥 Check out this Reel!\n\nDiscover more details below." + link + "\n\n#reels #facebookreels #trending");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brandMark">R</span> ReelPilot <span>AI</span></div>
        <button className="ghost" onClick={connectFacebook} disabled={connecting}>
          {connecting ? "Connecting..." : pages.length ? "Facebook Connected" : "Connect Facebook"}
        </button>
      </header>

      {message && <div className="notice">{message}</div>}

      <section className="hero">
        <div>
          <p className="eyebrow">REEL PUBLISHING • LINK MONETIZATION</p>
          <h1>Publish Reels faster.<br />Turn clicks into visits.</h1>
          <p className="sub">No separate ReelPilot login. Click Connect Facebook, authorize Meta, choose your Page and start uploading Reels.</p>
          <div className="actions">
            <button className="primary" onClick={connectFacebook} disabled={connecting}>
              {pages.length ? "Create Reel" : "Connect Facebook"}
            </button>
            <a href="#features" className="secondary">Explore features</a>
          </div>
        </div>

        <div className="heroCard">
          <div className="cardHeader"><span>Publishing pipeline</span><span className="liveDot">● READY</span></div>
          <div className="pipeline">
            {[["01","Connect Facebook","OAuth"],["02","Choose Page",pages.length ? `${pages.length} ready` : "Waiting"],["03","Upload Reel","Ready"],["04","Publish","Meta API"]].map(([n,t,s]) =>
              <div key={n}><b>{n}</b><span>{t}</span><em>{s}</em></div>
            )}
          </div>
        </div>
      </section>

      <section id="composer" className="panel">
        <div className="panelTitle">
          <div><p className="eyebrow">REEL COMPOSER</p><h2>Create your Reel</h2></div>
          <span className="status">{pages.length ? "FACEBOOK READY" : "CONNECT FACEBOOK"}</span>
        </div>

        <div className="formGrid">
          <label>
            <span>Video</span>
            <div className="uploadBox" onClick={() => document.getElementById("videoInput")?.click()}>
              <strong>{videoName || "Choose a Reel video"}</strong>
              <small>MP4 recommended</small>
            </div>
            <input id="videoInput" hidden type="file" accept="video/*" onChange={e => setVideoName(e.target.files?.[0]?.name || "")} />
          </label>

          <label>
            <span>Facebook Page</span>
            <select value={selectedPage} onChange={e => setSelectedPage(e.target.value)}>
              <option value="">{pages.length ? "Select a Page" : "Connect Facebook first"}</option>
              {pages.map(page => <option key={page.id} value={page.id}>{page.page_name}</option>)}
            </select>
          </label>

          <label className="wide">
            <span>Product / Destination Link</span>
            <input value={productLink} onChange={e => setProductLink(e.target.value)} placeholder="https://your-domain.com/go/product-01" />
            <small>Use your tracked or monetized landing URL.</small>
          </label>

          <label className="wide">
            <span>Caption</span>
            <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={7} placeholder="Write a caption or generate one with AI..." />
          </label>
        </div>

        <div className="composerActions">
          <button className="secondary" onClick={generateCaption}>Generate AI Caption</button>
          <button className="primary" onClick={() => setMessage("Composer saved locally for now. Meta Reel publishing is the next integration step.")}>Save Draft</button>
        </div>
      </section>

      <section id="features" className="featureGrid">
        {features.map(([icon,title,desc]) => (
          <article className="feature" key={title}>
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </section>

      <footer>
        <div>ReelPilot AI • Facebook publishing + tracked link workflow</div>
        <nav className="footerLinks" aria-label="Legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/data-deletion">Data Deletion</a>
        </nav>
      </footer>
    </main>
  );
}
