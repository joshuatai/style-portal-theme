var container = this;
var dateTimeRangeDropdown = $('#date-time-range-dropdown', container);
var dateStart = $('#pane-date-start', container);
var dateEnd = $('#pane-date-end', container);
var datePickerPaneStart = $('[data-date-picker=date-pane-date-start]', container);
var datePickerPaneEnd = $('[data-date-picker=date-pane-date-end]', container);
var timePickerStart = $('[data-time-picker=pane-time-start]', container);
var timePickerEnd = $('[data-time-picker=pane-time-end]', container);
var today = dateFormat(Date.now());
var lastweek = dateFormat(date(today) - 86400000 * 7);

dateTimeRangeDropdown.on('shown.bs.dropdown', function () {
  $('.dropdown-menu>li>a').removeClass('focus');
})
.on('hidden.bs.dropdown', function () {
	$('.date-picker-pane').removeClass('show');
});

dateStart.val(lastweek);
dateEnd.val(today);

dateStart.on('change', function () {
	datePickerPaneStart.data('date', $(this).val()).datepicker('update');
});

dateEnd.on('change', function () {
	datePickerPaneEnd.data('date', $(this).val()).datepicker('update');
});

datePickerPaneStart
	.data('date', lastweek)
	.datepicker({
		todayHighlight: true
	})
	.on('changeDate', function(ev){
		var dateText = dateFormat(ev.date.valueOf());

		dateStart.val(dateText);

		var start = date(dateStart.val());
		var end = date(dateEnd.val());
		
		if (start.getTime() >= end.getTime()) {
			end = date(dateStart.val());

			if (start.getTime() == end.getTime() && isStartTimeGreaterThanEndTime()) {
				timePickerEnd.timeEntry('setTime', calTimePickerDate(timePickerEnd, 1)).focus();
			}

			dateEnd.val(dateText);
			datePickerPaneEnd.data('date', dateText).datepicker('update');
		}
	})
	.datepicker('iconChange');

datePickerPaneEnd
	.datepicker({
		todayHighlight: true
	})
	.on('changeDate', function(ev){
		var dateText = dateFormat(ev.date.valueOf());

		dateEnd.val(dateText);

		var start = date(dateStart.val());
		var end = date(dateEnd.val());
		
		if (start.getTime() >= end.getTime()) {
			start = date(dateEnd.val());

			if (start.getTime() == end.getTime() && isStartTimeGreaterThanEndTime()) {
				timePickerStart.timeEntry('setTime', calTimePickerDate(timePickerEnd, -1)).focus();
			}

			dateStart.val(dateText);
			datePickerPaneStart.data('date', dateText).datepicker('update');
		}
	})
	.datepicker('iconChange');

timePickerStart.timeEntry({
	show24Hours: true, 
	showSeconds: true,
	spinnerImage: null
})
.timeEntry('setTime', '12:00:00');

timePickerEnd.timeEntry({
	show24Hours: true, 
	showSeconds: true,
	spinnerImage: null
})
.timeEntry('setTime', '12:00:00');

$('.custom-range').on('click', function(e){
	e.stopPropagation();
	$(this).addClass('focus');
	$('.date-picker-pane').addClass('show');
});

$('.predefine-range').on('click', function(event){
	$('#date-time-range-text').text($(this).text());
});

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

function date (date) {
	return new Date(date);
}

function dateFormat (date) {
	var date = new Date(date);
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //January is 0
	var yyyy = date.getFullYear();

	dd = dd < 10 ? `0${dd}`: dd;
	mm = mm < 10 ? `0${mm}`: mm;
	
	return `${mm}/${dd}/${yyyy}`;
}