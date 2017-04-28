
'use strict';

var _class,
    _temp,
    _jsxFileName = '/Users/ryan/Olly/app/node_modules/react-native/Libraries/CustomComponents/Lists/SectionList.js';

var MetroListView = require('MetroListView');
var React = require('React');
var VirtualizedSectionList = require('VirtualizedSectionList');

var SectionList = (_temp = _class = function (_React$PureComponent) {
  babelHelpers.inherits(SectionList, _React$PureComponent);

  function SectionList() {
    babelHelpers.classCallCheck(this, SectionList);
    return babelHelpers.possibleConstructorReturn(this, (SectionList.__proto__ || Object.getPrototypeOf(SectionList)).apply(this, arguments));
  }

  babelHelpers.createClass(SectionList, [{
    key: 'render',
    value: function render() {
      var List = this.props.legacyImplementation ? MetroListView : VirtualizedSectionList;
      return React.createElement(List, babelHelpers.extends({}, this.props, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 187
        }
      }));
    }
  }]);
  return SectionList;
}(React.PureComponent), _class.defaultProps = VirtualizedSectionList.defaultProps, _temp);


module.exports = SectionList;