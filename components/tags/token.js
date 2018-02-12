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
    this.$element         = $(element);
    this.$controlWrapper  = $('<div />');
    this.$filterCloseBtn  = $('<span />').addClass('tmicon tmicon-close-s tmicon-light tmicon-hoverable');
    this.elementWidth     = this.$element.outerWidth();

    this.$helpBlock = $('<span />').addClass('help-block help-block-invalid help-block-with-icon');
    this.$helpBlockIcon = $('<span />').addClass('tmicon tmicon-warning-circle tmicon-color-error');
    this.$helpBlockText = $('<span />').addClass('invalid-text');

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
        // stop create token, when the token is existing.
        _self.getTokens().some(function(token) {
          if (token.value === e.attrs.value) {
            e.preventDefault();
            _self.validationState(true);
            return true;
          }
        });
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
        // add close icon style
        _self.editBtn($(e.relatedTarget));
        // remove plugin default token label attr style of width
        $(e.relatedTarget).find('.token-label').prop('style').removeProperty('max-width');
        _self.$input.removeAttr('placeholder').removeClass('placeholder');
        _self.$filterCloseBtn.show();
        _self.validationState(false);
        // open the filter menu
        if(autocomplete.source && autocomplete.source.length > 0) {
          _self.$input.autocomplete('search');
        }
      })
      .on('tokenfield:editedtoken', function (e) {
        // set cursor to the end of input.
        var inputValLength = _self.$input.val().length;
        _self.$input[0].setSelectionRange(inputValLength, inputValLength);
      })
      .on('tokenfield:removedtoken', function (e) {
        if(_self.getTokens().length === 0) {
          _self.$filterCloseBtn.hide();
          _self.addPlaceholder();
        }
        if(_self.$wrapper.hasClass('form-invalid')){
          _self.validationState(false);
        }
      });

    this.bindEvents();
  }

  Token.DEFAULTS = $.extend( _super.defaults, {
    createTokensOnBlur: true,
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
        .on('mousedown', $.proxy(this.keeyDropdownMenuOpen, this));
      this.$input
        .on('click', $.proxy(this.search, this))
        .on('keydown', $.proxy(this.keydownEvent, this));
      this.$filterCloseBtn
        .on('mousedown', $.proxy(this.removeAllTags, this)); // use mousedown to prevent the autocomplete menu show first when click the close button.
    },
    keeyDropdownMenuOpen: function(e) {
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
      if(this.$wrapper.hasClass('form-invalid') && e.which !== 13){
        this.validationState(false);
      }
    },
    editBtn: function(element){
      element.find('a.close').html('').addClass('tmicon tmicon-close-s tmicon-light tmicon-hoverable').removeClass('close').attr('href', 'javascript:;');
    },
    addPlaceholder: function(){
      this.$input.attr('placeholder', this.options.placeholder).addClass('placeholder');
    },
    validationState: function(state){
      if(state) {
        this.$wrapper.addClass('form-invalid');
        this.$helpBlockText.html('Duplicated items');
        this.$helpBlock.show();
      } else {
        this.$wrapper.removeClass('form-invalid');
        this.$helpBlock.hide();
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

$('#editTags').token();

$('#tagsValid').token({
	allowEditing: false
});