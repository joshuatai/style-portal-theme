# Bootstrap Date Picker

Bootstrap Date Picker is developed base on the Bootstrap plugin ([uxsolutions-bootstrap-datepicker-plugin](https://github.com/uxsolutions/bootstrap-datepicker/blob/master/docs/index.rst)), and adopted the Trend Micro Style Portal.

## Usage
### HTML
```html
<!DOCTYPE html>
<html>
  <head>
    <link href="datepicker.css" media="screen" rel="stylesheet">
  </head>
  <body>
    <input id="datepicker" type="text" class="form-control input-width-xs">
    <script src="datepicker.js"></script>
  </body>
</html>
```

### JavaScript
```javascript
$('#datepicker').datepicker(options);
```

## Dependencies
* [bootstrap-datepicker-plugin homepage and documentation](http://www.eyecon.ro/bootstrap-datepicker/)
* [Style Portal - Date Picker](http://style-portal.tw.trendnet.org/#/styles/minimalism/1.7.0/f67b16d7-2d35-4c9c-bc5a-02e2824e46c3)


## API
### Properties
Name                | Type       | Default       | Description
:---                | :---       | :------------ | :----------
format              | String     | 'yyyy-mm-dd'  | The date format, combination of `yyyy, mm, and dd`.
disabled            | Boolean    | true          | Manimulate whether a date picker will be enabled or disabled.

### Methods
Name                | Parameters | Return        | Description
:---                | :---       | :------------ | :----------
getDate             | None       | Date Object   | Returns a localized date object representing the internal date object of the first datepicker in the selection. For multidate pickers, returns the latest date selected.
getUTCDate          | None       | Date Object   | Returns the internal UTC date object, as-is and unconverted to local time, of the first datepicker in the selection. For multidate pickers, returns the latest date selected.
setDate             | date (Date)| None          | Sets the internal date. `date` is assumed to be a “local” date object, and will be converted to UTC for internal use.
setUTCDate          | date (Date)| None          | Sets the internal date. `date` is assumed to be a UTC date object, and will not be converted.
disable             | None       | None          | Disables the datepicker.
destroy             | None       | None          | Removes the datepicker functionality completely. This will return the element back to its pre-init state.

### Events
Name                | Parameters                          | Return   | Description
:---                | :---                                | :--------| :----------
change(event, date) | Event object, formatted date string | None     | Triggered when the date is changed.
focus(event)        | Event object                        | None     | Triggered when the input element of datepicker is focused in.
click(event)        | Event object                        | None     | Triggered when the input element of datepicker is clicked.
blur(event)         | Event object                        | None     | Triggered when the input element of datepicker is focused out.
keydown(event)      | Event object                        | None     | Triggered when the keydown behavior is on the input element of datepicker.

## License
[MIT License (MIT)](http://opensource.org/licenses/MIT)
