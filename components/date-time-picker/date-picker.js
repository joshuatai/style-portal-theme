var container = this;
var datePicker = $('[data-date-picker=date-picker]', container);
datePicker.datepicker({
	format: 'dd/mm/yyyy',
	todayHighlight: true
});