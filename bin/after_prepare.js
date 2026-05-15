'use strict';

module.exports = function (context) {

	var Q = require('q');

	var path = require('path');

	var ET = require('elementtree');

	var cordova = require('cordova');

	var cordova_lib = cordova.cordova_lib;

	var cordova_lib_util = require('cordova-lib/src/cordova/util');

	var fs = require("./lib/filesystem")(Q, require('fs'), path);

	var settings = require("./lib/settings")(fs, path);

	var platforms = {};

	platforms.android = require("./lib/android")(context);

	platforms.ios = require("./lib/ios")(
		Q,
		fs,
		path,
		require('plist'),
		require('xcode')
	);

	// platforms.browser = require("./lib/browser")(Q, fs, path, require('plist'), require('xcode'));

	return settings.get()
		.then(function (config) {

			var promises = [];

			context.opts.platforms.forEach(function (platformName) {

				if (platforms[platformName] && platforms[platformName].build) {

					promises.push(
						platforms[platformName].build(config)
					);

				}

			});

			return Q.all(promises);

		})
		.catch(function (err) {

			if (err.code === 'NEXIST') {

				console.log("app-settings.json not found: skipping build");

				return;

			}

			console.log('unhandled exception', err);

			throw err;

		});

};