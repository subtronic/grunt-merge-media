# grunt-merge-media

> Merge duplicate media queries

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-merge-media --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-merge-media');
```

## The "merge_media" task

### Overview
In your project's Gruntfile, add a section named `merge_media` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  merge_media: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.compress
Type: `Boolean`
Default value: `false`

A Boolean value that will switch the compression of the processed file. This is passed straight into the `stringify` method in [css](https://github.com/reworkcss/css).

### Usage Examples

```js
grunt.initConfig({
  merge_media: {
    options: {
      compress: true
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
