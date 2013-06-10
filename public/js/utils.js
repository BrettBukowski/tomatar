define(function (app) {
  var exports = {};

  function isArray (obj) {
    return Array.isArray
      ? Array.isArray(obj)
      : Object.prototype.toString.call(obj).indexOf('Array') > -1;
  }

  function indexOf (list, value) {
    for (var i = 0, len = list.length; i < len; i++) {
      if (list[i] == value) return i;
    }

    return -1;
  }

  // Allows for adding new settings keys in future versions
  // that will get auto-merged in on the client.
  exports.mergeDefaults = function (receiver, provider) {
    for (var i in provider) {
      if (!provider.hasOwnProperty(i)) continue;
      if (provider[i] && typeof provider[i] === 'object' && !isArray(provider[i])) {
        receiver[i] = exports.mergeDefaults(receiver[i] || {}, provider[i]);
      }
      else if (!(i in receiver)) {
        receiver[i] = provider[i];
      }
    }

    return receiver;
  };

  // Omits elements in the given object
  // whose keys match any of the variable
  // number of given keys
  exports.omit = function (obj) {
    var toOmit = Array.prototype.slice.call(arguments, 1),
        result = {}, i;

    for (i in obj) {
      if (obj.hasOwnProperty(i) && indexOf(toOmit, i) < 0) {
        result[i] = obj[i];
      }
    }

    return result;
  };

  return exports;
});