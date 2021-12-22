[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/Julien-Devos/ProjetAppSINF-Final/blob/master/README.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/Julien-Devos/ProjetAppSINF-Final/blob/master/README.fr.md)

# Projet d'approfondissement en sciences informatiques : Projet Final - Game Talks

Projet final du groupe F pour le cours LINFO1212 à l'UCLouvain.

Le but du projet est de créer un site qui possède une base de donnée, des comptes utilisateurs avec un système de 
connexion et un système de recherche dans la base de donnée. Pour le projet final, nous avions carte blanche. La seule 
contrainte était d'implémenter les systèmes cités plus tôt et d'utiliser les technologies suivantes.\
Nous devions donc utiliser MongoDB et Node.js avec express, hogan et consolidate.
 
## Prérequis:

- Utilise Node.js v14.18.1

- Utilise MongoDB v5.0.3 avec MongoDB Database tools installés.

- Nécessite d'avoir installé les packages node.js nécessaires.

  ```batch
  Pour les installer, ouvrir un terminal à la racine du projet et effectuer la commande suivante:
  
  $ npm install
  ```

- Pour pouvoir tester le site directement, des données d'exemples sont disponibles.

  ```batch
  Pour les importer:
  
  $ mongoimport -d GameTalks -c games ./db-init/games.json
  
  $ mongoimport -d GameTalks -c users ./db-init/users.json
  
  $ mongoimport -d GameTalks -c posts ./db-init/posts.json
  
  $ mongoimport -d GameTalks -c comments ./db-init/comments.json
  ```

## Lancement du site:

- Si les prérequis sont complets, démarrez le serveur avec la commande suivante :

  ```batch
  $ npm start
  ```

- Ensuite vous pouvez accéder au site en suivant le lien imprimé dans la console.

## Quelques précisions:

Pour ajouter des jeux, il suffit de se connecter sur le compte administrateur. Dans les données d'exemples
(username: Admin, password: admin). Ou alors se créer un compte avec comme nom d'utilisateur "Admin".\
Une fois que c'est fait, un bouton apparaitra sur la page d'accueil pour ajouter un jeu.

Le site utilise le fichier postsWords.json pour stocker une table des mots de chaque post pour permettre de classer 
les documents par pertinence quand une recherche est effectuée. Ce fichier contient de base les données d'exemple.
Pour utiliser le site à zéro, il est conseillé de vider l'objet (mettre {} dans le fichier).

