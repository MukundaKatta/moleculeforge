'use client'

import { useStore } from '@/lib/store'
import { Atom, Edit3, BarChart3, Target, Zap, Activity, GitBranch } from 'lucide-react'

const tabs = [
  { id: 'viewer' as const, label: '3D Viewer', icon: Atom },
  { id: 'editor' as const, label: 'Mol Editor', icon: Edit3 },
  { id: 'properties' as const, label: 'Properties', icon: BarChart3 },
  { id: 'targets' as const, label: 'Targets', icon: Target },
  { id: 'docking' as const, label: 'Docking', icon: Zap },
  { id: 'admet' as const, label: 'ADMET', icon: Activity },
  { id: 'synthesis' as const, label: 'Synthesis', icon: GitBranch },
]

export default function Sidebar() {
  const { activeTab, setActiveTab, molecules } = useStore()

  return (
    <aside className="w-64 glass border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">MolForge</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-white/60 hover:bg-white/5 hover:text-white/80'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="glass p-3 rounded-xl">
          <p className="text-xs text-white/50">Molecules in Library</p>
          <p className="text-2xl font-bold text-indigo-400">{molecules.length}</p>
        </div>
      </div>
    </aside>
  )
}
