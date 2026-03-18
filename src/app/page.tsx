'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { mockMolecules, mockTargets, mockDockingResults, mockADMET, mockSynthesisRoutes } from '@/lib/mock-data'
import Sidebar from '@/components/Sidebar'
import MoleculeViewer from '@/components/MoleculeViewer'
import MoleculeEditor from '@/components/MoleculeEditor'
import PropertyPredictor from '@/components/PropertyPredictor'
import TargetBrowser from '@/components/TargetBrowser'
import DockingVisualizer from '@/components/DockingVisualizer'
import ADMETDashboard from '@/components/ADMETDashboard'
import SynthesisPlanner from '@/components/SynthesisPlanner'

export default function Home() {
  const { activeTab, setMolecules, setTargets, setDockingResults, setAdmetData, setSynthesisRoutes } = useStore()

  useEffect(() => {
    setMolecules(mockMolecules)
    setTargets(mockTargets)
    setDockingResults(mockDockingResults)
    setAdmetData(mockADMET)
    setSynthesisRoutes(mockSynthesisRoutes)
  }, [setMolecules, setTargets, setDockingResults, setAdmetData, setSynthesisRoutes])

  const renderTab = () => {
    switch (activeTab) {
      case 'viewer': return <MoleculeViewer />
      case 'editor': return <MoleculeEditor />
      case 'properties': return <PropertyPredictor />
      case 'targets': return <TargetBrowser />
      case 'docking': return <DockingVisualizer />
      case 'admet': return <ADMETDashboard />
      case 'synthesis': return <SynthesisPlanner />
      default: return <MoleculeViewer />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            MoleculeForge
          </h1>
          <p className="text-white/50 mt-1">AI-Powered Drug Discovery Platform</p>
        </div>
        {renderTab()}
      </main>
    </div>
  )
}
