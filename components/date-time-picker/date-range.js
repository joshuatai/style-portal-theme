var container = this;
var datePickerStart = $('[data-date-picker=date-picker-start]', container);
var datePickerEnd = $('[data-date-picker=date-picker-end]', container);
var today = dateFormat(Date.now());
var yestoday = dateFormat(date(today) - 86400000);
function date (date) {
	return new Date(date);
}
function dateFormat (date) {
	var date = new Date(date);
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //January is 0
	var yyyy = date.getFullYear();

	dd = dd < 10 ? `0${dd}`: dd;
	mm = mm < 10 ? `0${mm}`: mm;
	
	return `${yyyy}-${mm}-${dd}`;
}

datePickerStart.val(yestoday);
datePickerEnd.val(today);

datePickerStart.datepicker({
	todayHighlight: true,
  	autoclose: true,
  	format: 'yyyy-mm-dd'
})
// .on('input', (e) => {
// 	datePickerStart.data('manually', true);
// })
// .on('keydown', (e) => {
// 	if (e.keyCode === 13) {
// 		datePickerEnd.focus().datepicker('show');
// 	}
// })
.on('changeDate', function(ev){
	var alignDate = dateFormat(ev.date.valueOf());

	if (date(datePickerEnd.val()).getTime() <= date(datePickerStart.val()).getTime()) {
		datePickerEnd.val(alignDate);
		datePickerEnd.datepicker('setDate', date(alignDate))		
		//datePickerEnd.datepicker('setDate', date(nextDate)).data('manually', true);
	}
	// if (!datePickerStart.data('manually')) {
	// 	datePickerEnd.focus().datepicker('show');
	// }
	// datePickerStart.data('manually', false);
})
.datepickerBehavior({
	setDate: function (date) {
		this.element
			.val(date)
			.trigger('changeDate');
	}
});

datePickerEnd.datepicker({
	todayHighlight: true,
  	autoclose: true,
  	format: 'yyyy-mm-dd'
})
.on('changeDate', function(ev){
	var alignDate = dateFormat(ev.date.valueOf());

	if (date(datePickerStart.val()).getTime() >= date(datePickerEnd.val()).getTime()) {
		datePickerStart.val(alignDate);
		datePickerStart.datepicker('setDate', date(alignDate))//.data('manually', true);
	}

	// if (!datePickerEnd.data('manually')) {
	// 	// datePickerEnd.blur().datepicker('hide');
	// }

	// datePickerEnd.data('manually', false);
})
.datepickerBehavior({
	setDate: function (date) {
		this.element
			.val(date)
			.trigger('changeDate');
	}
});


