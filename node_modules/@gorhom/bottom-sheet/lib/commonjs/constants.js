"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WINDOW_WIDTH = exports.WINDOW_HEIGHT = exports.GESTURE = void 0;

var _reactNative = require("react-native");

const {
  height: WINDOW_HEIGHT,
  width: WINDOW_WIDTH
} = _reactNative.Dimensions.get('window');

exports.WINDOW_WIDTH = WINDOW_WIDTH;
exports.WINDOW_HEIGHT = WINDOW_HEIGHT;
var GESTURE;
exports.GESTURE = GESTURE;

(function (GESTURE) {
  GESTURE[GESTURE["UNDETERMINED"] = 0] = "UNDETERMINED";
  GESTURE[GESTURE["CONTENT"] = 1] = "CONTENT";
  GESTURE[GESTURE["HANDLE"] = 2] = "HANDLE";
})(GESTURE || (exports.GESTURE = GESTURE = {}));
//# sourceMappingURL=constants.js.map