"use client";

const cardStyle = { background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" };

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Section title="Business Information">
        <Row label="Company Name" defaultValue="Speedy Van" />
        <Row label="Phone" defaultValue="07909 032889" />
        <Row label="Email" defaultValue="support@speedyvan.uk" />
        <Row label="Website" defaultValue="https://www.speedyvan.uk" />
      </Section>

      <Section title="Job Board Settings">
        <Toggle label="Enable public job board" defaultChecked />
        <Toggle label="Auto-publish new bookings" />
        <Toggle label="Notify drivers via email" defaultChecked />
      </Section>

      <Section title="Cancellation Policy">
        <Row label="Free cancellation window (hours)" defaultValue="24" type="number" />
        <Row label="Cancellation fee (£)" defaultValue="15.00" type="number" />
      </Section>

      <Section title="Notifications">
        <Toggle label="Email on new booking" defaultChecked />
        <Toggle label="Email on cancellation" defaultChecked />
        <Toggle label="Push notifications (admin)" />
      </Section>

      <div className="flex gap-3">
        <button className="text-black font-black text-sm px-6 py-2.5 rounded-lg transition-colors" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
          Save Settings
        </button>
        <p className="text-xs text-white/40 self-center">Settings are stored per-environment. Connect to the API to persist.</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5 space-y-4" style={cardStyle}>
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider pb-2 border-b border-amber-900/20">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm text-white/55 w-56 flex-shrink-0">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="flex-1 px-3 py-2 text-sm border border-amber-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-white bg-white/5 placeholder-white/30"
      />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="relative w-9 h-5 rounded-full bg-white/20 peer-checked:bg-amber-500 transition-colors">
        <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
      <span className="text-sm text-white/55">{label}</span>
    </label>
  );
}
