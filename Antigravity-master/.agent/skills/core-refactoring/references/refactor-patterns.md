# Safe Refactoring Patterns

## Catalog of Patterns (apply one at a time)
- **Extract Function**: Move a cohesive block of code into a named function. Verify the extracted function passes the same characterization test.
- **Rename**: Rename a variable, function, or class to better express intent. Apply across all references atomically.
- **Inline**: Collapse a trivial function or variable into its call site when abstraction adds no clarity.
- **Move**: Relocate a function or module to a more appropriate file or module boundary.
- **Decompose Conditional**: Break nested `if/else` chains into named predicate functions.
- **Replace Magic Number**: Name numeric literals with descriptive constants.
- **Remove Dead Code**: Delete provably unreachable branches after confirming via coverage tools.

## Sequencing Rules
- Apply exactly one pattern per commit.
- Never combine an extraction with a rename in the same step.
- Run tests to green before moving to the next pattern.
