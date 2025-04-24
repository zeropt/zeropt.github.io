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

// Project paths
const projectDir = "projects/";
const projectListPath = "projects/projectlist.json";

const projectIDs = [];

/*-----------------------------------Setup------------------------------------*/

$(document).ready(setup);

function setup() {
	// Build project menu before anything else
	buildProjectMenu(function(){
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
		$(".click1").mouseup(function(){playSound("#click1-release");});
		$(".click2").mouseover(function(){playSound("#click1-hover");});
		$(".click2").mousedown(function(){playSound("#click2-press");});
		$(".click2").mouseup(function(){playSound("#click2-release");});
		$(".click3").mouseover(function(){playSound("#click1-hover");});
		$(".click3").mousedown(function(){playSound("#click3-press");});
		$(".click3").mouseup(function(){playSound("#click3-release");});
		$("#mute-btn").mouseover(function(){playSound("#click1-hover");});
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
	playSound("#click1-release");
	$("#mute-btn").removeClass("muted");
}

/*----------------------------Content & Navigation----------------------------*/

function buildProjectMenu(successCallback, failureCallback) {
	$.getJSON(projectListPath, function(result){
		for (let i = 0; i < result.projects.length; i++) {
			// Update project IDs list
			projectIDs.push(result.projects[i].id);
			// Build menu
			const project = $("<a>")
				.attr("href", "#project-" + result.projects[i].id)
				.addClass("click1")
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
		if (projectIDs.includes(projectID)) {
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
