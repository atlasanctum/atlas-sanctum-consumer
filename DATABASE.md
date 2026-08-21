# Atlas Data and Authorization Model

Atlas persists the user’s Life OS in user-scoped relational tables. Every server procedure derives the active identity from the authenticated request context; a client never submits an arbitrary user identifier. All list, read, update, and delete helpers receive the authenticated actor identifier and filter on `userId`, so records belonging to another account are outside the query scope.

| Data group | Persistence | Authorization rule |
| --- | --- | --- |
| Personal Graph and memory | `atlasLifeRecords` | The active user may only read or mutate their own records. |
| Decisions, actions, outcomes, and impact | `atlasLifeRecords` | Records are stored as structured, user-scoped domain entries. |
| Brief preferences and delivery state | `atlasBriefPreferences` | The active user controls schedule, depth, notification mode, and pause state. |
| Sensitive health and financial payloads | `atlasSensitiveRecords` | Server-side encryption and active consent are required before storage. |

The initial connected release preserves the mobile store as an offline cache. When an authenticated session is available, Atlas can hydrate a server snapshot and synchronise user-confirmed state through protected procedures. Inference remains identifiable as an inference and is never silently promoted to a user-confirmed fact.

## Retail Provider Environment

| Variable | Purpose | Safe behavior when absent |
| --- | --- | --- |
| `EBAY_CLIENT_ID` | Obtains a server-side eBay application token. | Atlas returns an explicit unavailable state and retains non-live product evidence. |
| `EBAY_CLIENT_SECRET` | Completes the server-side application-token exchange. | No token request is attempted. |
| `EBAY_API_BASE_URL` | Allows the production or sandbox eBay API base URL to be selected. | Atlas uses the production base URL only after both credentials are available. |
