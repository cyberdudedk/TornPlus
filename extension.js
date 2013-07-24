/*
TODO List
- Reregister modules on new version/updated script
- Options page/panel to enable functions and set function options.
  Dynamically generated using the desc and options set on the module Functions.
- 
*/

/* Due to Crossrider's getFolderContent function only seeing files in the crossrider project, 
    and not files added in local debug mode, use this devFiles array to add modules added in local debug mode.
    Should be cleared when Crossrider source is updated.
 */
var devFiles = ["module3","dev"];


var $, Torn, cachedValue, getPage, getPageSync;

appAPI.ready(function(jq) {
    //return; /* Disable */

    /* Return/End script if not on a Torn page. */
    if (!appAPI.isMatchPages("*.torn.com/*")) return;
    if (appAPI.isMatchPages("*.torn.com/wiki/*")) return;
    
    $ = jq;
    this.onerror = function(e){error(e);};

    appAPI.resources.includeJS('core/script.js');
    appAPI.resources.includeJS('core/helpers.js');
    appAPI.resources.includeJS('core/classes.js');
    appAPI.resources.includeJS('api/api.js');
    
    /* For some (unknown) reason, calling includeJS function outside appAPI.ready scope crashes it.*/
    /* So this is a hack */
    Script.loadModule = function(mod) {
        appAPI.resources.includeJS('modules/'+mod+'.js');
        this.loadedModules[mod] = true;
    }
    
    /* Loading an instance of the API with body as content */
    Torn = new TornAPI(document.body);

    /* Creating easy "shorthands" for some of the helper methods being used often, maybe not a good idea? */
    cachedValue = Helpers.cachedValue;
    getPage = Helpers.getPage;
    getPageSync = Helpers.getPageSync;
    
    /* Use this to test collecting all cache from scratch */
    //Script.clearCache();
    //Script.clearStorage();

    /* Use when debugging, will reregister all modules on each pageview */
    Script.forceRegisterAll = true;
    
    /* RUN FOREST RUN!!! */ 
    Script.run();
});






/***** Some debug functionality *********/

/* Shorthand for debug */

log = function(msg) {
    console.debug(msg);
}
error = function(msg) {
    console.debug('Error: ' + msg);
}

/* In Firefox send debug info to Firebug console instead of Firefox Error Console (Ctrl+Shift+J) */
if (appAPI.browser.name == "firefox") {
  console = { 
    log: function(m) { 
        try { unsafeWindow.console.log(m); } 
        catch(e) { alert(m); } 
    },
    warn: function(m) { 
        try { unsafeWindow.console.warn(m); } 
        catch(e) { alert(m); } 
    },
    error: function(m) { 
        try { unsafeWindow.console.error(m); } 
        catch(e) { alert(m); } 
    },
    info: function(m) { 
        try { unsafeWindow.console.info(m); } 
        catch(e) { alert(m); } 
    },
    debug: function(m) { 
        try { unsafeWindow.console.debug(m); } 
        catch(e) { alert(m); } 
    }
  }  
}