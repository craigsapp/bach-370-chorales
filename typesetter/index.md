---
verovio: "true"
title: "Bach chorale typesetter"
breadcrumbs: '[["/", "home"], ["/typesetter", "typesetter"]]'
github: https://github.com/craigsapp/bach-370-chorales/tree/gh-pages/typesetter
vim: ts=3
---

{% include header.html %}

On this page you can select any of the chorales and manipulate the
notation layout and measure range with the controls below to typeset
the music as you like.  When finished adjusting the music, click on the
red download button on the right to save an SVG image of the notation.
In addition, you can copy the text in the black box into an HTML page
to display the music on your own webpage.

<hr noshade>

{% include_relative right-side.html %}
{% include_relative typesetting-options.html %}

<hr noshade>


<div id="main-container">
<!-- the SVG notation will be inserted here -->
<script type="text/x-humdrum" id="main"></script>
</div>

{% include_relative typesetter.html %}
{% include_relative styles-local.html %}



