function AppPreferencesLocalStorage() {

}

AppPreferencesLocalStorage.prototype.fetch = function(successCallback, errorCallback, dict, key) {

	var self = this;

	var args = this.prepareKey ('get', dict, key);

	if (args.key === "GET_ALL_DATA") {
		var allValues = {};
		var prefix = args.dict ? args.dict + '.' : '';
		for (var i = 0; i < window.localStorage.length; i++) {
			var k = window.localStorage.key(i);
			if (prefix && k.indexOf(prefix) !== 0) continue;
			var keyName = prefix ? k.substring(prefix.length) : k;
			var result = window.localStorage.getItem(k);
			var value = result;
			if (result) {
				try {
					value = JSON.parse(result);
				} catch (e) {
				}
			}
			allValues[keyName] = value;
		}
		return successCallback(allValues);
	}

	var key = args.key;

	if (args.dict)
		key = args.dict + '.' + args.key;
	
	var result = window.localStorage.getItem (key);

	var value = result;
	if (result) {
		try {
			value = JSON.parse (result);
		} catch (e) {
		}
		successCallback (value);
	} else {
		errorCallback();
	}
};

AppPreferencesLocalStorage.prototype.store = function(successCallback, errorCallback, dict, key, value) {

	var self = this;

	var args = this.prepareKey ('set', dict, key, value);

	if (!args.key || args.value === null || args.value === undefined) {
		errorCallback ();
		return;
	}

	var key = args.key;

	if (args.dict)
		key = args.dict + '.' + args.key;

	var value = JSON.stringify (args.value);

	window.localStorage.setItem (key, value);

	successCallback ();
};

module.exports = new AppPreferencesLocalStorage();
