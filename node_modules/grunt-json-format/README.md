# grunt-json-format

> A Grunt Task for formatting JSON files.

[![Build Status](https://travis-ci.org/jahed/grunt-json-format.svg?branch=master)](https://travis-ci.org/jahed/grunt-json-format)

## Getting Started

```sh
# Add the module to your project
npm install grunt-json-format --save-dev
```

```js
// Load the module in your Gruntfile
grunt.loadNpmTasks('grunt-json-format');
```

> Of course, you'll need to be using [Grunt](http://gruntjs.com/)

## Usage

```js
// Configure the task by providing a config.
'json-format': {
    test: {
        options: {
            indent: 4,
            remove: ['_comment']
        },
        files: [
            {
                expand: true,
                cwd: './test',
                src:  ['./json/test-1-*.json'],
                dest: './build/'
            },
            {
                expand: true,
                cwd: './test',
                src:  ['./json/test-2-*.json'],
                dest: './build/'
            }
        ]
    }
}
```

```sh
# Run the task
grunt json-format:test
```

## Options

### indent
Type: `String` or `Number`

Default: `null`

The indentation of the output.

Number indicated the number of whitespaces to use whereas a String will indicate
the character to use (for example `\t` will use tab characters).

By providing `null` or `0`, no indentation will be used and the output will
essentially be minified.

### remove
Type: `Array`

Default: `[]`

The keys to remove from the output.

This is useful for removing comment keys like `_comment`.

## Files

Check the [Grunt Documentation](http://gruntjs.com/configuring-tasks#files-array-format) on how to declare files and how Grunt parses them.

## License

Copyright (c) 2014 Jahed Ahmed

Licensed under the [MIT license](LICENSE-MIT).
