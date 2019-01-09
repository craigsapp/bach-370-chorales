---
---
//
// Description: Javascript code for the J.S. Bach chorale typesetter.
// vim: ts=3
//

// URIBASE gives the base location for the chorale data:
var URIBASE = "github://craigsapp/bach-370-chorales";

// CURRENTWORK is used to manage the measure number lists in the
// typesetting menu.
var CURRENTWORK = new Humdrum();
var FREEZE = false;

var LAYOUT = {%include layout.json -%}.CHORALE_LAYOUT;
var RLAYOUT = {};
for (var i=0; i<LAYOUT.length; i++) {
	RLAYOUT[LAYOUT[i].ID] = LAYOUT[i];
}



//////////////////////////////
//
// DOMContentLoaded event listener -- Download the chorale
//   index file and populate the title menu after it has
//   been downloaded.  Also links parameter changes in the
//   typesetting menu to update display of the notation.
//

document.addEventListener("DOMContentLoaded", function () {

	// Download the chorale work list and process it.
	var index = new Humdrum();
	if (sessionStorage.index) {
			index.parse(sessionStorage.index);
			buildTitleMenu(index);
			generateNotationFromOptions();
	} else {
		var uri = URIBASE + "/index.hmd";
		index.onload = function (x) {
			buildTitleMenu(x);
			generateNotationFromOptions();
			sessionStorage.index = x.stringify();
		};
		index.parse(uri);
	}

	// Add event listeners for static form fields:
	var forms = document.querySelectorAll(".myform");
	for (var i=0; i<forms.length; i++) {
		forms[i].addEventListener("change", generateNotationFromOptions);
	}

});



//////////////////////////////
//
// generateNotationFromOptions -- Read the display options 
//    from the webpage and then display based on those options.
//    All interesting parameters have the class "myform" on
//    the webpage.  This function collects them into an 
//    object for more convenient processing in the 
//    displayNotation() function.
//

function generateNotationFromOptions() {
	if (FREEZE) {
		return;
	}
	var forms = document.querySelectorAll(".myform");
	var options = {};
	for (var i=0; i<forms.length; i++) {
		var name = forms[i].id;
		if (!name) {
			continue;
		}
		if (forms[i].type == "checkbox") {
			options[name] = forms[i].checked;
		} else {
         // Other form element data can be gotten from .value:
			options[name] = forms[i].value;
		}
		
	}
	displayNotation(options);
};



//////////////////////////////
//
// buildTitleMenu -- Create a selection list of titles
//   and filenames from the downloaded index file.  The
//   input index is a Humdrum-js object (see https://js.humdrum.org).
//

function buildTitleMenu(index) {
	var hash = window.location.hash;
	var sfile = "";
	var layout = null;
	if (hash) {
		hash = hash.replace("#", "");
		sfile = "kern/" + hash + ".krn";
		layout = RLAYOUT[hash];
	}
	var titleMenu = document.querySelector("#title-menu");
	var output = '<select';
	output += ' style="width:400px;"';
	output += ' class="myform" name="chorale" id="file">';
	for (var i=0; i<index.getLineCount(); i++) {
		if (!index.getLine(i).isData()) {
			continue;
		}

		// Hard-coded to field index 4 for now. Eventually this will be:
		// var file = index.getTokenText(i, "**file");
		var file = index.getToken(i, 0).getText(); 

		// Hard-coded to field index 4 for now. Eventually this will be:
		// var title = index.getTokenText(i, "**description");
		var title = index.getToken(i, 4).getText(); // hard-coded to 4 for now.

		if (sfile === file) {
			output += "<option selected value='" + file + "'>" + title + "</option>\n";
		} else {
			output += "<option value='" + file + "'>" + title + "</option>\n";
		}
	}
	output += "</select>";
	titleMenu.innerHTML = output;
	// The title menu needs to have an event listener added to it.
	// the other fields in the typsetting menu were already on the page
	// when it was loaded, so they do not need to be linked here (it was
	// done in the DOMContentLoaded event handler above).
	titleMenu.addEventListener("change", generateNotationFromOptions);
}



//////////////////////////////
//
// displayNotation --  Do most of the work.  The raw input
//     options from the webpage are formatted into options
//     for the displayHumdrum() function from humdrum-js.
//     (see https://js.humdrum.org).  After the music
//     has been redisplayed, the humdrum notation plugin
//     example on the right side of the webpage is updated,
//     and the measure numbers in the selection lists in the
//     main menu are updated.

function displayNotation(opts) {
	var filebase = opts.file.replace(/\.[^.]*$/, "").replace(/.*\//, "");
	var script = document.querySelector("#" + filebase);
	var filter = "";
	var swapper;
	if ((typeof opts.barbegin != "undefined") && (typeof opts.barend != "undefined")) {
		if (opts.barbegin == "0" && opts.barend == "$") {
			// the entire piece, so do not extract measures
		} else {
			filter += filter ? " | " : "";
			if (opts.barbegin === opts.barend) {
				filter += "myank -m " + opts.barbegin;
			} else {
				var starting = opts.barbegin;
				var ending = opts.barend;
				if (ending === "$") {
					// this is good
				} else if (starting === "$") {
					// this is bad: swap them
					swapper = ending;
					ending = starting;
					starting = swapper;
				} else {
					if (parseInt(starting) > parseInt(ending)) {
						swapper = ending;
						ending = starting;
						starting = swapper;
					}
				}
				filter += "myank -m " + starting + "-" + ending;
			}
		}
	}
	if (opts.staves.toUpperCase() === "SB") {
		filter += filter ? " | " : "";
		filter += "extract -k 1,4";
	}
	if (opts.staves.toUpperCase() === "AT") {
		filter += filter ? " | " : "";
		filter += "extract -k 2,3";
	}
	if (opts.staves.toUpperCase() === "S") {
		filter += filter ? " | " : "";
		filter += "extract -k 4";
	}
	if (opts.staves.toUpperCase() === "A") {
		filter += filter ? " | " : "";
		filter += "extract -k 3";
	}
	if (opts.staves.toUpperCase() === "T") {
		filter += filter ? " | " : "";
		filter += "extract -k 2";
	}
	if (opts.staves.toUpperCase() === "B") {
		filter += filter ? " | " : "";
		filter += "extract -k 1";
	}
	if (opts.staves.toUpperCase() === "GS") {
		filter += filter ? " | " : "";
		filter += "satb2gs";
	}
	if (opts.tonic.toUpperCase() !== "ORIGINAL") {
		filter += filter ? " | " : "";
		filter += "transpose -k " + opts.tonic;
	}
	opts.octave = parseInt(opts.octave) * 40;
	if (opts.octave) {
		filter += filter ? " | " : "";
		filter += "transpose -b " + opts.octave;
	}
	if (!script) {
		// Data is not here.  Download it and comeback later.
		prepareExample(opts.file, opts.tonic);
	} else {
		var options = {
			source: filebase,
			target: "main",
			scale: 32,
			filter: filter,
			header: opts.showTitle ? true : false
		};

		if (opts.spacingLinear) {
			// convert spacingLinear to a number in the range from 0.0 to 1.0:
			options.spacingLinear = parseInt(opts.spacingLinear) / 100.0;
		}

		if (opts.spacingNonLinear) {
			// convert spacingNonLinear to a number in the range from 0.0 to 1.0:
			options.spacingNonLinear = parseInt(opts.spacingNonLinear) / 100.0;
		}

		// Set the default staff distance for GS and SATB layouts:
		options.spacingStaff = filter.match(/satb/) ? 6 : 10;

		if (typeof opts.spacingStaff !== "undefined") {
			options.spacingStaff = parseInt(opts.spacingStaff);
		}

		if (typeof opts.spacingSystem !== "undefined") {
			options.spacingSystem = parseInt(opts.spacingSystem);
		}

		if (size) {
			// scale is not normalized to the range of 0.0 to 1.0:
			options.scale = parseInt(opts.size);
		}

		// This code will add the BWV numbers on the left 
		// side of the top system in the music.  The header option
		// may hide this number, but it is always inserted:
		options.appendText = "!!!header-left: @{SCT}";

		// .targetWidth is used by displayHumdrumNotationPluginExample(), 
		// not displayHumdrum(), which will ignore it.
		options.targetWidth = opts.targetWidth;
		options.file = opts.file;
console.log("OPTIONS", options);
		displayHumdrum(options);
	
		// Post-processing to update the webpage related to
		// the new option settings:
		displayHumdrumNotationPluginExample(options);
		updateMeasureNumberRanges();
	}
}



//////////////////////////////
//
// updateMeasureNumberRanges -- Rebuild the measure number menus
//    based on the content of the current file.  Could be made
//    more efficient by only rebuilding them if a new work
//    is loaded.
//

function updateMeasureNumberRanges() {
	var element = document.querySelector("#main-humdrum");
	var text = element.textContent;
	CURRENTWORK.parse(text);
	var measures = CURRENTWORK.getMeasureNumbers();
	if (measures.length == 0) {
		return;
	}
	measures[measures.length - 1] = "$";
	var pickup = CURRENTWORK.hasPickup();
	if (pickup) {
		measures.unshift(0);
	}
	var barbegin = document.querySelector("#barbegin");
	var barend = document.querySelector("#barend");
	if (!barbegin || !barend) {
		return;
	}
	var output = "";
	for (var i=0; i<measures.length; i++) {
		if (i == 0) {
			output += '<option value="0">beginning</option>\n';
		} else if (measures[i] === "$") {
			output += '<option value="$">end</option>\n';
		} else {
			output += '<option value="' + measures[i] + '">' + measures[i] + '</option>\n';
		}
	}

	var bbindex = barbegin.selectedIndex;
	var beindex = barend.selectedIndex;
	if (bbindex > beindex) {
		var temp = beindex;
		beindex = bbindex;
		bbindex = temp;
	}
	var endindex = barbegin.length - 1;

	if (beindex == endindex) {
		beindex = measures.length - 1;
	}
	if (bbindex == endindex) {
		bbindex = measures.length - 1;
	}
	if (beindex > measures.length - 1) {
		beindex = measures.length - 1;
	}
	if (bbindex > measures.length - 1) {
		bbindex = measures.length - 1;
	}
	
	barbegin.innerHTML = output;
	barend.innerHTML = output;
	barbegin.selectedIndex = bbindex;
	barend.selectedIndex = beindex;
}



/////////////////////////////
//
// displayHumdrumNotationPluginExample -- display the Humdrum
//     notation plugin code that can be used to reproduce the
//     displayed notation on a different webpage.
//

function displayHumdrumNotationPluginExample(opts) {
	var example = document.querySelector("#example");
	if (!example) {
		return;
	}
	var exampleid = getExampleId();
	var output = "";
	output += "<script" + ">displayHumdrum({\n";
   output += '   source: "' + exampleid + '",\n';
	if (opts.scale) {
		output += "   scale: " + parseInt(parseInt(opts.scale) * parseInt(opts.targetWidth) / 590.0) + ",\n";
	}
	if (opts.spacingLinear != 0.25) {
		output += "   spacingLinear: " + opts.spacingLinear + ",\n";
	}
	if (opts.spacingNonLinear != 0.6) {
		output += "   spacingNonLinear: " + opts.spacingNonLinear + ",\n";
	}
	if (opts.header) {
   	output += "   header: true,\n";
		if (opts.appendText) {
   		output += '   appendText: "' + opts.appendText + '",\n';
		}
	}
	if (typeof opts.spacingStaff !== "undefined" && opts.spacingStaff != 8) {
		output += "   spacingStaff: " + opts.spacingStaff + ",\n";
	}
	if (typeof opts.spacingSystem !== "undefined" && opts.spacingSystem != 3) {
		output += "   spacingSystem: " + opts.spacingSystem + ",\n";
	}
	if (opts.filter) {
		output += '   filter: "' + opts.filter + '",\n';
	}
	var uri = "github://craigsapp/bach-370-chorales/" + opts.file;
   output += '   uri: "' + uri + '"\n';
   output += "})";
	output += "</script" + ">\n";
	output += '<script id="' + exampleid + '" type="text/x-humdrum"><';
	output += '/script>';
	example.textContent = output;

	var x590 = document.querySelector("#x590");
	if (x590) {
		x590.textContent = x590.textContent.replace(/width:\d+px/, "width:" + opts.targetWidth + "px");
	}

	var vhvlink = document.querySelector("#vhv-link");
	var vhvlinkcompiled = document.querySelector("#vhv-link-compiled");
	if (vhvlink) {
		var link = "http://verovio.humdrum.org/?file=";
		link += encodeURIComponent(uri);
		if (opts.filter) {
			link += "&filter=" + encodeURIComponent(opts.filter);
		}
		vhvlink.setAttribute("href", link);
	}
	if (vhvlinkcompiled) {
		var link2 = "http://verovio.humdrum.org/?file=";
		link2 += encodeURIComponent(uri);
		if (opts.filter) {
			link2 += "&filter=" + encodeURIComponent(opts.filter);
		}
		link2 += "&k=c";
		vhvlinkcompiled.setAttribute("href", link2);
	}
}



/////////////////////////////
//
// prepareExample -- Find the requested data on the page, or
//   download it (from Github) if not available on the page.
//

function prepareExample(filename) {
	var filebase = filename.replace(/\.[^.]*$/, "").replace(/.*\//, "");
	var teste = document.querySelector("#" + filebase);
	if (teste) {
		return;
	}
	if (sessionStorage[filebase]) {
			var script = document.createElement("script");
			script.setAttribute("type", "text/x-humdrum");
			script.setAttribute("id", filebase);
			script.textContent = sessionStorage[filebase];
			document.body.appendChild(script);
			generateNotationFromOptions();
	} else {
		var downloader = new Humdrum;
		downloader.onload = function (x) {
			// Create a new script and insert the downloaded text into it.
			// Then call displayNotation again.
			var text = x.stringify();
			if (!text) {
				console.log("Error downloading", filename);
				return;
			}
			var script = document.createElement("script");
			script.setAttribute("type", "text/x-humdrum");
			script.setAttribute("id", filebase);
			script.textContent = text;
			document.body.appendChild(script);
			generateNotationFromOptions();
			getAdjacentFiles();
		};
		downloader.parse(URIBASE + "/" + filename);
	}
}



////////////////////
//
// getAdjacentFiles -- Anticipate downloading of scores that are
//   +1 and -1 in the list from the current score.  This will speed
//   up navigation using the arrows keys, and make the webpage
//   feel more responsive.
//

function getAdjacentFiles() {
	var selection = document.querySelector("#file");
	if (!selection) {
		return;
	}
	var index = selection.selectedIndex;
	var len = selection.length;
	var above = index == len-1 ? 0 : index + 1;
	var below = index == 0 ? len-1 : index - 1;
	preFetch(selection[above].value);
	preFetch(selection[below].value);
}



/////////////////////////////
//
// preFetch -- Download a chorale score, but do not display it.
//

function preFetch(filename) {
	var filebase = filename.replace(/\.[^.]*$/, "").replace(/.*\//, "");
	var teste = document.querySelector("#" + filebase);
	if (teste) {
		// already fetched
		return;
	}
	if (sessionStorage[filebase]) {
		// already fetched
		return;
	} else {
		var downloader = new Humdrum;
		downloader.onload = function (x) {
			var text = x.stringify();
			if (!text) {
				console.log("Error downloading", filename);
				return;
			}
			sessionStorage[filename] = text;
		};
		downloader.parse(URIBASE + "/" + filename);
	}
}



//////////////////////////////
//
// keydown event listener -- What to do when a key on the computer
//    keyboard is pressed:
//       * left/up arrows: Go to a lower-numbered chorale (or wrap
//         to the end when you get to the beginning of the list.
//       * right/down arrows: Go to a higher-numbered chorale (or wrap
//         to the start when you get to the end of the list.
//       * 1-7: Transpose music to C, D, E, F, G, A, and B, respectively.
//       * 0: Remove any transposition.
//

window.addEventListener("keydown", function (event) {
	console.log(event);
	var selection = document.querySelector("#file");
	if (!selection) {
		return;
	}
	var index = selection.selectedIndex;
	var len = selection.length;
	var newindex = index;

	if (event.key === "ArrowRight") {
		newindex = index == len-1 ? 0 : index + 1;
	} else if (event.key === "ArrowLeft") {
		newindex = index == 0 ? len-1 : index - 1;
	} else if (event.key === "ArrowUp") {
		newindex = index == 0 ? len-1 : index - 1;
	} else if (event.key === "ArrowDown") {
		newindex = index == len-1 ? 0 : index + 1;
	} else if (event.key === "+") {
		adjustSize(+1);
	} else if (event.key === "=") {
		adjustSize(+1);
	} else if (event.key === "-") {
		adjustSize(-1);
	} else if (event.key === "_") {
		adjustSize(-1);
	} else if (event.key === "d" || event.key == "D") {
		resetParameters();
	} else if (event.code === "BracketLeft") {
		if (event.shiftKey) {
			adjustNonLinearSpacing(-1)
		} else {
			adjustLinearSpacing(-1)
		}
	} else if (event.code === "BracketRight") {
		if (event.shiftKey) {
			adjustNonLinearSpacing(+1)
		} else {
			adjustLinearSpacing(+1)
		}
	} else {
		// check for transposition: 1=c, 2=d, 3=e, 0=original
		var newkey = -1
		if      (event.key === "1") { newkey = 2;  } // c
		else if (event.key === "2") { newkey = 5;  } // d
		else if (event.key === "3") { newkey = 8;  } // e
		else if (event.key === "4") { newkey = 11; } // f
		else if (event.key === "5") { newkey = 14; } // g
		else if (event.key === "6") { newkey = 17; } // a
		else if (event.key === "7") { newkey = 20; } // b
		else if (event.key === "0") {
			newkey = 0;   // original key
		}
		if (newkey >= 0) {
			var tselect = document.querySelector("#tonic");
			if (tselect) {
				event.preventDefault();
				tselect.selectedIndex = newkey;
				generateNotationFromOptions();
			}
		}
		return;
	}
	event.preventDefault();
	selection.selectedIndex = newindex;
	generateNotationFromOptions();
});



//////////////////////////////
//
// getExampleId -- Calculate a file base name for
//     SVG download and/or a Humdrum script ID for the example
//     Humdrum notation plugin code on the right side of the page.
//     This value is based on the file, the measure range (if specified)
//     the transposition, octave displacement and GS/SATB layout.
//     This allows for multiple SVG images of various chorales in
//     various transpositions to be downloaded without having the
//     filenames conflict.
//

function getExampleId() {
	var output = "";

	var fileSelect = document.querySelector("#file");
	var file = fileSelect[fileSelect.selectedIndex].value;
	var tonicSelect = document.querySelector("#tonic");
	var tonic = tonicSelect[tonicSelect.selectedIndex].value;
	var octaveSelect = document.querySelector("#octave");
	var octave = octaveSelect[octaveSelect.selectedIndex].value;
	var staffSelect = document.querySelector("#staves");
	var staves = staffSelect[staffSelect.selectedIndex].value;

	// Construct a filename based on the options:
	if (!file) {
		return "unknown";
	}
	var matches = file.match(/(chor\d+)/);
	if (!matches) {
		return "unknown";
	}
	output = matches[1];

	output += getMeasureRange();

	if (tonic.toUpperCase() !== "ORIGINAL") {
		output += "-" + tonic.replace("-", "flat").replace("#", "sharp");
	}
	octave = parseInt(octave);
	if (octave) {
		if (octave > 0) {
			output += "-up";
		}
		if (octave < 0) {
			output += "-down";
		}
	}
	if (staves.toUpperCase() === "SATB") {
		output += "-satb";
	} else if (staves.toUpperCase() === "SB") {
		output += "-sb";
	} else if (staves.toUpperCase() === "AT") {
		output += "-at";
	} else if (staves.toUpperCase() === "S") {
		output += "-s";
	} else if (staves.toUpperCase() === "A") {
		output += "-a";
	} else if (staves.toUpperCase() === "T") {
		output += "-t";
	} else if (staves.toUpperCase() === "B") {
		output += "-b";
	}

	return output;
}



//////////////////////////////
//
// getMeasureRange -- Helper function for getExampleId() which
//    will display the measure range in the filename if there
//    is a range other than the entire piece being displayed.
//

function getMeasureRange() {
	var bb = document.querySelector("#barbegin");
	var be = document.querySelector("#barend");
	if (!(bb || be)) {
		return "";
	}
	if ((bb.selectedIndex == 0) && (be.selectedIndex == be.length - 1)) {
		// full range of music so nothing to do.
		return "";
	}

	var starting = bb[bb.selectedIndex].value;
	if (bb.seletedIndex == 0) {
		if (bb[bb.seletedIndex+1] == 2) {
			starting = 1;
		}
	}

	var ending = be[be.selectedIndex].value;
	if (ending === "$") {
		ending = parseInt(be[be.selectedIndex - 1].value) + 1;
	}

	if (parseInt(starting) == parseInt(ending)) {
		return "-m" + parseInt(starting);
	} 
	if (parseInt(starting) > parseInt(ending)) {
		var tval = ending;
		ending = starting;
		starting = tval;
	}

	return "-mm" + parseInt(starting) + "-" + parseInt(ending);
}



//////////////////////////////
//
// adjustLinearSpacing -- add 0.01 unit up or down to the 
//    spacingLinear parameter on the menu.  Then redraw the music.
//    Integer units which is what the units of the slider is.
//

function adjustLinearSpacing(amount) {
	var sl = document.querySelector("#spacingLinear");
	if (!sl) {
		return;
	}
	var value = parseInt(sl.value) + parseInt(amount);
	sl.value = value;
	console.log("VALUE IS SET TO", value);
}



//////////////////////////////
//
// adjustNonLinearSpacing -- add 0.01 unit up or down to the 
//    spacingNonLinear parameter on the menu.
//    Integer units which is what the units of the slider is.
//

function adjustNonLinearSpacing(amount) {
	var snl = document.querySelector("#spacingNonLinear");
	if (!snl) {
		return;
	}
	var value = parseInt(snl.value) + parseInt(amount);
	snl.value = value;
	console.log("VALUE IS SET TO", value);
}



//////////////////////////////
//
// resetParameters -- 
//

function resetParameters(amount) {
	var selection = document.querySelector("#file");
	if (!selection) {
		return;
	}
	var index = selection.selectedIndex;
	var value = selection[index].value;
	var matches = value.match(/(chor\d+)/);
	if (!matches) {
		return;
	}
	var chorale = matches[1];
	var layout = RLAYOUT[chorale];

	FREEZE = true;

	var size = document.querySelector("#size");
	if (layout.scale) {
		size.value = layout.scale;
	}

	var snl = document.querySelector("#spacingNonLinear");
	if (layout.spacingNonLinear) {
		snl.value = parseInt(layout.spacingNonLinear * 100.0);;
	}

	var sl = document.querySelector("#spacingLinear");
	if (layout.spacingNonLinear) {
		sl.value = parseInt(layout.spacingLinear * 100.0);;
	}

	FREEZE = false;
	generateNotationFromOptions();
}



//////////////////////////////
//
// adjustSize -- add 1 unit up or down to the size parameter
//    on the menu.
//

function adjustSize(amount) {
	var size = document.querySelector("#size");
	if (!size) {
		return;
	}
	var value = parseInt(size.value) + parseInt(amount);
	size.value = value;
	console.log("VALUE IS SET TO", value);
}



//////////////////////////////
//
// saveChoraleSvg -- Save the image to the local computer (usually
//   to the Desktop or ~/Downloads folder, depending on the OS).
//   This is used as the click event listener for the red "Download SVG"
//   button on the webpage.
//

function saveChoraleSvg() {
	var filename = getExampleId() + ".svg";
	saveHumdrumSvg("main", filename);
}



