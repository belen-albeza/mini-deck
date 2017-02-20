# minideck

Minimal HTML5 deck builder, mostly a fork of Sole's [MVSP](https://github.com/sole/mvsd/), adapted to suit my needs.

## How to use

- Download this repository.
- Edit `index.html` to add your own slides. In the code provided, every slide is a `<section>`.
- Edit `minideck/simple-theme.css` (or roll your own theme CSS file) to customise appearance.

You might also want to concatenate all the CSS files and JS into bundles.

### Styling

You should be editing `simple-theme.css`, or create your own CSS file. Avoid tweaking `minideck.css`, since it contains the (tiny) core base of styles for the slide deck to work.

### Syntax highlighting for source code

[Highlight.js](https://highlightjs.org/) has been included in `vendor/` for syntax highlighting.

If you don't need this feature, feel free to remove both `highlight.js` and `highlight.css`, as well as their `<script>` and `<link>` tags in `index.html`.

The built of this library included supports the following languages:

- Markup (HTML, XML…)
- CSS
- C-like
- Javascript
- Bash

For it to work, you need to wrap your code in a `<code>` tag with the class set to the relevant language: `js`, `css`, etc. Example:

```html
<pre><code lang="js">
console.log('Hello, world!')
</code></pre>
```
