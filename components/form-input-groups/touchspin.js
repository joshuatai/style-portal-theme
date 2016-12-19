$('[data-touchspin=touchspin]', this).mousedown(function(e) {
  e.stopPropagation();
  var contentObj_1 = document.getElementById("touchspin_1");
  var contentObj_2 = document.getElementById("touchspin_2");
  var value_1 = parseInt(contentObj_1.value);
  var value_2 = parseInt(contentObj_2.value);
  var button = $(this).find('span');

  if(button.hasClass("icon_angledown") || button.hasClass("icon_angleup")) {
    if(!$('.touchspin-example-1').hasClass("focused")) {
      $('.touchspin-example-1').addClass("focused");
    }
  }
  if(button.hasClass("icon-minus") || button.hasClass("icon-plus")) {
    if(!$('.touchspin-example-2').hasClass("focused")) {
      $('.touchspin-example-2').addClass("focused");
    }
  }
  if(button.hasClass("icon_angledown")) {
      contentObj_1.value--;
  } else if(button.hasClass("icon_angleup")){
      contentObj_1.value++;
  }
  if(button.hasClass("icon-minus")) {
      contentObj_2.value--;
  } else if(button.hasClass("icon-plus")){
      contentObj_2.value++;
  }
});

$('#touchspin_1').mousedown(function(e) {
  e.stopPropagation();
  if(!$('.touchspin-example-1').hasClass("focused")) {
    $('.touchspin-example-1').addClass("focused");
  }
  });
  $('#touchspin_2').mousedown(function(e) {
  e.stopPropagation();
  if(!$('.touchspin-example-2').hasClass("focused")) {
    $('.touchspin-example-2').addClass("focused");
  }
  });
  $('.wrapper').mousedown(function(e) {
  $('.touchspin-example-1.focused').removeClass("focused");
  $('.touchspin-example-2.focused').removeClass("focused");
});