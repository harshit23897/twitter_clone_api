## Twitter Clone REST API

This is a Twitter Clone RESI API. These are all the features supported currently:
1. Register a user (with unique USERNAME).
2. Login a user (with session management).
3. Follow a user.
4. Unfollow a user.
5. Create a tweet.
6. Read a tweet.
7. Delete a tweet.

### Getting Started
* Make sure you have following softwares installed:
  1. Redis (5.0.4) -> https://redis.io/download
  2. Node.js (8.11.4) -> https://nodejs.org/en/download/releases/

* Steps to run:
  1. Open a new terminal window and type this command - redis-server1. 
  2. Open another terminal window in this folder and type this command - npm install.
  3. Create a .env file in this folder, set the value of SECRET to anything. It is used for session secret key. For e.g. SECRET = aksdjakdj98
  4. After this is done, type this command - npm run server
  
### Documentation
The documentation for the API can be found here - https://documenter.getpostman.com/view/5309265/S1ENyJr3
