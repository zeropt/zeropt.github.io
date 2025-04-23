/**
 * script.js
 * Author: Riley Mann
 * 
 * Main script for zeropt.github.io
 * 
 * Created on 16 Apr. 2025
 */

// Constants
const BGWIDTH = 512;
const BGHEIGHT = 216;
const CACTUSWIDTH = 64;

// Default settings
const settings = {
	"theme": "light",
	"muted": false
};

let welcome = true;

/*-----------------------------------Setup------------------------------------*/

$(document).ready(setup);

function setup() {
	// Local storage
	if (localStorage.theme) settings.theme = localStorage.theme;
	else localStorage.theme = settings.theme;
	// Theme
	if (settings.theme == "dark") dusk();
	// Connect buttons
	$("#theme-btn").click(toggleTheme);
	$("#mute-btn").click(toggleMute);
	$(".aboutme-btn").click(function(){changeSubpage("#aboutme");});
	$(".projects-btn").click(function(){changeSubpage("#projects");});
	$(".links-btn").click(function(){changeSubpage("#links");});
	$(".contact-btn").click(function(){changeSubpage("#contact");});
	$(".close-btn").click(closeSubpage);
	// Load subpage
	loadSubpage(location.hash);
	window.onhashchange = function(){loadSubpage(location.hash);};
	// Cactus
	scaleCactus();
	positionCactus();
	$(window).resize(scaleCactus);
}

/*------------------------------Cactus Functions------------------------------*/

function scaleCactus() {
	const width = $(window).width();
	const height = $(window).height();
	// Calculate pixel width
	let pixelWidth = 0.0;
	if (width * BGHEIGHT / height > BGWIDTH)
		pixelWidth = width / BGWIDTH; // window is wide
	else pixelWidth = height / BGHEIGHT; // window is tall
	// Scale cactus
	let newCactusWidth = Math.round(CACTUSWIDTH * pixelWidth);
	$("#cactus-img").width(newCactusWidth);
	// Position Cactus
	positionCactus();
}

function positionCactus() {
	const dialog = welcome ?
		$(".welcome.prickly-border") : $(".subpage.prickly-border");
	const cwidth = $("#cactus-img").width();
	const cactusLeft = Math.round(constrain(
		dialog.position().left - cwidth,
		0, $(window).width() - cwidth));
	const cactusBottom = Math.round(constrain(
		$(window).height() - dialog.position().top- dialog.height() - 0.9*cwidth,
		0, $(window).height() - cwidth));
	$("#cactus-img").css({
		"bottom": `${cactusBottom}px`,
		"left": `${cactusLeft}px`,
	});
}

/*-----------------------------Settings Functions-----------------------------*/

function toggleTheme() {
	// Toggle setting
	if (settings.theme == "dark") {
		settings.theme = "light";
		dawn();
	} else {
		settings.theme = "dark";
		dusk();
	}
	// Set local storage
	localStorage.theme = settings.theme;
}

function dawn() {
	$("#theme-btn").removeClass("dark");
}

function dusk() {
	$("#theme-btn").addClass("dark");
}

function toggleMute() {
	if (settings.muted) {
		settings.muted = false;
		unmute();
	} else {
		settings.muted = true;
		mute();
	}
}

function mute() {
	$("#mute-btn").addClass("muted");
}

function unmute() {
	$("#mute-btn").removeClass("muted");
}

/*---------------------------------Navigation---------------------------------*/

function changeSubpage(locHash) {
	playSound();
	location.hash = locHash;
}

function loadSubpage(locHash) {
	welcome = false;
	// About me page
	if (locHash == "#aboutme") {
		$("#content-box").empty();
		$("#content-box").load("pages/aboutme.html", positionCactus);
		$(".welcome").hide();
		$(".subpage").show();
	// Projects page
	} else if (locHash == "#projects") {
		$("#content-box").empty();
		$.get("projects/test/test.md", function(data){
			$("#content-box").html(marked.parse(data));
			setTimeout(positionCactus, 0);
		});
		$(".welcome").hide();
		$(".subpage").show();
	// Links page
	} else if (locHash == "#links") {
		$("#content-box").empty();
		$("#content-box").load("pages/links.html", positionCactus);
		$(".welcome").hide();
		$(".subpage").show();
	// Contact page
	} else if (locHash == "#contact") {
		$("#content-box").empty();
		$("#content-box").load("pages/contact.html", positionCactus);
		$(".welcome").hide();
		$(".subpage").show();
	// Default to welcome page
	} else {
		welcome = true;
		$(".subpage").hide();
		$(".welcome").show(0, positionCactus);
	}
}

function closeSubpage() {
	location.hash = "#welcome";
}

/*--------------------------------More Actions--------------------------------*/

function playSound() {
	if (!settings.muted) {
		const sound = $("#pluck-sound")[0];
		sound.load();
		sound.play();
	}
}

// Returns x constrained between a and b
function constrain(x, a, b) {
	return Math.max(Math.min(x, b), a);
}
