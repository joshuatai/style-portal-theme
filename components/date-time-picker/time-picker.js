var container = this;
var timePicker = $('[data-time-picker=time-picker]', container);
timePicker.timeEntry({
  show24Hours: true, 
  showSeconds: true,
  spinnerImage: null
})
.on('keydown', function(ev){
  var timeText;
  var input = $(this);
  var value = input.val();            // Get value of time input 
  var getHours = value.substring(0,2);      // Get Hours value
  var getMinutes = value.substring(3,5);        // Get Minutes value
  var getSeconds = value.substring(6,8);      // Get Seconds value
  var start = input.prop('selectionStart');   // Get the keydown start position
  var enterNum = String.fromCharCode(ev.keyCode); // Get the digits 
  var hoursPosition = 0;              // Get input hours position index
  var minutesPosition = 3;              // Get input minutes position index
  var secondsPosition = 6;             // Get input seconds position index
  
  // Allow: Ctrl/cmd+C
  if (ev.keyCode == 67 && (ev.ctrlKey === true || ev.metaKey === true)){
      return;
  }
  
  if ((ev.shiftKey || (ev.keyCode < 48 || ev.keyCode > 57)) && (ev.keyCode < 96 || ev.keyCode > 105)) {
    ev.preventDefault();
  } else {
    ev.preventDefault();

    if(start == hoursPosition) {

      var hours = $(this).data();
      if (hours.firstDigits == null) {
        hours.firstDigits = enterNum;
        var newHours = `0${hours.firstDigits}`;
      } else {
        hours.secondDigits = enterNum;
        var newHours = hours.firstDigits + hours.secondDigits;
        if (parseInt(newHours) > 23) {
          newHours = 23;
        }
      }
      // Update time value
      timeText = combineTime(hoursPosition, newHours, value);
      input.timeEntry('setTime', timeText);
      // Change Position
      if (hours.secondDigits == null) {
        showField(this, hoursPosition);
      } 
      else {
        showField(this, minutesPosition);
        input.trigger('click.timeEntry');
        resetInputData(input);
      }
    }
    else if(start == minutesPosition){   

      var minutes = $(this).data();
      if (minutes.firstDigits == null) {
        minutes.firstDigits = enterNum;
        var newMinutes = `0${minutes.firstDigits}`;
      } else {
        minutes.secondDigits = enterNum;
        var newMinutes = minutes.firstDigits + minutes.secondDigits;
        if (parseInt(newMinutes) > 59) {
          newMinutes = "00";
        }
      }
       // Update time value
      timeText = combineTime(minutesPosition, newMinutes, value);
      input.timeEntry('setTime', timeText);
      // Change Position
      if (minutes.secondDigits == null) {
        showField(this, minutesPosition);
      } 
      else {
        showField(this, secondsPosition);
        input.trigger('click.timeEntry');
        resetInputData(input);
      }
    }
    else if(start == secondsPosition){
      var seconds = $(this).data();
      if (seconds.firstDigits == null) {
        seconds.firstDigits = enterNum;
        var newSeconds = `0${seconds.firstDigits}`;
      } else {
        seconds.secondDigits = enterNum;
        var newSeconds = seconds.firstDigits + seconds.secondDigits;
        if (parseInt(newSeconds) > 59) {
          newSeconds = "00";
        }
      }
      // Update time value
        timeText = combineTime(secondsPosition, newSeconds, value);
        input.timeEntry('setTime', timeText);
      // Change Position
      if (seconds.secondDigits != null) {
        showField(this, secondsPosition);
        resetInputData(input);
      }
    }
  }
});

function resetInputData (input) {
    input.removeData("firstDigits");
    input.removeData("secondDigits");
}

function combineTime (startIdx, newTime, fullTime) {
  var timeText;
  switch(startIdx) {
      case 0:
          timeText = newTime + fullTime.substring(2);
          break;
      case 3:
          timeText = fullTime.substring(0, 3) + newTime + fullTime.substring(5);
          break;
      case 6:
          timeText = fullTime.substring(0, 6) + newTime;
  }
  return timeText;
}

function showField (input, startIdx) {
  var start = 0;
  var end = 0
  var hoursPosition = 0;              // Get input hours position index
  var minutesPosition = 3;              // Get input minutes position index
  var secondsPosition = 6;             // Get input seconds position index
  switch(startIdx) {
      case 0:
          start = hoursPosition;
          end = start + 2;
          break;
      case 3:
          start = minutesPosition;
          end = start + 2;
          break;
      case 6:
          start = secondsPosition;
          end = start + 2;
  }
  input.setSelectionRange(start, end);
}





