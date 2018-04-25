!function($) {
  
    'use strict';
  
    var _super = $.fn.tokenfield;
  
    var Token = function(element, options) {
      var _self = this;
      var autocomplete = $.extend({
        classes: {'ui-autocomplete': 'dropdown-menu'},
        autoFocus: true,
        defaultHighlightClass: 'matched',
        allowNewTag: false,
        delay: 0
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
      this.invalidHelpBlockInfo = 'There are invalid entries.';
      this.invalidInputClass = 'form-invalid';
      
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
  
      //add placeholder
      if(this.getTokens().length === 0){
        this.addPlaceholder();
      }
  
      // [editable] add editable class if the token is allowEditing
      if(this.options.allowEditing) {
        this.$wrapper.addClass('editable');
      }
  
      // [autocomplete] 
      if(autocomplete.source && autocomplete.source.length > 0) {
        
        this.$dropdownMenu = this.$input.autocomplete('widget');
        this.$wrapper.addClass('autocomplete');
        this.$wrapper.append(this.$filterCloseBtn); // add filter close btn if has default tokens
        
        if(this.getTokens().length === 0){
          this.$filterCloseBtn.hide();
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
            //if input field in selected mode, close dropdown menu.
            if (_self.$wrapper.find('.token.active').length > 0) {
              _self.$input.autocomplete('close');
            };
          })
          .on('autocompletesearch', function(e, ui){
            //fix bug in jQuery.ui somewhere where menu.bindings just grows and grows when searching.
            _self.$input.data("ui-autocomplete").menu.bindings = $();
            $('.ui-helper-hidden-accessible').html('');
          })
          .on('autocompletefocus', function(e, ui){
            // prevent the action of replace the text field's value
            e.preventDefault();
            _self.$input.data('selectedVal', ui.item.value);
          })
          .on('autocompleteresponse', function(e, ui){
            var noMatch = ui.content[0].value === _self.options.noMatch ? true : false;
            _self.$input.data('noMatch', noMatch);
            _self.$dropdownMenu.toggleClass('no-match', noMatch);
          });
  
          // resize the menu style.
          this.$input.data('ui-autocomplete')._resizeMenu = function(){
            this.menu.element.css({'width': _self.elementWidth, 'min-width': _self.elementWidth});
          }
          // highlight the match item text and return the custom menu items.
          this.$input.data('ui-autocomplete')._renderItem = function(ul, item){
            var regExp = new RegExp(`(${this.term})`, 'gi');
            var temp = `<span class="${autocomplete.defaultHighlightClass}">$1</span>`;
            var $li = $('<li/>').appendTo(ul);
            var availableTokens = _self.filterAvailableTokens();
            var label = item.label.replace(regExp, temp);
            if($.inArray(item.label, availableTokens) === -1) {
              label = `Press ENTER to add "${this.term}"`
            }
            if(_self.$input.data('noMatch')){
              label = item.label;
            }
            $('<a/>').attr('href', '#').html(label).appendTo($li);
            return $li;
          }
  
          // handle tab key when token field with autocomplete
          var handlers = $._data( this.$input[0], "events").keydown;
          var othersEvents = handlers.slice(0); // get all third party "keydown" event.
          handlers.splice(0, 2); // clear all keydown event.
          this.$input.on('keydown', function (e) {
            // handle creating tokens from customize events
            if (e.key === 'Enter') {
              _self.customCreateToken();
              return false;
            }
            // prevent the tab key insert new tag, when token field with autocomplete.
            if (e.key !== 'Tab') {
              for(var i = 0; i < othersEvents.length; i++) {
                othersEvents[i].handler.apply(this, [e]);
              }
            }
          });
      }
  
      this.$element
        .on('tokenfield:createtoken', function (e) {
          // [autocomplete] stop create token, when entry text is not in drop down list. 
          if(autocomplete.source && autocomplete.source.length > 0) {
            if(!_self.options.autocomplete.allowNewTag) {
              var availableTokens = _self.filterAvailableTokens();
              var notExists = availableTokens.every(function(token) {
                return token !== e.attrs.value;
              });
              if(notExists) {
                e.preventDefault();
                _self.$input.val('');
              }
            }
            if(_self.$input.data('noMatch') && e.attrs.value === _self.options.noMatch) {
              e.preventDefault();
              _self.$input.val('');
              _self.$input.blur();
            }
          }
        })
        .on('tokenfield:createdtoken', function (e) {
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
            _self.search();
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
        message: 'Entry already exists'
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
      customCreateToken: function() {
        // always add the selected item into token field.
        if (this.$input.data('ui-autocomplete') && this.$input.data('ui-autocomplete').menu.element.find("li:has(a.ui-state-active)").length) {
          if(!this.$input.data('noMatch')) {
            if (this.createToken(this.$input.data('selectedVal'))) {
              this.$input.val('');
              this.search();
            }
          }
          else {
            this.$input.val('');
            this.$input.blur();
          }
        }
      },
      search: function () {
        if (this.$input.data('ui-autocomplete')) {
          var _self = this;
          var availableTags = this.filterAvailableTokens();
          this.$input.autocomplete({
            source: function(request, response) {
              var filterTags = $.ui.autocomplete.filter(availableTags, request.term);
              var resSource = [];
              $.each(filterTags, function(key, value) {
                resSource.push({label: value, value: value});
              });
              //allow new tag need to add new option at the first of menu item.
              if(_self.options.autocomplete.allowNewTag && request.term !=='' && $.inArray(request.term, filterTags) === -1) {
                resSource.unshift({label: request.term, value: request.term});
              }
              else {
               resSource = filterTags.length ? resSource : [{label: _self.options.noMatch, value: _self.options.noMatch}]
              }
              response(resSource);
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
      keydownEvent: function(e) {
        //use keyboard to continue select
        if (this.$input.data('ui-autocomplete')) {
          if(e.which === 40 || e.which === 38) {
            var activeItem = this.$dropdownMenu.find('.ui-menu-item-wrapper.ui-state-active');
            if(activeItem.length === 0) {
              this.$input.trigger(e);
            }
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
          this.$wrapper.addClass(this.invalidInputClass);
          this.$helpBlockText.html(this.invalidHelpBlockInfo);
          this.$helpBlock.show();
        } else {
          this.$wrapper.removeClass(this.invalidInputClass);
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
    // user press esc key to unselect tokens and focus the input field.
    $(document).on('keyup', function(e) {
      var tokenField = $('.tokenfield.focus');
      if(e.key === 'Escape' && tokenField.length ) {
        var activeTokens = tokenField.find('.token.active');
        var tokenInput = tokenField.find('.token-input');
        if(activeTokens.length > 0) {
          tokenInput.focus();
        }
      };
    });
  
    $.fn.token = $.extend(Plugin, $.fn.tokenfield);
  
  }(jQuery);