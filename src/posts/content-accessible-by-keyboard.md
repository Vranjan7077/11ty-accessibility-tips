---
title: Using keyboard for content accessibility
topics: Javascript
---

General keycode values used :

| Key           | Code |
| ------------- | ---- |
| `tab`         | `9`  |
| `enter`       | `13` |
| `space`       | `32` |
| `left arrow`  | `37` |
| `up arrow`    | `38` |
| `right arrow` | `39` |
| `down arrow`  | `40` |

```javascript
var code = e.keyCode ? e.keyCode : e.which;
```

```javascript
var keyCode = e.keyCode || e.which;
```

```javascript
$('#id').on('keyup keypress', function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode == 32 || keyCode == 13) {
        e.preventDefault();
        return false;
    }
});
```

## Trapping focus inside modal

```javascript
$(document).ready(function () {
    $('#yourModal').on('shown.bs.modal', function () {
        $(this).focus();
    });
});
```
