import React, { useState, useEffect } from 'react';
import { Filter, Search, ChevronDown, Download, Package } from 'lucide-react';
import ThemeToggel from '../components/ThemToggel';
import Sidebare2 from '../components/Sidebare2';
import { fetchOutputs, fetchStats } from '../Api/inputOutput.api.js';
import { Icon } from '../components/Icon';
export default function InputOutput() {
  const [labFilter, setLabFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  // هادول الجدد
  const [outputs, setOutputs] = useState([]);
  const [stats, setStats] = useState([]);

  const conditionColors = {
    Excellent: { color: '#05DF72', bg: 'rgba(5,223,114,0.12)' },
    Good: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
    Poor: { color: '#FF6467', bg: 'rgba(255,100,103,0.12)' },
  };

  const statusColors = {
    Borrowed: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
    Returned: { color: '#05DF72', bg: 'rgba(5,223,114,0.12)' },
    Overdue: { color: '#FF6467', bg: 'rgba(255,100,103,0.12)' },
    Transferred: { color: '#C27AFF', bg: 'rgba(194,122,255,0.12)' },
  };

  const filters = [
    {
      key: 'lab',
      label: 'Laboratory',
      value: labFilter,
      options: ['Lab A', 'Lab B'],
      set: setLabFilter,
    },
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      options: ['Borrowed', 'Returned', 'Overdue', 'Transferred'],
      set: setStatusFilter,
    },
  ];

  // دالة تجلب البيانات (بدل التصفية المحلية)
  const loadData = async () => {
    const filterParams = {};
    if (labFilter) filterParams.lab = labFilter;
    if (statusFilter) filterParams.status = statusFilter;
    if (search) filterParams.search = search;

    const filteredData = await fetchOutputs(filterParams);
    const statsData = await fetchStats();

    setOutputs(filteredData);
    setStats((prev) =>
      prev.map((s) => {
        if (s.label === 'Total Outputs') return { ...s, value: statsData.total || 0 };
        if (s.label === 'Borrowed') return { ...s, value: statsData.borrowed || 0 };
        if (s.label === 'Returned') return { ...s, value: statsData.returned || 0 };
        if (s.label === 'Overdue') return { ...s, value: statsData.overdue || 0 };
        if (s.label === 'Transferred') return { ...s, value: statsData.transferred || 0 };
        return s;
      }),
    );
  };
  useEffect(() => {
    loadData();
  }, [labFilter, statusFilter, search]);

  function Badge({ label, map }) {
    const s = map[label] || { color: '#aaa', bg: 'rgba(170,170,170,0.12)' };
    return (
      <span
        className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap gap-1"
        style={{ color: s.color, background: s.bg }}
      >
        {label}
      </span>
    );
  }
  // دالة لتصدير البيانات إلى ملف CSV
  const exportToCSV = () => {
    if (!outputs || outputs.length === 0) {
      alert('No data to export');
      return;
    }

    // تعريف الأعمدة (headers)
    const headers = [
      'Material',
      'Laboratory',
      'Student/Transfer',
      'Issued',
      'Return',
      'Condition',
      'Status',
    ];

    // تحويل البيانات إلى صفوف
    const rows = outputs.map((row) => [
      row.material,
      row.lab,
      row.student,
      row.issued,
      row.returned,
      row.condition,
      row.status,
    ]);

    // دمج headers + rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(',')) // إضافة علامات اقتباس
      .join('\n');

    // إنشاء ملف للتحميل
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF لدعم اللغة العربية
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `material_outputs_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex dynamic-bg transition-colors duration-300" style={{ fontFamily: 'Inter' }}>
      <Sidebare2 activeLabel="Material Outputs" />
      <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="absolute top-6 right-8 z-60">
          <ThemeToggel />
        </div>

        <div className="w-full mt-[45px] border-t border-solid border-[var(--btali)]"></div>

        <div className="w-full mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
            <div className="whitespace-nowrap">
              <h2 className="text-title-custom text-[30px] mt-3">Material Outputs</h2>
              <p className="text-small-custom text-sm mt-[-4px]">
                Track all materials leaving and entering laboratories
              </p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={exportToCSV}
                className="ml-auto flex justify-between items-center text-white right-8 bg-[#6366F1] rounded-[10px] gap-2 px-2 py-1 text-sm hover:bg-[#5558e3] transition-all whitespace-nowrap font-medium"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>

          {/* Stat Cards - stats state */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-3 glass-card border-1 border-[var(--btali)] min-h-[90px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-small-custom whitespace-nowrap">{s.label}</p>
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ background: s.iconBg, color: s.iconColor }}
                  >
                    <Package size={16} />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-[-14px]" style={{ color: s.iconColor }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters - nafsou */}

          <div className="rounded-xl border-1 border-[var(--btali)] bg-[var(--caIn)] p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={16} className="text-small-custom mt-[-5px]" />
              <h2 className="text-xl whitespace-nowrap text-title-custom">Filters</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filters.map((d) => (
                <div key={d.key} className="relative">
                  <label className="block text-xs text-small-custom mb-1">{d.label}</label>
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded-lg border-0 border-[var(--btali)] bg-[var(--butt-filter)] text-sm cursor-pointer"
                    onClick={() => setOpenDropdown(openDropdown === d.key ? null : d.key)}
                  >
                    <span className="text-small-custom">{d.value || ''}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${openDropdown === d.key ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {openDropdown === d.key && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border border-[var(--btali)] bg-[var(--card)] shadow-xl overflow-hidden">
                      <div
                        className="px-3 py-2 text-xs text-small-custom hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          d.set('');
                          setOpenDropdown(null);
                        }}
                      >
                        All
                      </div>
                      {d.options.map((opt) => (
                        <div
                          key={opt}
                          className="px-3 py-2 text-sm text-title-custom hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            d.set(opt);
                            setOpenDropdown(null);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Search */}
              <div>
                <label className="block text-xs text-small-custom mb-1">Search</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-0 border-[#1E40AF4D] bg-[var(--butt-filter)]">
                  <Search size={16} />
                  <input
                    className="bg-transparent text-sm outline-none w-full text-title-custom placeholder:text-small-custom"
                    placeholder="Material, student, project, QR code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table - outputs state (n'est plus filtered) */}

          <div className="rounded-xl border-1 border-[var(--btali)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[var(--btali)] text-[14px] bg-[var(--butt-filter)]">
                    {[
                      'Material',
                      'Laboratory',
                      'Student/Transfer',
                      'Issued',
                      'Return',
                      'Condition',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-2 py-3 text-left text-[10px] font-medium text-title-custom uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {outputs?.length === 0 || !outputs ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-3 py-8 text-center text-small-custom text-[10px]"
                      >
                        No results found.
                      </td>
                    </tr>
                  ) : (
                    outputs &&
                    Array.isArray(outputs) &&
                    outputs.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-[var(--btali)] last:border-0 bg-[var(--caIn)]"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-title-custom">{row.material}</div>
                          <div className="text-xs text-small-custom">{row.desc}</div>
                        </td>
                        <td className="px-3 py-3 text-title-custom">{row.lab}</td>
                        <td className="px-3 py-3 text-title-custom text-xs max-w-[130px]">
                          {row.student}
                        </td>
                        <td className="px-3 py-3 text-title-custom text-xs">{row.issued}</td>
                        <td className="px-3.5 py-3 text-title-custom text-xs">{row.returned}</td>
                        <td className="px-3 py-3">
                          <Badge label={row.condition} map={conditionColors} />
                        </td>
                        <td className="px-3 py-3">
                          <Badge label={row.status} map={statusColors} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
