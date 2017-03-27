(function($) {
	var _this = this;
    var extensionChangeIcon = {
		iconChange: function(){
			$(".datepicker .prev", _this).find("i").attr('class', 'fa fa-angle-left');
			$(".datepicker .next", _this).find("i").attr('class', 'fa fa-angle-right');
		}
    };
    $.extend(true, $.fn.datepicker.Constructor.prototype, extensionChangeIcon);

})(jQuery);


// DatePicker Behavior Plugin
// ========================
(function($) {

	var DatepickerBehavior = function(element, option) {
		
		this.input = element;   // Original javascript DOM
		this.element = $(element);  // jQuery DOM
		this.setDate = option.setDate;
		this._attachEvents();
	};

	DatepickerBehavior.prototype = {

		constructor: DatepickerBehavior,

		_attachEvents: function(){
			this.element.on("click", $.proxy(this._doClick, this))
						.on("blur mousedown", $.proxy(this._doValidate, this))
						.on("keydown", $.proxy(this._doKeydown, this));
		},
		_doClick: function(){
			var input = $(this.element);
			var value = input.val(); 						
			var start = input.prop('selectionStart');
			input.data("originalDate", value);
			this._resetInputData();
			this._showField(start);
		},
		_doValidate: function() {
			var input = $(this.element);
			var value = input.val(); 						 
			var validate = this._parseDateYMD(value);
			if(!validate) {
				this.setDate(input.data("originalDate"));
			}
		},
		_doKeydown: function(ev){
			var dateText;
			var input = $(this.element);
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
					dateText = this._combineDate(yearPositionStart, newYear, value);
					this.setDate(dateText);
					// Change Position
					if (year.fourthDigits == null) {
						this._showField(yearPositionStart);
					} 
					else {
						this._showField(monthPositionStart);
						this._resetInputData();
					}
				} 
				if(start == monthPositionStart) {
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
					dateText = this._combineDate(monthPositionStart, newMonth, value);
					this.setDate(dateText);

					// Change Position
					if (month.secondDigits == null) {
						this._showField(monthPositionStart);
					} 
					else {
						this._showField(dayPositionStart);
						this._resetInputData();
					}
				} 
				if(start == dayPositionStart){
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
					dateText = this._combineDate(dayPositionStart, newDay, value);
					this.setDate(dateText);
					this._showField(dayPositionStart);

					// Change Position
					if (day.secondDigits != null) {
						this._resetInputData();
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
					dateText = this._combineDate(yearPositionStart, newYear, value);
					this.setDate(dateText);
					this._showField(yearPositionStart);
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
					dateText = this._combineDate(monthPositionStart, newMonth, value);
					this.setDate(dateText);
					this._showField(monthPositionStart);
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
					dateText = this._combineDate(dayPositionStart, newDay, value);
					this.setDate(dateText);
					this._showField(dayPositionStart);
				}
			}
			// Tab and Left/Right arrow Key to move selected position
			if (ev.keyCode == 9 || ev.keyCode == 37 || ev.keyCode == 39) {
				ev.preventDefault();
				if (start == yearPositionStart) { // Selected on year position
					if(ev.keyCode == '9' || ev.keyCode == '39') {
						this._resetInputData();
						this._showField(monthPositionStart);
					}
				} else if (start == monthPositionStart) { // Selected on month position
					if(ev.keyCode == '37') {
						this._resetInputData();
						this._showField(yearPositionStart);
					} else {
						this._resetInputData();
						this._showField(dayPositionStart);
					}
				} else if (start == dayPositionStart) { // Selected on day position
					if(ev.keyCode == '37') {
						this._resetInputData();
						this._showField(monthPositionStart);
					}	
				} 
			}
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
		_combineDate: function(startIdx, newDate, fullDate){
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
		},
		_resetInputData: function(){
			this.element.removeData("firstDigits");
			this.element.removeData("secondDigits");
			this.element.removeData("thirdDigits");
			this.element.removeData("fourthDigits");
		},
		_showField: function( startIdx ) {
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


// TimePicker Behavior Plugin
// ========================
(function($) {

	// Third Party TimeEntry Plugin Extend
	// ========================

	var _this = this;
	var plugin = $.timeEntry;
    var extensionKeydown = {
		_doKeyDown: function(event){
			if (event.keyCode >= 48) { // >= '0'
				return true;
			}
			var inst = plugin._getInst(event.target);
			switch (event.keyCode) {
				case 9: return (inst.options.tabToExit ? true : (event.shiftKey ?
							// Move to previous time field, or out if at the beginning
							plugin._changeField(inst, -1, true) :
							// Move to next time field, or out if at the end
							plugin._changeField(inst, +1, true)));
				case 35: if (event.ctrlKey) { // Clear time on ctrl+end
							plugin._setValue(inst, '');
						}
						else { // Last field on end
							inst._field = Math.max(1, inst._secondField, inst._ampmField);
							plugin._adjustField(inst, 0);
						}
						break;
				case 36: if (event.ctrlKey) { // Current time on ctrl+home
							plugin._setTime(inst);
						}
						else { // First field on home
							inst._field = 0;
							plugin._adjustField(inst, 0);
						}
						break;
				case 37: plugin._resetInputTime(); plugin._changeField(inst, -1, false); break; // Previous field on left
				case 38: plugin._adjustField(inst, +1); break; // Increment time field on up
				case 39: plugin._resetInputTime(); plugin._changeField(inst, +1, false); break; // Next field on right
				case 40: plugin._adjustField(inst, -1); break; // Decrement time field on down
				case 46: plugin._setValue(inst, ''); break; // Clear time on delete
				case 8: inst._lastChr = ''; // Fall through
				default: return true;
			}
			return false;
		},
		_resetInputTime: function(){
			var inst = plugin._getInst(event.target);
			inst.elem.removeData("firstDigits");
			inst.elem.removeData("secondDigits");
		}
    };
    $.extend(true, $.timeEntry.__proto__, extensionKeydown);


    // TimePickerBehavior
	// ========================
	var TimepickerBehavior = function(element, option) {

		this.input = element;   // Original javascript DOM
		this.element = $(element);  // jQuery DOM
		this.setTime = option.setTime;
		this._attachEvents();
	};

	
	TimepickerBehavior.prototype = {
		constructor: TimepickerBehavior,
		_attachEvents: function(){
			this.element.on("keydown", $.proxy(this._doKeydown, this));
		},
		_doKeydown: function(ev) {
			var timeText;
			var input = $(this.element);
			var value = input.val();            // Get value of time input 
			var getHours = value.substring(0,2);      // Get Hours value
			var getMinutes = value.substring(3,5);        // Get Minutes value
			var getSeconds = value.substring(6,8);      // Get Seconds value
			var start = input.prop('selectionStart');   // Get the keydown start position
			var enterNum = String.fromCharCode(ev.keyCode); // Get the digits 
			var hoursPosition = 0;              // Get input hours position index
			var minutesPosition = 3;              // Get input minutes position index
			var secondsPosition = 6;             // Get input seconds position index

			// Allow: Ctrl/cmd+C
			if (ev.keyCode == 67 && (ev.ctrlKey === true || ev.metaKey === true)){
			  	return;
			}

			if ((ev.shiftKey || (ev.keyCode < 48 || ev.keyCode > 57)) && (ev.keyCode < 96 || ev.keyCode > 105)) {
				ev.preventDefault();
			} else {
				ev.preventDefault();

				if(start == hoursPosition) {

				  var hours = input.data();
				  if (hours.firstDigits == null) {
				    hours.firstDigits = enterNum;
				    var newHours = `0${hours.firstDigits}`;
				  } else {
				    hours.secondDigits = enterNum;
				    var newHours = hours.firstDigits + hours.secondDigits;
				    if (parseInt(newHours) > 23) {
				      newHours = 23;
				    }
				  }
				  // Update time value
				  timeText = this._combineTime(hoursPosition, newHours, value);
				  this.setTime(timeText);
				  // Change Position
				  if (hours.secondDigits == null) {
				    this._showTimeField(hoursPosition);
				  } 
				  else {
				    this._showTimeField(minutesPosition);
				    input.trigger('click.timeEntry');
				    this._resetInputTime();
				  }
				}
				else if(start == minutesPosition){   

				  var minutes = input.data();
				  if (minutes.firstDigits == null) {
				    minutes.firstDigits = enterNum;
				    var newMinutes = `0${minutes.firstDigits}`;
				  } else {
				    minutes.secondDigits = enterNum;
				    var newMinutes = minutes.firstDigits + minutes.secondDigits;
				    if (parseInt(newMinutes) > 59) {
				      newMinutes = "00";
				    }
				  }
				   // Update time value
				  timeText = this._combineTime(minutesPosition, newMinutes, value);
				  this.setTime(timeText);
				  // Change Position
				  if (minutes.secondDigits == null) {
				    this._showTimeField(minutesPosition);
				  } 
				  else {
				    this._showTimeField(secondsPosition);
				    input.trigger('click.timeEntry');
				    this._resetInputTime();
				  }
				}
				else if(start == secondsPosition){
				  var seconds = input.data();
				  if (seconds.firstDigits == null) {
				    seconds.firstDigits = enterNum;
				    var newSeconds = `0${seconds.firstDigits}`;
				  } else {
				    seconds.secondDigits = enterNum;
				    var newSeconds = seconds.firstDigits + seconds.secondDigits;
				    if (parseInt(newSeconds) > 59) {
				      newSeconds = "00";
				    }
				  }
				  // Update time value
				    timeText = this._combineTime(secondsPosition, newSeconds, value);
				    this.setTime(timeText);
				  // Change Position
				  if (seconds.secondDigits != null) {
				    this._showTimeField(secondsPosition);
				    this._resetInputTime();
				  }
				}
			}
		},
		_resetInputTime: function(){
			this.element.removeData("firstDigits");
			this.element.removeData("secondDigits");
		},
		_combineTime: function(startIdx, newTime, fullTime){
			var timeText;
			switch(startIdx) {
				case 0:
					timeText = newTime + fullTime.substring(2);
					break;
				case 3:
					timeText = fullTime.substring(0, 3) + newTime + fullTime.substring(5);
					break;
				case 6:
					timeText = fullTime.substring(0, 6) + newTime;
			}
			return timeText;
		},
		_showTimeField: function( startIdx ) {
			var start = 0;
			var end = 0
			var hoursPosition = 0;              // Get input hours position index
			var minutesPosition = 3;              // Get input minutes position index
			var secondsPosition = 6;             // Get input seconds position index
			switch(startIdx) {
			case 0:
				start = hoursPosition;
				end = start + 2;
				break;
			case 3:
				start = minutesPosition;
				end = start + 2;
				break;
			case 6:
				start = secondsPosition;
				end = start + 2;
			}
			this.input.setSelectionRange(start, end);
		}
	};

	$.fn.timepickerBehavior = function (option) {

		return this.each(function () {
	      var $this   = $(this);
	      var data    = $this.data('timepickerBehavior');
	      var options = typeof option == 'object' && option;
	      if (!data) $this.data('timepickerBehavior', (data = new TimepickerBehavior(this, options)));
	    });
	};

})(jQuery);