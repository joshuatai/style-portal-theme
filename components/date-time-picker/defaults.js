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
			var enterNum = ev.key; // Get the digits 
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
(($) => {

	const MIN_YEAR = 1900;
	const MAX_YEAR = 9999;
	const DATE_REG = /\d{4}(\D{1})\d{2}(\D{1})\d{2}/;
	const KEY = {
		DOWN: 'D',
		UP: 'U',
		LEFT: 'L',
		RIGHT: 'R',
		TAB: 'T'
	}
	const Y_POS = {
		start: 0,
		end: 4,
		length: 4,
		indicate: 'Y',
		prev: () => null,
		next: () => M_POS
	}
	const M_POS = {
		start: 5,
		end: 7,
		length: 2,
		indicate: 'M',
		prev: () => Y_POS,
		next: () => D_POS	
	}
	const D_POS = {
		start: 8,
		end: 10,
		length: 2,
		indicate: 'D',
		prev: () => M_POS,
		next: () => null
	}
	
	/* Utilities */
	function pad (num, n) {

		var len = num.toString().length;
		while (len < n) {
			num = "0" + num;
			len++;
		}
		return num; 

	}

	function getChunkPosition (start, end) {

		var position = {};
		if (start >= 0 && start <= 4 && end >= 0 && end <= 4) {
			position = Y_POS;				
		} else if (start >= 5 && start <= 7 && end >= 5 && end <= 7) {
			position = M_POS;	
		} else if (start >= 8 && start <= 10 && end >= 8 && end <= 10) {
			position = D_POS;
		}
		return position;

	}

	function getChunkNumber (value, position) {

		return parseInt(value.substring(position.start, position.end), 10);

	}

	function getLastDate (year, month) {
		
		return moment(`${pad(year, 4)}-${pad(month, 2)}-01`).endOf('month')._d.getDate();

	}
	
	function textReplace (year, month, date, splitter) {
		
		return pad(year, 4) + splitter + pad(month, 2) + splitter + pad(date, 2);
	
	}

	// Constructor
	function DatepickerBehavior (element, option) {

		this.options = option;
		this.input = element;   // Original javascript DOM
		this.element = $(element);  // jQuery DOM
		this.iconLabel = this.element.next(); // Dependent DOM

		var value = this.element.val();

		// To extract user splitter
		value.match(DATE_REG,'$1');
		this.splitter = RegExp.$1;
		
		// Initial varaibles
		this.orgY = getChunkNumber(value, Y_POS);
		this.orgM = getChunkNumber(value, M_POS);
		this.orgD = getChunkNumber(value, D_POS);
		this.tmpY = [];
		this.tmpM = [];
		this.tmpD = [];

		// Bind events
		this._attachEvents();

	};
	
	DatepickerBehavior.prototype = {

		constructor: DatepickerBehavior,

		_attachEvents: function() {

			var _this = this;

			this.element
				.on('click', $.proxy(this._doEdit, this))
				.on('keydown', $.proxy(this._doKeydown, this))
				.on('blur', $.proxy(this._doBlur, this));

			$(document).on('click', $.proxy(this._doUnEdit, this));

		},

		_doEdit: function (e) {

			var input = this.element;
			var value = input.val();
			var start = input.prop('selectionStart');
			var end = input.prop('selectionEnd');
			var position = getChunkPosition(start, end);	

			if (!this._tmpCheck(position)) {

				this.orgY = getChunkNumber(value, Y_POS);
				this.orgM = getChunkNumber(value, M_POS);
				this.orgD = getChunkNumber(value, D_POS);
				this.tmpY = [];
				this.tmpM = [];
				this.tmpD = [];

			}

			if (position.indicate) {
				this._showField(position);
				this._edit(input.val());				
			}

		},

		_doUnEdit: function (e) {

			var target = $(e.target);
			var container = target.closest('.input-icon-group');
			var datepickerInput = container.children('input');

			if(target.is('.input-icon-group') || datepickerInput.length === 0 || !datepickerInput.is(this.element)) {
				this._unedit();
			}

		},

		_doKeydown: function (e) {

			var input = this.element;			
			var start = input.prop('selectionStart');
			var end = input.prop('selectionEnd');
			var position = getChunkPosition(start, end);	
			var enterNum = e.key;
			var splitter = this.splitter;
			var dateText;
			
			if (position.indicate) {

				// Up/Down arrow Key to change the digits
				if (e.keyCode == 40) this._doUpDown(KEY.DOWN, position);
				else if (e.keyCode == 38) this._doUpDown(KEY.UP, position);

				// Tab and Left/Right arrow Key to move selected position
				if (e.keyCode == 39) {
					this._doLeftRight(KEY.RIGHT, position);
				} else if (e.keyCode == 37) {
					this._doLeftRight(KEY.LEFT, position);
				} else if (e.keyCode == 9) {
					if (e.shiftKey === true) this._doLeftRight(KEY.LEFT, position);
						else this._doLeftRight(KEY.RIGHT, position);
				}
				
				// Insert Number
				if (/^\d$/.test(enterNum)) {

					this._doInsertNumber(enterNum, position);

			    } else {
			  //   	// Allow: Ctrl/cmd+C
					// if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;

					// // Allow: Delete/Backword
					// // if (e.keyCode === 8 || e.keyCode === 46) {
					// // 	this._doBack(position);
					// // }
					// e.preventDefault();
			  //   	return false;
			    }

			} else {

				// Allow: Ctrl/cmd+C
				if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;

				e.preventDefault();
		    	return false;
			}			

			return false;
		},

		_doUpDown: function (direction, position) {

			var dateText;
			var lastDate;

			this._applyTemp(position.indicate);

			if (position.indicate === 'Y') {

				if (direction === KEY.DOWN) this.orgY > MIN_YEAR ? this.orgY-- : this.orgY === MIN_YEAR ? this.orgY = MAX_YEAR : this.orgY = MIN_YEAR;
					else this.orgY < MAX_YEAR ? this.orgY++ : this.orgY === MAX_YEAR ? this.orgY = MIN_YEAR : this.orgY = MAX_YEAR;

			} else if (position.indicate === 'M') {

				if (direction === KEY.DOWN) this.orgM > 1 ? this.orgM-- : this.orgM === 1 ? this.orgM = 12 : this.orgM = 1;	
					else this.orgM < 12 ? this.orgM++ : this.orgM === 12 ? this.orgM = 1 : this.orgM = 12;

			} else if (position.indicate === 'D') {

				lastDate = getLastDate(this.orgY, this.orgM);

				if (direction === KEY.DOWN) this.orgD > 1 ? this.orgD-- : this.orgD === 1 ? this.orgD = lastDate : this.orgD = 1;
					else this.orgD < lastDate ? this.orgD++ : this.orgD === lastDate ? this.orgD = 1 : this.orgD = lastDate;

			}

			dateText = this._autoCorrect(position.indicate);

			this.element.val(dateText);
			this._showField(position);
			this._change(dateText);
				
		},
		
		_doLeftRight: function (direction, position) {

			if (position.indicate === 'Y') { // Selected on year position	

				if(direction === KEY.RIGHT) {
					this._correctVal(Y_POS);									
					this._showField(Y_POS.next());
				} else {
					this._prev();
				}

			} else if (position.indicate === 'M') { // Selected on month position	

				this._correctVal(M_POS);

				if(direction === KEY.RIGHT) this._showField(M_POS.next());
					else this._showField(M_POS.prev());
				
			} else if (position.indicate === 'D') { // Selected on day position

				if(direction === KEY.LEFT) {						
					this._correctVal(D_POS);
					this._showField(D_POS.prev());
				} else {
					this._next();
				}

			} 			
		},

		_doInsertNumber: function (enterNum, position) {

			var dateText;
			var splitter = this.splitter;
			var tmp = this[`tmp${position.indicate}`];
			tmp.push(enterNum);

			var tmpString = tmp.join('');
			var tmpNumber = parseInt(tmpString, 10);
			var lastDate;

			if(position.indicate === 'Y') {

				if (tmp.length === 4) {

					this[`org${position.indicate}`] = tmpNumber;
					dateText = this._autoCorrect(position.indicate);
					this.element.val(dateText);
					this._showField(position.next());
					this._change(dateText);

				} else {
					
					dateText = textReplace(tmpString, this.orgM, this.orgD, splitter);
					this.element.val(dateText);
					this._showField(position);

				}				

			} else if(position.indicate === 'M') {
				
				if ((tmpNumber > 1 && tmpNumber < 10) || tmp.length === 2) {

					this[`org${position.indicate}`] = tmpNumber;

					if (tmpNumber > 12) this.orgM = 12;
					if (tmpNumber < 1)  this.orgM = 1;

					dateText = this._autoCorrect(position.indicate);
					this.element.val(dateText);
					this._showField(position.next());
					this._change(dateText);

				} else {
					
					dateText = textReplace(this.orgY, tmpString, this.orgD, splitter);					
					this.element.val(dateText);
					this._showField(position);

					if (tmpNumber == 1) {
						this._change(dateText);
					}				

				}	

			} else if (position.indicate === 'D') {

				lastDate = getLastDate(this.orgY, this.orgM);

				if (tmp.length === 2) {

					this[`org${position.indicate}`] = tmpNumber;

					if (tmpNumber > lastDate) this[`org${position.indicate}`] = lastDate;
					if (tmpNumber < 1)  this[`org${position.indicate}`] = 1;

					dateText = this._autoCorrect(position.indicate);

					this.element.val(dateText);
					this._showField(position);
					this._change(dateText);

				} else {

					dateText = textReplace(this.orgY, this.orgM, tmpString, splitter);				

					var lastDate = getLastDate(this.orgY, this.orgM);
					var canContinue = false;

					for (var i = 0; i < 10; i++) {						
						var targetDate = parseInt(tmpString + i.toString(), 10);						
						if (targetDate <= lastDate) canContinue = true;
					}
					
					if (canContinue) {
						this.element.val(dateText);
						this._showField(position);
						if (tmpNumber > 0) {
							this._change(dateText);
						}
					} else {
						this.orgD = tmpNumber;
						dateText = this._autoCorrect(position.indicate);
						this.element.val(dateText);
						this._showField(position);
						this._change(dateText);
					}
				}

			}

		},

		_doFocus: function (e) {
			// var input = this.element;//.addClass('input-focus');
			// var value = input.val();
			// var start = input.prop('selectionStart');
			// var end = input.prop('selectionEnd');
			// console.log(start, end)
		},
		
		_doBlur: function (e) {

			this._tmpCheck({});		

		},	

		_denyPaste: function(e) {

			e.preventDefault();
			e.stopPropagation();
			return false;

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

		/* Events Triggerer */

		_edit: function (date) {

			this.element.trigger($.Event('edit'), [date]);

		},

		_unedit: function () {

			this.element.trigger($.Event('unedit'));

		},
		
		_change: function (date) {

    		this.element.trigger($.Event('change'), [date]);

		},

		_prev: function () {

			this.element.trigger($.Event('prev'), [this.element.val()]);

		},

		_next: function () {

			this.element.trigger($.Event('next'), [this.element.val()]);

		},		

		/* Validators */
		_tmpCheck: function (position) {

			var indicate = position.indicate;

			if (this.tmpY.length > 0 || this.tmpM.length > 0 || this.tmpD.length > 0) {

				if (indicate) {
					if (indicate !== 'Y' && this.tmpY.length > 0) {
						this._correctVal(Y_POS);
						return true;
					}
					if (indicate !== 'M' && this.tmpM.length > 0) {
						this._correctVal(M_POS);
						return true;
					}
					if (indicate !== 'D' && this.tmpD.length > 0) {
						this._correctVal(D_POS);	
						return true;
					}
				} else {
					if (this.tmpY.length > 0) this._correctVal(Y_POS);
					if (this.tmpM.length > 0) this._correctVal(M_POS);
					if (this.tmpD.length > 0) this._correctVal(D_POS);
				}

			}

			return false;

		},

		_correctVal: function (position) {

			var dateText;
			if (this._applyTemp(position.indicate) != undefined) {
				dateText = this._autoCorrect(position.indicate);				
				this.element.val(dateText);
				this._change(dateText);				
			}

		},

		_applyTemp: function (indicate) {

			var tmp = this['tmp' + indicate];			

			if (tmp.length > 0) {
				this['org' + indicate] = parseInt(tmp.join(''), 10);
				this['tmp' + indicate] = [];
				return true;
			}

			return false;

		},

		_autoCorrect: function (indicate) {

			var splitter = this.splitter;
			var lastDate;
			
			if (indicate === 'Y') {

				if (this.orgY < MIN_YEAR) this.orgY = MIN_YEAR;
				if (this.orgY > MAX_YEAR) this.orgY = MAX_YEAR;

				lastDate = getLastDate(this.orgY, this.orgM);
	    		if (this.orgD > lastDate) this.orgD = lastDate;

			}

		    if (indicate === 'M') {

		    	if (this.orgM < 1) {
		    		if (this.orgY > MIN_YEAR) {
		    			this.orgY--;
		    			this.orgM = 12;		    			
		    		} else {
		    			this.orgM = 1;
		    		}
		    	}

		    	if (this.orgM > 12) {
		    		if (this.orgY < MAX_YEAR) {
		    			this.orgM = 1;
		    			this.orgY++;
		    		} else {
		    			this.orgM = 12;
		    		}
		    	}

	    		lastDate = getLastDate(this.orgY, this.orgM);
	    		if (this.orgD > lastDate) this.orgD = lastDate;		

			}

			if (indicate === 'D') {

				if (this.orgD < 1) {

					if (this.orgY === MIN_YEAR && this.orgM === 1) {
						this.orgD = 1;
					} else {
						if (this.orgM === 1) {
							this.orgY--;
							this.orgM = 12;
							this.orgD = 31;
						} else {
							this.orgM--;
							this.orgD = getLastDate(this.orgY, this.orgM);
						}
					}

				} else {

					lastDate = getLastDate(this.orgY, this.orgM);

					if (this.orgD > lastDate) {
						if (this.orgY === MAX_YEAR && this.orgM === 12) {
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
			}

			this[`tmp${indicate}`] = [];

			return pad(this.orgY, 4) + splitter + pad(this.orgM, 2) + splitter + pad(this.orgD, 2);
		},

		_validateTmp: function (indicate) {
			// var splitter = this.splitter;
			// var lastDate;
			// var tmp = this[`tmp${indicate}`];
			// console.log(tmp);
			// if (indicate === 'Y') {

			// 	// if (this.orgY < MIN_YEAR) this.orgY = MIN_YEAR;
			// 	// if (this.orgY > MAX_YEAR) this.orgY = MAX_YEAR;
			// }
		},

		_showField: function( position ) { //lock
			var _this = this;
			this.input.setSelectionRange(position.start, position.end);
			setTimeout(function () {				
				_this.input.setSelectionRange(position.start, position.end);							
			}, 20);
		},

		showField: function(indicate) {
			if (indicate === 'Y') this._showField(Y_POS);
			if (indicate === 'M') this._showField(M_POS);
			if (indicate === 'D') this._showField(D_POS);
		}
	}; 

	$.fn.datepickerBehavior = function (option) {
		var args = Array.apply(null, arguments);
		args.shift();

		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('datepickerBehavior');
			var options = typeof option == 'object' && option;
			if (!data) $this.data('datepickerBehavior', (data = new DatepickerBehavior(this, $.extend({}, $.fn.datepickerBehavior.defaults, options))));	      
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
	    });
	};

	// Bind constructor on the plugin
	$.fn.datepicker.Constructor = DatepickerBehavior;

	$.fn.datepickerBehavior.defaults = {

	};	

})(jQuery);