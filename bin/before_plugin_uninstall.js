'use strict';

module.exports = function (context) {

	var Q = require('q');

	var path = require('path');

	var fs = require("./lib/filesystem")(
		Q,
		require('fs'),
		path
	);

	var settings = require("./lib/settings")(fs, path);

	var android = require("./lib/android")(context);

	var ios = require("./lib/ios")(
		Q,
		fs,
		path,
		require('plist'),
		require('xcode')
	);

	return settings.get()
		.then(function (config) {

			return Q.all([

				android.clean(config),

				ios.clean(config)

			]);

		})
		.then(settings.remove)
		.catch(function (err) {

			if (err.code === 'NEXIST') {

				console.log("app-settings.json not found: skipping clean");

				return;

			}

			console.log('unhandled exception', err);

			throw err;

		});

};