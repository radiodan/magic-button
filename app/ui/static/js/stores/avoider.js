var Logger = require('js-logger'),
    extend = require('underscore').extend,
    clone = require('underscore').clone,
    EventEmitter  = require('events').EventEmitter,
    AppDispatcher = require('../dispatcher/dispatcher'),
    Payload       = require('../constants/constants').Payload,
    ActionTypes   = require('../constants/constants').ActionTypes,
    ServicesStore = require('../stores/services');

var state = {};

function set(data) {
  state = clone(data);
  if (data.start) { state.start = new Date(data.start); }
  if (data.end)   { state.end   = new Date(data.end);   }
}

var Store = extend(new EventEmitter(), {
  getState: function () {
    return clone(state);
  },
  emitChange: function () {
    this.emit('change');
  },
  addChangeListener: function (callback) {
    this.on('change', callback);
  }
});

Store.dispatchToken = AppDispatcher.register(function (payload) {
  var source = payload.source,
      action = payload.action;

  switch(action.type) {
    case ActionTypes.RECEIVE_INITIAL_STATE:
      Logger.debug('Avoider: ', action.type, action.state);
      set(action.state.avoider);
      Store.emitChange();
      break;
    case ActionTypes.AVOIDER:
      Logger.debug('Avoider: ', action.type, action.state);
      if (source === Payload.SERVER_ACTION) {
        Logger.debug('Avoider: SERVER', action.type, action.state);
        set(action.state.data);
        Store.emitChange();
      } else {
        Logger.debug('Avoider: VIEW ACTION pre', state.isAvoiding);
        state.isAvoiding = !state.isAvoiding;
        Logger.debug('Avoider: VIEW ACTION post', state.isAvoiding);
        Store.emitChange();
      }
      break;
    case ActionTypes.RECEIVE_AVOIDER_SETTINGS:
      Logger.debug('Avoider Settings: ', action.type, action.state);
      if (source === Payload.SERVER_ACTION) {
        Logger.debug('Avoider: SERVER', action.type, action.state);
        state.settings = clone(action.state);
        Store.emitChange();
      }
      break;
    case ActionTypes.SETTINGS:
      if (source === Payload.SERVER_ACTION && action.state.topic === 'settings.avoider') {
        Logger.debug('Avoider: SERVER', action.type, action.state);
        state.settings = clone(action.state.data);
        Store.emitChange();
      }
      break;
  }
});

module.exports = Store;