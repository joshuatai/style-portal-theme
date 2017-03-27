var container = this;
var datePicker = $('[data-date-picker=date-picker]', container);
var today = dateFormat(Date.now());

datePicker.val(today);

datePicker.datepicker({
  todayHighlight: true,
  autoclose: true,
  format: 'yyyy-mm-dd'
})
.on('show', function(ev){
  datePicker.datepicker('iconChange');
})
.datepickerBehavior({
	setDate: function (date) {
		this.element.val(date);
	}
});


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