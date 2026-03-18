import { create } from 'zustand'
import type { Molecule, Target, DockingResult, ADMETData, SynthesisRoute } from './supabase'

type Tab = 'viewer' | 'editor' | 'properties' | 'targets' | 'docking' | 'admet' | 'synthesis'

interface MoleculeForgeState {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  molecules: Molecule[]
  setMolecules: (m: Molecule[]) => void
  selectedMolecule: Molecule | null
  setSelectedMolecule: (m: Molecule | null) => void
  targets: Target[]
  setTargets: (t: Target[]) => void
  selectedTarget: Target | null
  setSelectedTarget: (t: Target | null) => void
  dockingResults: DockingResult[]
  setDockingResults: (d: DockingResult[]) => void
  admetData: ADMETData[]
  setAdmetData: (a: ADMETData[]) => void
  synthesisRoutes: SynthesisRoute[]
  setSynthesisRoutes: (s: SynthesisRoute[]) => void
}

export const useStore = create<MoleculeForgeState>((set) => ({
  activeTab: 'viewer',
  setActiveTab: (tab) => set({ activeTab: tab }),
  molecules: [],
  setMolecules: (molecules) => set({ molecules }),
  selectedMolecule: null,
  setSelectedMolecule: (selectedMolecule) => set({ selectedMolecule }),
  targets: [],
  setTargets: (targets) => set({ targets }),
  selectedTarget: null,
  setSelectedTarget: (selectedTarget) => set({ selectedTarget }),
  dockingResults: [],
  setDockingResults: (dockingResults) => set({ dockingResults }),
  admetData: [],
  setAdmetData: (admetData) => set({ admetData }),
  synthesisRoutes: [],
  setSynthesisRoutes: (synthesisRoutes) => set({ synthesisRoutes }),
}))
