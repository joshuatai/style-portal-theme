var container = this;
var datePicker = $('[data-date-picker=date-picker]', container);
datePicker
	.datepicker({
		format: 'dd/mm/yyyy',
		todayHighlight: true
	}).on('show', function(ev){
		console.log("show");
		datePicker.datepicker('iconChange');
	});
