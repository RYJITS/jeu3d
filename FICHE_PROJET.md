# Neon Rush 3D - Jeu 3D temps réel en React et Three.js

## Liens vers l'application
- Lien public: [https://neon-rush.skyia.net/](https://neon-rush.skyia.net/)
- GitHub: [https://github.com/RYJITS/jeu3d](https://github.com/RYJITS/jeu3d)

## A quoi sert le projet
Neon Rush 3D est un jeu 3D temps réel développé avec React, Three.js et Vite. L'application permet aux utilisateurs de naviguer dans un environnement 3D dynamique, de collecter des objets, d'éviter des obstacles et de tirer sur des cibles. Le jeu repose sur une architecture modulaire où chaque composant gère une partie spécifique : la scène 3D, le joueur, les obstacles, les projectiles, l'interface utilisateur et le système audio. L'état du jeu est centralisé via un store Zustand, assurant une synchronisation fluide entre les éléments. Three.js est utilisé pour le rendu graphique, avec des effets de post-traitement pour améliorer l'immersion visuelle.

## Fonctionnement de l'application ou du projet
L'application fonctionne en temps réel grâce à un serveur de développement Vite qui permet une mise à jour instantanée des modifications. Le jeu est structuré autour d'une boucle principale qui gère les entrées utilisateur, les mises à jour de l'état du jeu et le rendu graphique. Les interactions sont capturées via des événements clavier ou tactiles, puis traitées par les composants dédiés. Les collisions sont détectées et gérées par des algorithmes simples, tandis que les effets visuels et sonores sont synchronisés avec les actions du joueur. L'état global du jeu est stocké dans un store Zustand, permettant une réactivité optimale.

## Comment le projet a ete construit
Le projet a été conçu avec une approche modulaire et scalable, en séparant clairement les responsabilités entre les composants React, les utilitaires et le store d'état. Three.js a été choisi pour son intégration native avec React via @react-three/fiber, offrant une syntaxe déclarative pour la création d'objets 3D. L'architecture a été pensée pour faciliter la maintenance et l'ajout de nouvelles fonctionnalités, avec une attention particulière portée à la performance et à l'optimisation du rendu. Les choix techniques incluent l'utilisation de Tailwind CSS pour le style, Zustand pour la gestion d'état, et Firebase pour les fonctionnalités backend optionnelles. L'application est optimisée pour une expérience fluide sur desktop et mobile.

## Installation et utilisation
### Installation
[object Object]

### Utilisation
Une fois l'application lancée, l'utilisateur peut interagir avec le jeu via les commandes clavier (flèches pour se déplacer, espace pour tirer) ou tactile (si sur mobile). L'interface affiche le score, le niveau, et les instructions de base. Le joueur doit naviguer dans l'environnement 3D pour collecter des objets et éviter les obstacles. Les projectiles peuvent être tirés pour détruire des cibles ou des obstacles. L'application est optimisée pour une expérience fluide sur desktop et mobile.

## Fonctions disponibles dans l'application
- Rendu 3D temps réel avec Three.js et @react-three/fiber
- Gestion des collisions et de la physique basique
- Interface utilisateur réactive et adaptative
- Gestion centralisée de l'état via Zustand
- Optimisation des performances avec post-traitement graphique
- Intégration audio pour une immersion sonore
- Prise en charge des codes promo pour les tests
- Mode plein écran et adaptation responsive

## Outils, IA et moteurs en arriere-plan
- Vite : Serveur de développement et outil de build
- React : Bibliothèque pour la construction de l'interface utilisateur
- Three.js : Bibliothèque pour le rendu 3D
- @react-three/fiber : Intégration de Three.js avec React
- @react-three/drei : Composants utilitaires pour Three.js
- @react-three/postprocessing : Effets de post-traitement pour Three.js
- Zustand : Gestion d'état centralisée
- Tailwind CSS : Framework CSS pour le style
- ESLint : Vérification de la qualité du code
- TypeScript : Typage statique pour une meilleure maintenabilité
- Firebase : Service backend optionnel pour les fonctionnalités avancées

## Automatisations integrees
- Rechargement à chaud (HMR) via Vite pour un développement fluide
- Vérification automatique du code via ESLint avant le build
- Build optimisé pour la production avec minification et compression gzip
- Génération automatique de rapports de fonctionnalité et de réparation

## Captures d'ecran
![Capture 1 - jeu3d](docs/captures/20-jeu3d-2026-06-25_02-46-46-desktop.png)

![Capture 2 - jeu3d](docs/captures/20-jeu3d-2026-06-25_02-46-46-mobile.png)

## Mises a jour
- Correction des alertes de sécurité bloquantes avant publication (juin 2026)
- Optimisation du rendu graphique et réduction des artefacts visuels (juin 2026)
- Amélioration de la gestion des collisions et de la physique (juin 2026)
- Ajout de la prise en charge des codes promo pour les tests (juin 2026)
- Mise à jour des dépendances pour corriger les vulnérabilités connues (juin 2026)
- Validation des scripts de build et de linting pour une intégration continue (juin 2026)
- Correction des alertes de sécurité bloquantes avant publication (juin 2026)
- Optimisation du rendu graphique et réduction des artefacts visuels (juin 2026)
- Amélioration de la gestion des collisions et de la physique (juin 2026)
- Ajout de la prise en charge des codes promo pour les tests (juin 2026)
- Mise à jour des dépendances pour corriger les vulnérabilités connues (juin 2026)
- Validation des scripts de build et de linting pour une intégration continue (juin 2026)

> Fichier genere par l'orchestrateur pour le hub Site Ma Methode.
