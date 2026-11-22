import os
import re
import json

REPO_ROOT = os.environ.get('AGAVE_REPO_ROOT', '/tmp/agave')
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'data')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'curriculum.json')

def clean_snippet(text, max_lines=24, min_lines=8):
    """Clean comments and format lines nicely for typing."""
    lines = text.splitlines()
    cleaned = []
    in_block_comment = False
    
    for line in lines:
        stripped = line.strip()
        if in_block_comment:
            if '*/' in stripped:
                in_block_comment = False
            continue
        if stripped.startswith('/*'):
            if '*/' not in stripped:
                in_block_comment = True
            continue
        # Skip pure comment banners
        if stripped.startswith('//') or (stripped.startswith('#') and not stripped.startswith('#[')):
            continue
        if not stripped and (not cleaned or not cleaned[-1].strip()):
            continue
        # Convert tabs to 4 spaces
        line = line.replace('\t', '    ')
        # Limit trailing whitespace
        line = line.rstrip()
        cleaned.append(line)
        if len(cleaned) >= max_lines:
            break
            
    while cleaned and not cleaned[-1].strip():
        cleaned.pop()
        
    if len(cleaned) < min_lines:
        return None
    return '\n'.join(cleaned)

def extract_chunks(file_path, language='rust', chunk_size=20):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception:
        return []

    # Strip license headers
    content = re.sub(r'/\*![\s\S]*?\*/', '', content)
    content = re.sub(r'/\*[\s\S]*?Copyright[\s\S]*?\*/', '', content, flags=re.IGNORECASE)
    content = re.sub(r'//\s*Copyright[\s\S]*?\n', '', content, flags=re.IGNORECASE)

    raw_lines = content.splitlines()
    chunks = []
    current_lines = []
    
    for line in raw_lines:
        line_clean = line.replace('\t', '    ').rstrip()
        stripped = line_clean.strip()
        
        # Skip comment lines
        if stripped.startswith('//'):
            continue
            
        current_lines.append(line_clean)
        
        if len(current_lines) >= 14 and (
            stripped.startswith('}') or 
            stripped.startswith('pub fn') or 
            stripped.startswith('impl') or 
            stripped.startswith('[') or 
            stripped.endswith(';') or
            len(current_lines) >= chunk_size
        ):
            snippet = clean_snippet('\n'.join(current_lines), max_lines=24, min_lines=8)
            if snippet:
                chunks.append(snippet)
            current_lines = []
            if len(chunks) >= 3:
                break
                
    if current_lines and len(chunks) < 3:
        snippet = clean_snippet('\n'.join(current_lines), max_lines=24, min_lines=8)
        if snippet:
            chunks.append(snippet)
            
    return chunks

CHAPTERS = [
    {
        "id": 1,
        "title": "Manifests & Configurations (TOML)",
        "slug": "manifests-toml",
        "description": "Master Solana's build manifests, workspace configs, compiler flags, and toolchain TOMLs.",
        "icon": "Settings"
    },
    {
        "id": 2,
        "title": "CI/CD & Build Infrastructure",
        "slug": "ci-cd-infra",
        "description": "GitHub Actions workflows, Buildkite pipelines, SBF toolchains, and CI automation scripts.",
        "icon": "Terminal"
    },
    {
        "id": 3,
        "title": "Solana SDK & Core Primitives",
        "slug": "solana-sdk",
        "description": "Pubkey, Signature, Instruction, Transaction, Account, and fee calculation primitives.",
        "icon": "Code"
    },
    {
        "id": 4,
        "title": "Proof of History & Ledger Pipeline",
        "slug": "poh-ledger",
        "description": "Verifiable delay cryptography, tick recording, entries, shreds, and blockstore storage.",
        "icon": "Clock"
    },
    {
        "id": 5,
        "title": "Solana Virtual Machine (SVM)",
        "slug": "svm-runtime",
        "description": "High-throughput transaction execution engine, invoke contexts, compute meters, and BPF syscalls.",
        "icon": "Cpu"
    },
    {
        "id": 6,
        "title": "AccountsDB & Memory Engine",
        "slug": "accounts-db",
        "description": "High-concurrency append-vec storage, bucket index maps, bank hash verification, and snapshots.",
        "icon": "Database"
    },
    {
        "id": 7,
        "title": "Consensus, Voting & Validator",
        "slug": "consensus-validator",
        "description": "Validator node startup, banking stage, replay loop, leader schedule, and consensus voting.",
        "icon": "ShieldCheck"
    },
    {
        "id": 8,
        "title": "Networking, Turbine & Streamer",
        "slug": "networking-turbine",
        "description": "Gossip cluster protocol, tree-based shred distribution (Turbine), and QUIC transport streaming.",
        "icon": "Network"
    },
    {
        "id": 9,
        "title": "RPC, Client SDKs & Tooling",
        "slug": "rpc-tooling",
        "description": "JSON-RPC endpoints, banks-client test harness, keygen, ledger exploration, and CLI tools.",
        "icon": "Sliders"
    },
    {
        "id": 10,
        "title": "Native Programs & Cryptography",
        "slug": "programs-crypto",
        "description": "On-chain system/stake programs, zero-knowledge proofs (zk-token-sdk), and BLS signature verification.",
        "icon": "Lock"
    },
    {
        "id": 11,
        "title": "System Utilities & Platform Crates",
        "slug": "platform-crates",
        "description": "Memory managers, thread limiters, eBPF XDP drivers, loggers, and metrics collection.",
        "icon": "Layers"
    }
]

def classify_file(rel_path):
    lower = rel_path.lower()
    if lower.endswith('.toml'):
        return 1
    if lower.startswith('.github') or lower.startswith('.buildkite') or lower.startswith('ci/') or lower.startswith('scripts/') or lower.endswith('.sh') or lower in ['cargo-build-sbf', 'cargo-test-sbf', 'cargo']:
        return 2
    if any(lower.startswith(p) for p in ['sdk/', 'transaction-context/', 'feature-set/', 'fee/', 'cost-model/', 'reserved-account-keys/', 'version/']):
        return 3
    if any(lower.startswith(p) for p in ['poh/', 'entry/', 'ledger/', 'shred/', 'merkle-tree/', 'poh-bench/']):
        return 4
    if any(lower.startswith(p) for p in ['svm', 'program-runtime/', 'compute-budget', 'syscalls/', 'runtime-transaction/', 'runtime/']):
        return 5
    if any(lower.startswith(p) for p in ['accounts-db/', 'bucket_map/', 'lattice-hash/', 'snapshots/', 'stake-accounts/']):
        return 6
    if any(lower.startswith(p) for p in ['core/', 'validator/', 'leader-schedule/', 'vote', 'votor', 'test-validator/']):
        return 7
    if any(lower.startswith(p) for p in ['gossip', 'turbine/', 'streamer/', 'connection-cache/', 'quic-client/', 'tpu-client', 'net', 'tls-utils/']):
        return 8
    if any(lower.startswith(p) for p in ['rpc', 'banks-client/', 'banks-interface/', 'banks-server/', 'cli', 'keygen/', 'ledger-tool/', 'faucet', 'clap', 'dev-bins/']):
        return 9
    if any(lower.startswith(p) for p in ['programs/', 'builtins', 'zk-token-sdk/', 'bls-cert-verify/', 'bls-sigverify/', 'precompiles/']):
        return 10
    return 11

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    all_lessons = []
    lesson_id = 1
    modules_seen = set()

    # 1. Process all TOML files across root and all subdirectories
    print("Collecting TOML configuration files...")
    for root_dir, _, files in os.walk(REPO_ROOT):
        for f in sorted(files):
            if f.endswith('.toml'):
                full_path = os.path.join(root_dir, f)
                rel_path = os.path.relpath(full_path, REPO_ROOT)
                chunks = extract_chunks(full_path, language='toml')
                for i, chunk in enumerate(chunks, 1):
                    module_name = rel_path.split('/')[0] if '/' in rel_path else 'root'
                    modules_seen.add(module_name)
                    all_lessons.append({
                        "id": lesson_id,
                        "chapterId": 1,
                        "module": module_name,
                        "file": rel_path,
                        "title": f"{f} Configuration" if i == 1 else f"{f} Settings (Part {i})",
                        "description": f"Configuration definitions and dependencies from {rel_path}",
                        "language": "toml",
                        "targetWpm": 25,
                        "code": chunk
                    })
                    lesson_id += 1

    # 2. Process CI/CD and Build Infrastructure
    print("Collecting CI/CD and build scripts...")
    ci_dirs = ['.github', '.buildkite', 'ci', 'scripts']
    for ci_dir in ci_dirs:
        dir_path = os.path.join(REPO_ROOT, ci_dir)
        if not os.path.exists(dir_path):
            continue
        for root_dir, _, files in os.walk(dir_path):
            for f in sorted(files):
                if f.endswith(('.yml', '.yaml', '.sh', '.py')):
                    full_path = os.path.join(root_dir, f)
                    rel_path = os.path.relpath(full_path, REPO_ROOT)
                    lang = 'yaml' if f.endswith(('.yml', '.yaml')) else 'bash'
                    chunks = extract_chunks(full_path, language=lang)
                    for i, chunk in enumerate(chunks, 1):
                        modules_seen.add(ci_dir)
                        all_lessons.append({
                            "id": lesson_id,
                            "chapterId": 2,
                            "module": ci_dir,
                            "file": rel_path,
                            "title": f"{f} Pipeline" if i == 1 else f"{f} Automation (Part {i})",
                            "description": f"Continuous integration and build step from {rel_path}",
                            "language": lang,
                            "targetWpm": 30,
                            "code": chunk
                        })
                        lesson_id += 1

    # Top-level shell scripts
    for f in ['cargo-build-sbf', 'cargo-test-sbf', 'cargo', 'fetch-core-bpf.sh', 'fetch-programs.sh', 'fetch-spl.sh']:
        full_path = os.path.join(REPO_ROOT, f)
        if os.path.exists(full_path):
            rel_path = f
            chunks = extract_chunks(full_path, language='bash')
            for i, chunk in enumerate(chunks, 1):
                modules_seen.add('build-scripts')
                all_lessons.append({
                    "id": lesson_id,
                    "chapterId": 2,
                    "module": "build-scripts",
                    "file": rel_path,
                    "title": f"Toolchain Script: {f}" if i == 1 else f"{f} (Part {i})",
                    "description": f"Solana SBF build and test runner utility {f}",
                    "language": "bash",
                    "targetWpm": 30,
                    "code": chunk
                })
                lesson_id += 1

    # 3. Process all Rust crates across the entire repository
    print("Collecting Rust source code across all crates...")
    top_entries = sorted(os.listdir(REPO_ROOT))
    for entry in top_entries:
        entry_path = os.path.join(REPO_ROOT, entry)
        if not os.path.isdir(entry_path) or entry.startswith('.'):
            continue
            
        modules_seen.add(entry)
        chapter_id = classify_file(entry + '/')
        
        # Scan src/ directory of each crate
        src_dir = os.path.join(entry_path, 'src')
        scan_dir = src_dir if os.path.exists(src_dir) else entry_path
        
        found_in_crate = 0
        for root_dir, _, files in os.walk(scan_dir):
            for f in sorted(files):
                if f.endswith('.rs'):
                    full_path = os.path.join(root_dir, f)
                    rel_path = os.path.relpath(full_path, REPO_ROOT)
                    chunks = extract_chunks(full_path, language='rust')
                    for i, chunk in enumerate(chunks, 1):
                        base_name = f[:-3]
                        all_lessons.append({
                            "id": lesson_id,
                            "chapterId": chapter_id,
                            "module": entry,
                            "file": rel_path,
                            "title": f"{entry}::{base_name}" if i == 1 else f"{entry}::{base_name} ({i})",
                            "description": f"Core logic and structures from {rel_path}",
                            "language": "rust",
                            "targetWpm": 32,
                            "code": chunk
                        })
                        lesson_id += 1
                        found_in_crate += 1
                        if found_in_crate >= 6: # Ensure broad coverage across all 118+ crates
                            break
            if found_in_crate >= 6:
                break

    # Re-index lessons sequentially
    for idx, l in enumerate(all_lessons, 1):
        l['id'] = idx

    # Compute chapter stats
    for c in CHAPTERS:
        c_lessons = [l for l in all_lessons if l['chapterId'] == c['id']]
        c['lessonCount'] = len(c_lessons)
        c['modules'] = sorted(list(set(l['module'] for l in c_lessons)))

    result = {
        "metadata": {
            "name": "Typing Jungle: Solana Agave Edition",
            "repo": "https://github.com/anza-xyz/agave",
            "version": "v5.0.0-alpha.1",
            "baseCommit": "07289a6692285a1f3bdb4a1121b24f0c5a589298",
            "totalLessons": len(all_lessons),
            "totalChapters": len(CHAPTERS),
            "totalModulesCovered": len(modules_seen)
        },
        "chapters": CHAPTERS,
        "lessons": all_lessons
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out:
        json.dump(result, out, indent=2)

    print(f"Successfully generated {len(all_lessons)} lessons across {len(CHAPTERS)} chapters!")
    print(f"Total Agave modules/crates covered: {len(modules_seen)}")
    print(f"Saved to: {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
