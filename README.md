# Dummy Instagram App
This application will be a REST API set up with express that will allow a user to send REST calls to sign up for an account and begin "posting pictures" with captions.

## API Endpoints
Users:
- POST /users - creates a new user
- GET /users/me - pulls the current logged in user
- POST /users/login - logs a user in
- POST /users/logout - logs a user out

Posts:
- POST /posts - creates a new post for the user
- GET /posts - gets all posts by the current user
- GET /posts/:id - gets the post with the corresponding ID that is passed in
- PATCH /posts/:id - updates the post with the corresponding ID that is passed in
- DELETE /posts/:id - deletes the post with the corresopnding ID that is passed in
