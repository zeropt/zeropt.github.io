/**
 * script.js
 * Author: Riley Mann
 * 
 * Main script for zeropt.github.io
 * 
 * Created on 16 Apr. 2025
 */

// Default settings
const settings = {
	"theme": "light",
	"muted": false
};

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
	// Attach Sounds
	$(".click1").mouseover(function(){playSound("#click1-hover");});
	$(".click1").mousedown(function(){playSound("#click1-press");});
	$(".click1").mouseup(function(){
		setTimeout(playSound, 0, "#click1-release");});
	$(".click2").mouseover(function(){playSound("#click1-hover");});
	$(".click2").mousedown(function(){playSound("#click2-press");});
	$(".click2").mouseup(function(){
		setTimeout(playSound, 0, "#click2-release");});
	$(".click3").mouseover(function(){playSound("#click1-hover");});
	$(".click3").mousedown(function(){playSound("#click3-press");});
	$(".click3").mouseup(function(){
		setTimeout(playSound, 0, "#click3-release");});
	// Load subpage
	loadSubpage(location.hash);
	window.onhashchange = function(){loadSubpage(location.hash);};
	// Cactus
	positionCactus();
	$(window).resize(positionCactus);
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
	$(".themed").removeClass("dark");
	$("#cactus-img").attr("src", "img/cactus.png");
}

function dusk() {
	$(".themed").addClass("dark");
	$("#cactus-img").attr("src", "img/cactus_dark.png");
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

function loadSubpage(locHash) {
	$("#content-box").empty();
	// About me page
	if (locHash == "#aboutme") {
		$("#content-box").load("pages/aboutme.html", positionCactus);
		$(".welcome").hide();
		$(".subpage").show();
	// Projects page
	} else if (locHash == "#projects") {
		$.get("projects/test/test.md", function(data){
			$("#content-box").html(marked.parse(data));
			setTimeout(positionCactus, 0);
		});
		$(".welcome").hide();
		$(".subpage").show();
	// Links page
	} else if (locHash == "#links") {
		$("#content-box").load("pages/links.html", positionCactus);
		$(".welcome").hide();
		$(".subpage").show();
	// Contact page
	} else if (locHash == "#contact") {
		$("#content-box").load("pages/contact.html", positionCactus);
		$(".welcome").hide();
		$(".subpage").show();
	// Default to welcome page
	} else {
		$("#content-box").load("pages/welcome.html", positionCactus);
		$(".welcome").show();
		$(".subpage").hide();
	}
}

/*--------------------------------More Actions--------------------------------*/

function playSound(id) {
	if (!settings.muted) {
		const sound = $(id)[0];
		sound.load();
		sound.play();
	}
}

// Returns x constrained between a and b
function constrain(x, a, b) {
	return Math.max(Math.min(x, b), a);
}
