var container = this;
var dateTimeRangeDropdown = $('#date-time-range-dropdown', container);


var dateStartInput = $('#pane-date-start-input', container);
var dateEndInput = $('#pane-date-end-input', container);

var datePickerPaneStart = $('#date-pane-date-start', container);
var datePickerPaneEnd = $('#date-pane-date-end', container);

var timePickerStart = $('[data-time-picker=pane-time-start]', container);
var timePickerEnd = $('[data-time-picker=pane-time-end]', container);

var today = moment().format('YYYY-MM-DD');
var lastweek = moment().add(-7, 'd').format('YYYY-MM-DD');

function isStartTimeGreaterThanEndTime () {
	var timeStart = timePickerStart.timeEntry('getTime');
	var timeEnd = timePickerEnd.timeEntry('getTime');

	if (timeStart === null) { return false; }
	if (timeEnd === null) { return false; }
	if (timeStart.getTime() >= timeEnd.getTime()) { return true; }

	return false;
}

function calTimePickerDate ($elem, secs) {
	var origin = $elem.timeEntry('getTime');
	var date = new Date(origin);

	date.setSeconds(origin.getSeconds() + secs);

	return date;
}

dateTimeRangeDropdown
	.on('shown.bs.dropdown', function () {
	  $('.dropdown-menu>li>a').removeClass('focus');
	})
	.on('hidden.bs.dropdown', function () {
		$('.date-picker-pane').removeClass('show');
	});

dateStartInput
	.val(lastweek)
	.datepickerBehavior()
	.on('change', function (e, date) {
		datePickerPaneStart.datepicker('update', date);
	});

dateEndInput
	.val(today)
	.datepickerBehavior()
	.on('change', function (e, date) {
		datePickerPaneEnd.datepicker('update', date);
	});

datePickerPaneStart
	.data('date', lastweek)
	.datepicker({
		todayHighlight: true,
		autoclose: true,
		format: 'yyyy-mm-dd',
		keyboardNavigation: false
	})
	.on('changeDate changeMonth', function(e) {		
		var selectedDate = moment($(this).data('date'));		
		var endDate = datePickerPaneEnd.data('date');
		dateStartInput.val(selectedDate.format('YYYY-MM-DD'));
		if (selectedDate.isAfter(endDate) || selectedDate.isSame(endDate)) {			
			datePickerPaneEnd.datepicker('update', selectedDate.format('YYYY-MM-DD'));
			if (isStartTimeGreaterThanEndTime()) {
				timePickerEnd.timeEntry('setTime', calTimePickerDate(timePickerStart, 0));
			}
		}		
	});
	
datePickerPaneEnd
	.data('date', today)
	.datepicker({
		todayHighlight: true,
		autoclose: true,
		format: 'yyyy-mm-dd',
		keyboardNavigation: false
	})
	.on('changeDate changeMonth', function(e) {		
		var selectedDate = moment($(this).data('date'));		
		var startDate = datePickerPaneStart.data('date');
		dateEndInput.val(selectedDate.format('YYYY-MM-DD'));
		if (selectedDate.isBefore(startDate) || selectedDate.isSame(startDate)) {
			datePickerPaneStart.datepicker('update', selectedDate.format('YYYY-MM-DD'));
			if (isStartTimeGreaterThanEndTime()) {
				timePickerStart.timeEntry('setTime', calTimePickerDate(timePickerEnd, 0));
			}
		}		
	});	

timePickerStart
	.timeEntry({
		show24Hours: true, 
		showSeconds: true,
		spinnerImage: null
	})
	.timeEntry('setTime', '12:00:00')
	.timepickerBehavior({
		setTime: function(timeText){
			this.element.timeEntry('setTime', timeText);
		}
	});

timePickerEnd
	.timeEntry({
		show24Hours: true, 
		showSeconds: true,
		spinnerImage: null
	})
	.timeEntry('setTime', '12:00:00')
	.timepickerBehavior({
		setTime: function(timeText){
			this.element.timeEntry('setTime', timeText);
		}
	});


$(".prev", datePickerPaneStart).add($(".prev", datePickerPaneEnd)).find("i").attr('class', 'fa fa-angle-left');
$(".next", datePickerPaneStart).add($(".next", datePickerPaneEnd)).find("i").attr('class', 'fa fa-angle-right');


$('.custom-range').on('click', function(e){
	e.stopPropagation();
	$(this).addClass('focus');
	$('.date-picker-pane').addClass('show');
});

$('.predefine-range').on('click', function(event){
	$('#date-time-range-text').text($(this).text());
});