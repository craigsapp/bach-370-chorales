---
verovio: "true"
breadcrumbs: '[["/typesetter", "Typesetter"]]'
github: https://github.com/craigsapp/bach-370-chorales
vim: ts=3
---

<style>

footer small {
	display: none;
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


Four-part chorales collected after J.S. Bach's death by his son C.P.E. Bach (and finished by Kirnberger, J.S. Bach's student, after C.P.E. Bach's death). Ordered by Breitkopf & H&auml;rtel numbers.

The first complete edition of these chorales was published by Breitkopf & H&auml;rtel between 1784&ndash;1787 in four volumes. The first incomplete edition consisting of 200 chorales in two volumes was published by Friedrich Wilhelm Birnstiel in 1765 & 1769, reprinted in 1975 by Georg Olms.

This digital edition is referenced against the fourth edition of the chorales by Breitkopf & H&auml;rtel, c. 1875: 371 vierstimmige Choralges&auml;nge von Johann Sebastian Bach. 4th ed. by Alfred D&ouml;rffel. Breitkopf & H&auml;rtel, Leipzig [c. 1875]. 178 pp. Plate Number: V.A.10. Retypeset c. 1915 as Edition Breitkopf 10. Reprinted by Associated Music Publishers, Inc., New York [c. 1940].

The source edition has 371 chorales, but chorale 150 is not a four-part chorale, so it has been 
omitted from this analytic edition of the chorales.  However the numbering of the chorales is maintained
as in the source edition, with file `chor150.krn` not existing in this digital edition.

These digital scores can also be found as a submodule in the 
[humdrum-data](https://github.com/humdrum-tools/humdrum-data) repository.


Scores
=============================

Click on a chorale title in the list below to view the music for the chorale.

<div id="title-list"></div>



<script>

var HSET;
var INDEX;

var LAYOUT = {%include layout.json -%}.CHORALE_LAYOUT;
var RLAYOUT = {};
for (var i=0; i<LAYOUT.length; i++) {
	RLAYOUT[LAYOUT[i].ID] = LAYOUT[i];
}

vrvToolkit.renderData("**kern\n1c\n\*-", {}); // for initializing now to speed up later

//////////////////////////////
//
// DomContentLoaded event listener -- Load the index file, then create the list of works,
//   then download and store all of the chorales in sessionStorage (useful for buffering
//   for typesetter page).
//

document.addEventListener("DOMContentLoaded", function () {
	INDEX = new Humdrum();
	if (sessionStorage.index) {
		INDEX.parse(sessionStorage.index);
		buildTitleList(INDEX);
		HSET = new HumdrumSet();
		HSET.onload = storeInSessionStorage;
		HSET.parse("all-chorales.krns");
	} else {
		INDEX.onload = function(x) {
			buildTitleList(x);
			sessionStorage.index = x.stringify();
			HSET = new HumdrumSet();
			HSET.onload = storeInSessionStorage;
			HSET.parse("all-chorales.krns");
		};
		INDEX.parse("github://craigsapp/bach-370-chorales/index.hmd");
	}
});



//////////////////////////////
//
// DomContentLoaded event listener -- adjusts the banner to add links.
//

document.addEventListener("DOMContentLoaded", function () {
	var banner = document.querySelector("#banner");
	if (!banner) {
		return;
	}
	var breadstring = '{{page.breadcrumbs}}';
	if (!breadstring) {
		return;
	}
	var bread = JSON.parse(breadstring);
console.log("BREADSTRING", bread);
	var link = banner.querySelector("a");
console.log("LINK", link);
	var output = "<div style='background:#ffcc00;' class='fork visible'>";
	// output += link.outerHTML;
	output += "<div style='margin-top:0.25rem; font-size:1.5rem; font-weight:bold; margin-left:0px;'>";
	for (var i=0; i<bread.length; i++) {
		output += "<a href='" + bread[i][0] + "'>";
		output += bread[i][1];
		output += "</a>";
		if (i < bread.length - 1) {
			output += " | ";
		}
	}
	output += "</div>";
	output += "</div>";
	link.outerHTML = output;
	link.style.display = "block";
	link.className = "";
	console.log("BANNER", banner);

console.log("LINK2", link);
});



//////////////////////////////
//
// buildTitleList -- Create a list of titles that can be clicked on to dispay
//   the chorale for that title.
//

function buildTitleList(index) {
	if (!(index instanceof Humdrum)) {
		return;
	}
	var titlelist = document.querySelector("#title-list");

	var output = "";
	for (var i=0; i<index.getLineCount(); i++) {
		if (!index.getLine(i).isData()) {
			continue;
		}

		// Filename hard-coded to field index 4 for now. Eventually this will be:
		// var file = index.getTokenText(i, "**file");
		var file = index.getToken(i, 0).getText(); 
		var matches = file.match(/(chor\d+)/);
		if (matches) {
			file = matches[1];
		}

		// Title hard-coded to field index 4 for now. Eventually this will be:
		// var title = index.getTokenText(i, "**description");
		var title = index.getToken(i, 4).getText(); // hard-coded to 4 for now.

		output += "<div class='chorale-entry' id='" + file + "-entry'>";
		output += "<div class='title'>";
		output += title
		output += "</div>\n";
		output += "</div>\n";
	}

	titlelist.innerHTML = output;
	titlelist.addEventListener("click", titleEventDelegation);
}



//////////////////////////////
//
// titleEventDelegation --
//

function titleEventDelegation(event) {
	console.log("CLICKED HERE:", event.path);
	var chorale = "";
	var cn = "";
	var id = "";
	var element = null;
	for (var i=0; i<event.path.length; i++) {
		element = event.path[i];
		id = element.id;
		cn = element.className;
		if (id === "title-list") {
			console.log("NOT CLICKING ON ANYTHING IMPORTANT", id);
			return;
		}
		console.log("CN", cn);
		if (cn && (typeof cn.baseVal === "undefined") && cn.match(/chorale-entry/)) {
			// found interesting div
			break;
		}
	}
	if (!cn.match(/chorale-entry/)) {
		console.log("CLASSNAME IS STRNAGE", cn);
		return;
	}
	if (!element) {
		console.log("FOUND NO ELEMENT", element);
		return;
	}

	var titlelist = document.querySelector("#title-list");
	var hid = id.replace("-entry", "");
	console.log("ID", id, "HID", hid);
	var section = document.querySelector("section");

	var container = element.querySelector("#" + hid + "-container");
	if (!container) {

		// need to create a Humdrum notation program container
		var crypt = document.createElement("script");
		crypt.setAttribute("id", hid);
		crypt.setAttribute("type", "text/x-humdrum");
		var hum = HSET.getSegment(hid + ".krn");
		if (!hum) {
			console.log("MISSING DATA FOR", hid);
			return;
		}
		crypt.textContent = hum.stringify();
		element.appendChild(crypt);
		var options = {};
		options.source = hid;
		options.scale = 32;
		options.staffSpacing = 6;
		options.filter = "satb2gs";
		var lentry = RLAYOUT[hid];
console.log("ENTRY", lentry, "HID", hid);
		if (lentry) {
			options.scale = lentry.scale;
			options.spacingLinear = lentry.spacingLinear;
			options.spacingNonLinear = lentry.spacingNonLinear;
		}
		element.style.cursor = "zoom-out";
		displayHumdrum(options);
	} else {
		// already have a container so toggle its display.
		if (container.style.display === "block") {
			// hide the notation
			container.style.display = "none";
			element.style.cursor = "zoom-in";
		} else {
			// show the notation
			container.style.display = "block";
			element.style.cursor = "zoom-out";
		}
	}
}



//////////////////////////////
//
// storeInSessionStorage --
//

function storeInSessionStorage(hset) {
	var keys = hset.getSegmentNames();
	var matches;
	for (var i=0; i<keys.length; i++) {
		matches = keys[i].match(/(chor\d+)/);
		if (matches) {
			var seg = matches[1];
			if (!sessionStorage[seg]) {
				sessionStorage[seg] = hset.getSegment(keys[i]).stringify();
			}
		}
	}
}




</script>

