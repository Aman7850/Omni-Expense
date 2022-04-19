function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

export class BottomSheetFlatListType extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "scrollToEnd", void 0);

    _defineProperty(this, "scrollToIndex", void 0);

    _defineProperty(this, "scrollToItem", void 0);

    _defineProperty(this, "scrollToOffset", void 0);

    _defineProperty(this, "recordInteraction", void 0);

    _defineProperty(this, "flashScrollIndicators", void 0);

    _defineProperty(this, "getScrollResponder", void 0);

    _defineProperty(this, "getNativeScrollRef", void 0);

    _defineProperty(this, "getScrollableNode", void 0);

    _defineProperty(this, "setNativeProps", void 0);
  }

}
//# sourceMappingURL=types.d.js.map