## angular-ios-alertview
iOS7+ style alertview service for angular

### Install
```shell
bower install angular-ios-alertview
```

### Usage
1. include `angular-ios-alertview.js` and `angular-ios-alertview.css` in you html
2. include `angular-ios-alertview` in you angular dependencies
3. inject `iosAlertView` in you angular app

### All options
(Note: some options are specific to different alertview type, e.g. `remindTime` is only for `iosAlertView.remind`)

- `title`, alertview title, default empty
- `text`, alertview content, support html string. default empty
- `input`, whether show input form, default `false`
- `inputType`, input field type, default `text`
- `inputPlaceholder`, input field placeholder, default empty
- `cancelText`, cancel button text, default `Cancel`
- `okText`, ok button text, default `OK`
- `remindTime`, remind show duration, default `250`ms
- `buttons`, array of button object.

    an example of button object
    ```js
    {
      text: 'OK',
      bold: true,
      onClick: function(data){
        // data.index
        // data.button
        // data.inputValue
      }
    }
    ```

- `defaultOption`, the option key if you just pass in a string when you invoke `alert`, `comfirm`, `prompt` or `remind`. default `text`, you can set it to `title` or something else.

### APIs
0. `iosAlertViewProvider.set`, set global option in you configBlock.
1. `iosAlertView`, base of other methods

    - params: string or object. when string, option[defaultOption] is set.
    - return: promise

2. `iosAlertView.alert`

    - params: string or object. when string, option[defaultOption] is set.
    - return: promise

    promise will be resoved when user click button

3. `iosAlertView.confirm`

    - params: string or object. when string, option[defaultOption] is set.
    - return: promise

    promise will be resolved when user click OK button, or be rejected when user click Cancel button

4. `iosAlertView.prompt`

    - params: string or object. when string, option[defaultOption] is set.
    - return: promise

    promise will be resolved with `inputValue` when user click OK button, or be rejected when user click Cancel button.

5. `iosAlertView.remind`

    - params: string or object. when string, option[defaultOption] is set.
    - return: promise

    promise will be resolved when `remindTime` later

### License
MIT
