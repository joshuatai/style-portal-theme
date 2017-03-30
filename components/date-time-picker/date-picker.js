var container = this;
var datepickerInput = $('#datepicker-input', container);
var datePickerContainer = $('.datepicker-container', container);

$(container).children().css('z-index', 2);



datePickerContainer.datepicker({
  todayHighlight: true,
  autoclose: true,
  format: 'yyyy-mm-dd',
  keyboardNavigation: false
})

datepickerInput
	.val(moment().format('YYYY-MM-DD'))
	.datepickerBehavior({
		"picker": datePickerContainer
	});

