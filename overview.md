# [Preventing attacks on a user's history through CSS `:visited` selectors](https://dbaron.org/mozilla/visited-privacy)

## Problem

> It's been widely known for a while that CSS's ability to style visited links differently from unvisited ones, combined with other Web technology such as JavaScript or simply loading of background images, lets Web pages determine whether a URL is in the user's history very quickly and without any interaction from the user.

## Possible Exploit

### Using `background-image` style

If user had visited to `https://site.com`, browser send request for `/visited/site.com.png`.

```html
<style>
  a:visited[href="https://site.com"]
  {
    background-image: url("/visited/site.com.png");
  }
</style>
<a href="https://site.com">a</a>
```

### Using `color` style

```html
<style>
  a:link {
    color: rgb(255, 0, 0);
  }

  a:visited {
    color: rgb(0, 0, 255);
  }
</style>
<a href="https://site1.com">1</a>
<a href="https://site2.com">2</a>
<a href="https://site3.com">3</a>
<script>
  window.onload = () => {
    document.querySelectorAll("a").forEach((a) => {
      const { color } = window.getComputedStyle(a);
      console.log(
        `${a.href}: ${color === "rgb(0, 0, 255)" ? "visited" : "unvisited"}`
      );
    });
  };
</script>
```

### Others

> They can make visited and unvisited links take up different amounts of space, and then determine whether the link is visited from the positions of other elements on the page.

1. Put `:link` on the left, `:visited` on the right
2. Rendering `document` to `<canvas>`
3. Get `:visited` links from location in the `<canvas>`

> They can use CSS features such that matching selectors, doing layout, or doing painting would take a different amount of time depending on whether the link is visited or unvisited, and then run a performance test.

- Like [Guest Blog Post: Leaking silhouettes of cross-origin images – Attack & Defense](https://blog.mozilla.org/attack-and-defense/2021/01/11/leaking-silhouettes-of-cross-origin-images/)

## Solution for Preventing

1. Compute link node style as unvisited, and generate first style context
2. If the link node has a relevant link, compute style as visited and all other links are unvisited and generate second style context
3. If link is visited, combines two style context and apply
   - Target properties: `color`, `background-color`, `border-*-color`, `outline-color`, `column-rule-color`, `fill`, `stroke`
   - Get RGB of `<color>` from second context
   - Get alpha of `<color>` from first context
   - If value of alpha of second context is zero, use [`inherit`](https://developer.mozilla.org/ja/docs/Web/CSS/inherit) value
   - If link is unvisited, use first style context

All code use first style context with exceptions.
As a result, it makes some [lies](#Effect).

## Effect

> It makes `getComputedStyle` (and similar functions such as `querySelector`) lie by acting as though all links are unvisited.

```js
window.getComputedStyle(document.querySelector("a")); // always return style for `a:link`
document.querySelector(":visited"); // always return empty list
```

> It makes certain CSS selectors act as though links are always unvisited, even when they are visited.

- styles for `:visited + span` and `:visited > span` will be not applied
  - Because `a:visited` always act as `not(:visited)`

```css
a > span {
  /* applied */
}
a:visited > span {
  /* applied */
}
a + span {
  /* not applied */
}
a:visited + span {
  /* not applied */
}
```

> It limits the CSS properties that can be used to style visited links

- Available: `color`, `background-color`, `border-*-color`, `outline-color`, `column-rule-color`
