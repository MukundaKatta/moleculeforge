'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react'

export default function PropertyPredictor() {
  const { molecules, selectedMolecule, setSelectedMolecule } = useStore()
  const [predicting, setPredicting] = useState(false)

  const mol = selectedMolecule || molecules[0]

  const lipinskiData = mol ? [
    { property: 'MW < 500', value: mol.molecular_weight < 500 ? 100 : 0, actual: mol.molecular_weight },
    { property: 'LogP < 5', value: mol.logp < 5 ? 100 : 0, actual: mol.logp },
    { property: 'HBD < 5', value: mol.hbd < 5 ? 100 : 0, actual: mol.hbd },
    { property: 'HBA < 10', value: mol.hba < 10 ? 100 : 0, actual: mol.hba },
  ] : []

  const radarData = mol ? [
    { property: 'Size', value: Math.min(100, (mol.molecular_weight / 500) * 100) },
    { property: 'Lipophilicity', value: Math.min(100, ((mol.logp + 2) / 7) * 100) },
    { property: 'Polarity', value: Math.min(100, (mol.tpsa / 140) * 100) },
    { property: 'Flexibility', value: Math.min(100, ((mol.properties.rotatable_bonds || 0) / 10) * 100) },
    { property: 'H-Bond', value: Math.min(100, ((mol.hbd + mol.hba) / 15) * 100) },
    { property: 'Aromaticity', value: Math.min(100, ((mol.properties.aromatic_rings || 0) / 5) * 100) },
  ] : []

  const barData = molecules.map(m => ({
    name: m.name,
    MW: m.molecular_weight,
    LogP: m.logp * 50,
    TPSA: m.tpsa,
  }))

  const handlePredict = () => {
    setPredicting(true)
    setTimeout(() => setPredicting(false), 2000)
  }

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Molecule Selection */}
      <div className="glass p-4 overflow-auto">
        <h3 className="text-sm font-semibold text-white/70 mb-3">SELECT MOLECULE</h3>
        <div className="space-y-2">
          {molecules.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMolecule(m)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                mol?.id === m.id ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className="text-xs text-white/40">{m.formula}</p>
                </div>
                {m.properties.lipinski_violations === 0 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handlePredict}
          className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {predicting ? 'Predicting...' : 'Predict Properties'}
        </button>
      </div>

      {/* Property Details */}
      <div className="col-span-2 space-y-6 overflow-auto">
        {mol && (
          <>
            {/* Lipinski Rule of 5 */}
            <div className="glass p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-4">LIPINSKI RULE OF FIVE</h3>
              <div className="grid grid-cols-4 gap-3">
                {lipinskiData.map(({ property, value, actual }) => (
                  <div key={property} className={`p-3 rounded-xl border ${value ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                    <p className="text-[10px] text-white/50">{property}</p>
                    <p className={`text-lg font-bold ${value ? 'text-emerald-400' : 'text-red-400'}`}>{String(actual)}</p>
                    <p className={`text-xs ${value ? 'text-emerald-400' : 'text-red-400'}`}>{value ? 'PASS' : 'FAIL'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass p-4">
                <h3 className="text-sm font-semibold text-white/70 mb-4">MOLECULAR PROFILE</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="property" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                    <PolarRadiusAxis tick={false} domain={[0, 100]} />
                    <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass p-4">
                <h3 className="text-sm font-semibold text-white/70 mb-4">PROPERTY COMPARISON</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Bar dataKey="MW" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="TPSA" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Properties */}
            <div className="glass p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-4">DETAILED PROPERTIES</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Molecular Weight', value: `${mol.molecular_weight.toFixed(2)} Da`, color: 'text-indigo-300' },
                  { label: 'LogP', value: mol.logp.toFixed(2), color: 'text-emerald-300' },
                  { label: 'H-Bond Donors', value: mol.hbd, color: 'text-blue-300' },
                  { label: 'H-Bond Acceptors', value: mol.hba, color: 'text-purple-300' },
                  { label: 'TPSA', value: `${mol.tpsa.toFixed(1)} A^2`, color: 'text-amber-300' },
                  { label: 'Rotatable Bonds', value: mol.properties.rotatable_bonds, color: 'text-pink-300' },
                  { label: 'Aromatic Rings', value: mol.properties.aromatic_rings, color: 'text-cyan-300' },
                  { label: 'Lipinski Violations', value: mol.properties.lipinski_violations, color: 'text-red-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-xl bg-white/5">
                    <p className="text-[10px] text-white/40">{label}</p>
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
