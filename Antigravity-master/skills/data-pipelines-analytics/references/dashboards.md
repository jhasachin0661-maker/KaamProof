# Analytics Dashboards & Visualization

## Visualization Best Practices
- **KPI Cards at Top**: Highlight primary business metrics (Revenue, Active Users, Conversion Rate) with trend indicators.
- **Color Discipline**: Use neutral grays for base elements, bright single accent colors for highlights, red/green strictly for negative/positive variance.
- **Interactivity**: Support global date pickers, tenant/region filters, and drill-downs into detailed records.

## BI & Dashboard Tools
| Tool | Type | Key Features | Best For |
|------|------|--------------|----------|
| Metabase | Open source / Cloud | Easy drag-and-drop builder, native SQL query editor, embedding support | Fast internal tools and embedded product analytics |
| Apache Superset | Open source | Highly customizable, enterprise RBAC, supports complex SQL queries | Large scale enterprise data visualization |
| Streamlit / Dash | Code-based (Python) | Full flexibility using Python charts (Plotly, Altair), custom dynamic UI | Interactive data apps and ML model demos |

## Embedded Analytics Design
When embedding dashboards in web applications:
- Enforce **row-level security (RLS)** using JWT claims or user context parameters.
- Cache query results aggressively at the API gateway layer to prevent database overload from interactive users.
- Provide export capabilities (CSV, PDF) for user self-service.
