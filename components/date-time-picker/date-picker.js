var container = this;
var datepickerInput = $('#datepicker-input', container);
var datePickerContainer = $('.datepicker-container', container);

$(container).children().css('z-index', 2);



datePickerContainer
	.datepicker({
	  todayHighlight: true,
	  autoclose: true,
	  format: 'yyyy-mm-dd',
	  keyboardNavigation: false
	})
	.on('changeDate changeMonth', function (e) {
		datepickerInput.val(moment(e.date).format('YYYY-MM-DD'));
	});
	

$(".prev", datePickerContainer).find("i").attr('class', 'fa fa-angle-left');
$(".next", datePickerContainer).find("i").attr('class', 'fa fa-angle-right');

datepickerInput
	.val(moment().format('YYYY-MM-DD'))
	.datepickerBehavior()	
	.on('edit', function (e, date) {
		datepickerInput.addClass('input-focus');
		datePickerContainer.show();
	})
	.on('unedit', function (e) {
		datepickerInput.removeClass('input-focus');
		datePickerContainer.hide();
	})
	.on('change', function (e, date) {
		datePickerContainer.datepicker('update', date);
	});

/*{
		"picker": datePickerContainer
	}*/