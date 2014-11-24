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
			compress: false,
			logFile: false
		});

		var logOutput = [];

		function addToLog(msg, level) {
			if(options.logFile) {
				var indent = new Array((level || 0)).join('> ');
				var output = '';
				if(_.isString(msg)) {
					output = msg;
				} else if (_.isFunction(msg)) {
					output = msg();
				}
				if(output != '') {
					logOutput.push(indent + output);
				}
			}
		}

		function mergeMedia(rules, level) {

			level = level || 1;

			var queries = _.filter(rules, { type: 'media' });
			var rules = _.difference(rules, queries);
			var grouped = _.groupBy(queries, function(rule) { return rule.media; });

			if(queries.length) {
				addToLog('Found ' + queries.length + ' media queries from ' + (queries.length + rules.length) + ' rules', level);
			}

			var merged = _.map(grouped, function(group, name) {

				addToLog('`' + name + '` x' + group.length, level);

				var groupRules = _.flatten(_.pluck(group, 'rules'), true);
				var subQueries = mergeMedia(groupRules, level + 1);

				return {
					type: group[0].type,
					media: group[0].media,
					rules: subQueries
				};
			});

			return rules.concat(merged);
		}

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

				addToLog('---\n# Merging queries in ' + filePath);

				var fileName = filePath.replace(/(.*)\//gi, '');
				var fileExt = '.' + fileName.replace(/(.*)\./gi, '');
				var fileDest = file.dest;
				var output = '';

				if (fileDest.indexOf(fileExt) === -1) {
					fileDest = path.join(fileDest, fileName);
				}

				var source = grunt.file.read(filePath);
				var parsedCss = css.parse(source);

				var mergedMedia = mergeMedia(parsedCss.stylesheet.rules);

				output += css.stringify({
					stylesheet: {
						rules: mergedMedia
					}
				}, options);

				output += '\n';

				grunt.file.write(fileDest, output);

				grunt.log.writeln('Cleaned media queries for ' + fileName);

			});
		});

		if(options.logFile) {
			grunt.file.write('grunt-merge-media.log', logOutput.join('\n\n'));
			grunt.log.writeln('merge_media log written to grunt-merge-media.log');
		}

	});

};
