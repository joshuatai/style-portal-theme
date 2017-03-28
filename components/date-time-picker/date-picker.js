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
		this.tmpYear = [];
		this.tmpMonth = [];
		this.tmpDate = [];

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
			this.tmpYear = [];
			this.tmpMonth = [];
			this.tmpDate = [];

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
			var start = input.prop('selectionStart');		// Get the keydown start position			
			var enterNum = e.key;
			//var enterNum = String.fromCharCode(e.keyCode); // Get the digits 
			var splitter = this.splitter;
			var dateText;
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
				this.setDate(dateText);
				this._showField(showFieldPosition);
				return false;
			}
			// Tab and Left/Right arrow Key to move selected position
			if (e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 39) {				
				if (start == yearPositionStart) { // Selected on year position					
					if(e.keyCode == '9' || e.keyCode == '39') {
						if (this._useTemp('Year') != undefined) {
							dateText = this._calculator(yearPositionStart);
							this.setDate(dateText);
						}												
						this._showField(monthPositionStart);
					}
				} else if (start == monthPositionStart) { // Selected on month position					
					if (this._useTemp('Month') != undefined) {						
						dateText = this._calculator(monthPositionStart);
						this.setDate(dateText);
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
							this.setDate(dateText);
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
					} else {
						dateText = pad(this.orgYear, 4) + splitter + pad(this.orgMonth, 2) + splitter + pad(date[0], 2);
					}
					
				}
				// Update date value						
				this.setDate(dateText);
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
