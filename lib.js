var systemManager = systemManager || {};

systemManager.classes = systemManager.classes || {};
systemManager.functions = systemManager.functions || {};


// Classes
systemManager.classes.SystemValue = function (code, callback) {
    var currentValue = null;
    var eventdispatcher = [];
    var id = code;

    // El objeto tiene una propiedad "code" de sólo lectura
    Object.defineProperty (this, 'code', {
        value: code,
        writable: false
    });

    // El objeto tiene una propiedad "value"
    Object.defineProperty (this, 'value', {
        get: function () {
            return currentValue;
        },

        set: function (newValue) {
            if (newValue === currentValue) {
                return;
            }

            var isOk = { 'value' : true };

            eventdispatcher.forEach (function (event) {
                // this = isOk (Mirar el segundo parámetro del eventdispatcher)
                if (this.value === false) {
                    return;
                }

                var result = event(id, newValue, currentValue);
                if (result === false) {
                    this.value = false;
                }
            }, isOk ); // el segundo parametro, será this dentro de la función

            if (isOk.value) {
                currentValue = newValue;
            }
        }
    });

    this.addCallback = function (callback, isFirst) {
        isFirst = isFirst || false;

        if (typeof callback !== 'function') {
            return;
        }
        
        if (isFirst) {
            eventdispatcher.unshift (callback);
            return;
        }

        eventdispatcher.push (callback);
    }

    this.addCallback (callback);
};

systemManager.classes.SystemValueManager = function (code) {
    Object.defineProperty (this, 'code', {
        value: code,
        writable: false
    });

    var changedValue = function (key, newValue, oldValue) {
        console.log ("Se ha cambiado " + key + " a " + newValue + " de " + oldValue);
        return true; // todo ok continua
    };

    this.newProperty = function (key, defaultValue) {
        if (typeof defaultValue === 'undefined') {
            defaultValue = null;
        }
        var component = new systemManager.classes.SystemValue (key);
        component.value = defaultValue;
        component.addCallback (changedValue);
        this[key] = component;
    };
};


// Functions
systemManager.functions.loopJSONToSystemValue = function (i_id, i_json, i_obj) {
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

	return currentObject;
};

systemManager.functions.checkIfHasClass = function (i_element, i_class) {
	i_class = i_class.toLowerCase ();

	var cssClasses = i_element.classList;
	for (var i = 0; i < cssClasses.length; i++) {
		if (cssClasses[i].toLowerCase ().indexOf (i_class) !== -1) {
			return true;
		}
	}

	return false;
};

systemManager.functions.findCSSClassByString = function (i_element, i_string) {
	var cssClasses = i_element.classList;
	for (var i = 0; i < cssClasses.length; i++) {
		if (cssClasses[i].indexOf (i_string) !== -1) {
			return cssClasses[i];
		}
	}

	return null;
};

systemManager.functions.myInterval = function (i_text) {
	var i = null;
	var text = i_text;
	var currentNumber = parseInt (i_text.textContent);

	Object.defineProperty (this, "intervalHandler", {
		get: function () {
			return i;
		},
		
		// Params: 0 = OnOff | 1 = Increment | 2 = Interval time | 3 = Max value (not required)
		set: function (i_params) {
			if (i_params [0] === true) {
				if (i !== null) {
					//console.log ("Había un intervalo y lo ha eliminado");
					clearInterval (i);
				}
				
				i = setInterval (function () {
					//console.log ("Subiendo... ", currentNumber);
					currentNumber += i_params[1];
					text.textContent = currentNumber;
					
					if (i_params[3] !== undefined && currentNumber >= i_params[3]) {
						//console.log ("Ha llegado al tope");
						clearInterval (i);
						//console.log ("Limpia el intervalo actual y espera para empezar a bajar");
						
						setTimeout (function () {
							var ii = setInterval (function () {
								//console.log ("Bajando... ", currentNumber);
								currentNumber -= i_params[1];
								text.textContent = currentNumber;

								if (currentNumber <= 0) {
									currentNumber = 0;
									text.textContent = currentNumber;

									//console.log ("Ha llegado a cero");
									clearInterval (ii);
									//console.log ("Limpia el segundo intervalo");
								}
							}, i_params[2] * 2);
						}, 3000);
					}
				}, i_params[2]);
			} else if (i_params === false) {
				clearInterval (i);
			}
		}
	});
};