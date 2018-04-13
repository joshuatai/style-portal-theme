var searchField = $('[data-search-field=searchField]', this);
searchBox(searchField);

function searchBox(elem) {
  var $inputGroup = elem;
  var $loadingIcon = $('<span />').addClass('loader loader-small');
  var $input = $inputGroup.find('.form-control');
  var $closeBtn = $inputGroup.find('.tmicon-close-s');
  var timer = null;
  $inputGroup.append($loadingIcon);
  $loadingIcon.hide();
  $input.on('keyup', function (e){
    if($(this).val() === '') {
      $closeBtn.hide();
    }
    else {
      clearTimeout(timer);
      if($(this).val() !== '') {
        timer = setTimeout(function(){
          $closeBtn.hide();
          $loadingIcon.show();
          setTimeout(function(){
            $loadingIcon.hide();
            $closeBtn.show();
          }, 800);
        }, 500);
      }
    }
  });
  $closeBtn.on('click', function (event){
    $input.val('');
    $input.focus();
    $loadingIcon.hide();
    $(this).hide();
  }); 
}
