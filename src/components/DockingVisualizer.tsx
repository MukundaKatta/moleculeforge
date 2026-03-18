'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Line, Text, Environment } from '@react-three/drei'
import { useStore } from '@/lib/store'
import { Zap, Play, BarChart2 } from 'lucide-react'

function BindingSite() {
  const positions: [number, number, number][] = [
    [0, 0, 0], [1.5, 0.5, 0.3], [-1, 1, -0.5], [0.5, -1.2, 0.8],
    [-0.8, -0.5, 1], [1.2, 1, -0.7], [-1.5, 0.3, 0.5], [0.3, 1.5, 1],
  ]

  return (
    <group>
      {/* Protein surface approximation */}
      {positions.map((pos, i) => (
        <Sphere key={i} args={[0.6, 16, 16]} position={pos}>
          <meshStandardMaterial color="#334155" transparent opacity={0.3} roughness={0.8} />
        </Sphere>
      ))}
      {/* Binding pocket highlight */}
      <Sphere args={[1.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#6366f1" transparent opacity={0.08} wireframe />
      </Sphere>
      {/* Ligand position */}
      <group position={[0.2, 0.1, 0]}>
        <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.15, 16, 16]} position={[0.5, 0.3, 0]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </Sphere>
        <Sphere args={[0.18, 16, 16]} position={[-0.4, 0.2, 0.3]}>
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
        </Sphere>
        {/* H-bond interaction lines */}
        <Line
          points={[[0, 0, 0], [1.5, 0.5, 0.3]]}
          color="#fbbf24"
          lineWidth={2}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
        <Line
          points={[[-0.4, 0.2, 0.3], [-1, 1, -0.5]]}
          color="#fbbf24"
          lineWidth={2}
          dashed
          dashSize={0.1}
          gapSize={0.05}
        />
      </group>
      <Text position={[2, -2, 0]} fontSize={0.2} color="white">
        Binding Pocket
      </Text>
    </group>
  )
}

export default function DockingVisualizer() {
  const { dockingResults, molecules, targets } = useStore()
  const [selectedDocking, setSelectedDocking] = useState(dockingResults[0] || null)
  const [docking, setDocking] = useState(false)

  const getMolName = (id: string) => molecules.find(m => m.id === id)?.name || 'Unknown'
  const getTargetName = (id: string) => targets.find(t => t.id === id)?.name || 'Unknown'

  const runDocking = () => {
    setDocking(true)
    setTimeout(() => setDocking(false), 3000)
  }

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Results List */}
      <div className="glass p-4 overflow-auto">
        <h3 className="text-sm font-semibold text-white/70 mb-3">DOCKING RESULTS</h3>
        <button
          onClick={runDocking}
          className="w-full mb-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          {docking ? 'Running Docking...' : 'New Docking Run'}
        </button>
        <div className="space-y-2">
          {dockingResults.map((dr) => (
            <button
              key={dr.id}
              onClick={() => setSelectedDocking(dr)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedDocking?.id === dr.id ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <p className="font-medium text-sm">{getMolName(dr.molecule_id)} + {getTargetName(dr.target_id)}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-emerald-400">{dr.binding_energy} kcal/mol</span>
                <span className="text-xs text-white/40">RMSD: {dr.rmsd}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Visualization */}
      <div className="col-span-2 flex flex-col gap-6">
        <div className="glass p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white/70">DOCKING POSE VISUALIZATION</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-amber-400">
                <span className="w-2 h-0.5 bg-amber-400 inline-block" /> H-Bond
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Ligand
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> Protein
              </span>
            </div>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden bg-black/30" style={{ height: '300px' }}>
            <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, 5]} intensity={0.3} color="#6366f1" />
              <BindingSite />
              <OrbitControls enableDamping />
              <Environment preset="night" />
            </Canvas>
          </div>
        </div>

        {/* Interaction Details */}
        {selectedDocking && (
          <div className="glass p-4">
            <h3 className="text-sm font-semibold text-white/70 mb-4">INTERACTION ANALYSIS</h3>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[10px] text-white/40">Binding Energy</p>
                <p className="text-xl font-bold text-emerald-400">{selectedDocking.binding_energy}</p>
                <p className="text-[10px] text-white/30">kcal/mol</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[10px] text-white/40">RMSD</p>
                <p className="text-xl font-bold text-blue-400">{selectedDocking.rmsd}</p>
                <p className="text-[10px] text-white/30">Angstrom</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[10px] text-white/40">Interactions</p>
                <p className="text-xl font-bold text-amber-400">{selectedDocking.interactions.length}</p>
                <p className="text-[10px] text-white/30">contacts</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[10px] text-white/40">Score Class</p>
                <p className="text-xl font-bold text-indigo-400">
                  {selectedDocking.binding_energy < -8 ? 'Excellent' : selectedDocking.binding_energy < -6 ? 'Good' : 'Moderate'}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {selectedDocking.interactions.map((inter: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-sm">{inter.type.replace('_', ' ')}</span>
                  </div>
                  <span className="text-xs text-white/50">{inter.residue}</span>
                  <span className="text-xs text-white/40">{inter.distance} A</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
