(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 119);
/******/ })
/************************************************************************/
/******/ ({

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_constants__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_tool_options__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_debug__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__storage__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__connections__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pulse__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__options__ = __webpack_require__(121);








const toolOptionKeys = Object.keys(__WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["a" /* default */]);
const initialized = __WEBPACK_IMPORTED_MODULE_3__storage__["c" /* initialize */]();

// Start the pulse timer to set local storage values
// as long as the devtools port stays open
Object(__WEBPACK_IMPORTED_MODULE_5__pulse__["c" /* startAlarm */])();

__WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].on('new-connection', async function () {
  // Set pulse data on local storage of all open ports
  await Object(__WEBPACK_IMPORTED_MODULE_5__pulse__["b" /* setPulse */])();
  await sendConfigToAllPorts();
  await sendDeviceConfigToAll();
});

__WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].on('message', async function (message, sender) {
  Object(__WEBPACK_IMPORTED_MODULE_2__shared_debug__["a" /* default */])(`${message.type} from Devtools`);
  switch (message.type) {
    case __WEBPACK_IMPORTED_MODULE_0__shared_constants__["l" /* SET_OPTION */]:
      const { device, option, value } = message.data;
      await Object(__WEBPACK_IMPORTED_MODULE_6__options__["a" /* setOption */])(device, option, value);
      // If no device specified, this is a tool-wide option,
      // so update pulse data
      if (!device) {
        await Object(__WEBPACK_IMPORTED_MODULE_5__pulse__["b" /* setPulse */])();
      }
      await sendDeviceConfigToAll();
      await sendConfigToAllPorts();
  }
});

__WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].on('disconnect', id => {
  // Clear pulse for the disconnected devtools
  Object(__WEBPACK_IMPORTED_MODULE_5__pulse__["a" /* clearPulse */])(id);
  // Refresh other devtools incase another one is open for the same
  // host domain
  Object(__WEBPACK_IMPORTED_MODULE_5__pulse__["b" /* setPulse */])();
});

async function sendDeviceConfigToAll() {
  const data = await __WEBPACK_IMPORTED_MODULE_3__storage__["b" /* getDeviceConfig */]();
  const message = { type: __WEBPACK_IMPORTED_MODULE_0__shared_constants__["k" /* RETURN_DEVICE_CONFIG */], data };
  __WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].messageAllPorts(message);
  __WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].messageAllTabs(message);
}

async function sendConfigToAllPorts () {
  let data = await __WEBPACK_IMPORTED_MODULE_3__storage__["a" /* get */](toolOptionKeys);
  __WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].messageAllPorts({ type: __WEBPACK_IMPORTED_MODULE_0__shared_constants__["j" /* RETURN_CONFIG */], data });
}

/**
 * Messages from Content
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const onGetDeviceConfig = async function (message, sender) {
    const data = await __WEBPACK_IMPORTED_MODULE_3__storage__["b" /* getDeviceConfig */]();
    const msg = { type: __WEBPACK_IMPORTED_MODULE_0__shared_constants__["k" /* RETURN_DEVICE_CONFIG */], data };
    __WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].messageTab(sender.tab.id, msg);
  }

  const onReportStatus = (message, sender) => {
    __WEBPACK_IMPORTED_MODULE_4__connections__["a" /* default */].messagePort(sender.tab.id, message);
  };

  switch (message.type) {
    // GET_DEVICE_CONFIG fetched by content script, respond with device config
    case __WEBPACK_IMPORTED_MODULE_0__shared_constants__["c" /* GET_DEVICE_CONFIG */]: onGetDeviceConfig(message, sender); break;

    // REPORT_STATUS is content script pushing current device info to the devtools page
    // for displaying; push the data to devtools
    case __WEBPACK_IMPORTED_MODULE_0__shared_constants__["h" /* REPORT_STATUS */]: onReportStatus(message, sender); break;
  }

  return false;
});


/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_constants__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__storage__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__connections__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_debug__ = __webpack_require__(14);





const startAlarm = () => {
  chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'pulse') {
      setPulse();
    }
  });

  const alarm = chrome.alarms.create('pulse', {
    when: Date.now(),
    periodInMinutes: __WEBPACK_IMPORTED_MODULE_0__shared_constants__["g" /* PULSE_MS */] / 1000 / 60,
  });
};
/* harmony export (immutable) */ __webpack_exports__["c"] = startAlarm;


const setPulse = async function setPulse () {
  const res = await __WEBPACK_IMPORTED_MODULE_1__storage__["a" /* get */](['apiVersion', 'injectPolyfill']);
  const ids = __WEBPACK_IMPORTED_MODULE_2__connections__["a" /* default */].getTabIds();

  Object(__WEBPACK_IMPORTED_MODULE_3__shared_debug__["a" /* default */])(`Setting pulse for tabs: ${ids}`);
  for (let id of ids) {
    const data = {
      apiVersion: res.apiVersion,
      injectPolyfill: res.injectPolyfill,
      timestamp: Date.now(),
      tabId: +id,
    };

    let code = `
      if (window.sessionStorage) {
        window.sessionStorage.setItem("${__WEBPACK_IMPORTED_MODULE_0__shared_constants__["f" /* PULSE */]}", JSON.stringify(${JSON.stringify(data)}));
      }
    `;

    chrome.tabs.executeScript(Number(id), {
      code,
      runAt: 'document_start', // execute immediately
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = setPulse;


const clearPulse = function clearPulse(tabId) {

  let code = `
    if (window.sessionStorage) {
      window.sessionStorage.removeItem("${__WEBPACK_IMPORTED_MODULE_0__shared_constants__["f" /* PULSE */]}");
    }
  `;

  chrome.tabs.executeScript(Number(tabId), {
    code,
    runAt: 'document_start', // execute immediately
  });
}
/* harmony export (immutable) */ __webpack_exports__["a"] = clearPulse;



/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__storage__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_device_options__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_tool_options__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_devices__ = __webpack_require__(28);





function validateValue (manifest, device, option, value) {
  const description = manifest[option];
  if (!description) {
    throw new Error('unknown option');
  }

  // If we have a device option, ensure that our devices manifest
  // contains the valid option
  if (device) {
    const deviceManifest = __WEBPACK_IMPORTED_MODULE_3__shared_devices__["a" /* default */][device];
    if (!deviceManifest) {
      throw new Error('invalid device');
    }
    if (!deviceManifest.options.includes(option)) {
      throw new Error(`invalid option ${option} for device ${device}`);
    }
  }

  switch (description.type) {
    case 'number':
    case 'range':
      value = Number(value);
      value = Math.max(value, description.min);
      value = Math.min(value, description.max);
      return value;
    case 'boolean':
      return !!value;
    case 'enum':
      if (!Object.keys(description.options).includes(value)) {
        throw new Error('invalid enum value');
      }
      return value;
    case 'list':
      if (!Array.isArray(value)) {
        throw new Error('invalid option');
      }
      const options = Object.keys(description.options);
      if (!value.every(val => options.includes(val))) {
        throw new Error('invalid option');
      }
      return value;
  }
  throw new Error('invalid type');
}

/**
 * Takes a device key, an option and a value to set to prefs.
 * If no device given, assume a tool-wide config set on the root.
 */
const setOption = async function setOption(device, option, value) {
  if (!device) {
    value = validateValue(__WEBPACK_IMPORTED_MODULE_2__shared_tool_options__["a" /* default */], device, option, value);
    await __WEBPACK_IMPORTED_MODULE_0__storage__["d" /* set */]({ [option]: value });
  } else {
    value = validateValue(__WEBPACK_IMPORTED_MODULE_1__shared_device_options__["a" /* default */], device, option, value);
    const key = `${device}:options`;
    const res = await __WEBPACK_IMPORTED_MODULE_0__storage__["a" /* get */](key);
    const data = res[key];
    data[option] = value;
    await __WEBPACK_IMPORTED_MODULE_0__storage__["d" /* set */]({ [key]: data });
  }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = setOption;




/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = debug;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(6);


function debug (...args) {
  if (__WEBPACK_IMPORTED_MODULE_0__constants__["e" /* IS_DEBUG */]) {
    console.info(__WEBPACK_IMPORTED_MODULE_0__constants__["b" /* DEBUG */], ...args);
  }
}


/***/ }),

/***/ 19:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__devices__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__device_options__ = __webpack_require__(20);



const config = {
  injectPolyfill: {
    text: 'Inject Polyfill',
    type: 'boolean',
    default: true,
  },

  apiVersion: {
    text: 'WebVR API Version',
    type: 'enum',
    options: {
      '1.1': '1.1',
    },
    default: '1.1',
  },

  simulatedDevices: {
    text: 'Simulated Devices',
    type: 'list',
    options: {
      'webaronarkit': 'WebARonARKit Device',
    },
    default: ['webaronarkit'],
  },
};

/* harmony default export */ __webpack_exports__["a"] = (config);

/**
 * Default options for setting in storage
 */
const defaultOptions = (function() {
  const defaults = Object.keys(config).reduce((defaults, optionName) => {
    defaults[optionName] = config[optionName].default;
    return defaults;
  }, {});

  // iterate over devices and map the list of options to its defaults
  // storing in `${deviceKey}:options`
  Object.keys(__WEBPACK_IMPORTED_MODULE_0__devices__["a" /* default */]).reduce((defaults, device) => {
    defaults[`${device}:options`] = __WEBPACK_IMPORTED_MODULE_0__devices__["a" /* default */][device].options.reduce((config, optionName) => {
      config[optionName] = __WEBPACK_IMPORTED_MODULE_1__device_options__["a" /* default */][optionName].default;
      return config;
    }, {});
    return defaults;
  }, defaults);

  return defaults;
})();
/* harmony export (immutable) */ __webpack_exports__["b"] = defaultOptions;



/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* harmony default export */ __webpack_exports__["a"] = ({
  /* AR */
  showPlanes: {
    text: 'Show Planes',
    category: 'ar',
    type: 'boolean',
    default: false,
  },

  showHits: {
    text: 'Show Hits',
    category: 'ar',
    type: 'boolean',
    default: false,
  },

  planesOpacity: {
    text: 'Planes Opacity',
    category: 'ar',
    type: 'range',
    default: 1,
    min: 0,
    max: 1.0,
    step: 0.1,
  },

  sceneOpacity: {
    text: 'Scene Opacity',
    category: 'ar',
    type: 'range',
    default: 1,
    min: 0,
    max: 1,
    step: 0.1,
  },

  /* XR */
  cameraFov: {
    text: 'Camera FOV',
    category: 'xr',
    type: 'range',
    default: 45,
    min: 30,
    max: 70,
    step: 5,
  },

  showControllerText: {
    text: 'Show Controls Text',
    category: 'xr',
    type: 'boolean',
    default: true,
  },

  userHeight: {
    text: 'User Height',
    category: 'xr',
    type: 'range',
    default: 1.6,
    min: 0,
    max: 2,
    step: 0.1,
  },

  /* Chaos */

  randomizeInitialPosition: {
    text: 'Randomize Initial Position',
    category: 'chaos',
    type: 'boolean',
    default: false,
  },

  flakyPose: {
    text: 'Flaky Pose',
    category: 'chaos',
    type: 'boolean',
    default: false,
  },

  flakyPlanes: {
    text: 'Flaky Planes',
    category: 'chaos',
    type: 'boolean',
    default: false,
  },
});


/***/ }),

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  webaronarkit: {
    name: 'WebARonARKit',
    options: [
      'showPlanes',
      'showHits',
      'planesOpacity',
      'sceneOpacity',
      'cameraFov',
      'userHeight',
    ],
  },
});


/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_debug__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_tool_options__ = __webpack_require__(19);



const get = values => {
  return new Promise(resolve => chrome.storage.local.get(values, resolve));
};
/* harmony export (immutable) */ __webpack_exports__["a"] = get;


const set = values => {
  return new Promise(resolve => chrome.storage.local.set(values, resolve));
};
/* harmony export (immutable) */ __webpack_exports__["d"] = set;


/**
 * Set up any default values in storage
 */
const initialize = async function initialize() {
  const config = await get(null);

  Object(__WEBPACK_IMPORTED_MODULE_0__shared_debug__["a" /* default */])('initial config', config);
  // Iterate over the default values and check to see if
  // they have already been set in the storage.
  // This is necessary for when new options are added,
  // their defaults can be saved when a new option is
  // added to a specific VRDisplay for example. These should
  // probably be batched up, but this API makes it quite difficult.

  const topLevelKeys = Object.keys(__WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */]);
  for (let key of topLevelKeys) {
    const currentValue = config[key];

    // If the top level option is undefined, just set it
    if (config[key] === undefined) {
      const valuesToSet = {};
      valuesToSet[key] = __WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */][key];
      await set(valuesToSet);
    }

    // Clobber array options as debug
    if (Array.isArray(__WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */][key])) {
      const valuesToSet = {};
      valuesToSet[key] = __WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */][key];
      await set(valuesToSet);
    }

    // If the option is an object and has been partially set,
    // we'll need to check individual properties
    if (typeof __WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */][key] === 'object' && !Array.isArray(__WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */][key])) {
      // iterate over the option keys and set
      // any unset values
      const valuesToSet = {};
      const subValuesToSet = {};
      for (let subkey of Object.keys(__WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */][key])) {
        if (config[key][subkey] === undefined) {
          subValuesToSet[subkey] = __WEBPACK_IMPORTED_MODULE_1__shared_tool_options__["b" /* defaultOptions */][key][subkey];
        }
      }
      // Use our new subvalues to set with the defaults to merge
      // with values already set
      valuesToSet[key] = Object.assign({}, config[key], subValuesToSet);
      await set(valuesToSet);
    }
  }

  const postConfig = await get(null);
  Object(__WEBPACK_IMPORTED_MODULE_0__shared_debug__["a" /* default */])('post config', postConfig);
};
/* harmony export (immutable) */ __webpack_exports__["c"] = initialize;


const getDeviceConfig = async function getDeviceConfig() {
  // First, see what devices we are simulating before sending config
  // to the injected code
  let res = await get('simulatedDevices');

  if (!res || !res.simulatedDevices) {
    return;
  }

  const optionKeys = res.simulatedDevices.map(device => `${device}:options`);

  // Fetch the config for current set of simulated devices
  res = await get(optionKeys);

  // strip out the `:options` in the response
  const data = {};
  for (let key of Object.keys(res)) {
    data[key.split(':')[0]] = res[key];
  }

  return data;
};
/* harmony export (immutable) */ __webpack_exports__["b"] = getDeviceConfig;



/***/ }),

/***/ 43:
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ 6:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const token = '@xr-devtools';
/* harmony export (immutable) */ __webpack_exports__["m"] = token;


/**
 * Configuration
 */

// How often the devtools panel should ping the content script
// to update sessionStorage's enable value. If opening a page that
// was previously debugged, and if the sessionStorage value was more than
// PULSE_MS ago, the polyfill will NOT be injected because the devtools have
// not been opened. Rough work around for fast/light-weight content script and optional
// polyfill injection on document_start.
const PULSE_MS = 120000;
/* harmony export (immutable) */ __webpack_exports__["g"] = PULSE_MS;


const IS_DEBUG = "production" !== 'production';
/* harmony export (immutable) */ __webpack_exports__["e"] = IS_DEBUG;


const REPORT_STATUS_MS = 5000;
/* harmony export (immutable) */ __webpack_exports__["i"] = REPORT_STATUS_MS;


/**
 * String/name constants
 */
// Key for sessionStorage pulse timer
const PULSE = `${token}:PULSE`;
/* harmony export (immutable) */ __webpack_exports__["f"] = PULSE;


// Key for debug messages
const DEBUG = `${token}:DEBUG`;
/* harmony export (immutable) */ __webpack_exports__["b"] = DEBUG;


const SET_OPTION = `${token}:SET_OPTION`;
/* harmony export (immutable) */ __webpack_exports__["l"] = SET_OPTION;

const GET_DEVICE_CONFIG = `${token}:GET_DEVICE_CONFIG`;
/* harmony export (immutable) */ __webpack_exports__["c"] = GET_DEVICE_CONFIG;

const RETURN_DEVICE_CONFIG = `${token}:RETURN_DEVICE_CONFIG`;
/* harmony export (immutable) */ __webpack_exports__["k"] = RETURN_DEVICE_CONFIG;

const RETURN_CONFIG = `${token}:RETURN_CONFIG`;
/* harmony export (immutable) */ __webpack_exports__["j"] = RETURN_CONFIG;

const REPORT_STATUS = `${token}:REPORT_STATUS`;
/* harmony export (immutable) */ __webpack_exports__["h"] = REPORT_STATUS;


// Message printed to console.log for developers to know they're
// working with a polyfilled version of the WebVR API
const INJECTION_MESSAGE = `XR DevTools has been enabled for this host and may modify some API calls.`
/* harmony export (immutable) */ __webpack_exports__["d"] = INJECTION_MESSAGE;


// Class name appended to the <canvas> element injected by the
// ARDisplay
const CANVAS_CLASS_NAME = 'xr-devtools-scene';
/* harmony export (immutable) */ __webpack_exports__["a"] = CANVAS_CLASS_NAME;



/***/ }),

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_events___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_events__);


class Connections extends __WEBPACK_IMPORTED_MODULE_0_events__["EventEmitter"] {
  constructor() {
    super();

    this._connections = {};

    // https://developer.chrome.com/extensions/devtools#content-script-to-devtools
    chrome.runtime.onConnect.addListener(port => {
      const listener = (message, sender, sendResponse) => {
        if (message.name == "init") {
          this._connections[message.tabId] = port;
          this.emit('new-connection', message.tabId, port);
          return;
        }
  
        this.emit('message', message, sender);
      }

      port.onMessage.addListener(listener);
      port.onDisconnect.addListener(port => {
        port.onMessage.removeListener(listener);
        let tabs = Object.keys(this._connections);
        for (let i = 0; i < tabs.length; i++) {
          if (this._connections[tabs[i]] == port) {
            delete this._connections[tabs[i]];
            this.emit('disconnect', tabs[i]);
            break;
          }
        }
      });
    });
  }

  messageAllPorts(message) {
    const ports = Object.keys(this._connections).map(id => this._connections[id]);
    for (let port of ports) {
      port.postMessage(message);
    }
  }

  messageAllTabs(message) {
    const tabs = Object.keys(this._connections);
    for (let tab of tabs) {
      chrome.tabs.sendMessage(Number(tab), Object.assign({}, message, { tabId: tab }));
    }
  }

  messagePort(tabId, message) {
    if (this._connections[tabId]) {
      this._connections[tabId].postMessage(message);
    }
  }

  messageTab(tabId, message) {
    if (this._connections[tabId]) {
      chrome.tabs.sendMessage(Number(tabId), Object.assign({}, message, { tabId: tabId }));
    }
  }

  getTabIds() {
    return Object.keys(this._connections);
  }
}
/* unused harmony export Connections */


/* harmony default export */ __webpack_exports__["a"] = (new Connections());


/***/ })

/******/ });
});