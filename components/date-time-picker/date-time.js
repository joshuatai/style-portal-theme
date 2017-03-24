var container = this;
var datePickerTime = $('[data-date-picker=date-picker-with-time]', container);
var timePickerDate = $('[data-time-picker=time-picker-with-date]', container);
datePickerTime.datepicker({
	todayHighlight: true,
  	autoclose: true,
  	format: 'yyyy-mm-dd'
})
.datepicker('setDate', new Date())
.on('show', function(ev){
	datePickerTime.datepicker('iconChange');
}).datePickerBehavior();

function dateFormat (date, index) {
	var date = new Date(date);
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //January is 0
	var yyyy = date.getFullYear();

	if (index == "mm") {
		return mm;
	} else if (index == "dd") {
		return dd;
	} else if (index == "yyyy") {
		return yyyy;
	} else {
		dd = dd < 10 ? `0${dd}`: dd;
		mm = mm < 10 ? `0${mm}`: mm;
		return `${yyyy}-${mm}-${dd}`;
	}
}

timePickerDate.timeEntry({
	show24Hours: true, 
	showSeconds: true,
	spinnerImage: null
});