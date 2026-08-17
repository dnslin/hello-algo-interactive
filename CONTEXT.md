# Domain Glossary

## Core Concepts

### Entity ID
A stable, unique identifier assigned to every data element (array item, tree/graph node, edge, board piece) during trace initialization. Remains constant across moves, swaps, inserts, and reorders to ensure spatial continuity and correct DOM/React reconciliation, preventing key collisions when values are duplicated.

### Semantic Event
A pure data message emitted by an algorithm during execution (e.g., `compare`, `swap`, `visit`, `write`, `backtrack`). Contains domain intent without visual attributes such as pixels, durations, colors, or Tailwind classes.

### Transaction
A grouped sequence of semantic events that together form a single logical step in the algorithm execution. A transaction can span multiple scenes (e.g., updating a graph node and an auxiliary queue simultaneously).

### Marker
The pause and synchronization boundary within the timeline. Represents a settled, stable state where the user can pause, step forward, step backward, or inspect variables and code highlights.

### Timeline Compiler
The engine component that translates an algorithm's transaction and semantic event stream into timed visual cues and motion recipes with explicit offsets and durations for each renderer.

### Scene
A visual viewport dedicated to rendering a specific data structure representation (e.g., Sequence, Linked, Graph/Tree, Grid/Board, or Custom). Multiple scenes can coexist within a Composite layout driven by the same timeline.

### State Snapshot
An immutable snapshot of the scene and algorithm domain state at a given Marker. Enables $O(1)$ random seek, forward step, and backward step without re-running reverse animations.

### Semantic Code Anchor
An abstract identifier (e.g., `LOOP_COMPARE`, `SWAP_ELEMENTS`) emitted during algorithm execution that binds a timeline Marker to corresponding line ranges in multiple programming language implementations (TypeScript, Go, Rust) without hardcoded line numbers.

### Motion Recipe
A renderer-specific visual choreography rule (e.g., lift-and-swap, edge-drawing, cell-fade) applied to semantic events to provide instructional visual feedback during forward animation.

### Step Guard
A safety fuse mechanism within the trace generator that aborts execution with a descriptive error if an algorithm exceeds a defined iteration or event threshold (e.g., 10,000 steps), preventing runaway loops on malformed user inputs.

### Semantic Color Token
A purpose-driven color token defined in OKLCH (e.g., `comparing`, `active`, `sorted`, `conflict`) that maintains accessible contrast in both light and dark modes and is always paired with shape, label, or icon cues for non-color accessibility.

### Deterministic PRNG
A seeded pseudo-random number generator (such as Mulberry32) ensuring that randomized inputs generate strictly identical event sequences and states across reloads and shared URLs.

### Stateless Share URL
A self-contained URL query/hash containing the algorithm ID, validated input payload, and random seed, enabling reproducible sharing without backend persistence.
