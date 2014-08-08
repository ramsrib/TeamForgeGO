/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * Contributor(s):
 *   Sriram <sriram@collab.net>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

"use strict";
const global = this;

const {classes: Cc, interfaces: Ci, manager: Cm, utils: Cu} = Components;
Cu.import("resource://gre/modules/AddonManager.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

// Remember if we were just installed
let justInstalled = false;

// Remember if we're on Firefox or Fennec
let platform = Services.appinfo.name == "Firefox" ? "desktop" : "mobile";
let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;

// TODO : Add address bar search
// Add functionality to search from the location bar and hook up autocomplete
// function addTeamForgeAddressBarSearch(window) {}

// TODO : Add TeamForge Autocomplete
// Add an autocomplete search engine to provide location bar suggestions
// function addTeamForgeAutocomplete() {}

// Add a default search engine and move it to the right place
function addTeamForgeSearchEngine() {

  let engineName = "TeamForge";
  let origEngine = Services.search.getEngineByName(engineName);
  if (origEngine != null) {
    Services.search.removeEngine(origEngine);
  }

  // Add the "TeamForge" search engine if necessary
  try {
    Services.search.addEngineWithDetails(engineName, TEAMFORGE_ICON, "", "",
    "GET", getTeamForgeBase("/sf/go/{searchTerms}"));
  } catch(ex) {
    console.log("Caught exception when adding teamforge search engine : " + ex);
  }

  // Clean up when disabling
  unload(function() {
	Services.search.removeEngine(engine); 
	// console.log("Removed the teamforge search engine.");
  });

  // Get the just-added or existing engine
  let engine = Services.search.getEngineByName(engineName);
  if (engine == null)
    return;

  // Move it to position #2 before Google
  if (!engine.hidden) {
    Services.search.moveEngine(engine, 1);
    Services.search.currentEngine = engine;
  }

}


// TODO : Add TeamForge App Tab
// Make sure the window has an app tab set to TeamForge
// function ensureTeamForgeAppTab(window) {}

//TODO : Add Landing Page to www.collab.net/teamforge
// Open a new tab for the landing page and select it
// function showLandingPage(window) {}

/**
 * Handle the add-on being activated on install/enable
 */
function startup({id}, reason) AddonManager.getAddonByID(id, function(addon) {
  // Load various javascript includes for helper functions
  ["helper", "utils", "prefs"].forEach(function(fileName) {
    let fileURI = addon.getResourceURI("scripts/" + fileName + ".js");
    Services.scriptloader.loadSubScript(fileURI.spec, global);
  });
  
  // set the default prefernce 
  setDefaultPrefs();

  // Preference observer which updates the teamforge search url in FF search service
  var prefsObserver = {
  		  observe: function(subject, topic, data) {
  		    if (topic == "nsPref:changed") {
  		    	switch(data) {
  		    	case "url":
  		    		this.url = Services.prefs.getBranch(PREF_BRANCH).getCharPref("url");
  	  			    updateTeamForgeSearchEngine();
  	  			    //console.log("Updated Successfully");
  		    		break;
  		    	}
  		    }

  		// Update the teamforge url
  		function updateTeamForgeSearchEngine() {
  		  let engineName = "TeamForge";
  		  
  		  // Remove any existing "TeamForge" search engines
  		  let origEngine = Services.search.getEngineByName(engineName);
  		  if (origEngine != null) {
  			  Services.search.removeEngine(origEngine);
  		  }

  		  // Add the updated "TeamForge" search engine
  		  try {
  		    Services.search.addEngineWithDetails(engineName, TEAMFORGE_ICON, "", "",
  		    "GET", getTeamForgeBase("/sf/go/{searchTerms}"));
  		  }
  		  catch(ex) {}

                  // Clean up when disabling
                  unload(function() { Services.search.removeEngine(engine); });

  		  // Get the just-added or existing engine
  		  let engine = Services.search.getEngineByName(engineName);
  		  if (engine == null)
  		    return;

  		  // Move it to position #2 before Google
  		  Services.search.moveEngine(engine, 1);
		  Services.search.currentEngine = engine;
  		  
  		}
  		 
  		  }
  		};
  
  // browser console
  // let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;
  // console.log("Debugger Ready to launch!");
  
  // console service
  //var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
  //aConsoleService.logStringMessage("a logging message from console service");
  
  // add the options listener
  let branch = Services.prefs.getBranch(PREF_BRANCH);
  branch.addObserver("", prefsObserver, false);

  // console.log("Before calling add teamforge search engine.");

  // Add teamforge search engine to the browser
  addTeamForgeSearchEngine();
  // console.log("After calling add teamforge search engine.");
    
  unload(function() { branch.removeObserver("", prefsObserver); });

})


/**
 * Handle the add-on being deactivated on uninstall/disable
 */
function shutdown(data, reason) {
  // Clean up with unloaders when we're deactivating
  if (reason != APP_SHUTDOWN)
    // console.log("Unloading the teamforge search engine when disabling the addon.");
    unload();
}

/**
 * Handle the add-on being installed
 */
function install(data, reason) {
  justInstalled = reason == ADDON_INSTALL;
}

/**
 * Handle the add-on being uninstalled
 */
function uninstall(data, reason) {}
