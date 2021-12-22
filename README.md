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

- In order to test the website directly, sample data are available.

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

## Some precisions

To add games, just log into the administrator account. In the sample data
(username: Admin, password: admin). Or create an account with the username "Admin". \
Once it's done, a button will appear on the home page to add a game.

The site uses the postsWords.json file to store a table of words for each post to allow classification
documents by relevance when a search is performed. This file contains basic sample data.
To use the website from scratch, it is advisable to clear the object (put {} in the file).