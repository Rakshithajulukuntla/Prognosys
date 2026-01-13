import React, { useState } from 'react';
import {
  User, Lock, Briefcase, Settings, LogOut, Search, Filter, Activity,
  Calendar, ChevronDown, Upload, X, Save, Truck, MapPin, Users,
  FileText, Trash2, Plus, DollarSign, Edit, BarChart3, PieChart, TrendingUp,
  Shield, Database, ToggleLeft, ToggleRight, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- MOCK DATA ---
const WORK_ROWS = [
  { id: 'JOB-2401', client: 'Apex Heavy Industries / Site A', lead: 'J. Reynolds', status: 'In-Progress', net: '$12,450.00' },
  { id: 'JOB-2398', client: 'North Winds Logistics / Main Hub', lead: 'S. Patel', status: 'Done', net: '$4,200.00' },
  { id: 'JOB-2405', client: 'TechFlow Systems / HQ', lead: 'M. Al-Fayed', status: 'Invoiced', net: '$8,750.00' },
];

const RECEIVABLES_DATA = [
  { job: 'JOB-2301', invoice: 'INV-909', client: 'Apex Heavy', amount: '12,450', site: 'Site A', finish: '2024-12-01', invDate: '2024-12-05', due: '2025-01-05', age: '25', remarks: 'Follow up sent' },
  { job: 'JOB-2299', invoice: 'INV-880', client: 'TechFlow', amount: '8,100', site: 'HQ', finish: '2024-11-20', invDate: '2024-11-25', due: '2024-12-25', age: '35', remarks: 'Payment promised' },
];

const PENDING_DATA = [
  { job: 'JOB-2410', client: 'City Infra', site: 'Bridge 4', quote: '55,000', finish: '2025-01-02', report: '2025-01-04', pending: '2', remarks: 'Awaiting PO' },
  { job: 'JOB-2412', client: 'Solar Farm', site: 'Zone B', quote: '15,200', finish: '2025-01-01', report: '-', pending: '5', remarks: 'Tech review' },
];

const USERS_DATA = [
  { id: 'EMP-001', name: 'John Reynolds', email: 'j.reynolds@prognosys.com', role: 'Senior Engineer', status: 'Active' },
  { id: 'EMP-004', name: 'Sarah Patel', email: 's.patel@prognosys.com', role: 'Admin', status: 'Active' },
  { id: 'EMP-012', name: 'Mike Al-Fayed', email: 'm.fayed@prognosys.com', role: 'Junior Engineer', status: 'Inactive' },
];

// --- REPORTS MOCK DATA ---
const JOB_SUMMARY_CHART = [
  { name: 'Apr', started: 15, completed: 10, inprogress: 5 },
  { name: 'May', started: 18, completed: 12, inprogress: 11 },
  { name: 'Jun', started: 22, completed: 18, inprogress: 15 },
  { name: 'Jul', started: 25, completed: 20, inprogress: 20 },
  { name: 'Aug', started: 20, completed: 22, inprogress: 18 },
  { name: 'Sep', started: 28, completed: 25, inprogress: 21 },
  { name: 'Oct', started: 30, completed: 28, inprogress: 23 },
  { name: 'Nov', started: 32, completed: 30, inprogress: 25 },
  { name: 'Dec', started: 25, completed: 24, inprogress: 26 },
];

const PAYMENT_SUMMARY_CHART = [
  { name: 'Apr', received: 450000, inProgress: 120000, yetToInvoice: 80000 },
  { name: 'May', received: 520000, inProgress: 150000, yetToInvoice: 95000 },
  { name: 'Jun', received: 610000, inProgress: 110000, yetToInvoice: 110000 },
  { name: 'Jul', received: 490000, inProgress: 200000, yetToInvoice: 150000 },
  { name: 'Aug', received: 580000, inProgress: 180000, yetToInvoice: 120000 },
  { name: 'Sep', received: 720000, inProgress: 210000, yetToInvoice: 90000 },
  { name: 'Oct', received: 850000, inProgress: 150000, yetToInvoice: 130000 },
  { name: 'Nov', received: 910000, inProgress: 140000, yetToInvoice: 100000 },
  { name: 'Dec', received: 780000, inProgress: 250000, yetToInvoice: 180000 },
];

const NAV_STRUCTURE = {
  Work: ['New Job', 'Update Job'],
  Assets: ['Inventory', 'Fleet Management', 'Maintenance'],
  Finance: ['Financials', 'Expenses', 'Receivables', 'Pending'],
  Reports: ['Job Detail Report', 'Job Summary Report', 'Payment Summary Report', 'Asset Summary Report'],
  Admin: ['Add Users', 'Manage Users', 'Settings']
};

// --- REUSABLE UI HELPERS ---

const StatusBadge = ({ status }) => {
  const styles = {
    'In-Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Done': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Invoiced': 'bg-purple-100 text-purple-700 border-purple-200',
    'Hold': 'bg-amber-100 text-amber-700 border-amber-200',
    'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Inactive': 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const Field = ({ label, required, children, icon: Icon }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {children}
      {Icon && <Icon className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 pointer-events-none" />}
    </div>
  </div>
);

const InputStyles = "w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-300";

const KPICard = ({ label, value, color = "text-[#001F3F]" }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-2xl font-black ${color} tracking-tight`}>{value}</span>
  </div>
);

// --- ADMIN MODULE COMPONENTS ---

const AddUserForm = ({ onCancel }) => (
  <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-black text-[#001F3F] uppercase tracking-tight">Add New User</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">Create credentials for system access.</p>
      </div>
      <div className="flex space-x-3">
        <button onClick={onCancel} className="px-4 py-2 rounded-md border border-slate-300 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors">Cancel</button>
        <button className="px-6 py-2 rounded-md bg-[#001F3F] text-white text-sm font-bold hover:bg-blue-900 shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"><Save size={16} /> Save User</button>
      </div>
    </div>
    <form className="p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <Field label="Full Name" required icon={User}><input type="text" className={InputStyles} placeholder="e.g. John Doe" /></Field>
        <Field label="Employee ID" required icon={Shield}><input type="text" className={InputStyles} placeholder="EMP-XXX" /></Field>
        <Field label="Email Address" required icon={Users}><input type="email" className={InputStyles} placeholder="user@prognosys.com" /></Field>
        <Field label="System Role" required>
          <select className={InputStyles}>
            <option>Select Role...</option>
            <option>Admin</option>
            <option>Senior Engineer</option>
            <option>Junior Engineer</option>
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Initial Password" required icon={Lock}><input type="password" className={InputStyles} placeholder="••••••••" /></Field>
        </div>
      </div>
    </form>
  </div>
);

const ManageUsersTable = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-300">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
      <div>
        <h2 className="text-lg font-black text-[#001F3F] uppercase tracking-wide">User Directory</h2>
        <p className="text-xs text-slate-500 mt-1">Manage access and roles.</p>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#1a5f7a] text-white text-[11px] uppercase tracking-widest font-bold">
            <th className="px-6 py-4">User ID</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {USERS_DATA.map((user, idx) => (
            <tr key={idx} className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4 font-mono text-blue-700 font-bold">{user.id}</td>
              <td className="px-6 py-4 font-bold text-slate-700">{user.name}</td>
              <td className="px-6 py-4 text-slate-600">{user.email}</td>
              <td className="px-6 py-4 text-slate-600">{user.role}</td>
              <td className="px-6 py-4 text-center">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-6 py-4 text-center flex justify-center gap-3">
                <button className="text-slate-400 hover:text-blue-600"><Edit size={16} /></button>
                <button className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminSettings = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xl">
      <h3 className="text-sm font-black text-[#001F3F] uppercase mb-6 flex items-center gap-2"><Settings size={18} /> System Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="font-bold text-slate-700 text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Enforce 2FA for all admin accounts</p>
            </div>
            <ToggleRight className="text-emerald-500 h-8 w-8 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <p className="font-bold text-slate-700 text-sm">Maintenance Mode</p>
              <p className="text-xs text-slate-500">Suspend all non-admin access</p>
            </div>
            <ToggleLeft className="text-slate-300 h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Session Timeout (Minutes)"><input type="number" className={InputStyles} defaultValue="30" /></Field>
          <Field label="System Notification Email"><input type="email" className={InputStyles} defaultValue="admin@prognosys.com" /></Field>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button className="px-6 py-2 rounded-md bg-[#1a5f7a] text-white text-sm font-bold hover:bg-[#144a5f] shadow-lg">Save Preferences</button>
      </div>
    </div>

    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xl">
      <h3 className="text-sm font-black text-[#001F3F] uppercase mb-6 flex items-center gap-2"><Database size={18} /> Backup Logs</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
            <th className="pb-3">Date</th>
            <th className="pb-3">Type</th>
            <th className="pb-3">Size</th>
            <th className="pb-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-slate-50">
            <td className="py-3 text-slate-600">2025-01-07 02:00 AM</td>
            <td className="py-3 font-bold text-slate-700">Full DB Backup</td>
            <td className="py-3 text-slate-500 font-mono">1.2 GB</td>
            <td className="py-3 text-right text-emerald-600 font-bold flex items-center justify-end gap-1"><CheckCircle size={14} /> Success</td>
          </tr>
          <tr>
            <td className="py-3 text-slate-600">2025-01-06 02:00 AM</td>
            <td className="py-3 font-bold text-slate-700">Incremental</td>
            <td className="py-3 text-slate-500 font-mono">450 MB</td>
            <td className="py-3 text-right text-emerald-600 font-bold flex items-center justify-end gap-1"><CheckCircle size={14} /> Success</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- REPORT MODULE COMPONENTS ---

const JobDetailReport = () => {
  // Internal mock data specific for this report format
  const reportData = [
    {
      job: 'JOB-2401', invoice: 'INV-909', client: 'Apex Heavy Industries', site: 'Site A',
      finish: '2024-12-01', invDate: '2024-12-05', amount: '$12,450.00', due: '2025-01-05',
      payDate: '-', status: 'Pending'
    },
    {
      job: 'JOB-2398', invoice: 'INV-880', client: 'North Winds Logistics', site: 'Main Hub',
      finish: '2024-11-20', invDate: '2024-11-25', amount: '$4,200.00', due: '2024-12-25',
      payDate: '2025-01-10', status: 'Paid'
    },
    {
      job: 'JOB-2405', invoice: 'INV-912', client: 'TechFlow Systems', site: 'HQ',
      finish: '2025-01-05', invDate: '2025-01-10', amount: '$8,750.00', due: '2025-02-10',
      payDate: '-', status: 'Pending'
    },
    {
      job: 'JOB-2250', invoice: 'INV-850', client: 'Solar Farm Ops', site: 'Zone B',
      finish: '2024-10-15', invDate: '2024-10-18', amount: '$15,200.00', due: '2024-11-18',
      payDate: '2024-11-15', status: 'Paid'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Field label="Start Date" icon={Calendar}><input type="date" className={InputStyles} /></Field>
        <Field label="End Date" icon={Calendar}><input type="date" className={InputStyles} /></Field>
        <Field label="Invoice Payment Status">
          <select className={InputStyles}>
            <option>All Statuses</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        </Field>
        <div className="flex items-end">
          <button className="w-full bg-[#1a5f7a] text-white py-2 rounded-md font-bold text-sm hover:bg-[#144a5f] shadow-md transition-all">
            Generate Report
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a5f7a] text-white text-[11px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4 whitespace-nowrap">Job#</th>
                <th className="px-6 py-4 whitespace-nowrap">Invoice#</th>
                <th className="px-6 py-4 whitespace-nowrap">Client</th>
                <th className="px-6 py-4 whitespace-nowrap">Site</th>
                <th className="px-6 py-4 whitespace-nowrap">Job Finish Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Invoice Date</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Invoice/Quote Amount</th>
                <th className="px-6 py-4 whitespace-nowrap">Due Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Payment Date</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Invoice Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {reportData.map((row, index) => (
                <tr key={index} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-700 font-bold">{row.job}</td>
                  <td className="px-6 py-4 font-mono">{row.invoice}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{row.client}</td>
                  <td className="px-6 py-4 text-slate-600">{row.site}</td>
                  <td className="px-6 py-4">{row.finish}</td>
                  <td className="px-6 py-4">{row.invDate}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">{row.amount}</td>
                  <td className="px-6 py-4 text-red-500 font-bold">{row.due}</td>
                  <td className="px-6 py-4 text-slate-500 italic">{row.payDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs border ${row.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const JobSummaryReport = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <KPICard label="Total Jobs" value="147" />
        <KPICard label="Completed Jobs" value="139" color="text-emerald-600" />
      </div>
      <div className="w-48"><Field label="Start Year"><select className={InputStyles}><option>2025</option><option>2024</option></select></Field></div>
    </div>
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xl">
      <h3 className="text-sm font-black text-[#001F3F] uppercase mb-8">Job Performance (Apr'25 - Dec'25)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={JOB_SUMMARY_CHART}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="started" name="Jobs Started" fill="#1a5f7a" />
            <Bar dataKey="completed" name="Jobs Completed" fill="#10b981" />
            <Bar dataKey="inprogress" name="In-Progress" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const PaymentSummaryReport = () => (
  <div className="space-y-6">
    <div className="flex justify-end">
      <div className="w-48">
        <Field label="Fiscal Year">
          <select className={InputStyles}>
            <option>2025</option>
            <option>2024</option>
          </select>
        </Field>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KPICard label="Payment Received" value="₹ 8,45,20,000" />
      <KPICard label="Payment Invoiced" value="₹ 2,10,30,000" />
      <KPICard label="Invoice Pending" value="₹ 1,46,06,943" color="text-red-500" />
      <div className="bg-[#001F3F] p-5 rounded-xl shadow-lg">
        <span className="block text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Revenue YTD</span>
        <span className="text-2xl font-black text-white tracking-tight">₹ 12,01,56,943</span>
      </div>
    </div>
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xl">
      <h3 className="text-sm font-black text-[#001F3F] uppercase mb-8">Financial Collections Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={PAYMENT_SUMMARY_CHART}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="received" name="Invoice Payment Received" fill="#10b981" />
            <Bar dataKey="inProgress" name="Invoice Payment in Progress" fill="#3b82f6" />
            <Bar dataKey="yetToInvoice" name="Yet to Invoice" fill="#94a3b8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const AssetSummaryReport = () => (
  <div className="space-y-8">
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Registry A: Assets In Use</h3>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#1a5f7a] text-white text-[10px] uppercase tracking-widest font-bold">
            <th className="px-4 py-3">Asset#</th>
            <th className="px-4 py-3">Asset Type</th>
            <th className="px-4 py-3">Job#</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Site</th>
            <th className="px-4 py-3">Job Start Date</th>
            <th className="px-4 py-3">Lead Engineer</th>
            <th className="px-4 py-3">Job Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          <tr>
            <td className="px-4 py-3 font-bold">AST-992</td>
            <td className="px-4 py-3 text-slate-600">Thermal Camera</td>
            <td className="px-4 py-3 text-blue-600 font-mono">JOB-2401</td>
            <td className="px-4 py-3">Apex Heavy</td>
            <td className="px-4 py-3">Site A</td>
            <td className="px-4 py-3">2025-01-10</td>
            <td className="px-4 py-3">J. Reynolds</td>
            <td className="px-4 py-3"><StatusBadge status="In-Progress" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-w-2xl">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Registry B: Assets Available</h3>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-[#1a5f7a] text-white text-[10px] uppercase tracking-widest font-bold">
            <th className="px-4 py-3">Asset#</th>
            <th className="px-4 py-3">Asset Type</th>
            <th className="px-4 py-3">Available Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          <tr>
            <td className="px-4 py-3 font-bold">AST-104</td>
            <td className="px-4 py-3 text-slate-600">Vibration Analyzer</td>
            <td className="px-4 py-3">Main Warehouse / Rack 4</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-bold">AST-205</td>
            <td className="px-4 py-3 text-slate-600">Oil Lab Kit</td>
            <td className="px-4 py-3">Service Center West</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// --- FINANCE COMPONENTS ---

const FinanceTable = ({ type, data, total }) => {
  const isReceivable = type === 'Receivables';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-black text-[#001F3F] uppercase tracking-wide">{type} Ledger</h2>
          <p className="text-xs text-slate-500 mt-1">Real-time financial tracking</p>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding</span>
          <span className="text-2xl font-black text-emerald-600 tracking-tight">{total}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1a5f7a] text-white text-[11px] uppercase tracking-widest font-bold">
              <th className="px-4 py-4 rounded-tl-lg">Job #</th>
              {isReceivable ? <th className="px-4 py-4">Invoice #</th> : null}
              <th className="px-4 py-4">Client</th>
              <th className="px-4 py-4">Site</th>
              <th className="px-4 py-4 text-right">{isReceivable ? 'Inv Amt' : 'Quote Amt'}</th>
              <th className="px-4 py-4">Job Finish</th>
              {isReceivable ? (
                <>
                  <th className="px-4 py-4">Inv Date</th>
                  <th className="px-4 py-4">Due Date</th>
                  <th className="px-4 py-4 text-center">Age (Days)</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-4">Report Fin</th>
                  <th className="px-4 py-4 text-center">Pending (Days)</th>
                </>
              )}
              <th className="px-4 py-4">Remarks</th>
              <th className="px-4 py-4 text-center rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-3 font-mono text-blue-700 font-bold">{row.job}</td>
                {isReceivable && <td className="px-4 py-3 font-mono">{row.invoice}</td>}
                <td className="px-4 py-3 font-bold text-slate-700">{row.client}</td>
                <td className="px-4 py-3 text-slate-600">{row.site}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{isReceivable ? row.amount : row.quote}</td>
                <td className="px-4 py-3 text-slate-500">{row.finish}</td>
                {isReceivable ? (
                  <>
                    <td className="px-4 py-3 text-slate-500">{row.invDate}</td>
                    <td className="px-4 py-3 text-slate-500">{row.due}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-600">{row.age}</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-slate-500">{row.report}</td>
                    <td className="px-4 py-3 text-center font-bold text-red-500">{row.pending}</td>
                  </>
                )}
                <td className="px-4 py-3 text-xs italic text-slate-400">{row.remarks}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JobFinancials = ({ onCancel }) => {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-[#001F3F] uppercase tracking-tight">Job Financials</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Invoicing & Tax Reconciliation</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-md border border-slate-300 text-slate-600 text-sm font-bold hover:bg-slate-100">Cancel</button>
          <button className="px-6 py-2 rounded-md bg-[#001F3F] text-white text-sm font-bold hover:bg-blue-900 shadow-lg flex items-center gap-2"><Save size={16} /> Save Record</button>
        </div>
      </div>

      <form className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Field label="Job No." required icon={Search}><input type="text" className={InputStyles} placeholder="JOB-XXXX" /></Field>
          <Field label="Customer" required icon={Search}><input type="text" className={InputStyles} placeholder="Client Name" /></Field>
          <Field label="Job Start Date" icon={Calendar}><input type="date" className={InputStyles} /></Field>
          <Field label="Job Finish Date" icon={Calendar}><input type="date" className={InputStyles} /></Field>

          <Field label="Site"><input type="text" className={InputStyles} /></Field>
          <Field label="State"><select className={InputStyles}><option>Select State</option></select></Field>
          <Field label="Invoice Number"><input type="text" className={InputStyles} placeholder="INV-XXXX" /></Field>
          <Field label="Payment Status"><select className={InputStyles}><option>Pending</option><option>Paid</option></select></Field>

          <Field label="Current Job Status"><select className={InputStyles}><option>Completed</option></select></Field>
          <Field label="Job Report Status"><select className={InputStyles}><option>Submitted</option></select></Field>
          <Field label="Invoice Date" icon={Calendar}><input type="date" className={InputStyles} /></Field>
          <Field label="Due Date" icon={Calendar}><input type="date" className={InputStyles} /></Field>

          <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100 mt-2">
            <Field label="Invoice Net Amount (Rs)" icon={DollarSign}><input type="number" className="w-full bg-white font-bold text-slate-700 border border-blue-200 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="0.00" /></Field>
            <Field label="GST Amount (Rs)" icon={DollarSign}><input type="number" className={InputStyles} placeholder="0.00" /></Field>
            <Field label="Gross Amount (Rs)" icon={DollarSign}><input type="number" className="w-full bg-slate-100 font-black text-emerald-700 border border-slate-300 rounded-md px-3 py-2 text-sm" placeholder="0.00" readOnly /></Field>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 border-dashed">
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <FileText className="h-6 w-6 text-slate-400 group-hover:text-blue-500 mb-2" />
            <span className="text-xs font-bold text-slate-600">Upload Final Invoice</span>
          </div>
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-500 mb-2" />
            <span className="text-xs font-bold text-slate-600">Upload Supporting Docs</span>
          </div>
        </div>
      </form>
    </div>
  );
};

const JobExpenses = ({ onCancel }) => {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-[#001F3F] uppercase tracking-tight">Job Expenses</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Log & Track Operational Costs</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-md border border-slate-300 text-slate-600 text-sm font-bold hover:bg-slate-100">Cancel</button>
          <button className="px-6 py-2 rounded-md bg-[#001F3F] text-white text-sm font-bold hover:bg-blue-900 shadow-lg flex items-center gap-2"><Save size={16} /> Save Log</button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white border border-slate-200 rounded-lg">
          <Field label="Job No." icon={Search}><input type="text" className={InputStyles} placeholder="Search..." /></Field>
          <Field label="Site Location"><input type="text" className="bg-slate-50 w-full border border-slate-200 rounded-md px-3 py-2 text-sm" placeholder="Auto-filled" readOnly /></Field>
          <Field label="Start Date"><input type="text" className="bg-slate-50 w-full border border-slate-200 rounded-md px-3 py-2 text-sm" placeholder="Auto-filled" disabled /></Field>
          <Field label="Status"><input type="text" className="bg-slate-50 w-full border border-slate-200 rounded-md px-3 py-2 text-sm" placeholder="Auto-filled" disabled /></Field>
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-700 uppercase mb-3 flex items-center gap-2"><Plus size={16} className="text-blue-600" /> New Expense Entry</h4>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-blue-50/50 p-4 rounded-lg border border-blue-100 items-end">
            <Field label="Expense Type"><select className={InputStyles}><option>Travel</option><option>Accommodation</option><option>Food</option></select></Field>
            <Field label="Amount" icon={DollarSign}><input type="number" className={InputStyles} /></Field>
            <Field label="Date" icon={Calendar}><input type="date" className={InputStyles} /></Field>
            <Field label="Payment Status"><select className={InputStyles}><option>Paid by Company</option><option>Reimbursement</option></select></Field>
            <Field label="Submitted By"><select className={InputStyles}><option>Staff A</option></select></Field>
            <button className="h-[38px] bg-blue-600 text-white rounded-md font-bold text-xs hover:bg-blue-700 shadow-md">Add Entry</button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-[10px] uppercase font-black text-slate-500">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Submitted By</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Doc</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-700">Flight Ticket</td>
                <td className="px-4 py-3 text-slate-500">2024-12-10</td>
                <td className="px-4 py-3">J. Reynolds</td>
                <td className="px-4 py-3"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Paid</span></td>
                <td className="px-4 py-3 text-right font-mono font-bold">4,500.00</td>
                <td className="px-4 py-3 text-center"><FileText size={14} className="mx-auto text-blue-500" /></td>
                <td className="px-4 py-3 text-center flex justify-center gap-2">
                  <Edit size={14} className="text-slate-400 hover:text-blue-600 cursor-pointer" />
                  <Trash2 size={14} className="text-slate-400 hover:text-red-600 cursor-pointer" />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="bg-slate-50 p-3 text-right border-t border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase mr-4">Total Expenses</span>
            <span className="text-lg font-black text-[#001F3F]">4,500.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const JobForm = ({ mode, onCancel, onSave }) => {
  const isUpdate = mode === 'Update Job';
  const [formData] = useState({
    jobNo: isUpdate ? 'JOB-2401' : '',
    customer: isUpdate ? 'Apex Heavy Industries' : '',
    site: isUpdate ? 'Site A' : '',
    startDate: isUpdate ? '2025-01-10' : '',
    status: isUpdate ? 'In-Progress' : 'Started',
  });

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white px-8 py-5 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-[#001F3F] uppercase tracking-tight">{mode} Entry</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Please ensure all mandatory technical details are accurate.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-md border border-slate-300 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-colors">Cancel</button>
          <button className="px-6 py-2 rounded-md bg-[#001F3F] text-white text-sm font-bold hover:bg-blue-900 shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"><Save size={16} /> Save Record</button>
        </div>
      </div>
      <form className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Field label="Job No." required><input type="text" className={InputStyles} placeholder="JOB-XXXX" defaultValue={formData.jobNo} /></Field>
          <Field label="Customer" required icon={Search}><input type="text" className={InputStyles} placeholder="Search Client DB..." defaultValue={formData.customer} /></Field>
          <Field label={isUpdate ? "Job Finish Date" : "Job Start Date"} required icon={Calendar}><input type="date" className={InputStyles} defaultValue={formData.startDate} /></Field>
          <Field label="Product / Service" required><select className={InputStyles}><option>Thermal Audit</option><option>Vibration Analysis</option><option>Oil Analysis</option></select></Field>
          <Field label="Site Location" required icon={MapPin}><input type="text" className={InputStyles} placeholder="Site Name" defaultValue={formData.site} /></Field>
          <Field label="State" icon={ChevronDown}><select className={InputStyles}><option>California</option><option>Texas</option><option>New York</option></select></Field>
          <Field label="Country" icon={ChevronDown}><select className={InputStyles}><option>USA</option><option>Canada</option><option>UK</option></select></Field>
          <Field label="Mode of Transport" icon={Truck}><select className={InputStyles}><option>Company Vehicle</option><option>Flight</option><option>Personal Vehicle</option></select></Field>
          <Field label="Lead Engineer" required icon={Search}><input type="text" className={InputStyles} placeholder="Select Lead..." /></Field>
          <Field label="Supporting Engineers" icon={Users}><input type="text" className={InputStyles} placeholder="Add Staff..." /></Field>
          <Field label="Vehicle Detail"><input type="text" className={InputStyles} placeholder="Reg No." /></Field>
          <Field label="Driver Accompanied"><select className={InputStyles}><option>No</option><option>Yes</option></select></Field>
          <Field label="Assets Carried"><input type="text" className={InputStyles} placeholder="Kit IDs..." /></Field>
          <Field label="Planned Tests"><input type="text" className={InputStyles} placeholder="Test Codes..." /></Field>
          <Field label="Power Plant Type"><input type="text" className={InputStyles} placeholder="e.g. Hydro / Solar" /></Field>
          <Field label="Client Contact" icon={User}><input type="text" className={InputStyles} placeholder="Site POC" /></Field>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-4">
            <Field label="Machine & Activity Details" required><textarea className={`${InputStyles} h-24 resize-none`} placeholder="Enter detailed technical scope of work here..." /></Field>
          </div>
        </div>
        {isUpdate && (
          <div className="mt-8 pt-8 border-t-2 border-slate-200 border-dashed">
            <h4 className="text-sm font-black text-slate-800 uppercase mb-6 flex items-center gap-2"><Activity size={16} className="text-blue-600" /> Job Progress & Deliverables</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Field label="Current Job Status" required><select className={InputStyles}><option>In-Progress</option><option>Site Work Completed</option><option>Reporting</option><option>Closed</option></select></Field>
              <Field label="Job Report Status"><select className={InputStyles}><option>Pending</option><option>Drafting</option><option>Submitted</option></select></Field>
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-500 mb-2" />
                <span className="text-xs font-bold text-slate-600">Upload Job Reports</span>
              </div>
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-500 mb-2" />
                <span className="text-xs font-bold text-slate-600">Supporting Docs/Img</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

// --- MAIN PAGES ---

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. SEND CREDENTIALS TO BACKEND
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: username,  // Mapping 'username' input to 'email' backend field
          password: password
        }),
      });

      const data = await response.json();

      // 2. CHECK SERVER RESPONSE
      if (response.ok) {
        // Success! Save user and enter Dashboard
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log("Login Successful:", data.user);
        onLogin();
      } else {
        // Server said No (Wrong password/email)
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      // Network Error (Server likely not running)
      console.error('Connection Error:', error);
      alert('Unable to connect to server. Is "node server.js" running?');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#B9D1EA] font-sans">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/50">
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-[#001F3F] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20 transform rotate-3">
            <Activity className="text-white h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black text-[#001F3F] tracking-tighter italic">Prognosys<span className="text-blue-600">.</span></h1>
          <p className="text-slate-500 text-[11px] mt-2 font-bold tracking-[0.3em] uppercase">Enterprise Access Point</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 peer-focus:text-blue-600 transition-colors z-10" />
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-transparent transition-all"
              placeholder="Authentication ID"
            />
            <label
              htmlFor="username"
              className="absolute left-11 -top-2.5 bg-white px-1 text-xs font-bold text-blue-600 transition-all
                         peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-11
                         peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-blue-600 peer-focus:left-11"
            >
              Authentication ID
            </label>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 peer-focus:text-blue-600 transition-colors z-10" />
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-transparent transition-all"
              placeholder="Secure Password"
            />
            <label
              htmlFor="password"
              className="absolute left-11 -top-2.5 bg-white px-1 text-xs font-bold text-blue-600 transition-all
                         peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-11
                         peer-focus:-top-2.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-blue-600 peer-focus:left-11"
            >
              Secure Password
            </label>
          </div>

          <button type="submit" className="w-full bg-[#001F3F] hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all duration-300 shadow-xl shadow-slate-900/20 active:scale-95 mt-4 uppercase tracking-widest text-xs flex justify-center items-center gap-2">Login <ChevronDown className="-rotate-90" size={14} /></button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest', email: 'guest@prognosys.com', role: 'Viewer', id: 'EMP-000' };
  const [activeTab, setActiveTab] = useState('Work');
  const [activeSubTab, setActiveSubTab] = useState('Dashboard');
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const renderContent = () => {
    // --- WORK MODULE ---
    if (activeSubTab === 'New Job') return <JobForm mode="New Job" onCancel={() => setActiveSubTab('Dashboard')} onSave={() => setActiveSubTab('Dashboard')} />;
    if (activeSubTab === 'Update Job') return <JobForm mode="Update Job" onCancel={() => setActiveSubTab('Dashboard')} onSave={() => setActiveSubTab('Dashboard')} />;

    // --- FINANCE MODULE ---
    if (activeSubTab === 'Financials') return <JobFinancials onCancel={() => setActiveSubTab('Receivables')} />;
    if (activeSubTab === 'Expenses') return <JobExpenses onCancel={() => setActiveSubTab('Receivables')} />;
    if (activeSubTab === 'Receivables') return <FinanceTable type="Receivables" data={RECEIVABLES_DATA} total="20,550.00" />;
    if (activeSubTab === 'Pending') return <FinanceTable type="Pending Invoices" data={PENDING_DATA} total="70,200.00" />;

    // --- REPORTS MODULE ---
    if (activeSubTab === 'Job Detail Report') return <JobDetailReport />;
    if (activeSubTab === 'Job Summary Report') return <JobSummaryReport />;
    if (activeSubTab === 'Payment Summary Report') return <PaymentSummaryReport />;
    if (activeSubTab === 'Asset Summary Report') return <AssetSummaryReport />;

    // --- ADMIN MODULE ---
    if (activeSubTab === 'Add Users') return <AddUserForm onCancel={() => setActiveSubTab('Manage Users')} />;
    if (activeSubTab === 'Manage Users') return <ManageUsersTable />;
    if (activeSubTab === 'Settings') return <AdminSettings />;

    // --- DEFAULT (Dashboard) ---
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-black text-[#001F3F] uppercase tracking-wide">Dashboard</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 h-4 w-4" />
            <input type="text" placeholder="Search by Job No..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                <th className="px-6 py-4">Job No.</th>
                <th className="px-6 py-4">Customer / Site</th>
                <th className="px-6 py-4">Lead Engineer</th>
                <th className="px-6 py-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {WORK_ROWS.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-blue-700 font-bold text-sm">{row.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 text-sm">{row.client.split(' / ')[0]}</div>
                    <div className="text-slate-500 text-xs">{row.client.split(' / ')[1]}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm font-medium">{row.lead}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm italic">Pending Review</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">Showing 3 Active Records</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#B9D1EA] text-slate-900 flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-300 shadow-sm bg-gradient-to-b from-gray-100 to-white">
        <div className="px-8 h-16 flex items-center justify-between max-w-[1920px] mx-auto w-full">
          <div className="flex items-center space-x-12">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => { setActiveTab('Work'); setActiveSubTab('Dashboard'); }}
            >
              <Activity className="h-6 w-6 text-[#001F3F]" />
              <span className="font-black text-2xl text-[#001F3F] tracking-tighter italic">Prognosys<span className="text-blue-500">.</span></span>
            </div>
            {/* New Vertical Dropdown Navigation System */}
            <nav className="flex space-x-1">
              {Object.keys(NAV_STRUCTURE).map((tab) => (
                <div
                  key={tab}
                  className="relative"
                  onMouseEnter={() => setHoveredTab(tab)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-5 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab ? 'text-[#001F3F] bg-blue-100/50' : 'text-slate-600 hover:text-[#001F3F] hover:bg-white/50'
                      }`}
                  >
                    {tab.toUpperCase()}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredTab === tab ? 'rotate-180' : ''}`} />
                    {activeTab === tab && (<div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#001F3F]" />)}
                  </button>

                  {/* Vertical Dropdown */}
                  {hoveredTab === tab && (
                    <div className="absolute top-full left-0 w-56 bg-slate-900 border border-slate-700 shadow-2xl rounded-b-lg p-2 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {NAV_STRUCTURE[tab].map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setActiveTab(tab);
                            setActiveSubTab(sub);
                            setHoveredTab(null);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeSubTab === sub
                            ? 'bg-blue-600/30 text-white'
                            : 'text-slate-300 hover:bg-blue-600/20 hover:text-white'
                            }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-4 border-l border-slate-200 outline-none"
            >
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-[#001F3F]">{user.name}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user.role}</div>
              </div>
              <div className="h-10 w-10 bg-[#001F3F] text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-blue-900/20">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-4 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">User Profile</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Full Name</span>
                      <div className="font-bold text-slate-700">{user.name}</div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                      <div className="font-bold text-slate-700">{user.email}</div>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">ID</span>
                        <div className="font-mono font-bold text-blue-600">{user.id || user.employeeId || 'EMP-001'}</div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Role</span>
                        <div className="font-bold text-slate-700">{user.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-slate-50">
                  <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all font-bold text-sm border border-transparent hover:border-slate-200">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 p-8 max-w-[1920px] mx-auto w-full">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#001F3F] uppercase tracking-tight">{activeSubTab}</h2>
            <p className="text-slate-600 text-sm font-medium">Manage and track your engineering workflows.</p>
          </div>
          {activeSubTab === 'Dashboard' && (
            <button onClick={() => setActiveSubTab('New Job')} className="bg-[#001F3F] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2">
              <Briefcase size={18} /> New Job Entry
            </button>
          )}
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return isAuth ? <Dashboard onLogout={() => setIsAuth(false)} /> : <LoginPage onLogin={() => setIsAuth(true)} />;
}