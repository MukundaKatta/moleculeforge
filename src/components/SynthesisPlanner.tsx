'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { GitBranch, ArrowRight, DollarSign, Beaker, Zap, ChevronDown, ChevronUp } from 'lucide-react'

export default function SynthesisPlanner() {
  const { synthesisRoutes, molecules } = useStore()
  const [selectedRoute, setSelectedRoute] = useState(synthesisRoutes[0] || null)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const getMolName = (id: string) => molecules.find(m => m.id === id)?.name || 'Unknown'

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Route List */}
      <div className="glass p-4 overflow-auto">
        <h3 className="text-sm font-semibold text-white/70 mb-3">SYNTHESIS ROUTES</h3>
        <button className="w-full mb-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4" /> Plan New Synthesis
        </button>
        <div className="space-y-2">
          {synthesisRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedRoute?.id === route.id ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <p className="font-medium text-sm">{getMolName(route.molecule_id)}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-emerald-400">{route.steps.length} steps</span>
                <span className="text-xs text-amber-400">{route.total_yield.toFixed(1)}% yield</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <DollarSign className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/40">${route.estimated_cost.toFixed(2)}</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    route.feasibility_score >= 0.8 ? 'bg-emerald-400' : route.feasibility_score >= 0.6 ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  <span className="text-[10px] text-white/40">{(route.feasibility_score * 100).toFixed(0)}% feasible</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Route Visualization */}
      <div className="col-span-2 space-y-6 overflow-auto">
        {selectedRoute ? (
          <>
            {/* Route Overview */}
            <div className="glass p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Synthesis Route: {getMolName(selectedRoute.molecule_id)}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedRoute.feasibility_score >= 0.8 ? 'bg-emerald-500/20 text-emerald-400' :
                  selectedRoute.feasibility_score >= 0.6 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {(selectedRoute.feasibility_score * 100).toFixed(0)}% Feasible
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Total Steps</p>
                  <p className="text-2xl font-bold text-indigo-400">{selectedRoute.steps.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Overall Yield</p>
                  <p className="text-2xl font-bold text-emerald-400">{selectedRoute.total_yield.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Estimated Cost</p>
                  <p className="text-2xl font-bold text-amber-400">${selectedRoute.estimated_cost.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-white/40">Cost/gram</p>
                  <p className="text-2xl font-bold text-pink-400">${(selectedRoute.estimated_cost / (selectedRoute.total_yield / 100)).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Route */}
            <div className="glass p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-4">SYNTHESIS STEPS</h3>
              <div className="space-y-3">
                {selectedRoute.steps.map((step, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                      className="w-full"
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{step.reagent}</p>
                          <p className="text-xs text-white/40">{step.conditions}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-400">{step.yield}%</p>
                          <p className="text-[10px] text-white/40">yield</p>
                        </div>
                        {expandedStep === i ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                      </div>
                    </button>
                    {expandedStep === i && (
                      <div className="ml-12 mt-2 p-4 rounded-xl bg-white/3 border border-white/5">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] text-white/40">Reagent</p>
                            <p className="text-sm font-medium">{step.reagent}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40">Conditions</p>
                            <p className="text-sm font-medium">{step.conditions}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-white/40">Expected Yield</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${step.yield}%` }} />
                              </div>
                              <span className="text-xs text-emerald-400">{step.yield}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {i < selectedRoute.steps.length - 1 && (
                      <div className="flex justify-center my-1">
                        <ArrowRight className="w-4 h-4 text-white/20 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Yield Waterfall */}
            <div className="glass p-4">
              <h3 className="text-sm font-semibold text-white/70 mb-4">CUMULATIVE YIELD</h3>
              <div className="flex items-end gap-2 h-32">
                {selectedRoute.steps.reduce<{ step: string; yield: number }[]>((acc, step, i) => {
                  const cumYield = i === 0 ? step.yield : acc[i - 1].yield * step.yield / 100
                  return [...acc, { step: `Step ${i + 1}`, yield: cumYield }]
                }, []).map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <span className="text-xs text-white/40 mb-1">{item.yield.toFixed(1)}%</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all"
                      style={{ height: `${item.yield}%` }}
                    />
                    <span className="text-[10px] text-white/40 mt-1">{item.step}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass p-8 flex items-center justify-center h-full">
            <div className="text-center text-white/30">
              <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a synthesis route</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
