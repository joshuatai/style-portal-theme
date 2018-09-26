const $loader = $('<span />').addClass('loader loader-small');
const $iconUploadBtn = $('[data-loading=buttonIcon]', this);
const $textUploadBtn = $('[data-loading=buttonText]', this);
const textUploadBtnWidth = $textUploadBtn.outerWidth();
const $clone = $textUploadBtn.clone().addClass('btn-clone').text('Uploading').prepend($loader.clone());

$iconUploadBtn.tooltip();
$iconUploadBtn.click(e => {
  $iconUploadBtn.tooltip('hide');
  const $loader = $('<span />').addClass('loader loader-small');
  const $tmicon = $iconUploadBtn.find('.tmicon');
  $tmicon.detach() && $iconUploadBtn.prop('disabled', true).append($loader);
});

$textUploadBtn.click(e => {
  const $loader = $('<span />').addClass('loader loader-small');
  $textUploadBtn.text('Uploading') && $textUploadBtn.prop('disabled', true).prepend($loader);
  $textUploadBtn.animate({ width: $clone.outerWidth() }, 100);
});

$textUploadBtn.after($clone).css('width', textUploadBtnWidth);