var _this = this;
/*
var extensionChangeIcon = {
	iconChange: function(){
		$(".datepicker .prev", _this).find("i").attr('class', 'fa fa-angle-left');
		$(".datepicker .next", _this).find("i").attr('class', 'fa fa-angle-right');
	}
};

console.log($.fn.datepicker.Constructor.prototype)
$.fn.datepicker.Constructor.prototype = $.extend(true, $.fn.datepicker.Constructor.prototype, extensionChangeIcon);

*/

// TimePicker Behavior Plugin
// ========================
(function($) {

	// Extend the third party "TimeEntry"
	// ========================
	// In order to make sure the user only enter the one digite and move to next chunk, add resetInputTime() at case37 and case39 to clear the data of the input.
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
		this.options = option;
		this.change = option.change || function () {};
		this.element.val().match(dateReg,'$1');
		this.splitter = RegExp.$1;
		this.tmpYear = [];
		this.tmpMonth = [];
		this.tmpDate = [];
		this._attachEvents();
		this._iconChange();
	};
	
	DatepickerBehavior.prototype = {

		constructor: DatepickerBehavior,

		_attachEvents: function(){
			this.element.on("click", $.proxy(this._doClick, this))
						.on('paste', $.proxy(this._doPaste, this))
						.on("keydown", $.proxy(this._doKeydown, this))
						.on("focus mousedown", $.proxy(this._doClick, this))
						
						// .on("blur mousedown", $.proxy(this._doValidate, this))
						

			// $(document).on('mouseup', $.proxy(this._doSelection, this));
			

		},
		// _doSelection: function (e) {
		//     if ($(e.toElement).is(this.element)) return false;
		// 	if (this.element.is(':focus')) {
		// 		this._doClick();
		// 	}
		// },
		// _doMousedown: function (e) {
		//  	var input = this.element;
		// 	var value = input.val();
		// 	var start = input.prop('selectionStart');
		// 	var selectionAt = this._showField(start);
			
		// 	/*if (selectionAt === 'Y' && this.tmpYear && this.tmpYear.length > 0) {
		// 		e.preventDefault();
		// 		e.stopPropagation();
		// 		console.log('d')
		// 	}*/
		// },
		_doClick: function(e) {
			var input = this.element;
			var value = input.val();
			var start = input.prop('selectionStart');
			// var splitter = this.splitter;

			// if (this._getChunkPosition(start).indicate === 'Y' && this.tmpYear && this.tmpYear.length > 0) {
			// 	this.element.val(pad(this.tmpYear.join(''), 4) + splitter + pad(this.orgMonth, 2) + splitter + pad(this.orgDate, 2));	
			// } else {
			this.orgYear = parseInt(value.substring(0,4), 10); 				// Get year value
			this.orgMonth = parseInt(value.substring(5,7), 10);  			// Get month value
			this.orgDate = parseInt(value.substring(8,10), 10); 			// Get day value
			this.tmpYear = [];
			this.tmpMonth = [];
			this.tmpDate = [];
			// }
			this._showField(start);
		},
		_iconChange: function (e) {
			var instance = this.element.data('datepicker');		
			this.picker = instance? instance.picker : $();
			$(".prev", this.picker).find("i").attr('class', 'fa fa-angle-left');
			$(".next", this.picker).find("i").attr('class', 'fa fa-angle-right');
		},
		_doPaste: function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		_useTemp: function (unit) {
			var tmp = this['tmp' + unit];
			var returnVal;
			if (tmp.length > 0) {				
				this['org' + unit] = parseInt(tmp.join(''), 10);				
				this['tmp' + unit] = [];
				returnVal = this['org' + unit];
			} 

			return returnVal;
		},
		_doKeydown: function(e){
			var input = this.element;
			var display = this.options.display;
			var start = input.prop('selectionStart');		// Get the keydown start position			
			var enterNum = e.key;
			//var enterNum = String.fromCharCode(e.keyCode); // Get the digits 
			var splitter = this.splitter;
			var dateText;
			var showFieldPosition;

			if (display !== 'show' && this.picker.is(':visible')) return false;
			
			// Allow: Ctrl/cmd+C
			if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;

			// Allow: Delete/Backword
			//if (e.keyCode === 8 || e.keyCode === 46) this._resetVal(start);

			// Up/Down arrow Key to change the digits
			if (e.keyCode == 40 || e.keyCode == 38) {
				e.preventDefault();
				if (start === yearPositionStart) {
					showFieldPosition = yearPositionStart;	
					this._useTemp('Year');				
					if (e.keyCode == '40') { // keydown
						this.orgYear--;
					} 
					else { // keyup
						this.orgYear++;
					}
				} else if (start == monthPositionStart) {
					showFieldPosition = monthPositionStart;					
					this._useTemp('Month');
					if (e.keyCode == '40') { //keydown
						this.orgMonth--;
					} else { //keyup
						this.orgMonth++;
					}
				} else if (start == datePositionStart) {
					showFieldPosition = datePositionStart;					
					this._useTemp('Date');
					if (e.keyCode == '40') { //keydown
						this.orgDate--;
					} else { //keyup
						this.orgDate++;
					} 
				}
				dateText = this._calculator(showFieldPosition);
				//this.setDate(dateText);
				this.element.val(dateText);
				this._showField(showFieldPosition);
				this.change(dateText);
				return false;
			}
			// Tab and Left/Right arrow Key to move selected position
			if (e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 39) {				
				if (start == yearPositionStart) { // Selected on year position					
					if(e.keyCode == '9' || e.keyCode == '39') {
						if (this._useTemp('Year') != undefined) {
							dateText = this._calculator(yearPositionStart);
							// this.setDate(dateText);
							this.element.val(dateText);
						}												
						this._showField(monthPositionStart);
					}
				} else if (start == monthPositionStart) { // Selected on month position					
					if (this._useTemp('Month') != undefined) {						
						dateText = this._calculator(monthPositionStart);
						// this.setDate(dateText);
						this.element.val(dateText);
					}
					if(e.keyCode == '37') {						
						this._showField(yearPositionStart);
					} else {	
						this._showField(datePositionStart);
					}
				} else if (start == datePositionStart) { // Selected on day position
					if(e.keyCode == '37') {
						if (this._useTemp('Date') != undefined) {
							dateText = this._calculator(datePositionStart);
							// this.setDate(dateText);
							this.element.val(dateText);
						}
						this._showField(monthPositionStart);
					}	
				} 
				e.preventDefault();
				return false;
			}
			// Ensure that it is a number and stop the keydown	
			e.preventDefault();
			if (/^\d$/.test(enterNum)) {
				if(start === yearPositionStart){
					var year = this.tmpYear;
					showFieldPosition = yearPositionStart;
					if(!year[0]) {						
						year[0] = enterNum;						
					} else if (!year[1]) {
						year[1] = enterNum;						
					} else if (!year[2]) {
						year[2] = enterNum;
					} else if (!year[3]) {
						year[3] = enterNum;
					}
					if (year.length === 4) {
						this.orgYear = year.join('');
						dateText = this._calculator(showFieldPosition);	
						showFieldPosition = monthPositionStart;	
						this.tmpYear = [];		
						this.change(dateText);
					} else {
						dateText = pad(year.join(''), 4) + splitter + pad(this.orgMonth, 2) + splitter + pad(this.orgDate, 2);
					}
				} else if(start == monthPositionStart) {
					var month = this.tmpMonth;					
					showFieldPosition = monthPositionStart;
					if(!month[0]) {
						month[0] = enterNum;												
					} else if (!month[1]) {
						month[1] = enterNum;
					}
					if (month.length === 2) {
						this.orgMonth = month.join('');
						dateText = this._calculator(showFieldPosition);	
						showFieldPosition = datePositionStart;	
						this.tmpMonth = [];		
						this.change(dateText);
					} else {
						dateText = pad(this.orgYear, 4) + splitter + pad(month[0], 2) + splitter + pad(this.orgDate, 2);
					}					
				} else if (start == datePositionStart) {
					var date = this.tmpDate;					
					showFieldPosition = datePositionStart;
					if(!date[0]) {
						date[0] = enterNum;												
					} else if (!date[1]) {
						date[1] = enterNum;
					}
					if (date.length === 2) {
						this.orgDate = date.join('');
						dateText = this._calculator(showFieldPosition);							
						this.tmpDate = [];
						this.change(dateText);
					} else {
						dateText = pad(this.orgYear, 4) + splitter + pad(this.orgMonth, 2) + splitter + pad(date[0], 2);
					}
					
				}
				// Update date value						
				this.element.val(dateText);
				this._showField(showFieldPosition);

		    } else {
		    	return false;
		    }		    
		},		
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
		_resetInputData: function() {
			// this.element.removeData("firstDigits");
			// this.element.removeData("secondDigits");
			// this.element.removeData("thirdDigits");
			// this.element.removeData("fourthDigits");
		},
		_getChunkPosition: function (startIdx) {
			var position = {};
			if (startIdx <= 4) {
				position.start = yearPositionStart;
				position.end = yearPositionStart + 4;
				position.indicate = "Y"
			} else if (startIdx >= 5 && startIdx <= 7 ) {
				position.start = monthPositionStart;
				position.end = monthPositionStart + 2;
				position.indicate = "M"
			} else if (startIdx >= 8 && startIdx <= 10 ) {
				position.start = datePositionStart;
				position.end = datePositionStart + 2;
				position.indicate = "D"
			}
			return position;
		},
		_showField: function( startIdx ) {
			var position = this._getChunkPosition(startIdx);
			this.input.setSelectionRange(position.start, position.end);
		}
	};

	$.fn.datepickerBehavior = function (option) {
		return this.each(function () {
	      var $this   = $(this);
	      var data    = $this.data('datepickerBehavior');
	      var options = typeof option == 'object' && option;
	      if (!data) $this.data('datepickerBehavior', (data = new DatepickerBehavior(this, options)));
	      if (option === 'iconChange') data.iconChange();
	    });
	};
})(jQuery);