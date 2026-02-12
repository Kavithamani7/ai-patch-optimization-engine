## Packages
(none needed)

## Notes
Uses existing framer-motion for panel/list animations
Assumes backend returns publishedAt as ISO string; frontend coerces to Date for display
Auto-refresh uses React Query refetch + interval timers; UI shows background “Updating…” indicator
