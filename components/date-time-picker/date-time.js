var container = this;
var datePickerTime = $('[data-date-picker=date-picker-with-time]', container);
var timePickerDate = $('[data-time-picker=time-picker-with-date]', container);
datePickerTime.datepicker({
	format: 'dd/mm/yyyy',
	todayHighlight: true
});
timePickerDate.timeEntry({
	show24Hours: true, 
	showSeconds: true,
	spinnerImage: null
});