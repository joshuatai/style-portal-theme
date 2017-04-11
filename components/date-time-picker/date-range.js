var container = this;
var datepickerStartInput = $('#datepicker-start-input', container);
var datePickerStartContainer = $('#datepicker-start-container', container);
var datepickerEndInput = $('#datepicker-end-input', container);
var datePickerEndContainer = $('#datepicker-end-container', container);
var today = moment().format('YYYY-MM-DD');
var yestoday = moment().add(-1, 'd').format('YYYY-MM-DD');

$(container).children().css('z-index', 3);

datePickerStartContainer
	.data('date', yestoday)
	.datepicker({
		todayHighlight: true,
		autoclose: true,
		format: 'yyyy-mm-dd',
		keyboardNavigation: false
	})
	.on('changeDate changeMonth', function (e) {
		var selectedDate = moment($(this).data('date'));

		datepickerStartInput.val(selectedDate.format('YYYY-MM-DD'));

		if (selectedDate.isAfter(datePickerEndContainer.data('date'))) {
			datePickerEndContainer.datepicker('update', selectedDate.format('YYYY-MM-DD'));
		}
	});

datepickerStartInput
	.val(yestoday)
	.datepickerBehavior()
	.on('edit', function (e, date) {
		datepickerStartInput.addClass('input-focus');
		datePickerStartContainer.show();
	})
	.on('unedit next prev', function (e) {
		datepickerStartInput.removeClass('input-focus');
		datePickerStartContainer.hide();
	})
	.on('change', function (e, date) {
		datePickerStartContainer.datepicker('update', date);
	});

datePickerEndContainer
	.data('date', today)
	.datepicker({
		todayHighlight: true,
		autoclose: true,
		format: 'yyyy-mm-dd',
		keyboardNavigation: false
	})
	.on('changeDate changeMonth', function (e) {		 
		var selectedDate = moment($(this).data('date'));

		datepickerEndInput.val(selectedDate.format('YYYY-MM-DD'));

		if (selectedDate.isBefore(datePickerStartContainer.data('date'))) {
			datePickerStartContainer.datepicker('update', selectedDate.format('YYYY-MM-DD'));
		}
	});

datepickerEndInput
	.val(today)	
	.datepickerBehavior()
	.on('edit', function (e, date) {
		datepickerEndInput.addClass('input-focus');
		datePickerEndContainer.show();
	})
	.on('unedit next prev', function (e) {
		datepickerEndInput.removeClass('input-focus');
		datePickerEndContainer.hide();
	})
	.on('change', function (e, date) {
		datePickerEndContainer.datepicker('update', date);
	});
	

$(".prev", datePickerStartContainer).add($(".prev", datePickerEndContainer)).find("i").attr('class', 'fa fa-angle-left');
$(".next", datePickerStartContainer).add($(".next", datePickerEndContainer)).find("i").attr('class', 'fa fa-angle-right');