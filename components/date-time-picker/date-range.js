var container = this;
var format = 'YYYY-MM-DD';
var datepickerStartInput = $('#datepicker-start-input', container);
var datePickerStartContainer;
var datepickerEndInput = $('#datepicker-end-input', container);
var datePickerEndContainer;

return;
var today = moment().format(format);
var yestoday = moment().add(-1, 'd').format(format);

$(container).children().css('z-index', 3);

datepickerStartInput
	.val(yestoday)
	.datepicker();

datePickerStartContainer = datepickerStartInput.parent().find('[data-role="datepicker"]')	
	.on('changeDate changeMonth', function (e) {
		var selectedDate = moment($(this).data('date'));
		if (selectedDate.isAfter(datePickerEndContainer.data('date'))) {
			datePickerEndContainer._datepicker('update', selectedDate.format(format));
		}
	});
datepickerEndInput
	.val(today)	
	.datepicker();

datePickerEndContainer = datepickerEndInput.parent().find('[data-role="datepicker"]')
	.on('changeDate changeMonth', function (e) {		 
		var selectedDate = moment($(this).data('date'));
		if (selectedDate.isBefore(datePickerStartContainer.data('date'))) {
			datePickerStartContainer._datepicker('update', selectedDate.format(format));
		}
	});