function Switch(container) {

  var self = this;

  self._container = container;
  self._handle = $(container).find('.switch__handle')[0];
  self._handlePosition = 0;
  self._state = 0;
  self._movingClass = 'switch__handle--moving';

  function init() {
    self._scanDimensions();
    self._initTouch();
    self._bindEvents();
  }

  init();
}

Switch.prototype = {

  _scanDimensions: function() {
    this._containerWidth = $(this._container).width();
    this._handleWidth = $(this._handle).outerWidth(true);
    this._maxHandlePosition = this._containerWidth - this._handleWidth;
    this._halfHandlePosition = this._maxHandlePosition / 2;
  },

  _initTouch: function() {
    this._touchManager = new Hammer.Manager(this._handle, {
      recognizers: [
        [ Hammer.Pan,   { direction: Hammer.DIRECTION_HORIZONTAL } ],
      ]
    });
  },

  _bindEvents: function() {
    var self = this;
    self._touchManager.on('panmove panend', function(event) {
      self._move(event);
    });

    self._touchManager.on('panstart', function(event) {
      $(self._handle).addClass(self._movingClass);
    });

    self._touchManager.on('panend', function(event) {
      $(self._handle).removeClass(self._movingClass);
    });
  },

  _move: function(event) {
    var newOffset = this._calcOffset(event.deltaX);
    this._setPosition(newOffset);
    if (event.isFinal) {
      this._finaliseMove(newOffset, event.velocityX);
    }
  },

  _finaliseMove: function(newOffset, velocityX) {
    var threshold = 0.2;
    if (Math.abs(velocityX) > threshold) {
      newOffset = velocityX < -threshold ? this._maxHandlePosition : 0;
    }
    this._setState(newOffset);
    var finalPosition = this._state * this._maxHandlePosition;
    this._setPosition(finalPosition);
    this._storePosition(finalPosition);
  },

  _calcOffset: function(offset) {
    var newOffset = this._handlePosition + offset;
    if (newOffset < 0) {
      return 0;
    } else if (newOffset > this._maxHandlePosition) {
      return this._maxHandlePosition
    } else {
      return newOffset;
    }
  },

  _setPosition: function(position) {
    var transformProp = 'translateX(' + position + 'px)';
    $(this._handle).css('transform', transformProp);
  },

  _storePosition: function(position) {
    this._handlePosition = position;
  },

  _whatState: function(position) {
    return position > this._halfHandlePosition ? 1 : 0;
  },

  _setState: function(position) {
    this._state = this._whatState(position);
  }

};
