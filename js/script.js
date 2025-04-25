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
	sounds.once("loaderror", function(){
		console.log("sound sprites failed to load");
	});

	// Load project list
	$.getJSON(projectListPath)
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

			// Configure the page content based on the location hash
			loadPage(location.hash);
			window.onhashchange = function(){loadPage(location.hash);};

			// Lastly, position the cactus relative to the dialog box
			positionCactus();
			$(window).resize(positionCactus);
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
			.addClass("click0");
		project.append($("<h2>").text(projects[i].title));
		project.append($("<p>").text(projects[i].description));

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
	$(".click0").on("mouseenter", function(){playSprite("hover");});
	$(".click0").on("mousedown", function(){playSprite("click0Down");});
	$(".click0").on("mouseup", function(){playSprite("click0Up");});
	$(".click1").on("mousedown", function(){playSprite("click1Down");});
	$(".click1").on("mouseup", function(){playSprite("click1Up");});
	$(".click2").on("mouseenter", function(){playSprite("hover");});
	$(".click2").on("mousedown", function(){playSprite("click2Down");});
	$(".click2").on("mouseup", function(){playSprite("click2Up");});
	$("#mute-btn").on("mouseenter", function(){playSprite("hover");});
	$("#cactus").on("mousedown", function(){playSprite("bubble0");});
	$("#cactus").on("mouseup", function(){playSprite("bubble1");});
}

/*---------------------------------Content------------------------------------*/

// Configures the page and loads the content box based on the location hash
function loadPage(locHash) {
	// Clear content box
	$("#content-box").empty();

	// About me page
	if (locHash == "#aboutme") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").hide();
		$.get("pages/aboutme.html")
			.done(function(data){
				$("#content-box").html(data);
			})
			.fail(function(){
				console.log("failed to load aboutme.html");
				$("#content-box").text("strange... I have nothing to show.");
			})
			.always(positionCactus);

	// Projects page
	} else if (locHash == "#projects") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").show();
		$.get("pages/projects.html")
			.done(function(data){
				$("#content-box").html(data);
			})
			.fail(function(){
				console.log("failed to load projects.html");
				$("#content-box").text("strange... I have nothing to show.");
			})
			.always(positionCactus);

	// Links page
	} else if (locHash == "#links") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").hide();
		$.get("pages/links.html")
			.done(function(data){
				$("#content-box").html(data);
			})
			.fail(function(){
				console.log("failed to load links.html");
				$("#content-box").text("strange... I have nothing to show.");
			})
			.always(positionCactus);

	// Contact page
	} else if (locHash == "#contact") {
		$(".welcome").hide();
		$(".subpage").show();
		$(".close-btn").show();
		$(".back-btn").hide();
		$("#projects").hide();
		$.get("pages/contact.html")
			.done(function(data){
				$("#content-box").html(data);
			})
			.fail(function(){
				console.log("failed to load contact.html");
				$("#content-box").text("strange... I have nothing to show.");
			})
			.always(positionCactus);

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
			const projectPath = projectDir + projectID + "/";
			$.get(projectPath + projectID + ".md")
				.done(function(data){
					$("#content-box").html(marked.parse(data));
					$("#content-box img").each(function(){ // correct image paths
						const oldSrc = $(this).attr("src");
						$(this).attr("src", projectPath + oldSrc);
					});
				})
				.fail(function(){
					console.log("failed to load " + projectID + ".md");
					$("#content-box").text("strange.. I have nothing to show.");
				})
				.always(positionCactus);

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

/*-----------------------------------Cactus-----------------------------------*/

// Positions cactus relative to the dialog box
function positionCactus() {
	const dialog = $("#prickly-dialog");
	const windowW = $(window).width();
	const windowH = $(window).height();
	const cactusW = $("#cactus").width();
	let cactusT = 0;
	let cactusL = 0;

	if (windowW > 800) { // calculate desktop position
		cactusT = Math.round(constrain(
			dialog.position().top + dialog.height() - 0.1*cactusW,
			0, windowH - cactusW));
		cactusL = Math.round(constrain(
			dialog.position().left - cactusW,
			0, windowW - cactusW));
	} else { // calculate mobile position
		cactusT = Math.round(
			dialog.position().top + dialog.height() + 0.52*cactusW);
		cactusL = Math.round(0.5*windowW - 0.52*cactusW);
	}

	// Set position
	$("#cactus").css({
		"top": `${cactusT}px`,
		"left": `${cactusL}px`,
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
