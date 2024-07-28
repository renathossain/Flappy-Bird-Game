# Flappy Bird Multiplayer

_Team name: Overreact Native_

_Deployed Website: https://flappybirdgame.me_

# Team Members

| Name          | Email                          |
| ------------- | ------------------------------ |
| Renat Hossain | renat.hossain@mail.utoronto.ca |
| Anika Sultana | anika.sultana@mail.utoronto.ca |
| Brandon Lam   | brandon.lam@mail.utoronto.ca   |

# Description of the Web App

We are creating a web app game where multiple players connect to a survival game by scanning a QR code on their phone (optionally they can enter a number code). The game we are creating is similar to Flappy Bird where players move their game character (which is the flappy bird) up and down to avoid obstacles and attempt to survive as long as possible. Each player would get their own flappy bird to control and the bird is being controlled by moving their phone up or down. Once everyone completes the game or quits the game, we will show a highlight of each player. A leaderboard will show everyone’s score.

# How to fulfil Required Elements

- For our landing page, we will have the option for users to register or log-in or play as a guest, and for logging in or authenticating our users, we will use OAuth 2.0. For logged-in users, they can log-out of the application.
- For the frontend components of our game, we will be using Angular.
- A logged-in user can create a game lobby, which can be set to private or public. Then that user can send a QR code to their friends, so they can join the newly created game. Private servers are only accessible via a code, while public servers are available for all players globally. Logged-in or guest users can join, but only logged-in users can create new lobbies.
- To create a QR code in Angular `angularx-qrcode` or similar will be used.
- We will be using Express for our core backend API, so we will make any external API calls or any calls to our database here. The application’s API is RESTful.
- Users can control the bird two ways. They can either use the up/down button, which acts like a console or they can motion their phone up and down, which requires a device with a gyroscope. To move the bird up, the user clicks on the up button and we can use websockets to listen to this action so we do not have to send an API request each time the up button is pressed. To control the bird using motion, the user uses their phone and this can be achieved in the HTML (window.DeviceOrientationEvent).
- To implement player highlights (animation), we can store user game information and recreate the positions of the bird again to make a video/animation.
- To implement the leaderboard, we can just make API calls to our backend to get database information about a particular game. Then we can make a component in the frontend to show the scores of each player.
- For storing game information we will be using a SQL database because our data is very rigid and we do not need schema flexibility. We are thinking of using PostgreSQL for that reason.
- We propose the app interacts with financial service for monetary donations or in-app purchases to unlock certain features. For example, the user can unlock “cooler looking birds” or skins using payment. We can use external APIs from Stripe or Paypal to accomplish the payment of the user.

# How to fulfil Additional Elements

- The “real-time” aspect is fulfilled, since it is a multiplayer game.
- We can show ads by using Google Ads for ads (an additional external api)
- We can use webhook when we are confirming a user payment and also registration. Both of these cases, we can send a confirmation email.

# Project Milestones

| Milestone     | Description                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Alpha version | Date: Thursday, June 27, 2024<br>Authentication/Registration and playable single player version of Flappy bird                             |
| Beta version  | Date: Thursday, July 11, 2024<br>Multiplayer, Lobbies, joining with QR code and number codes.                                              |
| Final version | Date: Thursday, July 25, 2024<br>Includes additional requirements (leaderboard, replay) and additional refinement and improved aesthetics. |
