# template-presenta
An adaptive html template

Install:
--------

```bash
$ git clone https://github.com/yukal/template-presenta.git
$ cd template-presenta

# Install Gulp CLI globally
$ npm i -g gulp-cli
# Install dependencies locally
$ npm i

# Alternative way
# Install dependencies if not installed yet and run build
$ ./make
```

Usage:
--------

```bash
# Cleanup dest directory
$ gulp clean

# Build
$ gulp build
$ gulp

# Build partials
$ gulp assets
$ gulp html
$ gulp sass
$ gulp js

# Run watcher with BrowserSync
$ gulp watch

# Packaging source files
$ ./make 7z
$ ./make zip
$ ./make tar
```
