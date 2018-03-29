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
      this._getMaskCharacter();
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
        // move cursor to available position when it moved to end of input field with empty text.
        if((e.metaKey && e.key === 'ArrowRight' ) || e.key === 'End' || e.key === 'ArrowDown') {
          e.preventDefault();
          inputVal = _self.element.val();
          startPosition = endPosition = inputVal.indexOf(_self.options.placeholderChar);
          _self.element[0].setSelectionRange(startPosition, endPosition);
        }
        // move cursor to available position when user press right arrow keyboard.
        if(e.key === 'ArrowRight'){
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
      this.element.on('keyup', function(e) {
        // move cursor to available position when user press Ctrl + ArrowRight.
        if(((e.ctrlKey || e.altKey) && e.key === 'ArrowRight' )) {
          var inputVal = _self.element.val();
          var sliceVal = inputVal.slice(0, _self.element[0].selectionEnd);
          if(sliceVal.indexOf(_self.options.placeholderChar) !== -1) {
            _self.alignCursor();
          }
        }
        //when user use keyboard(ctrlKey and shift key) to select text.
        var selectedLength = String(window.getSelection()).length;
        var keyCheck = ['Control', 'Meta', "Shift"].indexOf(e.key);
        if(selectedLength > 0 && (keyCheck > 0 || _self.element.is(":focus"))) {
          _self.setSelectionPos();
        }
      });
    },
    _getMaskCharacter: function(){
      var _self = this;
      var maskVal = this.options.mask;
      var uniqueArray = function(arrArg) {
        return arrArg.filter(function(elem, pos, arr) {
          return arr.indexOf(elem) == pos;
        });
      };
      var df = Object.keys(this.options.definitions).join('');
      df = `[${df}]`;
      this.element.data('regExpChar', uniqueArray(maskVal.replace(new RegExp(df, 'g'), '').split('')));
    },
    alignCursor: function(){
      this.mask.alignCursor();
    },
    setSelectionPos: function(){
      var selection = window.getSelection();
      var selectedStr = String(selection);
      var placeholderChar = this.element.data('hie-inputMask').mask.masked.placeholderChar;
      var indexOfPlaceholder = this.element.val().indexOf(placeholderChar);
      var regExpChar = this.element.data('regExpChar');
      var regPre = new RegExp(`^[${placeholderChar}${regExpChar.join('')}]*`); 
      var regSuf = new RegExp(`[${placeholderChar}${regExpChar.join('')}]*$`);
      var execPre = regPre.exec(selectedStr);
      var execSuf = regSuf.exec(selectedStr);
      var countPrefix = execPre[0]? execPre[0].length : 0;
      var countSuffix = execSuf[0]? execSuf[0].length : 0;
      var setRangeStart;
      var setRangeEnd;
      setRangeStart = this.element[0].selectionStart + countPrefix;
      setRangeEnd = this.element[0].selectionEnd - countSuffix;

      if(indexOfPlaceholder === -1 && selectedStr.length === this.element.val().length){
        //selected string without placeholder and it's full text select
        this.element[0].setSelectionRange(0, -1);
      }
      else if(countPrefix === countSuffix && (countPrefix || countSuffix) === selectedStr.length) {
        // set cursor to the end of available input position.
        this.alignCursor();
      }
      else {
      this.element[0].setSelectionRange(setRangeStart, setRangeEnd);
      }
    }
  });
  $(document).on('mouseup', function(e) {
    $('input:focus').filter(function(index, elem) {
      var selection = window.getSelection();
      return !!$(elem).data('hie-inputMask') && !!String(selection);
    }).each(function(index, elem) {
      $(elem).inputMask('setSelectionPos');
    });
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