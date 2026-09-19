import DelhiMap from "./components/DelhiMap";
import { useState, useEffect, type ReactNode } from "react";
import { createBrowserRouter, NavLink, Outlet, useNavigate } from "react-router";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
/* ─── Domain → Authority ─── */
function addCivicPoints(points: number) {
  const current = Number(
    localStorage.getItem("cityzen_civic_points") || "1450"
  );

  const updated = current + points;

  localStorage.setItem("cityzen_civic_points", updated.toString());
  window.dispatchEvent(new Event("civicPointsUpdated"));
}
const domainAuthority: Record<string, { name: string; id: string; dept: string }> = {
  "Roads":       { name: "Ravi Kumar",   id: "AUTH-DEL-012", dept: "Road Maintenance Dept" },
  "Sanitation":  { name: "Priya Verma",  id: "AUTH-DEL-034", dept: "Sanitation Department" },
  "Electricity": { name: "Suresh Singh", id: "AUTH-DEL-021", dept: "BSES Rajdhani Power Ltd" },
  "Water":       { name: "Anjali Mehta", id: "AUTH-DEL-047", dept: "DJB Water Authority" },
  "Garbage":     { name: "Manoj Sharma", id: "AUTH-DEL-008", dept: "Waste Management Wing" },
  "Streetlights":{ name: "Deepak Yadav", id: "AUTH-DEL-055", dept: "PWD Lighting Division" },
  "Parks":       { name: "Sunita Gupta", id: "AUTH-DEL-063", dept: "Horticulture Department" },
  "Other":       { name: "Ward Officer", id: "AUTH-DEL-001", dept: "Municipal Corporation Delhi" },
};

function genCitizenId() { return "CTZ-" + Math.floor(1000 + Math.random() * 9000); }

/* ─── Terms & Privacy Modal ─── */
const policyItems = [
  {
    icon: "📋", color: "#FFC107",
    title: "Terms of Service",
    body: "By using CityZen you agree to report only genuine civic issues in good faith. False or repeated spam reports may result in account suspension. Respectful conduct toward municipal officers and fellow citizens is mandatory.",
  },
  {
    icon: "🔒", color: "#4ade80",
    title: "Privacy & Data Policy",
    body: "Your email, phone number, and Citizen ID are encrypted and shared only with assigned municipal authorities to process your complaints. Photos you upload are stored securely and deleted after case closure.",
  },
  {
    icon: "📍", color: "#60a5fa",
    title: "Location & GPS Usage",
    body: "CityZen requests your precise GPS location to auto-tag your complaint to the correct ward and authority. Location data is only used at the moment of reporting and is not tracked in the background.",
  },
  {
    icon: "⚠", color: "#f97316",
    title: "Content & Reporting Guidelines",
    body: "Do not submit duplicate reports, abuse the authority notification system, or upload inappropriate content. All reports are moderated. Misuse may result in a temporary or permanent ban.",
  },
  {
    icon: "✦", color: "#a78bfa",
    title: "Civic Points & Rewards",
    body: "Civic Points are non-monetary tokens awarded for verified civic contributions. They may be redeemed for local government service discounts. Points cannot be transferred, sold, or exchanged for cash.",
  },
];

function TermsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="terms-backdrop" onClick={onClose}>
      <div className="terms-card" onClick={e => e.stopPropagation()}>
        <div className="terms-header">
          <h2 style={{ fontSize: 18, color: "#fff", margin: 0 }}>Terms &amp; Privacy Policy</h2>
          <button className="terms-close" onClick={onClose}>✕</button>
        </div>
        <div className="terms-body">
          {policyItems.map((p, i) => (
            <div key={i} className="terms-item">
              <div className="terms-item-icon" style={{ background: p.color + "22", color: p.color }}>{p.icon}</div>
              <div>
                <b style={{ fontSize: 13, color: "#f1f5f9", display: "block", marginBottom: 4 }}>{p.title}</b>
                <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.6 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="terms-footer">
          <button className="terms-agree-btn" onClick={onClose}>I Agree &amp; Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ─── CityZen Logo ─── */
function CityZenLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? 48 : size === "sm" ? 28 : 36;
  return (
    <div className="cityzen-logo">
      <svg width={dim} height={dim} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="url(#czG)" />
        <rect x="6"  y="22" width="8"  height="18" rx="1" fill="#fff" fillOpacity=".95" />
        <rect x="16" y="14" width="10" height="26" rx="1" fill="#fff" fillOpacity=".95" />
        <rect x="28" y="19" width="7"  height="21" rx="1" fill="#fff" fillOpacity=".85" />
        <rect x="37" y="24" width="5"  height="16" rx="1" fill="#fff" fillOpacity=".75" />
        <path d="M6 22 Q24 4 42 22" stroke="#FFC107" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="4" y="40" width="40" height="2" rx="1" fill="#fff" fillOpacity=".4" />
        <defs>
          <linearGradient id="czG" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#063B28" />
            <stop offset="1" stopColor="#138808" />
          </linearGradient>
        </defs>
      </svg>
      <span className="logo-wordmark" style={{ fontSize: size === "lg" ? 22 : size === "sm" ? 13 : 17 }}>
        City<em style={{ color: "#FFC107", fontStyle: "normal" }}>Zen</em>
      </span>
    </div>
  );
}

/* ─── Shell ─── */
function StatusBar({ dark = false }: { dark?: boolean }) {
  const [pulse, setPulse] = useState(true);
  useEffect(() => { const t = setInterval(() => setPulse(p => !p), 1400); return () => clearInterval(t); }, []);
  return (
    <div className="status-bar" style={{ background: dark ? "#0a0d12" : "#1F3C88" }}>
      <span className="sb-live"><i className={`net-dot ${pulse ? "on" : ""}`} />Live</span>
      <span className="sb-city" style={{ color: "#94a3b8" }}>Delhi · Ward 23</span>
      <span className="sb-pts" style={{ color: "#FFC107" }}>✦ 820 pts</span>
    </div>
  );
}

function Shell() {
  return (
    <main className="app-shell dark-shell">
      <StatusBar dark />
      <Outlet />
      <BottomNav />
    </main>
  );
}

function BottomNav() {
  const tabs: [string, string, string][] = [
    ["/app", "⌂", "Home"],
    ["/app/social", "◎", "Social"],
    ["/app/volunteer", "✋", "Volunteer"],
    ["/app/profile", "◉", "You"],
  ];
  return (
    <nav className="bottom-nav dark-nav">
      {tabs.map(([to, icon, label]) => (
        <NavLink key={to} to={to} end={to === "/app"}
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/* ─── Dark Top Bar ─── */
function DarkTopBar({ title, onPtsClick, onNotif, onChat }: {
  title?: string; onPtsClick?: () => void; onNotif?: () => void; onChat?: () => void;
}) {
  return (
    <div className="dark-topbar">
      {title
        ? <b className="dark-topbar-title">{title}</b>
        : <CityZenLogo size="sm" />}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
        {onChat && (
          <button className="dk-icon-btn" onClick={onChat}>
            <span>💬</span><i className="dk-badge" />
          </button>
        )}
        <button className="dk-icon-btn" style={{ position: "relative" }} onClick={onNotif}>
          <span>🔔</span><i className="dk-badge" />
        </button>
        <button className="dk-icon-btn" onClick={onPtsClick}>
          <span style={{ color: "#FFC107", fontSize: 10, fontFamily: "DM Mono", fontWeight: 700 }}>✦ 820</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Civic Reward Toast ─── */
function CivicToast({ pts, visible, label }: { pts: number; visible: boolean; label?: string }) {
  return (
    <div className={`civic-toast ${visible ? "show" : ""}`}>
      <span style={{ color: "#FFC107" }}>✦</span> +{pts} {label ?? "Civic Points earned!"}
    </div>
  );
}

/* ─── Modal Wrapper ─── */
function Modal({ open, close, children }: { open: boolean; close: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={close}>
      <section className="dark-sheet" onClick={e => e.stopPropagation()}>
        <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={close}>×</button>
        <div className="sheet-handle" style={{ background: "#94a3b8" }} />
        {children}
      </section>
    </div>
  );
}

/* ─── Delhi Hero Carousel ─── */
const heroSlides = [
  {
    eyebrow: "YAMUNA RIVERFRONT · CLEANUP DRIVE",
    headline: "12,000+ Issues\nResolved Together.",
    sub: "Yamuna Clean-Up Drive reaches Phase 3 this month.",
    stat: "₹2.4Cr invested",
    statSub: "in riverbank restoration",
    bg: "linear-gradient(160deg,#063B28 0%,#0d4a33 60%,#1a6b45 100%)",
    accent: "#4ade80",
    impactStats: ["4,200 volunteers deployed", "18km of riverbank cleared", "340 tonnes of waste removed", "Authority resolution: avg 1.8 days"],
  },
  {
    eyebrow: "CONNAUGHT PLACE · SMART LIGHTING",
    headline: "94% of Delhi's\nCP lights upgraded.",
    sub: "Smart Lighting Initiative transforms Connaught Place.",
    stat: "340 poles",
    statSub: "fitted with smart sensors",
    bg: "linear-gradient(160deg,#0F1117 0%,#1a1f2e 60%,#1e2a4a 100%)",
    accent: "#60a5fa",
    impactStats: ["340 smart poles installed", "68% energy savings", "Zero outages for 90 days", "Authority: PWD Delhi"],
  },
  {
    eyebrow: "WASTE SEGREGATION · CITY-WIDE",
    headline: "Your Voice,\nCleaner Delhi.",
    sub: "Waste Segregation Campaign hits 82% compliance in Ward 23.",
    stat: "86% wards",
    statSub: "now fully segregated",
    bg: "linear-gradient(160deg,#2d1515 0%,#3b1a1a 60%,#4a2020 100%)",
    accent: "#FFC107",
    impactStats: ["82% compliance in South Delhi", "1,200 green bins added", "NGO partnership: CleanDelhi", "Citizen verifications: 9,410"],
  },
];

function HeroCarousel({ onImpact }: { onImpact: (idx: number) => void }) {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 4000);
    return () => clearInterval(t);
  }, []);
  const s = heroSlides[slide];
  return (
    <section className="hero-carousel" style={{ background: s.bg, transition: "background .6s" }}>
      <div className="hc-copy">
        <span className="eyebrow" style={{ color: s.accent, opacity: .9 }}>{s.eyebrow}</span>
        <h1 style={{ whiteSpace: "pre-line", fontSize: 23, marginTop: 6 }}>{s.headline}</h1>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 10px", lineHeight: 1.5 }}>{s.sub}</p>
        <div style={{ marginBottom: 10 }}>
          <b style={{ color: s.accent, fontSize: 14 }}>{s.stat}</b>
          <span style={{ fontSize: 10, color: "#cbd5e1" }}> · {s.statSub}</span>
        </div>
        <button className="hc-impact-btn" style={{ borderColor: s.accent, color: s.accent }}
          onClick={() => onImpact(slide)}>
          See the Impact →
        </button>
      </div>
      <div className="hc-art">
        <div className="hc-glow" style={{ background: s.accent + "18" }} />
        <div className="hc-building b1" />
        <div className="hc-building b2" />
        <div className="hc-building b3" />
        <span className="hc-bike">⌁</span>
      </div>
      <div className="hc-dots">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            style={{ width: i === slide ? 20 : 6, height: 6, borderRadius: 3, background: i === slide ? s.accent : "#94a3b8", border: "none", transition: "all .3s" }} />
        ))}
      </div>
    </section>
  );
}

function ImpactModal({ idx, close }: { idx: number; close: () => void }) {
  const s = heroSlides[idx];
  return (
    <div className="modal-backdrop" onClick={close}>
      <section className="dark-sheet" onClick={e => e.stopPropagation()}>
        <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={close}>×</button>
        <div className="sheet-handle" style={{ background: "#94a3b8" }} />
        <span className="eyebrow" style={{ color: s.accent }}>{s.eyebrow}</span>
        <h2 style={{ margin: "6px 0 16px", color: "#f1f5f9", fontSize: 17 }}>{s.headline.replace("\n", " ")} — Impact</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {s.impactStats.map((stat, i) => (
            <div key={i} style={{ background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "12px 10px" }}>
              <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5, margin: 0 }}>{stat}</p>
            </div>
          ))}
        </div>
        <div className="ba-row">
          <div className="ba-panel-dark"><span>Before</span></div>
          <span style={{ color: "#FFC107" }}>→</span>
          <div className="ba-panel-dark ba-after-dark"><span>After</span></div>
        </div>
        <button className="amber-btn" style={{ marginTop: 14 }} onClick={close}>Got it!</button>
      </section>
    </div>
  );
}

/* ─── Dark Delhi Map ─── */
const mapPins = [
  { id: "p1", icon: "◒", color: "#FFC107", x: 18, y: 38, pulse: true, cat: "Pothole" },
  { id: "p2", icon: "≋", color: "#f87171", x: 54, y: 55, pulse: true, cat: "Water leak" },
  { id: "p3", icon: "⚡", color: "#FFC107", x: 72, y: 25, pulse: false, cat: "Electric" },
  { id: "p4", icon: "♜", color: "#4ade80", x: 38, y: 72, pulse: false, cat: "Garbage" },
  { id: "p5", icon: "◑", color: "#60a5fa", x: 80, y: 60, pulse: true, cat: "Streetlight" },
  { id: "p6", icon: "⌁", color: "#FFC107", x: 28, y: 20, pulse: false, cat: "Road crack" },
  { id: "p7", icon: "⬡", color: "#4ade80", x: 62, y: 78, pulse: false, cat: "Park" },
  { id: "p8", icon: "⊘", color: "#f87171", x: 10, y: 65, pulse: true, cat: "Sewage" },
];

function DarkCityMap({ height = 240 }: { height?: number }) {
  const [activePin, setActivePin] = useState<string | null>(null);
  return (
    <div className="dark-city-map" style={{ height }}>
      <div className="dcm-grid" />
      <div className="dcm-road r1" /><div className="dcm-road r2" /><div className="dcm-road r3" />
      <div className="dcm-block bl1" /><div className="dcm-block bl2" /><div className="dcm-block bl3" /><div className="dcm-block bl4" /><div className="dcm-block bl5" />
      <div className="dcm-landmark">🏛 <span>Rajpath</span></div>
      <div className="dcm-scan" />
      {mapPins.map(pin => (
        <div key={pin.id} className={`dcm-pin ${pin.pulse ? "dcm-pin-pulse" : ""}`}
          style={{ left: `${pin.x}%`, top: `${pin.y}%`, color: pin.color }}
          onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}>
          {pin.pulse && <span className="dcm-ring" style={{ borderColor: pin.color }} />}
          <span className="dcm-pin-icon">{pin.icon}</span>
          {activePin === pin.id && (
            <div className="dcm-popup">
              <strong>{pin.cat}</strong><small>Ward 23 · Active</small>
            </div>
          )}
        </div>
      ))}
      <div className="dcm-live-badge"><span className="live-dot" />LIVE</div>
      <div className="dcm-you"><div className="dcm-you-ring" /><div className="dcm-you-dot" /><span>YOU</span></div>
      <div className="dcm-legend">
        <span><i className="sev-dot" style={{ background: "#f87171" }} />Critical</span>
        <span><i className="sev-dot" style={{ background: "#FFC107" }} />Pending</span>
        <span><i className="sev-dot" style={{ background: "#4ade80" }} />Resolved</span>
      </div>
    </div>
  );
}

/* ─── City Status Card ─── */
function CityStatusScreen({ close }: { close: () => void }) {
    const [cityReports, setCityReports] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/complaints`)
      .then((response) => response.json())
      .then((data) => {
        setCityReports(data);
      })
      .catch((error) => {
        console.error("Error loading city status:", error);
      });
  }, []);
  return (
    <div className="modal-backdrop" onClick={close}>
      <section className="dark-sheet" style={{ maxHeight: "92vh", paddingBottom: 24 }} onClick={e => e.stopPropagation()}>
        <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={close}>×</button>
        <div className="sheet-handle" style={{ background: "#94a3b8" }} />
        <span className="eyebrow" style={{ color: "#4ade80" }}>CITY STATUS · OCT 2026</span>
        <h2 style={{ margin: "6px 0 8px", color: "#FFC107", fontSize: 17 }}>Delhi South Analytics</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
  {
    label: "Total Reported",
    value: cityReports.length.toString(),
    color: "#60a5fa",
  },
  {
    label: "Resolved Today",
    value: cityReports
      .filter((r) => r.status === "Resolved")
      .length
      .toString(),
    color: "#4ade80",
  },
  {
    label: "Pending Action",
    value: cityReports
      .filter((r) => r.status !== "Resolved")
      .length
      .toString(),
    color: "#FFC107",
  },
  {
    label: "Resolution Rate",
    value:
      cityReports.length > 0
        ? `${Math.round(
            (cityReports.filter((r) => r.status === "Resolved").length /
              cityReports.length) *
              100
          )}%`
        : "0%",
    color: "#a78bfa",
  },
].map((s, i) => (
            <div key={i} style={{ background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "12px 14px" }}>
              <b style={{ color: s.color, fontSize: 20, display: "block" }}>{s.value}</b>
              <span style={{ fontSize: 10, color: "#cbd5e1" }}>{s.label}</span>
            </div>
          ))}
        </div>
        <b style={{ fontSize: 13, color: "#f1f5f9", display: "block", marginBottom: 10 }}>
  Domain Breakdown
</b>

{[
  { label: "Garbage", color: "#4ade80" },
  { label: "Roads", color: "#FFC107" },
  { label: "Streetlights", color: "#60a5fa" },
  { label: "Sewage", color: "#f87171" },
  { label: "Water", color: "#38bdf8" },
].map((b, i) => {
  const count = cityReports.filter((r) => r.category === b.label).length;
  const pct =
    cityReports.length > 0
      ? Math.round((count / cityReports.length) * 100)
      : 0;

  return (
    <div key={i} style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          marginBottom: 3,
        }}
      >
        <span style={{ color: "#94a3b8" }}>{b.label}</span>
        <span style={{ color: "#cbd5e1" }}>{pct}%</span>
      </div>

      <div
        style={{
          height: 8,
          background: "#1C2128",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: b.color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
})}
        <b style={{ fontSize: 13, color: "#f1f5f9", display: "block", margin: "16px 0 10px" }}>Emergency &amp; Trending</b>
        {[
          { txt: "Major Water Pipeline Leakage — Sector 4", sev: "#f87171", id: "CZ-2026-9901" },
          { txt: "Power Grid Failure — Hauz Khas substation", sev: "#FFC107", id: "CZ-2026-9802" },
          { txt: "Flooded underpass — Moti Bagh", sev: "#f87171", id: "CZ-2026-9788" },
        ].map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#1C2128", border: `1px solid ${h.sev}44`, borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: h.sev, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 12, color: "#f1f5f9", lineHeight: 1.4 }}>{h.txt}</span>
            <button style={{ background: "#FFC10720", color: "#FFC107", border: "1px solid #FFC10740", borderRadius: 8, padding: "4px 10px", fontSize: 10, cursor: "pointer", fontWeight: 700 }}>Track</button>
          </div>
        ))}
        <b style={{ fontSize: 13, color: "#f1f5f9", display: "block", margin: "12px 0 8px" }}>Upcoming Campaigns</b>
        {[
          { name: "Yamuna Riverbank Cleanup", date: "Sun, Oct 20 · 7 AM", loc: "Vasant Vihar Ghat" },
          { name: "Tree Plantation Drive", date: "Sat, Oct 26 · 8 AM", loc: "Sarojini Nagar Park" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#063B2820", border: "1px solid #4ade8040", borderRadius: 10, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <b style={{ fontSize: 12, color: "#4ade80" }}>{c.name}</b>
              <p style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>{c.date} · {c.loc}</p>
            </div>
            <button style={{ background: "#063B28", color: "#4ade80", border: "1px solid #4ade8040", borderRadius: 8, padding: "6px 12px", fontSize: 11, cursor: "pointer" }}>Join</button>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ─── Duplicate Detection ─── */
const nearbyDuplicates: Record<string, { id: string; type: string; loc: string; ago: string; status: string; upvotes: number }> = {
  "Roads":       { id: "CZ-2026-8821", type: "Pothole", loc: "Vasant Vihar, Outer Ring Rd", ago: "2 hours ago", status: "Assigned to MCD Officer", upvotes: 43 },
  "Garbage":     { id: "CZ-2026-4312", type: "Garbage Pile", loc: "Vasant Kunj Market", ago: "4 hours ago", status: "Pending Pickup", upvotes: 27 },
  "Sanitation":  { id: "CZ-2026-6019", type: "Sewage Overflow", loc: "Lajpat Nagar, Lane 7", ago: "1 hour ago", status: "Under Review", upvotes: 61 },
  "Water":       { id: "CZ-2026-3374", type: "Water Leakage", loc: "Green Park Main Rd", ago: "3 hours ago", status: "Assigned to DJB", upvotes: 18 },
  "Electricity": { id: "CZ-2026-7701", type: "Power Outage", loc: "Hauz Khas Village Rd", ago: "5 hours ago", status: "Work in Progress", upvotes: 34 },
  "Streetlights":{ id: "CZ-2026-5540", type: "Streetlight Out", loc: "Safdarjung Enclave Block C", ago: "6 hours ago", status: "Assigned to PWD", upvotes: 22 },
};

function DuplicateCard({ domain, onUpvote, onContinue }: { domain: string; onUpvote: () => void; onContinue: () => void }) {
  const dup = nearbyDuplicates[domain];
  if (!dup) return null;
  return (
    <div className="dup-overlay">
      <div className="dup-card dk-dup-card">
        <div className="dup-handle" />
        <div className="dup-header">
          <div className="dup-radar-icon"><div className="dup-radar-ring" /><div className="dup-radar-ring r2" /><span>📍</span></div>
          <div>
            <span style={{ fontSize: 8, color: "#94a3b8", fontFamily: "DM Mono", letterSpacing: ".08em", display: "block" }}>PROXIMITY MATCH</span>
            <h2 style={{ fontSize: 15, color: "#1f2937", marginTop: 2 }}>Issue Already Flagged Nearby!</h2>
          </div>
        </div>
        <div className="dup-report-preview dk-dup-preview">
          <div className="dup-photo" style={{ background: "#FFC10720" }}>
            <span style={{ fontSize: 26 }}>🛣</span>
            <span className="dup-photo-label" style={{ color: "#64748b" }}>First photo</span>
          </div>
          <div className="dup-report-meta">
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <span className="dup-id" style={{ background: "#1C2128", color: "#60a5fa" }}>#{dup.id}</span>
              <span className="dup-upvotes" style={{ marginLeft: "auto", color: "#4ade80" }}>▲ {dup.upvotes}</span>
            </div>
            <b style={{ fontSize: 13, color: "#f1f5f9", display: "block", marginBottom: 3 }}>{dup.type}</b>
            <p style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 5 }}>📍 {dup.loc}</p>
            <div style={{ display: "flex", gap: 6 }}>
              <span className="dup-badge" style={{ background: "#1C2128", color: "#94a3b8" }}>🕐 {dup.ago}</span>
              <span className="dup-badge" style={{ background: "#1e3a5f", color: "#60a5fa" }}>{dup.status}</span>
            </div>
          </div>
        </div>
        <button className="dup-upvote-btn" style={{ background: "linear-gradient(135deg,#063B28,#0d5c3f)" }} onClick={onUpvote}>
          <div className="dup-upvote-left">
            <div className="dup-upvote-icon" style={{ background: "rgba(255,255,255,.1)" }}>▲</div>
            <div>
              <b>I'm Affected Too! Upvote</b>
              <small style={{ color: "rgba(255,255,255,.85)" }}>Boosts priority · Earns +2 Civic Points</small>
            </div>
          </div>
          <div className="dup-pts-chip" style={{ background: "#FFC107", color: "#0f1117" }}>+2 pts</div>
        </button>
        <button className="dup-continue-btn" style={{ color: "#475569" }} onClick={onContinue}>
          No, my issue is different — Continue Reporting →
        </button>
      </div>
    </div>
  );
}

/* ─── Report Modal ─── */
function ReportModal({ open, close }: { open: boolean; close: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({ pts: 5, label: "Civic Points earned!" });
  const [reportType, setReportType] = useState<"normal" | "emergency" | null>(null);
  const [domain, setDomain] = useState("Roads");
  const [note, setNote] = useState("");
  const [locationSet, setLocationSet] = useState(false);
  const [userLocation, setUserLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);
  const [dupDetected, setDupDetected] = useState(false);
  const [dupUpvoted, setDupUpvoted] = useState(false);
  const [bypassDup, setBypassDup] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  async function handleSetLocation() {
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }
    );

    console.log("GPS Location:", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    setUserLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    setLocationSet(true);
  } catch (error) {
    console.error("GPS error:", error);
    alert("Please allow location access for CityZen.");
  }
}

  function handleDomainChange(d: string) {
  setDomain(d);
  setDupDetected(false);
}

  function handleUpvoteDup() {
    setDupDetected(false); setDupUpvoted(true);
    setToastMsg({ pts: 2, label: "Priority Boosted! +2 Civic Points" });
    setToast(true);
    setTimeout(() => { setToast(false); close(); }, 2200);
  }

async function submit() {
  try {
    const position = await new Promise<GeolocationPosition>(
  (resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }
);

const latitude = position.coords.latitude;
const longitude = position.coords.longitude;
const formData = new FormData();

formData.append("category", domain);
formData.append("description", note);
formData.append("location", "Delhi");
formData.append("latitude", String(latitude));
formData.append("longitude", String(longitude));

if (photo) {
  formData.append("photo", photo);
}

const response = await fetch(`${API_BASE_URL}/complaints`, {
  method: "POST",
  body: formData,
});

    const data = await response.json();
    localStorage.setItem("cityzen_badge_first_report", "true");

if (photo) {
  localStorage.setItem("cityzen_badge_photo", "true");
}
    const currentPoints = Number(
  localStorage.getItem("cityzen_civic_points") || "1450"
);

const pointsEarned = photo ? 30 : 20;

localStorage.setItem(
  "cityzen_civic_points",
  String(currentPoints + pointsEarned)
);

window.dispatchEvent(new Event("civicPointsUpdated"));

    setComplaintId(data.complaint_id);
    setSubmitted(true);

    setToastMsg({
  pts: pointsEarned,
  label: photo
    ? "30 Civic Points earned! +10 for photo evidence."
    : "20 Civic Points earned!",
});

    setToast(true);

    setTimeout(() => setToast(false), 2500);

  } catch (error) {
    console.error("Error submitting complaint:", error);

    setToastMsg({
      pts: 0,
      label: "Please allow location access and try again.",
    });
  }
}

  function reset() {
    setSubmitted(false); setReportType(null); setDomain("Roads");
    setNote(""); setLocationSet(false); setDupDetected(false); setDupUpvoted(false); setBypassDup(false);
    close();
  }

  const authority = domainAuthority[domain] ?? domainAuthority["Other"];

  return (
    <Modal open={open} close={reset}>
      <CivicToast pts={toastMsg.pts} visible={toast} label={toastMsg.label} />
      {dupUpvoted ? (
        <div className="dk-success-state">
          <div style={{ fontSize: 36 }}>🎯</div>
          <span style={{ fontSize: 9, color: "#4ade80", fontFamily: "DM Mono", letterSpacing: ".1em" }}>PRIORITY BOOSTED</span>
          <h2 style={{ color: "#f1f5f9", margin: "8px 0 6px", fontSize: 17 }}>Your voice counts!</h2>
          <div className="dk-reward-box"><div style={{ fontSize: 28, color: "#FFC107" }}>✦ +2</div><b style={{ color: "#4ade80" }}>Civic Points awarded</b><p>Complaint priority boosted. Authority notified.</p></div>
          <p style={{ fontSize: 11, color: "#cbd5e1" }}>Returning to Home…</p>
        </div>
      ) : submitted ? (
        <div className="dk-success-state">
          <div className="dk-success-badge">✓</div>
          <span style={{ fontSize: 9, color: "#4ade80", fontFamily: "DM Mono", letterSpacing: ".1em" }}>COMPLAINT REGISTERED SUCCESSFULLY!</span>
          <div className="dk-confirm-card">
            <div className="dk-confirm-row">
              <span>Ticket ID</span>
              <b style={{ fontFamily: "DM Mono", color: "#FFC107" }}>{complaintId}</b>
            </div>
            <div className="dk-confirm-row">
              <span>Category</span>
              <b>{domain}</b>
            </div>
            <div className="dk-confirm-row">
              <span>Location</span>
              <b>Vasant Vihar, Delhi</b>
            </div>
            <div className="dk-confirm-row">
              <span>Citizen Verifications</span>
              <b>0/3</b>
            </div>
            <div className="dk-confirm-row">
              <span>Status</span>
              <b style={{ color: "#FFC107" }}>Submitted</b>
            </div>
          </div>
          <div className="dk-authority-tag">
            <span style={{ fontSize: 10, color: "#4ade80" }}>Tagged Authority</span>
            <b style={{ color: "#f1f5f9" }}>{authority.name}</b>
            <small style={{ color: "#cbd5e1" }}>{authority.id} · {authority.dept}</small>
          </div>
          <div className="dk-pts-note">✦ <b>5 pts</b> credited. <b>15 more</b> after citizen verification.</div>
          <div style={{ display: "flex", gap: 8, width: "100%", marginTop: 12 }}>
            <button className="amber-btn" style={{ flex: 1 }} onClick={reset}>Back to Home</button>
            <button className="dk-outline-btn" style={{ flex: 1 }} onClick={() => { setSubmitted(false); setReportType(null); setDomain("Roads"); setNote(""); setLocationSet(false); setBypassDup(false); }}>Report Another</button>
          </div>
        </div>
      ) : !reportType ? (
        <>
          <span className="eyebrow" style={{ color: "#4ade80" }}>NEW REPORT</span>
          <h2 style={{ margin: "6px 0 14px", color: "#1f2937" }}>What kind of issue?</h2>
          <div className="report-type-grid">
            <button className="dk-report-card" onClick={() => setReportType("normal")}>
              <span style={{ fontSize: 28 }}>📋</span>
              <b style={{ color: "#1f2937" }}>Normal Report</b>
              <small style={{ color: "#64748b" }}>Broken pavement, garbage, streetlight out</small>
              <span className="rtype-pts" style={{ background: "#063B28", color: "#4ade80" }}>+5 Civic Points</span>
            </button>
            <button className="dk-report-card dk-report-emerg" onClick={() => setReportType("emergency")}>
              <span style={{ fontSize: 28 }}>🚨</span>
              <b style={{ color: "#1f2937" }}>Emergency Report</b>
              <small style={{ color: "#64748b" }}>Fallen wire, pipeline burst, open manhole</small>
              <span className="rtype-pts" style={{ background: "#450a0a", color: "#f87171" }}>Fast-tracked · +5 pts</span>
            </button>
          </div>
        </>
      ) : (
        <div style={{ position: "relative" }}>
          <div className="dk-type-banner" style={{ borderColor: reportType === "emergency" ? "#f87171" : "#4ade80" }}>
            <span style={{ color: reportType === "emergency" ? "#f87171" : "#4ade80" }}>
              {reportType === "emergency" ? "🚨 EMERGENCY" : "📋 NORMAL REPORT"}
            </span>
            <button onClick={() => { setReportType(null); setDupDetected(false); setBypassDup(false); setLocationSet(false); }}
              style={{ background: "none", fontSize: 11, color: "#cbd5e1" }}>Change</button>
          </div>
          <div className="dk-upload-box">
            <div className="dk-cam-tabs">
              <button className="dk-cam-tab active">📸 Normal</button>
              <button className="dk-cam-tab">🎥 GPS-tagged</button>
            </div>
            <div className="dk-cam-preview">
              <span>📷</span><b style={{ color: "#f1f5f9" }}>Tap to capture</b>
              <small style={{ color: "#cbd5e1" }}>GPS timestamp will be added automatically</small>
            </div>
          </div>
          <div style={{ marginTop: 10, marginBottom: 8 }}>
            <label className="dk-label">Domain / Category</label>
            <select className="dk-field" value={domain} onChange={e => handleDomainChange(e.target.value)}>
              {Object.keys(domainAuthority).map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <button className="dk-loc-btn" onClick={handleSetLocation}
            style={{ background: locationSet ? "#063B2840" : undefined, borderColor: locationSet ? "#4ade80" : undefined }}>
            <span>📍</span>
            <span style={{ flex: 1, textAlign: "left", color: locationSet ? "#4ade80" : "#94a3b8" }}>
              {locationSet && userLocation
              ? `${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`
              : "Use Current Location"}
            </span>
            {locationSet && <span style={{ color: "#4ade80", fontSize: 11 }}>✓</span>}
          </button>
          {dupDetected && (
            <DuplicateCard domain={domain} onUpvote={handleUpvoteDup} onContinue={() => { setDupDetected(false); setBypassDup(true); }} />
          )}
          <textarea className="dk-field dk-textarea" placeholder="Describe the problem briefly…" value={note} onChange={e => setNote(e.target.value)} />
          <div style={{ marginBottom: 12 }}>
  <label
    style={{
      display: "block",
      marginBottom: 6,
      fontSize: 12,
      color: "#94a3b8",
    }}
  >
    📷 Add Photo (optional)
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: 10,
      border: "1px solid #94a3b8",
      background: "#111827",
      color: "#cbd5e1",
    }}
  />

  {photo && (
    <small style={{ color: "#4ade80", display: "block", marginTop: 6 }}>
      ✓ {photo.name}
    </small>
  )}
</div>
          <div className="dk-authority-tag" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: "#4ade80" }}>@ Auto-tagged Authority</span>
            <b style={{ color: "#f1f5f9" }}>{authority.name}</b>
            <small style={{ color: "#cbd5e1" }}>{authority.id} · {authority.dept}</small>
          </div>
          <button className="amber-btn" style={{ background: reportType === "emergency" ? "#b91c1c" : undefined }} onClick={submit}>
            Submit Report &amp; Earn 5 Civic Points
          </button>
        </div>
      )}
    </Modal>
  );
}

/* ─── Chat Interface ─── */
function ChatInterface({ authorityId, authorityName, onClose }: { authorityId: string; authorityName: string; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "authority", text: "Hello! How can I help with your complaint?", time: "2:10 PM" },
    { from: "citizen", text: "The pothole is still there after the marked resolution.", time: "2:14 PM" },
    { from: "authority", text: "A re-inspection is scheduled for tomorrow morning.", time: "2:16 PM" },
  ]);
  function send() {
    if (!msg.trim()) return;
    setMessages(m => [...m, { from: "citizen", text: msg, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }]);
    setMsg("");
  }
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="dark-sheet" style={{ maxHeight: "88vh", display: "flex", flexDirection: "column", padding: 0 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #1e293b", background: "#063B28", borderRadius: "20px 20px 0 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFC107", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#0f1117", fontWeight: 700 }}>{authorityName[0]}</div>
            <div><b style={{ color: "#f1f5f9", fontSize: 13 }}>{authorityName}</b><p style={{ color: "#4ade80", fontSize: 10, margin: 0 }}>{authorityId} · 🟢 Online</p></div>
            <button onClick={onClose} style={{ marginLeft: "auto", color: "#94a3b8", background: "none", fontSize: 18 }}>×</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, background: "#0f1117" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "citizen" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "78%", padding: "8px 12px", borderRadius: m.from === "citizen" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.from === "citizen" ? "#063B28" : "#1C2128", color: "#f1f5f9", fontSize: 12, lineHeight: 1.5, border: "1px solid #2d3748" }}>
                {m.text}<div style={{ fontSize: 9, marginTop: 4, opacity: .5, textAlign: "right" }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid #1e293b", display: "flex", gap: 8, background: "#16191E" }}>
          <input style={{ flex: 1, border: "1px solid #2d3748", borderRadius: 20, padding: "8px 14px", fontSize: 12, outline: "none", background: "#1C2128", color: "#f1f5f9" }} placeholder="Type a message…" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
          <button onClick={send} style={{ background: "#063B28", color: "#4ade80", border: "1px solid #4ade8040", borderRadius: 20, padding: "8px 16px", fontSize: 12, cursor: "pointer" }}>Send</button>
        </div>
      </section>
    </div>
  );
}

/* ─── Track Reports + Timeline ─── */
const myReports = [
  { id: "CZ-2026-0091", type: "Pothole", loc: "Outer Ring Rd, Vasant Vihar", status: "In Progress", date: "Oct 11", authId: "AUTH-DEL-012", authName: "Ravi Kumar" },
  { id: "CZ-2026-0048", type: "Garbage Pile", loc: "Safdarjung Enclave", status: "Resolved", date: "Oct 3", authId: "AUTH-DEL-008", authName: "Manoj Sharma" },
  { id: "CZ-2026-0031", type: "Broken Streetlight", loc: "Vasant Kunj, Sector C", status: "Pending", date: "Sep 28", authId: "AUTH-DEL-055", authName: "Deepak Yadav" },
  { id: "CZ-2026-0012", type: "Water Leakage", loc: "Green Park Main Rd", status: "Verified Closed", date: "Sep 15", authId: "AUTH-DEL-047", authName: "Anjali Mehta" },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  "Pending":        { bg: "#2d1f00", color: "#FFC107" },
  "In Progress":    { bg: "#1e3a5f", color: "#60a5fa" },
  "Resolved":       { bg: "#063B28", color: "#4ade80" },
  "Verified Closed":{ bg: "#063B28", color: "#4ade80" },
};

function TimelineDrawer({ rpt, onClose }: { rpt: typeof myReports[0]; onClose: () => void }) {
  const [feedback, setFeedback] = useState("");
  const [reopened, setReopened] = useState(false);
  const [accepted, setAccepted] = useState(false);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="dark-sheet" style={{ maxHeight: "92vh" }} onClick={e => e.stopPropagation()}>
        <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={onClose}>×</button>
        <div className="sheet-handle" style={{ background: "#94a3b8" }} />
        <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "#FFC107", letterSpacing: ".1em" }}>COMPLAINT TIMELINE</span>
        <h2 style={{ color: "#f1f5f9", margin: "4px 0 4px", fontSize: 16 }}>#{rpt.id}</h2>
        <p style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 18 }}>{rpt.type} · {rpt.loc}</p>

        {/* Step 1: Citizen Verification */}
        <div className="tl-step tl-done">
          <div className="tl-dot" style={{ background: "#4ade80" }}>✓</div>
          <div className="tl-body">
            <b style={{ color: "#4ade80" }}>Step 1 — Citizen Verification</b>
            <p style={{ color: "#94a3b8" }}>Verified by 3 citizens on the Upvote tab before routing to authority.</p>
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              {["Citizen #DEL-4091", "Citizen #DEL-8120", "Citizen #DEL-3049"].map(c => (
                <span key={c} style={{ background: "#1C2128", color: "#60a5fa", fontSize: 9, padding: "2px 8px", borderRadius: 10, border: "1px solid #1e40af" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Authority Verification */}
        <div className="tl-step tl-done">
          <div className="tl-dot" style={{ background: "#4ade80" }}>✓</div>
          <div className="tl-body">
            <b style={{ color: "#4ade80" }}>Step 2 — Authority Verification</b>
            <p style={{ color: "#94a3b8" }}>Verified by MCD Officer #{rpt.authId} on Oct 12 · 2:10 PM</p>
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ background: "#1C2128", color: "#FFC107", fontSize: 9, padding: "2px 8px", borderRadius: 10, border: "1px solid #FFC10740" }}>High Priority</span>
              <span style={{ background: "#1C2128", color: "#94a3b8", fontSize: 9, padding: "2px 8px", borderRadius: 10 }}>Action: Site repair scheduled</span>
            </div>
          </div>
        </div>

        {/* Step 3: Delay (conditional) */}
        {rpt.status === "Pending" && (
          <div className="tl-step">
            <div className="tl-dot" style={{ background: "#FFC107", color: "#0f1117" }}>!</div>
            <div className="tl-body">
              <b style={{ color: "#FFC107" }}>Step 3 — Delay Reason</b>
              <div style={{ background: "#2d1f0080", border: "1px solid #FFC10740", borderRadius: 10, padding: "10px 12px", marginTop: 6 }}>
                <p style={{ color: "#FFC107", fontSize: 11 }}>⚠ Delayed: Awaiting Inter-Departmental Approval / Contractor Allocation</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Resolution Upload */}
        {(rpt.status === "Resolved" || rpt.status === "Verified Closed") && (
          <div className="tl-step tl-done">
            <div className="tl-dot" style={{ background: "#4ade80" }}>✓</div>
            <div className="tl-body">
              <b style={{ color: "#4ade80" }}>Step 4 — Authority Resolution</b>
              <p style={{ color: "#94a3b8" }}>Completed: Oct 18 · 3:00 PM · Photo evidence uploaded.</p>
              <div className="tl-photo">📸 Resolution photo submitted by {rpt.authName}</div>
            </div>
          </div>
        )}

        {/* Step 5: Citizen Feedback */}
        {(rpt.status === "Resolved" || rpt.status === "In Progress") && !accepted && !reopened && (
          <div className="tl-step">
            <div className="tl-dot" style={{ background: "#94a3b8", color: "#94a3b8" }}>5</div>
            <div className="tl-body">
              <b style={{ color: "#f1f5f9" }}>Step 5 — Your Feedback</b>
              <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 10 }}>Is the problem actually resolved?</p>
              <button className="amber-btn" style={{ background: "#063B28", color: "#4ade80", border: "1px solid #4ade8040", marginBottom: 8 }}
                onClick={() => setAccepted(true)}>✓ Accept &amp; Confirm Resolution</button>
              <button className="dk-outline-btn" style={{ color: "#f87171", borderColor: "#f8717140" }}
                onClick={() => setReopened(true)}>✕ Resolution Unsatisfactory — Reopen</button>
            </div>
          </div>
        )}

        {reopened && (
          <div style={{ background: "#2d0f0f", border: "1px solid #f8717140", borderRadius: 12, padding: "12px 14px", marginTop: 10 }}>
            <b style={{ color: "#f87171", fontSize: 12 }}>Reopen Feedback</b>
            <textarea style={{ width: "100%", minHeight: 70, marginTop: 8, background: "#1C2128", border: "1px solid #2d3748", borderRadius: 10, color: "#f1f5f9", padding: 10, fontSize: 12, resize: "none" }}
              placeholder="Describe why the resolution is unsatisfactory…"
              value={feedback} onChange={e => setFeedback(e.target.value)} />
            <button className="dk-outline-btn" style={{ color: "#f87171", borderColor: "#f8717140", marginTop: 8 }} onClick={onClose}>Submit Re-inspection Request</button>
          </div>
        )}

        {accepted && (
          <div style={{ background: "#063B2840", border: "1px solid #4ade8040", borderRadius: 12, padding: "14px", textAlign: "center", marginTop: 10 }}>
            <div style={{ fontSize: 28 }}>✅</div>
            <b style={{ color: "#4ade80", display: "block" }}>Resolution Accepted</b>
            <p style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>Case officially closed. +15 Civic Points credited.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function TrackModal({ open, close }: { open: boolean; close: () => void }) {
  const [chatRpt, setChatRpt] = useState<typeof myReports[0] | null>(null);
  const [timelineRpt, setTimelineRpt] = useState<typeof myReports[0] | null>(null);

  const [searchId, setSearchId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState<any>(null);
  const [trackError, setTrackError] = useState("");
  const [backendReports, setBackendReports] = useState<any[]>([]);

useEffect(() => {
  if (!open) return;

  fetch(`${API_BASE_URL}/complaints`)
    .then((response) => response.json())
    .then((data) => {
      setBackendReports(
  data.map((r: any) => ({
    id: r.complaint_id,
    type: r.category,
    loc: r.location,
    status: r.status,
    description: r.description,
  }))
);
    })
    .catch((error) => {
      console.error("Error loading reports:", error);
    });
}, [open]);

  async function trackComplaint() {
    setTrackError("");
    setTrackedComplaint(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/complaints/${searchId}`
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setTrackError("Complaint not found.");
        return;
      }

      setTrackedComplaint(data);
    } catch (error) {
      console.error("Error tracking complaint:", error);
      setTrackError("Could not connect to CityZen backend.");
    }
  }

  return (
    <>
      <Modal open={open && !chatRpt && !timelineRpt} close={close}>
        <span className="eyebrow" style={{ color: "#FFC107" }}>
          TRACK COMPLAINT
        </span>

        <h2 style={{ color: "#1f2937", fontSize: 18, margin: "6px 0 14px" }}>
          Track Your Complaint
        </h2>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            className="dk-field"
            placeholder="Enter Complaint ID"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
          />

          <button
            className="amber-btn"
            onClick={trackComplaint}
            style={{ whiteSpace: "nowrap" }}
          >
            Track
          </button>
        </div>

        {trackError && (
          <p style={{ color: "#f87171", fontSize: 12 }}>
            {trackError}
          </p>
        )}

        {trackedComplaint && (
          <div
            style={{
              background: "#1C2128",
              border: "1px solid #2d3748",
              borderRadius: 12,
              padding: "14px",
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "DM Mono",
                  fontSize: 10,
                  color: "#60a5fa",
                  background: "#1e3a5f",
                  padding: "3px 7px",
                  borderRadius: 4,
                }}
              >
                {trackedComplaint.complaint_id}
              </span>
            </div>

            <b style={{ fontSize: 14, color: "#1f2937" }}>
              {trackedComplaint.category}
            </b>

            <p style={{ fontSize: 12, color: "#475569" }}>
              {trackedComplaint.description}
            </p>

            <p style={{ fontSize: 11, color: "#cbd5e1" }}>
              📍 {trackedComplaint.location}
            </p>

            <div
              style={{
                display: "inline-block",
                background: "#063B28",
                color: "#4ade80",
                padding: "4px 9px",
                borderRadius: 10,
                fontSize: 10,
              }}
            >
              {trackedComplaint.status}
            </div>
            {trackedComplaint.resolution_description && (
  <div
    style={{
      marginTop: 16,
      padding: 14,
      borderRadius: 12,
      background: "#111827",
      border: "1px solid #2d3748",
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#4ade80",
        marginBottom: 8,
      }}
    >
      ✓ Resolution Submitted
    </div>

    <div
      style={{
        fontSize: 12,
        color: "#cbd5e1",
        marginBottom: 12,
      }}
    >
      {trackedComplaint.resolution_description}
    </div>

    {trackedComplaint.resolution_photo && (
      <div>
        <div
          style={{
            fontSize: 12,
            color: "#94a3b8",
            marginBottom: 8,
          }}
        >
          📷 Resolution photo
        </div>

        <img
          src={`http://127.0.0.1:8000/uploads/${trackedComplaint.resolution_photo}`}
          alt="Resolution evidence"
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 12,
            display: "block",
          }}
        />
      </div>
    )}
  </div>
)}
          </div>
        )}

        {!trackedComplaint && !trackError && (
          <>
            {backendReports.map(r => {
              const sc = statusColors[r.status] ?? {
                bg: "#1C2128",
                color: "#94a3b8",
              };

              return (
                <div
                  key={r.id}
                  style={{
                    background: "#1C2128",
                    border: "1px solid #2d3748",
                    borderRadius: 12,
                    padding: "12px 14px",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "DM Mono",
                        fontSize: 10,
                        color: "#60a5fa",
                        background: "#1e3a5f",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      {r.id}
                    </span>

                    <span
                      style={{
                        background: sc.bg,
                        color: sc.color,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 10,
                        marginLeft: "auto",
                        border: `1px solid ${sc.color}40`,
                      }}
                    >
                      {r.status}
                    </span>
                  </div>

                  <b style={{ fontSize: 13, color: "#f1f5f9" }}>
                    {r.type}
                  </b>

                  <p style={{ fontSize: 11, color: "#cbd5e1", margin: "2px 0 10px" }}>
                    📍 {r.loc} · {r.date}
                  </p>
                </div>
              );
            })}
          </>
        )}
      </Modal>

      {chatRpt && (
        <ChatInterface
          authorityId={chatRpt.authId}
          authorityName={chatRpt.authName}
          onClose={() => setChatRpt(null)}
        />
      )}

      {timelineRpt && (
        <TimelineDrawer
          rpt={timelineRpt}
          onClose={() => setTimelineRpt(null)}
        />
      )}
    </>
  );
}
/* ─── Resolution Verify Modal ─── */
function ResolutionVerifyModal({
  open,
  close,
  reportIndex,
  onNext,
}: {
  open: boolean;
  close: () => void;
  reportIndex: number;
  onNext: () => void;
}) {
  const [verifyReports, setVerifyReports] = useState<any[]>([]);

  const currentReport =
  verifyReports.length > 0
    ? verifyReports[reportIndex % verifyReports.length]
    : null;
  const [step, setStep] = useState<"verify" | "challenge" | "done" | "reopened">("verify");
  const [reason, setReason] = useState("");
  const [challengePhoto, setChallengePhoto] = useState<File | null>(null);
  

useEffect(() => {
  if (!open) return;

  fetch(`${API_BASE_URL}/complaints`)
    .then((response) => response.json())
    .then((data) => {
      const reports = data
        .filter(
  (r: any) =>
    r.status === "Resolution Submitted" ||
    r.status === "Resolved"
)
        .map((r: any) => ({
  id: r.complaint_id,
  type: r.category,
  location: r.location,
  completed:
    r.resolution_description || "Resolution evidence submitted",
  complaint_photo: r.complaint_photo,
  resolution_photo: r.resolution_photo,
}));

      setVerifyReports(reports);
    })
    .catch((error) => {
      console.error("Error loading verification reports:", error);
    });
}, [open]);
  function handleDone() {
  setStep("verify");
  close();
  onNext();
}
async function handleChallengeSubmit() {
  if (!currentReport) return;

  try {
    const formData = new FormData();

    formData.append("reason", reason);

if (challengePhoto) {
  formData.append("photo", challengePhoto);
}

    const response = await fetch(
      `${API_BASE_URL}/complaints/${currentReport.id}/challenge`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
  throw new Error(data.error || "Failed to submit challenge");
}

const currentPoints = Number(
  localStorage.getItem("cityzen_civic_points") || "1450"
);

localStorage.setItem(
  "cityzen_civic_points",
  String(currentPoints + 15)
);

window.dispatchEvent(new Event("civicPointsUpdated"));
localStorage.setItem("cityzen_badge_challenge", "true");

alert("Challenge submitted successfully");
setStep("reopened");
  } catch (error) {
    console.error("Challenge submission error:", error);
    alert("Failed to submit challenge");
  }
}
if (!currentReport) {
  return (
    <Modal open={open} close={close}>
      <div style={{ padding: 24, textAlign: "center" }}>
        <h2 style={{ color: "#f1f5f9" }}>
          No resolutions waiting for verification
        </h2>

        <p style={{ color: "#cbd5e1", fontSize: 12 }}>
          There are currently no submitted resolutions to verify.
        </p>

        <button
          className="dk-outline-btn"
          onClick={close}
          style={{ marginTop: 12 }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}  
return (
    <Modal open={open} close={close}>
      {step === "verify" && (
        <>
          <span className="eyebrow" style={{ color: "#FFC107" }}>RESOLUTION CHECK · {currentReport.id}</span>
          <h2 style={{ color: "#1f2937", fontSize: 18, margin: "6px 0 4px" }}>Is this actually fixed?</h2>
          <p style={{ fontSize: 11, color: "#64748b", marginBottom: 14 }}><p>
  {currentReport.type} — {currentReport.location} · Evidence submitted {currentReport.completed}
</p></p>
          <div className="ba-row" style={{ marginBottom: 14, alignItems: "center" }}>

  <div className="ba-panel-dark" style={{ overflow: "hidden", padding: 0 }}>
    {currentReport.complaint_photo ? (
      <img
        src={`${API_BASE_URL}/uploads/${currentReport.complaint_photo}`}
        alt="Before resolution"
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          display: "block",
        }}
      />
    ) : (
      <span>Before photo unavailable</span>
    )}
    <span style={{ display: "block", padding: "6px" }}>Before</span>
  </div>

  <span style={{ color: "#FFC107", fontSize: 20 }}>→</span>

  <div className="ba-panel-dark ba-after-dark" style={{ overflow: "hidden", padding: 0 }}>
    {currentReport.resolution_photo ? (
      <img
        src={`${API_BASE_URL}/uploads/${currentReport.resolution_photo}`}
        alt="After resolution"
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          display: "block",
        }}
      />
    ) : (
      <span>After photo unavailable</span>
    )}
    <span style={{ display: "block", padding: "6px" }}>After</span>
  </div>

</div>
          <div style={{ background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <div
  style={{
    display: "flex",
    gap: 8,
    padding: "4px 0",
    fontSize: 11,
    color: "#94a3b8",
  }}
>
  <span>🛠️</span>
  <span>{currentReport.completed}</span>
</div>
            
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
  className="amber-btn"
  style={{
    flex: 1,
    background: "#063B28",
    color: "#4ade80",
    border: "1px solid #4ade8040",
  }}
  onClick={() => {
    const currentPoints = Number(
      localStorage.getItem("cityzen_civic_points") || "1450"
    );

    localStorage.setItem(
      "cityzen_civic_points",
      String(currentPoints + 15)
    );

    window.dispatchEvent(new Event("civicPointsUpdated"));

    localStorage.setItem("cityzen_badge_verify", "true");
    setStep("done");
  }}
>
  ✓ Verify
</button>
            <button className="dk-outline-btn" style={{ flex: 1, color: "#f87171", borderColor: "#f8717140" }} onClick={() => setStep("challenge")}>✕ Challenge</button>
          </div>
        </>
      )}
      {step === "challenge" && (
        <>
          <span className="eyebrow" style={{ color: "#f87171" }}>CHALLENGE</span>
          <h2 style={{ color: "#f1f5f9", fontSize: 18, margin: "6px 0 14px" }}>Why challenging?</h2>
          {["Problem still exists", "Only partially fixed", "Evidence doesn't match", "Problem has returned", "Other"].map(r => (
            <button key={r} className={`dk-reason-opt ${reason === r ? "selected" : ""}`} onClick={() => setReason(r)}>
              <span>{reason === r ? "●" : "○"}</span>{r}
            </button>
          ))}
          <label
  htmlFor="challenge-photo"
  style={{
    display: "block",
    marginTop: 10,
    padding: 12,
    border: "1px dashed #666",
    borderRadius: 8,
    cursor: "pointer",
  }}
>
  📷 Add photo evidence (optional)
</label>

<input
  type="file"
  id="challenge-photo"
  accept="image/*"
  style={{ display: "none" }}
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setChallengePhoto(file);
  }}
/>
          <button className="amber-btn" style={{ marginTop: 14, background: "#7f1d1d", color: "#fca5a5" }} onClick={handleChallengeSubmit}>Submit Challenge</button>
          <button style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: 12, marginTop: 8, cursor: "pointer" }} onClick={() => setStep("verify")}>← Back</button>
        </>
      )}
      {step === "done" && (
        <div className="dk-success-state">
          <div className="dk-success-badge" style={{ background: "#063B28" }}>✓</div>
          <span style={{ fontSize: 9, color: "#4ade80", fontFamily: "DM Mono" }}>RESOLUTION VERIFIED</span>
          <h2 style={{ color: "#f1f5f9", margin: "8px 0" }}>Thank you!</h2>
          <div style={{ background: "#063B2840", color: "#4ade80", fontFamily: "DM Mono", fontSize: 12, fontWeight: 700, padding: "8px 20px", borderRadius: 20, display: "inline-block", marginBottom: 14, border: "1px solid #4ade8040" }}>VERIFIED · CLOSED</div>
          <button className="amber-btn" style={{ background: "#063B28", color: "#4ade80", border: "1px solid #4ade8040" }} onClick={handleDone}>Done</button>
        </div>
      )}
      {step === "reopened" && (
        <div className="dk-success-state">
          <div style={{ fontSize: 32 }}>⚠️</div>
          <span style={{ fontSize: 9, color: "#f87171", fontFamily: "DM Mono" }}>COMPLAINT REOPENED</span>
          <h2 style={{ color: "#f1f5f9", margin: "8px 0" }}>Challenge submitted</h2>
          <div style={{ background: "#2d0f0f", color: "#f87171", fontFamily: "DM Mono", fontSize: 12, fontWeight: 700, padding: "8px 20px", borderRadius: 20, display: "inline-block", marginBottom: 12, border: "1px solid #f8717140" }}>REOPENED</div>
          <p style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 14 }}>The authority has been notified and will take further action.</p>
          <button className="amber-btn" style={{ background: "#7f1d1d", color: "#fca5a5" }} onClick={handleDone}>Done</button>
        </div>
      )}
    </Modal>
  );
}

/* ─── Home ─── */
function Home() {
  const navigate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyIndex, setVerifyIndex] = useState(0);
  const [cityOpen, setCityOpen] = useState(false);
  const [impactIdx, setImpactIdx] = useState<number | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <div className="screen dk-screen">
        <DarkTopBar onPtsClick={() => navigate("/app/profile")} onNotif={() => setNotifOpen(!notifOpen)} />
        {notifOpen && (
          <div className="topbar-notif dk-notif">
            <div className="mauth-notif-head" style={{ borderBottom: "1px solid #1e293b", paddingBottom: 8, marginBottom: 8 }}>
              <b style={{ color: "#f1f5f9" }}>Notifications</b>
              <button style={{ background: "none", color: "#cbd5e1" }} onClick={() => setNotifOpen(false)}>✕</button>
            </div>
            <div className="mauth-notif-row" style={{ color: "#4ade80" }}>✓ Report CZ-2026-0048 was verified</div>
            <div className="mauth-notif-row" style={{ color: "#94a3b8" }}>📍 Resolution submitted for CZ-2026-0031</div>
            <div className="mauth-notif-row" style={{ color: "#FFC107" }}>⚡ CZ-2026-0091 needs your verification</div>
          </div>
        )}
        <HeroCarousel onImpact={setImpactIdx} />

        {/* Amber Report CTA */}
        <button className="amber-report-cta" onClick={() => setReportOpen(true)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="arc-icon">📍</div>
            <div>
              <b style={{ fontSize: 15, display: "block" }}>Report a Problem</b>
              <small style={{ color: "rgba(0,0,0,.6)", fontSize: 11 }}>File a new civic complaint</small>
            </div>
          </div>
          <span style={{ fontSize: 22, opacity: .7 }}>›</span>
        </button>

        {/* Secondary CTA row */}
        <div className="dk-cta-row">
          <button className="dk-cta-card" onClick={() => setTrackerOpen(true)}>
            <span className="dk-cta-icon" style={{ background: "#1e3a5f", color: "#60a5fa" }}>⌁</span>
            <div>
              <b style={{ color: "#1f2937", display: "block" }}>Track Reports</b>
              <small style={{ color: "#64748b" }}>2 updates</small>
            </div>
          </button>
          <button
  className="dk-cta-card"
  onClick={() => {
    setVerifyIndex(0);
    setVerifyOpen(true);
  }}
>
            <span className="dk-cta-icon" style={{ background: "#063B28", color: "#4ade80" }}>✓</span>
            <div>
              <b style={{ color: "#1f2937", display: "block" }}>Verify Fix</b>
              <small style={{ color: "#64748b" }}>1 awaiting</small>
            </div>
          </button>
          <button className="dk-cta-card" onClick={() => setCityOpen(true)}>
            <span className="dk-cta-icon" style={{ background: "#2d1f00", color: "#FFC107" }}>◫</span>
            <div>
              <b style={{ color: "#1f2937", display: "block" }}>City Status</b>
              <small style={{ color: "#64748b" }}>Analytics</small>
            </div>
          </button>
        </div>

        {/* City Map */}
        <div style={{ margin: "18px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div>
              <span style={{ fontSize: 9, color: "#64748b", fontFamily: "DM Mono", letterSpacing: ".1em", display: "block" }}>LIVE · VASANT VIHAR</span>
              <h2 style={{ color: "#1f2937", fontSize: 15 }}>City Map</h2>
            </div>
            <span style={{ fontSize: 10, color: "#64748b" }}>Delhi · Ward 23</span>
          </div>
          <DelhiMap />
        </div>
      </div>

      <ReportModal open={reportOpen} close={() => setReportOpen(false)} />
      <TrackModal open={trackerOpen} close={() => setTrackerOpen(false)} />
      <ResolutionVerifyModal
  open={verifyOpen}
  close={() => setVerifyOpen(false)}
  reportIndex={verifyIndex}
  onNext={() => {
    setVerifyIndex((current) => current + 1);
    setVerifyOpen(true);
  }}
/>
 
      {cityOpen && <CityStatusScreen close={() => setCityOpen(false)} />}
      {impactIdx !== null && <ImpactModal idx={impactIdx} close={() => setImpactIdx(null)} />}
    </>
  );
}

/* ─── Social ─── */
const upvotePosts = [
  { id: "CZ-2026-9021", cid: "Citizen #DEL-94021", loc: "Connaught Place", dist: "3.4 km", ago: "1 hour ago", type: "Pothole", desc: "Large pothole near inner circle causing accidents daily. Three vehicles damaged this week.", upvotes: 142, icon: "🛣", isOwn: false },
  { id: "CZ-2026-8741", cid: "Citizen #DEL-31084", loc: "Paharganj", dist: "5.1 km", ago: "2 hours ago", type: "Water Leakage", desc: "Main pipe burst flooding entire lane. Pedestrians unable to cross.", upvotes: 98, icon: "🚰", isOwn: false },
  { id: "CZ-2026-9482", cid: "You (CTZ-9482)", loc: "Vasant Vihar", dist: "0.2 km", ago: "4 hours ago", type: "Garbage Pile", desc: "Garbage not collected for 5 days near the community park entrance.", upvotes: 34, icon: "🗑", isOwn: true },
  { id: "CZ-2026-8102", cid: "Citizen #DEL-6712", loc: "Lajpat Nagar", dist: "7.0 km", ago: "5 hours ago", type: "Broken Streetlight", desc: "Streetlight non-functional for 9 days. Accident risk after dark.", upvotes: 67, icon: "💡", isOwn: false },
  { id: "CZ-2026-7788", cid: "Citizen #DEL-2201", loc: "Hauz Khas", dist: "4.2 km", ago: "6 hours ago", type: "Sewage Overflow", desc: "Sewage spilling onto the road outside the metro exit.", upvotes: 210, icon: "⊘", isOwn: false },
];

const feedPosts = [
  { cid: "Citizen #DEL-31084", ago: "30 min ago", loc: "South Delhi", type: "Community Update", desc: "Ward 23 finally gets a new park renovation! Groundbreaking ceremony next Sunday.", icon: "🌳", likes: 284, dislikes: 3, comments: 41 },
  { cid: "Citizen #DEL-44012", ago: "1 hr ago", loc: "Central Delhi", type: "Civic Achievement", desc: "Connaught Place CP is now India's first fully LED-lit market zone. Delhi leads! #SmartDelhi", icon: "💡", likes: 612, dislikes: 8, comments: 94 },
  { cid: "Citizen #DEL-7102", ago: "2 hrs ago", loc: "North Delhi", type: "Alert", desc: "Waterlogging near Kashmiri Gate. Avoid this route during peak hours today.", icon: "⚠", likes: 143, dislikes: 20, comments: 38 },
];

function SocialTrackDrawer({ post, onClose }: { post: typeof upvotePosts[0]; onClose: () => void }) {
  const statusColor = post.upvotes > 100 ? "#f87171" : post.upvotes > 50 ? "#FFC107" : "#60a5fa";
  const statusLabel = post.upvotes > 100 ? "CRITICAL" : post.upvotes > 50 ? "HIGH PRIORITY" : "ACTIVE";
  const authId = "AUTH-DEL-034";
  const authName = "Priya Verma";
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="dark-sheet" style={{ maxHeight: "88vh" }} onClick={e => e.stopPropagation()}>
        <button className="sheet-close" style={{ color: "64748b" }} onClick={onClose}>×</button>
        <div className="sheet-handle" style={{ background: "#94a3b8" }} />

        {/* Issue header */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1C2128", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{post.icon}</div>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: "DM Mono", fontSize: 9, color: statusColor, letterSpacing: ".1em", display: "block", marginBottom: 2 }}>{statusLabel}</span>
            <b style={{ fontSize: 14, color: "#f1f5f9" }}>{post.type}</b>
            <p style={{ fontSize: 10, color: "#cbd5e1", marginTop: 1 }}>📍 {post.loc} · {post.ago}</p>
          </div>
          <div style={{ background: statusColor + "20", border: `1px solid ${statusColor}60`, borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
            <b style={{ color: statusColor, fontFamily: "DM Mono", fontSize: 14, display: "block" }}>▲{post.upvotes}</b>
            <span style={{ fontSize: 8, color: "#cbd5e1" }}>upvotes</span>
          </div>
        </div>

        {/* Citizen verifications */}
        <div style={{ background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <b style={{ fontSize: 12, color: "#f1f5f9" }}>Citizen Verifications</b>
            <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "#4ade80", fontWeight: 700 }}>3/3 ✓</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {["#DEL-4091", "#DEL-8120", "#DEL-3049"].map(c => (
              <div key={c} style={{ flex: 1, background: "#063B2840", border: "1px solid #4ade8030", borderRadius: 8, padding: "6px 4px", textAlign: "center" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#063B28", margin: "0 auto 4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#4ade80" }}>✓</div>
                <span style={{ fontSize: 8, color: "#94a3b8", fontFamily: "DM Mono" }}>{c}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 6, background: "#0f1117", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,#4ade80,#22c55e)", borderRadius: 3 }} />
          </div>
          <p style={{ fontSize: 10, color: "#4ade80", marginTop: 4 }}>✓ Minimum 3 citizen verifications met. Routed to authority.</p>
        </div>

        {/* Timeline steps */}
        {[
          { label: "Submitted by Citizen", sub: post.cid + " · " + post.ago, color: "#4ade80", done: true, icon: "📍" },
          { label: "Community Verified", sub: "3 citizens confirmed the issue", color: "#4ade80", done: true, icon: "✓" },
          { label: `Assigned to ${authName}`, sub: `${authId} · Priority: ${post.upvotes > 100 ? "High" : "Medium"}`, color: "#FFC107", done: true, icon: "🏛" },
          { label: "Site Inspection Scheduled", sub: post.upvotes > 100 ? "Inspection: Tomorrow 10 AM" : "Awaiting schedule confirmation", color: "#60a5fa", done: post.upvotes > 50, icon: "🔍" },
          { label: "Resolution & Closure", sub: "Pending citizen verification", color: "#94a3b8", done: false, icon: "🏁" },
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, position: "relative" }}>
            {i < 4 && <div style={{ position: "absolute", left: 14, top: 28, width: 2, height: "calc(100% + 2px)", background: step.done ? step.color + "40" : "#1e293b" }} />}
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: step.done ? step.color + "20" : "#1C2128", border: `1px solid ${step.done ? step.color : "#94a3b8"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, zIndex: 1 }}>{step.icon}</div>
            <div style={{ paddingTop: 4 }}>
              <b style={{ fontSize: 12, color: step.done ? "#f1f5f9" : "#94a3b8", display: "block" }}>{step.label}</b>
              <span style={{ fontSize: 10, color: "#cbd5e1" }}>{step.sub}</span>
            </div>
          </div>
        ))}

        {/* Delay note if pending */}
        {post.upvotes <= 50 && (
          <div style={{ background: "#2d1f0060", border: "1px solid #FFC10740", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <p style={{ fontSize: 11, color: "#FFC107" }}>⚠ Delay Note: Awaiting contractor allocation from PWD. Expected resolution in 3–5 working days.</p>
          </div>
        )}

        <button className="amber-btn" onClick={onClose}>Close</button>
      </section>
    </div>
  );
}

function Social() {
  const [tab, setTab] = useState<"upvote" | "feed">("upvote");
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>(Object.fromEntries(upvotePosts.map(p => [p.id, p.upvotes])));
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [disliked, setDisliked] = useState<Record<number, boolean>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [heartOpen, setHeartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [storyIdx, setStoryIdx] = useState<number | null>(null);
  const [trackingPost, setTrackingPost] = useState<typeof upvotePosts[0] | null>(null);

  function handleUpvote(id: string) {
    setUpvoteCounts(c => ({ ...c, [id]: c[id] + (upvoted[id] ? -1 : 1) }));
    setUpvoted(u => ({ ...u, [id]: !u[id] }));
  }

  const stories = [
    { label: "You", init: "+", bg: "#063B28", isYou: true },
    { label: "#DEL-8821", init: "◉", bg: "#1e3a5f" },
    { label: "#DEL-6340", init: "◉", bg: "#2d1f00" },
    { label: "#DEL-4912", init: "◉", bg: "#2d0838" },
    { label: "#DEL-2277", init: "◉", bg: "#1a1040" },
    { label: "#DEL-5503", init: "◉", bg: "#1a2d0a" },
  ];

  return (
    <div className="screen dk-screen" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div className="dk-social-head">
        <b>City<em style={{ color: "#FFC107", fontStyle: "normal" }}>Zen</em></b>
        <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
          <button className="dk-icon-btn" onClick={() => setShowCreate(true)}><span>＋</span></button>
          <button className="dk-icon-btn" style={{ position: "relative" }} onClick={() => setHeartOpen(!heartOpen)}>
            <span>♡</span><i className="dk-badge" />
          </button>
          <button className="dk-icon-btn" style={{ position: "relative" }} onClick={() => setNotifOpen(!notifOpen)}>
            <span>🔔</span><i className="dk-badge" />
          </button>
        </div>
      </div>

      {/* Activity dropdown */}
      {heartOpen && (
        <div className="dk-dropdown">
          <div className="dk-dropdown-head"><b>Activity</b><button onClick={() => setHeartOpen(false)}>✕</button></div>
          <div className="dk-dropdown-row">♡ Citizen #DEL-4912 upvoted your post</div>
          <div className="dk-dropdown-row">💬 Citizen #DEL-6340 commented on your post</div>
          <div className="dk-dropdown-row">♡ Citizen #DEL-8821 upvoted your comment</div>
        </div>
      )}
      {notifOpen && (
        <div className="dk-dropdown">
          <div className="dk-dropdown-head"><b>Notifications</b><button onClick={() => setNotifOpen(false)}>✕</button></div>
          <div className="dk-dropdown-row" style={{ color: "#4ade80" }}>✓ Your report CZ-2026-0048 was verified</div>
          <div className="dk-dropdown-row" style={{ color: "#FFC107" }}>⚡ CZ-2026-0091 needs your verification</div>
        </div>
      )}

      {/* Stories */}
      <div className="dk-stories">
        {stories.map((s, i) => (
          <div key={i} className="dk-story-item" onClick={() => s.isYou ? setShowCreate(true) : setStoryIdx(i)}>
            <div className="dk-story-avatar" style={{ background: s.bg, borderColor: s.isYou ? "#FFC107" : "#4ade80" }}>
              {s.isYou ? <span style={{ fontSize: 18, color: "#FFC107" }}>+</span> : <span style={{ fontSize: 10, color: "#4ade80" }}>◉</span>}
            </div>
            <span className="dk-story-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Dual Tab switcher */}
      <div className="dk-tab-bar">
        <button className={`dk-tab ${tab === "upvote" ? "dk-tab-active" : ""}`} onClick={() => setTab("upvote")}>▲ Upvote</button>
        <button className={`dk-tab ${tab === "feed" ? "dk-tab-active" : ""}`} onClick={() => setTab("feed")}>Feed</button>
      </div>

      {tab === "upvote" && (
        <>
          <div className="dk-info-banner">
            <span>📢</span>
            <p>Upvote reported issues in your locality so municipal authorities can prioritize and inspect them faster.</p>
          </div>
          {upvotePosts.map(p => (
            <article key={p.id} className="dk-post-card">
              <header className="dk-post-header">
                <div className="dk-post-avatar" style={{ background: p.isOwn ? "#2d1f00" : "#063B28" }}>
                  {p.isOwn ? "ME" : p.cid.slice(-2)}
                </div>
                <div>
                  <b style={{ fontSize: 12, color: p.isOwn ? "#b45309" : "#1f2937" }}>{p.cid}</b>
                  <small style={{ color: "#64748b" }}>{p.ago} · {p.dist} · {p.loc}</small>
                </div>
                <span className="dk-domain-tag">{p.icon} {p.type}</span>
              </header>
              <div className="dk-post-image">
                <div className="dk-issue-photo-placeholder">
                  <span style={{ fontSize: 32 }}>{p.icon}</span>
                  <span style={{ fontSize: 10, color: "#4ade80" }}>{p.type} · {p.loc}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", padding: "0 4px", margin: "8px 0 10px", lineHeight: 1.5 }}>{p.desc}</p>
              <div className="dk-upvote-actions">
                <button
                  className={`dk-upvote-action-btn ${upvoted[p.id] ? "dk-upvoted" : ""} ${p.isOwn ? "dk-own-disabled" : ""}`}
                  onClick={() => !p.isOwn && handleUpvote(p.id)}
                  title={p.isOwn ? "You cannot upvote your own report" : ""}>
                  ▲ Upvote ({upvoteCounts[p.id]})
                  {p.isOwn && <span className="dk-own-tag">Your post</span>}
                </button>
                <button className="dk-track-btn" onClick={() => setTrackingPost(p)}>
                  📍 Track Problem
                </button>
              </div>
            </article>
          ))}
        </>
      )}

      {tab === "feed" && (
        <>
          {feedPosts.map((p, i) => (
            <article key={i} className="dk-post-card">
              <header className="dk-post-header">
                <div className="dk-post-avatar" style={{ background: "#1e3a5f" }}>
                  {p.cid.slice(-2)}
                </div>
                <div>
                  <b style={{ fontSize: 12, color: "#f1f5f9" }}>{p.cid}</b>
                  <small style={{ color: "#cbd5e1" }}>{p.ago} · {p.loc}</small>
                </div>
                <span className="dk-domain-tag" style={{ background: "#1e3a5f20", color: "#60a5fa", borderColor: "#1e40af40" }}>{p.icon} {p.type}</span>
              </header>
              <div className="dk-post-image" style={{ background: "#1C2128" }}>
                <div className="dk-issue-photo-placeholder">
                  <span style={{ fontSize: 32 }}>{p.icon}</span>
                  <span style={{ fontSize: 10, color: "#60a5fa" }}>{p.type}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", padding: "0 4px", margin: "8px 0 10px", lineHeight: 1.5 }}>{p.desc}</p>
              <div className="dk-feed-actions">
                <button className={`dk-feed-act ${liked[i] ? "dk-liked" : ""}`} onClick={() => setLiked(l => ({ ...l, [i]: !l[i] }))}>
                  👍 {p.likes + (liked[i] ? 1 : 0)}
                </button>
                <button className={`dk-feed-act ${disliked[i] ? "dk-disliked" : ""}`} onClick={() => setDisliked(d => ({ ...d, [i]: !d[i] }))}>
                  👎 {p.dislikes + (disliked[i] ? 1 : 0)}
                </button>
                <button className="dk-feed-act">💬 {p.comments}</button>
              </div>
            </article>
          ))}
        </>
      )}

      {/* Story viewer placeholder */}
      {storyIdx !== null && (
        <div className="modal-backdrop" onClick={() => setStoryIdx(null)}>
          <div style={{ width: "100%", maxWidth: 470, height: "85vh", background: "#0f1117", borderRadius: "24px 24px 0 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#063B28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>◉</div>
            <b style={{ color: "#f1f5f9" }}>Story by {stories[storyIdx]?.label}</b>
            <p style={{ color: "#cbd5e1", fontSize: 12 }}>Story playback in production</p>
            <button className="amber-btn" onClick={() => setStoryIdx(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <section className="dark-sheet" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setShowCreate(false)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <span className="eyebrow" style={{ color: "#FFC107" }}>CREATE</span>
            <h2 style={{ color: "#f1f5f9", margin: "6px 0 16px" }}>What would you like to share?</h2>
            {[["📸", "Add Story", "Disappears in 24 hours"], ["🎬", "Upload Reel / Short Video", "Short civic video clip"], ["📋", "Create Post", "Regular civic post"]].map(([ic, t, d]) => (
              <button key={t} onClick={() => setShowCreate(false)}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
                <span style={{ fontSize: 22 }}>{ic}</span>
                <div style={{ textAlign: "left" }}><b style={{ color: "#f1f5f9", fontSize: 13, display: "block" }}>{t}</b><span style={{ fontSize: 11, color: "#cbd5e1" }}>{d}</span></div>
              </button>
            ))}
          </section>
        </div>
      )}

      {/* Floating + */}
      <button onClick={() => setShowCreate(true)} className="dk-fab">+</button>

      {/* Inline Track Problem timeline drawer */}
      {trackingPost && <SocialTrackDrawer post={trackingPost} onClose={() => setTrackingPost(null)} />}
    </div>
  );
}

/* ─── Volunteer ─── */
const volCategories = ["All Drives", "Web3 & SBT", "Cleanliness", "Environment", "Infrastructure", "Emergency"];

const sbtDrives = [
  { title: "Yamuna Riverbank Cleanup", organizer: "CleanDelhi NGO", date: "Sun, Oct 20 · 7 AM", loc: "Yamuna Ghats, Delhi", dist: "2.1 km", spots: "45/60", sbt: "Yamuna Sentinel 2026", network: "Polygon", xp: 250, icon: "🌊", bg: "#063B28" },
  { title: "CP Smart Lighting Campaign", organizer: "MCD Partner", date: "Sat, Oct 26 · 9 AM", loc: "Connaught Place Inner Circle", dist: "3.4 km", spots: "28/40", sbt: "Delhi Green Warrior Lvl 1", network: "Base", xp: 200, icon: "💡", bg: "#1e3a5f" },
  { title: "Tree Plantation Drive", organizer: "Green Delhi NGO", date: "Sun, Nov 3 · 8 AM", loc: "Sarojini Nagar Park", dist: "4.8 km", spots: "62/80", sbt: "Urban Forest Guardian", network: "Polygon", xp: 300, icon: "🌳", bg: "#063B28" },
  { title: "Waste Segregation Drive", organizer: "SwachhMission Ward 23", date: "Sat, Nov 9 · 7 AM", loc: "Vasant Kunj Market", dist: "0.6 km", spots: "19/30", sbt: "Waste Warrior Badge", network: "Polygon", xp: 180, icon: "♻", bg: "#2d1f00" },
];

function Volunteer() {
  const [activeCat, setActiveCat] = useState("All Drives");
  const [sbtModal, setSbtModal] = useState<typeof sbtDrives[0] | null>(null);
  const [mintedDrive, setMintedDrive] = useState<typeof sbtDrives[0] | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  useEffect(() => { const t = setInterval(() => setSlide(s => (s + 1) % sbtDrives.length), 4200); return () => clearInterval(t); }, []);

  const heroD = sbtDrives[slide];

  return (
    <>
      <div className="screen dk-screen" style={{ paddingBottom: 100 }}>
        {/* Top bar */}
        <div className="dark-topbar">
          <div className="dk-search">
            <span style={{ color: "#cbd5e1" }}>⌕</span>
            <input style={{ background: "transparent", border: "none", flex: 1, fontSize: 12, color: "#f1f5f9", outline: "none" }} placeholder="Search volunteer drives…" />
          </div>
          <button className="dk-icon-btn" style={{ position: "relative" }} onClick={() => setNotifOpen(!notifOpen)}>
            🔔<i className="dk-badge" />
          </button>
        </div>

        {notifOpen && (
          <div className="dk-dropdown">
            <div className="dk-dropdown-head"><b>Campaign Updates</b><button style={{ background: "none", color: "#cbd5e1" }} onClick={() => setNotifOpen(false)}>✕</button></div>
            <div className="dk-dropdown-row" style={{ color: "#4ade80" }}>✓ Yamuna Cleanup: 62 volunteers confirmed</div>
            <div className="dk-dropdown-row">📍 New drive near you: Malviya Nagar, Oct 27</div>
            <div className="dk-dropdown-row" style={{ color: "#FFC107" }}>🏆 CP Lighting Drive: spots filling fast!</div>
          </div>
        )}

        {/* Hero Slideshow */}
        <section className="vol-hero-dk" style={{ background: heroD.bg }}>
          <div className="vh-web3-badge">⚡ Web3 Verified Civic Rewards</div>
          <div className="vh-content">
            <span className="eyebrow" style={{ color: "#4ade80" }}>{heroD.date.toUpperCase()} · {heroD.loc.toUpperCase()}</span>
            <h1 style={{ marginTop: 6, fontSize: 20, whiteSpace: "pre-wrap" }}>{heroD.title}</h1>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 10px", lineHeight: 1.5 }}>
              Volunteer in Delhi &amp; Earn Non-Transferable Civic SBT Badges!
            </p>
            <div style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 12 }}>👥 {heroD.spots} spots filled · {heroD.dist} away</div>
            <button className="amber-btn" style={{ fontSize: 12 }} onClick={() => setSbtModal(heroD)}>
              Join Drive &amp; Claim SBT →
            </button>
          </div>
          <div className="vh-icon">{heroD.icon}</div>
          <div className="hc-dots" style={{ bottom: 10, left: 14 }}>
            {sbtDrives.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)}
                style={{ width: i === slide ? 18 : 6, height: 6, borderRadius: 3, background: i === slide ? "#FFC107" : "#94a3b8", border: "none", transition: "all .3s" }} />
            ))}
          </div>
        </section>

        {/* Category tabs */}
        <div className="dk-cat-tabs">
          {volCategories.map(c => (
            <button key={c} className={`dk-cat-tab ${activeCat === c ? "active" : ""}`} onClick={() => setActiveCat(c)}>{c}</button>
          ))}
        </div>

        {/* Drive cards */}
        {sbtDrives.map((d, i) => (
          <article key={i} className="dk-vol-card">
            <div className="dk-vol-card-header">
              <div className="dk-vol-icon">{d.icon}</div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 13, color: "#f1f5f9", display: "block" }}>{d.title}</b>
                <span style={{ fontSize: 10, color: "#cbd5e1" }}>{d.organizer} · {d.date}</span>
              </div>
              <span className="dk-vol-spots">👥 {d.spots}</span>
            </div>
            <p style={{ fontSize: 11, color: "#cbd5e1", margin: "6px 0 10px" }}>📍 {d.loc} · {d.dist} away</p>
            {/* SBT Preview */}
            <div className="dk-sbt-preview">
              <div className="dk-sbt-icon">{d.icon}</div>
              <div>
                <b style={{ fontSize: 11, color: "#f1f5f9", display: "block" }}>{d.sbt}</b>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                  <span className="dk-sbt-tag">🔒 Non-Transferable (SBT)</span>
                  <span className="dk-sbt-tag">⬡ {d.network}</span>
                  <span className="dk-sbt-tag" style={{ color: "#FFC107" }}>+{d.xp} Civic XP</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="amber-btn" style={{ flex: 2, fontSize: 12 }} onClick={() => setSbtModal(d)}>Register &amp; Reserve SBT</button>
              <button className="dk-outline-btn" style={{ flex: 1, fontSize: 11 }}>Token Utility</button>
            </div>
          </article>
        ))}
      </div>

      {/* SBT Registration modal */}
      {sbtModal && (
        <div className="modal-backdrop" onClick={() => setSbtModal(null)}>
          <section className="dark-sheet" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setSbtModal(null)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <span className="eyebrow" style={{ color: "#4ade80" }}>REGISTER FOR DRIVE</span>
            <h2 style={{ color: "#f1f5f9", margin: "6px 0 14px", fontSize: 16 }}>{sbtModal.title}</h2>
            <div className="dk-sbt-preview" style={{ marginBottom: 14 }}>
              <div className="dk-sbt-icon" style={{ fontSize: 28 }}>{sbtModal.icon}</div>
              <div><b style={{ color: "#FFC107", display: "block", fontSize: 13 }}>SBT: {sbtModal.sbt}</b><small style={{ color: "#cbd5e1" }}>🔒 Non-Transferable · {sbtModal.network} · +{sbtModal.xp} XP</small></div>
            </div>
            <input style={{ width: "100%", background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "10px 14px", color: "#f1f5f9", fontSize: 12, marginBottom: 10, outline: "none" }} placeholder="Your name (optional)" />
            <input style={{ width: "100%", background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "10px 14px", color: "#f1f5f9", fontSize: 12, marginBottom: 14, outline: "none" }} placeholder="Phone (optional)" />
            <button className="amber-btn" onClick={() => { setSbtModal(null); setMintedDrive(sbtModal); }}>
              Confirm Registration &amp; Reserve SBT
            </button>
          </section>
        </div>
      )}

      {/* SBT Minting modal */}
      {mintedDrive && (
        <div className="modal-backdrop" onClick={() => setMintedDrive(null)}>
          <section className="dark-sheet" style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setMintedDrive(null)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
            <span className="eyebrow" style={{ color: "#4ade80" }}>VOLUNTEER DRIVE VERIFIED!</span>
            <h2 style={{ color: "#f1f5f9", margin: "8px 0 10px", fontSize: 16 }}>Your SBT has been minted.</h2>
            <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16 }}>Your attendance was verified by the campaign lead. Your non-transferable Soulbound Token has been minted to your Citizen Wallet.</p>
            <div className="dk-sbt-minted-card">
              <div style={{ fontSize: 40, marginBottom: 8 }}>{mintedDrive.icon}</div>
              <b style={{ color: "#FFC107", fontSize: 14, display: "block" }}>{mintedDrive.sbt}</b>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
                <span className="dk-sbt-tag">CTZ-9482</span>
                <span className="dk-sbt-tag">{mintedDrive.network}</span>
                <span className="dk-sbt-tag">Oct 2026</span>
              </div>
              <p style={{ fontSize: 9, color: "#94a3b8", fontFamily: "DM Mono", marginTop: 8 }}>TX: 0x9a3f…c12b · Minted</p>
            </div>
            <button className="amber-btn" style={{ marginTop: 14 }} onClick={() => setMintedDrive(null)}>View My SBT Collection</button>
          </section>
        </div>
      )}
    </>
  );
}

/* ─── Profile ─── */
const avatars = [
  { icon: "🌿", label: "Eco Warrior", color: "#063B28" },
  { icon: "🔍", label: "City Inspector", color: "#1e3a5f" },
  { icon: "🤝", label: "Community Helper", color: "#2d1f00" },
  { icon: "🚇", label: "Metro Commuter", color: "#2d0838" },
  { icon: "📸", label: "Field Verifier", color: "#1a2d0a" },
  { icon: "🏛", label: "Ward Leader", color: "#1a1040" },
];

function Profile() {
  const [civicPoints, setCivicPoints] = useState(() =>
  Number(localStorage.getItem("cityzen_civic_points") || "1450")
);
const civicLevel =
  civicPoints >= 5000
    ? { level: 5, name: "Civic Hero", icon: "👑" }
    : civicPoints >= 2000
    ? { level: 4, name: "Civic Leader", icon: "🏆" }
    : civicPoints >= 1000
    ? { level: 3, name: "Civic Champion", icon: "⭐" }
    : civicPoints >= 500
    ? { level: 2, name: "Civic Contributor", icon: "🌿" }
    : { level: 1, name: "Civic Beginner", icon: "🌱" };

useEffect(() => {
  const updatePoints = () => {
    setCivicPoints(
      Number(localStorage.getItem("cityzen_civic_points") || "0")
    );
  };
  
  

  window.addEventListener("civicPointsUpdated", updatePoints);

  return () => {
    window.removeEventListener("civicPointsUpdated", updatePoints);
  };
}, []);
  const navigate = useNavigate();
  const [profileTab, setProfileTab] = useState<"achievements" | "activity">("achievements");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [pendingAvatar, setPendingAvatar] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [lbTab, setLbTab] = useState<"weekly" | "monthly" | "alltime">("monthly");
  const [redeemItem, setRedeemItem] = useState<string | null>(null);
  const citizenId = "CTZ-9482";
  const av = avatars[selectedAvatar];

  const sbtBadges = [
  {
    icon: "📝",
    label: "First Report",
    level: "Unlocked",
    color: "#FFC107",
    network: "Polygon",
    unlocked: localStorage.getItem("cityzen_badge_first_report") === "true",
  },
  {
    icon: "📸",
    label: "Evidence Collector",
    level: "Unlocked",
    color: "#60a5fa",
    network: "Base",
    unlocked: localStorage.getItem("cityzen_badge_photo") === "true",
  },
  {
    icon: "✓",
    label: "Resolution Verifier",
    level: "Unlocked",
    color: "#4ade80",
    network: "Polygon",
    unlocked: localStorage.getItem("cityzen_badge_verify") === "true",
  },
  {
    icon: "⚠️",
    label: "Civic Watchdog",
    level: "Unlocked",
    color: "#a78bfa",
    network: "Polygon",
    unlocked: localStorage.getItem("cityzen_badge_challenge") === "true",
  },
];
  const rewards = [
    { icon: "🚇", title: "Delhi Metro Travel Pass", discount: "10% OFF", cost: 500, color: "#1e3a5f", accent: "#60a5fa" },
    { icon: "🅿", title: "Free 2-Hour MCD Parking", discount: "FREE", cost: 300, color: "#2d1f00", accent: "#FFC107" },
    { icon: "🚌", title: "DTC Electric Bus Pass", discount: "15% OFF", cost: 450, color: "#063B28", accent: "#4ade80" },
  ];

  const leaderboard = [
  { cid: "Citizen #DEL-1420", pts: 1420 },
  { cid: "Citizen #DEL-2281", pts: 1105 },
  { cid: "You", pts: civicPoints },
  { cid: "Citizen #DEL-8834", pts: 982 },
  { cid: "Citizen #DEL-4412", pts: 891 },
  { cid: "Citizen #DEL-7701", pts: 840 },
]
  .sort((a, b) => b.pts - a.pts)
  .map((l, i) => ({
    ...l,
    rank: i + 1,
    tier:
      i === 0 ? "🥇" :
      i === 1 ? "🥈" :
      i === 2 ? "🥉" :
      "",
  }));
  return (
  <div className="screen dk-screen" style={{ padding: 0 }}>
    {/* Profile Header */}
    <div className="dk-profile-hero">
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
      My Profile
    </span>
    <button
      className="dk-icon-btn"
      onClick={() => setSettingsOpen(true)}
      style={{ fontSize: 16 }}
    >
      ⚙
    </button>
  </div>
</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setAvatarPickerOpen(true)}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: av.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, border: "2px solid #FFC107" }}>{av.icon}</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 18, height: 18, borderRadius: "50%", background: "#FFC107", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#0f1117", fontWeight: 700 }}>✏</div>
          </div>
          <div>
            <div style={{ fontFamily: "DM Mono", fontSize: 15, color: "#FFC107", fontWeight: 700 }}>{citizenId}</div>
            <div style={{ fontSize: 11, color: "#4ade80", marginTop: 2 }}>
  {civicLevel.icon} Level {civicLevel.level} · {civicLevel.name}
</div>
            <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>Vasant Vihar, Delhi · Active since 2024</div>
          </div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#063B28,#0d4a33)", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: "#4ade80", fontFamily: "DM Mono", letterSpacing: ".08em" }}>CIVIC CONTRIBUTION SCORE</div>
          <div style={{ fontSize: 32, color: "#FFC107", fontWeight: 800, fontFamily: "DM Mono", margin: "4px 0 2px" }}>🪙 {civicPoints.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>Top 12% in Ward 23</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["14", "Reports"], ["8", "Verified"], ["5", "Drives"]].map(([val, lbl]) => (
            <div key={lbl} style={{ flex: 1, background: "#1C2128", border: "1px solid #2d3748", borderRadius: 10, padding: "8px 0", textAlign: "center" }}>
              <b style={{ color: "#1f2937", fontSize: 16 }}>{val}</b>
              <div style={{ fontSize: 9, color: "#cbd5e1" }}>{lbl}</div>
            </div>
          ))}
        </div>
    

      {/* Tabs */}
      <div style={{ padding: "0 18px" }}>
        <div className="dk-tab-bar" style={{ marginBottom: 14 }}>
          <button className={`dk-tab ${profileTab === "achievements" ? "dk-tab-active" : ""}`} onClick={() => setProfileTab("achievements")}>🏅 Achievements</button>
          <button className={`dk-tab ${profileTab === "activity" ? "dk-tab-active" : ""}`} onClick={() => setProfileTab("activity")}>📋 Activity</button>
        </div>

        {profileTab === "achievements" && (
          <>
            <b style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 10 }}>SOULBOUND TOKENS (SBTs)</b>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10 }}>
              {sbtBadges.map(b => (
                <div key={b.label} style={{ flexShrink: 0, width: 100, background: "#1C2128", border: `1px solid ${b.color}40`, borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{b.icon}</div>
                  <b style={{ fontSize: 10, color: "#f1f5f9", display: "block" }}>{b.label}</b>
                  <span style={{ fontSize: 9, color: b.color }}>{b.level}</span>
                  <div style={{ marginTop: 6, fontSize: 8, color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                    🔒 SBT · {b.network}
                  </div>
                </div>
              ))}
            </div>

            <b style={{ fontSize: 12, color: "#94a3b8", display: "block", margin: "16px 0 10px" }}>ACTIVITY SUMMARY</b>
            {[["📍", "3 Reports Verified this month"], ["✋", "1 Volunteer Drive attended"], ["▲", "12 Upvotes received from citizens"], ["💬", "5 Authority chats initiated"]].map(([ic, lbl]) => (
              <div key={String(lbl)} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: "1px solid #1e293b", alignItems: "center" }}>
                <span style={{ fontSize: 16 }}>{ic}</span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{lbl}</span>
              </div>
            ))}
          </>
        )}

        {profileTab === "activity" && (
          <>
            {[
              { ic: "📍", lbl: "Report submitted", sub: "CZ-2026-0091 · Pothole", date: "Oct 11", pts: "+5" },
              { ic: "✓", lbl: "Resolution verified", sub: "CZ-2026-0048 · Garbage", date: "Oct 3", pts: "+15" },
              { ic: "📸", lbl: "Evidence added", sub: "CZ-2026-0073 · Streetlight", date: "Sep 28", pts: "+10" },
              { ic: "✋", lbl: "Drive joined", sub: "Street Sweep · Safdarjung", date: "Sep 20", pts: "+25" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid #1e293b", alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1C2128", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{a.ic}</div>
                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: 12, display: "block", color: "#f1f5f9" }}>{a.lbl}</b>
                  <small style={{ color: "#cbd5e1", fontSize: 10 }}>{a.sub} · {a.date}</small>
                </div>
                <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "#FFC107", fontWeight: 700 }}>{a.pts}</span>
              </div>
            ))}
          </>
        )}

        {/* Redeemable Rewards */}
        <b style={{ fontSize: 12, color: "#94a3b8", display: "block", margin: "20px 0 4px" }}>REDEEM CIVIC REWARDS</b>
        <p style={{ fontSize: 11, color: "#64748b", marginBottom: 12 }}>Use your earned Civic Points for public utility discounts.</p>
        {rewards.map((r, i) => (
          <div key={i} style={{ background: "#1C2128", border: `1px solid ${r.accent}30`, borderRadius: 14, padding: "14px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: r.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <b style={{ color: r.accent, fontSize: 16, display: "block" }}>{r.discount}</b>
                <span style={{ fontSize: 12, color: "#f1f5f9" }}>{r.title}</span>
                <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>Cost: {r.cost} Civic Points</div>
              </div>
            </div>
            <button className="amber-btn" style={{ width: "100%", marginTop: 10, fontSize: 13 }} onClick={() => setRedeemItem(r.title)}>Redeem Now</button>
          </div>
        ))}

        {/* Leaderboard preview */}
        <b style={{ fontSize: 12, color: "#94a3b8", display: "block", margin: "20px 0 10px" }}>TOP 3 THIS MONTH</b>
        {leaderboard.slice(0, 3).map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1e293b" }}>
            <span style={{ fontSize: 18, minWidth: 24 }}>{l.tier || `#${l.rank}`}</span>
            <span style={{ flex: 1, fontSize: 12, color: "#94a3b8", fontFamily: "DM Mono" }}>{l.cid}</span>
            <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "#FFC107", fontWeight: 700 }}>{l.pts}</span>
          </div>
        ))}
        <button className="amber-btn" style={{ width: "100%", marginTop: 10, marginBottom: 20 }} onClick={() => setLeaderboardOpen(true)}>
          See Full Leaderboard →
        </button>

        {/* Account */}
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 14, marginBottom: 30 }}>
          <button onClick={() => setHelpOpen(true)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 0", background: "none", border: "none", borderBottom: "1px solid #1e293b", fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
            <span>?</span> Help &amp; Support <span style={{ marginLeft: "auto", color: "#94a3b8" }}>→</span>
          </button>
          <button onClick={() => navigate("/welcome")} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 0", background: "none", border: "none", fontSize: 13, color: "#f87171", cursor: "pointer" }}>
            <span>↩</span> Log out <span style={{ marginLeft: "auto" }}>→</span>
          </button>
        </div>
      </div>

      {/* Avatar Picker */}
      {avatarPickerOpen && (
        <div className="modal-backdrop" onClick={() => { setAvatarPickerOpen(false); setPendingAvatar(selectedAvatar); }}>
          <section className="dark-sheet" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setAvatarPickerOpen(false)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <span className="eyebrow" style={{ color: "#FFC107" }}>AVATAR SELECTOR</span>
            <h2 style={{ color: "#f1f5f9", margin: "6px 0 16px", fontSize: 17 }}>Choose Your Citizen Avatar</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {avatars.map((a, i) => (
                <button key={i} onClick={() => setPendingAvatar(i)}
                  style={{ background: a.color, border: `2px solid ${pendingAvatar === i ? "#FFC107" : "transparent"}`, borderRadius: 14, padding: "16px 8px", textAlign: "center", cursor: "pointer", transition: "border-color .2s" }}>
                  <div style={{ fontSize: 28 }}>{a.icon}</div>
                  <div style={{ fontSize: 10, color: pendingAvatar === i ? "#FFC107" : "#94a3b8", marginTop: 6 }}>{a.label}</div>
                </button>
              ))}
            </div>
            <button className="amber-btn" onClick={() => { setSelectedAvatar(pendingAvatar); setAvatarPickerOpen(false); }}>Apply Avatar</button>
          </section>
        </div>
      )}

      {/* Leaderboard modal */}
      {leaderboardOpen && (
        <div className="modal-backdrop" onClick={() => setLeaderboardOpen(false)}>
          <section className="dark-sheet" style={{ maxHeight: "92vh" }} onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setLeaderboardOpen(false)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <span className="eyebrow" style={{ color: "#FFC107" }}>DELHI CIVIC LEADERBOARD</span>
            <h2 style={{ color: "#f1f5f9", margin: "6px 0 14px", fontSize: 16 }}>Top Contributors</h2>
            <div className="dk-tab-bar" style={{ marginBottom: 14 }}>
              {(["weekly", "monthly", "alltime"] as const).map(t => (
                <button key={t} className={`dk-tab ${lbTab === t ? "dk-tab-active" : ""}`} onClick={() => setLbTab(t)}>{t === "alltime" ? "All-Time" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
            </div>
            {leaderboard.map(l => (
              <div key={l.rank} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #1e293b" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: l.rank <= 3 ? "#2d1f00" : "#1C2128", display: "flex", alignItems: "center", justifyContent: "center", fontSize: l.rank <= 3 ? 18 : 12, color: l.rank <= 3 ? "#FFC107" : "#cbd5e1" }}>
                  {l.tier || `#${l.rank}`}
                </div>
                <span style={{ flex: 1, fontFamily: "DM Mono", fontSize: 12, color: "#94a3b8" }}>{l.cid}</span>
                <div style={{ textAlign: "right" }}>
                  <b style={{ color: "#FFC107", fontFamily: "DM Mono", fontSize: 13 }}>{l.pts}</b>
                  <div style={{ fontSize: 9, color: "#cbd5e1" }}>Civic Points</div>
                </div>
              </div>
            ))}
            {/* Sticky user rank */}
            <div style={{ background: "#063B28", border: "1px solid #4ade8040", borderRadius: 12, padding: "12px 14px", marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "DM Mono", fontSize: 12, color: "#4ade80" }}>#42</span>
              <span style={{ flex: 1, fontFamily: "DM Mono", fontSize: 12, color: "#f1f5f9" }}>CTZ-9482 · You</span>
              <b style={{ color: "#FFC107", fontFamily: "DM Mono" }}>1,450</b>
            </div>
          </section>
        </div>
      )}

      {/* Settings overlay */}
      {settingsOpen && (
        <div className="modal-backdrop" onClick={() => setSettingsOpen(false)}>
          <section className="dark-sheet" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setSettingsOpen(false)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <span className="eyebrow" style={{ color: "#4ade80" }}>SETTINGS</span>
            <h2 style={{ color: "#f1f5f9", margin: "6px 0 16px" }}>Edit Profile</h2>
            {[["Citizen ID", citizenId, true], ["Location", "Vasant Vihar, Delhi", false], ["Email", "", false], ["Phone", "+91 98765 00000", false]].map(([lbl, val, ro]) => (
              <div key={String(lbl)} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: "#cbd5e1", display: "block", marginBottom: 4 }}>{lbl}</label>
                <input className="dk-field" defaultValue={String(val)} readOnly={Boolean(ro)} style={{ opacity: ro ? .6 : 1 }} />
              </div>
            ))}
            <button className="amber-btn" style={{ marginTop: 4 }} onClick={() => setSettingsOpen(false)}>Save Changes</button>
          </section>
        </div>
      )}

      {/* Help overlay */}
      {helpOpen && (
        <div className="modal-backdrop" onClick={() => setHelpOpen(false)}>
          <section className="dark-sheet" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setHelpOpen(false)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <span className="eyebrow" style={{ color: "#4ade80" }}>HELP &amp; SUPPORT</span>
            <h2 style={{ color: "#f1f5f9", margin: "6px 0 16px" }}>How can we help?</h2>
            {[["📧", "Email Support", "support@cityzen.in"], ["📞", "Helpline", "1800-111-CITY · Mon–Sat 9AM–6PM"], ["📋", "Report a Bug", "Tap to submit an app issue"], ["📖", "User Guide", "How to use CityZen effectively"]].map(([ic, t, d]) => (
              <div key={String(t)} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e293b" }}>
                <span style={{ fontSize: 22 }}>{ic}</span>
                <div><b style={{ fontSize: 13, display: "block", color: "#f1f5f9" }}>{t}</b><small style={{ color: "#cbd5e1" }}>{d}</small></div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* Redeem confirmation */}
      {redeemItem && (
        <div className="modal-backdrop" onClick={() => setRedeemItem(null)}>
          <section className="dark-sheet" style={{ textAlign: "center" }} onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setRedeemItem(null)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <div style={{ fontSize: 36 }}>🎟</div>
            <h2 style={{ color: "#f1f5f9", margin: "8px 0 6px" }}>Redemption Requested!</h2>
            <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>{redeemItem} — Your voucher code will be sent to your registered email within 24 hours.</p>
            <button className="amber-btn" onClick={() => setRedeemItem(null)}>Done</button>
          </section>
        </div>
      )}
    </div>
  );
}

/* ─── Welcome ─── */
function Welcome() {
  const navigate = useNavigate();
  const [termsOpen, setTermsOpen] = useState(false);
  return (
    <>
      <div className="screen dk-welcome-screen">
        <div className="dk-geo ga1" /><div className="dk-geo ga2" /><div className="dk-geo ga3" />
        <div className="welcome-center">
          <CityZenLogo size="lg" />
          <p className="dk-slogan">Report problems. Verify resolutions.<br />Hold your city accountable.</p>
          <p className="dk-tagline">"Resolved doesn't always mean solved."</p>
          <div className="welcome-avatars" style={{ marginBottom: 24 }}>
            {["#063B28", "#1e3a5f", "#2d1f00", "#2d0838"].map((bg, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: bg, border: "2px solid #FFC10760", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#FFC107", fontWeight: 700 }}>CZ</div>
            ))}
            <span style={{ fontSize: 10, color: "#cbd5e1" }}>+3,912 citizens active</span>
          </div>
          <div className="welcome-actions">
            <button className="amber-btn" style={{ width: "100%", height: 50, fontSize: 14 }} onClick={() => navigate("/verify")}>
              👤 Log in as Citizen
            </button>
            <button className="dk-auth-btn" style={{ width: "100%", height: 50, fontSize: 14 }} onClick={() => navigate("/authority-login")}>
              🏛 Log in as Authority
            </button>
          </div>
          <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 18, textAlign: "center" }}>
            By continuing you agree to CityZen's{" "}
            <button onClick={() => setTermsOpen(true)} style={{ background: "none", border: "none", color: "#FFC107", textDecoration: "underline", cursor: "pointer", fontSize: 10 }}>
              Terms &amp; Privacy Policy
            </button>
          </p>
        </div>
      </div>
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}

/* ─── Citizen Login ─── */
function CitizenVerify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [done, setDone] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);
  const [citizenId] = useState(genCitizenId);

function submit(e: React.FormEvent) {
  e.preventDefault();

  const cleanedPhone = phone.replace(/\D/g, "");

  if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
    setPhoneError("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  setPhoneError("");

  setDemoOtp("123456");
  setOtp("");
  setOtpError("");
  setOtpSent(true);
}
function verifyOTP() {
  if (otp.length !== 6) {
    setOtpError("Please enter the 6-digit OTP.");
    return;
  }

  if (otp !== demoOtp) {
    setOtpError("Invalid OTP. Please try again.");
    return;
  }

  setOtpError("");
  setDone(true);

  setTimeout(() => {
    navigate("/app");
  }, 1000);
}
return (
    <>
      <div className="screen dk-welcome-screen" style={{ justifyContent: "flex-start", paddingTop: 20 }}>
        <button style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: 13, cursor: "pointer", alignSelf: "flex-start", marginBottom: 16 }} onClick={() => navigate("/welcome")}>← Back</button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <CityZenLogo size="md" />
          {done ? (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#063B28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#4ade80", margin: "0 auto 12px" }}>✓</div>
              <b style={{ color: "#f1f5f9", fontSize: 16 }}>Welcome to CityZen!</b>
              <div style={{ background: "#063B2840", border: "1px solid #4ade8040", borderRadius: 12, padding: "12px 20px", marginTop: 14 }}>
                <div style={{ fontSize: 10, color: "#4ade80", marginBottom: 4, fontFamily: "DM Mono" }}>YOUR CITIZEN ID</div>
                <div style={{ fontFamily: "DM Mono", fontSize: 22, color: "#FFC107", fontWeight: 700 }}>{citizenId}</div>
                <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 4 }}>Save this ID — your CityZen identity</div>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: 11, marginTop: 12 }}>Redirecting…</p>
            </div>
          ) : (
            <>
              <h2 style={{ color: "#f1f5f9", fontSize: 20, margin: "14px 0 4px" }}>Citizen Login</h2>
              <p style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 20, textAlign: "center" }}>Your unique Citizen ID is auto-generated on signup.</p>
              <form onSubmit={submit} style={{ width: "100%" }}>
               {[
  ["email", "Email Address", "you@example.com"],
  ["password", "Password", "Create a strong password"],
  ["tel", "Phone Number", "9876543210"],
].map(([type, lbl, ph]) => (
  <div key={lbl} style={{ marginBottom: 12 }}>
    <label
      style={{
        fontSize: 11,
        color: "#cbd5e1",
        display: "block",
        marginBottom: 4,
      }}
    >
      {lbl}
    </label>

    <input
      type={type}
      className="dk-field"
      placeholder={ph}
      required
      maxLength={type === "tel" ? 10 : undefined}
      inputMode={type === "tel" ? "numeric" : undefined}
      onChange={(e) => {
        if (type === "tel") {
          const value = e.target.value.replace(/\D/g, "").slice(0, 10);
          setPhone(value);
          setPhoneError("");
        } else if (type === "email") {
          setEmail(e.target.value);
        } else {
          setPassword(e.target.value);
        }
      }}
      value={
        type === "email"
          ? email
          : type === "password"
          ? password
          : phone
      }
    />

    {type === "tel" && phoneError && (
      <div
        style={{
          color: "#f87171",
          fontSize: 10,
          marginTop: 5,
        }}
      >
        {phoneError}
      </div>
    )}
  </div>
))}
                <div style={{ background: "#1C2128", border: "1px solid #FFC10740", borderRadius: 12, padding: "12px 16px", margin: "14px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 4, fontFamily: "DM Mono" }}>YOUR CITIZEN ID (auto-generated)</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 20, color: "#FFC107", fontWeight: 700 }}>{citizenId}</div>
                </div>
                

{otpSent && (
  <div
    style={{
      background: "#1C2128",
      border: "1px solid #4ade8040",
      borderRadius: 12,
      padding: "14px 16px",
      margin: "14px 0",
    }}
  >
    <div
      style={{
        color: "#4ade80",
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 6,
        textAlign: "center",
      }}
    >
      OTP Sent Successfully
    </div>

    <div
      style={{
        color: "#cbd5e1",
        fontSize: 10,
        textAlign: "center",
        marginBottom: 10,
      }}
    >
      Demo OTP: {demoOtp}
    </div>

    <input
      type="text"
      className="dk-field"
      placeholder="Enter 6-digit OTP"
      maxLength={6}
      inputMode="numeric"
      value={otp}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
        setOtpError("");
      }}
    />

    {otpError && (
      <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>
        {otpError}
        </p>
      )}

    <button
      type="button"
      className="amber-btn"
      style={{
        width: "100%",
        fontSize: 14,
        marginTop: 10,
      }}
      onClick={verifyOTP}
    >
      Verify OTP
    </button>
  </div>
)}
<button type="submit" className="amber-btn" style={{ width: "100%", fontSize: 14 }}>Create Account &amp; Enter</button>
{otpSent && (
  <div
    style={{
      background: "#1C2128",
      border: "1px solid #4ade8040",
      borderRadius: 12,
      padding: "14px 16px",
      margin: "14px 0",
    }}
  >
    <div
      style={{
        color: "#4ade80",
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 6,
        textAlign: "center",
      }}
    >
      OTP Sent Successfully
    </div>

    <div
      style={{
        color: "#cbd5e1",
        fontSize: 10,
        textAlign: "center",
        marginBottom: 10,
      }}
    >
      Demo OTP: {demoOtp}
    </div>

    <input
      type="text"
      className="dk-field"
      placeholder="Enter 6-digit OTP"
      maxLength={6}
      inputMode="numeric"
      value={otp}
      onChange={(e) => {
        const value = e.target.value
          .replace(/\D/g, "")
          .slice(0, 6);
        setOtp(value);
        setOtpError("");
      }}
    />

    {otpError && (
      <p style={{ color: "#f87171", fontSize: 10, marginTop: 5 }}>
        {otpError}
      </p>
    )}

    <button
      type="button"
      className="amber-btn"
      style={{
        width: "100%",
        fontSize: 14,
        marginTop: 10,
      }}
      onClick={verifyOTP}
    >
      Verify OTP
    </button>
  </div>
)}
{otpSent && (
  <div
    style={{
      background: "#1C2128",
      border: "1px solid #FFC10740",
      borderRadius: 12,
      padding: 14,
      marginTop: 12,
    }}
  >
    <div
      style={{
        fontSize: 11,
        color: "#4ade80",
        marginBottom: 8,
        textAlign: "center",
      }}
    >
      OTP SENT SUCCESSFULLY
    </div>

    <div
      style={{
        fontSize: 18,
        color: "#FFC107",
        fontFamily: "DM Mono",
        fontWeight: 700,
        textAlign: "center",
        marginBottom: 10,
      }}
    >
      Test OTP: {demoOtp}
    </div>

    <input
      className="dk-field"
      placeholder="Enter 6-digit OTP"
      value={otp}
      maxLength={6}
      inputMode="numeric"
      onChange={(e) =>
        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
      }
    />

    {otpError && (
      <div
        style={{
          color: "#f87171",
          fontSize: 10,
          marginTop: 5,
        }}
      >
        {otpError}
      </div>
    )}

    <button
      type="button"
      className="amber-btn"
      style={{ width: "100%", marginTop: 10 }}
      onClick={verifyOTP}
    >
      Verify OTP
    </button>
  </div>
)}
                <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 12, textAlign: "center" }}>
                  By signing up you agree to our{" "}
                  <button type="button" onClick={() => setTermsOpen(true)} style={{ background: "none", border: "none", color: "#FFC107", textDecoration: "underline", cursor: "pointer", fontSize: 10 }}>
                    Terms &amp; Privacy Policy
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}

/* ─── Authority Login ─── */
const jurisdictions = ["Ward 23 · Vasant Vihar", "Ward 14 · Lajpat Nagar", "Ward 31 · Safdarjung", "Ward 60 · Dwarka", "Ward 8 · Malviya Nagar"];

function AuthorityLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("Roads");
  const [jurisdiction, setJurisdiction] = useState(jurisdictions[0]);
  const [govtId, setGovtId] = useState(false);
  const [done, setDone] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const authId = "AUTH-DEL-042";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
    setTimeout(() => navigate("/authority"), 2000);
  }

  return (
    <>
      <div className="screen dk-welcome-screen" style={{ justifyContent: "flex-start", paddingTop: 20 }}>
        <button style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: 13, cursor: "pointer", alignSelf: "flex-start", marginBottom: 16 }} onClick={() => navigate("/welcome")}>← Back</button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <CityZenLogo size="md" />
          {done ? (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#2d1f00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 12px" }}>🏛</div>
              <b style={{ color: "#f1f5f9" }}>Authority Dashboard Ready</b>
              <div style={{ background: "#2d1f0080", border: "1px solid #FFC10740", borderRadius: 12, padding: "12px 20px", marginTop: 14 }}>
                <div style={{ fontSize: 10, color: "#FFC107", marginBottom: 4, fontFamily: "DM Mono" }}>AUTHORITY ID</div>
                <div style={{ fontFamily: "DM Mono", fontSize: 20, color: "#FFC107", fontWeight: 700 }}>{authId}</div>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: 11, marginTop: 12 }}>Redirecting…</p>
            </div>
          ) : (
            <>
              <h2 style={{ color: "#f1f5f9", fontSize: 20, margin: "14px 0 4px" }}>Authority Login</h2>
              <p style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 20, textAlign: "center" }}>For government officials and municipal officers only.</p>
              <form onSubmit={submit} style={{ width: "100%" }}>
                <label style={{ fontSize: 11, color: "#cbd5e1", display: "block", marginBottom: 4 }}>Official Email</label>
                <input type="email" className="dk-field" placeholder="officer@mcd.delhi.gov.in" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 10 }} />
                <label style={{ fontSize: 11, color: "#cbd5e1", display: "block", marginBottom: 4 }}>Password</label>
                <input type="password" className="dk-field" placeholder="Secure password" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: 10 }} />
                <label style={{ fontSize: 11, color: "#cbd5e1", display: "block", marginBottom: 4 }}>Concerned Domain</label>
                <select className="dk-field" value={domain} onChange={e => setDomain(e.target.value)} style={{ marginBottom: 10 }}>
                  {Object.keys(domainAuthority).map(d => <option key={d}>{d}</option>)}
                </select>
                <label style={{ fontSize: 11, color: "#cbd5e1", display: "block", marginBottom: 4 }}>Jurisdiction</label>
                <select className="dk-field" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} style={{ marginBottom: 10 }}>
                  {jurisdictions.map(j => <option key={j}>{j}</option>)}
                </select>
                <div className="dk-upload-box" style={{ marginBottom: 10, cursor: "pointer", borderColor: govtId ? "#4ade80" : undefined }} onClick={() => setGovtId(true)}>
                  <span>{govtId ? "✓" : "📎"}</span>
                  <b style={{ color: govtId ? "#4ade80" : "#f1f5f9" }}>{govtId ? "Document uploaded" : "Upload Govt. ID / Office Letter"}</b>
                  <small style={{ color: "#cbd5e1" }}>{govtId ? "Pending admin verification" : "JPEG, PNG or PDF · Max 5MB"}</small>
                </div>
                <div style={{ background: "#1C2128", border: "1px solid #FFC10740", borderRadius: 12, padding: "12px 16px", margin: "10px 0 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 4, fontFamily: "DM Mono" }}>AUTHORITY ID (auto-assigned)</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 20, color: "#FFC107", fontWeight: 700 }}>{authId}</div>
                </div>
                <button type="submit" className="dk-auth-btn" style={{ width: "100%", fontSize: 14 }}>Register &amp; Request Access</button>
                <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 12, textAlign: "center" }}>
                  <button type="button" onClick={() => setTermsOpen(true)} style={{ background: "none", border: "none", color: "#FFC107", textDecoration: "underline", cursor: "pointer", fontSize: 10 }}>Terms &amp; Privacy Policy</button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}

/* ─── Authority Dashboard ─── */
const authorityReports = [
  { id: "RPT-2091", type: "Pothole", icon: "◒", desc: "Large pothole near IIT gate.", location: "Outer Ring Rd, Vasant Vihar", status: "Under Review", priority: "High", dept: "Road Maintenance Dept", time: "Oct 11 · 10:32 AM", upvotes: 284, delayReason: null as string | null },
  { id: "RPT-2092", type: "Sewage Overflow", icon: "⊘", desc: "Sewage spilling onto Lajpat Nagar market.", location: "Lajpat Nagar, Lane 4", status: "Work in Progress", priority: "High", dept: "Sanitation Dept", time: "Oct 12 · 8:15 AM", upvotes: 451, delayReason: "Requires tender" as string | null },
  { id: "RPT-2093", type: "Streetlight Out", icon: "◑", desc: "Three consecutive streetlights non-functional.", location: "Safdarjung Enclave, Block C", status: "Assigned", priority: "Medium", dept: "Electricity Dept", time: "Oct 13 · 6:00 PM", upvotes: 128, delayReason: "Awaiting material" as string | null },
  { id: "RPT-2094", type: "Garbage Pile", icon: "♜", desc: "Uncollected waste for 5 days.", location: "Vasant Kunj, Sector C", status: "Pending", priority: "Medium", dept: "Waste Management", time: "Oct 14 · 9:00 AM", upvotes: 76, delayReason: "Budget approval" as string | null },
];

type AuthReport = typeof authorityReports[0] & {
  complaint_id?: string;
  resolution_description?: string;
  resolution_photo?: string | null;
  challenge_photo?: string | null;
  challenge_description?: string | null;
};

function AuthorityReportSheet({
  r,
  onClose,
  onUpdated,
}: {
  r: any;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState(r.status);
  const [resolutionDescription, setResolutionDescription] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null);
  const [submittingResolution, setSubmittingResolution] = useState(false);

  const statusColors: Record<string, string> = {
    Reported: "#60a5fa",
    "Under Review": "#FFC107",
    Assigned: "#a78bfa",
    "Work in Progress": "#60a5fa",
    Resolved: "#4ade80",
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="dark-sheet"
        style={{ maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="sheet-close"
          style={{ color: "#94a3b8" }}
          onClick={onClose}
        >
          ×
        </button>

        <div className="sheet-handle" style={{ background: "#94a3b8" }} />

        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <span
            style={{
              fontFamily: "DM Mono",
              fontSize: 10,
              color: "#60a5fa",
              background: "#1e3a5f",
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            {r.complaint_id}
          </span>

          <span
            style={{
              fontSize: 10,
              color: statusColors[status] || "#94a3b8",
              background: (statusColors[status] || "#94a3b8") + "20",
              padding: "2px 8px",
              borderRadius: 6,
              marginLeft: "auto",
            }}
          >
            {status}
          </span>
        </div>

        <h2
          style={{
            color: "#f1f5f9",
            fontSize: 16,
            marginBottom: 4,
          }}
        >
          📋 {r.category}
        </h2>

        <p
          style={{
            fontSize: 11,
            color: "#cbd5e1",
            marginBottom: 10,
          }}
        >
          📍 {r.location}
        </p>

        <div
  className="dk-upload-box"
  style={{ marginBottom: 12 }}
>
  <div
    style={{
      fontSize: 12,
      color: "#94a3b8",
      marginBottom: 8,
    }}
>    📷 Citizen photo
  </div>
  {r.challenge_photo && (
  <div
    className="dk-upload-box"
    style={{ marginBottom: 12 }}
  >
    <div
      style={{
        fontSize: 12,
        color: "#f87171",
        marginBottom: 8,
}}>
{r.challenge_description ? (
  <div style={{ marginBottom: 12 }}>
    <p style={{ color: "#f87171", fontSize: 12 }}>
      ⚠️ Challenge reason
    </p>
    <p style={{ color: "#ffffff" }}>
      {r.challenge_description}
    </p>
  </div>
) : null}


      
    
    
      ⚠️ Challenge evidence photo
    </div>

    <img
      src={`${API_BASE_URL}/uploads/${r.challenge_photo}`}
      alt="Citizen challenge evidence"
      style={{
        width: "100%",
        maxHeight: 300,
        objectFit: "cover",
        borderRadius: 12,
        display: "block",
      }}
    />
  </div>
)}
{r.challenge_description && (
  <div
    style={{
      marginBottom: 12,
      padding: 12,
      borderRadius: 10,
      background: "#2d0f0f",
      border: "1px solid #f8717140",
    }}
  >
    <div
      style={{
        fontSize: 11,
        color: "#f87171",
        fontWeight: 700,
        marginBottom: 6,
      }}
    >
      ⚠️ Citizen Challenge
    </div>

    <p
      style={{
        margin: 0,
        fontSize: 12,
        color: "#fca5a5",
        lineHeight: 1.5,
      }}
    >
      {r.challenge_description}
    </p>
  </div>
)}

  {r.complaint_photo ? (
    <img
      src={`${API_BASE_URL}/uploads/${r.complaint_photo}`}
      alt="Citizen submitted photo"
      style={{
        width: "100%",
        maxHeight: 300,
        objectFit: "cover",
        borderRadius: 12,
        display: "block",
      }}
    />
  ) : (
    <div
      style={{
        padding: 20,
        textAlign: "center",
        color: "#94a3b8",
      }}
    >
      📷 No citizen photo uploaded
    </div>
  )}
</div>

        <p
          style={{
            fontSize: 12,
            color: "#94a3b8",
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          {r.description}
        </p>

        <label
          style={{
            fontSize: 11,
            color: "#cbd5e1",
            display: "block",
            marginBottom: 4,
          }}
        >
          Update Status
        </label>

        <select
          className="dk-field"
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{
            marginBottom: 12,
            borderColor:
              (statusColors[status] || "#94a3b8") + "80",
          }}
        >
          {[
            "Reported",
            "Under Review",
            "Assigned",
            "Work in Progress",
            "Resolved",
          ].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <button
  className="amber-btn"
  onClick={async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/complaints/${r.complaint_id}/status?status=${encodeURIComponent(status)}`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        alert("Could not update status.");
        return;
      }

      alert(`Status updated to ${data.status}`);
      onUpdated();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Could not connect to CityZen backend.");
    }
  }}
>
  Update Status
</button>

        {status === "Resolved" && (
  <div style={{ marginTop: 12 }}>
    <div
      className="dk-upload-box"
      style={{
        marginBottom: 10,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <label
  htmlFor="resolution-photo"
  style={{ cursor: "pointer", display: "block" }}
>
        📷{" "}
        {resolutionPhoto
          ? `Photo selected: ${resolutionPhoto}`
          : "Upload resolution photo"}

        <input
          type="file"
          id="resolution-photo"
          accept="image/*"
          style={{
  display: "block",
  width: "100%",
  marginTop: 10,
}}
          onChange={e => {
            const file = e.target.files?.[0];

            if (!file) return;

            setResolutionPhoto(file);
          }}
        />
      </label>
    </div>

    <textarea
      className="dk-field dk-textarea"
      placeholder="Describe what was done…"
      value={resolutionDescription}
      onChange={e => setResolutionDescription(e.target.value)}
    />

    <button
      className="amber-btn"
      disabled={submittingResolution}
      style={{
        marginTop: 10,
        background: "#063B28",
        color: "#4ade80",
        border: "1px solid #4ade8040",
        opacity: submittingResolution ? 0.6 : 1,
        cursor: submittingResolution ? "not-allowed" : "pointer",
      }}
      onClick={async () => {
        if (!resolutionDescription.trim()) {
          alert("Please describe what was done.");
          return;
        }

        if (!resolutionPhoto) {
          alert("Please upload a resolution photo.");
          return;
        }

        setSubmittingResolution(true);

        try {
          const formData = new FormData();

formData.append("description", resolutionDescription);

if (resolutionPhoto) {
  formData.append("photo", resolutionPhoto);
}

const response = await fetch(
  `${API_BASE_URL}/complaints/${r.complaint_id}/resolution`,
  {
    method: "PUT",
    body: formData,
  }
);

          const data = await response.json();

          if (!response.ok || data.error) {
            alert(data.error || "Could not submit resolution evidence.");
            return;
          }

          setStatus(data.status);

          alert("Resolution evidence submitted successfully.");

          onUpdated();
        } catch (error) {
          console.error("Error submitting resolution:", error);
          alert("Could not connect to CityZen backend.");
        } finally {
          setSubmittingResolution(false);
        }
      }}
    >
      {submittingResolution
        ? "Submitting..."
        : "Submit Resolution Evidence"}
    </button>
  </div>
)}
      </section>
    </div>
  );
}

/* ─── On-site Photo Data ─── */


/* ─── Photo Carousel with inspection modal ─── */
function PhotoCarousel({ onSitePhotos }: { onSitePhotos: any[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [inspectPhoto, setInspectPhoto] = useState<typeof onSitePhotos[0] | null>(null);
  const [crewAssigned, setCrewAssigned] = useState(false);
  const [onSiteVerified, setOnSiteVerified] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % onSitePhotos.length), 3800);
    return () => clearInterval(t);
  }, []);

  if (!onSitePhotos.length) {
  return (
    <div style={{ marginBottom: 16, color: "#cbd5e1", fontSize: 12 }}>
      No on-site photos available.
    </div>
  );
}

const ph = onSitePhotos[activeIdx] ?? onSitePhotos[0];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <b style={{ fontSize: 13, color: "#1e293b" }}>
  Live On-Site Photos
</b>
          <span style={{ fontSize: 9, color: "#4ade80", fontFamily: "DM Mono" }}>● LIVE · {onSitePhotos.length} FEEDS</span>
        </div>
        <div className="photo-carousel" onClick={() => setInspectPhoto(ph)}>
          <div className="pc-photo" style={{ background: `linear-gradient(160deg,${ph.color}18,#1C2128)`, borderColor: ph.color + "40" }}>
            {ph.photo ? (
  <img
    src={`${API_BASE_URL}/uploads/${encodeURIComponent(ph.photo)}`}
    alt={ph.label}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
) : (
  <span style={{ fontSize: 42, opacity: .6 }}>{ph.icon}</span>
)}
            <div className="pc-overlay">
              <span className="pc-sev" style={{ background: ph.color + "30", color: ph.color, borderColor: ph.color + "60" }}>⚠ {ph.severity}</span>
              <b style={{ color: "#f1f5f9", fontSize: 13 }}>{ph.label}</b>
              <small style={{ color: "#94a3b8" }}>📍 {ph.zone} · {ph.time}</small>
              <span style={{ fontSize: 10, color: ph.color, marginTop: 4 }}>Tap to inspect →</span>
            </div>
          </div>
          <div className="pc-thumbs">
            {onSitePhotos.map((p, i) => (
              <div key={i} onClick={e => { e.stopPropagation(); setActiveIdx(i); }}
                className={`pc-thumb ${i === activeIdx ? "pc-thumb-active" : ""}`}
                style={{ borderColor: i === activeIdx ? p.color : "#2d3748", background: `linear-gradient(135deg,${p.color}15,#1C2128)` }}>
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <span style={{ fontSize: 8, color: p.color, marginTop: 2 }}>{p.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {inspectPhoto && (
        <div className="modal-backdrop" onClick={() => setInspectPhoto(null)}>
          <section className="dark-sheet" onClick={e => e.stopPropagation()}>
            <button className="sheet-close" style={{ color: "#94a3b8" }} onClick={() => setInspectPhoto(null)}>×</button>
            <div className="sheet-handle" style={{ background: "#94a3b8" }} />
            <span style={{ fontFamily: "DM Mono", fontSize: 9, color: inspectPhoto.color, letterSpacing: ".1em", display: "block", marginBottom: 4 }}>INSPECTION MODAL · {inspectPhoto.id}</span>
            <h2 style={{ color: "#f1f5f9", fontSize: 16, marginBottom: 12 }}>{inspectPhoto.label}</h2>

            {/* Photo placeholder */}
            <div style={{ height: 140, background: `linear-gradient(160deg,${inspectPhoto.color}20,#1C2128)`, border: `1px solid ${inspectPhoto.color}40`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative" }}>
              <span style={{ fontSize: 52, opacity: .5 }}>{inspectPhoto.icon}</span>
              <div style={{ position: "absolute", bottom: 8, left: 10, background: "rgba(0,0,0,.6)", borderRadius: 8, padding: "4px 10px", fontSize: 9, color: "#f1f5f9", fontFamily: "DM Mono" }}>
                {inspectPhoto.lat} · {inspectPhoto.lon}
              </div>
              <div style={{ position: "absolute", top: 8, right: 10 }}>
                <span className="pc-sev" style={{ background: inspectPhoto.color + "30", color: inspectPhoto.color, borderColor: inspectPhoto.color + "60", fontSize: 9, padding: "3px 8px", border: "1px solid", borderRadius: 20, fontWeight: 700, display: "block" }}>⚠ {inspectPhoto.severity}</span>
              </div>
            </div>

            {/* Geotag + AI */}
            <div style={{ background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 9, color: "#60a5fa", fontFamily: "DM Mono", background: "#1e3a5f", padding: "2px 8px", borderRadius: 6 }}>📍 GEO-TAG</span>
                <span style={{ fontSize: 9, color: "#a78bfa", fontFamily: "DM Mono", background: "#1a1040", padding: "2px 8px", borderRadius: 6 }}>🤖 AI ASSESSED</span>
              </div>
              <p style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 6, lineHeight: 1.5 }}>
                <b style={{ color: "#94a3b8" }}>Location:</b> {inspectPhoto.zone} · {inspectPhoto.lat}, {inspectPhoto.lon}
              </p>
              <p style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.5 }}>
                <b style={{ color: "#a78bfa" }}>AI Assessment:</b> {inspectPhoto.aiNote}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setCrewAssigned(true); setTimeout(() => setInspectPhoto(null), 800); }}
                style={{ flex: 1, padding: "11px 0", borderRadius: 12, background: crewAssigned ? "#063B28" : "#1C2128", color: crewAssigned ? "#4ade80" : "#f1f5f9", border: `1px solid ${crewAssigned ? "#4ade8040" : "#2d3748"}`, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {crewAssigned ? "✓ Crew Assigned" : "👷 Assign Crew"}
              </button>
              <button
                onClick={() => { setOnSiteVerified(true); setTimeout(() => setInspectPhoto(null), 800); }}
                style={{ flex: 1, padding: "11px 0", borderRadius: 12, background: onSiteVerified ? "#2d1f00" : "#FFC107", color: onSiteVerified ? "#FFC107" : "#0f1117", border: onSiteVerified ? "1px solid #FFC10740" : "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {onSiteVerified ? "✓ Verified" : "✓ Verify On-Site"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Authority() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"home" | "queue" | "map" | "ward" | "profile">("home");
  const [notifOpen, setNotifOpen] = useState(false);
  const [detailReport, setDetailReport] = useState<AuthReport | null>(null);
  const [authorityStatus, setAuthorityStatus] = useState("");
const [resolutionDescription, setResolutionDescription] = useState("");
const [resolutionPhoto, setResolutionPhoto] = useState<File | null>(null);
const [savingStatus, setSavingStatus] = useState(false);
const [savingResolution, setSavingResolution] = useState(false);
useEffect(() => {
  if (detailReport) {
    setAuthorityStatus(detailReport.status || "");
    setResolutionDescription(detailReport.resolution_description || "");
    setResolutionPhoto(null);
  }
}, [detailReport]);
  const [queueFilter, setQueueFilter] = useState<"All" | "Critical" | "High Priority" | "Pending" | "Resolved">("All");
  const [backendComplaints, setBackendComplaints] = useState<any[]>([]);
  const severityLevels = ["Critical", "High", "Medium", "Low"];

const onSitePhotos = severityLevels.map((severity) => {
  const complaint = backendComplaints
    .map((r) => {
      const category = (r.category || "").toLowerCase();

      let calculatedSeverity = "Low";

      if (
        category === "sanitation" ||
        category === "sewage" ||
        category === "water"
      ) {
        calculatedSeverity = "Critical";
      } else if (
        category === "roads" ||
        category === "pothole"
      ) {
        calculatedSeverity = "High";
      } else if (
        category === "streetlights" ||
        category === "streetlight"
      ) {
        calculatedSeverity = "Medium";
      }

      return { ...r, calculatedSeverity };
    })
    .find((r) => r.calculatedSeverity === severity);

  const icon =
    severity === "Critical"
      ? "🚨"
      : severity === "High"
      ? "⚠️"
      : severity === "Medium"
      ? "🔧"
      : "ℹ️";

  const color =
    severity === "Critical"
      ? "#f87171"
      : severity === "High"
      ? "#FFC107"
      : severity === "Medium"
      ? "#60a5fa"
      : "#4ade80";

  return {
    id: complaint?.complaint_id || `placeholder-${severity}`,
    label: complaint?.category || "No current reports",
    zone: complaint?.location || "No current reports",
    time: complaint ? "Recent" : "—",
    severity,
    lat: "",
    lon: "",
    aiNote: "",
    icon,
    color,
    photo: complaint?.complaint_photo || null,
  };
});
  
  async function loadComplaints() {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints`);
    const data = await response.json();
    setBackendComplaints(data);
  } catch (error) {
    console.error("Error loading complaints:", error);
  }
}
async function saveAuthorityStatus() {
  if (!detailReport || !authorityStatus) return;

  setSavingStatus(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/complaints/${detailReport.complaint_id}/status?status=${encodeURIComponent(authorityStatus)}`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Could not update status.");
      return;
    }

    setDetailReport({
      ...detailReport,
      status: authorityStatus,
    });

    setBackendComplaints((previous) =>
      previous.map((r) =>
        r.complaint_id === detailReport.complaint_id
          ? { ...r, status: authorityStatus }
          : r
      )
    );

    alert("Status updated successfully.");
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Could not update status.");
  } finally {
    setSavingStatus(false);
  }
}

async function saveResolution() {
  if (!detailReport) return;

  setSavingResolution(true);

  try {
    const formData = new FormData();

    formData.append("description", resolutionDescription);

    if (resolutionPhoto) {
      formData.append("photo", resolutionPhoto);
    }

    const response = await fetch(
      `${API_BASE_URL}/complaints/${detailReport.complaint_id}/resolution`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.detail || "Could not save resolution.");
      return;
    }

    setDetailReport({
      ...detailReport,
      resolution_description: resolutionDescription,
      resolution_photo: resolutionPhoto
        ? resolutionPhoto.name
        : detailReport.resolution_photo,
      status: "Resolution Submitted",
    });

    setBackendComplaints((previous) =>
      previous.map((r) =>
        r.complaint_id === detailReport.complaint_id
          ? {
              ...r,
              status: "Resolution Submitted",
              resolution_description: resolutionDescription,
              resolution_photo: resolutionPhoto
                ? resolutionPhoto.name
                : r.resolution_photo,
            }
          : r
      )
    );

    alert("Resolution saved successfully.");
  } catch (error) {
    console.error("Error saving resolution:", error);
    alert("Could not save resolution.");
  } finally {
    setSavingResolution(false);
  }
}
  useEffect(() => {
  loadComplaints();
}, []);
  return (
    <main className="app-shell dark-shell">
      {detailReport && (
  <AuthorityReportSheet
    r={detailReport}
    onClose={() => setDetailReport(null)}
    onUpdated={loadComplaints}
  />
)}
      <div className="mauth-header" style={{ background: "#0a0d12", borderBottom: "1px solid #1e293b" }}>
        <CityZenLogo size="sm" />
        <div style={{ background: "#1C2128", borderRadius: 10, padding: "4px 10px", marginLeft: 8, fontSize: 10, color: "#60a5fa", fontFamily: "DM Mono" }}>AUTH-DEL-042 · Ward 23</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button className="dk-icon-btn" style={{ position: "relative" }} onClick={() => setNotifOpen(!notifOpen)}>🔔<i className="dk-badge" /></button>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#063B28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#4ade80", fontWeight: 700 }}>OS</div>
        </div>
      </div>

      {notifOpen && (
        <div className="dk-dropdown" style={{ top: 54 }}>
          <div className="dk-dropdown-head"><b>Notifications</b><button style={{ background: "none", color: "#cbd5e1" }} onClick={() => setNotifOpen(false)}>✕</button></div>
          <div className="dk-dropdown-row" style={{ color: "#f87171" }}>⚡ RPT-2092 auto-escalated · 451 upvotes</div>
          <div className="dk-dropdown-row" style={{ color: "#4ade80" }}>✓ RPT-2089 community-verified fixed</div>
        </div>
      )}

      <div className="status-bar" style={{ background: "#0a0d12", borderBottom: "1px solid #1e293b" }}>
        <span className="sb-live" style={{ color: "#4ade80" }}><i className="net-dot on" />Live</span>
        <span className="sb-city" style={{ color: "#94a3b8" }}>Authority Portal · Delhi South</span>
        <span className="sb-pts" style={{ color: "#FFC107" }}>✦ Verified</span>
      </div>

      {tab === "home" && (
        <div className="screen dk-screen">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ color: "#64748b" }}>{b.label}</span>
        <span style={{ color: "#64748b" }}>{pct}%</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 14 }}>
            {[
  [
    backendComplaints.length.toString(),
    "Complaints",
    "#60a5fa",
  ],
  [
    backendComplaints
      .filter((r) => r.status === "Resolved")
      .length
      .toString(),
    "Resolved",
    "#4ade80",
  ],
  [
    backendComplaints
      .filter((r) => r.status !== "Resolved")
      .length
      .toString(),
    "Pending",
    "#FFC107",
  ],
  [
    "N/A",
    "Overdue",
    "#f87171",
  ],
].map(([v, l, c]) => (
              <div
  key={l}
  style={{
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "12px 14px",
    borderTop: `3px solid ${c}`,
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
  }}
>
                <b style={{ color: c, fontSize: 22, display: "block" }}>{v}</b>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>{l}</span>
              </div>
            ))}
          </div>
          <div
  style={{
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 14,
  }}
>
  <span style={{ fontSize: 9, color: "#FFC107", fontFamily: "DM Mono", letterSpacing: ".1em", display: "block", marginBottom: 8 }}>
    NEEDS ATTENTION
  </span>

  <div style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 12, color: "#FFC107" }}>
  ⚠ {backendComplaints.filter((r) => Number(r.is_recurring) === 1).length} recurring infrastructure problems
</div>

  <div style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 12, color: "#FFC107" }}>
    ⚠ {backendComplaints.filter((r) => r.status === "Overdue").length} overdue reports past SLA
  </div>
</div>
          <b
  style={{
    fontSize: 13,
    color: "#1e293b",
    display: "block",
    marginBottom: 10,
  }}
>
  Domain Analytics
</b>
          {[
  { label: "Garbage", color: "#4ade80" },
  { label: "Roads", color: "#FFC107" },
  { label: "Streetlights", color: "#60a5fa" },
  { label: "Sewage", color: "#f87171" },
  { label: "Water", color: "#38bdf8" },
].map((b, i) => {
  const count = backendComplaints.filter((r) => {
  const category = (r.category || "").toLowerCase();

  if (b.label === "Roads") {
    return category === "roads" || category === "pothole";
  }

  if (b.label === "Sewage") {
    return category === "sewage" || category === "sanitation";
  }

  if (b.label === "Water") {
    return category === "water";
  }

  if (b.label === "Streetlights") {
    return category === "streetlights" || category === "streetlight";
  }

  if (b.label === "Garbage") {
    return category === "garbage" || category === "garbage pile";
  }

  return false;
}).length;

  const pct =
    backendComplaints.length > 0
      ? Math.round((count / backendComplaints.length) * 100)
      : 0;

  return (
    <div key={i} style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          marginBottom: 3,
        }}
      >
        <span style={{ color: "#64748b" }}>{b.label}</span>
        <span style={{ color: "#64748b" }}>{pct}%</span>
      </div>
                

      <div
        style={{
          height: 8,
          background: "e2e8f0",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: b.color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
})}
          {backendComplaints.some((r) => Number(r.is_recurring) === 1) && (
            <div style={{ marginBottom: 14 }}>
              <b
                style={{
                  fontSize: 13,
                  color: "#1e293b",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                Recurring Issues
              </b>

              {backendComplaints
                .filter((r) => Number(r.is_recurring) === 1)
                .map((r) => (
                  <button
                    key={r.complaint_id}
                    onClick={() => setDetailReport(r)}
                    style={{
                      width: "100%",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderLeft: "3px solid #d97706",
                      borderRadius: 12,
                      padding: "12px 14px",
                      marginBottom: 8,
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>⚠️</span>

                      <div style={{ flex: 1 }}>
                        <b
                          style={{
                            fontSize: 12,
                            color: "#000000",
                            display: "block",
                          }}
                        >
                          {r.category}
                        </b>

                        <small
                          style={{
                            color: "#64748b",
                            display: "block",
                            marginTop: 3,
                          }}
                        >
                          📍 {r.location}
                        </small>

                        <small
                          style={{
                            color: "#b45309",
                            display: "block",
                            marginTop: 4,
                          }}
                        >
                          ↳ Recurring from complaint #{r.recurring_of}
                        </small>
                      </div>

                      <span style={{ color: "#d97706", fontSize: 18 }}>›</span>
                    </div>
                  </button>
                ))}
            </div>
          )}

          <PhotoCarousel onSitePhotos={onSitePhotos} />
        
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0 10px" }}>
            <b style={{ fontSize: 13, color: "#f1f5f9" }}>Recent Reports</b>
            <button style={{ background: "none", border: "none", color: "#FFC107", fontSize: 12, cursor: "pointer" }} onClick={() => setTab("queue")}>All →</button>
          </div>
          {backendComplaints.slice(0, 3).map(r => (
  <button
    key={r.complaint_id}
    onClick={() => setDetailReport(r)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      background: "#ffffff",
border: "1px solid #e2e8f0",
      borderRadius: 12,
      padding: "12px 14px",
      marginBottom: 8,
      cursor: "pointer",
      textAlign: "left"
    }}
  >
    <span style={{ fontSize: 22 }}>📋</span>

    <div style={{ flex: 1 }}>
      <b
        style={{
          fontSize: 12,
          color: "#f1f5f9",
          display: "block"
        }}
      >
        {r.category}
      </b>

      <small style={{ color: "#cbd5e1" }}>
        📍 {r.location}
      </small>

      <div style={{ marginTop: 4 }}>
        <span
          style={{
            fontSize: 9,
            color: "#60a5fa",
            background: "#eff6ff",
            padding: "2px 6px",
            borderRadius: 6
          }}
        >
          {r.status}
        </span>
      </div>
    </div>

    <span style={{ color: "#FFC107" }}>›</span>
  </button>
))}
        </div>
      )}

      {tab === "queue" && (() => {
        const filterDefs: { label: string; key: typeof queueFilter; color: string }[] = [
          { label: "All", key: "All", color: "#94a3b8" },
          { label: "🔴 Critical", key: "Critical", color: "#f87171" },
          { label: "🟠 High", key: "High Priority", color: "#FFC107" },
          { label: "🔵 Pending", key: "Pending", color: "#60a5fa" },
          { label: "✓ Resolved", key: "Resolved", color: "#4ade80" },
        ];
        const filtered =
  queueFilter === "All"
    ? backendComplaints
    : backendComplaints.filter(r => {
        if (queueFilter === "Resolved") {
          return r.status === "Resolved";
        }

        if (queueFilter === "Pending") {
          return r.status === "Reported" || r.status === "Under Review";
        }

        return true;
      });
        return (
          <div className="screen dk-screen">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <h2 style={{ color: "#f1f5f9" }}>Issue Queue</h2>
              <span style={{ fontSize: 11, color: "#cbd5e1" }}>Ward 23 · {filtered.length} shown</span>
            </div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 10 }}>
              {filterDefs.map(f => (
                <button key={f.key} onClick={() => setQueueFilter(f.key)}
                  style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: "pointer",
                    background: queueFilter === f.key ? f.color + "25" : "#1C2128",
                    color: queueFilter === f.key ? f.color : "#cbd5e1",
                    border: `1px solid ${queueFilter === f.key ? f.color + "60" : "#2d3748"}` }}>
                  {f.label}
                </button>
              ))}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                <b style={{ fontSize: 13 }}>No issues in this category</b>
              </div>
            )}
            {filtered.map(r => (
  <button
    key={r.complaint_id}
    onClick={() => setDetailReport(r)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      background: "#e2e8f0",
      border: "1px solid #2d3748",
      borderRadius: 12,
      padding: "12px 14px",
      marginBottom: 8,
      cursor: "pointer",
      textAlign: "left"
    }}
  >
    <span style={{ fontSize: 22 }}>📋</span>

    <div style={{ flex: 1 }}>
      <b
        style={{
          fontSize: 12,
          color: "#1e293b",
          display: "block"
        }}
      >
        {r.category}
      </b>

      <small style={{ color: "#cbd5e1" }}>
        📍 {r.location}
      </small>

      <div style={{ marginTop: 4 }}>
        <span
          style={{
            fontSize: 9,
            color: "#60a5fa",
            background: "#1e3a5f",
            padding: "2px 6px",
            borderRadius: 6
          }}
        >
          {r.status}
        </span>
      </div>
    </div>

    <span style={{ color: "#FFC107" }}>›</span>
  </button>
))}
          </div>
        );
      })()}

      {tab === "map" && (
        <div className="screen dk-screen">
          <h2 style={{ color: "#f1f5f9", marginBottom: 12 }}>City Issue Map</h2>
          <DarkCityMap height={260} />
          <b style={{ fontSize: 13, color: "#f1f5f9", display: "block", margin: "16px 0 10px" }}>Domain Breakdown</b>
          {[["Roads", 26, "#FFC107"], ["Sanitation", 32, "#4ade80"], ["Electricity", 18, "#60a5fa"], ["Water", 10, "#38bdf8"]].map(([l, p, c]) => (
            <div key={String(l)} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: "#94a3b8" }}>{l}</span><span style={{ color: "#94a3b8" }}>{p}%</span>
              </div>
              <div style={{ height: 8, background: "#1C2128", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${p}%`, height: "100%", background: c as string, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "ward" && (
        <div className="screen dk-screen">
          <h2 style={{ color: "#f1f5f9", marginBottom: 14 }}>Ward Challenge</h2>

          {/* Real-time metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { v: "287", label: "Total Resolved", color: "#4ade80", icon: "✓" },
              { v: "43", label: "Active Unresolved", color: "#f87171", icon: "⚠" },
              { v: "19", label: "Pending Action", color: "#FFC107", icon: "⏳" },
            ].map(m => (
              <div key={m.label} style={{ background: "#1C2128", border: `1px solid ${m.color}30`, borderRadius: 12, padding: "10px 8px", textAlign: "center", borderTop: `3px solid ${m.color}` }}>
                <span style={{ fontSize: 10, color: m.color }}>{m.icon}</span>
                <b style={{ color: m.color, fontSize: 20, display: "block", fontFamily: "DM Mono" }}>{m.v}</b>
                <span style={{ fontSize: 9, color: "#cbd5e1", lineHeight: 1.3, display: "block" }}>{m.label}</span>
              </div>
            ))}
          </div>

          {/* Challenge banner */}
          <div style={{ background: "#2d1f0040", border: "1px solid #FFC10740", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
            <b style={{ color: "#FFC107", fontSize: 13 }}>🏆 September Challenge</b>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>Reduce unresolved issues by 20% to earn the Gold Ward Badge and unlock ₹2L infrastructure funds.</p>
          </div>

          {/* Top-performing wards */}
          <b style={{ fontSize: 12, color: "#f1f5f9", display: "block", marginBottom: 10 }}>🏅 Top Performing Wards</b>
          {[
            { ward: "Ward 23 · Vasant Vihar", pct: 82, color: "#4ade80", rank: 1, resolved: 287, tag: "GOLD" },
            { ward: "Ward 14 · Lajpat Nagar", pct: 64, color: "#FFC107", rank: 2, resolved: 201, tag: "SILVER" },
            { ward: "Ward 31 · Safdarjung", pct: 51, color: "#60a5fa", rank: 3, resolved: 159, tag: "BRONZE" },
          ].map(w => (
            <div key={w.ward} style={{ background: "#1C2128", border: "1px solid #2d3748", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                <b style={{ fontFamily: "DM Mono", color: w.color }}>#{w.rank}</b>
                <b style={{ flex: 1, fontSize: 12, color: "#f1f5f9" }}>{w.ward}</b>
                <span style={{ fontSize: 9, color: w.color, background: w.color + "20", border: `1px solid ${w.color}40`, borderRadius: 6, padding: "2px 7px", fontWeight: 700 }}>{w.tag}</span>
              </div>
              <div style={{ height: 7, background: "#0f1117", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ width: `${w.pct}%`, height: "100%", background: w.color, borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#cbd5e1" }}>
                <span>{w.pct}% of target</span>
                <span>{w.resolved} resolved</span>
              </div>
            </div>
          ))}

          {/* High-problem zones */}
          <b style={{ fontSize: 12, color: "#f87171", display: "block", margin: "14px 0 10px" }}>⚠ High-Problem Zones</b>
          {[
            { ward: "Ward 08 · Okhla Phase II", issues: 94, delta: "+12 this week", color: "#f87171" },
            { ward: "Ward 19 · Tughlakabad", issues: 76, delta: "+8 this week", color: "#fb923c" },
            { ward: "Ward 05 · Kalkaji", issues: 61, delta: "+5 this week", color: "#FFC107" },
          ].map(w => (
            <div key={w.ward} style={{ background: "#1C2128", border: `1px solid ${w.color}30`, borderRadius: 12, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: w.color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>🔴</span>
              </div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 11, color: "#f1f5f9", display: "block" }}>{w.ward}</b>
                <span style={{ fontSize: 10, color: "#cbd5e1" }}>{w.delta}</span>
              </div>
              <b style={{ color: w.color, fontFamily: "DM Mono", fontSize: 18 }}>{w.issues}</b>
            </div>
          ))}

          {/* Govt Benchmark */}
          <div style={{ background: "linear-gradient(135deg,#063B2820,#1C2128)", border: "1px solid #4ade8030", borderRadius: 12, padding: "14px", marginTop: 14 }}>
            <b style={{ fontSize: 12, color: "#4ade80", display: "block", marginBottom: 8 }}>📊 Govt. Benchmark — Delhi 2026</b>
            {[
              { label: "Avg Resolution Target", val: "4.2 hrs", icon: "⏱", color: "#60a5fa" },
              { label: "Min Ward Resolution Rate", val: "75%", icon: "📈", color: "#4ade80" },
              { label: "Emergency Response SLA", val: "45 min", icon: "🚨", color: "#f87171" },
            ].map(b => (
              <div key={b.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderTop: "1px solid rgba(255,255,255,.05)" }}>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>{b.icon} {b.label}</span>
                <b style={{ fontSize: 12, color: b.color, fontFamily: "DM Mono" }}>{b.val}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className="screen dk-screen">
          <div style={{ background: "linear-gradient(135deg,#063B28,#FFC10730)", borderRadius: 16, padding: "20px 18px", marginBottom: 16, color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#2d1f00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏛</div>
              <div>
                <b style={{ fontSize: 16, color: "#FFC107", fontFamily: "DM Mono" }}>AUTH-DEL-042</b>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>Ward Officer · Delhi South</p>
              </div>
              <div style={{ marginLeft: "auto", background: "#063B28", color: "#4ade80", borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 700, border: "1px solid #4ade8040" }}>✓ VERIFIED</div>
            </div>
            {[["Domain", "Roads & Infrastructure"], ["Jurisdiction", "Ward 23 · Vasant Vihar"], ["Active Since", "Jan 2024"], ["Reports Handled", "342"]].map(([k, v]) => (
              <div key={String(k)} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>{k}</span>
                <b style={{ fontSize: 12, color: "#f1f5f9" }}>{v}</b>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[["287", "Resolved", "#4ade80"], ["2.4d", "Avg Time", "#FFC107"], ["4.7★", "Rating", "#60a5fa"]].map(([v, l, c]) => (
              <div
  key={l}
  style={{
    background: "#ffffff",
    border: `1px solid ${c}30`,
    borderRadius: 12,
    padding: "12px 14px",
    borderTop: `3px solid ${c}`,
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
  }}
>
                <b style={{ color: c, fontSize: 18, display: "block" }}>{v}</b>
                <span style={{ fontSize: 10, color: "#cbd5e1" }}>{l}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/welcome")} style={{ width: "100%", marginTop: 20, background: "none", border: "1px solid #f8717140", borderRadius: 12, padding: "12px", color: "#f87171", fontSize: 13, cursor: "pointer" }}>↩ Log out</button>
        </div>
      )}

      <nav className="bottom-nav dark-nav">
        {([["home", "⊞", "Overview"], ["queue", "◈", "Queue"], ["map", "🗺", "Map"], ["ward", "🏆", "Ward"], ["profile", "🏛", "Profile"]] as [typeof tab, string, string][]).map(([id, icon, label]) => (
          <button key={id} className={`nav-item ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function RootRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/welcome"); }, [navigate]);
  return null;
}

export const router = createBrowserRouter([
  { path: "/welcome", Component: Welcome },
  { path: "/verify", Component: CitizenVerify },
  { path: "/authority-login", Component: AuthorityLogin },
  { path: "/authority", Component: Authority },
  {
    path: "/app",
    Component: Shell,
    children: [
      { index: true, Component: Home },
      { path: "social", Component: Social },
      { path: "volunteer", Component: Volunteer },
      { path: "profile", Component: Profile },
    ],
  },
  { path: "/", Component: RootRedirect },
]);
