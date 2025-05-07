/**
 * sandscape.js
 * Author: Riley Mann
 * 
 * Functions for animating the background images
 * 
 * Created on 7 May 2025
 */

// Sandscape image dimensions in pixel art pixels
const SANDSCAPE_WIDTH = 512;
const SANDSCAPE_HEIGHT = 216;

// Parallax parameters
const DUNE_NUM = 6;
const MAX_PARALLAX_X = 24;
const MAX_PARALLAX_Y = 12;
const PARALLAX_P = 0.004; // adjusts lag
const MIN_PARALLAX_SPEED = 1;

const sandscapeData = {
	pixelScale: null,
	w: null,
	h: null,
	mouseX: null,
	mouseY: null,
	lagX: null,
	lagY: null,
	timestamp: null,
};

/*------------------------ Functions used by main.js -------------------------*/

function sandscapeInit() {
	sandscapeOnResize(); // resize background images

	// Start animation
	sandscapeData.timestamp = document.timeline.currentTime;
	requestAnimationFrame(animateSandscape);
}

function sandscapeOnResize() {
	sandscapeData.w = $("#sandscape").width();
	sandscapeData.h = $("#sandscape").height();

	// Calculate crop
	let cropW = SANDSCAPE_WIDTH;
	let cropH = SANDSCAPE_HEIGHT;
	if (sandscapeData.w > MAX_WIDTH) {
		cropW -= 2 * MAX_PARALLAX_X;
		cropH -= MAX_PARALLAX_Y;
	}

	// Calculate pixelScale
	if (sandscapeData.h < (cropH * sandscapeData.w) / cropW) { // tall crop
		sandscapeData.pixelScale = sandscapeData.w / cropW;
	} else { // wide crop
		sandscapeData.pixelScale = sandscapeData.h / cropH;
	}

	// Center lag positon
	sandscapeData.lagX = 0.5 * sandscapeData.w;
	sandscapeData.lagY = 0.5 * sandscapeData.h;

	// Resize background images
	setSandscapeSizes();
}

function sandscapeOnMouseMove(event) {
	sandscapeData.mouseX = event.pageX;
	sandscapeData.mouseY = event.pageY;
}

/*--------------------------- Background Functions ---------------------------*/

// Sets the size of the sandscape background images
function setSandscapeSizes() {
	// Calculate sandscape image size
	const imgWidth = Math.round(sandscapeData.pixelScale * SANDSCAPE_WIDTH);

	// Set sandscape img sizes
	let style = "";
	for (let i = 0; i < DUNE_NUM; i++) style += imgWidth + "px,";
	style += imgWidth + "px";
	$("#sandscape").css("background-size", style);

	// Center sandscape images
	style = "";
	for (let i = 0; i < DUNE_NUM; i++) style += "center top,";
	style += "center top";
	$("#sandscape").css("background-position", style);
}

// Animate background parallax
function animateSandscape(timestamp) {
	if (sandscapeData.w > MAX_WIDTH) { // only if desktop styled
		// Lag behind mouse
		const dt = timestamp - sandscapeData.timestamp;
		sandscapeData.lagX += Math.min(PARALLAX_P * dt, 1.0)
			* (sandscapeData.mouseX - sandscapeData.lagX);
		sandscapeData.lagY += Math.min(PARALLAX_P * dt, 1.0)
			* (sandscapeData.mouseY - sandscapeData.lagY);

		// Calculate parallax
		const parallaxX = 2 * MAX_PARALLAX_X
			* (0.5*sandscapeData.w - sandscapeData.lagX) / sandscapeData.w;
		const parallaxY = 2 * MAX_PARALLAX_Y
			* (sandscapeData.h - sandscapeData.lagY) / sandscapeData.h;

		// Calculate starting offsets
		const startX = 0.5
			* (sandscapeData.w - sandscapeData.pixelScale * SANDSCAPE_WIDTH);
		const startY = 0.5
			* (sandscapeData.h - sandscapeData.pixelScale * SANDSCAPE_HEIGHT);

		// Set sandscape img positions
		let style = "";
		for (let i = 0; i < DUNE_NUM; i++) {
			const x = Math.round(startX 
				+ sandscapeData.pixelScale * Math.round(parallaxX / (i + 1)));
			const y = Math.round(startY 
				+ sandscapeData.pixelScale * Math.round(parallaxY / (i + 1)));
			style += x + "px " + y + "px,";
		}
		style += "center top"; // center sky
		$("#sandscape").css("background-position", style);
	}

	// request another frame
	sandscapeData.timestamp = timestamp;
	requestAnimationFrame(animateSandscape);
}
