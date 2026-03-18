import type { Molecule, Target, DockingResult, ADMETData, SynthesisRoute } from './supabase'

export const mockMolecules: Molecule[] = [
  {
    id: '1', name: 'MF-001', smiles: 'CC(=O)Oc1ccccc1C(=O)O', formula: 'C9H8O4',
    molecular_weight: 180.16, logp: 1.2, hbd: 1, hba: 4, tpsa: 63.6,
    status: 'optimization', target_id: '1', created_at: '2026-01-15T10:00:00Z',
    properties: { rotatable_bonds: 3, aromatic_rings: 1, lipinski_violations: 0 }
  },
  {
    id: '2', name: 'MF-002', smiles: 'c1ccc2c(c1)cc1ccc3cccc4ccc2c1c34', formula: 'C16H10',
    molecular_weight: 202.25, logp: 4.5, hbd: 0, hba: 0, tpsa: 0,
    status: 'discovery', target_id: '2', created_at: '2026-01-20T10:00:00Z',
    properties: { rotatable_bonds: 0, aromatic_rings: 4, lipinski_violations: 0 }
  },
  {
    id: '3', name: 'MF-003', smiles: 'CC12CCC3C(C1CCC2O)CCC4CC(=O)CCC34C', formula: 'C19H28O2',
    molecular_weight: 288.42, logp: 3.3, hbd: 1, hba: 2, tpsa: 37.3,
    status: 'preclinical', target_id: '1', created_at: '2026-02-01T10:00:00Z',
    properties: { rotatable_bonds: 0, aromatic_rings: 0, lipinski_violations: 0 }
  },
  {
    id: '4', name: 'MF-004', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C', formula: 'C8H10N4O2',
    molecular_weight: 194.19, logp: -0.07, hbd: 0, hba: 6, tpsa: 58.4,
    status: 'clinical', target_id: '3', created_at: '2026-02-10T10:00:00Z',
    properties: { rotatable_bonds: 0, aromatic_rings: 2, lipinski_violations: 0 }
  },
  {
    id: '5', name: 'MF-005', smiles: 'OC(=O)c1cc(O)c(O)c(O)c1', formula: 'C7H6O5',
    molecular_weight: 170.12, logp: 0.7, hbd: 4, hba: 5, tpsa: 97.99,
    status: 'discovery', target_id: '2', created_at: '2026-02-15T10:00:00Z',
    properties: { rotatable_bonds: 1, aromatic_rings: 1, lipinski_violations: 0 }
  },
  {
    id: '6', name: 'MF-006', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O', formula: 'C13H18O2',
    molecular_weight: 206.28, logp: 3.5, hbd: 1, hba: 2, tpsa: 37.3,
    status: 'optimization', target_id: '3', created_at: '2026-02-20T10:00:00Z',
    properties: { rotatable_bonds: 4, aromatic_rings: 1, lipinski_violations: 0 }
  },
]

export const mockTargets: Target[] = [
  { id: '1', name: 'EGFR Kinase', gene: 'EGFR', organism: 'Homo sapiens', pdb_id: '1M17', druggability_score: 0.92, therapeutic_area: 'Oncology', created_at: '2026-01-01T10:00:00Z' },
  { id: '2', name: 'ACE2 Receptor', gene: 'ACE2', organism: 'Homo sapiens', pdb_id: '6M0J', druggability_score: 0.78, therapeutic_area: 'Infectious Disease', created_at: '2026-01-05T10:00:00Z' },
  { id: '3', name: 'PDE5 Phosphodiesterase', gene: 'PDE5A', organism: 'Homo sapiens', pdb_id: '1UDT', druggability_score: 0.88, therapeutic_area: 'Cardiovascular', created_at: '2026-01-10T10:00:00Z' },
  { id: '4', name: 'TNF-alpha', gene: 'TNF', organism: 'Homo sapiens', pdb_id: '1TNF', druggability_score: 0.65, therapeutic_area: 'Immunology', created_at: '2026-01-12T10:00:00Z' },
  { id: '5', name: 'BRAF Kinase', gene: 'BRAF', organism: 'Homo sapiens', pdb_id: '1UWH', druggability_score: 0.95, therapeutic_area: 'Oncology', created_at: '2026-01-15T10:00:00Z' },
]

export const mockDockingResults: DockingResult[] = [
  { id: '1', molecule_id: '1', target_id: '1', binding_energy: -8.5, rmsd: 1.2, interactions: [{ type: 'hydrogen_bond', residue: 'THR790', distance: 2.8 }, { type: 'hydrophobic', residue: 'LEU718', distance: 3.5 }], pose_data: {}, created_at: '2026-02-01T10:00:00Z' },
  { id: '2', molecule_id: '2', target_id: '2', binding_energy: -6.3, rmsd: 2.1, interactions: [{ type: 'pi_stacking', residue: 'PHE486', distance: 3.8 }], pose_data: {}, created_at: '2026-02-02T10:00:00Z' },
  { id: '3', molecule_id: '3', target_id: '1', binding_energy: -9.1, rmsd: 0.8, interactions: [{ type: 'hydrogen_bond', residue: 'MET793', distance: 2.5 }, { type: 'hydrophobic', residue: 'VAL726', distance: 3.2 }], pose_data: {}, created_at: '2026-02-03T10:00:00Z' },
  { id: '4', molecule_id: '4', target_id: '3', binding_energy: -7.8, rmsd: 1.5, interactions: [{ type: 'hydrogen_bond', residue: 'GLN817', distance: 2.9 }], pose_data: {}, created_at: '2026-02-04T10:00:00Z' },
]

export const mockADMET: ADMETData[] = [
  { id: '1', molecule_id: '1', absorption: 0.85, distribution: 0.72, metabolism: 0.65, excretion: 0.78, toxicity: 0.15, bioavailability: 0.80, half_life: 4.5, solubility: 0.90, created_at: '2026-02-01T10:00:00Z' },
  { id: '2', molecule_id: '2', absorption: 0.45, distribution: 0.88, metabolism: 0.55, excretion: 0.42, toxicity: 0.35, bioavailability: 0.40, half_life: 12.0, solubility: 0.20, created_at: '2026-02-02T10:00:00Z' },
  { id: '3', molecule_id: '3', absorption: 0.70, distribution: 0.65, metabolism: 0.80, excretion: 0.60, toxicity: 0.20, bioavailability: 0.65, half_life: 6.5, solubility: 0.55, created_at: '2026-02-03T10:00:00Z' },
  { id: '4', molecule_id: '4', absorption: 0.95, distribution: 0.50, metabolism: 0.70, excretion: 0.85, toxicity: 0.05, bioavailability: 0.99, half_life: 5.0, solubility: 0.95, created_at: '2026-02-04T10:00:00Z' },
  { id: '5', molecule_id: '5', absorption: 0.60, distribution: 0.55, metabolism: 0.75, excretion: 0.70, toxicity: 0.10, bioavailability: 0.55, half_life: 3.0, solubility: 0.85, created_at: '2026-02-05T10:00:00Z' },
  { id: '6', molecule_id: '6', absorption: 0.88, distribution: 0.75, metabolism: 0.60, excretion: 0.72, toxicity: 0.12, bioavailability: 0.85, half_life: 8.0, solubility: 0.70, created_at: '2026-02-06T10:00:00Z' },
]

export const mockSynthesisRoutes: SynthesisRoute[] = [
  { id: '1', molecule_id: '1', steps: [
    { reagent: 'Acetic anhydride', conditions: 'RT, 2h', yield: 95 },
    { reagent: 'Salicylic acid', conditions: 'H2SO4 catalyst, 60C', yield: 88 },
  ], total_yield: 83.6, estimated_cost: 12.50, feasibility_score: 0.95, created_at: '2026-02-01T10:00:00Z' },
  { id: '2', molecule_id: '3', steps: [
    { reagent: 'Cholesterol', conditions: 'Oppenauer oxidation', yield: 75 },
    { reagent: 'Jones reagent', conditions: '0C, 1h', yield: 82 },
    { reagent: 'LiAlH4', conditions: 'THF, reflux', yield: 70 },
  ], total_yield: 43.05, estimated_cost: 85.00, feasibility_score: 0.72, created_at: '2026-02-03T10:00:00Z' },
  { id: '3', molecule_id: '4', steps: [
    { reagent: 'Dimethylurea', conditions: '200C, sealed tube', yield: 60 },
    { reagent: 'Methyl iodide', conditions: 'DMF, K2CO3', yield: 85 },
  ], total_yield: 51.0, estimated_cost: 45.00, feasibility_score: 0.80, created_at: '2026-02-04T10:00:00Z' },
]

// 3D atom positions for molecule visualization
export const moleculeAtoms: Record<string, { atoms: { element: string; x: number; y: number; z: number }[]; bonds: [number, number, number][] }> = {
  '1': { // Aspirin-like
    atoms: [
      { element: 'C', x: 0, y: 0, z: 0 }, { element: 'C', x: 1.4, y: 0, z: 0 },
      { element: 'C', x: 2.1, y: 1.2, z: 0 }, { element: 'C', x: 1.4, y: 2.4, z: 0 },
      { element: 'C', x: 0, y: 2.4, z: 0 }, { element: 'C', x: -0.7, y: 1.2, z: 0 },
      { element: 'O', x: -0.7, y: -1.0, z: 0 }, { element: 'C', x: -0.7, y: -2.2, z: 0 },
      { element: 'O', x: -1.9, y: -2.2, z: 0 }, { element: 'O', x: 0, y: -3.2, z: 0 },
      { element: 'O', x: 2.1, y: -1.0, z: 0 }, { element: 'C', x: 3.4, y: -1.0, z: 0 },
      { element: 'O', x: 4.1, y: 0, z: 0 }, { element: 'C', x: 3.4, y: -2.4, z: 0 },
    ],
    bonds: [[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[0,6,1],[6,7,1],[7,8,2],[7,9,1],[1,10,1],[10,11,1],[11,12,2],[11,13,1]]
  },
  '2': { // Pyrene-like
    atoms: [
      { element: 'C', x: 0, y: 0, z: 0 }, { element: 'C', x: 1.2, y: 0.7, z: 0 },
      { element: 'C', x: 1.2, y: 2.1, z: 0 }, { element: 'C', x: 0, y: 2.8, z: 0 },
      { element: 'C', x: -1.2, y: 2.1, z: 0 }, { element: 'C', x: -1.2, y: 0.7, z: 0 },
      { element: 'C', x: 2.4, y: 0, z: 0 }, { element: 'C', x: 3.6, y: 0.7, z: 0 },
      { element: 'C', x: 3.6, y: 2.1, z: 0 }, { element: 'C', x: 2.4, y: 2.8, z: 0 },
    ],
    bonds: [[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1],[1,6,1],[6,7,2],[7,8,1],[8,9,2],[9,2,1]]
  },
  '4': { // Caffeine-like
    atoms: [
      { element: 'C', x: 0, y: 0, z: 0 }, { element: 'N', x: 1.2, y: 0, z: 0 },
      { element: 'C', x: 1.9, y: 1.2, z: 0 }, { element: 'N', x: 1.2, y: 2.4, z: 0 },
      { element: 'C', x: 0, y: 2.4, z: 0 }, { element: 'C', x: -0.7, y: 1.2, z: 0 },
      { element: 'O', x: -0.7, y: 3.4, z: 0 }, { element: 'N', x: -2.0, y: 1.2, z: 0 },
      { element: 'C', x: -2.7, y: 2.4, z: 0 }, { element: 'O', x: -2.7, y: 0, z: 0 },
      { element: 'N', x: 3.2, y: 1.2, z: 0 }, { element: 'C', x: 1.9, y: -1.2, z: 0 },
    ],
    bonds: [[0,1,1],[1,2,1],[2,3,2],[3,4,1],[4,5,1],[5,0,2],[4,6,2],[5,7,1],[7,8,1],[7,9,2],[2,10,1],[1,11,1]]
  },
}
