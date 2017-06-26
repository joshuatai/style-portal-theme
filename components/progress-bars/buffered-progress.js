var progress = $('.progress-buffered-example .progress');
var progressbar = $('.progress-buffered-example .progress-bar').not('.progress-bar-buffered');
var progressbarBuffered = $('.progress-buffered-example .progress-bar-buffered');
var percentage = $('.progress-buffered-example .progress-bar span');

window.setInterval(function () {
  var valuenow = Math.floor((progressbar.width()/progress.width()) * 100) + '%';
  var bufferednow = Math.floor((progressbarBuffered.width()/progress.width()) * 100) + '%';
  percentage.text(valuenow);
  progressbar.attr('aria-valuenow', valuenow);
  progressbarBuffered.attr('aria-bufferednow', bufferednow);
}, 100);
