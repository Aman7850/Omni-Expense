"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useReactiveValues = void 0;

var _react = require("react");

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const useReactiveValues = values => {
  // ref
  const ref = (0, _react.useRef)(null);

  if (ref.current === null) {
    // @ts-ignore
    ref.current = [];
    values.map(value => {
      // @ts-ignore
      ref.current.push(new _reactNativeReanimated.default.Value(value));
    });
  } // effects


  (0, _react.useEffect)(() => {
    if (ref.current) {
      values.map((value, index) => {
        // @ts-ignore
        if (ref.current[index]) {
          // update current value
          // @ts-ignore
          ref.current[index].setValue(value);
        } else {
          // insert current value
          // @ts-ignore
          ref.current.push(new _reactNativeReanimated.default.Value(value));
        }
      });
      /**
       * if previous animated array has more values than the updated
       * array, we will need to set the extra values to the last
       * value of the updated array.
       */

      if (values.length < ref.current.length) {
        const lastValue = values[values.length - 1];

        for (let i = values.length - 1; i <= ref.current.length - 1; i++) {
          ref.current[i].setValue(lastValue);
        }
      }
    }
  }, [values]);
  return ref.current;
};

exports.useReactiveValues = useReactiveValues;
//# sourceMappingURL=useReactiveValues.js.map