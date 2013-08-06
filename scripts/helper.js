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

const TEAMFORGE_ICON = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZpPgAAAAAAAAAAAAZpPhGGqT5dRml%2BYgZq%2FlJAAAAACFw8S8hcPEuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGaT4Ahql%2BVYZpPj%2FGqX5%2Fxml%2BaYdiPVeIW3xkiBx8vkgc%2FP%2FH3XzNAAAAAAeg%2FMAAAAAAAAAAAAapfkAAAAAABql%2BbsZpPj%2FGaT4%2Fxmk%2BP8ZpvmjIG%2Fy0CB18%2F8gd%2FL%2FH3nz%2Fx968%2FUeffRWAAAAAAAAAAAAAAAAAAAAABmk%2BKoapfn%2FGqX5%2Fxmk%2BP4apfn%2FGaX5%2Fx5%2F9JIfe%2FP%2FHnz0%2Fx5%2F9P8egPT%2BHoL09R6E9BsAAAAAAAAAABql%2BVkZpPj%2FGqX5%2Fhqk%2Bf4Zpfj%2FGaT40xqk%2BEodhfUuH4Dz%2Fx6C9P8ehPT%2BHob0%2Fx6H9P8difXPAAAAAAAAAAAZpfi%2FGqX4%2Fhmk%2Bf8ZpPn%2FGaP5lAAAAAAAAAAAAAAAAB2F9cgdhfRkHYn1%2Bx2L9f8cjfb%2BHY%2F2%2FxyQ9i4AAAAAGaT58hmj%2Bf8aofj%2BGp%2F44Bqf%2BAoAAAAAGaT5AAAAAAAdifUUAAAAAB2P9WsdkPb%2FG5P2%2FxyU9v8clfZ0AAAAABqf9%2F8anfj%2FG5v4%2FxuZ97kAAAAAAAAAAAAAAAAdivYAAAAAAB2M9gAblfceG5b2%2FxuY9%2F8bmff%2FGpv4kgAAAAAbmvj%2FHJf2%2FxyW9v8clPe3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGpv4Ixqb%2BP8anfj%2FGp%2F4%2Fxqg%2BI8AAAAAG5T38hyS9%2F8ckPb%2BHI724huQ9wUdifQaHon1AQAAAAAapPkAAAAAABqg%2BJgaofj%2FGqP4%2Fxmk%2Bf8ZpPloAAAAAB2O9b4djfX%2BHYv1%2Fx6J9f8dhvRyHoX0xh6E9AsAAAAAGqX5ABqk%2BVYZpPj%2FGaX4%2Fhml%2BP8apPn%2FGqX5HAAAAAAdifVaHof1%2Fx2G9f4eg%2FX%2BHoL0%2Fx6A9P8effR1Gaf5cxmk%2BM4Zpfj8GqX5%2Fhqk%2Bf8ZpPj%2FGaT4mQAAAAAAAAAAAAAAAB6C9LgfgPT%2FH37z%2Fh998%2F8fevP%2FIHjy%2Bhml%2BZ4apfn%2FGaT4%2Fhql%2Bf4apfn%2FGqX54Bql%2BQQapfkAAAAAAAAAAAAfffMHHnrzxR958%2F8fd%2FP%2BH3Xz%2FyBz8%2F8dh%2FSWGaT4%2Fxql%2Bf4ZpPj%2FGaT46xmk%2BBAAAAAAGaT4AAAAAAAAAAAAAAAAAAAAAAAgc%2FL%2BIHLyzSB48rMdifWrGp74ohmk%2BP8apfneGqX5iBql%2BQEAAAAAGqX5AAAAAAAAAAAAAAAAAAAAAAAgb%2FENIXDyBAAAAAAapfkFGqX5MRmk%2BDcapfkKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2F38AAPiPAADgBwAAwAMAAMGBAACDoQAAh%2FEAAIfwAACH8AAAh%2BEAAIXhAADBgQAAwAMAAOAHAADwDwAA%2F%2F8AAA%3D%3D";

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
