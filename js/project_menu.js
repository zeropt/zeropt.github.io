/**
 * project_menu.js
 * Author: Riley Mann
 * 
 * Functions for automatically building the project menu from project list json
 * 
 * Created on 10 May 2025
 */

// Paths
const PROJECT_DIR = "projects/";
const PROJECT_LIST_PATH = "projects/projectlist.json";

/*----------------------------- Main Functions -------------------------------*/

// Builds the project menu and passes the list of IDs in the always callback
function projectMenuInit(failCallback, alwaysCallback) {
	let projectIDs = [];

	$.getJSON(PROJECT_LIST_PATH)
		.done(function(data){ // build menu using project list
			projectIDs = buildProjectMenu(data.projects);
		})
		.fail(failCallback)
		.always(function(){alwaysCallback(projectIDs);});
}

/*----------------------------- Script Functions -----------------------------*/

// Appends project links to #projects div element using project list
function buildProjectMenu(projects) {
	const projectIDs = [];

	for (let i = 0; i < projects.length; i++) {
		// Update project IDs list
		projectIDs.push(projects[i].id);

		// Build menu item
		const project = $("<a>")
			.attr("href", "#project-" + projects[i].id)
			.addClass("button")
			.addClass("click0");
		if (projects[i].thumb) {
			project.append($("<div>")
				.addClass("thumbnail")
				.append($("<img>").attr(
					"src", 
					PROJECT_DIR + projects[i].id + "/" + projects[i].thumb
				)));
		}
		project.append($("<div>")
			.addClass("description")
			.append($("<h2>").text(projects[i].title))
			.append($("<p>").text(projects[i].description)));

		// Append menu item
		$("#projects").prepend(project);
		console.log("project added: " + projects[i].id);
	}

	// Return the project IDs
	return projectIDs;
}
