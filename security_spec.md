# Security Spec - Socio Learning Platform

## Data Invariants
- A user document must have a UID matching the document ID.
- The `role` field is immutable for non-admins.
- Only admins can access the `admins` collection.
- Users can only edit their own profile fields (username, avatar).

## Dirty Dozen Payloads (Rejection Targets)
1. Set `role: 'admin'` on a user document by a non-admin.
2. Update another user's `username`.
3. Create a user document with a different `uid` than the authenticated user.
4. Read the `admins` collection as a non-admin.
5. Create a document in `users` without a `username`.
6. Inject a 2MB string into the `username` field.
7. Update `lastActive` with a client-side timestamp instead of `request.time`.
8. Delete the `admins` collection.
9. Write to the `users` collection without being authenticated.
10. Update a terminal status (if any existed, but here we'll protect `role`).
11. List all users without filtering (if PII was included, but here we'll restrict list for general users).
12. Orphaned writes: updating status without auth.

## Test Runner (Logic)
- Ensure `isValidUser()` is called on write.
- Ensure `isOwner()` is checked.
- Ensure `isAdmin()` is checked via `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
