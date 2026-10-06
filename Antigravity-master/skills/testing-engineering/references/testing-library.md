# React Testing Library & DOM Testing Patterns

## Setup
- Install: `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`

## Writing Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../components/TaskCard';

describe('TaskCard', () => {
  it('renders task title and status', () => {
    render(<TaskCard title="Fix auth bug" status="in-progress" />);

    expect(screen.getByText('Fix auth bug')).toBeInTheDocument();
    expect(screen.getByText('in-progress')).toBeInTheDocument();
  });

  it('calls onComplete when checkbox is clicked', async () => {
    const onComplete = vi.fn();
    render(<TaskCard title="Task" status="todo" onComplete={onComplete} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
```

## Conventions
- Query by user-visible attributes: `getByRole`, `getByText`, `getByLabelText`.
- Avoid querying by test ID unless no semantic alternative exists.
- Use `userEvent` over `fireEvent` for realistic user interaction simulation.
