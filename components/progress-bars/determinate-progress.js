var progress = $('.progress-example .progress');
var progressbar = $('.progress-example .progress-bar');
var percentage = $('.progress-example .progress-bar span');
setInterval(function () {
  var valuenow = Math.floor((progressbar.width()/progress.width()) * 100) + '%';
    percentage.text(valuenow);
    progressbar.attr('aria-valuenow', valuenow);
}, 50);