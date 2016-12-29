var modalXs = $('[data-template="modal-xs"]');
  
var modalSm = $('[data-template="modal-sm"]');

var modalMd = $('[data-template="modal-md"]');
  
var modalLg = $('[data-template="modal-lg"]');
  

$('#demo-xs-button').on('click', function (e){
      $("body").find("#modal-xs").remove("#modal-xs");
      $("body").append(modalXs.clone().attr("id", "modal-xs"));
});
$('#demo-sm-button').on('click', function (e){
      $("body").find("#modal-sm").remove("#modal-sm");
      $("body").append(modalSm.clone().attr("id", "modal-sm"));
});
$('#demo-md-button').on('click', function (e){
      $("body").find("#modal-md").remove("#modal-md");
      $("body").append(modalMd.clone().attr("id", "modal-md"));
});
$('#demo-lg-button').on('click', function (e){
      $("body").find("#modal-lg").remove("#modal-lg");
      $("body").append(modalLg.clone().attr("id", "modal-lg"));
});
//use this to remove modal dialog paddingRight
$(document)
  .on('show.bs.modal', '.modal', function (e) {
    var pro = $(this).data("bs.modal").__proto__;
    pro.adjustDialog = function () {}
  });


var $window = $(window).on('resize', function () {
  var styleTag = $('[data-modal-size="adjust"]');
  var head = $('head');

  if (styleTag.length === 1) styleTag.remove();
  styleTag = $(
    '<style data-modal-size="adjust">\n' +
        '.modal-lg .modal-body, .modal-md .modal-body { max-height: calc(' + ($(window).height() * 0.8) + 'px - 110px); }' + 
    '</style>').appendTo(head);
});

$window.trigger('resize');