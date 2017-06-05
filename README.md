# to-api-docs
API [description](http://netzfisch.github.io/to-api-docs/) for [TEAM ORGA](http://www.teamorga.com)

## Getting started
Install dependencies globally

```sh
$ npm install --global gulp raml2html
```

and project development dependencies locally

```sh
$ npm install --save-dev gulp
```

## Usage

Run gulp

```sh
$ gulp
```

and watch the console for errors. In case of changes any *.raml files in
the src-diretctory will be convert to index.html in the docs-directory.

The index.html will be picked up by GitHub Pages and show the final API
description [here](http://netzfisch.github.io/to-api-docs/).

## Contributing

If you find a problem, please create a
[GitHub Issue](https://github.com/netzfisch/teamorga-api/issues).

Have a fix, want to add or request a feature?
[Pull Requests](https://github.com/netzfisch/teamorga-api/pulls) are welcome!

## License

The MIT License (MIT), see [LICENSE](LICENSE) file.
