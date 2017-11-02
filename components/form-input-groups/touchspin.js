var touchspinVertical = $('.touchspin.vertical');
var touchspinHorizontal = $('.touchspin.horizontal');
var touchspinVerInput = touchspinVertical.find('input');
var touchspinHorInput = touchspinHorizontal.find('input');

$('[data-touchspin=vertical]', this).mousedown(function(e) {
  e.stopPropagation();
  var button = $(this).find('span');
  removeFocus(touchspinHorizontal)
  addFocus(touchspinVertical);
  if(button.hasClass("icon_angledown")) {
    touchspinVerInput.val(parseInt(touchspinVerInput.val()) - 1);
  } 
  if(button.hasClass("icon_angleup")){
    touchspinVerInput.val(parseInt(touchspinVerInput.val()) + 1);
  }
});

$('[data-touchspin=horizontal]', this).mousedown(function(e) {
  e.stopPropagation();
  var button = $(this).find('span');
  removeFocus(touchspinVertical);
  addFocus(touchspinHorizontal);
  if(button.hasClass("icon-minus")) {
    touchspinHorInput.val(parseInt(touchspinHorInput.val()) - 1);
  } 
  if(button.hasClass("icon-plus")){
    touchspinHorInput.val(parseInt(touchspinHorInput.val()) + 1);
  }
});

touchspinVerInput.mousedown(function(e) {
  e.stopPropagation();
  removeFocus(touchspinHorizontal);
  addFocus(touchspinVertical);
});

touchspinHorInput.mousedown(function(e) {
  e.stopPropagation();
  removeFocus(touchspinVertical);
  addFocus(touchspinHorizontal);
});

$(document).mousedown(function(e) {
  removeFocus('clearAll');
});

function addFocus(element) {
  if(!element.hasClass('focused')) {
    element.addClass('focused');
  }
}

function removeFocus(element) {
  if(element === 'clearAll') {
    touchspinVertical.removeClass('focused');
    touchspinHorizontal.removeClass('focused');
  } else {
    element.removeClass('focused');
  }
}