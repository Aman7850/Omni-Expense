"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScrollable = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _reactNativeRedash = require("react-native-redash");

const useScrollable = () => {
  // refs
  const scrollableRef = (0, _react.useRef)(null);
  const previousScrollableRef = (0, _react.useRef)(null); // variables

  const scrollableContentOffsetY = (0, _reactNativeRedash.useValue)(0); // callbacks

  const setScrollableRef = (0, _react.useCallback)(ref => {
    var _scrollableRef$curren, _scrollableRef$curren2;

    // get current node handle id
    let currentRefId = (_scrollableRef$curren = (_scrollableRef$curren2 = scrollableRef.current) === null || _scrollableRef$curren2 === void 0 ? void 0 : _scrollableRef$curren2.id) !== null && _scrollableRef$curren !== void 0 ? _scrollableRef$curren : null;

    if (currentRefId !== ref.id) {
      if (scrollableRef.current) {
        // @ts-ignore
        previousScrollableRef.current = scrollableRef.current;
      } // @ts-ignore


      scrollableRef.current = ref;
    }
  }, []);
  const removeScrollableRef = (0, _react.useCallback)(ref => {
    var _scrollableRef$curren3, _scrollableRef$curren4;

    // find node handle id
    let id = (0, _reactNative.findNodeHandle)(ref.current); // get current node handle id

    let currentRefId = (_scrollableRef$curren3 = (_scrollableRef$curren4 = scrollableRef.current) === null || _scrollableRef$curren4 === void 0 ? void 0 : _scrollableRef$curren4.id) !== null && _scrollableRef$curren3 !== void 0 ? _scrollableRef$curren3 : null;
    /**
     * @DEV
     * when the incoming node is actually the current node, we reset
     * the current scrollable ref to the previous one.
     */

    if (id === currentRefId) {
      // @ts-ignore
      scrollableRef.current = previousScrollableRef.current;
    }
  }, []);
  const scrollToTop = (0, _react.useCallback)(() => {
    var _scrollableRef$curren5, _scrollableRef$curren6, _scrollableRef$curren7, _scrollableRef$curren8;

    let type = (_scrollableRef$curren5 = (_scrollableRef$curren6 = scrollableRef.current) === null || _scrollableRef$curren6 === void 0 ? void 0 : _scrollableRef$curren6.type) !== null && _scrollableRef$curren5 !== void 0 ? _scrollableRef$curren5 : undefined;
    let node = (_scrollableRef$curren7 = (_scrollableRef$curren8 = scrollableRef.current) === null || _scrollableRef$curren8 === void 0 ? void 0 : _scrollableRef$curren8.node) !== null && _scrollableRef$curren7 !== void 0 ? _scrollableRef$curren7 : undefined;

    if (!type || !node) {
      return;
    }

    switch (type) {
      case 'FlatList':
        node.scrollToOffset({
          animated: false,
          offset: 0
        });
        break;

      case 'ScrollView':
        node.scrollTo({
          y: 0,
          animated: false
        });
        break;

      case 'SectionList':
        if (node.props.sections.length === 0) {
          return;
        }

        node.scrollToLocation({
          itemIndex: 0,
          sectionIndex: 0,
          viewPosition: 0,
          viewOffset: 1000,
          animated: false
        });
        break;
    }
  }, []);
  const flashScrollableIndicators = (0, _react.useCallback)(() => {
    var _scrollableRef$curren9, _scrollableRef$curren10, _scrollableRef$curren11, _scrollableRef$curren12;

    let type = (_scrollableRef$curren9 = (_scrollableRef$curren10 = scrollableRef.current) === null || _scrollableRef$curren10 === void 0 ? void 0 : _scrollableRef$curren10.type) !== null && _scrollableRef$curren9 !== void 0 ? _scrollableRef$curren9 : undefined;
    let node = (_scrollableRef$curren11 = (_scrollableRef$curren12 = scrollableRef.current) === null || _scrollableRef$curren12 === void 0 ? void 0 : _scrollableRef$curren12.node) !== null && _scrollableRef$curren11 !== void 0 ? _scrollableRef$curren11 : undefined;

    if (!type || !node) {
      return;
    } // @ts-ignore


    if (node.flashScrollIndicators) {
      // @ts-ignore
      node.flashScrollIndicators();
    }
  }, []);
  return {
    scrollableRef,
    scrollableContentOffsetY,
    setScrollableRef,
    removeScrollableRef,
    scrollToTop,
    flashScrollableIndicators
  };
};

exports.useScrollable = useScrollable;
//# sourceMappingURL=useScrollable.js.map