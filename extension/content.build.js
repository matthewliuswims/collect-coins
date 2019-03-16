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
/******/ 	return __webpack_require__(__webpack_require__.s = 303);
/******/ })
/************************************************************************/
/******/ ({

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

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shared_constants__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shared_debug__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shared_PostMessenger__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_pulse__ = __webpack_require__(67);





/**
 * This file runs on every page load at document_start.
 * Should be fast and small, and only inject and parse
 * the WebAR API if the devtools panel has timestamped
 * local storage.
 */

const pulse = Object(__WEBPACK_IMPORTED_MODULE_3__shared_pulse__["a" /* getPulse */])();

if (pulse) {
  Object(__WEBPACK_IMPORTED_MODULE_1__shared_debug__["a" /* default */])(`Last pulse ${(+Date.now() - (pulse ? pulse.timestamp : 0)) / 1000} seconds ago`);
}

if (pulse && pulse.timestamp && +Date.now() < pulse.timestamp + __WEBPACK_IMPORTED_MODULE_0__shared_constants__["g" /* PULSE_MS */]) {

  // Always display an injection message in the console
  console.warn(__WEBPACK_IMPORTED_MODULE_0__shared_constants__["d" /* INJECTION_MESSAGE */]);

  // Inject via https://stackoverflow.com/a/9310273
  // so user-code can interact with polyfill code
  const s = document.createElement('script');
  s.src = chrome.extension.getURL('inject.build.js');
  (document.head || document.documentElement).appendChild(s);
  s.onload = () => s.parentNode.removeChild(s);


  /**
   * Messages from injected script
   */
  const messenger = new __WEBPACK_IMPORTED_MODULE_2__shared_PostMessenger__["a" /* default */]('content');

  // Our injected script just started and is requesting device configuration.
  messenger.on(__WEBPACK_IMPORTED_MODULE_0__shared_constants__["c" /* GET_DEVICE_CONFIG */], () =>
    chrome.runtime.sendMessage(null, { type: __WEBPACK_IMPORTED_MODULE_0__shared_constants__["c" /* GET_DEVICE_CONFIG */] }));

  // Pulse from injected script to send device properties to devtools
  messenger.on(__WEBPACK_IMPORTED_MODULE_0__shared_constants__["h" /* REPORT_STATUS */], data => chrome.runtime.sendMessage(null, {
    data,
    type: __WEBPACK_IMPORTED_MODULE_0__shared_constants__["h" /* REPORT_STATUS */],
  }));

  /**
   * Messages from background process
   */

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
      case __WEBPACK_IMPORTED_MODULE_0__shared_constants__["k" /* RETURN_DEVICE_CONFIG */]:
        messenger.emit(__WEBPACK_IMPORTED_MODULE_0__shared_constants__["k" /* RETURN_DEVICE_CONFIG */], message.data);
        break;
    }
  });
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

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__debug__ = __webpack_require__(14);



const names = ['content', 'inject'];

/**
 * Wrapper class around `window.postMessage` for communication
 * between the content script and injected content. Handling
 * occurs as to not fire the event in the same environment as where it
 * was sent and to expose a similar interface to EventEmitter,
 * rather than giant switch cases.
 */
class PostMessenger {
  constructor(name) {
    if (!names.includes(name)) {
      throw new Error('must be a valid name');
    }

    this.name = name;
    this.listeners = {};

    window.addEventListener('message', e => {
      // Only accept messages from this window/extension, and ignore
      // messages that are from the same Messenger instance
      if (e.source !== window ||
          !e.data ||
          e.data.source !== __WEBPACK_IMPORTED_MODULE_0__constants__["m" /* token */] ||
          e.data.sourceName === this.name) {
        return;
      }

      const { type, data } = e.data;

      const listeners = this.listeners[type];
      if (!listeners || listeners.length === 0) {
        return;
      }

      for (let listener of listeners) {
        Object(__WEBPACK_IMPORTED_MODULE_1__debug__["a" /* default */])(`PostMessenger/${this.name}: handling ${type}`);
        listener(data);
      }
    });
  }

  on(name, fn) {
    const listeners = this.listeners[name] = this.listeners[name] || [];
    listeners.push(fn);
  }

  off(name, fn) {
    const listeners = this.listeners[name] = this.listeners[name] || [];

    for (let i = listeners.length; i >= 0; i--) {
      if (listeners[i] === fn) {
        listeners.pop();
      }
    }
  }

  emit(eventType, data) {
    Object(__WEBPACK_IMPORTED_MODULE_1__debug__["a" /* default */])(`PostMessenger/${this.name}: emitting ${eventType}`);
    window.postMessage({
      source: __WEBPACK_IMPORTED_MODULE_0__constants__["m" /* token */],
      type: eventType,
      sourceName: this.name,
      data,
    }, '*');
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PostMessenger;



/***/ }),

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(6);


const getPulse = () => {
  const storage = window.sessionStorage;
  const pulseStr = storage ? storage.getItem(__WEBPACK_IMPORTED_MODULE_0__constants__["f" /* PULSE */]) : null;

  let pulse;
  if (pulseStr) {
    try {
      pulse = JSON.parse(pulseStr);
    } catch (e) {}
  }

  return pulse;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getPulse;



/***/ })

/******/ });
});