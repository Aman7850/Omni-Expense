import { useEffect, useRef } from 'react';
import Animated from 'react-native-reanimated';
export const useReactiveValue = value => {
  // ref
  const ref = useRef(null);

  if (ref.current === null) {
    // @ts-ignore
    ref.current = new Animated.Value(value);
  } // effects


  useEffect(() => {
    if (ref.current) {
      ref.current.setValue(value);
    }
  }, [value]);
  return ref.current;
};
//# sourceMappingURL=useReactiveValue.js.map