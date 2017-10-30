var container = this;

var dateStartInput = $('#pane-date-start-input', container);
var dateEndInput = $('#pane-date-end-input', container);

var datePickerPaneStart = $('#date-pane-date-start', container);
var datePickerPaneEnd = $('#date-pane-date-end', container);

var timePickerStartInput = $('#pane-time-start-input', container);
var timePickerEndInput = $('#pane-time-end-input', container);

var datePickerPaneBody = $('.date-picker-pane-body', container);
var dateTimeRangeDropdown = $('#date-time-range-dropdown', container);
var datePickerPane = $('.date-picker-pane');
var datePickerPaneButtons = $('.date-picker-pane-footer .btn');

var today = moment().format('YYYY-MM-DD');
var lastweek = moment().add(-7, 'd').format('YYYY-MM-DD');

// function isStartTimeGreaterThanEndTime () {
// 	var startDate = datePickerPaneStart.data('date');
// 	var endDate = datePickerPaneEnd.data('date');	
// 	var timeStart = timePickerStartInput.val();
// 	var timeEnd = timePickerEndInput.val();
// 	if (moment(`${startDate} ${timeStart}`).isAfter(moment(`${endDate} ${timeEnd}`))) return true;

// 	return false;
// }

dateStartInput
	.val(lastweek)
	.datepicker({
		isInline: true,
		container: datePickerPaneBody
	});


dateEndInput
	.val(today)
	.datepicker({
		isInline: true,
		container: datePickerPaneBody
	});

var startDatePicker = dateStartInput.parent().find('[data-role="datepicker"]');
var endDatePicker = dateEndInput.parent().find('[data-role="datepicker"]');

datePickerPaneBody.children().addClass('date-picker-pane-container');

// datePickerPaneBody.append(
// 	startDatePicker.removeClass('dropdown-menu').addClass('date-picker-pane-container'),
// 	endDatePicker.removeClass('dropdown-menu').addClass('date-picker-pane-container')
// );
// $(document).on('click', function () {
// 	startDatePicker.add(endDatePicker).show();
// });

// datePickerPaneStart
// 	.data('date', lastweek)
// 	._datepicker({
// 		todayHighlight: true,
// 		autoclose: true,
// 		format: 'yyyy-mm-dd',
// 		keyboardNavigation: false
// 	})
// 	.on('changeDate changeMonth', function(e) {		
// 		var selectedDate = moment($(this).data('date'));		
// 		var endDate = datePickerPaneEnd.data('date');
// 		dateStartInput.val(selectedDate.format('YYYY-MM-DD'));
// 		if (selectedDate.isAfter(endDate) || selectedDate.isSame(endDate)) {			
// 			datePickerPaneEnd.datepicker('update', selectedDate.format('YYYY-MM-DD'));
// 			if (isStartTimeGreaterThanEndTime()) {
// 				timePickerEndInput.val(timePickerStartInput.val());				
// 			}
// 		}		
// 	});

// datePickerPaneEnd
// 	.data('date', today)
// 	.datepicker({
// 		todayHighlight: true,
// 		autoclose: true,
// 		format: 'yyyy-mm-dd',
// 		keyboardNavigation: false
// 	})
// 	.on('changeDate changeMonth', function(e) {		
// 		var selectedDate = moment($(this).data('date'));		
// 		var startDate = datePickerPaneStart.data('date');
// 		dateEndInput.val(selectedDate.format('YYYY-MM-DD'));
// 		if (selectedDate.isBefore(startDate) || selectedDate.isSame(startDate)) {
// 			datePickerPaneStart.datepicker('update', selectedDate.format('YYYY-MM-DD'));			
// 			if (isStartTimeGreaterThanEndTime()) {
// 				timePickerStartInput.val(timePickerEndInput.val());		
// 			}
// 		}		
// 	});	

timePickerStartInput	
	.val('12:00:00')	
	.timepicker();	

timePickerEndInput	
	.val('12:00:00')
	.timepicker();

// $('label', datePickerPane).on('click', function (e) {
// 	e.stopPropagation();	
// });



dateTimeRangeDropdown
	.on('shown.bs.dropdown', function (e) {
	  $('.dropdown-menu>li>a').removeClass('focus');
	})
	.on('hidden.bs.dropdown', function (e) {		
		datePickerPane.removeClass('show');
	});

$('.custom-range').on('click', function(e) {
	e.stopPropagation();
	$(this).addClass('focus');
	datePickerPane.addClass('show');
});

$('label', datePickerPane).on('click', function (e) {
	e.stopPropagation();	
});

datePickerPane.on('click', function (e) {
	var target = $(e.target);
	
	if (!datePickerPaneButtons.is(target) && !target.is($('input, label, i', this))) {
		e.stopPropagation();
		e.preventDefault();
	}
});

$('.predefine-range').on('click', function(event) {
	$('#date-time-range-text').text($(this).text());
});