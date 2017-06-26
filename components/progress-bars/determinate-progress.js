var progress = $('.progress-example .progress');
var progressbar = $('.progress-example .progress-bar');
var percentage = $('.progress-example .progress-bar span');
// var flag = false;
// var setIndeterminate = function () {
//   percentage.text('0%');
//   progressbar.attr('aria-valuenow', 0);
//   setTimeout(setDeterminate, 3000);
// }
// var setDeterminate = function () {
//   var determinateInterval = setInterval(function () {
//     var valuenow = Math.floor((progressbar.width()/progress.width()) * 100) + '%';
//     percentage.text(valuenow);
//     progressbar.attr('aria-valuenow', valuenow);
//     if (progressbar.width() === progress.width()) {
//       flag = true;
//     }
//     if (progressbar.width() < 50 && flag === true) {
//       flag = false;
//       clearInterval(determinateInterval);
//       setIndeterminate();
//     }
//   }, 50);
// }
// setDeterminate();
setInterval(function () {
  var valuenow = Math.floor((progressbar.width()/progress.width()) * 100) + '%';
    percentage.text(valuenow);
    progressbar.attr('aria-valuenow', valuenow);
}, 50);