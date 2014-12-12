$(function () {

  if ($('.js-panbox').length > 0) {
    var panBox = new PanBox($('.js-panbox')[0]);
  }

  if ($('.js-switch').length > 0) {
    var switchEl = new Switch($('.js-switch')[0]);
  }

});
