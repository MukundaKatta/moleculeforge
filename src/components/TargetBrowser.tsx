'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Search, ExternalLink, Dna, Activity } from 'lucide-react'

export default function TargetBrowser() {
  const { targets, selectedTarget, setSelectedTarget, molecules } = useStore()
  const [search, setSearch] = useState('')
  const [filterArea, setFilterArea] = useState<string>('all')

  const therapeuticAreas = ['all', ...new Set(targets.map(t => t.therapeutic_area))]
  const filteredTargets = targets.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.gene.toLowerCase().includes(search.toLowerCase())
    const matchesArea = filterArea === 'all' || t.therapeutic_area === filterArea
    return matchesSearch && matchesArea
  })

  const targetMolecules = selectedTarget
    ? molecules.filter(m => m.target_id === selectedTarget.id)
    : []

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Target List */}
      <div className="glass p-4 overflow-auto">
        <h3 className="text-sm font-semibold text-white/70 mb-3">TARGET BROWSER</h3>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search targets..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex gap-1 mb-3 flex-wrap">
          {therapeuticAreas.map((area) => (
            <button
              key={area}
              onClick={() => setFilterArea(area)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                filterArea === area ? 'bg-indigo-500/20 text-indigo-300' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredTargets.map((target) => (
            <button
              key={target.id}
              onClick={() => setSelectedTarget(target)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedTarget?.id === target.id ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{target.name}</p>
                  <p className="text-xs text-white/40">{target.gene} | {target.organism}</p>
                </div>
                <Dna className="w-4 h-4 text-indigo-400 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                    style={{ width: `${target.druggability_score * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-white/40">{(target.druggability_score * 100).toFixed(0)}%</span>
              </div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-300">
                {target.therapeutic_area}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Detail */}
      <div className="col-span-2 space-y-6 overflow-auto">
        {selectedTarget ? (
          <>
            <div className="glass p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedTarget.name}</h2>
                  <p className="text-white/50 mt-1">{selectedTarget.gene} - {selectedTarget.organism}</p>
                </div>
                {selectedTarget.pdb_id && (
                  <a
                    href={`https://www.rcsb.org/structure/${selectedTarget.pdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs hover:bg-indigo-500/30"
                  >
                    PDB: {selectedTarget.pdb_id} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Druggability Score</p>
                  <p className="text-3xl font-bold text-emerald-400 mt-1">
                    {(selectedTarget.druggability_score * 100).toFixed(0)}%
                  </p>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${selectedTarget.druggability_score * 100}%` }}
                    />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Therapeutic Area</p>
                  <p className="text-lg font-bold text-blue-300 mt-1">{selectedTarget.therapeutic_area}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Associated Molecules</p>
                  <p className="text-3xl font-bold text-amber-300 mt-1">{targetMolecules.length}</p>
                </div>
              </div>
            </div>

            {/* Binding Sites */}
            <div className="glass p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-4">BINDING SITES</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Active Site', residues: 'THR790, MET793, LEU718', volume: '420 A^3', druggability: 0.92 },
                  { name: 'Allosteric Site 1', residues: 'ASP855, PHE856, GLY857', volume: '280 A^3', druggability: 0.65 },
                  { name: 'Allosteric Site 2', residues: 'VAL726, ALA743, LYS745', volume: '195 A^3', druggability: 0.45 },
                ].map((site, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      <p className="font-medium text-sm">{site.name}</p>
                    </div>
                    <p className="text-xs text-white/40 mt-1">Residues: {site.residues}</p>
                    <p className="text-xs text-white/40">Volume: {site.volume}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${site.druggability * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40">{(site.druggability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Molecules */}
            <div className="glass p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-4">ASSOCIATED MOLECULES</h3>
              {targetMolecules.length > 0 ? (
                <div className="space-y-2">
                  {targetMolecules.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div>
                        <p className="font-medium text-sm">{m.name}</p>
                        <p className="text-xs text-white/40">{m.formula} | MW: {m.molecular_weight}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        m.status === 'clinical' ? 'bg-emerald-500/20 text-emerald-400' :
                        m.status === 'preclinical' ? 'bg-blue-500/20 text-blue-400' :
                        m.status === 'optimization' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-sm">No molecules associated with this target</p>
              )}
            </div>
          </>
        ) : (
          <div className="glass p-8 flex items-center justify-center h-full">
            <div className="text-center text-white/30">
              <Dna className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a target to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
