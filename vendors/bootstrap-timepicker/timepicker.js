/* =========================================================
 * bootstrap-timepicker.js
 * Repo: https://adc.github.trendmicro.com/hie-ui/bootstrap-timepicker
 * =========================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

;(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define(['jquery'], factory);
  } else if (typeof exports === 'object') {
      factory(require('jquery'));
  } else {
      factory(jQuery);
  }
}(function ($, undefined) {

  'use strict';

  var timepickerWrapper   = '<div class="timepicker-wrapper input-icon-group"></div>';
  var timepickerLabel     = '<label class="input-icon-label"><i class="fa fa-clock-o"></i></label>';
	//var TIME_REG = /^\d{0,2}(\D{1})\d{1,2}(\D{1})\d{1,2}$/;
	var KEY = {
		DOWN: 'D',
		UP: 'U',
		LEFT: 'L',
		RIGHT: 'R',
		TAB: 'T'
  };
  var formatError = new Error('Invalid Time Format!');
  var valueError = new Error('Invalid Value!');
  /* Utilities */
	function pad (num, n) {
    var len = num.toString().length;
    while (len < n) {
      num = "0" + num;
      len++;
    }
    return num;
  }

  function timeValidate (time) {
    var splitters = this.splitters;
    var formaters = this.formaters;
    var maxHours = this.options.maxHours;
    var maxMinutes = this.options.maxMinutes;
    var maxSeconds = this.options.maxSeconds;
    var timeArray;
    var timeText = '';
    
    if (time) {
      if (!time.match(this.valueReg)) throw valueError;
        formaters.forEach(function (format, index) {
          var currentVal = RegExp['$' + (index + 1)];
          if (format === 'hh' && currentVal > maxHours) throw valueError;
          if (format === 'mm' && currentVal > maxMinutes) throw valueError;
          if (format === 'ss' && currentVal > maxSeconds) throw valueError;
          timeText += pad(currentVal, 2) + (splitters[index] || '');
        });
    } else if (this.notEmpty === false) {
      var $time = new Date();
      formater.forEach(function (format, index) {
        if (format === 'hh') timeText +=  pad($time.getHours(), 2) + (splitters[index] || '');
        if (format === 'mm') timeText +=  pad($time.getMinutes(), 2) + (splitters[index] || '');
        if (format === 'ss') timeText +=  pad($time.getSeconds(), 2) + (splitters[index] || '');
      });
    }
    return timeText;
  }

  function parseFormat () {
    var formaters = this.formaters;
    var splitters = this.splitters;
    formaters.forEach(function (format, index) {
      var unit = format.substr(0,1).toUpperCase();
      var pos = this[unit + '_POS'];
      var prepos, nextpos;

      formaters[index - 1] && (prepos = this[formaters[index - 1].substr(0,1).toUpperCase() + '_POS']);
      formaters[index + 1] && (nextpos = this[formaters[index + 1].substr(0,1).toUpperCase() + '_POS']);
      pos.length = format.length;
      if (index === 0) {
        pos.start = 0;
        //pos.end = pos.length - 1 + (splitters[index]? splitters[index].length : 0);
        pos.end = splitters[index] ? pos.start + pos.length - 1 + splitters[index].length : pos.start + pos.length;
        pos.prev = undefined;
        pos.next = nextpos;
      } else {
        pos.start = prepos.end + 1;
        pos.end = splitters[index] ? pos.start + pos.length - 1 + splitters[index].length : pos.start + pos.length;
        pos.prev = prepos;
        pos.next = nextpos || undefined;
      }
      this.position.push(pos);
    }, this);
  }

  function getChunkPosition (start, end) {
    var position = this.position[0];
    if (start >= this.H_POS.start && start <= this.H_POS.end && end >= this.H_POS.start && end <= this.H_POS.end) {
      position = this.H_POS;
    }
    if (start >= this.M_POS.start && start <= this.M_POS.end && end >= this.M_POS.start && end <= this.M_POS.end) {
      position = this.M_POS;
    }
    if (start >= this.S_POS.start && start <= this.S_POS.end && end >= this.S_POS.start && end <= this.S_POS.end) {
      position = this.S_POS;
    }
    return position;
  }

  function getChunkNumber (value, position) {

    return parseInt(value.substring(position.start, position.end), 10);

  }

  function textReplace (value, position) {
    var splitter = this.splitters.slice(0);

    return this.position.reduce.call(this.position, (function (acc, current) {
      if (current === position) {
        return acc + pad(value, position.length) + (splitter.shift() || "");
      } else {
        return acc + pad(this['org' + current.indicate], current.length) + (splitter.shift() || "");
      }
    }).bind(this), "");
	}

  // DATEPICKER CLASS DEFINITION
  // ===========================
  var Timepicker = function (element, options) {
    this.H_POS                     = { indicate: 'H' };
    this.M_POS                     = { indicate: 'M' };
    this.S_POS                     = { indicate: 'S' };
    this.position                  = [];
    this.options                   = options;
    this.$body                     = $(document.body);
    this.$timepickerWrapper        = $(timepickerWrapper);
    this.$element                  = $(element);
    this.$label                    = $(timepickerLabel).attr('for', this.$element.attr('id'));
    this.formaters                 = options.format.match(/(hh|mm|ss)/gi);
    this.splitters                 = options.format.match(/\W+/gi) || [];
    this.valueReg                  = new RegExp('^' + this.formaters.map((function (current, index) { 
      var regText = '(\\d{2,2})';
      return regText += this.splitters[index]? '\\D?' : '';
    }).bind(this)).join('') + '$', 'gi');
    this.orgValue                  = this.$element.val();
    this.orgClass                  = this.$element.attr('class');
    this.value                     = timeValidate.call(this, options.value || this.$element.val() || '');
    this.minHours                  = options.minHours;
    this.maxHours                  = options.maxHours;
    this.minMinutes                = options.minMinutes;
    this.maxMinutes                = options.maxMinutes;
    this.minSeconds                = options.minSeconds;
    this.maxSeconds                = options.maxSeconds;
    this.$element.addClass('form-control input-width-xs').attr({ 'data-role': 'timepicker-input' });
    this.$timepickerWrapper.insertBefore(this.$element).append(this.$element, this.$label);
    parseFormat.call(this);
    this._init();
  };

  Timepicker.VERSION = '1.0.0';

  Timepicker.DEFAULTS = {
    disabled: false,
    format: 'hh:mm:ss',
    notEmpty: true,
    minHours: 0,
    maxHours: 23,
    minMinutes : 0,
    maxMinutes : 59,
    minSeconds : 0,
    maxSeconds : 59,
    value: ''
  };

  Timepicker.prototype =  {
    _init: function () {
      this.$element.val(this.value);
      //Initial varaibles
      this.position.forEach(function (pos) {
        this['org' + pos.indicate] = getChunkNumber(this.value, pos);
        this['tmp' + pos.indicate] = [];
      }, this);

      if (this.options.disabled === true) {
        this.disable();
      }
    },
    _doFocus: function (e) {
			var input = this.$element;
			var value = input.val();
			var start = input.prop('selectionStart');
      var end = input.prop('selectionEnd');
      if (start !== 0 && end !== 0) {
        this._showField(this.position[0]);
        this._doEdit();
      }
    },
    _doBlur: function (e) {
      this._tmpCheck({});
    },
    _doEdit: function (e) {
			var input = this.$element;
			var value = input.val();
			var start = input.prop('selectionStart');
      var end = input.prop('selectionEnd');
			var position = getChunkPosition.call(this, start, end);
      
			if (!this._tmpCheck(position)) {
				this.orgH = getChunkNumber(value, this.H_POS);
        this.orgM = getChunkNumber(value, this.M_POS);
        this.orgS = getChunkNumber(value, this.S_POS);
				this.tmpH = [];
				this.tmpM = [];
        this.tmpS = [];
			}

			if (position.indicate) {
				this._showField(position);
				this._edit(value);
			}
    },
    _doKeydown: function (e) {
      var input = this.$element;
      var start = input.prop('selectionStart');
      var end = input.prop('selectionEnd');
      var position = getChunkPosition.call(this, start, end);
      var enterNum = e.key;
      var splitter = this.splitters;
      var timeText;
      if (!(start === 0 && end === 8) && position.indicate) {
        // Up/Down arrow Key to change the digits
        if (e.keyCode == 40) {
          this._doUpDown(KEY.DOWN, position) || e.preventDefault();
        } else if (e.keyCode == 38) {
          this._doUpDown(KEY.UP, position) || e.preventDefault();
        }
        // Tab and Left/Right arrow Key to move selected position
        if (e.keyCode == 39) {
          this._doLeftRight(KEY.RIGHT, position) && e.preventDefault();
        } else if (e.keyCode == 37) {
          this._doLeftRight(KEY.LEFT, position) && e.preventDefault();
        } else if (e.keyCode == 9) {
          if (e.shiftKey === true) {
            if (this._doLeftRight(KEY.LEFT, position) === true) {
              return true;
            } else {
              e.preventDefault();
            }
          } else {
            if (this._doLeftRight(KEY.RIGHT, position) === true) {
              return true;
            } else {
              e.preventDefault();
            }
          }
        }

        //  Insert Number
        if (/^\d$/.test(enterNum)) {
          this._doInsertNumber(enterNum, position) || e.preventDefault();
        }
        //  Allow: Ctrl/cmd+C
        if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;
        // Allow: Delete/Backword
        // if (e.keyCode === 8 || e.keyCode === 46) {
        // 	this._doBack(position);
        // }
        e.preventDefault();
      } else {
        // Allow: Ctrl/cmd+C
        if (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) return true;
        e.preventDefault();
      }
      return false;
    },
    _doInsertNumber: function (enterNum, position) {

      var tmp = this['tmp' + position.indicate];
      tmp.push(enterNum);

      var tmpString = tmp.join('');
      var tmpNumber = parseInt(tmpString, 10);
      
      if(position.indicate === 'H') {
        var reachMax = true;
        for (var i = 0; i < 10; i++) {
          if (parseInt((tmpString + i),10) <= this.maxHours) {
            reachMax = false;
          }
        } 
        if (reachMax || tmp.length === position.length) {
          if (tmpNumber > this.maxHours) {
            this.orgH = this.maxHours;
          } else if (tmpNumber < this.minHours) {
            this.orgH = this.minHours;
          } else {
            this.orgH = tmpNumber;
          }
          this._jumpNextChunk(position);
        } else {
          var timeText = this._stayCurrentChunk(position);
          this._change(timeText);
        }
      }

      if(position.indicate === 'M') {
        var reachMax = true;
        for (var i = 0; i < 10; i++) {
          if (parseInt((tmpString + i),10) <= this.maxMinutes) {
            reachMax = false;
          }
        } 
        if (reachMax || tmp.length === position.length) {
          if (tmpNumber > this.maxMinutes) {
            this.orgM = this.maxMinutes;
          } else if (tmpNumber < this.minMinutes) {
            this.orgM = this.minMinutes;
          } else {
            this.orgM = tmpNumber;
          }
          this._jumpNextChunk(position);
        } else {
          var timeText = this._stayCurrentChunk(position);
          this._change(timeText);
        }
      }

      if(position.indicate === 'S') {
        var reachMax = true;
        for (var i = 0; i < 10; i++) {
          if (parseInt((tmpString + i),10) <= this.maxSeconds) {
            reachMax = false;
          }
        } 
        if (reachMax || tmp.length === position.length) {
          if (tmpNumber > this.maxSeconds) {
            this.orgS = this.maxSeconds;
          } else if (tmpNumber < this.minSeconds) {
            this.orgS = this.minSeconds;
          } else {
            this.orgS = tmpNumber;
          }
          this._jumpNextChunk(position);
        } else {
          var timeText = this._stayCurrentChunk(position);
          this._change(timeText);
        }
      }
    },
    _doUpDown: function (direction, position) {

      var timeText;

      this._applyTemp(position.indicate);

      if (position.indicate === 'H') {
        if (direction === KEY.DOWN) this.orgH > this.minHours ? this.orgH-- : this.orgH === this.minHours ? this.orgH = this.maxHours : this.orgH = this.minHours;
        else this.orgH < this.maxHours ? this.orgH++ : this.orgH === this.maxHours ? this.orgH = this.minHours : this.orgH = this.maxHours;

      } else if (position.indicate === 'M') {

        if (direction === KEY.DOWN) this.orgM > this.minMinutes ? this.orgM-- : this.orgM === this.minMinutes ? this.orgM = this.maxMinutes : this.orgM = this.minMinutes;
        else this.orgM < this.maxMinutes ? this.orgM++ : this.orgM === this.maxMinutes ? this.orgM = this.minMinutes : this.orgM = this.maxMinutes;

      } else if (position.indicate === 'S') {

        if (direction === KEY.DOWN) this.orgS > this.minSeconds ? this.orgS-- : this.orgS === this.minSeconds ? this.orgS = this.maxSeconds : this.orgS = this.minSeconds;
        else this.orgS < this.maxSeconds ? this.orgS++ : this.orgS === this.maxSeconds ? this.orgS = this.minSeconds : this.orgS = this.maxSeconds;

      }

      timeText = this._autoCorrect(position.indicate);
      this.$element.val(timeText);
      this._showField(position);
      this._change(timeText);
    },
    _doLeftRight: function (direction, position) {

      var tabable = false;

      if(direction === KEY.RIGHT) {
        if (position.next) {
          this._correctVal(position);
          this._showField(position.next);
        } else {
          this._showField(position);
          tabable = true;
          //this._next();
        }
      } else {
        if (position.prev) {
          this._correctVal(position);
          this._showField(position.prev);
        } else {
          this._showField(position);
          tabable = true;
          //this._prev();
        }
      }

      return tabable;
    },
    _denyPaste: function(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    _jumpNextChunk: function (position) {
      var timeText = this._autoCorrect(position.indicate);
      this.$element.val(timeText);
      this._showField(position.next || position);
      this._change(timeText);
    },
    _stayCurrentChunk: function (position) {
      var value = parseInt(this['tmp' + position.indicate].join(''), 10);
      var timeText = textReplace.call(this, value, position);
      this.$element.val(timeText);
      this._showField(position);
      return timeText;
    },
    _showField: function(position) {
			var _this = this;
			this.$element[0].setSelectionRange(position.start, position.end);
			setTimeout(function () {
				_this.$element[0].setSelectionRange(position.start, position.end);
			}, 20);
    },
    /* Events Triggerer */
    _edit: function (time) {
      this.$element.trigger($.Event('edit'), [time]);
    },
    _change: function (time) {
      if (time === this.value) return;
      else this.value = time;
      
      this.$element.trigger($.Event('change'), [time]);
    },
    _prev: function () {
      this.$element.trigger($.Event('prev'), [this.$element.val()]);
    },
    _next: function () {
      this.$element.trigger($.Event('next'), [this.$element.val()]);
    },
    /* Validators */
		_tmpCheck: function (position) {
      var indicate = position.indicate;
      var useChrunk = false;
      if (this.tmpH.concat(this.tmpM, this.tmpS).length > 0) {
        if (indicate) {
          this.position.forEach(function(pos) {
            if (this['tmp' + pos.indicate].length > 0 && indicate !== pos.indicate) {
              this._correctVal(pos);
              useChrunk = true;
            }
          }, this);
        } else {
          this.position.forEach(function(pos) {
            if (this['tmp' + pos.indicate].length > 0) {
              this._correctVal(pos);
            }
          }, this);
        }
      }
      return useChrunk;
    },
    _correctVal: function (position) {

      var timeText;
      if (this._applyTemp(position.indicate)) {
        timeText = this._autoCorrect(position.indicate);
        this.$element.val(timeText);
        this._change(timeText);
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
      var splitter = this.splitters.slice(0);
      if (indicate === 'H') {
        if (this.orgH < this.minHours) this.orgH = this.minHours;
        if (this.orgH > this.maxHours) this.orgH = this.maxHours;
      }

      if (indicate === 'M') {
        if (this.orgM < this.minMinutes) this.orgM = this.minMinutes;
        if (this.orgM > this.maxMinutes) this.orgM = this.maxMinutes;
      }

      if (indicate === 'S') {
        if (this.orgS < this.minSeconds) this.orgS = this.minSeconds;
        if (this.orgS > this.maxSeconds) this.orgS = this.maxSeconds;
      }

      this['tmp' + indicate] = [];

      return this.position.reduce.call(this.position, (function (acc, current) {
        return acc + pad(this['org' + current.indicate], current.length) + (splitter.shift() || "");
      }).bind(this), "");
    },
    _detachEvents: function () {

    },
    /* Public Methods */
    getTime: function () {
      return this.value;
    },
    setValue: function (value) {
      this.value = timeValidate.call(this, value);
      this._init();
    },
    getHours: function () {
      return this.orgH;
    },
    setHours: function (hour) {
      if (!isNaN(hour) && hour >= this.minHours && hour <= this.maxHours) {
        this.orgH = hour;
        this._autoCorrect(this.H_POS);
        this.$element.val(this.value);
        this._change(this.value);
      }
    },
    getMinutes: function () {
      return this.orgM;
    },
    setMinutes: function (min) {
      if (!isNaN(min) && min >= this.minMinutes && min <= this.maxMinutes) {
        this.orgM = min;
        this._autoCorrect(this.M_POS);
        this.$element.val(this.value);
        this._change(this.value);
      }
    },
    getSeconds: function () {
      return this.orgS;
    },
    setSeconds: function (sec) {
      if (!isNaN(sec) && sec >= this.minSeconds && sec <= this.maxSeconds) {
        this.orgS = sec;
        this._autoCorrect(this.S_POS);
        this.$element.val(this.value);
        this._change(this.value);
      }
    },
    disable: function () {
      this.$element.attr('disabled', true);
    },
    destroy: function () {
      this.$element
        .removeAttr('class data-role')
        .addClass(this.orgClass)
        .val(this._value)
        .insertBefore(this.$timepickerWrapper);
      this.$timepickerWrapper.add(this.$label).remove();
      delete this.$element.data()['bs.timepicker'];
    }
  };

  // DATEPICKER PLUGIN DEFINITION
  // ============================
  var Plugin = function (option, param) {
    var retval = null;
    this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.timepicker');
      var options = $.extend({}, Timepicker.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('bs.timepicker', (data = new Timepicker(this, options)));
      if (typeof option == 'string') retval = data[option].call(data, param);
    });
    if (!retval) {
      retval = this;
    }
    return retval;
  };

  var old = $.fn.timepicker;

  $.fn.timepicker             = Plugin;
  $.fn.timepicker.Constructor = Timepicker;


  // DATEPICKER NO CONFLICT
  // ======================

  $.fn.timepicker.noConflict = function () {
    $.fn.timepicker = old;
    return this;
  }

  // DATEPICKER DATA-API
  // ===================
  $(document)
    .on('focus click blur keydown', '[data-role="timepicker-input"]', function (e) {
      var $this = $(this);
      var instance = $this.data('bs.timepicker');

      if (e.type === 'focusin') {
        instance._doFocus(e);
      }
      if (e.type === 'focusout') {
        instance._doBlur(e);
      }
      if (e.type === 'click') {
        instance._doEdit(e);
      }
      if (e.type === 'keydown') {
        instance._doKeydown(e);
      }
    });
}));
