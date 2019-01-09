---
verovio: "true"
breadcrumbs: '[["/typesetter", "Typesetter"]]'
github: https://github.com/craigsapp/bach-370-chorales
vim: ts=3
---

{% include_relative styles-local.html %}
{% include header-homepage.html %}
{% include_relative leftside-note.html %}
{% include_relative rightside-note.html %}

<table>
	<tr>
	<td style="border:0">
		<input id="textsearch" type="text" placeholder="Title search"/>
	</td>
	<td style="border:0; width:100%;">
		<div id="match-count"></div>
	</td>

	<td style="border:0;">
		<select onchange="doTitleSearch();" id="tonic">
			<option value="">Tonic</option>
			<option value="F#">F&sharp;</option>
			<option value="B">B</option>
			<option value="E">E</option>
			<option value="A">A</option>
			<option value="D">D</option>
			<option value="G">G</option>
			<option value="C">C</option>
			<option value="F">F</option>
			<option value="B-">B&flat;</option>
			<option value="E-">E&flat;</option>
			<option value="A-">A&flat;</option>
		</select>
	</td>

	<td style="border:0;">
		<select onchange="doTitleSearch();" id="key">
			<option value="">Key</option>
			<option value="major">major</option>
			<option value="minor">minor</option>
		</select>
	</td>

	<td style="border:0;">
		<select onchange="doTitleSearch();" id="mode">
			<option value="">Mode</option>
			<option value="dor">dorian</option>
			<option value="phr">phrygian</option>
			<option value="mix">mixolydian</option>
			<option value="only">only</option>
			<option value="none">none</option>
		</select>
	</td>

	</tr>
</table>


<div id="title-list"></div>

{% include_relative scripts-local.html -%}
{% include_relative listeners.html -%}

