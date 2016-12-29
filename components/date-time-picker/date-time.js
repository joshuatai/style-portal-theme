var container = this;
var datePickerTime = $('[data-date-picker=date-picker-with-time]', container);
var timePickerDate = $('[data-time-picker=time-picker-with-date]', container);
datePickerTime.datepicker({
	todayHighlight: true,
  autoclose: true
})
.datepicker('setDate', new Date())
.on('show', function(ev){
	datePickerTime.datepicker('iconChange');
});
timePickerDate.timeEntry({
	show24Hours: true, 
	showSeconds: true,
	spinnerImage: null
});