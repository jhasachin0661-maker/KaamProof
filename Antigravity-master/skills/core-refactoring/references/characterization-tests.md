# Characterization Tests

## Purpose
Characterization tests pin the current observable behavior of code before any refactoring begins. They document what the code does now, not what it should do. If they fail after a refactoring step, behavior has been accidentally changed.

## Writing Pattern
1. Call the target function/module with representative inputs (typical, boundary, edge cases).
2. Record the actual outputs as assertions without judgment on whether they are correct.
3. Run the tests to confirm they pass on unchanged code before the first edit.

## Example
```python
def test_characterize_calculate_discount():
    # Pinning current behavior, not asserting correctness
    assert calculate_discount(100, "VIP") == 15  # 15% current behavior
    assert calculate_discount(50, "STANDARD") == 0
    assert calculate_discount(0, "VIP") == 0
```
