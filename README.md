# Neon Rush 3D - Jeu 3D temps réel en React et Three.js

## Rapport complet

Ce depot public presente le concept, les fonctions, les choix de conception, les outils utilises, les commandes locales et les captures d'ecran de l'application. Il est genere par l'orchestrateur uniquement apres validation de publication publique.

## Concept

Un jeu 3D interactif développé avec React, Three.js et Vite, offrant une expérience immersive de navigation, combat et collecte d'objets dans un univers néon.

Créer une application web interactive permettant aux utilisateurs de naviguer dans un environnement 3D dynamique, de collecter des objets, d'éviter des obstacles et de tirer sur des cibles, avec un rendu visuel optimisé et une gestion d'état centralisée.

Public vise: Développeurs, designers et utilisateurs finaux intéressés par les expériences 3D interactives dans le navigateur, ainsi que les équipes techniques souhaitant étudier une architecture moderne de jeu 3D avec React et Three.js.


## Fonctionnement de l'application

L'application fonctionne en temps réel grâce à un serveur de développement Vite qui permet une mise à jour instantanée des modifications. Le jeu est structuré autour d'une boucle principale qui gère les entrées utilisateur, les mises à jour de l'état du jeu et le rendu graphique. Les interactions sont capturées via des événements clavier ou tactiles, puis traitées par les composants dédiés. Les collisions sont détectées et gérées par des algorithmes simples, tandis que les effets visuels et sonores sont synchronisés avec les actions du joueur. L'état global du jeu est stocké dans un store Zustand, permettant une réactivité optimale.

## Fonctions de l'application

- Navigation 3D en temps réel avec gestion des collisions
- Système de tir et de projectiles avec effets visuels
- Gestion des obstacles dynamiques et aléatoires
- Interface utilisateur réactive avec état centralisé
- Système audio intégré pour une immersion sonore
- Gestion des codes promo et des scores
- Rendu optimisé avec post-traitement graphique
- Mode plein écran et adaptation responsive
- Rendu 3D temps réel avec Three.js et @react-three/fiber
- Gestion des collisions et de la physique basique
- Interface utilisateur réactive et adaptative
- Gestion centralisée de l'état via Zustand
- Optimisation des performances avec post-traitement graphique
- Intégration audio pour une immersion sonore
- Prise en charge des codes promo pour les tests

## Actualisations et evolution

- Correction des alertes de sécurité bloquantes avant publication (juin 2026)
- Optimisation du rendu graphique et réduction des artefacts visuels (juin 2026)
- Amélioration de la gestion des collisions et de la physique (juin 2026)
- Ajout de la prise en charge des codes promo pour les tests (juin 2026)
- Mise à jour des dépendances pour corriger les vulnérabilités connues (juin 2026)
- Validation des scripts de build et de linting pour une intégration continue (juin 2026)
- Statut courant: PUBLIC_READY.
- Securite: OK_PUBLIC.
- Fonctionnement: FONCTIONNEL.

## Comment le projet a ete reflechi et construit

Le projet a été conçu avec une approche modulaire et scalable, en séparant clairement les responsabilités entre les composants React, les utilitaires et le store d'état. Three.js a été choisi pour son intégration native avec React via @react-three/fiber, offrant une syntaxe déclarative pour la création d'objets 3D. L'architecture a été pensée pour faciliter la maintenance et l'ajout de nouvelles fonctionnalités, avec une attention particulière portée à la performance et à l'optimisation du rendu. Les choix techniques incluent l'utilisation de Tailwind CSS pour le style, Zustand pour la gestion d'état, et Firebase pour les fonctionnalités backend optionnelles. L'application est optimisée pour une expérience fluide sur desktop et mobile.

Cette section doit expliquer les choix qui ont guide le projet: besoin de depart, structure retenue, modules principaux, compromis techniques, interface ou logique metier, et raisons des outils utilises.

### Outils, IA et moteurs utilises

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
- React 19 avec TypeScript
- Three.js r183 pour le rendu 3D
- Vite 7 pour le développement et le build
- Zustand 5 pour la gestion d'état
- Tailwind CSS 4 pour le style
- ESLint avec configuration stricte pour la qualité du code

### Options techniques detectees

- Type de projet: node
- Gestionnaire: npm
- Nom package: jeu3d
- Version: 0.0.0
- Lien public: https://neon-rush.skyia.net/
- Statut securite: OK_PUBLIC

### Stack et dependances principales

- Vite/Dev server
- React
- Three.js/WebGL
- Node.js
- React 19 avec TypeScript
- Three.js r183 pour le rendu 3D
- Vite 7 pour le développement et le build
- Zustand 5 pour la gestion d'état
- Tailwind CSS 4 pour le style
- ESLint avec configuration stricte pour la qualité du code

### Scripts disponibles

- build: tsc -b && vite build
- dev: vite
- lint: eslint .
- preview: vite preview

### Dependances applicatives

- @react-three/drei ^10.7.7
- @react-three/fiber ^9.5.0
- @react-three/postprocessing ^3.0.4
- firebase ^12.10.0
- lucide-react ^0.575.0
- react ^19.2.0
- react-dom ^19.2.0
- three ^0.183.1
- zustand ^5.0.11

### Dependances de developpement

- @eslint/js ^9.39.1
- @tailwindcss/vite ^4.2.1
- @types/node ^24.10.1
- @types/react ^19.2.7
- @types/react-dom ^19.2.3
- @types/three ^0.183.1
- @vitejs/plugin-react ^5.1.1
- eslint ^9.39.1
- eslint-plugin-react-hooks ^7.0.1
- eslint-plugin-react-refresh ^0.4.24
- globals ^16.5.0
- tailwindcss ^4.2.1
- typescript ~5.9.3
- typescript-eslint ^8.48.0
- vite ^7.3.1

## Automatisations et comportements internes

- Rechargement à chaud (HMR) via Vite pour un développement fluide
- Vérification automatique du code via ESLint avant le build
- Build optimisé pour la production avec minification et compression gzip
- Génération automatique de rapports de fonctionnalité et de réparation

## Installation locale

[object Object]

### Pre-requis
- Node.js installe localement.
- Gestionnaire detecte: npm.
- Creer un fichier `.env` local a partir de `.env.example` si des variables sont necessaires.

### Commandes
```powershell
npm install
npm run build
npm run dev
```

### Scripts utiles
- build: tsc -b && vite build
- dev: vite
- lint: eslint .
- preview: vite preview

## Lancement

```powershell
npm run dev
npm run build
```

## Utilisation

Une fois l'application lancée, l'utilisateur peut interagir avec le jeu via les commandes clavier (flèches pour se déplacer, espace pour tirer) ou tactile (si sur mobile). L'interface affiche le score, le niveau, et les instructions de base. Le joueur doit naviguer dans l'environnement 3D pour collecter des objets et éviter les obstacles. Les projectiles peuvent être tirés pour détruire des cibles ou des obstacles. L'application est optimisée pour une expérience fluide sur desktop et mobile.

## Captures d'ecran

![Capture desktop](docs/github-captures/20-jeu3d-2026-06-28_03-38-52-desktop.png)

![Capture mobile](docs/github-captures/20-jeu3d-2026-06-28_03-38-52-mobile.png)

## Variables d'environnement

Copier `.env.example` vers `.env` en local puis remplir les valeurs privees.

## Securite

Ne jamais publier `.env`, tokens, sessions, logs sensibles, cles privees ou donnees personnelles.
