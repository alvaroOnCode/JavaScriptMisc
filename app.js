var systemManager = systemManager || {};


// Data: https://swapi.co/
var app_data = {
	"name": "Luke Skywalker",
	"height": "172",
	"mass": "77",
	"hair_color": "blond",
	"skin_color": "fair",
	"eye_color": "blue",
	"birth_year": "19BBY",
	"gender": "male",
	"homeworld": "https://swapi.co/api/planets/1/",
	"films": [
		"https://swapi.co/api/films/2/",
		"https://swapi.co/api/films/6/",
		"https://swapi.co/api/films/3/",
		"https://swapi.co/api/films/1/",
		"https://swapi.co/api/films/7/"
	],
	"species": [
		"https://swapi.co/api/species/1/"
	],
	"vehicles": [
		"https://swapi.co/api/vehicles/14/",
		"https://swapi.co/api/vehicles/30/"
	],
	"starships": [
		"https://swapi.co/api/starships/12/",
		"https://swapi.co/api/starships/22/"
	],
	"created": "2014-12-09T13:50:51.644000Z",
	"edited": "2014-12-20T21:17:56.891000Z",
	"url": "https://swapi.co/api/people/1/"
};


// Simple parse
(function () {
	loopJSON (app_data);
		
	function loopJSON (i_json) {
		Object.keys (i_json).forEach (function (key) {
			if (typeof i_json[key] !== "object") {
				console.log (key + ": " + i_json[key]);
			} else {
				//console.log ("key: " + key, i_json[key]);
				loopJSON (i_json[key]);
			}
		});
	}
})();


// SystemValue system from JSON
var app;

(function () {
	app = systemManager.functions.loopJSONToSystemValue ("app_data", app_data, null);

	function loopJSONToSystemValue (i_id, i_json, i_obj) {
		var currentObject = {};
		var thisJSON = i_json;

		if (i_obj === null || i_obj === undefined) {
			currentObject = new systemManager.classes.SystemValueManager (i_id);
		} else {
			i_obj[i_id] = new systemManager.classes.SystemValueManager (i_id);
			currentObject = i_obj[i_id];
		}

		Object.keys (thisJSON).forEach (function (key) {
			if (typeof thisJSON[key] !== "object") {
				currentObject.newProperty (key, thisJSON[key]);
			} else {
				systemManager.functions.loopJSONToSystemValue (key, thisJSON[key], currentObject);
			}
		});
	}
})();