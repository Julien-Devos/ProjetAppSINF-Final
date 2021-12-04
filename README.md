# ProjetAppSINF-Final

Pour lancer le serveur faire: npm start

pour importer la base de donnée faire:

mongoimport -d finalAppSinf -c users ./db-init/users.json
mongoimport -d finalAppSinf -c posts ./db-init/posts.json
mongoimport -d finalAppSinf -c comments ./db-init/comments.json
mongoimport -d finalAppSinf -c games ./db-init/games.json