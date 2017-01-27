var container = this;
var datePickerTime = $('[data-date-picker=date-picker-with-time]', container);
var timePickerDate = $('[data-time-picker=time-picker-with-date]', container);

datePickerTime
	.datepicker({
		todayHighlight: true,
	  	autoclose: true,
	  	format: 'yyyy-mm-dd'
	})
	.datepicker('setDate', new Date())
	.datepickerBehavior();

timePickerDate
	.timeEntry({
		show24Hours: true, 
		showSeconds: true,
		spinnerImage: null
	})
	.timepickerBehavior({
		setTime: function(timeText){
			this.element.timeEntry('setTime', timeText);
		}
	});