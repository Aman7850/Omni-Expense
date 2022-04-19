import { Dimensions } from 'react-native';
const {
  height: WINDOW_HEIGHT,
  width: WINDOW_WIDTH
} = Dimensions.get('window');
var GESTURE;

(function (GESTURE) {
  GESTURE[GESTURE["UNDETERMINED"] = 0] = "UNDETERMINED";
  GESTURE[GESTURE["CONTENT"] = 1] = "CONTENT";
  GESTURE[GESTURE["HANDLE"] = 2] = "HANDLE";
})(GESTURE || (GESTURE = {}));

export { GESTURE, WINDOW_HEIGHT, WINDOW_WIDTH };
//# sourceMappingURL=constants.js.map