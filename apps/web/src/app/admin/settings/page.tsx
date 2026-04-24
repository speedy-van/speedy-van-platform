"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Section title="Business Information">
        <Row label="Company Name" defaultValue="Speedy Van" />
        <Row label="Phone" defaultValue="01202 129746" />
        <Row label="Email" defaultValue="support@speedy-van.co.uk" />
        <Row label="Website" defaultValue="https://speedy-van.co.uk" />
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
        <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors">
          Save Settings
        </button>
        <p className="text-xs text-slate-400 self-center">Settings are stored per-environment. Connect to the API to persist.</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider pb-2 border-b border-slate-100">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm text-slate-600 w-56 flex-shrink-0">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="relative w-9 h-5 rounded-full bg-slate-200 peer-checked:bg-blue-500 transition-colors">
        <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
