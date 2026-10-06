# Performance Measurement Protocol

## Absolute Rule: BEFORE and AFTER
Never claim a performance optimization without empirical data from both before and after the change.

## Protocol Steps
1. **Define Target Metric**: Latency (P50, P95, P99), Throughput (RPS), Memory (MB), Bundle Size (KB), or Web Vitals (LCP, CLS, INP).
2. **Run Baseline Benchmark**: Execute benchmark tool 3 times and average the results. Record exact numbers in handoff.
3. **Apply Minimal Code Edit**: Apply single performance fix.
4. **Run Verification Benchmark**: Execute benchmark under identical test conditions (same hardware, same dataset, same concurrency).
5. **Calculate Delta**: Compute exact percentage change:
   `Delta = ((Before - After) / Before) * 100%`

## Rejection Rule
If the delta shows no meaningful improvement (< 5%) or shows regression, revert the change immediately.
