var container = this;
var datePickerTimeInput = $('#datepicker-with-time', container);
var datePickerTimeContainer = $('#datepicker-with-time-container', container);
var timePickerDate = $('#time-picker-date', container);


var today = moment().format('YYYY-MM-DD');

$(container).children().css('z-index', 2);

datePickerTimeInput
	.val(today)	
	.datepickerBehavior()
	.on('edit', function (e, date) {
		datePickerTimeInput.addClass('input-focus');
		datePickerTimeContainer.show();
	})
	.on('unedit', function (e) {
		datePickerTimeInput.removeClass('input-focus');
		datePickerTimeContainer.hide();
	})
	.on('change', function (e, date) {
		datePickerTimeContainer.datepicker('update', date);
	})
	.on('next', function (e, date) {
		
		timePickerDate
			.trigger('focus')
			.timepickerBehavior('showField', 'H')
			.trigger('click');
		
	});


datePickerTimeContainer
	.data('date', today)
	.datepicker({
		todayHighlight: true,
		autoclose: true,
		format: 'yyyy-mm-dd',
		keyboardNavigation: false
	})
	.on('changeDate changeMonth', function (e) {
		datePickerTimeInput.val(moment(e.date).format('YYYY-MM-DD'));
	});


timePickerDate
	.timepickerBehavior()
	.on('prev', function (e, time) {
		
		datePickerTimeInput
			.trigger('focus')
			.datepickerBehavior('showField', 'Y')
			.trigger('click');
		
	});

$(".prev", datePickerTimeContainer).find("i").attr('class', 'fa fa-angle-left');
$(".next", datePickerTimeContainer).find("i").attr('class', 'fa fa-angle-right');