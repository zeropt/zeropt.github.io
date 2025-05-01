/**
 * main.js
 * Author: Riley Mann
 * 
 * Main script for zeropt.github.io
 * 
 * Created on 16 Apr. 2025
 */

const MAX_WIDTH = 800; // max width for mobile styling

// Paths and variables for automatic project loading
const PROJECT_DIR = "projects/";
const PROJECT_LIST_PATH = "projects/projectlist.json";

// Dune movement parameters
const DUNE_NUM = 6;
const MAX_DUNE_PARALLAX = 10;
const DUNE_WIDTH = 512; // pxart width
const DUNE_HEIGHT = 216; // pxart height
const DUNE_PX_SCALE = 5; // image pixels per pxart pixel

// Image sizing parameters
const MAX_IMG_WIDTH = 0.75; // times of container width
const MAX_IMG_HEIGHT = 0.5; // times of container height

// Global data
const data = {
	settings: { // default settings
		theme: "light",
		muted: false
	},
	projectIDs: [], // to be populated later
	pxartScale: DUNE_PX_SCALE,
};

// Create howler sprites
const sounds = new Howl({
	src: ["../sound/sprites.ogg", "../sound/sprites.mp3"],
	sprite: {
		hover: [0, 99],
		click0Down: [100, 99],
		click0Up: [200, 99],
		click1Down: [300, 99],
		click1Up: [400, 99],
		click2Down: [500, 99],
		click2Up: [600, 99],
		bubble0: [700, 99],
		bubble1: [800, 99]
	}
});

const spriteVolume = {
	hover: 1.0,
	click0Down: 1.0,
	click0Up: 1.0,
	click1Down: 0.6,
	click1Up: 0.6,
	click2Down: 0.4,
	click2Up: 0.4,
	bubble0: 0.2,
	bubble1: 0.2
};

/*-----------------------------------Setup------------------------------------*/

$(document).ready(setup);

// Runs once when the document is ready
function setup() {
	// Background
	sizeDunes();
	$(window).on({
		resize: sizeDunes,
		scroll: scrollDunes
	});
	$(document).on("mousemove", moveDunes);

	// Howler
	sounds.once("loaderror", function(){
		console.log("sound sprites failed to load");
	});

	// Load project list
	$.getJSON(PROJECT_LIST_PATH)
		.done(function(data){ // build menu using project list
			buildProjectMenu(data.projects);
		})
		.fail(function(){ // no project menu :(
			console.log("no project list");
			$("#projects").text("empty for now :(");
		})
		.always(function(){ // run the rest of the setup
			themeInit();
			attachSounds();

			// Connect settings buttons
			$("#theme-btn").click(toggleTheme);
			$("#mute-btn").click(toggleMute);
			$("#cactus").click(function(){$("html").toggleClass("spring")});

			// Configure the page content based on the location hash
			loadPage(location.hash);
			window.onhashchange = function(){loadPage(location.hash);};

			// Reposition the cactus on window resize
			$(window).resize(function(){
				const position = cactusPosition();
				$("#cactus").css({
					"top": position.top + "px",
					"left": position.left + "px",
				});
			});
		});
}

// Appends project links to #projects div element using project list
function buildProjectMenu(projects) {
	for (let i = 0; i < projects.length; i++) {
		// Update project IDs list
		data.projectIDs.push(projects[i].id);

		// Build menu item
		const project = $("<a>")
			.attr("href", "#project-" + projects[i].id)
			.addClass("button")
			.addClass("click0");
		if (projects[i].thumb) {
			project.append($("<div>")
				.addClass("thumbnail")
				.append($("<img>").attr(
					"src", 
					PROJECT_DIR + projects[i].id + "/" + projects[i].thumb
				)));
		}
		project.append($("<div>")
			.addClass("description")
			.append($("<h3>").text(projects[i].title))
			.append($("<p>").text(projects[i].description)));

		// Append menu item
		$("#projects").append(project);
		console.log("project added: " + projects[i].id);
	}
}

// Sets the theme variable using local storage or sets local storage if not
// already set and set initial site theme
function themeInit() {
	if (localStorage.theme) data.settings.theme = localStorage.theme;
	else localStorage.theme = data.settings.theme;
	// Configure dark theme if so
	if (data.settings.theme == "dark") $("html").addClass("dark");
}

// Connects sounds to button events
function attachSounds() {
	$(".click0").on({
		mouseenter: function(){playSprite("hover");},
		mousedown: function(){playSprite("click0Down");},
		mouseup: function(){playSprite("click0Up");}
	});
	$(".click1").on({
		mousedown: function(){playSprite("click1Down");},
		mouseup: function(){playSprite("click1Up");}
	});
	$(".click2").on({
		mouseenter: function(){playSprite("hover");},
		mousedown: function(){playSprite("click2Down");},
		mouseup: function(){playSprite("click2Up");}
	});
	$("#mute-btn").on("mouseenter", function(){playSprite("hover");});
	$("#cactus").on({
		mousedown: function(){playSprite("bubble0");},
		mouseup: function(){playSprite("bubble1");}
	});
}

/*---------------------------------Background---------------------------------*/

// Sets the size of the dunescape background images according to the window
// dimensions
function sizeDunes() {
	const win = {w: $(window).width(), h: $(window).height()};
	const maxDune = {
		w: DUNE_WIDTH - 2*MAX_DUNE_PARALLAX,
		h: DUNE_HEIGHT - 2*MAX_DUNE_PARALLAX
	};
	const taller = win.h < (maxDune.h * win.w) / maxDune.w;
	data.pxartScale = taller ? win.w / maxDune.w : win.h / maxDune.h;

	// Calculate dunescape image size
	const imgWidth = Math.round(data.pxartScale * DUNE_WIDTH);

	// Set dunescape img sizes
	let style = "";
	for (let i = 0; i < DUNE_NUM; i++) style += imgWidth + "px, ";
	style += imgWidth + "px";
	$("html").css("background-size", style);

	if (win.w > MAX_WIDTH) { // Desktop: center dunescape images
		style = "";
		for (let i = 0; i < DUNE_NUM; i++) style += "center, ";
		style += "center";
		$("html").css("background-position", style);
	} else { // Mobile: reposition dunescape images
		scrollDunes();
	}
}

// Creates a parallax effect using the mouse cursor position (Desktop)
function moveDunes(event) {
	const win = {w: $(window).width(), h: $(window).height()};
	if (win.w > MAX_WIDTH) { // only if desktop styled
		const mouse = {x: event.pageX, y: event.pageY};

		// Calculate parallax
		const parallax = {
			x: 2 * MAX_DUNE_PARALLAX * (0.5*win.w - mouse.x) / win.w,
			y: 2 * MAX_DUNE_PARALLAX * (0.5*win.h - mouse.y) / win.h
		};
		const start = {
			x: 0.5 * (win.w - data.pxartScale * DUNE_WIDTH),
			y: 0.5 * (win.h - data.pxartScale * DUNE_HEIGHT)
		};
		let style = "";
		for (let i = 0; i < DUNE_NUM; i++) {
			const x = Math.round(
				start.x + data.pxartScale * Math.round(parallax.x / (i + 1)));
			const y = Math.round(
				start.y + data.pxartScale * Math.round(parallax.y / (i + 1)));
			style += x + "px " + y + "px, ";
		}
		style += "center"; // center sky

		// Set dunescape img positions
		$("html").css("background-position", style);
	}
}

// Creates a parallax effect using the scroll posiiton (Mobile)
function scrollDunes() {
	const win = {w: $(window).width(), h: $(window).height()};
	const page = {w: $(".layout").width(), h: $(".layout").height()};
	const scroll = $(window).scrollTop();

	// Calculate parallax
	const parallaxY = (page.h == win.h) ? MAX_DUNE_PARALLAX :
		2 * MAX_DUNE_PARALLAX * (0.5*(page.h - win.h) - scroll)
		/ (page.h - win.h);
	const start = {
		x: 0.5 * (win.w - data.pxartScale * DUNE_WIDTH),
		y: 0.5 * (win.h - data.pxartScale * DUNE_HEIGHT) + scroll
	};
	let style = "";
	for (let i = 0; i < DUNE_NUM; i++) {
		const x = Math.round(start.x);
		const y = Math.round(
			start.y + data.pxartScale * Math.round(parallaxY / (i + 1)));
		style += x + "px " + y + "px, ";
	}
	style += 
		Math.round(start.x) + "px " + Math.round(start.y) + "px"; // center sky

	// Set dunescape img positions
	$("html").css("background-position", style);
}

/*---------------------------------Content------------------------------------*/

// Configures the page and loads the content box based on the location hash
function loadPage(locHash) {
	// Clear content box
	$("#content").empty();

	// About me page
	if (locHash == "#aboutme") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").hide();
		$.get("aboutme.html")
			.done(function(data){
				$("#content").html(data);
			})
			.fail(function(){
				console.log("failed to load aboutme.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(animateCactus);

	// Projects page
	} else if (locHash == "#projects") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").show();
		$.get("projects.html")
			.done(function(data){
				$("#content").html(data);
			})
			.fail(function(){
				console.log("failed to load projects.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(animateCactus);

	// Links page
	} else if (locHash == "#links") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").hide();
		$.get("links.html")
			.done(function(data){
				$("#content").html(data);
				// add button sounds
				$("#content .button").on({
					mouseenter: function(){playSprite("hover");},
					mousedown: function(){playSprite("click0Down");},
					mouseup: function(){playSprite("click0Up");}
				});
			})
			.fail(function(){
				console.log("failed to load links.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(animateCactus);

	// Contact page
	} else if (locHash == "#contact") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").hide();
		$.get("contact.html")
			.done(function(data){
				$("#content").html(data);
			})
			.fail(function(){
				console.log("failed to load contact.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(animateCactus);

	} else {
		// Load project
		const projectID = locHash.replace("#project-", "");
		if (data.projectIDs.includes(projectID)) {
			$(".welcome").hide();
			$(".subpage").show();
			$(".exit-bar").removeClass("hidden");
			$(".back-btn").attr("href", "#projects");
			$(".back-btn").show();
			$("#projects").hide();
			const path = PROJECT_DIR + projectID + "/";
			$.get(path + projectID + ".md")
				.done(function(data){
					$("#content").html(marked.parse(data));
					fixContentPaths(path);
					highlightContent();
				})
				.fail(function(){
					console.log("failed to load " + projectID + ".md");
					$("#content").text("strange.. I have nothing to show.");
				})
				.always(animateCactus);

		// Default to welcome page
		} else {
			$(".welcome").show();
			$(".subpage").hide();
			$(".exit-bar").addClass("hidden");
			$("#projects").hide();
			$.get("welcome.html")
				.done(function(data){
					$("#content").html(data);
				})
				.fail(function(){
					console.log("failed to load welcome.html");
					$("#content").text("strange... I have nothing to show.");
				})
				.always(animateCactus);
		}
	}
}

// Prepends import paths in #content with the supplied string
function fixContentPaths(path) {
	// Corrent img paths
	$("#content img").each(function(){
		const oldSrc = $(this).attr("src");
		$(this).attr("src", path + oldSrc);
	});
}

// Applies syntax highlighting to all code blocks within #content using
// highlight.js
function highlightContent() {
	$("#content code").each(function(){
		hljs.highlightElement($(this)[0]);
	});
}

/*-----------------------------------Cactus-----------------------------------*/

// Returns the cactus position relative to the dialog box
function cactusPosition() {
	const dialog = $("#cactus-dialog");
	const windowW = $(window).width();
	const windowH = $(window).height();
	const cactusW = $("#cactus").width();
	let cactusT = 0;
	let cactusL = 0;

	if (windowW > MAX_WIDTH) { // calculate desktop position
		cactusT = Math.round(constrain(
			dialog.position().top + dialog.height() - 0.55*cactusW,
			0, windowH - cactusW - 4));
		cactusL = Math.round(constrain(
			dialog.position().left - cactusW,
			0, windowW - cactusW));
	} else { // calculate mobile position
		cactusT = Math.round(
			dialog.position().top + dialog.height() + 0.05*cactusW);
		cactusL = Math.round(0.5*windowW - 0.52*cactusW);
	}

	// return position data
	return {top: cactusT, left: cactusL};
}

// Animate the cactus and dialog box for subpage changes
function animateCactus() {
	$("#content").parent().show(0, function(){
		const endPosition = cactusPosition();
		$("#content").parent().hide(0, function(){
			const startPosition = cactusPosition();
			$("#cactus").css({
				"top": startPosition.top + "px",
				"left": startPosition.left + "px",
			});
			$("#content").parent().show(200);
			$("#cactus").animate({
					"top": endPosition.top + "px",
					"left": endPosition.left + "px",
				}, 200);
		});
	});
}

/*----------------------------------Settings----------------------------------*/

function toggleTheme() {
	// Toggle setting
	if (data.settings.theme == "dark") {
		data.settings.theme = "light";
		$("html").removeClass("dark");
	} else {
		data.settings.theme = "dark";
		$("html").addClass("dark");
	}

	localStorage.theme = data.settings.theme; // set local storage
}

function toggleMute() {
	if (data.settings.muted) {
		data.settings.muted = false;
		playSprite("bubble0");
		$("#mute-btn").removeClass("muted");
	} else {
		data.settings.muted = true;
		$("#mute-btn").addClass("muted");
	}
}

/*---------------------------More Helper Functions----------------------------*/

// Plays a sound using the sprite name and stops other sound effects
function playSprite(sprite) {
	if (!data.settings.muted) {
		sounds.stop();
		const id = sounds.play(sprite);
		sounds.volume(spriteVolume[sprite], id);
	}
}

// Returns x constrained between a and b
function constrain(x, a, b) {
	return Math.max(Math.min(x, b), a);
}
