;(function ($) {
  var $timepicker = $("#timepicker-input");
  $timepicker.timepicker({
    value: "12:45:20",
    format: 'hh:mm:ss'
  })
  .on('change', function (event, value) {
    console.log(event, value);
  });
  $timepicker.timepicker('setValue', '07:48:16');
  console.log($timepicker.timepicker('getValue'));
  // $("#timepicker-input").timepicker('destroy');
})(jQuery);