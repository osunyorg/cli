# Osuny CLI 

CLI permettant la gestion des thèmes et website osuny

## Installation globale

Il faut d'abord créer les fichiers :

`
data/preferences.js

data/repositories-in-production.js

data/repositories-not-in-production.js

data/repositories.js
`


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

Le script nécessite l'installation de `yq` : `brew install yq` (https://mikefarah.gitbook.io/yq)


#### Usage

1. Naviguer via le terminal dans le dossier du site à tester.
2. Ajouter `backstop_data` dans le fichier `.gitignore`.
3. Lancer la commande `osuny backstop [path] [urls]`
    - `path` l'emplacement local du site à tester
    - `urls` les urls relatives à tester démarrant et terminant par `/`, séparée par `,`
4. Utiliser l'outil de comparaison pour chercher des modifications indésirables.

Les urls testées proviennent du fichier `/assets/sample.json`. Vous pouvez le modifier pour déterminer l'échantillon d'url à tester.

