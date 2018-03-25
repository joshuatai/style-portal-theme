(function ($) {
  'use strict';

  $.widget('hie.inputMask', {
    options: {
      mask: '',
      prepare: function prepare(val) { return val; },
      definitions: {
        '0': /\d/,
        'a': /^[A-Za-z]+$/,
        'A': /^[A-Za-z0-9]+$/
      },
      lazy: false,  // make placeholder always visible
      placeholderChar: '_'
    },
    _create: function () {
      this._renderInputMaskInfo();
      this._getInputMaskCharData();
      this.mask = new IMask(this.element[0], this.options);
    },
    _renderInputMaskInfo: function () {
      var _self = this;
      var inputVal;
      var maskVal;
      var startPosition;
      var positionMaskVal;
      var positionInputVal;
      var maskRegExp;
      var selection;
      var endPosition;
      this.element.on('keydown', function(e) {
        if(e.which === 39){
          inputVal = _self.element.val();// user input value
          maskVal = _self.options.mask; // 'AA-AAAA-AAAA-AAAA'
          startPosition = _self.element[0].selectionStart;
          positionMaskVal = maskVal[startPosition]; // A or -(dash)
          positionInputVal = inputVal[startPosition]; // user input value or _(underline)
          maskRegExp = _self.options.definitions[positionMaskVal]; // **/^[A-Za-z0-9]+$/, /^[A-Za-z]+$/ ..... or undefined
          if(maskRegExp == null) {
            return;
          }
          if(maskRegExp.test(positionInputVal) === false) {
            e.preventDefault();
          }
        }
      });
    },
    _getInputMaskCharData: function(){
      var _self = this;
      var maskVal = this.options.mask;
      var filterVal;
      var charArray = [];
      var uniqueArray = function(arrArg) {
        return arrArg.filter(function(elem, pos, arr) {
          return arr.indexOf(elem) == pos;
        });
      };
      $.each(Object.keys(this.options.definitions), function(index, value) {
        var regex = new RegExp(value, 'g');
        if(maskVal.replace(regex, '') !== maskVal) {
          console.log(maskVal.replace(regex, '').split(''));
          _self.element.data('regExpChar', uniqueArray(maskVal.replace(regex, '').split('')));
        }
      });
    },
    alignCursor: function(){
      this.mask.alignCursor();
    }
  });
  $(document).on('mouseup', function(e) {
    $('input:focus').filter(function(index, elem) {
      var selection = window.getSelection();
      return !!$(elem).data('hie-inputMask') && !!String(selection);
    }).each(function(index, elem) {
      var selection = window.getSelection();
      var selectedStr = String(selection);
      var placeholderChar = $(elem).data('hie-inputMask').mask.masked.placeholderChar;
      var regExpChar = $(elem).data('regExpChar');
      var regPre = new RegExp(`^[${placeholderChar} ${regExpChar}]*`); ///^[_ : -.\s\(|\)]*/
      var regSuf = new RegExp(`[${placeholderChar} ${regExpChar}]*$`); ///[_ : -.\s\(|\)]*$/
      var countPrefix;
      var countSuffix;
      var setRangeStart;
      var setRangeEnd;
      countPrefix = selectedStr.length - selectedStr.replace(regPre, '').length;
      countSuffix = selectedStr.length - selectedStr.replace(regSuf, '').length;
      setRangeStart = elem.selectionStart + countPrefix;
      setRangeEnd = elem.selectionEnd - countSuffix;
      if(countPrefix === countSuffix) {
        $(elem).inputMask('alignCursor');
      }
      elem.setSelectionRange(setRangeStart, setRangeEnd);
    });
  });
})(jQuery);

$('[data-input-mask=phone]', this).inputMask({
  mask: '(00) -0000-0000'
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