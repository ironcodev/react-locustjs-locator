"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _locustjsLocator = _interopRequireDefault(require("locustjs-locator"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Render = function Render(props) {
  if (props) {
    var keys = Object.keys(props);

    if (keys.length) {
      var Component = props[keys[0]];
      var _props = {};

      for (var i = 1; i < keys.length; i++) {
        var key = keys[i];
        _props[key] = props[key];
      }

      if (Component.dependencies) {
        for (var _i = 0, _Object$keys = Object.keys(Component.dependencies); _i < _Object$keys.length; _i++) {
          var dependency = _Object$keys[_i];

          var resolved = _locustjsLocator.default.Instance.resolve(Component.dependencies[dependency]);

          _props[dependency] = resolved;
        }
      }

      return /*#__PURE__*/_react.default.createElement(Component, _props);
    }
  }

  return null;
};

var _default = Render;
exports.default = _default;