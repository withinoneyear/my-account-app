
# Sensitive Data workflow
## Unlock flow
1. user clicks to unlock
2. frontend calls api to send verification code
3. user enters verification code
4. frontend sends verification code to backend 
5. frontend calls api to get sensitive data 
6. sensitive ui is rendered with the data returned
7. frontend shows error and lock if api call fails

## Render flow
1. Renders unlocked state when user is in a valid session
2. Renders locked state when user is not in valid session, and remove the hidden sensitive ui that contains the data
3. Use timer to render a warning 1 minutes before session expires


# Api

## Endpoints
- GET /api/verify  - get verification code and send email
- POST /api/verify - verify code
---
- GET /api/me/sensitive - get sensitive user data
- PUT /api/me/sensitive - update sensitive user data
(Sensitive Apis can potentially use a different access token)

# Code Verification
For sake of similicity, [userId, code, expiry, attemps, lockedUntil] will be saved into cache
- when requested, a new record is created
- when code matched, record is deleted
- when code not matching, increase attempts
- when attemps is 3, lock it for 15 minutes


