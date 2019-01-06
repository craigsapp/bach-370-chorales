---
verovio: "true"
title: "Bach chorale typesetter"
breadcrumbs: '[["/", "home"], ["/typesetter", "typesetter"]]'
github: https://github.com/craigsapp/bach-370-chorales
vim: ts=3
---

{% include_relative styles-local.html %}

<style>
#banner #page-title {
	margin-left: -425px !important;
}
</style>

{% include header.html %}

On this page you can select any chorale and manipulate the layout or
measure range using the parameter controls given below.  After adjusting
the music, click on the red download button in the right margin to save
an SVG image of the notation, which can be inserted into your webpages,
or into a word processor that can load SVG images.

<hr noshade>

{% include_relative right-side.html %}
{% include_relative typesetting-options.html %}

<hr noshade>


<div id="main-container">
<!-- the SVG notation will be inserted here -->
<script type="text/x-humdrum" id="main"></script>
</div>

<script src="typesetter.js"></script>



