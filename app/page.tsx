"use client";

import { useState } from "react";

const features = [
  ["🎬", "Reel Composer", "Video, caption, CTA and destination link in one flow."],
  ["🔗", "Monetized Links", "Route clicks through your approved ad or landing setup."],
  ["📊", "Click Analytics", "Track clicks, unique visitors, device and campaign data."],
  ["📅", "Scheduling", "Prepare content now and publish at the selected time."],
  ["🧠", "AI Caption", "Generate reusable captions, hashtags and CTAs."],
  ["📄", "Page Manager", "Connect Meta and select the Pages you manage."]
];

export default function Home() {
  const [videoName, setVideoName] = useState("");
  const [productLink, setProductLink] = useState("");
  const [caption, setCaption] = useState("");

  function generateCaption() {
    const link = productLink ? "\n\n🔗 " + productLink : "";
    setCaption("🔥 Check out this Reel!\n\nDiscover more details below." + link + "\n\n#reels #facebookreels #trending");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brandMark">R</span> ReelPilot <span>AI</span></div>
        <button className="ghost" onClick={() => alert("Meta OAuth will be connected in the next build step.")}>Connect Facebook</button>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">REEL PUBLISHING • LINK MONETIZATION</p>
          <h1>Publish Reels faster.<br />Turn clicks into visits.</h1>
          <p className="sub">Upload a video, add a destination link, generate a caption, and manage publishing from one premium dashboard.</p>
          <div className="actions">
            <a href="#composer" className="primary">Create Reel</a>
            <a href="#features" className="secondary">Explore features</a>
          </div>
        </div>

        <div className="heroCard">
          <div className="cardHeader"><span>Publishing pipeline</span><span className="liveDot">● LIVE</span></div>
          <div className="pipeline">
            {[
              ["01","Video uploaded","Ready"],
              ["02","AI caption","Generated"],
              ["03","Destination link","Tracked"],
              ["04","Facebook Page","Connect"]
            ].map(([n,t,s]) => <div key={n}><b>{n}</b><span>{t}</span><em>{s}</em></div>)}
          </div>
        </div>
      </section>

      <section id="composer" className="panel">
        <div className="panelTitle">
          <div><p className="eyebrow">REEL COMPOSER</p><h2>Create your first Reel</h2></div>
          <span className="status">MVP READY</span>
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
            <select defaultValue="">
              <option value="" disabled>Connect Facebook to load Pages</option>
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
          <button className="primary" onClick={() => alert("Draft UI is ready. Supabase + Meta publishing will be wired next.")}>Save Draft</button>
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

      <footer>ReelPilot AI • Facebook publishing + monetized link workflow</footer>
    </main>
  );
}