# Typing Jungle: Solana Agave Edition 🌴⚡

A pixel-to-pixel, authentic clone of **Typing Jungle** (from EdClub / TypingClub), featuring a comprehensive touch-typing curriculum constructed entirely from the production codebase of the **Solana Agave** validator.

---

## 📌 Codebase Version Information

* **Upstream Repository:** [https://github.com/anza-xyz/agave](https://github.com/anza-xyz/agave)
* **Codebase Version:** **`v5.0.0-alpha.1`** (Targeting Solana Agave 2026/2027 engine)
* **Active Base Commit:** `07289a6692285a1f3bdb4a1121b24f0c5a589298`
* **Latest Official Tag:** `v4.4.1`
* **Total Agave Crates & Modules Ingested:** **134 modules**
* **Total Typing Lessons:** **1,754 lessons** across **11 chapters**

---

## 🗺️ Curriculum Structure

Every part of the Agave repository has been parsed into bite-sized, typing-friendly lessons:

| Chapter | Title | Modules / Topics Covered | Lessons |
| :--- | :--- | :--- | :---: |
| **Chapter 1** | **Manifests & Configurations (TOML)** | `Cargo.toml`, `rust-toolchain.toml`, `clippy.toml`, `deny.toml`, `rustfmt.toml`, `tombi.toml`, `.rumdl.toml`, and crate-level manifests across 124 crates | **450** |
| **Chapter 2** | **CI/CD & Build Infrastructure** | GitHub Actions (`.github/workflows/*.yml`), Buildkite (`.buildkite/*`), CI test harnesses (`ci/*.sh`), SBF toolchains (`cargo-build-sbf`, `fetch-*.sh`) | **236** |
| **Chapter 3** | **Solana SDK & Core Primitives** | `sdk`, `transaction-context`, `feature-set`, `fee`, `cost-model`, `reserved-account-keys`, `version` | **32** |
| **Chapter 4** | **Proof of History & Ledger Pipeline** | `poh`, `entry`, `ledger` (Blockstore), `shred`, `merkle-tree`, `poh-bench` | **64** |
| **Chapter 5** | **Solana Virtual Machine (SVM)** | `svm`, `program-runtime`, `compute-budget`, `syscalls`, `runtime-transaction`, `runtime` | **148** |
| **Chapter 6** | **AccountsDB & Memory Engine** | `accounts-db` (AppendVec), `bucket_map`, `lattice-hash`, `snapshots`, `stake-accounts` | **77** |
| **Chapter 7** | **Consensus, Voting & Validator** | `core` (BankingStage, ReplayStage), `validator`, `leader-schedule`, `vote`, `votor`, `test-validator` | **111** |
| **Chapter 8** | **Networking, Turbine & Streamer** | `gossip` (CRDS), `turbine` (Shred tree broadcast), `streamer`, `connection-cache`, `quic-client`, `tpu-client` | **116** |
| **Chapter 9** | **RPC, Client SDKs & Tooling** | `rpc`, `banks-client`, `cli`, `keygen`, `ledger-tool`, `faucet`, `clap-utils`, `dev-bins` | **168** |
| **Chapter 10** | **Native Programs & Cryptography** | `programs` (System, Stake, Vote, BPF Loader), `builtins`, `zk-token-sdk`, `bls-sigverify`, `precompiles` | **46** |
| **Chapter 11** | **System Utilities & Platform Crates** | `perf`, `bloom`, `measure`, `memory`, `io-uring`, `jemalloc`, `xdp`, `xdp-ebpf`, `worker-pool`, `watchtower` | **306** |
| **Total** | | **134 modules across all Agave domains** | **1,754** |

---

## 🎮 Interface & Feature Details

1. **Pixel-Matched Course Map (Dashboard):**
   * Smooth, sinusoidal winding snake trail with circular level nodes.
   * Node states: Locked, Current (pulsing gold ring), and Completed (blue with star indicators).
   * 0 to 5 dynamic star badges per lesson.
   * Chapter carousel and crate filter dropdown.

2. **The Typing Arena:**
   * Monospace code canvas with line numbers and syntax styling.
   * Real-time character evaluation: correct characters dim gracefully; mistakes highlight in bold red.
   * Active character box with smooth blinking cursor.
   * Live performance meters: Net WPM, Key Accuracy %, Goal comparison, and Elapsed Timer.

3. **ANSI QWERTY Virtual Keyboard:**
   * 5 full key rows matching exact TypingClub dimensions.
   * Color-coded finger zones:
     * **Pinkies:** Peach / Orange
     * **Rings:** Soft Yellow
     * **Middles:** Spring Green
     * **Index Fingers:** Sky Blue
     * **Thumbs:** Lavender (Spacebar)
   * Active key glow showing the target key.
   * Dual Shift key lighting: automatically lights up the opposite hand's Shift key for code characters (`{`, `}`, `(`, `)`, `:`, `"`, `&`, `|`, `*`, `_`).
   * Tactile keypress response reacting to user's physical keyboard.

4. **Interactive Hand Placement Guide:**
   * Vector illustrated left and right hands positioned below the keyboard.
   * The required finger lights up in sync with the active key and pulses to guide proper finger technique.

5. **Web Audio API Sound Synthesizer:**
   * Mechanical keypress clacks (sine/triangle oscillator decay).
   * Low-frequency buzzer for error feedback.
   * Ascending C-major arpeggio fanfare for star scoring.

6. **Level Completion Modal & Scoring:**
   * 1 to 5 star rating threshold calculation based on WPM and Accuracy goals.
   * Detailed metrics breakdown: WPM, Accuracy %, Mistakes, and Duration.
   * Particle confetti burst on 4 and 5-star completions.
   * Automatic progress persistence via browser `localStorage`.

7. **Curriculum Drawer:**
   * Search and filter through all 1,754 lessons by module name, crate, file, or lesson ID.

---

## 🚀 Running the Application

### Development Server
```bash
npm run dev
# Starts Vite server on http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```
