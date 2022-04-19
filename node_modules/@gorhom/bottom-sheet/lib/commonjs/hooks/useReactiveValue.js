"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useReactiveValue = void 0;

var _react = require("react");

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const useReactiveValue = value => {
  // ref
  const ref = (0, _react.useRef)(null);

  if (ref.current === null) {
    // @ts-ignore
    ref.current = new _reactNativeReanimated.default.Value(value);
  } // effects


  (0, _react.useEffect)(() => {
    if (ref.current) {
      ref.current.setValue(value);
    }
  }, [value]);
  return ref.current;
};

exports.useReactiveValue = useReactiveValue;
//# sourceMappingURL=useReactiveValue.js.map