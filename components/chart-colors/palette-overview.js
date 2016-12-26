
$('.chart-color', this).each(function () {
  var color = $(this).data('color');

  $('.chart-color-sqaure', this).css({ background: color });
  $('.chart-color-hex', this).text(color);
});