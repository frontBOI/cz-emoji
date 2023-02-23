# cz-frontboi

FrontBOI's [commitizen] adapter is THE way to go to use custom commit message using emojis. _Plus besoin de se prendre la tête en équipe !_

This tool has been explicitely and purposefully made for french people 🇫🇷

```sh
  ┬  ┌─┐  ┌─┐┌─┐┌┬┐┌┬┐┬┌┬┐  ┌─┐┬─┐┌─┐┌─┐┬─┐┌─┐
  │  ├┤   │  │ ││││││││ │   ├─┘├┬┘│ │├─┘├┬┘├┤
  ┴─┘└─┘  └─┘└─┘┴ ┴┴ ┴┴ ┴   ┴  ┴└─└─┘┴  ┴└─└─┘ by frontBOI
  ⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜⚜

? Sélectionne le type de ton commit: (Use arrow keys)
❯ feature           ✨  Introduction d'une nouvelle feature
  fix               🐛  Résolution de bug
  test              🧪  Ajout de test
  release           🏷️  Release / version tags
  perf              ⚡️  Amélioration de performances
  hotfix            🚑  Hotfix
```

## Install

I recommend installing this packaging locally, so that you can customize it project wise.
**Please note that you need to install [commitizen] in order to use this package.**

**Globally**

```bash
npm i -g commitizen
npm i -g cz-frontboi

# set as default adapter for your projects
echo '{ "path": "cz-frontboi" }' > ~/.czrc
```

**Locally**

```bash
npm install --save-dev commitizen
npm install --save-dev cz-frontboi
```

Then, add this to your `package.json`:

```json
"config": {
  "commitizen": {
    "path": "@frontboi/cz-frontboi"
  }
}
```

## Usage

Simply execute commitizen using yarn, and the adapter will take over:

```sh
$ yarn cz
```

If you wish to use it with npm, add this to your `package.json`:

```json
"scripts": {
  "commit": "npx cz"
}
```

And then you will be able to call the cz-frontboi's adapter:

```sh
npm run commit
```

## Customization

By default `cz-frontboi` comes ready to run out of the box for french teams, including a wide variety of commit types and three scopes (`front`, `back` and `api`). Usages may vary, so there are a few configuration options to allow fine tuning for project needs.

### How to

Configuring `cz-frontboi` can be handled **in the users home directory** (`~/.czrc`) for changes to impact all projects. It can also be configured **project wise** (`package.json`). Simply add the config property as shown below to the existing object in either of the locations with your settings for override.

```json
{
  "config": {
    "cz-frontboi": {}
  }
}
```

### Configuration Options

By default `cz-frontboi` comes preconfigured with a subset of the [Gitmoji](https://gitmoji.carloscuesta.me/) types. Though, feel free to add any of your semantic in the `types.json` file, in which lives all the types available for a commit.

#### Add a type

By default, `cz-frontboi` comes bundled with general purpose types.
If you ever need to add a type, provide it as a JSON object inside the `types` array property (which lives, indeed, inside the `cz-frontboi` property of the top-level `config` property):

```json
 "types": [
   {
     "emoji": "💡",
     "code": ":bulb:",
     "description": "Une super nouvelle idée",
     "name": "Idea"
   }
 ]
```

#### Skip Questions

You can skip native questions that you may find irrelevant. To do so, provide an array of questions you want to skip:

```json
{
  "config": {
    "cz-frontboi": {
      "skipQuestions": ["body", "scope"]
    }
  }
}
```

You can skip the following questions: `body` and `scope`.
The `type` and `subject` questions are mandatory.

#### Customize Questions

The way the questions are formulated is highly opinionated, and you can find it unpleasing. Feel free to provide an object that contains an overwrite text of the original questions:

```json
{
  "config": {
    "cz-frontboi": {
      "questions": {
        "body": "This will be displayed instead of original text"
      }
    }
  }
}
```

#### Customize Scopes

A scope is, natively, either `front`, `back` or `api`. You might want to add some more: you can provide an object that contains some more scopes. A scope is an object that must contains these two properties

- **name**: the text that gets display in the list of scopes (so you may include any emoji inside)
- **value**: the value that will be inserted inside the commit message

It could look something like this:

```json
{
  "config": {
    "cz-frontboi": {
      "scopes": [{ "name": "🕹️ API", "value": "API" }]
    }
  }
}
```

#### Customize the subject max length

The maximum length you want your subject has

```json
{
  "config": {
    "cz-frontboi": {
      "subjectMaxLength": 200
    }
  }
}
```

## License

MIT © [Tom Blanchet](https://tomblanchet.fr)

[commitizen]: https://github.com/commitizen/cz-cli
[inquirer.js]: https://github.com/SBoudrias/Inquirer.js/
