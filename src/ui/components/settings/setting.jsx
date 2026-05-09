import { useState, useRef } from "react";

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-4">{children}</h2>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, readOnly }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all placeholder-slate-300"
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? "bg-blue-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Checkbox({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
        checked
          ? "bg-blue-600 border-blue-600"
          : disabled
          ? "border-slate-200 bg-slate-50 cursor-not-allowed"
          : "border-slate-300 hover:border-blue-400"
      }`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}

function SpinnerInput({ value, onChange, unit }) {
  return (
    <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5 bg-white w-28">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 w-12 text-sm font-bold text-slate-700 outline-none text-center"
        min={0}
      />
      <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
    </div>
  );
}

function DollarInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1.5 bg-white w-28">
      <span className="text-sm text-slate-400 font-bold">$</span>
      <input
        type="number"
        value={value}
        step="0.1"
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 w-12 text-sm font-bold text-slate-700 outline-none text-center"
        min={0}
      />
    </div>
  );
}

function SaveBar({ onDiscard, onSave }) {
  return (
    <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-5 mt-6">
      <button
        onClick={onDiscard}
        className="text-sm text-slate-500 font-semibold hover:text-slate-700 transition-colors"
      >
        Discard Changes
      </button>
      <button
        onClick={onSave}
        className="bg-slate-800 hover:bg-slate-900 active:scale-[0.98] text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
      >
        Save All Settings
      </button>
    </div>
  );
}

function Toast({ message, type = "success", onClose }) {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-red-50 border-red-200 text-red-700",
  };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 border rounded-xl px-4 py-3 text-sm shadow-lg ${styles[type]}`}>
      <span className="font-bold">{type === "success" ? "✓" : "✕"}</span>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 font-bold">✕</button>
    </div>
  );
}

// ─── Tab Nav ──────────────────────────────────────────────────────────────────

const NAV_TABS = [
  { id: "general", label: "General", icon: "⚙" },
  { id: "library", label: "Library Rules", icon: "📋" },
  { id: "permissions", label: "Permissions", icon: "🔑" },
  { id: "security", label: "Security", icon: "🛡" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
  { id: "preferences", label: "Preferences", icon: "👤" },
];

function TabNav({ active, onChange }) {
  return (
    <nav className="flex flex-col gap-0.5 w-44 flex-shrink-0">
      {NAV_TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            active === tab.id
              ? "bg-blue-50 text-blue-700 font-semibold"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          }`}
        >
          <span className="text-base leading-none">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

// ─── General Settings ─────────────────────────────────────────────────────────

const TIMEZONES = [
  "UTC-05:00 Eastern Time (US & Canada)",
  "UTC-06:00 Central Time (US & Canada)",
  "UTC-07:00 Mountain Time (US & Canada)",
  "UTC-08:00 Pacific Time (US & Canada)",
  "UTC+00:00 London",
  "UTC+01:00 Paris",
  "UTC+05:30 Karachi / Lahore",
];

function LogoUploader({ logo, onUpload, onRemove }) {
  const inputRef = useRef();
  return (
    <div className="flex items-start gap-4">
      <div
        onClick={() => inputRef.current.click()}
        className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors flex-shrink-0 overflow-hidden"
      >
        {logo ? (
          <img src={logo} alt="logo" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <span className="text-2xl text-slate-300">🖼</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.svg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) onUpload(URL.createObjectURL(file));
          }}
        />
      </div>
      <div>
        <p
          onClick={() => inputRef.current.click()}
          className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline"
        >
          Upload Square Logo
        </p>
        <p className="text-xs text-slate-400 mt-0.5">Recommended 512×512px. PNG or SVG only.</p>
        {logo && (
          <button onClick={onRemove} className="text-xs text-blue-500 mt-1 hover:underline">
            Remove current
          </button>
        )}
      </div>
    </div>
  );
}

function GeneralSettings({ data, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Library Name</FieldLabel>
          <TextInput value={data.libraryName} onChange={(e) => onChange("libraryName", e.target.value)} />
        </div>
        <div>
          <FieldLabel>Institution Name</FieldLabel>
          <TextInput value={data.institutionName} onChange={(e) => onChange("institutionName", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Time Zone</FieldLabel>
          <select
            value={data.timezone}
            onChange={(e) => onChange("timezone", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Primary Language</FieldLabel>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
              {data.language}
            </span>
            <button className="text-xs text-blue-500 hover:underline">Change</button>
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Institution Branding</FieldLabel>
        <LogoUploader
          logo={data.logo}
          onUpload={(url) => onChange("logo", url)}
          onRemove={() => onChange("logo", null)}
        />
      </div>
    </div>
  );
}

// ─── Library Rules ─────────────────────────────────────────────────────────────

function LibraryRules({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Library Configuration</SectionTitle>
      <div className="grid grid-cols-2 gap-x-10 gap-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Standard Loan Duration</p>
            <p className="text-xs text-slate-400">Number of days a book can be kept.</p>
          </div>
          <SpinnerInput value={data.loanDuration} onChange={(v) => onChange("loanDuration", v)} unit="days" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Daily Fine Rate</p>
            <p className="text-xs text-slate-400">Amount charged per overdue day.</p>
          </div>
          <DollarInput value={data.fineRate} onChange={(v) => onChange("fineRate", v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Maximum Books per User</p>
            <p className="text-xs text-slate-400">Limit of simultaneous checkouts.</p>
          </div>
          <SpinnerInput value={data.maxBooks} onChange={(v) => onChange("maxBooks", v)} unit="qty" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Grace Period</p>
            <p className="text-xs text-slate-400">Days before fines start accruing.</p>
          </div>
          <SpinnerInput value={data.gracePeriod} onChange={(v) => onChange("gracePeriod", v)} unit="days" />
        </div>
      </div>
    </div>
  );
}

// ─── Permissions ──────────────────────────────────────────────────────────────

const PERMISSION_ROWS = [
  { id: "catalog", label: "Manage Catalog", desc: "Add, edit or delete books" },
  { id: "circulation", label: "Circulation Control", desc: "Issue/Return operations" },
  { id: "reports", label: "System Reports", desc: "View financial and usage data" },
];

function PermissionsTable({ data, onChange }) {
  const toggle = (row, role) => {
    onChange(row, role, !data[row][role]);
  };

  return (
    <div className="flex flex-col gap-3">
      <SectionTitle>Role & Permissions</SectionTitle>
      <div className="border border-slate-100 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module Permission</th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Librarian</th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PERMISSION_ROWS.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-700">{row.label}</p>
                  <p className="text-xs text-slate-400">{row.desc}</p>
                </td>
                {["admin", "librarian", "student"].map((role) => (
                  <td key={role} className="px-4 py-4 text-center">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={data[row.id][role]}
                        onChange={() => toggle(row.id, role)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="text-xs font-semibold text-blue-500 hover:underline self-end">
        Advanced Permissions Editor →
      </button>
    </div>
  );
}

// ─── Security ─────────────────────────────────────────────────────────────────

function SecuritySettings({ data, onChange }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Security & Authentication</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        {/* Password Policy */}
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-start gap-2.5">
            <span className="text-xl mt-0.5">🔒</span>
            <div>
              <p className="text-sm font-bold text-slate-700">Password Policy</p>
              <p className="text-xs text-slate-400">Enforce strong passwords for staff</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { key: "minLength", label: "Min length: 12 characters" },
              { key: "specialChars", label: "Require special characters" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{item.label}</span>
                <Toggle checked={data[item.key]} onChange={(v) => onChange(item.key, v)} />
              </div>
            ))}
          </div>
        </div>

        {/* 2FA */}
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-start gap-2.5">
            <span className="text-xl mt-0.5">📱</span>
            <div>
              <p className="text-sm font-bold text-slate-700">Two-Factor Authentication</p>
              <p className="text-xs text-slate-400">Mandatory for all librarian roles.</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Current Status: </span>
              <span className={`text-xs font-bold ${data.twoFA ? "text-emerald-600" : "text-red-500"}`}>
                {data.twoFA ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <button
              onClick={() => onChange("twoFA", !data.twoFA)}
              className="text-xs font-semibold text-blue-500 hover:underline"
            >
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Integrations ─────────────────────────────────────────────────────────────

function IntegrationRow({ icon, title, desc, status, onTest }) {
  const isActive = status === "active";
  return (
    <div className="flex items-center justify-between border border-slate-100 rounded-2xl px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-bold text-slate-700">{title}</p>
          <p className="text-xs text-slate-400">{desc}</p>
        </div>
      </div>
      {isActive ? (
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          ACTIVE
        </span>
      ) : (
        <button
          onClick={onTest}
          className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Test Connection
        </button>
      )}
    </div>
  );
}

function IntegrationSettings({ onTest }) {
  return (
    <div className="flex flex-col gap-3">
      <SectionTitle>Integration Settings</SectionTitle>
      <IntegrationRow
        icon="✉️"
        title="SMTP Email Server"
        desc="Connected: smtp.office365.com"
        status="connected"
        onTest={onTest}
      />
      <IntegrationRow
        icon="📊"
        title="Barcode Scanner Integration"
        desc="Zebra & Honeywell API Compatible"
        status="active"
      />
    </div>
  );
}

// ─── Preferences ─────────────────────────────────────────────────────────────

function UserPreferences({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>User Preferences</SectionTitle>
      <div className="grid grid-cols-3 gap-4">
        {/* Interface */}
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interface</p>
          {[
            { key: "darkMode", label: "Dark Mode", icon: "🌙" },
            { key: "compactView", label: "Compact View", icon: "🖥" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
              <Toggle checked={data[item.key]} onChange={(v) => onChange(item.key, v)} />
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notifications</p>
          {[
            { key: "emailAlerts", label: "Email Alerts" },
            { key: "desktopPush", label: "Desktop Push" },
            { key: "smsReminders", label: "SMS Reminders" },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded flex items-center justify-center ${data[item.key] ? "bg-blue-600" : "bg-slate-200"}`}>
                {data[item.key] && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <button
                onClick={() => onChange(item.key, !data[item.key])}
                className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>

        {/* Session */}
        <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session</p>
          <button className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-100 transition-colors self-start">
            Logout from all devices
          </button>
          <div>
            <p className="text-[11px] text-slate-400">Last sign: 2 hours ago from</p>
            <p className="text-[11px] text-slate-400">Chrome (macOS)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <hr className="border-slate-100 my-2" />;
}

// ─── MAIN OUTLET ──────────────────────────────────────────────────────────────

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [toast, setToast] = useState(null);

  const [general, setGeneral] = useState({
    libraryName: "Intellectual Atelier",
    institutionName: "Vanguard Institute of Technology",
    timezone: "UTC-05:00 Eastern Time (US & Canada)",
    language: "ENGLISH (US)",
    logo: null,
  });

  const [library, setLibrary] = useState({
    loanDuration: 14,
    fineRate: 0.5,
    maxBooks: 5,
    gracePeriod: 2,
  });

  const [permissions, setPermissions] = useState({
    catalog: { admin: true, librarian: true, student: false },
    circulation: { admin: true, librarian: true, student: false },
    reports: { admin: true, librarian: false, student: false },
  });

  const [security, setSecurity] = useState({
    minLength: true,
    specialChars: true,
    twoFA: true,
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    compactView: true,
    emailAlerts: true,
    desktopPush: true,
    smsReminders: false,
  });

  const handleSave = () => {
    setToast({ type: "success", message: "All settings saved successfully!" });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDiscard = () => {
    setToast({ type: "error", message: "Changes discarded." });
    setTimeout(() => setToast(null), 2500);
  };

  const handlePermissionChange = (row, role, value) => {
    setPermissions((prev) => ({
      ...prev,
      [row]: { ...prev[row], [role]: value },
    }));
  };

  const SECTIONS_MAP = {
    general: (
      <GeneralSettings
        data={general}
        onChange={(key, val) => setGeneral((p) => ({ ...p, [key]: val }))}
      />
    ),
    library: (
      <LibraryRules
        data={library}
        onChange={(key, val) => setLibrary((p) => ({ ...p, [key]: val }))}
      />
    ),
    permissions: (
      <PermissionsTable
        data={permissions}
        onChange={handlePermissionChange}
      />
    ),
    security: (
      <SecuritySettings
        data={security}
        onChange={(key, val) => setSecurity((p) => ({ ...p, [key]: val }))}
      />
    ),
    integrations: (
      <IntegrationSettings
        onTest={() => setToast({ type: "success", message: "SMTP connection test successful!" })}
      />
    ),
    preferences: (
      <UserPreferences
        data={preferences}
        onChange={(key, val) => setPreferences((p) => ({ ...p, [key]: val }))}
      />
    ),
  };

  // Show all sections scrollable (matching the design), tab highlights active
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Platform Settings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your library's digital ecosystem, from institutional branding and loan rules to security protocols and notification integrations.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Left Tab Nav */}
          <TabNav active={activeTab} onChange={setActiveTab} />

          {/* Right Content */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <SectionTitle>
                {NAV_TABS.find((t) => t.id === activeTab)?.label} Settings
              </SectionTitle>
              <button
                onClick={handleSave}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Save Changes
              </button>
            </div>

            <Divider />

            {/* Active Section */}
            {SECTIONS_MAP[activeTab]}

            <Divider />

            <SaveBar onDiscard={handleDiscard} onSave={handleSave} />
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}