# Osuny CLI 

CLI permettant la gestion des thèmes et website osuny

## Installation globale

```
yarn
npm install -g .
```

## Usage

### Cloner tous les repo github

#### Setup

Il faut créer le fichier et y mettre ses préférences dans `data/repositories.js`.

Il faut créer la liste des répertoires dans `data/repositories.js` :

```
module.exports = [
  "https://github.com/noesya/osuny-example",
  "https://github.com/noesya/osuny-example-journal",
  "..."
]
```



> La liste des répertoires git est récupérable une fois loggé sur ```votre-instance-osuny.fr/server/websites.txt```

#### Utilisation

Pour cloner tous les répertoires de la liste, naviguez dans le dossier où vous souhaitez les projets puis : 

```osuny clone-all```

ou passez le dossier directement dans la commande

```osuny clone-all [path]```

### Backstop


#### Installation

L'outil permet de tester en local un site Osuny. 

Il va mettre à jour automatiquement le thème et le projet en local, et lancer une comparaison avec backstop de la version du site en ligne.

Le script nécessite l'installation de `yd` : `brew install yq`


#### Usage

1. Naviguer via le terminal dans le dossier du site à tester.
2. Ajouter `backstop_data` dans le fichier `.gitignore`.
3. Lancer la commande `osuny backstop`
4. Utiliser l'outil de comparaison pour chercher des modifications indésirables.
