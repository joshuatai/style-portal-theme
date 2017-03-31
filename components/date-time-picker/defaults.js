var _this = this;

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
	var yearPosition = {
		start: 0,
		end: 4,
		length: 4,
		indicate: 'Y'
	}
	var monthPosition = {
		start: 5,
		end: 7,
		length: 2,
		indicate: 'M'
	}
	var datePosition = {
		start: 8,
		end: 10,
		length: 2,
		indicate: 'D'
	}
	

	var DatepickerBehavior = function(element, option) {
		this.options = option;
		this.input = element;   // Original javascript DOM
		this.element = $(element);  // jQuery DOM
		this.iconLabel = this.element.next();
		//this.change = option.change || function () {};
		var value = this.element.val();
		value.match(dateReg,'$1');

		this.splitter = RegExp.$1;		
		//this.picker = option.picker? option.picker : $();
		//this.pickerFocus = false;
		this.orgY = parseInt(value.substring(0,4), 10);
		this.orgM = parseInt(value.substring(5,7), 10); 
		this.orgD = parseInt(value.substring(8,10), 10);
		this.tmpY = [];
		this.tmpM = [];
		this.tmpD = [];
		this._attachEvents();
		/*
		this.picker
			.on('mousehover', function () {
				this.pickerFocus = true;
			})
			.on('mouseout', function () {
				this.pickerFocus = false;
			})*/

		
		//this._iconChange();
	};
	
	DatepickerBehavior.prototype = {

		constructor: DatepickerBehavior,

		_attachEvents: function(){
			var _this = this;

			this.element
				// .on('focus', function (e) {				
				// 	e.preventDefault();
				// 	e.stopPropagation();
				// })
				// .on('select', function (e) {					
				// 	e.preventDefault();
				// 	e.stopPropagation();
				// })
				// .on('focus', $.proxy(this._doFocus, this))
				.on('click', $.proxy(this._doClick, this))				
				.on('keydown', $.proxy(this._doKeydown, this))
				.on('blur', $.proxy(this._doBlur, this));
			//this.element							 .on('copy', $.proxy(this._doCopy, this))	
			// 			.on('paste', $.proxy(this._doPaste, this))
			 			//.on("keydown", $.proxy(this._doKeydown, this));				
						
			//$(document).on('click', $.proxy(this._doBlur, this));
			$(document).on('click', function (e) {
				var target = $(e.target);
				var container = target.closest('.input-icon-group');
				var datepickerInput = container.children('input');
				if(target.is('.input-icon-group') || datepickerInput.length === 0 || !datepickerInput.is(_this.element)) {
					_this.element.trigger($.Event('unedit'));
				}
			});

		},
		_doFocus: function (e) {
			// var input = this.element;//.addClass('input-focus');
			// var value = input.val();
			// var start = input.prop('selectionStart');
			// var end = input.prop('selectionEnd');
			// console.log(start, end)
		},
		_doClick: function (e) {			
			var input = this.element;
			var value = input.val();
			var start = input.prop('selectionStart');
			var end = input.prop('selectionEnd');
			var position = this._getChunkPosition(start, end);			
			if (!this._tmpCheck(position)) {
				this.orgY = parseInt(value.substring(0,4), 10); 				// Get year value
				this.orgM = parseInt(value.substring(5,7), 10);  			// Get month value
				this.orgD = parseInt(value.substring(8,10), 10); 			// Get day value
				this.tmpY = [];
				this.tmpM = [];
				this.tmpD = [];
			} 
			if (position.indicate) {
				this._showField(position);
				this.element.trigger($.Event('edit'), [value]);
			}						
		},		
		_getChunkPosition: function (start, end) { //lock
			var position = {};			
			if (start >= 0 && start <= 4 && end >= 0 && end <= 4) {
				position = yearPosition;				
			} else if (start >= 5 && start <= 7 && end >= 5 && end <= 7) {
				position = monthPosition;	
			} else if (start >= 8 && start <= 10 && end >= 8 && end <= 10) {
				position = datePosition;
			}			
			return position;
		},
		_doBlur: function (e) { //lock
			var target = $(e.target);
			this._tmpCheck({});			
		},		
		_doPaste: function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		},
		_change: function (date) {			
    		this.element.trigger($.Event('change'), [date]);
		},
		_tmpCheck: function (position) {//lock
			var indicate = position.indicate;
			if ((this.tmpY && this.tmpY.length > 0) || (this.tmpM && this.tmpM.length > 0) || (this.tmpD && this.tmpD.length > 0)) {
				if (indicate) {
					if (indicate !== 'Y' && this.tmpY.length > 0) {
						this._correctVal(yearPosition);
						return true;
					}
					if (indicate !== 'M' && this.tmpM.length > 0) {
						this._correctVal(monthPosition);
						return true;
					}
					if (indicate !== 'D' && this.tmpD.length > 0) {
						this._correctVal(datePosition);	
						return true;
					}
				} else {
					if (this.tmpY.length > 0) this._correctVal(yearPosition);
					if (this.tmpM.length > 0) this._correctVal(monthPosition);
					if (this.tmpD.length > 0) this._correctVal(datePosition);
				}				
			}
			return false;
		},
		_correctVal: function(position) {//lock
			var dateText;
			if (this._useTemp(position.indicate) != undefined) {
				dateText = this._calculator(position.indicate);				
				this.element.val(dateText);
				this._change(dateText);				
			}
		},
		_useTemp: function (indicate) { //lock
			var tmp = this['tmp' + indicate];
			var returnVal;
			if (tmp.length > 0) {				
				this['org' + indicate] = returnVal = parseInt(tmp.join(''), 10);
				this['tmp' + indicate] = [];			
			}
			return returnVal;
		},
		_doUpDown: function (e, position) {//lock
			var dateText;
			if (position.indicate === 'Y') {				
				this._useTemp('Y');
				if (e.keyCode == '40') { // keydown
					this.orgY--;
				} 
				else { // keyup
					this.orgY++;
				}				
			} else if (position.indicate === 'M') {								
				this._useTemp('M');
				if (e.keyCode == '40') { //keydown
					this.orgM--;
				} else { //keyup
					this.orgM++;
				}
			} else if (position.indicate === 'D') {							
				this._useTemp('D');
				if (e.keyCode == '40') { //keydown
					this.orgD--;
				} else { //keyup
					this.orgD++;
				} 
			}
			dateText = this._calculator(position.indicate);
			this.element.val(dateText);
			this._change(dateText);
			this._showField(position);		
		},
		_doLeftRight: function (e, position) {//lock
			if (position.indicate === 'Y') { // Selected on year position					
				if(e.keyCode == '9' || e.keyCode == '39') {
					this._correctVal(yearPosition);									
					this._showField(monthPosition);
				}
			} else if (position.indicate === 'M') { // Selected on month position				
				this._correctVal(monthPosition);
				if(e.keyCode == '37') {						
					this._showField(yearPosition);
				} else {	
					this._showField(datePosition);
				}
			} else if (position.indicate === 'D') { // Selected on day position
				if(e.keyCode == '37') {						
					this._correctVal(datePosition);
					this._showField(monthPosition);
				}	
			} 			
		},
		_doKeyNumber: function (enterNum, position) {//lock
			var dateText;			
			var splitter = this.splitter;
			if(position.indicate === 'Y'){
				var year = this.tmpY;	
				if (enterNum) {
					if(!year[0]) {						
						year[0] = enterNum;						
					} else if (!year[1]) {
						year[1] = enterNum;						
					} else if (!year[2]) {
						year[2] = enterNum;
					} else if (!year[3]) {
						year[3] = enterNum;
					}
				}
				if (year.length === 4) {
					this.orgY = year.join('');
					dateText = this._calculator(position.indicate);	
					position = monthPosition;					
					this.tmpY = [];	
					this._change(dateText);				
				} else {
					dateText = pad(year.join(''), 4) + splitter + pad(this.orgM, 2) + splitter + pad(this.orgD, 2);
				}
			} else if(position.indicate === 'M') {
				var month = this.tmpM;
				if (enterNum) {
					if(!month[0]) {
						month[0] = enterNum;												
					} else if (!month[1]) {
						month[1] = enterNum;
					}
				}
				if ((month[0] > 1 && month[0] < 10) || month.length === 2) {
					this.orgM = month.join('');
					dateText = this._calculator(position.indicate);	
					position = datePosition;					
					this.tmpM = [];		
					this._change(dateText);			
				} else {					
					dateText = pad(this.orgY, 4) + splitter + pad(month[0], 2) + splitter + pad(this.orgD, 2);					
					if (month[0] == 1) {
						this._change(dateText);
					}
				}					
			} else if (position.indicate === 'D') {
				var date = this.tmpD;
				if (enterNum) {
					if(!date[0]) {
						date[0] = enterNum;
					} else if (!date[1]) {
						date[1] = enterNum;
					}
				}				
				if (date.length === 2) {
					this.orgD = date.join('');
					dateText = this._calculator(position.indicate);
					position = datePosition;					
					this.tmpD = [];		
					this._change(dateText);		
				} else {
					dateText = pad(this.orgY, 4) + splitter + pad(this.orgM, 2) + splitter + pad(date[0], 2);
					if (date[0] > 0) {
						this._change(dateText);
					}
				}				
			}
			// Update date value						
			this.element.val(dateText);			
			this._showField(position);
		},
		_doBack: function (position) {
			
			// var indicate = position.indicate;
			// var tmp = this['tmp' + indicate];
			
			// if (tmp.length > 0) {
			// 	tmp.pop();
			// } 	
			// if (tmp.length === 0) {
			// 	this['org' + indicate] = pad(0, position.length)
			// }
			// this._doKeyNumber(null, position);
		},
		_doKeydown: function (e) {			
			var input = this.element;//.addClass('input-focus');			
			var start = input.prop('selectionStart');
			var end = input.prop('selectionEnd');
			var position = this._getChunkPosition(start, end);			
			var enterNum = e.key;			
			var splitter = this.splitter;
			var dateText;
			var showFieldPosition;

			if (position.indicate) {
				// Up/Down arrow Key to change the digits
				if (e.keyCode == 40 || e.keyCode == 38) { //lock
					this._doUpDown(e, position);
				}
				// Tab and Left/Right arrow Key to move selected position
				if (e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 39) {				
					this._doLeftRight(e, position);
				}
				// Insert Number
				if (/^\d$/.test(enterNum)) {
					this._doKeyNumber(enterNum, position);
			    } else {
			    	// Allow: Ctrl/cmd+C
					if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;

					// Allow: Delete/Backword
					// if (e.keyCode === 8 || e.keyCode === 46) {
					// 	this._doBack(position);
					// }
			    	return false;
			    }
			} else {
				// // Allow: Ctrl/cmd+C
				if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;

		    	return false;
			}
			return false;
		},		
		_calculator: function (indicate) { //lock
			var splitter = this.splitter;
			var lastDate;
			
			if (indicate === 'Y') {
				if (this.orgY < minYear) this.orgY = minYear;
				if (this.orgY > maxYear) this.orgY = maxYear;
			} 
		    if (indicate === 'M') {		    	
		    	if (this.orgM < 1) {
		    		if (this.orgY > minYear) {
		    			this.orgM = 12;
		    			this.orgY--;
		    		} else {
		    			this.orgM = 1;
		    		}
		    	}
		    	if (this.orgM > 12) {
		    		if (this.orgY < maxYear) {
		    			this.orgM = 1;
		    			this.orgY++;
		    		} else {
		    			this.orgM = 12;
		    		}
		    	}		    	
	    		lastDate = moment(this.orgY + '/' + this.orgM).endOf('month')._d.getDate();
	    		if (this.orgD > lastDate) this.orgD = lastDate;		    	
			}
			if (indicate === 'D') {
				if (this.orgD < 1) {
					if (this.orgY === minYear && this.orgM === 1) {
						this.orgD = 1;
					} else {
						if (this.orgM === 1) {
							this.orgY--;
							this.orgM = 12;
							this.orgD = 31;
						} else {
							this.orgM--;
							this.orgD = moment(this.orgY + '-' + this.orgM).endOf('month')._d.getDate();
						}
					}
				}
				lastDate = moment(this.orgY + '/' + this.orgM).endOf('month')._d.getDate();
				if (this.orgD > lastDate) {
					if (this.orgY === maxYear && this.orgM === 12) {
						this.orgD = 31;
					} else {
						if (this.orgM === 12) {
							this.orgY++;
							this.orgM = 1;
							this.orgD = 31;
						} else {
							this.orgM++;
							this.orgD = 1;
						}
					}
				}
			}			
			return pad(this.orgY, 4) + splitter + pad(this.orgM, 2) + splitter + pad(this.orgD, 2);
		},
		_showField: function( position ) { //lock
			var _this = this;
			this.input.setSelectionRange(position.start, position.end);
			setTimeout(function () {				
				_this.input.setSelectionRange(position.start, position.end);							
			}, 20);
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