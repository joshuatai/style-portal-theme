$('[data-input-mask=date]', this)
  .inputmask('mm/dd/yyyy', {showMaskOnFocus: false, showMaskOnHover: false});

$('[data-input-mask=time]', this)
  .inputmask('hh:mm:ss', {showMaskOnFocus: false, showMaskOnHover: false});

$('[data-input-mask=phone]', this)
  .inputmask('(999) 999-9999', {placeholder: "(000) 000-0000", showMaskOnFocus: false, showMaskOnHover: false});

$('[data-input-mask=activation]', this)
  .inputmask(
    "**-****-****-****-****-****-****",
    {
      placeholder: "  -    -    -    -    -    -    -    -",
      clearMaskOnLostFocus: false 
    }
  );