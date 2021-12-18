[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Julien-Devos/ProjetAppSINF-Final/blob/master/README.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/Julien-Devos/ProjetAppSINF-Final/blob/master/README.fr.md)

# Projet d'approfondissement en sciences informatiques : Final project - Game Talks

Final project of group F for the LINFO1212 course at UCLouvain.

The goal of the project is to create a website that have a database, users accounts with login system and search into
the database. For the final project, we were free to choose the subject of the website. The only constraint were that
we had to use the systems listed before and use the following technologies.\
We had to use MongoDB and Node.js with express, hogan and consolidate.

## Requirements:

- Uses Node.js v14.18.1

- Uses MongoDB v5.0.3 with MongoDB Database tools installed

- Needs to have all the required node.js packages installed.

  ```batch
  To install them, open a terminal at the root of the project and run the following command:
  
  $ npm install
  ```

- In order to test the website directly, examples data are available.

  ```batch
  To import them:
  
  $ mongoimport -d GameTalks -c games ./db-init/games.json
  
  $ mongoimport -d GameTalks -c users ./db-init/users.json
  
  $ mongoimport -d GameTalks -c posts ./db-init/posts.json
  
  $ mongoimport -d GameTalks -c comments ./db-init/comments.json
  ```
 
## Set-up:

- If the requirements are met, start the server with the following command:

  ```batch
  $ npm start  
  ```

- And then you can follow the link printed in the console to access the website.