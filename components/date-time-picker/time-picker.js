var container = this;
var timePicker = $('[data-time-picker=time-picker]', container);
timePicker.timeEntry({
  show24Hours: true, 
  showSeconds: true,
  spinnerImage: null
})
.timepickerBehavior({
	setTime: function(timeText){
		this.element.timeEntry('setTime', timeText);
	}
});
