"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactNative = require("react-native");

var _reactNativeReanimated = require("react-native-reanimated");

var _reactNativeRedash = require("react-native-redash");

var _styles = require("./styles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BottomSheetDebugView = ({
  values
}) => {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    pointerEvents: "none",
    style: _styles.styles.container
  }, Object.keys(values).map(key => /*#__PURE__*/_react.default.createElement(_reactNativeRedash.ReText, {
    key: "item-".concat(key),
    style: _styles.styles.text,
    text: (0, _reactNativeReanimated.concat)("".concat(key, ": "), values[key])
  })));
};

var _default = BottomSheetDebugView;
exports.default = _default;
//# sourceMappingURL=BottomSheetDebugView.js.map