"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

interface Driver {
  id: string;
  name: string;
  phone?: string;
  vanSize: string;
  isActive: boolean;
  user: { id: string; name: string; email: string };
}

interface DriverEarnings {
  total: number;
  thisMonth: number;
  unpaid: number;
  paid: number;
}

const VAN_SIZES = ["SMALL", "MEDIUM", "LARGE", "LUTON"];

type Modal = null | "add" | { type: "edit"; driver: Driver } | { type: "reset"; driver: Driver };

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pay config
  const [payPct, setPayPct] = useState(60);
  const [payMin, setPayMin] = useState(25);
  const [payConfigSaving, setPayConfigSaving] = useState(false);
  const [payConfigMsg, setPayConfigMsg] = useState("");

  // Per-driver earnings cache
  const [earnings, setEarnings] = useState<Record<string, DriverEarnings>>({});
  const [markingPaid, setMarkingPaid] = useState<string | null>(null);

  // Add form
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addVan, setAddVan] = useState("MEDIUM");
  const [tempPassword, setTempPassword] = useState("");

  // Edit form
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editVan, setEditVan] = useState("MEDIUM");

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ drivers: Driver[] }>("/admin/drivers");
    if (res.success && res.data) setDrivers(res.data.drivers ?? []);
    setLoading(false);
  }, []);

  const fetchPayConfig = useCallback(async () => {
    const res = await api.get<{ percentage: number; minimum: number }>("/admin/drivers/pay-config");
    if (res.success && res.data) {
      setPayPct(res.data.percentage);
      setPayMin(res.data.minimum);
    }
  }, []);

  async function fetchEarnings(driverId: string) {
    const res = await api.get<DriverEarnings>(`/admin/drivers/${driverId}/earnings`);
    if (res.success && res.data) setEarnings((e) => ({ ...e, [driverId]: res.data! }));
  }

  async function savePayConfig() {
    setPayConfigSaving(true); setPayConfigMsg("");
    const res = await api.patch("/admin/drivers/pay-config", { percentage: payPct, minimum: payMin });
    setPayConfigMsg(res.success ? "Saved!" : (res.error ?? "Failed"));
    setTimeout(() => setPayConfigMsg(""), 3000);
    setPayConfigSaving(false);
  }

  async function markDriverPaid(driverId: string) {
    setMarkingPaid(driverId);
    const res = await api.post<{ markedPaid: number }>(`/admin/drivers/${driverId}/mark-paid`, {});
    if (res.success) {
      await fetchEarnings(driverId);
    }
    setMarkingPaid(null);
  }

  useEffect(() => {
    fetchDrivers();
    fetchPayConfig();
  }, [fetchDrivers, fetchPayConfig]);

  useEffect(() => {
    drivers.forEach((d) => fetchEarnings(d.id));
  }, [drivers]);

  function openEdit(driver: Driver) {
    setEditName(driver.user.name);
    setEditPhone(driver.phone ?? "");
    setEditVan(driver.vanSize);
    setError(""); setSuccess("");
    setModal({ type: "edit", driver });
  }

  async function addDriver() {
    setSaving(true); setError(""); setTempPassword("");
    const res = await api.post<{ user: Driver; tempPassword: string }>("/admin/drivers", {
      name: addName, email: addEmail, phone: addPhone, vanSize: addVan,
    });
    if (res.success && res.data) {
      setTempPassword(res.data.tempPassword ?? "");
      await fetchDrivers();
      setAddName(""); setAddEmail(""); setAddPhone(""); setAddVan("MEDIUM");
    } else setError(res.error ?? "Failed to add driver");
    setSaving(false);
  }

  async function editDriver(driver: Driver) {
    setSaving(true); setError("");
    const res = await api.patch(`/admin/drivers/${driver.id}`, { name: editName, phone: editPhone, vanSize: editVan });
    if (res.success) { await fetchDrivers(); setSuccess("Driver updated."); }
    else setError(res.error ?? "Failed to update");
    setSaving(false);
  }

  async function resetPassword(driver: Driver) {
    setSaving(true); setError(""); setTempPassword("");
    const res = await api.post<{ tempPassword: string }>(`/admin/drivers/${driver.id}/reset-password`, {});
    if (res.success && res.data) setTempPassword(res.data.tempPassword ?? "");
    else setError(res.error ?? "Failed to reset password");
    setSaving(false);
  }

  async function toggleActive(driver: Driver) {
    await api.patch(`/admin/drivers/${driver.id}/status`, { isActive: !driver.isActive });
    setDrivers((d) => d.map((x) => x.id === driver.id ? { ...x, isActive: !x.isActive } : x));
  }

  return (
    <div className="space-y-6">
      {/* Pay Config */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-4">💷 Driver Pay Settings</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Pay % of customer price</label>
            <div className="flex items-center gap-1">
              <input type="number" min={1} max={100} value={payPct} onChange={(e) => setPayPct(Number(e.target.value))} className="w-20 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Minimum pay per job (£)</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-500">£</span>
              <input type="number" min={0} value={payMin} onChange={(e) => setPayMin(Number(e.target.value))} className="w-24 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={savePayConfig} disabled={payConfigSaving} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-lg disabled:opacity-50">
              {payConfigSaving ? "Saving…" : "Save Config"}
            </button>
            {payConfigMsg && <span className={`text-sm font-semibold ${payConfigMsg === "Saved!" ? "text-emerald-600" : "text-red-600"}`}>{payConfigMsg}</span>}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">Auto-calculated when publishing jobs. Maximum of (price × %) or £{payMin} minimum.</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{drivers.length} drivers total</p>
        <button onClick={() => { setModal("add"); setError(""); setSuccess(""); setTempPassword(""); }}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
          + Add Driver
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Van</th>
                  <th className="px-4 py-3 text-right">Total Earned</th>
                  <th className="px-4 py-3 text-right">Unpaid</th>
                  <th className="px-4 py-3 text-center">Active</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {drivers.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No drivers yet</td></tr>
                ) : drivers.map((d) => {
                  const e = earnings[d.id];
                  return (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{d.user.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{d.user.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{d.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{d.vanSize}</td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-slate-700">{e ? `£${e.total.toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={`text-sm font-mono font-semibold ${e && e.unpaid > 0 ? "text-amber-600" : "text-slate-400"}`}>
                          {e ? `£${e.unpaid.toFixed(2)}` : "—"}
                        </span>
                        {e && e.unpaid > 0 && (
                          <button
                            onClick={() => markDriverPaid(d.id)}
                            disabled={markingPaid === d.id}
                            className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-2 py-0.5 rounded transition-colors disabled:opacity-50"
                          >
                            {markingPaid === d.id ? "…" : "Mark Paid"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(d)}
                        className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${d.isActive ? "bg-emerald-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${d.isActive ? "translate-x-4" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(d)} className="text-xs font-medium text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50">Edit</button>
                        <button onClick={() => { setModal({ type: "reset", driver: d }); setError(""); setTempPassword(""); }} className="text-xs font-medium text-amber-600 border border-amber-200 rounded px-2 py-1 hover:bg-amber-50">Reset PW</button>
                      </div>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <ModalWrapper title="Add Driver" onClose={() => setModal(null)}>
          {error && <ErrorBanner msg={error} />}
          {tempPassword && <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">Temp password: <span className="font-mono font-bold">{tempPassword}</span></div>}
          <InputField label="Name" value={addName} onChange={setAddName} />
          <InputField label="Email" value={addEmail} onChange={setAddEmail} type="email" />
          <InputField label="Phone" value={addPhone} onChange={setAddPhone} type="tel" />
          <SelectField label="Van Size" value={addVan} onChange={setAddVan} options={VAN_SIZES} />
          <button onClick={addDriver} disabled={saving || !addName || !addEmail} className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-2 rounded-lg disabled:opacity-50">
            {saving ? "Adding…" : "Add Driver"}
          </button>
        </ModalWrapper>
      )}

      {/* Edit Modal */}
      {modal !== null && typeof modal === "object" && modal.type === "edit" && (
        <ModalWrapper title={`Edit — ${modal.driver.user.name}`} onClose={() => setModal(null)}>
          {error && <ErrorBanner msg={error} />}
          {success && <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-800">{success}</div>}
          <InputField label="Name" value={editName} onChange={setEditName} />
          <InputField label="Phone" value={editPhone} onChange={setEditPhone} type="tel" />
          <SelectField label="Van Size" value={editVan} onChange={setEditVan} options={VAN_SIZES} />
          <button onClick={() => editDriver(modal.driver)} disabled={saving} className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </ModalWrapper>
      )}

      {/* Reset Password Modal */}
      {modal !== null && typeof modal === "object" && modal.type === "reset" && (
        <ModalWrapper title={`Reset Password — ${modal.driver.user.name}`} onClose={() => setModal(null)}>
          {error && <ErrorBanner msg={error} />}
          {tempPassword ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800 space-y-1">
              <p className="font-semibold">New temporary password:</p>
              <p className="font-mono text-lg font-bold">{tempPassword}</p>
              <p className="text-xs text-emerald-600">Share this with the driver — they should change it after logging in.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600">Generate a new temporary password for <span className="font-semibold">{modal.driver.user.name}</span>?</p>
              <button onClick={() => resetPassword(modal.driver)} disabled={saving} className="w-full bg-amber-500 text-white font-semibold py-2 rounded-lg hover:bg-amber-600 disabled:opacity-50">
                {saving ? "Resetting…" : "Reset Password"}
              </button>
            </>
          )}
        </ModalWrapper>
      )}
    </div>
  );
}

function ModalWrapper({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{msg}</div>;
}
