# Bootstrap Time Picker

Bootstrap Time Picker is developed base on the Style Portal.

## Usage
### HTML
```html
<!DOCTYPE html>
<html>
  <head>
    <link href="timepicker.css" media="screen" rel="stylesheet">
  </head>
  <body>
    <input id="timepicker" type="text" class="form-control input-width-xs">
    <script src="timepicker.js"></script>
  </body>
</html>
```

### JavaScript
```javascript
$('#timepicker').timepicker(options);
```

## Dependencies
* [Style Portal - Time Picker](http://style-portal.tw.trendnet.org/#/styles/minimalism/1.7.0/f67b16d7-2d35-4c9c-bc5a-02e2824e46c3)


## API
### Properties
Name                | Type       | Default       | Description
:---                | :---       | :------------ | :----------
format              | String     | 'hh:mm:ss'    | The time format, combination of `hh, mm, and ss` with a splitter between different unit, such as `:`
value               | String     | None          | Set a time initially.
disabled            | Boolean    | false         | Manimulate whether a time picker will be enabled or disabled initially.
notEmpty            | Boolean    | true          | Manimulate whether a time picker can be empty or not.

### Methods
Name                | Parameters      | Return                 | Description
:---                | :-----------    | :--------------------- | :----------
getTime             | None            | Time Formated String   | Returns a formated time string.
setTime             | Time (String)   | None                   | Sets the internal time.
getHours            | None            | String of the hours    | Returns a string of the hours time.
setHours            | Hour (Number)   | None                   | Sets the internal hours time.
getMinutes          | None            | String of the minutes  | Returns a string of the minutes time.
setMinutes          | Minutes (Number)| None                   | Sets the internal minutes time.
getSeconds          | None            | String of the seconds  | Returns a string of the seconds time.
setHours            | Seconds (Number)| None                   | Sets the internal seconds time.
disable             | None            | None                   | Disables the timepicker.
destroy             | None            | None                   | Removes the timepicker functionality completely. This will return the element back to its pre-init state.

### Events
Name                | Parameters                          | Return   | Description
:---                | :---                                | :--------| :----------
change(event, time) | Event object, formatted time string | None     | Triggered when the time is changed.

## License
[MIT License (MIT)](http://opensource.org/licenses/MIT)
