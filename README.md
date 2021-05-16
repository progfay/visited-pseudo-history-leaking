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

| Browser (version)      | `color` of `:link` | `color` of `:visited` | Valid? |
| :--------------------- | :----------------: | :-------------------: | :----: |
| chromium (92.0.4498.0) |  `rgb(0, 128, 0)`  |   `rgb(0, 128, 0)`    |   ⭕   |
| firefox (89.0b6)       |  `rgb(0, 128, 0)`  |   `rgb(0, 128, 0)`    |   ⭕   |
| webkit (14.2)          |  `rgb(0, 128, 0)`  |   `rgb(0, 128, 0)`    |   ⭕   |
