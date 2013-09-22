appAPI.ready(function($) {
    appAPI.browserAction.setResourceIcon('images/tornplus.png');    
    appAPI.browserAction.setTitle('Torn Plus');
    
    appAPI.browserAction.setPopup({
        resourcePath:'popup/popup.html',
        width: 700,
        height: 600
    });
    /* getActive only supported on Chrome currently
        setActive only supported on FF and Chrome currently
        ETA for these two is said to within 1 month (Which is almost up).
        Thus currently code underneath is disabled until these two issue is cleared by Crossrider
    */
    /*      
    appAPI.tabs.getActive(function(tabInfo){
        curIsTorn = (tabInfo.tabUrl.indexOf('www.torn.com') != -1);
    });
    
    if(!curIsTorn)
    {
        var found = false;
        appAPI.tabs.getAllTabs(function(tabs){
            for (var i=0; i<tabs.length; i++) {
                if(tabs[i].tabUrl.indexOf('www.torn.com') != -1) {
        	       found = true;
                   appAPI.tabs.setActive(tabs[i].tabId);
                   break;
                }
        	}
            
        });
        if(!found) appAPI.tabs.create('http://www.torn.com');
    }
    else
    {
        appAPI.browserAction.onClick(function(){
                appAPI.browserAction.setPopup({
                        resourcePath:'popup/popup.html',
                        width: 700,
                        height: 600
                });
        });
    }
    */
});