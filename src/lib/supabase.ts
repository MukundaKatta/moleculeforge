import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Molecule = {
  id: string
  name: string
  smiles: string
  formula: string
  molecular_weight: number
  logp: number
  hbd: number
  hba: number
  tpsa: number
  status: 'discovery' | 'optimization' | 'preclinical' | 'clinical'
  target_id: string | null
  created_at: string
  properties: Record<string, any>
}

export type Target = {
  id: string
  name: string
  gene: string
  organism: string
  pdb_id: string | null
  druggability_score: number
  therapeutic_area: string
  created_at: string
}

export type DockingResult = {
  id: string
  molecule_id: string
  target_id: string
  binding_energy: number
  rmsd: number
  interactions: Record<string, any>[]
  pose_data: Record<string, any>
  created_at: string
}

export type ADMETData = {
  id: string
  molecule_id: string
  absorption: number
  distribution: number
  metabolism: number
  excretion: number
  toxicity: number
  bioavailability: number
  half_life: number
  solubility: number
  created_at: string
}

export type SynthesisRoute = {
  id: string
  molecule_id: string
  steps: { reagent: string; conditions: string; yield: number }[]
  total_yield: number
  estimated_cost: number
  feasibility_score: number
  created_at: string
}
