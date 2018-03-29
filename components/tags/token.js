!function($) {
  
  'use strict';

  var _super = $.fn.tokenfield;

  var Token = function(element, options) {
    var _self = this;
    var autocomplete = $.extend({
      classes: {'ui-autocomplete': 'dropdown-menu'},
      autoFocus: true
    }, options.autocomplete);

    this.options          = options;
    this.options.validators = $.extend(true, {}, Token.DEFAULTS.validators, options.validators);
    this.options.onTagInvalid = $.extend(true, {}, Token.DEFAULTS.onTagInvalid, options.onTagInvalid);

    this.$element         = $(element);
    this.$controlWrapper  = $('<div />');
    this.$filterCloseBtn  = $('<span />').addClass('tmicon tmicon-close-s tmicon-light tmicon-hoverable');
    this.elementWidth     = this.$element.outerWidth();

    this.$helpBlock = $('<span />').addClass('help-block help-block-invalid help-block-with-icon');
    this.$helpBlockIcon = $('<span />').addClass('tmicon tmicon-warning-circle tmicon-color-error');
    this.$helpBlockText = $('<span />').addClass('invalid-text');
    
    this.rules = [];
    // get rules array and check property, validators and onTagInvalid  of rule.
    $.each(this.options.rules, function(key, rule){
      if(rule.name === undefined) {
        throw new TypeError(`Cannot read property '${Object.keys(rule)[0]}' of undefined`);
      }
      if(_self.options.validators[rule.name] === undefined) {
        throw new TypeError(`'${rule.name}' validators is not defined`);
      }
      if(_self.options.onTagInvalid[rule.name] === undefined) {
        _self.options.onTagInvalid[rule.name] = $.noop;
      }
      _self.rules.push(rule.name);
    });
    // call the original constructor
    _super.Constructor.apply( this, arguments );
    
    // init icon style and wrapper style
    this.editBtn(this.$wrapper);
    this.$wrapper.css('width', this.elementWidth);
    this.$helpBlock.append(this.$helpBlockIcon, this.$helpBlockText);
    this.$helpBlock.hide();
    this.$wrapper.wrap(this.$controlWrapper);
    this.$wrapper.after(this.$helpBlock);

    // [editable] add editable class if the token is allowEditing
    if(this.options.allowEditing) {
      this.$wrapper.addClass('editable');
    }

    // [autocomplete] 
    if(autocomplete.source && autocomplete.source.length > 0) {
      
      this.$dropdownMenu = this.$input.autocomplete('widget');
      this.$wrapper.addClass('autocomplete');

      // add filter close btn if has default tokens
      if(this.getTokens().length > 0){
        this.$wrapper.append(this.$filterCloseBtn);
      }
          
      this.$input
        .autocomplete(autocomplete)
        .on('autocompleteclose', function(e, ui){
          // if the input still focus, open the menu list
          if ($(e.target).is(':focus')) {
            _self.search();
          };
        })
        .on('autocompleteopen', function(e, ui){
          // add the width on the menu style.
          _self.$input.data('ui-autocomplete').menu.element.css({'width': _self.elementWidth, 'min-width': _self.elementWidth});
        })
        .on('autocompletesearch', function(e, ui){
          //fix bug in jQuery.ui somewhere where menu.bindings just grows and grows when searching.
          _self.$input.data("ui-autocomplete").menu.bindings = $();
          $('.ui-helper-hidden-accessible').html('');
        })
        .on('autocompletefocus', function(e, ui){
          // prevent the action of replace the text field's value 
          e.preventDefault();
        });
    }

    this.$element
      .on('tokenfield:createtoken', function (e) {
        // [autocomplete] stop create token, when entry text is not in drop down list. 
        if(autocomplete.source && autocomplete.source.length > 0) {
          var availableTokens = _self.filterAvailableTokens();
          var notExists = availableTokens.every(function(token) {
            return token !== e.attrs.value;
          });
          if(notExists) {
            e.preventDefault();
            _self.$input.val('');
          }
        }
      })
      .on('tokenfield:createdtoken', function (e) {
        // stop create token, when the token is existing.
        _self.tagValidate(e);
        _self.checkTokenState();
        // add close icon style
        _self.editBtn($(e.relatedTarget));
        // remove plugin default token label attr style of width
        $(e.relatedTarget).find('.token-label').prop('style').removeProperty('max-width');
        _self.$input.removeAttr('placeholder').removeClass('placeholder');
        _self.$filterCloseBtn.show();
        // open the filter menu
        if(autocomplete.source && autocomplete.source.length > 0) {
          _self.$input.autocomplete('search');
        }
      })
      .on('tokenfield:edittoken', function (e) {
        _self.destoryTooltip(e);
      })
      .on('tokenfield:editedtoken', function (e) {
        // set cursor to the end of input.
        var inputValLength = _self.$input.val().length;
        _self.$input[0].setSelectionRange(inputValLength, inputValLength);
      })
      .on('tokenfield:removetoken', function (e) {
        _self.destoryTooltip(e);
      })
      .on('tokenfield:removedtoken', function (e) {
        if(_self.getTokens().length === 0) {
          _self.$filterCloseBtn.hide();
          _self.addPlaceholder();
        }
        _self.checkTokenState();
      });

    this.bindEvents();
  }

  function checkDuplicate (text) {
    var duplicateTags = $.map(this.getTokens(), function(token) {
      return token.value;
    }).filter(function(tag){
      return tag === text;
    });
    return duplicateTags.length >= 2 ? false : true;
  }

  function onDuplicate () {}

  Token.DEFAULTS = $.extend( _super.defaults, {
    createTokensOnBlur: true,
    defaultErrorClass: 'token-invalid',
    rules: [{
      name: 'duplicate',
      message: 'Duplicated entries'
    }],
    validators: {
      duplicate: checkDuplicate
    },
    onTagInvalid: {
      duplicate: onDuplicate
    },
    placeholder: 'Enter tags ...',
    noMatch: 'No matches found.'
  });

  Token.prototype = $.extend({}, _super.Constructor.prototype, {
    constructor: Token,
    _super: function() {
        var args = $.makeArray(arguments);
        _super.Constructor.prototype[args.shift()].apply(this, args);
    },
    bindEvents: function () {
      this.$wrapper
        .on('click', $.proxy(this.clickEvent, this))
        .on('mousedown', $.proxy(this.keepDropdownMenuOpen, this));
      this.$input
        .on('click', $.proxy(this.search, this))
        .on('keydown', $.proxy(this.keydownEvent, this));
      this.$filterCloseBtn
        .on('mousedown', $.proxy(this.removeAllTags, this)); // use mousedown to prevent the autocomplete menu show first when click the close button.
    },
    keepDropdownMenuOpen: function(e) {
      // keep open when dropdown menu is opened.
      if (this.$input.data('ui-autocomplete')) {
        if ($(e.target).hasClass('tokenfield')) {
          e.preventDefault();
        };
      }
    },
    clickEvent: function(e) {
      if (!this.$copyHelper.is(document.activeElement) || this.$wrapper.find('.token.active').length !== 1) return false;
      if (!this.options.allowEditing) return false;
      this.edit(this.$wrapper.find('.token.active'));
    },
    search: function () {
      if (this.$input.data('ui-autocomplete')) {
        var _self = this;
        var availableTags = this.filterAvailableTokens();
        this.$input.autocomplete({
          source: function(request, response) {
            var noResultsLabel = _self.options.noMatch;
            var results = $.ui.autocomplete.filter(availableTags, request.term);
            _self.$dropdownMenu.toggleClass('no-match', !results.length);
            response(results.length ? results : [noResultsLabel]);
          }
        });
        this.$input.autocomplete('search');
      }
    },
    filterAvailableTokens: function(e) {
      var sourceTags = this.options.autocomplete.source;
      var tokenList = $.map(this.getTokens(), function(token) {
        return token.value;
      });
      var availableTags = sourceTags.filter(function(source){
        return tokenList.indexOf(source) == -1;
      });
      return availableTags;
    },
    removeAllTags: function(e) {
      e.stopPropagation();
      e.preventDefault();
      this.setTokens([]);
      this.$input.blur();
      this.$input.autocomplete('close');
      this.$filterCloseBtn.hide();
      this.addPlaceholder();
    },
    keydownEvent: function(e){
      if(e.which === 40 || e.which === 38) {
        var activeItem = this.$dropdownMenu.find('.ui-menu-item-wrapper.ui-state-active');
        if(activeItem.length === 0) {
          this.$input.trigger(e);
        }
      }
    },
    editBtn: function(element){
      element.find('a.close').html('').addClass('tmicon tmicon-close-s tmicon-light tmicon-hoverable').removeClass('close').attr('href', 'javascript:;');
    },
    addPlaceholder: function(){
      this.$input.attr('placeholder', this.options.placeholder).addClass('placeholder');
    },
    tagValidate: function(event){
      var _self = this;
      $.each(this.rules, function(index, rule) {
        var onInvalid = _self.options.validators[rule].call(_self, event.attrs.value);
        if(!onInvalid) {
          var index = $.map(_self.options.rules, (ru) => ru.name).indexOf(rule);
          var erroMsg = _self.options.rules[index].message;
          _self.options.onTagInvalid[rule].call(_self, $(event.relatedTarget), rule);
          _self.tagInvalid($(event.relatedTarget), rule);
          _self.initTooltip(erroMsg, $(`.token-${rule}`));
          return false;
        }
      });
    },
    tagInvalid: function(elem, rule) {
      elem.addClass(`${this.options.defaultErrorClass} token-${rule}`);
    },
    checkTokenState: function(){
      this.$wrapper.find('.token-invalid').length > 0 ? this.tokenValidate(true) : this.tokenValidate(false);
    },
    tokenValidate: function(invalid){
      if(invalid) {
        this.$wrapper.addClass('form-invalid');
        this.$helpBlockText.html('There are invalid entries');
        this.$helpBlock.show();
      } else {
        this.$wrapper.removeClass('form-invalid');
        this.$helpBlock.hide();
      }
    },
    initTooltip: function(errorMsg, elem) {
      var tooltipLight = 
      `<div class="tooltip" role="tooltip">
        <div class="tooltip-inner tooltip-inner-light"></div>
      </div>`;
      elem.tooltip({
        title: errorMsg,
        container: 'body',
        template: tooltipLight
      }).on('mouseenter', function(e) {
        var top = $(this).offset().top + $(this).height() + 5;
        var left = e.clientX;
        $('.tooltip').css({top: top + 5, left: left });
      });
    },
    destoryTooltip: function(e) {
      if($(e.relatedTarget).data('bs.tooltip')) {
        $(e.relatedTarget).tooltip('destroy');
      }
    }
  });

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('token')
      var options = $.extend({}, Token.DEFAULTS, $this.data(), typeof option == 'object' && option)
      
      if (!data) $this.data('token', (data = new Token(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.token = $.extend(Plugin, $.fn.tokenfield);
  
}(jQuery);


$('#tags').token({
	allowEditing: false
});

$('#filterTags').token({
	allowEditing: false,
	createTokensOnBlur: false,
	autocomplete: {
    	source: ['Japan', 'Korea', 'Malaysia', 'Switzerland', 'Syria', 'Tahiti', 'Taiwan', 'Tajikistan']
	},
	showAutocompleteOnFocus: true,
	placeholder: 'Select ...'
});

$('#editTags').token({
  rules: [{
    name: 'ipv4',
    message: 'Invalid IP address'
  }, {
    name: 'duplicate',
    message: 'Duplicated entries'
  }],
  validators: {
    ipv4: function (value) {
      return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
    }
  }
});

$('#tagsValid').token({
  allowEditing: false,
  rules: [{
    name: 'ipv4',
    message: 'Invalid IP address'
  }, {
    name: 'duplicate',
    message: 'Duplicated entries'
  }],
  validators: {
    ipv4: function (value) {
      return /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
    }
  }
});