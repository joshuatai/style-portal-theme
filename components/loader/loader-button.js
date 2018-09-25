const $loader = $('<span />').addClass('loader loader-small');
const $iconUploadBtn = $('[data-loading=buttonIcon]', this);
const $textUploadBtn = $('[data-loading=buttonText]', this);
const textUploadBtnWidth = $textUploadBtn.outerWidth();
const $clone = $textUploadBtn.clone().addClass('btn-clone').text('Uploading').prepend($loader.clone());

$iconUploadBtn.tooltip();
$iconUploadBtn.click(e => {
  $iconUploadBtn.tooltip('hide');
  const $tmicon = $iconUploadBtn.find('.tmicon');
  $tmicon.detach() && $iconUploadBtn.prop('disabled', true).append($loader);
  setTimeout(_ => {
    $loader.detach() && $iconUploadBtn.prop('disabled', false).append($tmicon);
  }, 2000);
});


$textUploadBtn.click(e => {
  const $btnText = $textUploadBtn.text();
  $textUploadBtn.text('Uploading') && $textUploadBtn.prop('disabled', true).prepend($loader);
  $textUploadBtn.animate({ width: $clone.outerWidth() }, 150);
  setTimeout(() => {
    $loader.detach();
    $textUploadBtn.animate({ width: textUploadBtnWidth }, {
      duration: 150,
      complete: _ => $textUploadBtn.text($btnText).prop('disabled', false)
    });
  }, 2000);
});

$textUploadBtn.after($clone).css('width', textUploadBtnWidth);