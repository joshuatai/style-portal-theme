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
});

.on('click', function(ev){
	var input = $(this);
	var value = input.val(); 						// Get value of input 
	var start = input.prop('selectionStart');
	input.data("originalDate", value);
	resetInputData(input)
	showField(this, start);
})
.on('blur mousedown', function(ev){
	var input = $(this);
	var value = input.val(); 						// Get value of input 
	var validate = parseDateYMD(value);
	if(!validate) {
		input.val(input.data("originalDate")).datepicker('update');
	}
})
.on('keydown', function(ev){
	var dateText;
	var input = $(this);
	var value = input.val(); 						// Get value of input 
	var getYear = value.substring(0,4); 			// Get year value
	var getMonth = value.substring(5,7); 			// Get month value
	var getDay = value.substring(8,10); 			// Get day value
	var start = input.prop('selectionStart');		// Get the keydown start position
	var enterNum = String.fromCharCode(ev.keyCode); // Get the digits 
	var yearPositionStart = 0;						// Get input year start position index
	var monthPositionStart = 5;						// Get input month start position index
	var dayPositionStart = 8;						// Get input day start position index
	var minYear = 1900;
	var maxYear = 9999;

	// Allow: Ctrl/cmd+C
	if (ev.keyCode == 67 && (ev.ctrlKey === true || ev.metaKey === true)){
        return;
    }

    // Ensure that it is a number and stop the keypress
    if ((ev.shiftKey || (ev.keyCode < 48 || ev.keyCode > 57)) && (ev.keyCode < 96 || ev.keyCode > 105)) {
        ev.preventDefault();
    } else {
    	ev.preventDefault();

    	if(start == yearPositionStart){
			var year = input.data();
			var newYear;
			if(year.firstDigits == null) {
				year.firstDigits = enterNum;
				newYear = `000${year.firstDigits}`;
				
			} else if (year.secondDigits == null) {
				year.secondDigits = enterNum;
				newYear = `00${year.firstDigits}${year.secondDigits}`;
				
			} else if (year.thirdDigits == null) {
				year.thirdDigits = enterNum;
				newYear = `0${year.firstDigits}${year.secondDigits}${year.thirdDigits}`;
				
			} else {
				year.fourthDigits = enterNum;
				newYear = year.firstDigits + year.secondDigits + year.thirdDigits + year.fourthDigits;
			}
			// Update date value
			dateText = combineDate(yearPositionStart, newYear, value);
			input.val(dateText).datepicker('update');
			// Change Position
			if (year.fourthDigits == null) {
				showField(this, yearPositionStart);
			} 
			else {
				showField(this, monthPositionStart);
				resetInputData(input);
			}
		} 
		else if(start == monthPositionStart) {
			var month = input.data();
			var newMonth;
			if (month.firstDigits == null) {
				month.firstDigits = enterNum;
				newMonth = `0${month.firstDigits}`;
		
			} else {
				month.secondDigits = enterNum;
				newMonth = month.firstDigits + month.secondDigits;
				if (parseInt(newMonth) > 12 || parseInt(newMonth) == 0) {
					newMonth = 12;
				}
			}
			// Update date value
			dateText = combineDate(monthPositionStart, newMonth, value);
			input.val(dateText).datepicker('update');

			// Change Position
			if (month.secondDigits == null) {
				showField(this, monthPositionStart);
			} 
			else {
				showField(this, dayPositionStart);
				resetInputData(input);
			}
		} 
		else if(start == dayPositionStart){
			var day = input.data();
			var newDay;
			if (day.firstDigits == null) {
				day.firstDigits = enterNum;
				newDay = `0${day.firstDigits}`;
			} else {
				day.secondDigits = enterNum;
				newDay = day.firstDigits + day.secondDigits;
				if (parseInt(newDay) > 31 || parseInt(newMonth) == 0) {
					newDay = 31;
				}
			}

			// Update date value
			dateText = combineDate(dayPositionStart, newDay, value);
			input.val(dateText).datepicker('update');
			showField(this, dayPositionStart);

			// Change Position
			if (day.secondDigits != null) {
				resetInputData(input);
			}
		}
    }

	// Up/Down arrow Key to change the content
	if (ev.keyCode == 40 || ev.keyCode == 38) {
		ev.preventDefault();
		if (start == yearPositionStart) {
			if (ev.keyCode == '40') { // keydown
				var newYear = parseInt(getYear)-1;
				if (newYear < minYear) {
					newYear = minYear;
				}
			} 
			else { // keyup
				var newYear = parseInt(getYear)+1;
				if (newYear >= maxYear) {
					newYear = maxYear
				}
			}
			dateText = combineDate(yearPositionStart, newYear, value);
			input.val(dateText).datepicker('update');
			showField(this, yearPositionStart);
		} else if (start == monthPositionStart) {
			if (ev.keyCode == '40') { //keydown
				var newMonth = parseInt(getMonth)-1;
				if (newMonth < 10){
					newMonth = "0" + newMonth;
				}
				if(newMonth == "00") {
					newMonth = "12";
				}
			} else { //keyup
				var newMonth = parseInt(getMonth)+1;
				if (newMonth < 10) {
					newMonth = "0" + newMonth;
				}
				if(newMonth == "13") {
					newMonth = "01";
				}
			}
			dateText = combineDate(monthPositionStart, newMonth, value);
			input.val(dateText).datepicker('update');
			showField(this, monthPositionStart);
		} else if (start == dayPositionStart) {
			if (ev.keyCode == '40') { //keydown
				var newDay = parseInt(getDay)-1;
				if (newDay < 10){
					newDay = "0" + newDay;
				}
				if(newDay == "00") {
					newDay = "31";
				}
			} else { //keyup
				var newDay = parseInt(getDay)+1;
				if (newDay < 10) {
					newDay = "0" + newDay;
				}
				if(newDay == "32") {
					newDay = "01";
				}
			} 
			dateText = combineDate(dayPositionStart, newDay, value);
			input.val(dateText).datepicker('update');
			showField(this, dayPositionStart);
		}
	}
	// Tab and Left/Right arrow Key to move selected position
	if (ev.keyCode == 9 || ev.keyCode == 37 || ev.keyCode == 39) {
		ev.preventDefault();
		if (start == yearPositionStart) { // Selected on year position
			if(ev.keyCode == '9' || ev.keyCode == '39') {
				resetInputData(input);
				showField(this, monthPositionStart);
			}
		} else if (start == monthPositionStart) { // Selected on month position
			if(ev.keyCode == '37') {
				resetInputData(input);
				showField(this, yearPositionStart);
			} else {
				resetInputData(input);
				showField(this, dayPositionStart);
			}
		} else if (start == dayPositionStart) { // Selected on day position
			if(ev.keyCode == '37') {
				resetInputData(input);
				showField(this, monthPositionStart);
			}	
		} 
	}
});

function resetInputData (input) {
    input.removeData("firstDigits");
	input.removeData("secondDigits");
	input.removeData("thirdDigits");
	input.removeData("fourthDigits");
}

function parseDateYMD (value) {
    var date = value.split("-");
    if (date[0] < 1900) {
    	return false;
    }
    else {
    	return true;
    }
}

function combineDate (startIdx, newDate, fullDate) {
	var dateText;
	switch(startIdx) {
	    case 0:
	        dateText = newDate + fullDate.substring(4);
	        break;
	    case 5:
	        dateText = fullDate.substring(0,5) + newDate + fullDate.substring(7);
	        break;
	    case 8:
	        dateText = fullDate.substring(0, 8) + newDate;
	}
	return dateText;
}

function showField (input, startIdx) {
	var start = 0;
	var end = 0
	var yearPositionStart = 0;						// Get input year start position index
	var monthPositionStart = 5;						// Get input month start position index
	var dayPositionStart = 8;						// Get input day start position index
	if (startIdx <= 4) {
		start = yearPositionStart;
		end = start + 4;
	} else if (startIdx >= 5 && startIdx <= 7 ) {
		start = monthPositionStart;
		end = start + 2;
	} else if (startIdx >= 8 && startIdx <= 10 ) {
		start = dayPositionStart;
		end = start + 2;
	}
	input.setSelectionRange(start, end);
}

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