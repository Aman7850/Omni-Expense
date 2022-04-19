"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePropsValidator = void 0;

var _react = require("react");

var _invariant = _interopRequireDefault(require("invariant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const usePropsValidator = ({
  index,
  snapPoints,
  topInset,
  // animation
  animationDuration,
  animationEasing
}) => {
  (0, _react.useMemo)(() => {
    // snap points
    (0, _invariant.default)(snapPoints, "'snapPoints' was not provided! please provide at least one snap point.");
    (0, _invariant.default)(snapPoints.length > 0, "'snapPoints' was provided with no points! please provide at least one snap point."); // index

    (0, _invariant.default)(typeof index === 'number' || typeof index === 'undefined', "'index' was provided but with wrong type ! expected type is a number.");
    (0, _invariant.default)(typeof index === 'number' ? index >= -1 && index <= snapPoints.length - 1 : true, "'index' was provided but out of the provided snap points range! expected value to be between -1, ".concat(snapPoints.length - 1)); // topInset

    (0, _invariant.default)(typeof topInset === 'number' || typeof topInset === 'undefined', "'topInset' was provided but with wrong type ! expected type is a number."); // animations

    (0, _invariant.default)(typeof animationDuration === 'number' || typeof animationDuration === 'undefined', "'animationDuration' was provided but with wrong type ! expected type is a number.");
    (0, _invariant.default)(typeof animationDuration === 'number' ? animationDuration > 0 : true, "'animationDuration' was provided but the value is very low! expected value to be greater than 0");
    (0, _invariant.default)(typeof animationEasing === 'function' || typeof animationEasing === 'undefined', "'animationEasing' was provided but with wrong type ! expected type is a Animated.EasingFunction."); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

exports.usePropsValidator = usePropsValidator;
//# sourceMappingURL=usePropsValidator.js.map