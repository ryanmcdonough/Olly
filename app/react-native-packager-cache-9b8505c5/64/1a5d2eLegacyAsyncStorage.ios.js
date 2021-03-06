
'use strict';

var NativeModules = require('react-native').NativeModules;
var AsyncStorage = require('react-native').AsyncStorage;

var RCTAsyncStorage = NativeModules.ExponentLegacyAsyncLocalStorage;

var LegacyAsyncStorage = {
  _getRequests: [],
  _getKeys: [],
  _immediate: null,

  migrateItems: function migrateItems(items) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$force = _ref.force,
        force = _ref$force === undefined ? false : _ref$force;

    var oldValuesArray, newValuesArray, newValuesMap, valuesToSet;
    return regeneratorRuntime.async(function migrateItems$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = !force;

            if (!_context.t0) {
              _context.next = 5;
              break;
            }

            _context.next = 4;
            return regeneratorRuntime.awrap(RCTAsyncStorage.isMigrationDone());

          case 4:
            _context.t0 = _context.sent;

          case 5:
            if (!_context.t0) {
              _context.next = 7;
              break;
            }

            return _context.abrupt('return');

          case 7:
            _context.next = 9;
            return regeneratorRuntime.awrap(LegacyAsyncStorage.multiGet(items));

          case 9:
            oldValuesArray = _context.sent;
            _context.next = 12;
            return regeneratorRuntime.awrap(AsyncStorage.multiGet(items));

          case 12:
            newValuesArray = _context.sent;
            newValuesMap = {};

            newValuesArray.forEach(function (_ref2) {
              var _ref3 = babelHelpers.slicedToArray(_ref2, 2),
                  k = _ref3[0],
                  v = _ref3[1];

              return newValuesMap[k] = v;
            });
            valuesToSet = oldValuesArray.filter(function (_ref4) {
              var _ref5 = babelHelpers.slicedToArray(_ref4, 2),
                  k = _ref5[0],
                  v = _ref5[1];

              return v !== null && newValuesMap[k] == null;
            });
            _context.next = 18;
            return regeneratorRuntime.awrap(AsyncStorage.multiSet(valuesToSet));

          case 18:
            _context.next = 20;
            return regeneratorRuntime.awrap(RCTAsyncStorage.setMigrationDone());

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this);
  },

  getItem: function getItem(key, callback) {
    return new Promise(function (resolve, reject) {
      RCTAsyncStorage.multiGet([key], function (errors, result) {
        var value = result && result[0] && result[0][1] ? result[0][1] : null;
        var errs = convertErrors(errors);
        callback && callback(errs && errs[0], value);
        if (errs) {
          reject(errs[0]);
        } else {
          resolve(value);
        }
      });
    });
  },

  getAllKeys: function getAllKeys(callback) {
    return new Promise(function (resolve, reject) {
      RCTAsyncStorage.getAllKeys(function (error, keys) {
        callback && callback(convertError(error), keys);
        if (error) {
          reject(convertError(error));
        } else {
          resolve(keys);
        }
      });
    });
  },

  flushGetRequests: function flushGetRequests() {
    var getRequests = this._getRequests;
    var getKeys = this._getKeys;

    this._getRequests = [];
    this._getKeys = [];

    RCTAsyncStorage.multiGet(getKeys, function (errors, result) {
      var map = {};
      result && result.forEach(function (_ref6) {
        var _ref7 = babelHelpers.slicedToArray(_ref6, 2),
            key = _ref7[0],
            value = _ref7[1];

        map[key] = value;
        return value;
      });
      var reqLength = getRequests.length;
      for (var i = 0; i < reqLength; i++) {
        var request = getRequests[i];
        var requestKeys = request.keys;
        var requestResult = requestKeys.map(function (key) {
          return [key, map[key]];
        });
        request.callback && request.callback(null, requestResult);
        request.resolve && request.resolve(requestResult);
      }
    });
  },

  multiGet: function multiGet(keys, callback) {
    var _this = this;

    if (!this._immediate) {
      this._immediate = setImmediate(function () {
        _this._immediate = null;
        _this.flushGetRequests();
      });
    }

    var getRequest = {
      keys: keys,
      callback: callback,

      keyIndex: this._getKeys.length,
      resolve: null,
      reject: null
    };

    var promiseResult = new Promise(function (resolve, reject) {
      getRequest.resolve = resolve;
      getRequest.reject = reject;
    });

    this._getRequests.push(getRequest);

    keys.forEach(function (key) {
      if (_this._getKeys.indexOf(key) === -1) {
        _this._getKeys.push(key);
      }
    });

    return promiseResult;
  }
};

function convertErrors(errs) {
  if (!errs) {
    return null;
  }
  return (Array.isArray(errs) ? errs : [errs]).map(function (e) {
    return convertError(e);
  });
}

function convertError(error) {
  if (!error) {
    return null;
  }
  var out = new Error(error.message);
  out.key = error.key;
  return out;
}

module.exports = LegacyAsyncStorage;