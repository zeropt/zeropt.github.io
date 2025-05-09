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

// Global data
const data = {
	settings: { // default settings
		theme: "light",
		muted: false
	},
	projectIDs: [] // to be populated later
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

// Theme
themeInit();

$(document).ready(setup);

// Runs once when the document is ready
function setup() {
	// Background
	sandscapeInit();
	$(window).resize(sandscapeOnResize);
	$(document).on("mousemove", sandscapeOnMouseMove);

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
			attachSounds();

			// Connect settings buttons
			$("#theme-btn").click(toggleTheme);
			$("#mute-btn").click(toggleMute);
			$("#cactus").click(function(){$("html").toggleClass("spring")});

			// Configure the page content based on the location hash
			loadPage(location.hash);
			window.onhashchange = function(){loadPage(location.hash);};

			// Reposition the cactus on window resize and scroll
			$(window).on({
				resize: moveCactus,
				scroll: moveCactus
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
			.append($("<h2>").text(projects[i].title))
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

/*---------------------------------Content------------------------------------*/

// Configures the page and loads the content box based on the location hash
function loadPage(locHash) {
	// Clear content box
	$("#content").empty();

	// disable full width content
	$("#cactus-dialog").removeClass("max");

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
					$("#cactus-dialog").addClass("max"); // full width content
					fixContentPaths(path);
					fixContentLinks();
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


// Sets links in #content to open in a new tab
function fixContentLinks() {
	$("#content a").each(function(){
		$(this).attr("target", "_blank");
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

// Returns the target position next to the dialog box
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
		cactusT = Math.round(dialog.position().top - $(window).scrollTop()
			+ dialog.height() + 0.05*cactusW);
		cactusL = Math.round(0.5*windowW - 0.52*cactusW);
	}

	// return position data
	return {top: cactusT, left: cactusL};
}

// Moves the cactus next to the dialog box
function moveCactus() {
	const position = cactusPosition();
	$("#cactus").css({
		"top": position.top + "px",
		"left": position.left + "px",
	});
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
