function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { View as RNView } from 'react-native';
import isEqual from 'lodash.isequal';
import { useBottomSheetInternal } from '../../hooks';
import { styles } from './styles';

const BottomSheetViewComponent = ({
  style,
  focusHook: useFocusHook = useEffect,
  children,
  ...reset
}) => {
  // hooks
  const {
    scrollableContentOffsetY
  } = useBottomSheetInternal(); // styles

  const containerStyle = useMemo(() => ({ ...styles.container,
    // @ts-ignore
    ...style
  }), [style]); // callback

  const handleSettingScrollable = useCallback(() => {
    scrollableContentOffsetY.setValue(0);
  }, [scrollableContentOffsetY]); // effects

  useFocusHook(handleSettingScrollable); //render

  return /*#__PURE__*/React.createElement(RNView, _extends({}, reset, {
    style: containerStyle
  }), children);
};

const BottomSheetView = /*#__PURE__*/memo(BottomSheetViewComponent, isEqual);
export default BottomSheetView;
//# sourceMappingURL=View.js.map