# Osuny CLI 

CLI permettant la gestion des thèmes et website osuny

## Installation globale

```
npm install -g .
```

## Usage

### Cloner tous les repo github

#### Setup

Il faut créer la liste des répertoires dans data/repositories.js :

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
