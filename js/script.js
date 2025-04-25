/**
 * script.js
 * Author: Riley Mann
 * 
 * Main script for zeropt.github.io
 * 
 * Created on 16 Apr. 2025
 */

// Paths and variables for automatic project loading
const projectDir = "projects/";
const projectListPath = "projects/projectlist.json";

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

$(document).ready(setup);

// Runs once when the document is ready
function setup() {
	// Howler
	sounds.once("load", function(){
		console.log("Sound sprites loaded!");
	});
	sounds.once("loaderror", function(){
		console.log("Sound sprites failed to load!");
	});

	// Build project menu before anything else
	buildProjectMenu(function(){
		setupTheme();
		attachSounds();
		// Connect buttons
		$("#theme-btn").click(toggleTheme);
		$("#mute-btn").click(toggleMute);
		// Load page
		loadPage(location.hash);
		window.onhashchange = function(){loadPage(location.hash);};
		// Cactus
		positionCactus();
		$(window).resize(positionCactus);
	}, function(){
		$("body").html("error building project menu")
	});
}


// Sets the theme variable using local storage or sets local storage if not
// already set and set initial site theme
function setupTheme() {
	if (localStorage.theme) data.settings.theme = localStorage.theme;
	else localStorage.theme = data.settings.theme;
	// Configure dark theme if so
	if (data.settings.theme == "dark") dusk();
}

// Connects sounds to button events
function attachSounds() {
	$(".click0").mouseover(function(){playSprite("hover");});
	$(".click0").mousedown(function(){playSprite("click0Down");});
	$(".click0").mouseup(function(){playSprite("click0Up");});
	$(".click1").mousedown(function(){playSprite("click1Down");});
	$(".click1").mouseup(function(){playSprite("click1Up");});
	$(".click2").mouseover(function(){playSprite("hover");});
	$(".click2").mousedown(function(){playSprite("click2Down");});
	$(".click2").mouseup(function(){playSprite("click2Up");});
	$("#mute-btn").mouseover(function(){playSprite("hover");});
	$("#cactus-img").mousedown(function(){playSprite("bubble0");});
	$("#cactus-img").mouseup(function(){playSprite("bubble1");});
}

/*------------------------------Cactus Functions------------------------------*/

function positionCactus() {
	const dialog = $("#prickly-dialog");
	const windowW = $(window).width();
	const windowH = $(window).height();
	const cactusW = $("#cactus-img").width();
	let cactusT = 0;
	let cactusL = 0;
	if (windowW > 800) { // desktop position
		// Calculate new position
		cactusT = Math.round(constrain(
			dialog.position().top + dialog.height() - 0.1*cactusW,
			0, windowH - cactusW));
		cactusL = Math.round(constrain(
			dialog.position().left - cactusW,
			0, windowW - cactusW));
	} else { // mobile position
		// Caculate new position
		cactusT = Math.round(
			dialog.position().top + dialog.height() + 0.52*cactusW);
		cactusL = Math.round(0.5*windowW - 0.52*cactusW);
	}
	// Set position
	$("#cactus-img").css({
		"top": `${cactusT}px`,
		"left": `${cactusL}px`,
	});
}

/*-----------------------------Settings Functions-----------------------------*/

function toggleTheme() {
	// Toggle setting
	if (data.settings.theme == "dark") {
		data.settings.theme = "light";
		dawn();
	} else {
		data.settings.theme = "dark";
		dusk();
	}
	// Set local storage
	localStorage.theme = data.settings.theme;
}

function dawn() {
	$(".themed").removeClass("dark");
	$("#cactus-img").attr("src", "img/cactus.png");
}

function dusk() {
	$(".themed").addClass("dark");
	$("#cactus-img").attr("src", "img/cactus_dark.png");
}

function toggleMute() {
	if (data.settings.muted) {
		data.settings.muted = false;
		unmute();
	} else {
		data.settings.muted = true;
		mute();
	}
}

function mute() {
	$("#mute-btn").addClass("muted");
}

function unmute() {
	playSprite("click0Down");
	$("#mute-btn").removeClass("muted");
}

/*----------------------------Content & Navigation----------------------------*/

function buildProjectMenu(successCallback, failureCallback) {
	$.getJSON(projectListPath, function(result){
		for (let i = 0; i < result.projects.length; i++) {
			// Update project IDs list
			data.projectIDs.push(result.projects[i].id);
			// Build menu
			const project = $("<a>")
				.attr("href", "#project-" + result.projects[i].id)
				.addClass("click0")
				.text(result.projects[i].title);
			$("#projects").append(project);
		}
		successCallback();
	}).fail(failureCallback);
}

function loadPage(locHash) {
	$("#content-box").empty();
	// About me page
	if (locHash == "#aboutme") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").hide();
		$("#content-box").load("pages/aboutme.html", positionCactus);
	// Projects page
	} else if (locHash == "#projects") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").show();
		$("#content-box").load("pages/projects.html", positionCactus);
	// Links page
	} else if (locHash == "#links") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").hide();
		$("#content-box").load("pages/links.html", positionCactus);
	// Contact page
	} else if (locHash == "#contact") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").hide();
		$("#content-box").load("pages/contact.html", positionCactus);
	} else {
		// Load project
		const projectID = locHash.replace("#project-", "");
		if (data.projectIDs.includes(projectID)) {
			$(".back-btn").attr("href", "#projects");
			$(".welcome").hide();
			$(".subpage").show();
			$(".close-btn").show();
			$(".back-btn").show();
			$("#projects").hide();
			loadProject(projectID,
				function(){setTimeout(positionCactus, 0);},
				function(){
					$("#content-box").text(`error loading ${projectID}.md`);
					positionCactus();
				});
		// Default to welcome page
		} else {
			$(".welcome").show();
			$(".subpage").hide();
			$(".close-btn").hide();
			$(".back-btn").hide();
			$("#projects").hide();
			$("#content-box").load("pages/welcome.html", positionCactus);
		}
	}
}

function loadProject(projectID, successCallback, failureCallback) {
	const projectPath = projectDir + projectID + "/";
	$.get(projectPath + projectID + ".md", function(data){
		// Load markdown data
		$("#content-box").html(marked.parse(data));
		// Correct image source paths
		$("#content-box img").each(function(){
			const oldSrc = $(this).attr("src");
			$(this).attr("src", projectPath + oldSrc);
		});
		successCallback();
	}).fail(failureCallback);
}

/*--------------------------------More Actions--------------------------------*/

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
