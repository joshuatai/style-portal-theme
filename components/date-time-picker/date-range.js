var container = this;
var datePickerStart = $('[data-date-picker=date-picker-start]', container);
var datePickerEnd = $('[data-date-picker=date-picker-end]', container);
var today = dateFormat(Date.now());
var yestoday = dateFormat(date(today) - 86400000);

datePickerStart.val(yestoday);
datePickerEnd.val(today);

datePickerStart.datepicker({
	todayHighlight: true
}).on('changeDate', function(ev){
	var nextDate = dateFormat(ev.date.valueOf() + 86400000);

	if (date(datePickerEnd.val()).getTime() <= date(datePickerStart.val()).getTime()) {
		datePickerEnd.val(nextDate);
		datePickerEnd.datepicker('setDate', date(nextDate)).data('manually', true);
	}

	if (!datePickerStart.data('manually')) {
		datePickerStart.blur().datepicker('hide');
		datePickerEnd.focus().datepicker('show');
	}

	datePickerStart.data('manually', false);
}).on('show', function(ev){
	datePickerStart.datepicker('iconChange');
});

datePickerEnd.datepicker({
	todayHighlight: true
}).on('changeDate', function(ev){
	var preDate = dateFormat(ev.date.valueOf() - 86400000);

	if (date(datePickerStart.val()).getTime() >= date(datePickerEnd.val()).getTime()) {
		datePickerStart.val(preDate);
		datePickerStart.datepicker('setDate', date(preDate)).data('manually', true);
	}

	if (!datePickerEnd.data('manually')) {
		datePickerEnd.blur().datepicker('hide');
	}

	datePickerEnd.data('manually', false);
}).on('show', function(ev){
	datePickerEnd.datepicker('iconChange');
});

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
	
	return `${mm}/${dd}/${yyyy}`;
}
