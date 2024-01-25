# cz-frontboi

Cet adapteur de [commitizen] ajoute des émoticônes et personnalise l'affichage pour simplifier les tâches de commit. Il a été pensé pour suivre à la lettre les spécifications des conventions de commit, toutefois il offre une palette de personnalisation vous permettant de l'adapter à votre manière de travailler.
_Plus besoin de se prendre la tête en équipe !_

> Cet outil a été spécialement créé pour les équipes françaises !

```sh
██╗     ███████╗     ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗    ██████╗ ██████╗  ██████╗ ██████╗ ██████╗ ███████╗
██║     ██╔════╝    ██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝    ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔════╝
██║     █████╗      ██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║       ██████╔╝██████╔╝██║   ██║██████╔╝██████╔╝█████╗
██║     ██╔══╝      ██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║       ██╔═══╝ ██╔══██╗██║   ██║██╔═══╝ ██╔══██╗██╔══╝
███████╗███████╗    ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║       ██║     ██║  ██║╚██████╔╝██║     ██║  ██║███████╗
╚══════╝╚══════╝     ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚══════╝
⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜
frontBOI - 1.2.0

? Type de commit: (Use arrow keys)
❯ feat      ✨  Introduction d'une nouvelle fonctionnalité
  fix       🩹  Correction de bug
  ci        🦊  Modification de la CI
  test      🧪  Ajout de test
  build     🧰  Changements affectant le système de build ou les dépendances
  docs      📝  Documentation
  perf      ⚡️  Amélioration de performances
```

# Installation

Je recommande d'installer ce package en local, pour vous permettre de le personnaliser sur chaque projet.
**Notez bien qu'il est nécessaire d'installer [commitizen] pour que ce package fonctionne.**

### En local

```bash
npm install --save-dev commitizen
npm install --save-dev @frontboi/cz-frontboi
```

Ensuite, ajouter cette configuration à votre `package.json`:

```json
"config": {
  "commitizen": {
    "path": "@frontboi/cz-frontboi"
  }
}
```

### Globalement

Vous pouvez aussi choisir d'installer `cz-frontboi` globalement sur votre machine, afin de profiter de la configuration sur l'ensemble de vos projets.

```bash
npm i -g commitizen
npm i -g @frontboi/cz-frontboi

# le définir en tant qu'adapteur par défaut pour vos projets
echo '{ "path": "@frontboi/cz-frontboi" }' > ~/.czrc
```

# Usage

### Global

Si vous avez installé `cz-frontboi` globalement, vous n'avez qu'à exécuter cette commande

```sh
$ cz
```

### Local

#### yarn

Vous l'avez installé localement ? Il faut exécuter la même commande mais via yarn; ainsi, l'adapteur prendra le relai:

```bash
yarn cz
```

#### npm

Si vous désirez toutefois utiliser npm, ajoutez ceci à votre `package.json`:

```json
"scripts": {
  "commit": "npx cz"
}
```

Et ensuite, l'adapteur prendra le relai en jouant cette commande:

```sh
npm run commit
```

# Personnalisation

Par défault, `cz-frontboi` est livré prêt à fonctionner pour les équipes françaises, garni de tous les types de commit offerts par [la nomenclature Angular](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines). Votre utilisation peut toutefois varier: j'offre donc quelques options de configuration.

## Comment faire ?

La configuration de `cz-frontboi` peut être gérée directement **dans le répertoire personnel de l'utilisateur** via le fichier de configuration dédié `~/.czrc`. Si il n'existe pas encore, créez-le de cette manière:

```bash
touch ~/.czrc
```

Ce fichier permet de configurer l'outil sur tous les projets. Il peut aussi être configuré **par projet** (via le `package.json` du projet). Ajoutez simplement la propriété config comme indiqué ci-dessous à l'objet existant avec vos paramètres pour les remplacer.

```json
{
  "config": {
    "cz-frontboi": {}
  }
}
```

## Options de configuration

Par défaut, `cz-frontboi` est préconfiguré avec un sous-ensemble de types liés à des émoticônes choisis selon mes préférenecs. Vous pouvez voir ces configurations dans le fichier `types.json`, dans lequel se trouvent tous les types disponibles pour un commit.

### Ajouter un type de commit

Si vous avez besoin d'ajouter un type, renseignez-le en tant qu'objet JSON dans un tableau à l'intérieur du champ `types` (qui se trouve dans le champ de personnalisation `config`):

```json
{
  "types": [
    {
      "emoji": "💡",
      "code": ":bulb:",
      "description": "Une super nouvelle idée",
      "name": "Idea"
    }
  ]
}
```

Vous pouvez choisir de ne conserver que les types que vous avez déclarés et d'écarter les types natifs en renseignant la propriété `overrideNativeTypes` à `true` :

```json
{
  "config": {
    "cz-frontboi": {
      "types": ["vos propres types ici"],
      "overrideNativeTypes": true
    }
  }
}
```

### Supprimer un type

Pour supprimer un type, ajouter son nom dans le champ `skipTypes`. Par exemple si vous souhaitez supprimer les types feat et fix, ajoutez-les de cette manière:

```json
{
  "config": {
    "cz-frontboi": {
      "skipTypes": ["feat", "fix"]
    }
  }
}
```

### Supprimer une questions

Vous pouvez ignorer les questions par défaut que vous jugez non pertinentes. Pour ce faire, indiquez la ou les questions que vous souhaitez ignorer:

```json
{
  "config": {
    "cz-frontboi": {
      "skipQuestions": ["breaking_change", "scope"]
    }
  }
}
```

Voici les questions disponibles par défaut:

- **type**: type de commit
- **scope**: cadre général du commit
- **subject**: sujet du commit
- **breaking_change**: permet de renseigner si le commit comprend un changement majeur.

Vous pouvez ignorer les questions `breaking_change` et `scope`.
Les questions `type` et `subject` sont obligatoires.

### Personnaliser les questions

La façon dont les questions sont formulées est fortement influencée par mon opinion, et vous pouvez la trouver déplacée. N'hésitez pas à fournir un objet qui contient un texte de remplacement des questions originales :

```json
{
  "config": {
    "cz-frontboi": {
      "questions": {
        "breaking_change": "This will be displayed instead of original text"
      }
    }
  }
}
```

### Personnaliser les scopes

Un scope fournit des informations contextuelles supplémentaires (telles que la fonctionnalité générale concernée). Par défaut, les **scopes sont entrés par un input dans lequel le développeur saisit son texte**. Vous pouvez cependant fournir un tableau qui contient une liste de scopes à partir de laquelle le développeur pourra sélectionner son scope. Un scope est déclaré comme un objet avec deux propriétés obligatoires :

- **nom** : le texte qui sera affiché dans la liste des scopes.
- **value** : la valeur qui sera insérée dans le message de commit.

Voici un exemple:

```json
{
  "config": {
    "cz-frontboi": {
      "scopes": [
        { "name": "💻 front", "value": "front" },
        { "name": "💾 back", "value": "back" },
        { "name": "📦 CI/CD", "value": "CI/CD" }
      ]
    }
  }
}
```

### Personnaliser la longueur maximale du sujet

```json
{
  "config": {
    "cz-frontboi": {
      "subjectMaxLength": 200
    }
  }
}
```

## Licence

MIT © [Tom Blanchet](https://tomblanchet.fr)

[commitizen]: https://github.com/commitizen/cz-cli
[inquirer.js]: https://github.com/SBoudrias/Inquirer.js/
