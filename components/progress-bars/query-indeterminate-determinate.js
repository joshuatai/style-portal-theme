var progress = $('.indeterminate-determinate-example .progress');
var progressbar = $('.indeterminate-determinate-example .progress-bar');
var percentage = $('.indeterminate-determinate-example .progress-bar span');
var flag = false;
var setIndeterminate = function () {
  progressbar.removeClass('progress-bar-determinate progress-bar-striped active');
  progressbar.addClass('progress-bar-indeterminate');
  percentage.text('0%');
  progressbar.attr('aria-valuenow', 0);
  setTimeout(setDeterminate, 3000);
}
var setDeterminate = function () {
  progressbar
    .removeClass('progress-bar-indeterminate')
    .addClass('progress-bar-determinate progress-bar-striped active');

  var determinateInterval = setInterval(function () {
    var valuenow = Math.floor((progressbar.width()/progress.width()) * 100) + '%';
    percentage.text(valuenow);
    progressbar.attr('aria-valuenow', valuenow);
    if (progressbar.width() === progress.width()) {
      flag = true;
    }
    if (progressbar.width() < 50 && flag === true) {
      flag = false;
      clearInterval(determinateInterval);
      setIndeterminate();
    }
  }, 50);
}
setIndeterminate();