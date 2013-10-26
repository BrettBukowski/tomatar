define(function () {
  var exports = {};

  function isArray (obj) {
    return Array.isArray
      ? Array.isArray(obj)
      : Object.prototype.toString.call(obj).indexOf('Array') > -1;
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

  return exports;
});
