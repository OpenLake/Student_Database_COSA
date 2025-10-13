1. Goal

Implement a conditional rendering feature where a button on the frontend is visible only if the logged-in user’s email matches the official contact email of the event’s organizing unit.

2. Backend Analysis

User model (User) has username (used as email for login) and personal_info.email.

Organizational Unit model (OrganizationalUnit) has contact_info.email → this is the “official email” for the unit.

Key point:
To check if a user is an “organizing unit member,” we match:

loggedInUser.username === event.organizing_unit.contact_info.email


This email is different from a normal user because normal students have their personal username and personal_info.email unrelated to an organizational unit.

Only organizational unit users (like club coordinators) have their username equal to their unit’s official contact_info.email.

3. Backend Routes

/api/events → GET events.

/api/events/:id → GET a specific event, populated with organizing_unit_id.

/api/orgUnit or /api/club → routes for creating organizational units (with auth).

We do not need to modify these routes to check for the user; we only need the populated organizing_unit.contact_info.email and the logged-in user info.

4. Frontend Approach

When fetching an event, you now have both:

event.organizing_unit_id.contact_info.email

loggedInUser.username (from context or auth)

To conditionally render the button:

{loggedInUser.username === event.organizing_unit_id.contact_info.email && (
  <button>Edit Event</button>
)}


Only users whose email matches the organizing unit email will see the button.

5. Testing

You need a test organizational unit account.

Options:

Create a unit & user in backend (complex due to auth and transactions).

Simpler: ask maintainer for a test account. ✅

Once you log in with that account, you can verify the button visibility.

✅ Conclusion

How we check if a user is from an organization: Compare the logged-in user’s username with the event’s organizing unit contact_info.email.

Normal users won’t match, so the button remains hidden.

Only the unit user (coordinator) will see it.



__THE FLOW__
Typical flow you described (correct)

Rendering the events page (frontend)

Frontend fetches events (e.g. GET /api/events or GET /api/events/by-role/...).

To decide whether to show the Edit button it either:

calls your /api/events/:eventId/is-contact for each event (or once per event detail), or

uses data already returned by the events endpoint (if it contains organizing_unit_id.contact_info.email) and compares that to the logged-in user on the client.

This is purely a UX check (so the user sees/hides buttons).

When the user tries to update/delete an event (action)

Frontend sends the actual mutating request (e.g. PUT /api/events/:id, DELETE /api/events/:id).

The server-side isEventContact middleware runs on that route and enforces the authorization (it verifies the logged-in user is the unit contact). If the check fails, the server returns 403 and the action is blocked