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

 function isStartTimeGreaterThanEndTime () {
 	var startDate = dateStartInput.val();
 	var endDate = dateEndInput.val();
 	var timeStart = timePickerStartInput.val();
 	var timeEnd = timePickerEndInput.val();
	if (moment(startDate + ' ' + timeStart).isAfter(moment(endDate + ' ' + timeEnd))) return true;

	return false;
}

dateStartInput
	.val(lastweek)
	.datepicker({
		isInline: true,
		container: datePickerPaneBody
	})
  .on('change', function (e, date) {
    var selectedDate = moment($(this).val());		
    var endDate = dateEndInput.val();    
    if (selectedDate.isAfter(endDate) || selectedDate.isSame(endDate)) {			
 			dateEndInput.datepicker('setDate', new Date(date));
      if (isStartTimeGreaterThanEndTime()) {
 				timePickerEndInput.timepicker('setValue', timePickerStartInput.val());
 			}
 		}
  });


dateEndInput
	.val(today)
	.datepicker({
		isInline: true,
		container: datePickerPaneBody
	})
  .on('change', function (e, date) {
    var selectedDate = moment($(this).val());		
    var startDate = dateStartInput.val();
    if (selectedDate.isBefore(startDate) || selectedDate.isSame(startDate)) {			
 			dateStartInput.datepicker('setDate', new Date(date));
 			if (isStartTimeGreaterThanEndTime()) {
 				timePickerStartInput.timepicker('setValue', timePickerEndInput.val());
 			}
 		}
  });

var startDatePicker = dateStartInput.parent().find('[data-role="datepicker"]');
var endDatePicker = dateEndInput.parent().find('[data-role="datepicker"]');

datePickerPaneBody.children().addClass('date-picker-pane-container');	

timePickerStartInput	
	.val('12:00:00')	
	.timepicker()
	.on('change', function (e, time) {
		var startDate = moment(dateStartInput.val());		
		var endDate = dateEndInput.val();
		if (startDate.isSame(endDate) && isStartTimeGreaterThanEndTime()) {	
			timePickerEndInput.val(timePickerStartInput.val());
		} 
	});

timePickerEndInput
	.val('12:00:00')	
	.timepicker()
	.on('change', function (e, time) {
		var startDate = moment(dateStartInput.val());		
		var endDate = dateEndInput.val();
		if (startDate.isSame(endDate) && isStartTimeGreaterThanEndTime()) {	
			timePickerStartInput.val(timePickerEndInput.val());
		} 
	});

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