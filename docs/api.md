# Ticket System API

## Authentication
POST `/auth/register`  
Create a new user account.

POST `/auth/login`  
Authenticate a user and return a JWT.

## Tickets
<!-- view all tickets -->
GET `/tickets`  
Get a list of tickets owned by the authenticated user.

<!-- create tickets -->
POST `/tickets`  
Create a new ticket.

<!-- ticket detail -->
GET `/tickets/:id`  
Get a single ticket by ID

PUT `/tickets/:id`  
Update a ticket.

DELETE `/tickets/:id`  
Delete a ticket.

## Comments
POST `/tickets/:id/comments`  
Add a comment to a ticket.

GET `/tickets/:id/comments`  
Get cooments for a ticket.
