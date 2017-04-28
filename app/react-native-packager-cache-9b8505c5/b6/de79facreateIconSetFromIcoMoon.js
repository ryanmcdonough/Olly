Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config, expoFontName, expoAssetId) {
  return (0, _createIconSetFromIcomoon2.default)(config, _expo.Font.style(expoFontName).fontFamily, expoAssetId);
};

var _expo = require('expo');

var _createIconSetFromIcomoon = require('react-native-vector-icons/lib/create-icon-set-from-icomoon');

var _createIconSetFromIcomoon2 = babelHelpers.interopRequireDefault(_createIconSetFromIcomoon);