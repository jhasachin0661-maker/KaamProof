# Cypress Best Practices

## Selection & Intercepts
- Use data-testid or accessible text selectors (`cy.findByRole('button', { name: /save/i })`).
- Intercept network API calls using `cy.intercept('GET', '/api/v1/users', { fixture: 'users.json' })`.
- Never use fixed time delays (`cy.wait(5000)`). Wait for aliased routes instead (`cy.wait('@getUsers')`).
