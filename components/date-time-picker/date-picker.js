var container = this;
var datePicker = $('[data-date-picker=date-picker]', container);
var dateFormat = function  (date, index) {
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
var today = dateFormat(Date.now());

datePicker.val(today);


// DatePicker Behavior Plugin
// ========================
(function($) {
	var yearPositionStart = 0;
	var yearTextLength = 4;
	var monthPositionStart = 5;
	var monthTextLength = 2;
	var datePositionStart = 8;
	var dateTextLength =2;
	var minYear = 1900;
	var maxYear = 9999;
	var dateReg = /\d{4}(\D{1})\d{2}(\D{1})\d{2}/;
    var pad = function (num, n) {  
		var len = num.toString().length;  
		while(len < n) {  
			num = "0" + num;  
			len++;  
		}  
		return num; 
	}
	var lastDayOfMonth = function (Year, Month) {
		var lastDate = new Date((new Date(Year, Month, 1)) - 1);
	    return lastDate.getDate();
	}


	var DatepickerBehavior = function(element, option) {
		
		this.input = element;   // Original javascript DOM
		this.element = $(element);  // jQuery DOM
		this.picker = this.element.data('datepicker').picker;
		this.setDate = option.setDate;
		this.element.val().match(dateReg,'$1');
		this.splitter = RegExp.$1;
		this._attachEvents();
	};
	
	DatepickerBehavior.prototype = {

		constructor: DatepickerBehavior,

		_attachEvents: function(){
			this.element.on("click", $.proxy(this._doClick, this))
						.on('show', $.proxy(this._iconChange, this))
						.on('paste', $.proxy(this._doPaste, this))
						.on("keydown", $.proxy(this._doKeydown, this))
						// .on("blur mousedown", $.proxy(this._doValidate, this))
						// .on("keydown", $.proxy(this._doKeydown, this));

			// $(document).on('mouseup', $.proxy(this._doSelection, this));
			

		},
		// _doSelection: function (e) {
		//     if ($(e.toElement).is(this.element)) return false;
		// 	if (this.element.is(':focus')) {
		// 		this._doClick();
		// 	}
		// },
		_doClick: function(e) {
			var input = this.element;
			var value = input.val();
			var start = input.prop('selectionStart');

			this.orgYear = parseInt(value.substring(0,4), 10); 			// Get year value
			this.orgMonth = parseInt(value.substring(5,7), 10);  		// Get month value
			this.orgDate = parseInt(value.substring(8,10), 10); 			// Get day value

			this._resetInputData();
			this._showField(start);
		},
		_iconChange: function (e) {
			this.element.datepicker('iconChange');
		},
		_doPaste: function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		_doValidate: function() {
			var input = $(this.element);
			var value = input.val(); 						 
			var validate = this._parseDateYMD(value);
			if(!validate) {
				this.setDate(this.orgVal);
			}
		},
		_doKeydown: function(e){
			var dateText;
			var input = this.element;
			var start = input.prop('selectionStart');		// Get the keydown start position
			var end = input.prop('selectionEnd');
			var enterNum = String.fromCharCode(e.keyCode); // Get the digits 
			var showFieldPosition;

			if (this.picker.is(':visible')) return false;
			
			// Allow: Ctrl/cmd+C
			if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;

			// Allow: Delete/Backword
			//if (e.keyCode === 8 || e.keyCode === 46) this._resetVal(start);

			// Up/Down arrow Key to change the digits
			if (e.keyCode == 40 || e.keyCode == 38) {
				e.preventDefault();
				if (start === yearPositionStart) {
					showFieldPosition = yearPositionStart;
					if (e.keyCode == '40') { // keydown
						this.orgYear--;
					} 
					else { // keyup
						this.orgYear++;
					}
				} else if (start == monthPositionStart) {
					showFieldPosition = monthPositionStart;
					if (e.keyCode == '40') { //keydown
						this.orgMonth--;
					} else { //keyup
						this.orgMonth++;
					}
				} else if (start == datePositionStart) {
					showFieldPosition = datePositionStart;
					if (e.keyCode == '40') { //keydown
						this.orgDate--;
					} else { //keyup
						this.orgDate++;
					} 
				}
				dateText = this._calculator(showFieldPosition);
				this.setDate(dateText);
				this._showField(showFieldPosition);

				return false;
			}
			// Tab and Left/Right arrow Key to move selected position
			if (e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 39) {
				e.preventDefault();
				if (start == yearPositionStart) { // Selected on year position
					if(e.keyCode == '9' || e.keyCode == '39') {
						//this._resetInputData();
						this._showField(monthPositionStart);
					}
				} else if (start == monthPositionStart) { // Selected on month position
					if(e.keyCode == '37') {
						//this._resetInputData();
						this._showField(yearPositionStart);
					} else {
						//this._resetInputData();
						this._showField(datePositionStart);
					}
				} else if (start == datePositionStart) { // Selected on day position
					if(e.keyCode == '37') {
						//this._resetInputData();
						this._showField(monthPositionStart);
					}	
				} 
				return false;
			}

			// if ((ev.shiftKey || (ev.keyCode < 48 || ev.keyCode > 57)) && (ev.keyCode < 96 || ev.keyCode > 105)) {
		 //        ev.preventDefault();
		 //    } else {
		 //    	ev.preventDefault(); //Use this because setSelectionRange function will prevent by default.

		 //    	if(start == yearPositionStart){
			// 		var year = input.data();
			// 		var newYear;
			// 		if(year.firstDigits == null) {
			// 			year.firstDigits = enterNum;
			// 			newYear = `000${year.firstDigits}`;
						
			// 		} else if (year.secondDigits == null) {
			// 			year.secondDigits = enterNum;
			// 			newYear = `00${year.firstDigits}${year.secondDigits}`;
						
			// 		} else if (year.thirdDigits == null) {
			// 			year.thirdDigits = enterNum;
			// 			newYear = `0${year.firstDigits}${year.secondDigits}${year.thirdDigits}`;
						
			// 		} else {
			// 			year.fourthDigits = enterNum;
			// 			newYear = year.firstDigits + year.secondDigits + year.thirdDigits + year.fourthDigits;
			// 		}
			// 		// Update date value
			// 		dateText = this._combineDate(yearPositionStart, newYear, value);
			// 		this.setDate(dateText);
			// 		// Change Position
			// 		if (year.fourthDigits == null) {  // Select itself until four digits are set.
			// 			this._showField(yearPositionStart);
			// 		} 
			// 		else {
			// 			this._showField(monthPositionStart);
			// 			this._resetInputData();
			// 		}
			// 	} 
			// 	if(start == monthPositionStart) {
			// 		var month = input.data();
			// 		var newMonth;
			// 		if (month.firstDigits == null) {
			// 			month.firstDigits = enterNum;
			// 			newMonth = `0${month.firstDigits}`;
				
			// 		} else {
			// 			month.secondDigits = enterNum;
			// 			newMonth = month.firstDigits + month.secondDigits;
			// 			if (parseInt(newMonth) > 12 || parseInt(newMonth) == 0) {
			// 				newMonth = 12;
			// 			}
			// 		}
			// 		// Update date value
			// 		dateText = this._combineDate(monthPositionStart, newMonth, value);
			// 		this.setDate(dateText);

			// 		// Change Position
			// 		if (month.secondDigits == null) {
			// 			this._showField(monthPositionStart);
			// 		} 
			// 		else {
			// 			this._showField(dayPositionStart);
			// 			this._resetInputData();
			// 		}
			// 	} 
			// 	if(start == dayPositionStart){
			// 		var day = input.data();
			// 		var newDay;
			// 		if (day.firstDigits == null) {
			// 			day.firstDigits = enterNum;
			// 			newDay = `0${day.firstDigits}`;
			// 		} else {
			// 			day.secondDigits = enterNum;
			// 			newDay = day.firstDigits + day.secondDigits;
			// 			if (parseInt(newDay) > 31 || parseInt(newMonth) == 0) {
			// 				newDay = 31;
			// 			}
			// 		}

			// 		// Update date value
			// 		dateText = this._combineDate(dayPositionStart, newDay, value);
			// 		this.setDate(dateText);
			// 		this._showField(dayPositionStart);

			// 		// Change Position
			// 		if (day.secondDigits != null) {
			// 			this._resetInputData();
			// 		}
			// 	}
		 //    }
			// Ensure that it is a number and stop the keydown
		    if (enterNum && !$.isNumeric(enterNum)) return false;
		},
		// _resetVal: function (index) {
		// 	if (index === 0) {

		// 	}
		// },
		_calculator: function (position) {
			var splitter = this.splitter;
			var lastDate;
			
			if (position === 0) {
				if (this.orgYear < minYear) this.orgYear = minYear;
				if (this.orgYear > maxYear) this.orgYear = maxYear;
			} 
		    if (position === 5) {
		    	if (this.orgMonth < 1) {
		    		if (this.orgYear > minYear) {
		    			this.orgMonth = 12;
		    			this.orgYear--;
		    		} else {
		    			this.orgMonth = 1;
		    		}
		    	}
		    	if (this.orgMonth > 12) {
		    		if (this.orgYear < maxYear) {
		    			this.orgMonth = 1;
		    			this.orgYear++;
		    		} else {
		    			this.orgMonth = 12;
		    		}
		    	}
		    	if (this.orgMonth === 2) {
		    		lastDate = lastDayOfMonth(this.orgYear, this.orgMonth)
		    		if (this.orgDate > lastDate) this.orgDate = lastDate;
		    	}
			}
			if (position === 8) {
				if (this.orgDate < 1) {
					if (this.orgYear === minYear && this.orgMonth === 1) {
						this.orgDate = 1;
					} else {
						if (this.orgMonth === 1) {
							this.orgYear--;
							this.orgMonth = 12;
							this.orgDate = 31;
						} else {
							this.orgMonth--;
							this.orgDate = lastDayOfMonth(this.orgYear, this.orgMonth);
						}
					}
				}
				lastDate = lastDayOfMonth(this.orgYear, this.orgMonth);
				if (this.orgDate > lastDate) {
					if (this.orgYear === maxYear && this.orgMonth === 12) {
						this.orgDate = 31;
					} else {
						if (this.orgMonth === 12) {
							this.orgYear++;
							this.orgMonth = 1;
							this.orgDate = 31;
						} else {
							this.orgMonth++;
							this.orgDate = 1;
						}
					}
				}
			}

			return pad(this.orgYear, 4) + splitter + pad(this.orgMonth, 2) + splitter + pad(this.orgDate, 2);
		},
		_parseDateYMD: function (value) {
			var date = value.split("-");
		    if (date[0] < 1900) {
		    	return false;
		    }
		    else {
		    	return true;
		    }
		},
		_resetInputData: function(){
			// this.element.removeData("firstDigits");
			// this.element.removeData("secondDigits");
			// this.element.removeData("thirdDigits");
			// this.element.removeData("fourthDigits");
		},
		_showField: function( startIdx ) {
			var start;
			var end;
			if (startIdx <= 4) {
				start = yearPositionStart;
				end = start + 4;
			} else if (startIdx >= 5 && startIdx <= 7 ) {
				start = monthPositionStart;
				end = start + 2;
			} else if (startIdx >= 8 && startIdx <= 10 ) {
				start = datePositionStart;
				end = start + 2;
			}
			this.input.setSelectionRange(start, end);
		}
	};

	$.fn.datepickerBehavior = function (option) {

		return this.each(function () {
	      var $this   = $(this);
	      var data    = $this.data('datepickerBehavior');
	      var options = typeof option == 'object' && option;
	      if (!data) $this.data('datepickerBehavior', (data = new DatepickerBehavior(this, options)));
	    });
	};
})(jQuery);


datePicker
	.datepicker({
	  todayHighlight: true,
	  autoclose: true,
	  format: 'yyyy-mm-dd'
	})
	.datepickerBehavior({
		setDate: function (date) {
			this.element.val(date);
		}
	});
