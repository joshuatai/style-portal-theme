var searchField = $('[data-search-field=searchField]', this);
searchBox(searchField);

function searchBox(elem) {
  var $inputGroup = elem;
  var $input = $inputGroup.find('.form-control');
  var $closeBtn = $inputGroup.find('.tmicon-close-s');
  $input.on('keyup', function (e){
    $(this).val() === '' ? $closeBtn.hide() : $closeBtn.show();
  });
  $closeBtn.on('click', function (event){
    $input.val('').focus();
    $(this).hide();
  }); 
}


(function ($) {
  'use strict';
  $.widget( 'hie.searchBox', {
    // default options
    options: {
      placeholder: 'Type wording...',
      value: ''
    },
    // The constructor
    _create: function() {
      this.timer = null;

      this.$inputIconGroup = $('<div>', {
        'class': 'input-icon-group'
      });
      this.element.wrap(this.$inputIconGroup);

      this.$inputIconLabel = $('<label>', {
        'class': 'input-icon-label'
      }).insertAfter(this.element);
      this.$iconSearch = $('<i>', {
        'class': 'tmicon tmicon-search-o'
      }).appendTo(this.$inputIconLabel);

      this.$iconLoader = $('<span>', {
        'class': 'loader loader-small'
      }).hide().insertAfter(this.element);
      this.$iconClose = $('<span>', {
        'class': 'tmicon tmicon-close-s tmicon-light tmicon-hoverable'
      }).hide().insertAfter(this.element);

      this.element
        .on('focus', $.proxy(this.searchBoxFocus, this))
        .on('blur', $.proxy(this.searchBoxBlur, this))
        .on('keyup', $.proxy(this.searchBoxKeyUp, this));
      this.$iconClose
        .on('click', $.proxy(this.closeIconClick, this));
    },
    searchBoxFocus: function(){
      this.$iconSearch.addClass('focus');
    },
    searchBoxBlur: function(){
      this.$iconSearch.removeClass('focus');
    },
    searchBoxKeyUp: function(event) {
      var _self = this;
      var selectedLength = String(window.getSelection()).length;
      var keyCheck = ['Control', 'Meta', 'Shift', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].indexOf(event.key);
      if(this.element.val() === '') {
        this.$iconClose.hide();
      }
      else {
        clearTimeout(this.timer);
        if(this.element.val() !== '' && keyCheck === -1 && selectedLength === 0) {
          this.timer = setTimeout(function(){
            _self.$iconClose.hide();
            _self.$iconLoader.show();
            setTimeout(function(){
              _self.$iconLoader.hide();
              _self.$iconClose.show();
            }, 500);
          }, 300);
        }
      }
    },
    closeIconClick: function(event){
      this.element.val('');
      this.$iconLoader.hide();
      this.$iconClose.hide();
      this.element.focus();
    }
  });
  $('#searchBox').searchBox();
})(jQuery);