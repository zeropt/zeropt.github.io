/**
 * cactus.js
 * Author: Riley Mann
 * 
 * Functions for moving the cactus
 * 
 * Created on 10 May 2025
 */

const cactusData = {
	mobile: false
};

/*----------------------------- Main Functions -------------------------------*/

function cactusInit(mobile) {
	cactusData.mobile = mobile;
	moveCactus();
}

// Runs when the window is resized
function cactusOnResize(mobile) {
	cactusData.mobile = mobile;
	moveCactus();
}

// Runs when the window is scrolled
function cactusOnScroll() {moveCactus();}

// Runs when the subpage changes
function cactusOnPageChange() {animateCactus();}

/*----------------------------- Script Functions -----------------------------*/

// Moves the cactus next to the dialog box
function moveCactus() {
	const position = cactusPosition();
	$("#cactus").css({
		"top": position.top + "px",
		"left": position.left + "px",
	});
}

// Animate the cactus and dialog box for when loading new content
function animateCactus() {
	$("#content").parent().show(0, function(){
		const endPosition = cactusPosition();
		$("#content").parent().hide(0, function(){
			const startPosition = cactusPosition();
			$("#cactus").css({
				"top": startPosition.top + "px",
				"left": startPosition.left + "px",
			});
			$("#content").parent().show(200);
			$("#cactus").animate({
					"top": endPosition.top + "px",
					"left": endPosition.left + "px",
				}, 200);
		});
	});
}

// Returns the target position next to the dialog box
function cactusPosition() {
	const dialog = $("#cactus-dialog");
	const windowW = $(window).width();
	const windowH = $(window).height();
	const cactusW = $("#cactus").width();
	let cactusT = 0;
	let cactusL = 0;

	if (!cactusData.mobile) { // calculate desktop position
		cactusT = Math.max(
			Math.min(
				dialog.position().top + dialog.height() - 0.55*cactusW,
				windowH - cactusW - 4),
			0);
		cactusL = Math.max(
			Math.min(dialog.position().left - cactusW, windowW - cactusW),
			0);
	} else { // calculate mobile position
		cactusT = dialog.position().top - $(window).scrollTop() + dialog.height()
			+ 0.05*cactusW;
		cactusL = 0.5*windowW - 0.52*cactusW;
	}

	// return position data
	return {top: cactusT, left: cactusL};
}
