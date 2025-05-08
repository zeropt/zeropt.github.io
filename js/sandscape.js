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

// Cloud parameters
const CLOUD_NUM = 2;
const CLOUD_SPEED = [0.001, 0.004]; // pixel art pixel per ms

const sandscapeData = {
	pixelScale: null,
	w: null,
	h: null,
	mouseX: null,
	mouseY: null,
	lagX: null,
	lagY: null,
	timestamp: null,
	cloudPos: [0, 0]
};

/*------------------------ Functions used by main.js -------------------------*/

function sandscapeInit() {
	sandscapeOnResize(); // resize background images

	// Start animation
	sandscapeData.timestamp = document.timeline.currentTime;
	sandscapeData.cloudTimestamp = document.timeline.currentTime;
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
	$("#sandscape").css("background-size", imgWidth + "px");
	$("#clouds").css("background-size", imgWidth + "px");
	let style = "";
	for (let i = 0; i < DUNE_NUM; i++) {
		style += imgWidth + "px";
		if (i < DUNE_NUM - 1) style += ",";
	}
	$("#dunes").css("background-size", style);

	// Center dune images
	style = "";
	for (let i = 0; i < DUNE_NUM; i++) {
		style += "center";
		if (i < DUNE_NUM - 1) style += ",";
	}
	$("#dunes").css("background-position", style);
}

// Animate background parallax and clouds
function animateSandscape(timestamp) {
	const dt = timestamp - sandscapeData.timestamp;

	// Clouds
	let style = "";
	for (let i = 0; i < CLOUD_NUM; i++) {
		sandscapeData.cloudPos[i] +=
			CLOUD_SPEED[i] * sandscapeData.pixelScale * dt;
		if (sandscapeData.cloudPos[i] 
			> sandscapeData.pixelScale * SANDSCAPE_WIDTH) {
			sandscapeData.cloudPos[i] = 0;
		}
		style += 
			(Math.round(sandscapeData.cloudPos[i] / sandscapeData.pixelScale)
			* sandscapeData.pixelScale) + "px";
		if (i < CLOUD_NUM - 1) style += ",";
	}
	$("#clouds").css("background-position-x", style);

	// Parallax
	if (sandscapeData.w > MAX_WIDTH) { // only if desktop styled
		// Lag behind mouse
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
		style = "";
		for (let i = 0; i < DUNE_NUM; i++) {
			const x = Math.round(startX
				+ sandscapeData.pixelScale * Math.round(parallaxX / (i + 1)));
			const y = Math.round(startY
				+ sandscapeData.pixelScale * Math.round(parallaxY / (i + 1)));
			style += x + "px " + y + "px";
			if (i < DUNE_NUM - 1) style += ",";
		}
		$("#dunes").css("background-position", style);
	}

	// request another frame
	sandscapeData.timestamp = timestamp;
	requestAnimationFrame(animateSandscape);
}
