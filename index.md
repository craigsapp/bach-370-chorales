---
verovio: "true"
breadcrumbs: '[["/typesetter", "Typesetter"]]'
github: https://github.com/craigsapp/bach-370-chorales
vim: ts=3
---

<style>

table.humdrum-verovio {
	margin-top: -30px;
	display: inline-block;
}

::placeholder {
  color: #d2a82c;
  opacity: 0.4;
}

footer {
	display: none;
}

footer small {
	display: none;
}

div.title:hover {
	background-color: #f7f7f7;
}

/* fragile: the space before zoom-out is required: */
div.chorale-entry[style*="cursor: zoom-out"] div.title:hover {
	background-color: #fbfbfb;
}

.visible {
	display: block !important;
}

.chorale-entry {
	color: #55bbee;
	cursor: zoom-in;
}

body.waiting, section.waiting {
	cursor: wait !important;
}

.tag-h1 {
	display: none;
}

section {
	min-height: 2000px;
}

</style>




{% include header-homepage.html %}


{% include_relative leftside-note.html -%}
{% include_relative rightside-note.html -%}


<input id="textsearch" type="text" placeholder="Title search"/>

<div id="title-list"></div>

{% include_relative scripts-local.html -%}
{% include_relative listeners.html -%}

