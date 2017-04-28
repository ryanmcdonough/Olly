Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Recording = exports.Sound = exports.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = exports.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX = exports.INTERRUPTION_MODE_IOS_DUCK_OTHERS = exports.INTERRUPTION_MODE_IOS_DO_NOT_MIX = exports.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS = undefined;
exports.setIsEnabledAsync = setIsEnabledAsync;
exports.setAudioModeAsync = setAudioModeAsync;

var _reactNative = require('react-native');

var _Asset = require('./Asset');

var _Asset2 = babelHelpers.interopRequireDefault(_Asset);

var INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS = exports.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS = 0;
var INTERRUPTION_MODE_IOS_DO_NOT_MIX = exports.INTERRUPTION_MODE_IOS_DO_NOT_MIX = 1;
var INTERRUPTION_MODE_IOS_DUCK_OTHERS = exports.INTERRUPTION_MODE_IOS_DUCK_OTHERS = 2;

var INTERRUPTION_MODE_ANDROID_DO_NOT_MIX = exports.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX = 1;
var INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = exports.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = 2;

var _enabled = false;
var _recorderExists = false;
var _DISABLED_ERROR = new Error('Cannot complete operation because audio is not enabled.');
var _DEFAULT_POLLING_TIMEOUT_MILLIS = 500;

function setIsEnabledAsync(value) {
  return regeneratorRuntime.async(function setIsEnabledAsync$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _enabled = value;
          _context.next = 3;
          return regeneratorRuntime.awrap(_reactNative.NativeModules.ExponentAudio.setIsEnabled(value));

        case 3:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function setAudioModeAsync(mode) {
  return regeneratorRuntime.async(function setAudioModeAsync$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(!('allowsRecordingIOS' in mode) || !('interruptionModeIOS' in mode) || !('playsInSilentLockedModeIOS' in mode) || !('interruptionModeAndroid' in mode) || !('shouldDuckAndroid' in mode))) {
            _context2.next = 2;
            break;
          }

          throw new Error('Audio mode must contain keys "allowsRecordingIOS", "interruptionModeIOS", "playsInSilentLockedModeIOS", "interruptionModeAndroid", and "shouldDuckAndroid".');

        case 2:
          if (!(mode.interruptionModeIOS !== INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS && mode.interruptionModeIOS !== INTERRUPTION_MODE_IOS_DO_NOT_MIX && mode.interruptionModeIOS !== INTERRUPTION_MODE_IOS_DUCK_OTHERS)) {
            _context2.next = 4;
            break;
          }

          throw new Error('"interruptionModeIOS" must an integer between ' + INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS + ' and ' + INTERRUPTION_MODE_IOS_DUCK_OTHERS + '.');

        case 4:
          if (!(mode.interruptionModeAndroid !== INTERRUPTION_MODE_ANDROID_DO_NOT_MIX && mode.interruptionModeAndroid !== INTERRUPTION_MODE_ANDROID_DUCK_OTHERS)) {
            _context2.next = 6;
            break;
          }

          throw new Error('"interruptionModeAndroid" must an integer between ' + INTERRUPTION_MODE_ANDROID_DO_NOT_MIX + ' and ' + INTERRUPTION_MODE_ANDROID_DUCK_OTHERS + '.');

        case 6:
          if (!(typeof mode.allowsRecordingIOS !== 'boolean' || typeof mode.playsInSilentLockedModeIOS !== 'boolean' || typeof mode.shouldDuckAndroid !== 'boolean')) {
            _context2.next = 8;
            break;
          }

          throw new Error('"allowsRecordingIOS", "playsInSilentLockedModeIOS", and "shouldDuckAndroid" must be booleans.');

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(_reactNative.NativeModules.ExponentAudio.setAudioMode(mode));

        case 10:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

var StatusHandler = function () {
  function StatusHandler(_ref) {
    var _this = this;

    var areOperationsAllowed = _ref.areOperationsAllowed,
        getExtraStatusFieldsWhenOperationsAreAllowed = _ref.getExtraStatusFieldsWhenOperationsAreAllowed,
        operationsDisallowedError = _ref.operationsDisallowedError,
        getStatusAsync = _ref.getStatusAsync,
        shouldPollAfterStatus = _ref.shouldPollAfterStatus;
    babelHelpers.classCallCheck(this, StatusHandler);

    this._pollingLoop = function () {
      if (!_enabled || !_this.areOperationsAllowed() || _this.callback == null || !_this._shouldPoll) {
        return;
      }
      _this.getStatusAsync();
      _this._pollingTimeoutVariable = setTimeout(_this._pollingLoop, _this.pollingTimeoutMillis);
    };

    this.areOperationsAllowed = areOperationsAllowed;
    this.getExtraStatusFieldsWhenOperationsAreAllowed = getExtraStatusFieldsWhenOperationsAreAllowed;
    this.operationsDisallowedError = operationsDisallowedError;
    this.getStatusAsync = getStatusAsync;
    this.shouldPollAfterStatus = shouldPollAfterStatus;

    this.pollingTimeoutMillis = _DEFAULT_POLLING_TIMEOUT_MILLIS;
    this.callback = null;

    this._shouldPoll = false;
    this._pollingTimeoutVariable = null;
  }

  babelHelpers.createClass(StatusHandler, [{
    key: '_enablePollingIfNecessaryAndPossible',
    value: function _enablePollingIfNecessaryAndPossible() {
      if (_enabled && this.callback != null && this.areOperationsAllowed() && this._shouldPoll) {
        this._disablePolling();
        this._pollingLoop();
      }
    }
  }, {
    key: '_disablePolling',
    value: function _disablePolling() {
      if (this._pollingTimeoutVariable != null) {
        clearTimeout(this._pollingTimeoutVariable);
        this._pollingTimeoutVariable = null;
      }
    }
  }, {
    key: '_applyMissingFieldsToStatus',
    value: function _applyMissingFieldsToStatus(status) {
      if (this.areOperationsAllowed()) {
        var extraStatusFields = this.getExtraStatusFieldsWhenOperationsAreAllowed();
        for (var property in extraStatusFields) {
          if (extraStatusFields.hasOwnProperty(property) && status.hasOwnProperty(property)) {
            delete extraStatusFields[property];
          }
        }
        babelHelpers.extends(status, extraStatusFields);
      }
      return status;
    }
  }, {
    key: 'getFullStatusAndHandle',
    value: function getFullStatusAndHandle(status) {
      var statusWithAllFields = this._applyMissingFieldsToStatus(status);
      if (this.callback != null) {
        this.callback(statusWithAllFields);
      }
      var shouldPoll = this.shouldPollAfterStatus(statusWithAllFields);
      if (shouldPoll !== this._shouldPoll) {
        this._shouldPoll = shouldPoll;
        if (shouldPoll) {
          this._enablePollingIfNecessaryAndPossible();
        } else {
          this._disablePolling();
        }
      }
      return statusWithAllFields;
    }
  }, {
    key: 'performOperationAndHandleStatusAsync',
    value: function performOperationAndHandleStatusAsync(operation) {
      var _ref2, _status;

      return regeneratorRuntime.async(function performOperationAndHandleStatusAsync$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (_enabled) {
                _context3.next = 2;
                break;
              }

              throw _DISABLED_ERROR;

            case 2:
              if (!this.areOperationsAllowed()) {
                _context3.next = 10;
                break;
              }

              _context3.next = 5;
              return regeneratorRuntime.awrap(operation());

            case 5:
              _ref2 = _context3.sent;
              _status = _ref2.status;
              return _context3.abrupt('return', this.getFullStatusAndHandle(_status));

            case 10:
              throw this.operationsDisallowedError;

            case 11:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setCallback',
    value: function setCallback(callback) {
      this.callback = callback;
      if (callback == null) {
        this._disablePolling();
      } else {
        this._enablePollingIfNecessaryAndPossible();
      }
    }
  }, {
    key: 'setPollingTimeoutMillis',
    value: function setPollingTimeoutMillis(value) {
      this.pollingTimeoutMillis = value;
    }
  }]);
  return StatusHandler;
}();

var Sound = exports.Sound = function () {
  function Sound(_ref3) {
    var _this2 = this;

    var source = _ref3.source;
    babelHelpers.classCallCheck(this, Sound);

    this._playbackFinishedCallback = function (status) {
      status.didJustFinish = true;
      _this2._statusHandler.getFullStatusAndHandle(status);
      _this2._setPlaybackFinishedCallback();
    };

    this.getStatusAsync = function _callee() {
      var status;
      return regeneratorRuntime.async(function _callee$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!_this2._loaded) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt('return', _this2._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.getStatus(_this2._key);
              }));

            case 2:
              status = {
                isLoaded: false
              };
              return _context4.abrupt('return', _this2._statusHandler.getFullStatusAndHandle(status));

            case 4:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, _this2);
    };

    if (typeof source === 'number') {
      var asset = _Asset2.default.fromModule(source);
      this._uri = asset.localUri || asset.uri;
    } else if (typeof source === 'string') {
      this._uri = source;
    } else {
      this._uri = source.localUri || source.uri;
    }

    this._loaded = false;
    this._key = -1;
    this._durationMillis = 0;

    this._statusHandler = new StatusHandler({
      areOperationsAllowed: function areOperationsAllowed() {
        return _this2._loaded;
      },
      getExtraStatusFieldsWhenOperationsAreAllowed: function getExtraStatusFieldsWhenOperationsAreAllowed() {
        return {
          isLoaded: true,
          didJustFinish: false,
          durationMillis: _this2._durationMillis
        };
      },
      operationsDisallowedError: new Error('Cannot complete operation because sound is not loaded.'),
      getStatusAsync: this.getStatusAsync,
      shouldPollAfterStatus: function shouldPollAfterStatus(status) {
        return status.isLoaded;
      }
    });
  }

  babelHelpers.createClass(Sound, [{
    key: '_setPlaybackFinishedCallback',
    value: function _setPlaybackFinishedCallback() {
      if (this._loaded) {
        _reactNative.NativeModules.ExponentAudio.setPlaybackFinishedCallback(this._key, this._playbackFinishedCallback);
      }
    }
  }, {
    key: 'setCallback',
    value: function setCallback(callback) {
      this._statusHandler.setCallback(callback);
    }
  }, {
    key: 'setCallbackPollingMillis',
    value: function setCallbackPollingMillis(value) {
      this._statusHandler.setPollingTimeoutMillis(value);
    }
  }, {
    key: 'loadAsync',
    value: function loadAsync() {
      var _ref4, key, _durationMillis, _status2;

      return regeneratorRuntime.async(function loadAsync$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (_enabled) {
                _context5.next = 2;
                break;
              }

              throw _DISABLED_ERROR;

            case 2:
              if (this._loaded) {
                _context5.next = 16;
                break;
              }

              _context5.next = 5;
              return regeneratorRuntime.awrap(_reactNative.NativeModules.ExponentAudio.load(this._uri));

            case 5:
              _ref4 = _context5.sent;
              key = _ref4.key;
              _durationMillis = _ref4.durationMillis;
              _status2 = _ref4.status;

              this._key = key;
              this._durationMillis = _durationMillis;
              this._loaded = true;
              this._setPlaybackFinishedCallback();
              return _context5.abrupt('return', this._statusHandler.getFullStatusAndHandle(_status2));

            case 16:
              throw new Error('The Sound is already loaded.');

            case 17:
            case 'end':
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'unloadAsync',
    value: function unloadAsync() {
      return regeneratorRuntime.async(function unloadAsync$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!this._loaded) {
                _context6.next = 6;
                break;
              }

              this._loaded = false;
              this._durationMillis = 0;
              _context6.next = 5;
              return regeneratorRuntime.awrap(_reactNative.NativeModules.ExponentAudio.unload(this._key));

            case 5:
              this._key = -1;

            case 6:
              return _context6.abrupt('return', this.getStatusAsync());

            case 7:
            case 'end':
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'playAsync',
    value: function playAsync() {
      var _this3 = this;

      return regeneratorRuntime.async(function playAsync$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.play(_this3._key);
              }));

            case 1:
            case 'end':
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'pauseAsync',
    value: function pauseAsync() {
      var _this4 = this;

      return regeneratorRuntime.async(function pauseAsync$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              return _context8.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.pause(_this4._key);
              }));

            case 1:
            case 'end':
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'stopAsync',
    value: function stopAsync() {
      var _this5 = this;

      return regeneratorRuntime.async(function stopAsync$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.stop(_this5._key);
              }));

            case 1:
            case 'end':
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setPositionAsync',
    value: function setPositionAsync(millis) {
      var _this6 = this;

      return regeneratorRuntime.async(function setPositionAsync$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.setPosition(_this6._key, millis);
              }));

            case 1:
            case 'end':
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setRateAsync',
    value: function setRateAsync(value, shouldCorrectPitch) {
      var _this7 = this;

      return regeneratorRuntime.async(function setRateAsync$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              if (!(value < 0.0 || value > 32.0)) {
                _context11.next = 2;
                break;
              }

              throw new Error('Rate value must be between 0.0 and 32.0.');

            case 2:
              return _context11.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.setRate(_this7._key, value, shouldCorrectPitch);
              }));

            case 3:
            case 'end':
              return _context11.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setVolumeAsync',
    value: function setVolumeAsync(value) {
      var _this8 = this;

      return regeneratorRuntime.async(function setVolumeAsync$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              if (!(value < 0.0 || value > 1.0)) {
                _context12.next = 2;
                break;
              }

              throw new Error('Volume value must be between 0.0 and 1.0.');

            case 2:
              return _context12.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.setVolume(_this8._key, value);
              }));

            case 3:
            case 'end':
              return _context12.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setIsMutedAsync',
    value: function setIsMutedAsync(value) {
      var _this9 = this;

      return regeneratorRuntime.async(function setIsMutedAsync$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              return _context13.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.setIsMuted(_this9._key, value);
              }));

            case 1:
            case 'end':
              return _context13.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setIsLoopingAsync',
    value: function setIsLoopingAsync(value) {
      var _this10 = this;

      return regeneratorRuntime.async(function setIsLoopingAsync$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              return _context14.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.setIsLooping(_this10._key, value);
              }));

            case 1:
            case 'end':
              return _context14.stop();
          }
        }
      }, null, this);
    }
  }]);
  return Sound;
}();

var Recording = exports.Recording = function () {
  function Recording() {
    var _this11 = this;

    babelHelpers.classCallCheck(this, Recording);

    this.getStatusAsync = function _callee2() {
      var status;
      return regeneratorRuntime.async(function _callee2$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              if (!_this11._canRecord) {
                _context15.next = 2;
                break;
              }

              return _context15.abrupt('return', _this11._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.getRecordingStatus();
              }));

            case 2:
              status = _this11._isDoneRecording ? {
                canRecord: false,
                isDoneRecording: true,
                durationMillis: _this11._finalDurationMillis
              } : {
                canRecord: false,
                isDoneRecording: false
              };
              return _context15.abrupt('return', _this11._statusHandler.getFullStatusAndHandle(status));

            case 4:
            case 'end':
              return _context15.stop();
          }
        }
      }, null, _this11);
    };

    this._canRecord = false;
    this._isDoneRecording = false;
    this._finalDurationMillis = 0;
    this._uri = null;
    this._statusHandler = new StatusHandler({
      areOperationsAllowed: function areOperationsAllowed() {
        return _this11._canRecord;
      },
      getExtraStatusFieldsWhenOperationsAreAllowed: function getExtraStatusFieldsWhenOperationsAreAllowed() {
        return {
          canRecord: true
        };
      },
      operationsDisallowedError: new Error('Cannot complete operation because this recorder is not ready to record.'),
      getStatusAsync: this.getStatusAsync,
      shouldPollAfterStatus: function shouldPollAfterStatus(status) {
        return status.canRecord;
      }
    });
  }

  babelHelpers.createClass(Recording, [{
    key: 'setCallback',
    value: function setCallback(callback) {
      this._statusHandler.setCallback(callback);
    }
  }, {
    key: 'setCallbackPollingMillis',
    value: function setCallbackPollingMillis(value) {
      this._statusHandler.setPollingTimeoutMillis(value);
    }
  }, {
    key: 'prepareToRecordAsync',
    value: function prepareToRecordAsync() {
      var _ref5, uri, _status3;

      return regeneratorRuntime.async(function prepareToRecordAsync$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              if (_enabled) {
                _context16.next = 2;
                break;
              }

              throw _DISABLED_ERROR;

            case 2:
              if (!_recorderExists) {
                _context16.next = 4;
                break;
              }

              throw new Error('Only one Recording object can be prepared at a given time.');

            case 4:
              if (!this._isDoneRecording) {
                _context16.next = 6;
                break;
              }

              throw new Error('This Recording object is done recording; you must make a new one.');

            case 6:
              if (this._canRecord) {
                _context16.next = 18;
                break;
              }

              _context16.next = 9;
              return regeneratorRuntime.awrap(_reactNative.NativeModules.ExponentAudio.prepareToRecord());

            case 9:
              _ref5 = _context16.sent;
              uri = _ref5.uri;
              _status3 = _ref5.status;

              _recorderExists = true;
              this._uri = uri;
              this._canRecord = true;
              return _context16.abrupt('return', this._statusHandler.getFullStatusAndHandle(_status3));

            case 18:
              throw new Error('This Recording object is already prepared to record.');

            case 19:
            case 'end':
              return _context16.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'startAsync',
    value: function startAsync() {
      return regeneratorRuntime.async(function startAsync$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              return _context17.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.startRecording();
              }));

            case 1:
            case 'end':
              return _context17.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'pauseAsync',
    value: function pauseAsync() {
      return regeneratorRuntime.async(function pauseAsync$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              return _context18.abrupt('return', this._statusHandler.performOperationAndHandleStatusAsync(function () {
                return _reactNative.NativeModules.ExponentAudio.pauseRecording();
              }));

            case 1:
            case 'end':
              return _context18.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'stopAndUnloadAsync',
    value: function stopAndUnloadAsync() {
      var stopStatus;
      return regeneratorRuntime.async(function stopAndUnloadAsync$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              if (this._canRecord) {
                _context19.next = 2;
                break;
              }

              throw new Error('Cannot unload a Recording that has not been prepared.');

            case 2:
              _context19.next = 4;
              return regeneratorRuntime.awrap(_reactNative.NativeModules.ExponentAudio.stopRecording());

            case 4:
              stopStatus = _context19.sent;

              this._finalDurationMillis = stopStatus.durationMillis;

              _context19.next = 8;
              return regeneratorRuntime.awrap(_reactNative.NativeModules.ExponentAudio.unloadRecorder());

            case 8:
              this._canRecord = false;
              this._isDoneRecording = true;
              _recorderExists = false;
              return _context19.abrupt('return', this.getStatusAsync());

            case 12:
            case 'end':
              return _context19.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this._uri;
    }
  }, {
    key: 'getNewSound',
    value: function getNewSound() {
      return this._uri === null || !this._isDoneRecording ? null : new Sound({ source: this._uri });
    }
  }]);
  return Recording;
}();