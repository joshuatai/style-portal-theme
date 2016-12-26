var container = this;
var datePickerStart = $('[data-date-picker=date-picker-start]', container);
var datePickerEnd = $('[data-date-picker=date-picker-end]', container);
function dateFormat(date) {
	var thisDate = new Date(date);
	var dd = thisDate.getDate();
	var mm = thisDate.getMonth()+1; //January is 0
	var yyyy = thisDate.getFullYear();
	if(dd<10) {
	    dd='0'+dd;
	} 
	if(mm<10) {
	    mm='0'+mm;
	} 
	var thisDate = dd+'/'+mm+'/'+yyyy;
	return thisDate;
}
datePickerStart.datepicker({
	format: 'dd/mm/yyyy',
	todayHighlight: true,
	endDate: "24/10/2016"
}).on('changeDate', function(ev){
	var dateText = dateFormat(ev.date.valueOf());
	datePickerEnd.datepicker('setStartDate', dateText);
});

datePickerEnd.datepicker({
	format: 'dd/mm/yyyy',
	todayHighlight: true,
	startDate: "23/10/2016"
}).on('changeDate', function(ev){
	var dateText = dateFormat(ev.date.valueOf());
	datePickerStart.datepicker('setEndDate', dateText);
});