function PanBox(element) {

  var self = this;

  self._element = element;
  self._offsetX = 0;
  self._offsetY = 0;

  function init() {
    self._initTouch();
    self._bindEvents();
  }

  init();
}

PanBox.prototype = {

  _initTouch: function()  {
    this._touchManager = new Hammer.Manager(this._element, {
      recognizers: [[ Hammer.Pan ]]
    });
  },

  _bindEvents: function() {
    var self = this;
    self._touchManager.on('panmove panend', function(e) {
      var newPositions = self._setPosition(e.deltaX, e.deltaY);
      if (e.isFinal) {
        self._storePosition(newPositions[0], newPositions[1]);
      }
    });
  },

  _setPosition: function(left, top, isFinal) {
    var newOffsetX = this._offsetX + left;
    var newOffsetY = this._offsetY + top;
    var transformProp = 'translateX(' + newOffsetX + 'px) ' +
                        'translateY(' + newOffsetY  + 'px)';
    $(this._element).css('transform', transformProp);

    return [newOffsetX, newOffsetY];
  },

  _storePosition: function(newOffsetX, newOffsetY) {
    this._offsetX = newOffsetX;
    this._offsetY = newOffsetY;
  }
};
