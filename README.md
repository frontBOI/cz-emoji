# cz-frontboi

> frontBOI's [commitizen] adapter to use custom commit message using emojis

```sh
? Select the type of change you are committing: (Use arrow keys)
❯ feature   🌟  A new feature
  fix       🐞  A bug fix
  docs      📚  Documentation change
  refactor  🎨  A code refactoring change
  chore     🔩  A chore change
```

## Install

**Globally**

```bash
npm install --global cz-frontboi

# set as default adapter for your projects
echo '{ "path": "cz-frontboi" }' > ~/.czrc
```

**Locally**

```bash
npm install --save-dev cz-frontboi
```

Add this to your `package.json`:

```json
"config": {
  "commitizen": {
    "path": "cz-frontboi"
  }
}
```

## Usage

```sh
$ yarn cz
```

## Customization

By default `cz-frontboi` comes ready to run out of the box. Uses may vary, so there are a few configuration options to allow fine tuning for project needs.

### How to

Configuring `cz-frontboi` can be handled in the users home directory (`~/.czrc`) for changes to impact all projects or on a per project basis (`package.json`). Simply add the config property as shown below to the existing object in either of the locations with your settings for override.

```json
{
  "config": {
    "cz-frontboi": {}
  }
}
```

### Configuration Options

By default `cz-frontboi` comes preconfigured with the [Gitmoji](https://gitmoji.carloscuesta.me/) types.

#### Add a type

By default, `cz-frontboi` comes bundled with general purpose types:
If you ever need to add a type, provide it as a JSON object inside the `types` array property:

```json
{
  "config": {
    "cz-frontboi": {
      "types": [
        {
          "emoji": "💡",
          "code": ":bulb:",
          "description": "Une super nouvelle idée",
          "name": "Idea"
        }
      ]
    }
  }
}
```

#### Skip Questions

An array of questions you want to skip:

```json
{
  "config": {
    "cz-frontboi": {
      "skipQuestions": ["body", "scope"]
    }
  }
}
```

You can skip the following questions: `body` and `scope`. The `type` and `subject` questions are mandatory.

#### Customize Questions

An object that contains an overwrite text of the original questions:

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

An object that contains some more scopes. The scope is an object that contains two keys:

- name: the text that gets display in the list of scopes (so you may include any emoji inside)
- value: the value that will be inserted inside the commit message

Here is an example:

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
