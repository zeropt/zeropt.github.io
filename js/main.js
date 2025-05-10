/**
 * main.js
 * Author: Riley Mann
 * 
 * Main script for zeropt.github.io
 * 
 * Created on 16 Apr. 2025
 */

const MOBILE_WIDTH = 800; // max width for mobile styling

// Global data
const data = {
	theme: "light",
	mobile: false,
	projectIDs: []
};

/*-----------------------------------Setup------------------------------------*/

// Theme
themeInit();

$(document).ready(setup);

// Runs once when the document is ready
function setup() {
	// Check if mobile
	data.mobile = $(window).width() <= MOBILE_WIDTH;

	// Initialize background
	sandscapeInit(data.mobile);

	// Window callbacks
	$(window).on({
		resize: function(){
			data.mobile = $(window).width() <= MOBILE_WIDTH;
			sandscapeOnResize(data.mobile);
			cactusOnResize(data.mobile);
		},
		scroll: cactusOnScroll
	});

	// Mouse callbacks
	$(document).on("mousemove", sandscapeOnMouseMove);

	// Sound
	sounds.once("loaderror", function(){
		console.log("sound sprites failed to load");
	});

	// Load project list
	projectMenuInit(
		function(){ // fail callback
			console.log("no project list");
			$("#projects").text("empty for now :(");
		},
		function(projectIDs){ // always callback
			data.projectIDs = projectIDs;
			attachSounds();
			// Configure the page content based on the location hash
			loadPage(location.hash);
			window.onhashchange = function(){loadPage(location.hash);};
		}
	);

	// Connect settings buttons
	$("#theme-btn").click(toggleTheme);
	$("#mute-btn").click(toggleMute);
	$("#cactus").click(function(){$("html").toggleClass("spring")});
}

// Sets the theme variable using local storage or sets local storage if not
// already set and set initial site theme
function themeInit() {
	if (localStorage.theme) data.theme = localStorage.theme;
	else localStorage.theme = data.theme;
	// Configure dark theme if so
	if (data.theme == "dark") $("html").addClass("dark");
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
			.always(cactusOnPageChange);

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
			.always(cactusOnPageChange);

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
			.always(cactusOnPageChange);

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
			.always(cactusOnPageChange);

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
				.always(cactusOnPageChange);

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
				.always(cactusOnPageChange);
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

/*------------------------ Settings Button Callbacks -------------------------*/

function toggleTheme() {
	// Toggle setting
	if (data.theme == "dark") {
		data.theme = "light";
		$("html").removeClass("dark");
	} else {
		data.theme = "dark";
		$("html").addClass("dark");
	}

	localStorage.theme = data.theme; // set local storage
}

function toggleMute() {
	if (isMuted()) {
		unmute();
		playSprite("bubble0");
		$("#mute-btn").removeClass("muted");
	} else {
		mute();
		$("#mute-btn").addClass("muted");
	}
}
