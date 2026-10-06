# Backend Profiling & Performance Guidelines

## CPU & Memory Profiling
- **Node.js**: `node --inspect index.js` (Chrome DevTools CPU / Heap profile) or `clinic doctor` / `clinic flame`.
- **Python**: `cProfile`, `py-spy`, `memory_profiler`.

## Async Non-Blocking Rules
1. Never execute synchronous blocking calls on main event loop (`fs.readFileSync`, `JSON.parse` on 50MB files).
2. Offload heavy computational loops to worker threads (`worker_threads` or ProcessPoolExecutor).
3. Tune database connection pool sizes based on database max connections.
