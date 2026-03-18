# MoleculeForge

**AI-Powered Drug Discovery Platform**

MoleculeForge is an interactive platform for computational drug discovery. Visualize molecules in 3D, predict properties, browse protein targets, simulate docking, analyze ADMET profiles, and plan synthesis routes -- all powered by AI.

## Features

- **3D Molecule Viewer** -- Visualize molecular structures with interactive Three.js rendering
- **Molecule Editor** -- Draw and modify molecular structures directly in the browser
- **Property Prediction** -- AI-driven prediction of molecular properties and drug-likeness
- **Target Browser** -- Explore protein targets and binding sites for drug candidates
- **Docking Visualizer** -- Simulate and visualize protein-ligand docking results
- **ADMET Dashboard** -- Analyze absorption, distribution, metabolism, excretion, and toxicity profiles
- **Synthesis Planner** -- AI-assisted retrosynthetic route planning

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **3D Rendering:** Three.js, React Three Fiber, React Three Drei
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Backend:** Supabase
- **Charts:** Recharts
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd moleculeforge
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   └── page.tsx            # Main application (tabbed interface)
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── MoleculeViewer.tsx  # 3D molecule visualization
│   ├── MoleculeEditor.tsx  # Structure editor
│   ├── PropertyPredictor.tsx
│   ├── TargetBrowser.tsx   # Protein target explorer
│   ├── DockingVisualizer.tsx
│   ├── ADMETDashboard.tsx  # ADMET profiling
│   └── SynthesisPlanner.tsx
└── lib/
    ├── store.ts            # Zustand state management
    └── mock-data.ts        # Sample molecular data
```

## License

MIT
