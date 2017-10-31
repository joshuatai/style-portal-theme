'use strict';

EditableSelect.prototype.show = function () {
  this.$list.css({
    top:   this.$input.position().top + this.$input.outerHeight() - 1,
    left:  this.$input.position().left,
    width: this.$input.outerWidth()
  });
  
  if (!this.$list.is(':visible') && (this.$list.find('li.es-visible').length > 0 || this.$list.find('li.matched-visible').length > 0)) {
    var fns = { default: 'show', fade: 'fadeIn', slide: 'slideDown' };
    var fn  = fns[this.options.effects];
    
    this.utility.trigger('show');
    this.$input.addClass('open');
    this.$list[fn](this.options.duration, $.proxy(this.utility.trigger, this.utility, 'shown'));
  }
};

//Add customize codes at original filter function.
EditableSelect.prototype.filter = function () {
  var hiddens = 0;
  var search  = this.$input.val().toLowerCase().trim();
  this.$list.find('li').addClass('es-visible').show();
  this.$list.find('li.no-matches').remove();//customize to remove <li> element at the begin of filter event.

  if (this.options.filter) {
    hiddens = this.$list.find('li').filter(function (i, li) { return $(li).text().toLowerCase().indexOf(search) < 0; }).hide().removeClass('es-visible').length;
    if (this.$list.find('li').length == hiddens) {
      this.onSearchNotFound();//customize to call onSearchNotFound function.
    }
  }
};
//Customize onSearchNotFound function
EditableSelect.prototype.onSearchNotFound = function () {
  if(!this.$list.find('li').hasClass("no-matches")) {
    this.$list.append("<li class=\"no-matches matched-visible\">No matches found.</li>");
  }
};

var combobox   = '<div class="combobox input-icon-group" data-role="combobox-wrapper"></div>';

/* Utilities */


// COMBOBOX CLASS DEFINITION
// ===========================

var Combobox = function (element, options) {
  this.options                   = options;
  this.$body                     = $(document.body);
  this.$element                  = $(element);
  this.$combobox                 = $(combobox).insertBefore(this.$element).append(this.$element).data('combobox', this);
  this.$close                    = $('<span data-toggle="close"></span>').addClass('icon icon-cancel').data('combobox', this);
  this.$listItems                = this.$element.children();
  this.$combobox.addClass(this.$element.attr('class').split(' ').filter(function (classname) {
    return classname !== 'form-control';
  }).join(' '));
  var selectedItem = this.$element.find('[selected]');
  
  if (options.value) {
    var selectable = this.$listItems.filter(function (index, item) {
      return item.value === options.value;
    });
    if (selectable.length > 0) {
      this.$listItems.removeAttr('selected');
      selectedItem = selectable.attr('selected', true);
    }
  }
  if (options.clearable === false && selectedItem.length === 0) {
    selectedItem = this.$element.children().first().attr('selected', true);
  }
  this.$element.editableSelect({
    effects: 'fade'
  });

  this.$input = this.$combobox.find('.es-input')
    .addClass('form-control')
    .attr({
      'placeholder': options.placeholder,
      'data-toggle': 'combobox-input'
    });
  this.$list = this.$combobox.find('.es-list').addClass('dropdown-menu');
  this.es = this.$input.data('editableSelect');
  this.es.combobox = this;
  if (selectedItem.val()) {
    this._setValue(selectedItem.val());
    this.$input.trigger('hidden.editable-select');
  }
  if (options.disabled === true) this.disable();
};

Combobox.VERSION = '1.0.0';

Combobox.DEFAULTS = {
  disabled: false,
  placeholder: 'Select...',
  value: "",
  clearable: true
};

var clear = function (instance) {
  instance.$combobox.removeClass('selected');
  instance.$input.val('');
  instance.$list.children().removeClass('actived selected');
  instance.$close.detach();
  instance.selected = false;
  if (instance.options.clearable === true) {
    instance._value = '';
  }
}

var assign = function (instance, selectable) {
  instance.$combobox.addClass('selected');
  instance.$input.val(selectable.text());
  instance.$input[0].setSelectionRange(0, 0);
  instance.$list.children().removeClass('actived').eq(selectable[0].index).addClass('actived');
  instance.selected = true;
  instance._value = selectable.val();
}

Combobox.prototype =  {
  _setValue: function (value) {
    var selectable = this.$element.children().filter(function (index, item) {
      return item.value === value;
    });
    if (value === '' || selectable.length > 0) {
      if (value) {
        assign(this, selectable);
      } else {
        clear(this);
      }
    } else {
      this._setValue(this.value);
    }
  },
  /* Events Triggerer */
  _change: function (value) {
    this.$element.trigger($.Event('change.combobox'), [value]);
  },
  _show: function (lists) {
    lists = $.makeArray(lists);
    this.$element.trigger($.Event('show.combobox'), [lists.map(function (li, index) {
      var $li = $(li);
      return $li.attr('value') || $li.text();
    })]);
  },
  /* Methods */
  setValue: function (value) {
    var matchedItem = this.$element.children().filter(function (index, item) {
      return item.value == value;
    });
    if (matchedItem.length > 0) {
      this.es.select(this.$list.children().eq(matchedItem[0].index).addClass('es-visible'));
    }
  },
  getValue: function () {
    return this._value;
  },
  enable: function () {
    this.$combobox.removeClass('disabled');
    this.$input.attr('disabled', false);
  },
  disable: function () {
    this.$combobox.addClass('disabled');
    this.$input.attr('disabled', true);
  },
  destroy: function () {
    this.$list.off('mousemove mousedown mouseup');
    this.$input.off('focus blur input keydown select show');
    this.$input.replaceWith(this.$element);
    this.$element.insertAfter(this.$combobox);
    this.$combobox.remove();
    this.$list.remove();
    this.$close.remove();
    delete this.$element.data()['combobox'];
  }
};

// COMBOBOX PLUGIN DEFINITION
// ============================
var Plugin = function (option, param) {
  var retval = null;
  this.each(function () {
    var $this   = $(this);
    var data    = $this.data('combobox');
    var options = $.extend({}, Combobox.DEFAULTS, $this.data(), typeof option == 'object' && option);

    if (!data) $this.data('combobox', (data = new Combobox(this, options)));
    if (typeof option == 'string') retval = data[option].call(data, param);
  });
  if (!retval) {
    retval = this;
  }
  return retval;
};

$.fn.combobox             = Plugin;
$.fn.combobox.Constructor = Combobox;


// COMBOBOX NO CONFLICT
// ======================
var supper   = $.fn.combobox;

$.fn.combobox.noConflict = function () {
  $.fn.combobox = supper;
  return this;
}

// COMBOBOX DATA-API
// ===================
$(document)
  .on('show.editable-select', '[data-toggle="combobox-input"]', function (e) {
    var combobox = $(this).data('editableSelect').combobox;
    var lists = combobox.$list
      .find('li.no-matches').remove()
      .end()
      .css("top", "auto")
      .children()
      .removeClass('selected')
      .addClass("es-visible")
      .show();
    combobox._show(lists);      
  })
  .on('hidden.editable-select', '[data-toggle="combobox-input"]', function (e) {
    var combobox = $(this).data('editableSelect').combobox;
    if (combobox.options.clearable === true && combobox.selected === true) {
      combobox.$close.insertBefore(combobox.$list);
    }
    e.stopPropagation();
    e.preventDefault();
  })
  .on('select.editable-select', '[data-toggle="combobox-input"]', function (e, $li) {
    if (e.namespace) {
      var combobox = $(this).data('editableSelect').combobox;
      var value = $li.attr('value') || $li.text();
      
      combobox._setValue(value);
      combobox._change(value);
      combobox.$input.trigger('blur');
      
      e.preventDefault();
      e.stopPropagation();
    }
  })
  .on('keydown', '[data-toggle="combobox-input"]', function (e) {
    var $input = $(this);
    var combobox = $(this).data('editableSelect').combobox;
    var keycode = e.keyCode ? e.keyCode : e.charCode;
    if (combobox.selected === true) {
      if((keycode >= 48 && keycode <= 90 ) || (keycode >= 96 && keycode <= 111) || (keycode >= 186 && keycode <= 192) || (keycode >= 219 && keycode <= 222)){
        combobox.$combobox.removeClass('selected');
        $input.val('');
        combobox.$list.children().removeClass('actived selected');
        combobox.selected = false;
        combobox.$close.detach();
      } else {
        if (keycode !== 13) {
          combobox.$list
            .children()
            .addClass("es-visible")
            .show();
        }
        e.preventDefault();
        return false;
      }
    }
  })
  .on('input', '[data-toggle="combobox-input"]', function (e) {
    var $input = $(this);
    var combobox = $input.data('editableSelect').combobox;
    if (combobox.selected === false && $input.val().length === 0 && combobox._value) {
      combobox._setValue(combobox._value);
      combobox.$list.css("top", "auto");
    }
  })
  .on('keydown keyup input', '[data-toggle="combobox-input"]', function (e) {
    var combobox = $(this).data('editableSelect').combobox;
    combobox.$list.css("top", "auto");
  })
  .on('blur', '[data-toggle="combobox-input"]', function (e) {
    var $input = $(this);
    var combobox = $input.data('editableSelect').combobox;
    combobox.$list.css("top", "auto");
    if (combobox.selected === false && combobox._value !== combobox.$input.val()) combobox._setValue(combobox._value);
  })
  .on('focus mousedown mouseup', '[data-toggle="combobox-input"]', function (e) {
    var $input = $(this);
    var combobox = $input.data('editableSelect').combobox;
    if (combobox.selected === true) {
      $input[0].setSelectionRange(0, 0);
      return false;
    }
  })
  .on('click', '[data-role="combobox-wrapper"]', function (e) {
    var combobox = $(this).data('combobox');
    if (!combobox.$list.is(":visible")) {
      combobox.$input.trigger("focus");
    }
  })
  .on('click', '[data-toggle="close"]', function (e) {
    var combobox = $(this).data('combobox');
    combobox._setValue('');
    combobox._change('');
  })
  .on('mouseleave', '.es-list', function (e) {
    $(this).children().removeClass('selected');
  });

$('#combobox', this).combobox();