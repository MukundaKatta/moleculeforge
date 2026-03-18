'use client'

import { useStore } from '@/lib/store'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function ADMETDashboard() {
  const { admetData, molecules } = useStore()

  const getStatus = (value: number, isGood: boolean = true) => {
    const v = isGood ? value : 1 - value
    if (v >= 0.7) return { label: 'Good', color: 'text-emerald-400', icon: CheckCircle, bg: 'bg-emerald-500/10' }
    if (v >= 0.4) return { label: 'Moderate', color: 'text-amber-400', icon: AlertTriangle, bg: 'bg-amber-500/10' }
    return { label: 'Poor', color: 'text-red-400', icon: XCircle, bg: 'bg-red-500/10' }
  }

  const enrichedData = admetData.map(a => ({
    ...a,
    moleculeName: molecules.find(m => m.id === a.molecule_id)?.name || 'Unknown',
  }))

  const radarData = enrichedData.length > 0 ? [
    { property: 'Absorption', ...Object.fromEntries(enrichedData.map(d => [d.moleculeName, d.absorption * 100])) },
    { property: 'Distribution', ...Object.fromEntries(enrichedData.map(d => [d.moleculeName, d.distribution * 100])) },
    { property: 'Metabolism', ...Object.fromEntries(enrichedData.map(d => [d.moleculeName, d.metabolism * 100])) },
    { property: 'Excretion', ...Object.fromEntries(enrichedData.map(d => [d.moleculeName, d.excretion * 100])) },
    { property: 'Low Toxicity', ...Object.fromEntries(enrichedData.map(d => [d.moleculeName, (1 - d.toxicity) * 100])) },
  ] : []

  const barData = enrichedData.map(d => ({
    name: d.moleculeName,
    Bioavailability: d.bioavailability * 100,
    Solubility: d.solubility * 100,
    'Half-life': d.half_life * 10,
  }))

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] overflow-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-6 gap-3">
        {enrichedData.slice(0, 6).map((d, i) => {
          const toxStatus = getStatus(d.toxicity, false)
          return (
            <div key={d.id} className="glass p-3">
              <p className="text-xs font-medium text-white/70">{d.moleculeName}</p>
              <div className={`mt-2 p-2 rounded-lg ${toxStatus.bg}`}>
                <div className="flex items-center gap-1">
                  <toxStatus.icon className={`w-3 h-3 ${toxStatus.color}`} />
                  <span className={`text-[10px] ${toxStatus.color}`}>Tox: {toxStatus.label}</span>
                </div>
              </div>
              <p className="text-[10px] text-white/40 mt-1">Bioavail: {(d.bioavailability * 100).toFixed(0)}%</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* ADMET Radar */}
        <div className="glass p-4">
          <h3 className="text-sm font-semibold text-white/70 mb-4">ADMET PROFILE COMPARISON</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="property" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              {enrichedData.slice(0, 4).map((d, i) => (
                <Radar key={d.id} dataKey={d.moleculeName} stroke={colors[i]} fill={colors[i]} fillOpacity={0.1} />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Pharmacokinetics Bar Chart */}
        <div className="glass p-4">
          <h3 className="text-sm font-semibold text-white/70 mb-4">PHARMACOKINETICS</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="Bioavailability" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Solubility" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Half-life" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed ADMET Table */}
      <div className="glass p-4">
        <h3 className="text-sm font-semibold text-white/70 mb-4">DETAILED ADMET DATA</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-white/50 font-medium text-xs">Molecule</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">Absorption</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">Distribution</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">Metabolism</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">Excretion</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">Toxicity</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">Bioavail.</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">t1/2 (h)</th>
                <th className="text-center py-2 px-3 text-white/50 font-medium text-xs">Solubility</th>
              </tr>
            </thead>
            <tbody>
              {enrichedData.map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-2 px-3 font-medium">{d.moleculeName}</td>
                  {[d.absorption, d.distribution, d.metabolism, d.excretion].map((v, i) => {
                    const s = getStatus(v)
                    return (
                      <td key={i} className="py-2 px-3 text-center">
                        <span className={`${s.color}`}>{(v * 100).toFixed(0)}%</span>
                      </td>
                    )
                  })}
                  <td className="py-2 px-3 text-center">
                    <span className={getStatus(d.toxicity, false).color}>{(d.toxicity * 100).toFixed(0)}%</span>
                  </td>
                  <td className="py-2 px-3 text-center text-indigo-300">{(d.bioavailability * 100).toFixed(0)}%</td>
                  <td className="py-2 px-3 text-center text-amber-300">{d.half_life}h</td>
                  <td className="py-2 px-3 text-center text-emerald-300">{(d.solubility * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
