# mds-assignment4

## Netlify password protection

The Kanban page is protected by a Netlify Edge Function. Configure these environment variables for the site in the Netlify dashboard
for production and any deploy contexts where the page should be protected.
By default, Netlify variables are available to all scopes; if your plan lets
you choose a scope, select **Functions** (Edge Functions use this scope too):

- `KANBAN_PASSWORD`: the password users must enter.
- `SESSION_SECRET`: a randomly generated secret used to sign one-hour sessions.

Keep both values out of the repository. After setting them, trigger a new
deployment. The protection applies to `KanbanFlowLab.html`, including direct
requests to that file. Use a strong, unique password; the previous
client-side password should be considered disclosed and changed.