var touchspinVertical = $('.touchspin.vertical');
var touchspinHorizontal = $('.touchspin.horizontal');
var touchspinVerInput = touchspinVertical.find('input');
var touchspinHorInput = touchspinHorizontal.find('input');

$('[data-touchspin=vertical]', this).mousedown(function(e) {
  var button = $(this).find('span');
  if(button.hasClass("icon_angledown")) {
    touchspinVerInput.val(parseInt(touchspinVerInput.val()) - 1);
  } 
  if(button.hasClass("icon_angleup")){
    touchspinVerInput.val(parseInt(touchspinVerInput.val()) + 1);
  }
});

$('[data-touchspin=horizontal]', this).mousedown(function(e) {
  var button = $(this).find('span');
  if(button.hasClass("icon-minus")) {
    touchspinHorInput.val(parseInt(touchspinHorInput.val()) - 1);
  } 
  if(button.hasClass("icon-plus")){
    touchspinHorInput.val(parseInt(touchspinHorInput.val()) + 1);
  }
});

$(document).mousedown(function(e) {
  touchspinVertical.removeClass('focused');
  touchspinHorizontal.removeClass('focused');
  if(e.target.closest('.touchspin.vertical')){
    touchspinVertical.addClass('focused');
  }
  if(e.target.closest('.touchspin.horizontal')){
    touchspinHorizontal.addClass('focused');
  }
});