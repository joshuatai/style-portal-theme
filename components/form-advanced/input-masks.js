(function ($) {
  'use strict';

  $.widget('hie.inputMask', {
    options: {
      mask: '',
      prepare: function prepare(val) { return val; },
      definitions: {
        '0': /\d/,
        'a': /^[A-Za-z]+$/,
        '*': /./,
        'A': /^[A-Za-z0-9]+$/
      },
      lazy: false,  // make placeholder always visible
      placeholderChar: '_'
    },
    _create: function () {
      this._renderInputMaskInfo();
      this.mask = new IMask(this.element[0], this.options);
    },
    _renderInputMaskInfo: function () {
      var _self = this;
      this.element.on('keydown', function(e) {
        if(e.which === 39){
          var inputVal = _self.element.val();// user input value
          var maskVal = _self.options.mask; // 'AA-AAAA-AAAA-AAAA'
          var startPosition = _self.element[0].selectionStart;
          
          var positionMaslVal = maskVal[startPosition]; // A or -(dash)
          var positionInputVal = inputVal[startPosition]; // user input value or _(underline)
          var maskRegExp = _self.options.definitions[positionMaslVal]; // **/^[A-Za-z0-9]+$/ or undefined
          if(maskRegExp == null) {
            return;
          }
          if(maskRegExp.test(positionInputVal) === false) {
            e.preventDefault();
          }
        }
      });
    }
  });
})(jQuery);

$('[data-input-mask=phone]', this).inputMask({
  mask: '(00)-0000-0000'
});
$('[data-input-mask=mobilePhone]', this).inputMask({
  mask: '0000-000-000'
});
$('[data-input-mask=macAddress]', this).inputMask({
  mask: 'AA:AA:AA:AA:AA:AA',
  prepare: function (str) {
    return str.toUpperCase();
  }
});
$('[data-input-mask=activation]', this).inputMask({
  mask: 'AAA-AAAA-AAAA-AAAA',
  prepare: function (str) {
    return str.toUpperCase();
  }
});