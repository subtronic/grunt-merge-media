/*
 * grunt-merge-media
 * https://github.com/migstopheles/grunt-merge-media
 *
 * Copyright (c) 2014 Mike Cook
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('merge_media', 'Merge duplicate media queries', function() {
    // Load dependencies
    var css = require('css');
    var path = require('path');
    var _ = require('lodash');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      compress: false
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(file) {
      var src = file.src.filter(function(filePath) {
        if (!grunt.file.exists(filePath)) {
          grunt.log.warn('Source file "' + filePath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).forEach(function (filePath) {

        var fileName = filePath.replace(/(.*)\//gi, '');
        var fileExt = '.' + fileName.replace(/(.*)\./gi, '');
        var fileDest = file.dest;
        var output = '';

        if (fileDest.indexOf(fileExt) === -1) {
          fileDest = path.join(fileDest, fileName);
        }

        var source = grunt.file.read(filePath);
        var parsedCss = css.parse(source);

        var queries = _.filter(parsedCss.stylesheet.rules, { type: 'media' });
        var rules = _.difference(parsedCss.stylesheet.rules, queries);
        var grouped = _.groupBy(queries, function(rule) { return rule.media; });

        var merged = _.map(grouped, function(group) {
          return {
            type: group[0].type,
            media: group[0].media,
            rules: _.flatten(_.pluck(group, 'rules'), true)
          };
        });

        output += css.stringify({
          stylesheet: {
            rules: rules
          }
        }, options);

        output += '\n';

        output += css.stringify({
          stylesheet: {
            rules: merged
          }
        }, options);

        output += '\n';

        grunt.file.write(fileDest, output);

        grunt.log.writeln('Cleaned media queries for ' + fileName);

      });
    });
  });

};
