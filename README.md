# `:visited` pseudo History Leaking

## Description

`:visited` pseudo class was limited getting part of style property for privacy reasons.

> For privacy reasons, browsers strictly limit which styles you can apply using this pseudo-class, and how they can be used:
>
> - Allowable CSS properties are `color`, ...
>
> From [:visited - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited#privacy_restrictions)

This repository was research result of implementation each browsers.

## Result

Generated Date: Tue, 18 May 2021 14:45:53 GMT

| Browser  | `color` of `:link` | `color` of `:visited` | Valid? |
| :------- | :----------------: | :-------------------: | :----: |
| chromium |  `rgb(0, 128, 0)`  |   `rgb(0, 128, 0)`    |   ⭕   |
| firefox  |  `rgb(0, 128, 0)`  |   `rgb(0, 128, 0)`    |   ⭕   |
| webkit   |  `rgb(0, 128, 0)`  |   `rgb(0, 128, 0)`    |   ⭕   |
