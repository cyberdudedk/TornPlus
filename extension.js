/*
TODO List
- Reregister modules on new version/updated script
*/

/* Due to Crossrider's getFolderContent function only seeing files in the crossrider project, 
    and not files added in local debug mode, use this devFiles array to add modules added in local debug mode.
    Should be cleared when Crossrider source is updated.
 */

/* Short term TODO List
*
* */
var devFiles = ['chat','ajaxify'];

var $, Torn, cachedValue, getPage, getPageSync;

appAPI.ready(function(jq) {
    //return; /* Disable */

    /* Return/End script if not on a Torn page, or one of Torn's login pages. */
    if (!appAPI.isMatchPages("*.torn.com/*")) return;
    if (appAPI.isMatchPages("*.torn.com/wiki/*")) return;
    if (appAPI.isMatchPages("*.torn.com$")) return;
    if (appAPI.isMatchPages("*.torn.com/login")) return;

    $ = jq;
    this.onerror = function(e){error(e);};

    /* TODO: Move all these includes to Script init? */
    appAPI.resources.includeJS('core/script.js');
    appAPI.resources.includeJS('core/helpers.js');
    appAPI.resources.includeJS('core/classes.js');
    appAPI.resources.includeJS('api/api.js');
    appAPI.dom.addInlineJS(appAPI.resources.get('crossrider/CrossriderAPI.js'));

    Script.init();

    /* Message listner for communication with background and popup scope */
    appAPI.message.addListener(function(msg){
        switch(msg.action) {
            case 'getUserId':
                appAPI.message.toPopup({action:'giveUserId',id:Script.getUser()});
            break;
        }
    });

    /* Loading an instance of the API with body as content */
    Torn = new TornAPI(document.body);

    /* Creating easy "shorthands" for some of the helper methods being used often, maybe not a good idea? */
    cachedValue = Helpers.cachedValue;
    getPage = Helpers.getPage;
    getPageSync = Helpers.getPageSync;

    //Script.Dev.loadBackground();
    /* Use this to test collecting all cache from scratch */
    //Script.clearCache();
    //Script.clearStorage();

    /* Use when debugging, will reregister all modules on each pageview */
    Script.forceRegisterAll = true;

    var id = Script.getUser();
    //Only run when we can get the user id
    if(id != null) {
        /* RUN FOREST RUN!!! */
        Script.run(true);
    }

});






/***** Some debug functionality *********/

/* Shorthand for debug */
log = function(msg) {
    console.debug.apply(console,arguments);
}
error = function(msg) {
    arguments[0] = 'Error: ' + arguments[0];
    console.debug.apply(console,arguments);
}

/* In Firefox send debug info to Firebug console instead of Firefox Error Console (Ctrl+Shift+J) */
if (appAPI.browser.name == "firefox") {
  console = { 
    log: function(msg) {
        try { unsafeWindow.console.log.apply(console,arguments); }
        catch(e) { alert(msg); }
    },
    warn: function(msg) {
        try { unsafeWindow.console.warn.apply(console,arguments); }
        catch(e) { alert(msg); }
    },
    error: function(msg) {
        try { unsafeWindow.console.error.apply(console,arguments); }
        catch(e) { alert(msg); }
    },
    info: function(msg) {
        try { unsafeWindow.console.info.apply(console,arguments); }
        catch(e) { alert(msg); }
    },
    debug: function(msg) {
        try { unsafeWindow.console.debug.apply(console,arguments); }
        catch(e) { alert(msg); }
    }
  }  
}