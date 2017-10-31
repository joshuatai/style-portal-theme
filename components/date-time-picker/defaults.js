if ($.fn._datepicker) return;
;(function ($) {
    
    'use strict';

    var static_datepicker   = $.fn._datepicker = $.fn.datepicker;
    var datepickerWrapper   = '<div class="datepicker-wrapper input-icon-group"></div>';
    var datepickerLabel     = '<label class="input-icon-label"><i class="fa fa-calendar"></i></label>';
    var datepickerContainer = '<div data-role="datepicker"></div>';

    var MIN_YEAR = 1900;
    var MAX_YEAR = 9999;
    var DATE_REG = /\d{2,4}(\D{1})\d{2,4}(\D{1})\d{2,4}/;
    var KEY = {
        DOWN: 'D',
        UP: 'U',
        LEFT: 'L',
        RIGHT: 'R',
        TAB: 'T'
    };

    /* Utilities */
    function pad (num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }

    function parseFormat () {
        this.$formater.forEach(function (format,index) {
            var unit = format.substr(0,1).toUpperCase();
            var pos = this[unit + '_POS'];
            var prepos, nextpos;

            this.$formater[index - 1] && (prepos = this[this.$formater[index - 1].substr(0,1).toUpperCase() + '_POS']);
            this.$formater[index + 1] && (nextpos = this[this.$formater[index + 1].substr(0,1).toUpperCase() + '_POS']);
            pos.length = format.length;
            if (index === 0) {
                pos.start = 0;
                pos.end = pos.length - 1 + this.$splitters[index].length;
                pos.prev = undefined;
                pos.next = nextpos;
            } else {
                pos.start = prepos.end + 1;
                pos.end = this.$splitters[index] ? pos.start + pos.length - 1 + this.$splitters[index].length : pos.start + pos.length;
                pos.prev = prepos;
                pos.next = nextpos || undefined;
            }
            this.position.push(pos);
        }, this);
    }

    function getChunkPosition (start, end) {
        var position = this.position[0];
        if (start >= this.Y_POS.start && start <= this.Y_POS.end && end >= this.Y_POS.start && end <= this.Y_POS.end) {
            position = this.Y_POS;
        }
        if (start >= this.M_POS.start && start <= this.M_POS.end && end >= this.M_POS.start && end <= this.M_POS.end) {
            position = this.M_POS;
        }
        if (start >= this.D_POS.start && start <= this.D_POS.end && end >= this.D_POS.start && end <= this.D_POS.end) {
            position = this.D_POS;
        }
        return position;
    }

    function getChunkNumber (value, position) {

        return parseInt(value.substring(position.start, position.end), 10);

    }

    function getLastDate (year, month) {
        return new Date(year, month, 0).getDate();
    }

    function textReplace (value, position) {
        var splitter = this.$splitters.slice(0);

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

    var Datepicker = function (element, options) {
        this.Y_POS = { indicate: 'Y' };
        this.M_POS = { indicate: 'M' };
        this.D_POS = { indicate: 'D' };
        this.position = [];
        this.options                   = options;

        this.$body                     = $(document.body);
        this.$datepickerWrapper        = $(datepickerWrapper);
        this.$element                  = $(element);
        this.$label                    = $(datepickerLabel).attr('for', this.$element.attr('id'));
        this.$datepickerContainer      = $(datepickerContainer).data('bootstrap-datepicker', this);
        this.$splitters = this.options.format.split(/dd|mm|yyyy|DD|MM|yy/gi), this.$splitters.pop(), this.$splitters.shift(), this.$splitters;
        this.$formater  = this.options.format.match(/dd|mm|yyyy|DD|MM|yy/gi);

        parseFormat.call(this);
        this.orgClass = this.$element.attr('class');
        this.$element.addClass('form-control input-width-xs').attr({ 'data-role': 'datepicker-input' });
        this.$datepickerWrapper.insertBefore(this.$element).append(this.$element, this.$label);
        if (typeof options.container === 'string') {
            if (options.container === 'self') this.$datepickerWrapper.append(this.$datepickerContainer);
            else $(options.container).append(this.$datepickerContainer);
        } else {
            $(options.container).append(this.$datepickerContainer);
        }
        
        this._init();
    };

    Datepicker.VERSION = '1.0.0';

    Datepicker.DEFAULTS = {
        format: 'yyyy-mm-dd',
        todayHighlight: true,
        container: 'self',
        autoclose: false,
        keyboardNavigation: false,
        disabled: false,
        isInline: false
    };

    Datepicker.prototype =  {
        _init: function () {
            var date = this.$element.val();
            if (!date) {
                this.$datepickerContainer._datepicker(this.options);
                this.$element.val(this.$datepickerContainer.data('datepicker').getFormattedDate());
            } else {
                this.$datepickerContainer.attr('data-date', date);
                this.$datepickerContainer._datepicker(this.options);
            }
            this.value = this.$datepickerContainer.data('datepicker').getFormattedDate();
            
            if (this.options.isInline === false) {
                this.$datepickerContainer.addClass('dropdown-menu');
            }
            // Initial varaibles
            this.position.forEach(function (pos) {
                this['org' + pos.indicate] = getChunkNumber(date, pos);
                this['tmp' + pos.indicate] = [];
            }, this);

            if (this.options.disabled === true) {
                this.disable();
            }

            $(".prev", this.$datepickerContainer).find("i").attr('class', 'fa fa-angle-left');
            $(".next", this.$datepickerContainer).find("i").attr('class', 'fa fa-angle-right');

            $(document).on('click', $.proxy(this._doUnEdit, this));
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
                this.orgY = getChunkNumber(value, this.Y_POS);
                this.orgM = getChunkNumber(value, this.M_POS);
                this.orgD = getChunkNumber(value, this.D_POS);
                this.tmpY = [];
                this.tmpM = [];
                this.tmpD = [];
            }

            if (position.indicate) {
                this._showField(position);
                this._edit(value);
            }
        },
        _doUnEdit: function (e) {
            var target = $(e.target);
            if (!target.is(this.$element) && target.closest(this.$datepickerContainer).length === 0) this._unedit();
        },
        _doKeydown: function (e) {
            var input = this.$element;
            var start = input.prop('selectionStart');
            var end = input.prop('selectionEnd');
            var position = getChunkPosition.call(this, start, end);
            var enterNum = e.key;
            var splitter = this.$splitters;
            var dateText;
            if (!(start === 0 && end === 10) && position.indicate) {
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
                            this._unedit();
                            return true;
                        } else {
                            e.preventDefault();
                        }
                    } else {
                        if (this._doLeftRight(KEY.RIGHT, position) === true) {
                            this._unedit();
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
            var lastDate;

            if(position.indicate === 'Y') {
                if (tmp.length === position.length) {
                    this.orgY = tmpNumber;
                    this._jumpNextChunk(position);
                } else {
                    this._stayCurrentChunk(position);
                }
            }

            if(position.indicate === 'M') {
                if ((tmpNumber > 1 && tmpNumber < 10) || tmp.length === position.length) {
                    if (tmpNumber > 12) {
                        this.orgM = 12;
                    } else if (tmpNumber < 1) {
                        this.orgM = 1;
                    } else {
                        this.orgM = tmpNumber;
                    }
                    this._jumpNextChunk(position);
                } else {
                    var dateText = this._stayCurrentChunk(position);
                    if (tmpNumber == 1) this._change(dateText);
                }
            }

            if (position.indicate === 'D') {

                var canContinue = false;
                lastDate = getLastDate(this.orgY, this.orgM);

                for (var i = 0; tmp.length < position.length && i < 10; i++) {
                var targetDate = parseInt(tmpString + i.toString(), 10);
                if (targetDate <= lastDate) canContinue = true;
                }

                if (tmp.length === position.length || canContinue === false) {
                if (tmpNumber > lastDate) {
                    this.orgD = lastDate;
                } else if (tmpNumber < 1) {
                    this.orgD = 1;
                } else {
                    this.orgD = tmpNumber;
                }
                this._jumpNextChunk(position);
                } else {
                    var dateText = this._stayCurrentChunk(position);
                    if (tmpNumber > 0) this._change(dateText);
                }
            }
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

            this.$element.val(dateText);
            this._showField(position);
            this._change(dateText);
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
            var dateText = this._autoCorrect(position.indicate);
            this.$element.val(dateText);
            this._showField(position.next || position);
            this._change(dateText);
        },
        _stayCurrentChunk: function (position) {
            var dateText = textReplace.call(this, this['tmp' + position.indicate].join(''), position);
            this.$element.val(dateText);
            this._showField(position);
            return dateText;
        },
        _showField: function(position) {
            var _this = this;
            this.$element[0].setSelectionRange(position.start, position.end);
            setTimeout(function () {
                _this.$element[0].setSelectionRange(position.start, position.end);
            }, 20);
        },
        /* Events Triggerer */
        _edit: function (date) {
            this.$element.trigger($.Event('edit'), [date]);
        },
        _unedit: function () {
            this.$element.trigger($.Event('unedit'));
        },
        _change: function (date) {
            this.$element.trigger($.Event('change'), [date]);
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
            if (this.tmpY.concat(this.tmpM, this.tmpD).length > 0) {
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
            if (this._applyTemp(position.indicate) != undefined) {
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
            var splitter = this.$splitters.slice(0);
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

            this['tmp' + indicate] = [];
            return this.position.reduce.call(this.position, (function (acc, current) {
                return acc + pad(this['org' + current.indicate], current.length) + (splitter.shift() || "");
            }).bind(this), "");
        },
        _detachEvents: function () {

        },
        /* Public Methods */
        getDate: function () {
            return this.$datepickerContainer.data('datepicker').getDate();
        },
        getUTCDate: function () {
            return this.$datepickerContainer.data('datepicker').getUTCDate();
        },
        setDate: function (date) {
            this.$datepickerContainer.data('datepicker').setDate(date);
            this.$datepickerContainer.data('datepicker').update();
            this.$element.val(this.$datepickerContainer.data('datepicker').getFormattedDate());
        },
        setUTCDate: function (date) {
            this.$datepickerContainer.data('datepicker').setUTCDate(date);
            this.$datepickerContainer.data('datepicker').update();
            this.$element.val(this.$datepickerContainer.data('datepicker').getFormattedDate());
        },
        disable: function () {
            this.$element.attr('disabled', true);
        },
        destroy: function () {
            $(document).off('click', $.proxy(this._doUnEdit, this));
            this.$element.removeAttr('class data-role').addClass(this.orgClass);
            this.$element.insertBefore(this.$datepickerWrapper);
            this.$datepickerWrapper.add(this.$label, this.$datepickerContainer._datepicker('destroy')).remove();
            delete this.$element.data()['bs.datepicker'];
        }
    };

    // DATEPICKER PLUGIN DEFINITION
    // ============================
    var Plugin = function (option, param) {
        var retval = null;
        this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bs.datepicker');
            var options = $.extend({}, Datepicker.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('bs.datepicker', (data = new Datepicker(this, options)));
            if (typeof option == 'string') retval = data[option].call(data, param);
        });
        if (!retval) {
            retval = this;
        }
        return retval;
    };

    $.fn.datepicker             = Plugin;
    $.fn.datepicker.Constructor = Datepicker;


    // DATEPICKER NO CONFLICT
    // ======================

    $.fn.datepicker.noConflict = function () {
        $.fn.datepicker = static_datepicker;
        return this;
    }

    // DATEPICKER DATA-API
    // ===================
    $(document)
        .on('changeDate changeMonth', '[data-role="datepicker"]', function (e) {
            var $this = $(this);
            var instance = $this.data('bootstrap-datepicker');
            var $input = instance.$element;
            var value = $this.data('datepicker').getFormattedDate();
            if (instance.value !== value) {
                $input.val(value);
                instance.value = value;
                $input.trigger('change', [value]);
            }
        })
        .on('focus click blur keydown', '[data-role="datepicker-input"]', function (e) {
            var $this = $(this);
            var instance = $this.data('bs.datepicker');
            if (e.type === 'focusin') {
                instance._doFocus(e);
                /*
                $this.addClass('input-focus');
                $this.parent().find('[data-role="datepicker"]').show();*/
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
        })
        .on('edit', '[data-role="datepicker-input"]', function (e, date) {
            var $this = $(this).addClass('input-focus');
            var instance = $this.data('bs.datepicker');
            if (!instance.options.isInline) instance.$datepickerContainer.show();
        })
        .on('unedit next prev', '[data-role="datepicker-input"]', function (e) {
            var $this = $(this).removeClass('input-focus');
            var instance = $this.data('bs.datepicker');
            if (!instance.options.isInline) instance.$datepickerContainer.hide();
        })
        .on('change', '[data-role="datepicker-input"]', function (e, date) {
            var instance  = $(this).data('bs.datepicker');
            if (instance.value !== date) {
                instance.value = date;
                instance.$datepickerContainer._datepicker('update', date);
            }
        });
})(jQuery);

(function ($) {
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
})(jQuery);

