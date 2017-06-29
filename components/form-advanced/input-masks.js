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