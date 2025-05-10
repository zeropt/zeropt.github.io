/**
 * sound.js
 * Author: Riley Mann
 * 
 * To initialize and play the clicky sound effects using howler.js
 * 
 * Created on 10 May 2025
 */

// Initialize howler sprites
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

const soundData = {
	muted: false,
	volume: {
		hover: 0.8,
		click0Down: 1.0,
		click0Up: 1.0,
		click1Down: 0.3,
		click1Up: 0.3,
		click2Down: 0.4,
		click2Up: 0.4,
		bubble0: 0.2,
		bubble1: 0.2
	}
};

// Plays a sound using the sprite name and stops other sounds
function playSprite(sprite) {
	if (!soundData.muted) {
		sounds.stop();
		const id = sounds.play(sprite);
		sounds.volume(soundData.volume[sprite], id);
	}
}

// Mute functions
function isMuted() {return soundData.muted;}
function mute() {soundData.muted = true;}
function unmute() {soundData.muted = false;}
