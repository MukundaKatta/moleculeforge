'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Plus, Trash2, RotateCcw, Download, Wand2 } from 'lucide-react'

const periodicElements = ['C', 'N', 'O', 'S', 'P', 'F', 'Cl', 'Br', 'I']
const bondTypes = ['Single', 'Double', 'Triple', 'Aromatic']
const templates = ['Benzene', 'Cyclohexane', 'Pyridine', 'Imidazole', 'Piperidine', 'Morpholine']

export default function MoleculeEditor() {
  const { selectedMolecule } = useStore()
  const [activeElement, setActiveElement] = useState('C')
  const [activeBond, setActiveBond] = useState('Single')
  const [activeTool, setActiveTool] = useState<'atom' | 'bond' | 'delete' | 'select'>('atom')
  const [smiles, setSmiles] = useState(selectedMolecule?.smiles || '')
  const [canvasAtoms, setCanvasAtoms] = useState<{ id: number; element: string; x: number; y: number }[]>([])
  const [canvasBonds, setCanvasBonds] = useState<{ from: number; to: number; type: string }[]>([])
  const [nextId, setNextId] = useState(1)

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'atom') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCanvasAtoms([...canvasAtoms, { id: nextId, element: activeElement, x, y }])
    setNextId(nextId + 1)
  }

  const clearCanvas = () => {
    setCanvasAtoms([])
    setCanvasBonds([])
    setNextId(1)
  }

  const generateSmiles = () => {
    const elements = canvasAtoms.map(a => a.element).join('')
    setSmiles(elements || 'C1=CC=CC=C1')
  }

  return (
    <div className="grid grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* Tools Panel */}
      <div className="glass p-4 space-y-6 overflow-auto">
        <div>
          <h3 className="text-sm font-semibold text-white/70 mb-3">TOOLS</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'atom' as const, label: 'Atom', icon: Plus },
              { id: 'bond' as const, label: 'Bond', icon: () => <span className="text-xs">---</span> },
              { id: 'delete' as const, label: 'Delete', icon: Trash2 },
              { id: 'select' as const, label: 'Select', icon: () => <span className="text-xs">+</span> },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
                  activeTool === id ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-white/50 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/70 mb-3">ELEMENTS</h3>
          <div className="grid grid-cols-3 gap-1.5">
            {periodicElements.map((el) => (
              <button
                key={el}
                onClick={() => { setActiveElement(el); setActiveTool('atom') }}
                className={`p-2 rounded-lg text-sm font-bold transition-all ${
                  activeElement === el && activeTool === 'atom'
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/30'
                    : 'text-white/60 hover:bg-white/5 border border-white/10'
                }`}
              >
                {el}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/70 mb-3">BOND TYPE</h3>
          <div className="space-y-1">
            {bondTypes.map((bt) => (
              <button
                key={bt}
                onClick={() => { setActiveBond(bt); setActiveTool('bond') }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeBond === bt && activeTool === 'bond'
                    ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/50 hover:bg-white/5'
                }`}
              >
                {bt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white/70 mb-3">TEMPLATES</h3>
          <div className="space-y-1">
            {templates.map((t) => (
              <button
                key={t}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:bg-white/5 transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="col-span-3 glass p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/70">MOLECULE EDITOR</h3>
          <div className="flex gap-2">
            <button onClick={clearCanvas} className="px-3 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-white/10 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
            <button onClick={generateSmiles} className="px-3 py-1.5 rounded-lg text-xs bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 flex items-center gap-1">
              <Wand2 className="w-3 h-3" /> Generate SMILES
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>

        <div
          className="flex-1 rounded-xl bg-black/30 relative cursor-crosshair overflow-hidden"
          onClick={handleCanvasClick}
        >
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Bonds */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {canvasBonds.map((bond, i) => {
              const fromAtom = canvasAtoms.find(a => a.id === bond.from)
              const toAtom = canvasAtoms.find(a => a.id === bond.to)
              if (!fromAtom || !toAtom) return null
              return (
                <line
                  key={i}
                  x1={fromAtom.x} y1={fromAtom.y}
                  x2={toAtom.x} y2={toAtom.y}
                  stroke="rgba(99,102,241,0.5)"
                  strokeWidth={bond.type === 'Double' ? 3 : bond.type === 'Triple' ? 5 : 2}
                />
              )
            })}
          </svg>

          {/* Atoms */}
          {canvasAtoms.map((atom) => (
            <div
              key={atom.id}
              className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-indigo-400/50 bg-indigo-500/20 text-indigo-300 -translate-x-4 -translate-y-4"
              style={{ left: atom.x, top: atom.y }}
            >
              {atom.element}
            </div>
          ))}

          {canvasAtoms.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <div className="text-center">
                <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Click to add atoms</p>
                <p className="text-xs mt-1">Select element and tool from sidebar</p>
              </div>
            </div>
          )}
        </div>

        {/* SMILES Input */}
        <div className="mt-3 flex gap-3">
          <div className="flex-1 glass rounded-xl p-3">
            <label className="text-[10px] text-white/40 block mb-1">SMILES</label>
            <input
              type="text"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-mono text-emerald-300"
              placeholder="Enter SMILES notation..."
            />
          </div>
          <button className="px-4 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-sm font-medium">
            Parse
          </button>
        </div>
      </div>
    </div>
  )
}
