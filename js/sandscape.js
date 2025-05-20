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
const CLOUD_INTERVAL = [1500, 400]; // ms

const sandscapeData = {
	mobile: false,
	pixelScale: null,
	w: null, h: null,
	mouseX: null, mouseY: null,
	lagX: null, lagY: null,
	centerX: null, centerY: null,
	cloudPos: [0, 0],
	duneTimestamp: null
};

/*----------------------------- Main Functions -------------------------------*/

function sandscapeInit(mobile) {
	sandscapeOnResize(mobile); // resize background images

	// Set cloud intervals
	for (let i = 0; i < CLOUD_INTERVAL.length; i++) {
		setInterval(moveCloud, CLOUD_INTERVAL[i], i);
	}

	// Start animation
	sandscapeData.duneTimestamp = document.timeline.currentTime;
	requestAnimationFrame(animateDunes);
}

// Runs when the window is resized
function sandscapeOnResize(mobile) {
	sandscapeData.mobile = mobile;
	sandscapeData.w = $("#sandscape").width();
	sandscapeData.h = $("#sandscape").height();

	// Calculate crop
	let cropW = SANDSCAPE_WIDTH;
	let cropH = SANDSCAPE_HEIGHT;
	if (!sandscapeData.mobile) {
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

	// Calculate centering offsets
	sandscapeData.centerX = 0.5
		* (sandscapeData.w - sandscapeData.pixelScale * SANDSCAPE_WIDTH);
	sandscapeData.centerY = 0.5
		* (sandscapeData.h - sandscapeData.pixelScale * SANDSCAPE_HEIGHT);

	// Resize background images
	setSandscapeSizes();
}

// Runs when the mouse is moved
function sandscapeOnMouseMove(event) {
	sandscapeData.mouseX = event.pageX;
	sandscapeData.mouseY = event.pageY;
}

/*----------------------------- Script Functions -----------------------------*/

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

// Moves cloud
function moveCloud(cloudIndex) {
	// Move cloud
	sandscapeData.cloudPos[cloudIndex] += sandscapeData.pixelScale;
	sandscapeData.cloudPos[cloudIndex] %=
		sandscapeData.pixelScale * SANDSCAPE_WIDTH;

	let style = "";
	for (let i = 0; i < CLOUD_INTERVAL.length; i++) {
		style += (sandscapeData.centerX + sandscapeData.cloudPos[i]) + "px";
		if (i < CLOUD_INTERVAL.length - 1) style += ",";
	}
	$("#clouds").css("background-position-x", style);
}

// Animate dune parallax
function animateDunes(timestamp) {
	const dt = timestamp - sandscapeData.duneTimestamp;

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

	// Set sandscape img positions
	style = "";
	for (let i = 0; i < DUNE_NUM; i++) {
		const x = sandscapeData.centerX
			+ sandscapeData.pixelScale * Math.round(parallaxX / (i + 1));
		const y = sandscapeData.centerY
			+ sandscapeData.pixelScale * Math.round(parallaxY / (i + 1));
		style += x + "px " + y + "px";
		if (i < DUNE_NUM - 1) style += ",";
	}
	$("#dunes").css("background-position", style);

	// Save timestamp
	sandscapeData.duneTimestamp = timestamp;

	// Request new animation frame
	requestAnimationFrame(animateDunes);
}
