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
	projectIDs: [],
	projectsReady: false,
	photosReady: false,
};

/*-----------------------------------Setup------------------------------------*/

// Theme
themeInit();

$(document).ready(setup);

// Runs once when the document is ready
function setup() {
	// Check if mobile
	data.mobile = $(window).width() <= MOBILE_WIDTH;

	// Initialize background and cactus
	sandscapeInit(data.mobile);
	cactusInit(data.mobile);

	// Initialize focus box
	focusInit();

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
			data.projectsReady = true;
			if (data.photosReady) {pageInit();}
		}
	);

	// Load photo gallery
	photoGalleryInit(
		function(){ // fail callback
			console.log("no photo manifest");
			$("#photo-gallery").text("empty for now :(");
		},
		function(){ // always callback
			data.photosReady = true;
			if (data.projectsReady) {pageInit();}
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

// Initializes the focus box
function focusInit() {
	$("#focus").hide();
	$("#focus").click(function(){$("#focus").hide();});
	$("body").keydown(function(event){
		if (event.keyCode == 27) {$("#focus").hide();}
	});
}

// Loads page and sets callback
function pageInit() {
	loadPage(location.hash);
	window.onhashchange = function(){loadPage(location.hash);};
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
	// Hide cactus dialog
	$("#cactus-dialog").hide();

	// Clear content box
	$("#content").empty();

	// disable full width content
	$("#cactus-dialog").removeClass("article");

	// About me page
	if (locHash == "#aboutme") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").hide();
		$("#photo-gallery").hide();
		$.get("aboutme.html")
			.done(function(data){
				$("#content").html(data);
			})
			.fail(function(){
				console.log("failed to load aboutme.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(function(){
				$("#cactus-dialog").show();
				cactusOnPageChange();
			});

	// Projects page
	} else if (locHash == "#projects") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").show();
		$("#photo-gallery").hide();
		$.get("projects.html")
			.done(function(data){
				$("#content").html(data);
			})
			.fail(function(){
				console.log("failed to load projects.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(function(){
				$("#cactus-dialog").show();
				cactusOnPageChange();
			});

	// Gallery page
	} else if (locHash == "#photos") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").hide();
		$("#photo-gallery").show();
		$.get("photos.html")
			.done(function(data){
				$("#content").html(data);
			})
			.fail(function(){
				console.log("failed to load gallery.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(function(){
				$("#cactus-dialog").show();
				cactusOnPageChange();
			});

	// Links page
	} else if (locHash == "#links") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").hide();
		$("#photo-gallery").hide();
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
			.always(function(){
				$("#cactus-dialog").show();
				cactusOnPageChange();
			});

	// Contact page
	} else if (locHash == "#contact") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".exit-bar").removeClass("hidden");
		$(".back-btn").hide();
		$("#projects").hide();
		$("#photo-gallery").hide();
		$.get("contact.html")
			.done(function(data){
				$("#content").html(data);
			})
			.fail(function(){
				console.log("failed to load contact.html");
				$("#content").text("strange... I have nothing to show.");
			})
			.always(function(){
				$("#cactus-dialog").show();
				cactusOnPageChange();
			});

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
			$("#photo-gallery").hide();
			const path = PROJECT_DIR + projectID + "/";
			$.get(path + projectID + ".md")
				.done(function(data){
					$("#content").html(marked.parse(data));
					$("#cactus-dialog").addClass("article"); // full width content
					fixContentPaths(path);
					fixContentLinks();
					highlightContent();
					focusableImages();
				})
				.fail(function(){
					console.log("failed to load " + projectID + ".md");
					$("#content").text("strange.. I have nothing to show.");
				})
				.always(function(){
					$("#cactus-dialog").show();
					cactusOnPageChange();
				});

		// Default to welcome page
		} else {
			$(".welcome").show();
			$(".subpage").hide();
			$(".exit-bar").addClass("hidden");
			$("#projects").hide();
			$("#photo-gallery").hide();
			$.get("welcome.html")
				.done(function(data){
					$("#content").html(data);
				})
				.fail(function(){
					console.log("failed to load welcome.html");
					$("#content").text("strange... I have nothing to show.");
				})
				.always(function(){
					$("#cactus-dialog").show();
					cactusOnPageChange();
				});
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

// Allows images to be focused on click
function focusableImages() {
	$("#content img").each(function(){
		$(this).click(function(){
			$("#focus")
				.empty()
				.append($("<img>").attr("src", $(this).attr("src")))
				.show();
		});
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
