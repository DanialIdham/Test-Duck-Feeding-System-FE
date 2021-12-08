Run this using NPM

I implemented this using Redux Thunk and the material ui libaray for the design.

Command for deployment:
heroku container:login
heroku container:push web --remote docker
heroku container:release web --remote docker
