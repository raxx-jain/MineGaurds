import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Flame,
  ExternalLink,
  Eye,
  Crosshair
} from 'lucide-react';
import { useMine } from '../context/MineContext';

export function WorkerTable({ onFocusMap }) {
  const { 
    workers, 
    selectedWorkerId, 
    setSelectedWorkerId, 
    filterStatus, 
    setFilterStatus, 
    searchQuery, 
    setSearchQuery,
    setWorkerProfileModalOpen 
  } = useMine();

  const [sortField, setSortField] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort workers
  const filteredWorkers = useMemo(() => {
    return workers
      .filter((w) => {
        // Status filter
        if (filterStatus === 'SAFE' && w.riskLevel !== 'SAFE') return false;
        if (filterStatus === 'WARNING' && w.riskLevel !== 'WARNING') return false;
        if (filterStatus === 'CRITICAL' && (w.riskLevel !== 'CRITICAL' && w.riskLevel !== 'HIGH RISK')) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            w.id.toLowerCase().includes(q) ||
            w.name.toLowerCase().includes(q) ||
            w.zone.toLowerCase().includes(q) ||
            w.role.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
  }, [workers, filterStatus, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredWorkers.length / pageSize) || 1;
  const paginatedWorkers = filteredWorkers.slice((page - 1) * pageSize, page * pageSize);

  const getGasBadge = (w) => {
    const maxGas = Math.max(w.methane, w.co);
    if (maxGas > 40) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">HIGH ({maxGas}ppm)</span>;
    }
    if (maxGas > 20) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">ELEVATED</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Safe</span>;
  };

  const getStatusBadge = (level) => {
    switch (level) {
      case 'SAFE':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SAFE
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            WARNING
          </span>
        );
      case 'HIGH RISK':
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/40 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            HIGH RISK
          </span>
        );
      case 'CRITICAL':
      default:
        return (
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 w-fit animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            CRITICAL
          </span>
        );
    }
  };

  return (
    <div className="hud-panel rounded-xl flex flex-col border border-industrial-700/80 shadow-2xl overflow-hidden">
      {/* Header with Search & Filter Tabs */}
      <div className="bg-industrial-900/90 p-4 border-b border-industrial-700/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono uppercase">
              LIVE WORKER MONITORING
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time underground biometric and atmospheric telemetry roster
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          {/* Status Filter Tabs */}
          <div className="flex rounded-md bg-industrial-950 p-0.5 border border-industrial-700">
            {['ALL', 'SAFE', 'WARNING', 'CRITICAL'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setFilterStatus(s);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  filterStatus === s
                    ? s === 'CRITICAL' ? 'bg-red-600 text-white' :
                      s === 'WARNING' ? 'bg-amber-600 text-white' :
                      s === 'SAFE' ? 'bg-emerald-600 text-white' :
                      'bg-industrial-700 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, name, zone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1 text-xs font-mono bg-industrial-950 border border-industrial-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-44 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-industrial-950/80 border-b border-industrial-800 text-slate-400 uppercase text-[10px] tracking-wider select-none">
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  Worker ID
                  {sortField === 'id' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />)}
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Name
                  {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />)}
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('zone')}>
                <div className="flex items-center gap-1">
                  Zone
                  {sortField === 'zone' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />)}
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('heartRate')}>
                <div className="flex items-center gap-1">
                  Heart Rate
                  {sortField === 'heartRate' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />)}
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('spO2')}>
                <div className="flex items-center gap-1">
                  SpO₂
                  {sortField === 'spO2' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />)}
                </div>
              </th>
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('bodyTemp')}>
                <div className="flex items-center gap-1">
                  Temp
                  {sortField === 'bodyTemp' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />)}
                </div>
              </th>
              <th className="p-3" title="Fixed Underground Tunnel Environmental Sensor Reading">Tunnel Gas Node</th>
              <th className="p-3">Movement</th>
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('riskScore')}>
                <div className="flex items-center gap-1">
                  Risk Score
                  {sortField === 'riskScore' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />)}
                </div>
              </th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-industrial-800/60">
            {paginatedWorkers.length === 0 ? (
              <tr>
                <td colSpan="11" className="p-8 text-center text-slate-500 font-sans">
                  No workers match current filter or search criteria.
                </td>
              </tr>
            ) : (
              paginatedWorkers.map((w) => {
                const isSelected = w.id === selectedWorkerId;
                const isCrit = w.riskLevel === 'CRITICAL' || w.riskScore >= 80;

                return (
                  <tr
                    key={w.id}
                    onClick={() => setSelectedWorkerId(w.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950/40 border-l-4 border-l-sky-400'
                        : isCrit
                        ? 'bg-red-950/20 hover:bg-red-950/30'
                        : 'hover:bg-industrial-850/60'
                    }`}
                  >
                    {/* Worker ID */}
                    <td className="p-3 font-bold text-amber-400 flex items-center gap-1.5">
                      {isCrit && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                      <span>{w.id}</span>
                    </td>

                    {/* Name */}
                    <td className="p-3 text-slate-200 font-medium">
                      {w.name}
                    </td>

                    {/* Zone */}
                    <td className="p-3 text-slate-300">
                      {w.zone} <span className="text-[10px] text-slate-500">({w.subZone})</span>
                    </td>

                    {/* Heart Rate */}
                    <td className={`p-3 font-bold telemetry-num ${w.heartRate > 115 ? 'text-red-400' : 'text-slate-200'}`}>
                      {w.heartRate} BPM
                    </td>

                    {/* SpO2 */}
                    <td className={`p-3 font-bold telemetry-num ${w.spO2 < 90 ? 'text-red-400' : 'text-slate-200'}`}>
                      {w.spO2}%
                    </td>

                    {/* Temperature */}
                    <td className="p-3 text-slate-300 telemetry-num">
                      {w.bodyTemp.toFixed(1)}°C
                    </td>

                    {/* Gas */}
                    <td className="p-3">
                      {getGasBadge(w)}
                    </td>

                    {/* Movement */}
                    <td className="p-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        w.movement === 'FALL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        w.movement === 'ERRATIC' ? 'bg-amber-500/20 text-amber-400' :
                        w.movement === 'STATIONARY' ? 'bg-orange-500/20 text-orange-400' : 'text-slate-300'
                      }`}>
                        {w.movement}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold telemetry-num ${
                          w.riskScore > 80 ? 'text-red-400' :
                          w.riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {w.riskScore}
                        </span>
                        <div className="w-12 h-1.5 bg-industrial-950 rounded-full overflow-hidden border border-industrial-800">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${w.riskScore}%`,
                              backgroundColor: w.riskColor,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {getStatusBadge(w.riskLevel)}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedWorkerId(w.id);
                            if (onFocusMap) onFocusMap(w.id);
                          }}
                          className="p-1 rounded hover:bg-industrial-700 text-slate-400 hover:text-cyan-300"
                          title="Locate on Mine Map"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedWorkerId(w.id);
                            setWorkerProfileModalOpen(true);
                          }}
                          className="p-1 rounded hover:bg-industrial-700 text-slate-400 hover:text-amber-300"
                          title="View Full Profile Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-industrial-900/90 px-4 py-2.5 border-t border-industrial-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <div>
          Showing {paginatedWorkers.length} of {filteredWorkers.length} workers
          {filterStatus !== 'ALL' && <span className="ml-1 text-amber-400">({filterStatus})</span>}
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-2 py-1 rounded bg-industrial-800 hover:bg-industrial-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-2 py-1 rounded bg-industrial-800 hover:bg-industrial-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
