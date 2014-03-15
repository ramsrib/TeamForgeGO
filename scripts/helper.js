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
 *   Edward Lee <edilee@mozilla.com>
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

const TEAMFORGE_ICON = "data:image/png;base64,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";

// Look through tabs in the browser to see if any match
function findOpenTab(browser, checkTabAndURI) {
  let foundTab;
  Array.some(browser.tabs, function(tab) {
    // Check if there's an existing page
    try {
      // Use an activate navigation if it's still loading
      let {currentURI, webNavigation, __SS_data} = tab.linkedBrowser;
      let channel = webNavigation.documentChannel;
      if (channel != null)
        currentURI = channel.originalURI

      // Use the session restore entry if it's still restoring
      if (currentURI.spec == "about:blank" && __SS_data != null)
        currentURI = Services.io.newURI(__SS_data.entries[0].url, null, null);

      // Short circuit now that we found it
      if (checkTabAndURI(tab, currentURI)) {
        foundTab = tab;
        return true;
      }
    }
    catch(ex) {}
  });
  return foundTab;
}

//Get a teamforge url with a partner code
function getTeamForgeBase(path) {
	return getPref("url") + path;
}

// Take a window and create various helper properties and functions
function makeWindowHelpers(window) {
  let {clearTimeout, setTimeout} = window;

  // Call a function after waiting a little bit
  function async(callback, delay) {
    let timer = setTimeout(function() {
      stopTimer();
      callback();
    }, delay);

    // Provide a way to stop an active timer
    function stopTimer() {
      if (timer == null)
        return;
      clearTimeout(timer);
      timer = null;
      unUnload();
    }

    // Make sure to stop the timer when unloading
    let unUnload = unload(stopTimer, window);

    // Give the caller a way to cancel the timer
    return stopTimer;
  }

  // Replace a value with another value or a function of the original value
  function change(obj, prop, val) {
    let orig = obj[prop];
    obj[prop] = typeof val == "function" ? val(orig) : val;
    unload(function() obj[prop] = orig, window);
  }

  return {
    async: async,
    change: change,
  };
}

// TODO : add 'convert to teamforge url' functionality
/*function toTeamForgeUrl(query, from) {
  // Replace the #tag or @user with a url + referral code
  let path = encodeURIComponent(query).
    replace(/^%23/, "search/%23").replace(/^%40/, "");
  return getTeamForgeBase(path, from);
}*/

// TODO : Add functionality to find teamforge like queries
// Check if a query is a teamforge-like input
/*function teamForgeLike(query) {
  return query.search(/^[@#][^ ]*$/) == 0;
}*/
