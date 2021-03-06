'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class,
    _temp,
    _jsxFileName = '/Users/ryan/Olly/app/node_modules/expo/src/BlurView.ios.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _deprecatedPropType = require('react-native/Libraries/Utilities/deprecatedPropType');

var _deprecatedPropType2 = babelHelpers.interopRequireDefault(_deprecatedPropType);

var BlurView = (_temp = _class = function (_Component) {
  babelHelpers.inherits(BlurView, _Component);

  function BlurView() {
    babelHelpers.classCallCheck(this, BlurView);
    return babelHelpers.possibleConstructorReturn(this, (BlurView.__proto__ || Object.getPrototypeOf(BlurView)).apply(this, arguments));
  }

  babelHelpers.createClass(BlurView, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          nativeProps = babelHelpers.objectWithoutProperties(_props, ['style']);


      if (nativeProps.tintEffect) {
        nativeProps.tint = nativeProps.tintEffect;
        delete nativeProps.tintEffect;
      }

      return _react2.default.createElement(NativeBlurView, babelHelpers.extends({}, nativeProps, {
        style: [this.props.style, { backgroundColor: 'transparent' }],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 35
        }
      }));
    }
  }]);
  return BlurView;
}(_react.Component), _class.propTypes = babelHelpers.extends({
  tintEffect: (0, _deprecatedPropType2.default)(_react.PropTypes.string, 'Use the `tint` prop instead.'),
  tint: _react.PropTypes.oneOf(['light', 'default', 'dark']).isRequired,
  intensity: _react.PropTypes.number.isRequired
}, _reactNative.View.propTypes), _class.defaultProps = {
  tint: 'default',
  intensity: 50
}, _temp);
exports.default = BlurView;


var NativeBlurView = (0, _reactNative.requireNativeComponent)('ExponentBlurView', null);