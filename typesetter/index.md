---
verovio: "true"
title: "Bach chorale typesetter"
breadcrumbs: '[["/", "home"], ["/typesetter", "typesetter"]]'
github: https://github.com/humdrum-tools/humdrum-js/tree/master/topic/chorales
vim: ts=3
---

{% include header.html %}

On this page you can select one of the chorales and manipulate the
notation with the controls below to typeset the music as you like.
When finished adjusting the music, click on the red download button on
the right to save an SVG image of the notation.  In addition, you can
copy the text in the black box into an HTML page to display the music
on your own webpage.

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



