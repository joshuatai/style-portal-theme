var container = this;
var timePicker = $('#time-picker', container);

timePicker
	.timepickerBehavior()
	.on('edit', function (e, time) {
	})
	.on('unedit', function (e) {		
	})
	.on('change', function (e, time) {
	});
