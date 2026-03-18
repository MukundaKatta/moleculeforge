'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Environment } from '@react-three/drei'
import { useStore } from '@/lib/store'
import { moleculeAtoms } from '@/lib/mock-data'
import * as THREE from 'three'

const elementColors: Record<string, string> = {
  C: '#666666', N: '#3050F8', O: '#FF0D0D', S: '#FFFF30',
  H: '#FFFFFF', P: '#FF8000', Cl: '#1FF01F', F: '#90E050',
}
const elementRadii: Record<string, number> = {
  C: 0.3, N: 0.28, O: 0.27, S: 0.35, H: 0.2, P: 0.32, Cl: 0.33, F: 0.25,
}

function Atom3D({ position, element }: { position: [number, number, number]; element: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[elementRadii[element] || 0.3, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? '#ffffff' : (elementColors[element] || '#888888')}
        roughness={0.3}
        metalness={0.7}
        emissive={elementColors[element] || '#888888'}
        emissiveIntensity={hovered ? 0.5 : 0.1}
      />
    </mesh>
  )
}

function Bond3D({ start, end, order }: { start: [number, number, number]; end: [number, number, number]; order: number }) {
  const midpoint = useMemo(() => [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ] as [number, number, number], [start, end])

  const direction = useMemo(() => {
    const d = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2])
    return d
  }, [start, end])

  const length = direction.length()
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
    return q
  }, [direction])

  const offsets = order === 1 ? [0] : order === 2 ? [-0.06, 0.06] : [-0.1, 0, 0.1]

  return (
    <>
      {offsets.map((offset, i) => (
        <mesh key={i} position={[midpoint[0] + offset, midpoint[1], midpoint[2]]} quaternion={quaternion}>
          <cylinderGeometry args={[0.05, 0.05, length, 8]} />
          <meshStandardMaterial color="#444466" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </>
  )
}

function MoleculeScene({ moleculeId }: { moleculeId: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const data = moleculeAtoms[moleculeId]

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  if (!data) {
    return (
      <Text position={[0, 0, 0]} fontSize={0.5} color="#666">
        No 3D data available
      </Text>
    )
  }

  return (
    <group ref={groupRef}>
      {data.atoms.map((atom, i) => (
        <Atom3D key={i} position={[atom.x, atom.y, atom.z]} element={atom.element} />
      ))}
      {data.bonds.map(([a, b, order], i) => (
        <Bond3D
          key={i}
          start={[data.atoms[a].x, data.atoms[a].y, data.atoms[a].z]}
          end={[data.atoms[b].x, data.atoms[b].y, data.atoms[b].z]}
          order={order}
        />
      ))}
    </group>
  )
}

export default function MoleculeViewer() {
  const { molecules, selectedMolecule, setSelectedMolecule } = useStore()
  const [viewMode, setViewMode] = useState<'ball-stick' | 'space-fill' | 'wireframe'>('ball-stick')

  return (
    <div className="grid grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* Molecule List */}
      <div className="glass p-4 overflow-auto">
        <h3 className="text-sm font-semibold text-white/70 mb-3">MOLECULE LIBRARY</h3>
        <div className="space-y-2">
          {molecules.map((mol) => (
            <button
              key={mol.id}
              onClick={() => setSelectedMolecule(mol)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                selectedMolecule?.id === mol.id
                  ? 'bg-indigo-500/20 border border-indigo-500/30'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <p className="font-medium text-sm">{mol.name}</p>
              <p className="text-xs text-white/40 mt-0.5">{mol.formula}</p>
              <p className="text-xs text-white/30 mt-0.5 truncate">{mol.smiles}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                mol.status === 'clinical' ? 'bg-emerald-500/20 text-emerald-400' :
                mol.status === 'preclinical' ? 'bg-blue-500/20 text-blue-400' :
                mol.status === 'optimization' ? 'bg-amber-500/20 text-amber-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {mol.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="col-span-3 glass p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/70">
            3D MOLECULE VIEWER {selectedMolecule && `- ${selectedMolecule.name}`}
          </h3>
          <div className="flex gap-2">
            {(['ball-stick', 'space-fill', 'wireframe'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === mode ? 'bg-indigo-500/30 text-indigo-300' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 rounded-xl overflow-hidden bg-black/30">
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#6366f1" />
            <MoleculeScene moleculeId={selectedMolecule?.id || '1'} />
            <OrbitControls enableDamping dampingFactor={0.05} />
            <Environment preset="night" />
          </Canvas>
        </div>
        {selectedMolecule && (
          <div className="mt-3 grid grid-cols-5 gap-3">
            {[
              { label: 'MW', value: selectedMolecule.molecular_weight.toFixed(1) },
              { label: 'LogP', value: selectedMolecule.logp.toFixed(2) },
              { label: 'HBD', value: selectedMolecule.hbd },
              { label: 'HBA', value: selectedMolecule.hba },
              { label: 'TPSA', value: selectedMolecule.tpsa.toFixed(1) },
            ].map(({ label, value }) => (
              <div key={label} className="glass p-2 text-center rounded-lg">
                <p className="text-[10px] text-white/40">{label}</p>
                <p className="text-sm font-bold text-indigo-300">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
