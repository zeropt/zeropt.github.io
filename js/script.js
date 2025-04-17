/**
 * script.js
 * Author: Riley Mann
 * 
 * Created on 16 Apr. 2025
 */

let audio = $("audio")[0];

$(document).ready(function(){
	$("p").click(function(){
		audio.play();
	});

	$.get("test.md", function(data){
		$("#content").html(marked.parse(data));
	});
});
