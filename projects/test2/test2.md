# Test 2 Electric Boogaloo

Apr. 2025

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Python

```py
import sys

import gi

gi.require_version("Gtk", "4.0")
from gi.repository import GLib, Gtk


class MyApplication(Gtk.Application):
	def __init__(self):
		super().__init__(application_id="com.example.MyGtkApplication")
		GLib.set_application_name('My Gtk Application')
	
	def do_activate(self):
		window = Gtk.ApplicationWindow(application=self, title="Hello World")
		window.present()


app = MyApplication()
exit_status = app.run(sys.argv)
sys.exit(exit_status)
```

HTML

```html
<!DOCTYPE html>
<html>
<body>
	<div style="max-width: 70ch;">
		<h1>Projects</h1>
		<p>
			I plan to populate this page with my current projects and activities as
			well as a few past projects I'd like to write about.
		</p>
	</div>
</body>
</html>
```

JavaScript

```js
// Runs once when the document is ready
function setup() {
	// Background
	sizeDunes();
	$(window).on({
		resize: sizeDunes,
		scroll: scrollDunes
	});
	$(document).on("mousemove", moveDunes);

	// Howler
	sounds.once("loaderror", function(){
		console.log("sound sprites failed to load");
	});

	// Load project list
	$.getJSON(PROJECT_LIST_PATH)
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
			$("#cactus").click(function(){$("html").toggleClass("spring")});

			// Configure the page content based on the location hash
			loadPage(location.hash);
			window.onhashchange = function(){loadPage(location.hash);};

			// Reposition the cactus on window resize
			$(window).resize(function(){
				const position = cactusPosition();
				$("#cactus").css({
					"top": position.top + "px",
					"left": position.left + "px",
				});
			});
		});
}
```

Rust

```rs
use gtk::prelude::*;
use gtk::{glib, Application, ApplicationWindow, Button};

const APP_ID: &str = "org.gtk_rs.HelloGTK";

fn main() -> glib::ExitCode {
	// Create a new application
	let app = Application::builder().application_id(APP_ID).build();

	// Connect to "activate" signal of app
	app.connect_activate(build_ui);

	// Run the application
	app.run()
}

fn build_ui(app: &Application) {
	// Create a button with label and margins
	let button = Button::builder()
		.label("Press me!")
		.margin_top(12)
		.margin_bottom(12)
		.margin_start(12)
		.margin_end(12)
		.build();

	// Connect to clicked signal of button
	button.connect_clicked(|button| {
		// Set label to "Hello GTK!"
		button.set_label("Hello GTK!");
	});

	// create a window and set the title
	let window = ApplicationWindow::builder()
		.application(app)
		.title("My GTK App")
		.child(&button)
		.build();

	// Present window
	window.present();
}
```
