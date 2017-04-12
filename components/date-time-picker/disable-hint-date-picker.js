var container = this;
var disabledDatePickerContainer = $('#disabled-date-datepicker', container);

disabledDatePickerContainer
	.data('date', '2017-01-10')
	.datepicker({
	  todayHighlight: true,
	  autoclose: true,
	  format: 'yyyy-mm-dd',
	  keyboardNavigation: false,
	  endDate: '2017-01-20'
	});

$(".prev", disabledDatePickerContainer).find("i").attr('class', 'fa fa-angle-left');
$(".next", disabledDatePickerContainer).find("i").attr('class', 'fa fa-angle-right');