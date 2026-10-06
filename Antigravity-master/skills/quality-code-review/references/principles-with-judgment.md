# Engineering Design Principles with Judgment

## Core Rule
Software engineering principles (SOLID, DRY, KISS, YAGNI) are tools to serve maintainability, NOT rigid dogma.
- **Cite ONLY when outcome changes**: Do not cite principles speculatively. Cite a principle only when applying it directly solves a clear issue.
- **Avoid Over-Engineering**: Never demand abstraction layers (e.g. multi-level factory interfaces for single implementations) under the banner of SOLID if it makes the code harder to follow or increases overhead unnecessarily.
- **DRY vs Repetition**: A small amount of explicit duplication is better than a premature, coupling-heavy abstraction.
