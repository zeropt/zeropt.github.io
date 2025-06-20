/**
 * photo_gallery.js
 * Author: Riley Mann
 * 
 * Functions for automatically building the photo gallery
 * 
 * Created on 30 May 2025
 */

// Paths
const PHOTOS_DIR = "https://cdn.jsdelivr.net/gh/zeropt/my-photo-gallery@master/";
const PHOTOS_MANIFEST_PATH = PHOTOS_DIR + "manifest.json";

/*----------------------------- Main Functions -------------------------------*/

// Builds the photo gallery
function photoGalleryInit(failCallback, alwaysCallback) {
	let projectIDs = [];

	$.getJSON(PHOTOS_MANIFEST_PATH)
		.done(function(data){ // build photo gallery using photos manifest
			buildPhotoGallery(data.photos);
		})
		.fail(failCallback)
		.always(alwaysCallback);
}

/*----------------------------- Script Functions -----------------------------*/

// Appends photo thumbnails to #photo-gallery
function buildPhotoGallery(photos) {
	for (let i = 0; i < photos.length; i++) {
		// get image source path
		const full = PHOTOS_DIR + photos[i].src;
		let thumb = PHOTOS_DIR + photos[i].src;
		if (photos[i].thumb) thumb = PHOTOS_DIR + photos[i].thumb;

		// Build img
		const photo = $("<img>")
			.attr("src", thumb)
			.on({
				mousedown: function(){playSprite("click1Down");},
				mouseup: function(){playSprite("click1Up");},
				click: function(){
					$("#focus")
						.empty()
						.append($("<img>").attr("src", full))
						.show();
				}
			})
			.css("cursor", "pointer");

		// Append img
		$("#photo-gallery").prepend(photo);
	}
}
