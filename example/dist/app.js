/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _worker = __webpack_require__(3);

var _worker2 = _interopRequireDefault(_worker);

var _index = __webpack_require__(2);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

localStorage.setItem('key_in_localstorage', 'in localstorage');

window.onload = () => {
  const worker = new _worker2.default();

  (0, _index2.default)(worker);
};

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = polyfill;
function uniqeid() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

const MESSAGE_CODE = 'W29&p0mfSii!,OSRAaiO#DeM';

// call code in host environment
function call(self, code) {
  return new Promise(resolve => {
    const id = uniqeid();
    self._resolves.set(id, resolve);
    self.postMessage({
      magic: MESSAGE_CODE,
      code,
      id
    });
  });
}

function polyfillInHost(self) {
  self.addEventListener('message', ev => {
    if (ev.data.magic === MESSAGE_CODE) {
      self.postMessage({
        magic: MESSAGE_CODE,
        id: ev.data.id,
        return: eval(ev.data.code)
      });
    }
  });
}

function polyfillInWorker(self) {
  self._resolves = new Map();
  self.localStorage = {
    getItem(key) {
      return call(self, `localStorage.getItem('${key}')`);
    },
    setItem(key, value) {
      return call(self, `localStorage.setItem('${key}', '${value}')`);
    },
    removeItem(key) {
      return call(self, `localStorage.removeItem('${key}')`);
    }
  };
  self.addEventListener('message', ev => {
    if (ev.data.magic === MESSAGE_CODE) {
      const resolve = self._resolves.get(ev.data.id);
      resolve(ev.data.return);
    }
  });
}

function polyfill(self) {
  try {
    window;
    polyfillInHost(self);
  } catch (ex) {
    polyfillInWorker(self);
  }
}
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function() {
  return new Worker("dist/" + "example.work.js");
};

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map