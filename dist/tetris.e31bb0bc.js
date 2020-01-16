// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/js/createPlayingField.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  var field = document.getElementById("field");

  while (field.firstChild) {
    field.removeChild(field.firstChild);
  }

  for (var i = 0; i < 20; i++) {
    var rowElement = document.createElement("div");
    field.appendChild(rowElement);

    for (var j = 0; j < 10; j++) {
      var columnElement = document.createElement("div");
      rowElement.appendChild(columnElement);
    }
  }
};

exports.default = _default;
},{}],"src/js/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.random = random;

function random(from, to) {
  var range = Math.floor(Math.random() * (to - from + 1));
  return range + from;
}
},{}],"src/js/tetrominoes.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = [[[null, null, null, null], [true, true, true, true], [null, null, null, null], [null, null, null, null]], [[true, false, false], [true, true, true], [false, false, false]], [[false, false, true], [true, true, true], [false, false, false]], [[false, true, true, false], [false, true, true, false], [false, false, false, false], [false, false, false, false]], [[false, true, true], [true, true, false], [false, false, false]], [[true, true, false], [false, true, true], [false, false, false]], [[false, true, false], [true, true, true], [false, false, false]]];
exports.default = _default;
},{}],"src/js/rotate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotatedTetro = rotatedTetro;

function rotatedTetro(matrix) {
  var rotateNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (rotateNumber === 0) return matrix;
  rotateNumber = rotateNumber % 4;
  var len = matrix.length;
  var layers = Math.floor(len / 2);
  var rotated = [];

  if (len % 2 === 1) {
    var center = matrix[layers][layers];
    rotated.push([center]);
  }

  for (var i = layers - 1; i >= 0; i--) {
    var layer = getLayer(matrix, i);
    var layerLen = layer.length;
    var layerLength = layerLen / 4 + 1;
    var shift = layerLength - 1;
    var shiftedArray = shiftArray(layer, shift * rotateNumber);
    insertLayer(shiftedArray, rotated);
  }

  return rotated;
}

function getLayer(matrix, n) {
  var len = matrix.length;
  var items = len - n * 2;
  var endItem = n + items - 1;
  var arr = [];

  for (var i = n; i < items + n; i++) {
    arr.push(matrix[n][i]);
  }

  for (var _i = n + 1; _i <= endItem; _i++) {
    arr.push(matrix[_i][endItem]);
  }

  for (var _i2 = endItem - 1; _i2 > n; _i2--) {
    arr.push(matrix[endItem][_i2]);
  }

  for (var _i3 = endItem; _i3 > n; _i3--) {
    arr.push(matrix[_i3][n]);
  }

  return arr;
}

function shiftArray(arr, shift) {
  var copy = arr.slice();
  var n = shift >= 0 ? copy.length - shift : shift * -1;
  var removed = copy.splice(0, n);
  return copy.concat(removed);
}

function insertLayer(layer, matrix) {
  var len = layer.length;
  var layerLength = len / 4 + 1;
  var middle = Math.max(0, layerLength - 2);
  var bottomLayerStart = layerLength + middle;
  matrix.unshift(layer.slice(0, layerLength));
  matrix.push(layer.slice(bottomLayerStart, bottomLayerStart + layerLength).reverse());

  for (var i = 0; i < middle; i++) {
    matrix[i + 1].push(layer[layerLength + i]);
    matrix[i + 1].unshift(layer[len - (i + 1)]);
  }
}
},{}],"src/js/getCurrentPositionOfTetromino.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentPositionOfTetromino = getCurrentPositionOfTetromino;

var _tetrominoes = _interopRequireDefault(require("./tetrominoes"));

var _rotate = require("./rotate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCurrentPositionOfTetromino(liveTetromino) {
  var tetromino = _tetrominoes.default[liveTetromino.type];
  var rotated = (0, _rotate.rotatedTetro)(tetromino, liveTetromino.rotationState);
  return rotated.reduce(function (acc, rowArray, yOffSetIndex) {
    var columnElements = rowArray.reduce(function (accColumns, el, xOffSetIndex) {
      if (el === true) {
        var translatedPosition = [liveTetromino.topLeftRef[0] + xOffSetIndex, liveTetromino.topLeftRef[1] + yOffSetIndex];
        accColumns.push(translatedPosition);
      }

      return accColumns;
    }, []);
    return acc.concat(columnElements);
  }, []);
}
},{"./tetrominoes":"src/js/tetrominoes.js","./rotate":"src/js/rotate.js"}],"src/js/upDateScene.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startGame = startGame;
exports.rotateTetromino = rotateTetromino;
exports.dropNewTetromino = dropNewTetromino;
exports.moveTetromino = moveTetromino;
exports.pauseGame = pauseGame;
exports.liveTetrominoState = exports.mainState = void 0;

var _helpers = require("./helpers");

var _getCurrentPositionOfTetromino = require("./getCurrentPositionOfTetromino");

var _createPlayingField = _interopRequireDefault(require("./createPlayingField"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gameState = {
  running: false,
  level: 3,
  nextTick: 0,
  points: 0,
  lines: 0,
  play: false
};
var mainState = [];
exports.mainState = mainState;

(function mainStateInit() {
  for (var i = 0; i < 20; i++) {
    mainState.push(new Array(10).fill(null));
  }
})();

var liveTetrominoState = {
  topLeftRef: [0, 0],
  rotationState: 0,
  position: [],
  type: 0
};
exports.liveTetrominoState = liveTetrominoState;

function startGame() {
  gameState.running = gameState.play = true;
  gameState.level = 1;
  gameState.points = 0;
  gameState.nextTick = performance.now() + 1000;
  renderNewGameState();
  dropNewTetromino();
  (0, _createPlayingField.default)();
  clockState();
  renderButton();
}

function rotateTetromino() {
  if (!gameState.running) return;
  var oldPosition = liveTetrominoState.position.slice();
  var position = (0, _getCurrentPositionOfTetromino.getCurrentPositionOfTetromino)(_objectSpread({}, liveTetrominoState, {}, {
    rotationState: (liveTetrominoState.rotationState + 1) % 4
  })); // if outside try move in
  // check collision (and then try to move it + or - 1 - 2 ... offset it ... )

  var offset = needToOffSet(position);

  if (offset !== 0) {
    position = position.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      return [x + offset, y];
    });
  }

  var colliding = isColliding(position);

  if (!colliding) {
    liveTetrominoState.rotationState = ++liveTetrominoState.rotationState;
    liveTetrominoState.position = position;
    gameState.nextTick += 200;
    renderTetrominoMove(position, oldPosition);
  }
}

function dropNewTetromino() {
  gameState.nextTick = performance.now() + 1000 / gameState.level;
  gameState.running = true;
  liveTetrominoState.type = (0, _helpers.random)(0, 6);
  liveTetrominoState.topLeftRef = [3, 0];
  liveTetrominoState.rotationState = 0;
  liveTetrominoState.position = (0, _getCurrentPositionOfTetromino.getCurrentPositionOfTetromino)(liveTetrominoState);

  if (isColliding(liveTetrominoState.position)) {
    gameover();
  } else {
    renderTetrominoMove(liveTetrominoState.position);
  }
}

function moveTetromino(_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      difX = _ref4[0],
      difY = _ref4[1];

  if (!gameState.running) return;
  var legit = true;
  var reachedBottom = false;
  var collision = false;
  var newPosition = liveTetrominoState.position.map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        xPos = _ref6[0],
        yPos = _ref6[1];

    var newCoor = [xPos + difX, yPos + difY];

    if (newCoor[0] < 0 || newCoor[0] > 9) {
      // tetromino at edge attempting to move outside
      legit = false;
    } else {
      // a legit move
      if (newCoor[1] < 20 && mainState[newCoor[1]][newCoor[0]] !== null) {
        // collision happens
        if (difY !== 0) {
          // move down
          collision = true;
        } else {
          // move left or right
          legit = false;
        }
      }
    }

    if (newCoor[1] > 19) {
      legit = false;
      reachedBottom = true;
    }

    return newCoor;
  });

  if (reachedBottom || collision) {
    addToState(liveTetrominoState);
    var filled = checkFilledRows();
    gameState.points = gameState.points + gameState.level * 15;

    if (filled.length > 0) {
      filled.forEach(function (el) {
        mainState.splice(el, 1);
        mainState.unshift(new Array(10).fill(null));
        gameState.points = gameState.points + gameState.level * filled.length * 100;
        gameState.lines = gameState.lines + filled.length;
        removeAndRow(el);
      });
    }

    renderNewGameState();
    dropNewTetromino();
  }

  if (legit && !collision) {
    var oldPosition = liveTetrominoState.position.slice();
    liveTetrominoState.position = newPosition;

    var _liveTetrominoState$t = _slicedToArray(liveTetrominoState.topLeftRef, 2),
        xRef = _liveTetrominoState$t[0],
        yRef = _liveTetrominoState$t[1];

    liveTetrominoState.topLeftRef = [xRef + difX, yRef + difY];
    renderTetrominoMove(newPosition, oldPosition);

    if (difX !== 0) {
      gameState.nextTick += 50;
    }
  }
}

var field = document.getElementById("field");

function needToOffSet(positions) {
  var highest = positions.reduce(function (acc, _ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        x = _ref8[0],
        y = _ref8[1];

    return Math.max(x, acc);
  }, 0);
  if (highest > 9) return 9 - highest;
  var lowest = positions.reduce(function (acc, _ref9) {
    var _ref10 = _slicedToArray(_ref9, 2),
        x = _ref10[0],
        y = _ref10[1];

    return Math.min(x, acc);
  }, 10);
  if (lowest < 0) return lowest * -1;
  return 0;
}

function accessPosInDom(_ref11, type) {
  var _ref12 = _slicedToArray(_ref11, 2),
      x = _ref12[0],
      y = _ref12[1];

  var row = field.children.item(y);
  var el = row.children.item(x);

  if (type === -1) {
    el.style.background = "black";
  } else {
    var colors = ["rgb(97,197,235)", "rgb(91, 102, 168)", "rgb(225, 127, 58)", "rgb(242, 211, 73)", "rgb(101, 179, 82)", "rgb(221, 58, 53)", "rgb(161, 84, 153)"];
    el.style.background = colors[liveTetrominoState.type];
  }
}

var points = document.getElementById("points");
var lines = document.getElementById("lines");
var level = document.getElementById("level");
var refButtonPause = document.getElementById("pauseGame");
var startGameBtn = document.getElementById("startGame");

function renderNewGameState() {
  points.innerText = gameState.points;
  lines.innerText = gameState.lines;
  level.innerText = gameState.level;
}

function renderButton() {
  if (gameState.play) {
    var text = gameState.running ? "pause" : "resume";
    refButtonPause.innerText = text;
    refButtonPause.style.display = "block";
    startGameBtn.innerText = "restart";
  } else {
    refButtonPause.style.display = "none";
    startGameBtn.innerText = "start";
  }
}

renderNewGameState();

function gameover() {
  console.log("gameover");
  gameState.running = gameState.play = false;
}

function renderTetrominoMove(newPos, removeOld) {
  if (removeOld) {
    removeOld.forEach(function (el) {
      accessPosInDom(el, -1);
    });
  }

  newPos.forEach(function (el) {
    accessPosInDom(el, liveTetrominoState.type);
  });
}

function pauseGame() {
  // set time to next tick
  gameState.running = !gameState.running;
  renderButton();

  if (gameState.running) {
    clockState();
  }
}

function removeAndRow(index) {
  var row = field.children.item(index).remove();
  var rowElement = document.createElement("div");

  for (var j = 0; j < 10; j++) {
    var columnElement = document.createElement("div");
    rowElement.appendChild(columnElement);
  }

  field.prepend(rowElement);
}

function addToState(_ref13) {
  var position = _ref13.position,
      type = _ref13.type;
  position.forEach(function (_ref14) {
    var _ref15 = _slicedToArray(_ref14, 2),
        x = _ref15[0],
        y = _ref15[1];

    mainState[y][x] = type;
  });
}

function isColliding(positions) {
  return positions.every(function (_ref16) {
    var _ref17 = _slicedToArray(_ref16, 2),
        x = _ref17[0],
        y = _ref17[1];

    return mainState[y][x];
  });
}

function checkFilledRows() {
  return mainState.reduce(function (acc, row, index) {
    var rowFull = row.every(function (el) {
      return el !== null;
    });

    if (rowFull) {
      acc.push(index);
    }

    return acc;
  }, []);
}

function clearState() {
  mainState.forEach(function (row) {
    row.forEach(function (el) {
      el = null;
    });
  });
  (0, _createPlayingField.default)();
}

function clockState() {
  if (performance.now() >= gameState.nextTick) {
    moveTetromino([0, 1]);
    gameState.nextTick = performance.now() + 1000 / gameState.level;
  }

  if (gameState.running) {
    requestAnimationFrame(clockState);
  }
}
},{"./helpers":"src/js/helpers.js","./getCurrentPositionOfTetromino":"src/js/getCurrentPositionOfTetromino.js","./createPlayingField":"src/js/createPlayingField.js"}],"src/js/eventHandlers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initEventHandlers = initEventHandlers;

var _upDateScene = require("./upDateScene");

function initEventHandlers() {
  document.addEventListener("keydown", function (e) {
    if ([37, 39].indexOf(e.which) > -1) {
      var move = e.which === 37 ? [-1, 0] : [1, 0];
      (0, _upDateScene.moveTetromino)(move);
    } else if (e.which === 38) {
      (0, _upDateScene.rotateTetromino)();
    } else if (e.which === 40) {
      (0, _upDateScene.moveTetromino)([0, 1]);
    }
  });
  var start = document.getElementById("startGame");
  var pause = document.getElementById("pauseGame");
  start.addEventListener("click", _upDateScene.startGame);
  pause.addEventListener("click", _upDateScene.pauseGame);
}
},{"./upDateScene":"src/js/upDateScene.js"}],"src/js/main.js":[function(require,module,exports) {
"use strict";

var _createPlayingField = _interopRequireDefault(require("./createPlayingField"));

var _eventHandlers = require("./eventHandlers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _createPlayingField.default)();
(0, _eventHandlers.initEventHandlers)();
},{"./createPlayingField":"src/js/createPlayingField.js","./eventHandlers":"src/js/eventHandlers.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/css/index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _main = _interopRequireDefault(require("./src/js/main"));

require("./src/css/index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./src/js/main":"src/js/main.js","./src/css/index.css":"src/css/index.css"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60349" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/tetris.e31bb0bc.js.map