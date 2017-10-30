var container = this;
var datePickerTimeInput = $('#datepicker-with-time', container);
var timePickerDate = $('#time-picker-date', container);
var format = 'YYYY-MM-DD';
var today = moment().format(format);
$(container).children().css('z-index', 2);

datePickerTimeInput.val(today).datepicker();
timePickerDate.timepicker();