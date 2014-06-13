/* jshint white: false, latedef: nofunc, browser: true, devel: true */
'use strict';

module.exports = {
  /*
    Returns a function that will toggle the state of 
    `ui.panels.<panelId>.isOpen` each time it's executed
  */
  createPanelToggleHandler: function createPanelToggleHandler(panelId) {
    var keypath = 'ui.panels.' + panelId + '.isOpen';
    return function (/* evt */) {
      var isOpen = this.get(keypath);
      this.set(keypath, !isOpen);
    };
  },
  debounce: function debounce(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  },
  throttle: function throttle(fn, threshhold, scope) {
    threshhold = threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date(),
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }
};
