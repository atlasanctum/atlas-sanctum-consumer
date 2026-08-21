# Atlas Daily and Weekly Brief Delivery

Atlas exposes user-controlled daily and weekly brief preferences. A user can enable or pause each brief, select a local delivery time, choose a compact or detailed format, and decide whether a device notification is permitted. Local recurring notifications provide a device-level reminder and link back to the relevant Atlas surface; scheduled backend jobs create refreshed brief records when the user has enabled server delivery.

The schedule boundary is intentionally conservative. Briefs may recommend and prepare actions, but they never execute purchases, cancellations, healthcare interventions, or financial transfers. Quiet-hours and digest preferences are respected before a notification is scheduled. Each scheduled callback is user-owned and writes only that user’s brief record.
