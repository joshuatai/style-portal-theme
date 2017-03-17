var container = this;
var datePicker = $('[data-date-picker=date-picker]', container);
var today = dateFormat(Date.now());

datePicker.val(today);

datePicker.datepicker({
  todayHighlight: true,
  autoclose: true
})
.on('show', function(ev){
  datePicker.datepicker('iconChange');
});
$("#datepicker1").on('click', function(ev){
	var value = $(this).val();
	var start = $(this).prop('selectionStart');
	var getMonth = value.substring(0,2);
	var getDay = value.substring(3,5);
	var getYear = value.substring(6,10);

	if (start <= 2) {
		this.setSelectionRange(0,2)
	}

	else if (start >= 3 && start <= 5 ) {
		this.setSelectionRange(3,5)
	}

	else if (start >= 6 && start <= 10 ) {
		this.setSelectionRange(6,10)
	}
})
.on('keydown', function(ev){
	var value = $(this).val();
	var getMonth = value.substring(0,2);
	var getDay = value.substring(3,5);
	var getYear = value.substring(6,10);
	var start = $(this).prop('selectionStart');
	// Allow: backspace, delete, escape, enter and . and /
	if ($.inArray(ev.keyCode, [46, 8, 27, 13, 110, 190, 191]) !== -1) {
		return;
    }
    // Ensure that it is a number and stop the keypress
    if ((ev.shiftKey || (ev.keyCode < 48 || ev.keyCode > 57)) && (ev.keyCode < 96 || ev.keyCode > 105)) {
        ev.preventDefault();
    }
    // Let user enter the number to change content
    else {
    	ev.preventDefault();
    	var fields = [];
		var dateText;
    	var value = $(this).val(); 						// Get value of input 
		var getMonth = value.substring(0,2); 			// Get month value
		var getDay = value.substring(3,5); 				// Get day value
		var getYear = value.substring(6,10); 			// Get year value
		var start = $(this).prop('selectionStart');		// Get the keydown start position
		var enterNum = String.fromCharCode(ev.keyCode); // Get the digits 
		
		if(start == 0) {
			var changeMonth = getMonth.split("");
			fields[0] = changeMonth[1];
			fields[1] = enterNum;
			var newMonth = fields.join("");
			dateText = newMonth + value.substring(2);
			$(this).val(dateText);
			this.setSelectionRange(0,2);
		}
		else if(start == 3){
			var changeDay = getDay.split("");
			fields[0] = changeDay[1];
			fields[1] = enterNum;
			var newDay = fields.join("");
			dateText = value.substring(0,3) + newDay + value.substring(5);
			$(this).val(dateText);
			this.setSelectionRange(3,5);
		}
		else if(start == 6){
			var changeYear = getYear.split("");
			fields[0] = changeYear[1];
			fields[1] = changeYear[2];
			fields[2] = changeYear[3];
			fields[3] = enterNum;
			var newYear = fields.join("");
			dateText = value.substring(0,6) + newYear
			$(this).val(dateText);
			this.setSelectionRange(6,10);
		}
    }

	// Up/Down arrow Key to change the content
	if (ev.keyCode == '40' || ev.keyCode == '38') {
		ev.preventDefault();
		if (start == 0) {
			//keydown
			if (ev.keyCode == '40') {
				var newMonth = parseInt(getMonth)-1;
				if (newMonth < 10){
					newMonth = "0" + newMonth;
				}
				if(newMonth == "00") {
					newMonth = "12";
				}
			}
			//keyup
			else {
				var newMonth = parseInt(getMonth)+1;
				if (newMonth < 10) {
					newMonth = "0" + newMonth;
				}
				if(newMonth == "13") {
					newMonth = "01";
				}
			}
			dateText = newMonth + value.substring(2);
			$(this).val(dateText);
			this.setSelectionRange(0,2);
		}
		else if (start == 3) {
			//keydown
			if (ev.keyCode == '40') {
				var newDay = parseInt(getDay)-1;
				if (newDay < 10){
					newDay = "0" + newDay;
				}
				if(newDay == "00") {
					newDay = "31";
				}
			}
			//keyup
			else {
				var newDay = parseInt(getDay)+1;
				if (newDay < 10) {
					newDay = "0" + newDay;
				}
				if(newDay == "32") {
					newDay = "01";
				}
			}
			dateText = value.substring(0,3) + newDay + value.substring(5);
			$(this).val(dateText);
			this.setSelectionRange(3,5)
		}
		else if (start == 6) {
			// keydown
			if (ev.keyCode == '40') {
				var newYear = parseInt(getYear)-1;
			}
			// keyup
			else {
				var newYear = parseInt(getYear)+1;
			}
			dateText = value.substring(0,6) + newYear
			$(this).val(dateText);
			this.setSelectionRange(6,10)
		}
	}
	// Tab and Left/Right arrow Key to move selected position
	if (ev.keyCode == '9' || ev.keyCode == '37' || ev.keyCode == '39') {
		ev.preventDefault();
		// Selected on first position
		if (start == 0) {
			if(ev.keyCode == '9' || ev.keyCode == '39') {
				this.setSelectionRange(3,5);
			}	
		}
		// Selected on second position
		else if (start == 3) {
			if(ev.keyCode == '37') {
				this.setSelectionRange(0,2);
			}else {
				this.setSelectionRange(6,10);
			}
		}
		// Selected on third position
		else if (start == 6) {
			if(ev.keyCode == '37') {
				this.setSelectionRange(3,5);
			}
		}
	}
});

function dateFormat (date) {
	var date = new Date(date);
	var dd = date.getDate();
	var mm = date.getMonth() + 1; //January is 0
	var yyyy = date.getFullYear();

	dd = dd < 10 ? `0${dd}`: dd;
	mm = mm < 10 ? `0${mm}`: mm;
	
	return `${mm}/${dd}/${yyyy}`;
}

function getSelectedText() {
    if (window.getSelection) { 
        var range = window.getSelection();
        return range.toString();
    } 
    else {
        if (document.selection.createRange) { // IE
            var range = document.selection.createRange();
            return range.text;
        }
    }
}