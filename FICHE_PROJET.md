# Jeu 3D

## Liens vers l'application
- Lien public: https://neon-rush.skyia.net/
- GitHub: https://github.com/RYJITS/jeu3d

## A quoi sert le projet
Jeu 3D est un runner navigateur en 3D. Le joueur evite des obstacles, gagne des points, monte de niveau, charge une invincibilite, conserve des scores locaux et peut gagner des codes promo SkyIA.

## Fonctionnement de l'application ou du projet
La scene React Three Fiber affiche le joueur, l'environnement, les obstacles et les projectiles. Le store Zustand gere le statut menu/playing/gameover, le score, la vitesse, le niveau, les munitions, l'invincibilite, le son, les highscores et les recompenses. Les collisions sont verifiees avec des boites 3D elargies pour eviter les collisions manquees a grande vitesse.

## Comment le projet a ete construit
Le projet a ete concu comme une base de gameplay rapide: un coeur de jeu simple, un rendu WebGL, une progression lisible et une connexion a l'ecosysteme SkyIA via les codes promo.

## Fonctions disponibles dans l'application
- Jouer un runner 3D
- Changer de voie au clavier ou tactile
- Eviter les obstacles
- Monter de niveau
- Charger une invincibilite
- Utiliser des munitions
- Sauvegarder les meilleurs scores
- Copier un code promo SkyIA
- Activer ou couper le son

## Outils, IA et moteurs en arriere-plan
- Moteur de jeu WebGL
- Store de partie
- Detection de collision continue
- Systeme niveau/vitesse
- Invincibilite et ammo
- Leaderboard local
- Generateur de codes promo
- Sauvegarde Firebase des promos
- Audio player et postprocessing visuel

## Automatisations integrees
- Progression de niveau tous les 10 obstacles
- Courbe de vitesse avec limite apres niveau 20
- Detection continue des collisions
- Charge automatique de l'invincibilite
- Gestion ammo/charge et destruction d'obstacle en mode charge
- Sauvegarde des 50 meilleurs scores localement
- Generation de codes promo selon seuils de score
- Sauvegarde asynchrone du code promo Firebase
- Controle clavier, A/D et touch swipe

## Captures d'ecran
- Aucune capture validee pour cette fiche.

## Mises a jour
- Fiche actualisee depuis le registre orchestrateur et le catalogue projet.
- Changements locaux detectes: relire la fiche apres validation des modifications.
- Derniere mise a jour registre connue: 2026-06-25T00:46:45.686Z.

## Derniere mise a jour
2026-06-25T00:46:45.690Z

> Fichier genere par l'orchestrateur pour le hub Site Ma Methode.
