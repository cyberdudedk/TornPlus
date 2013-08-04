
/* Utils contains general Javascript functions usable several places */
Utils = {
    number: function(str) {
        if(str == undefined) return undefined;
        return Number(str.match(/^[\s\S]*?\$?(([\d]*?,?)*[\d]*?[.]?[\d]+)[^\d]*?$/m)[1].replace(/,/g,'')); //Extract integer or float value
    },
    querystringToObject: function(query) {
        if (query == '' || typeof(query) == 'undefined') return {};
        var obj = {};
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            var k = decodeURIComponent(pair[0]);
            var v = decodeURIComponent(pair[1]);
            if (typeof obj[k] === "undefined") {
                if (k.substr(k.length-2) != '[]') 
                    obj[k] = v;
                else
                    obj[k] = [v];
            } else if (typeof obj[k] === "string") {
                obj[k] = v;
            } else {
                obj[k].push(v);
            }
        } 
        return obj;
    },
    createCleanBody: function (html) 
    {
        var doc = document.implementation.createHTMLDocument('temp');
        doc.body.innerHTML = html;
        return doc.body;
    },
    getCleanHtml: function(html)
    {
        html = Utils.createCleanBody(html);
        $html = $(html);
        $html.find('img').attr('src','');
        return $html;
    },
    endsWith: function(str,suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

};



/* Helpers is extension specific functionality, mostly regarding CrossriderAPI or similar */
Helpers = {
    
    /* Get a cached value, if value have outlived it assigned TTL, get data from passed func, and store it with TTL.
        If data from passed func is undefined/null return the cached value that have outlived the TTL 
        (This can be caused by user being in a position where the data is not available, Jail, Hospital, traveling, etc) */
    cachedValue: function(key,func,TTL, forceset) {
        if(typeof(forceset) == 'undefined') forceset = false;
        var t, value;

        switch(TTL)
        {
            case 0: t = null; break;
            case 1: t = appAPI.time.minutesFromNow(10); break;
            case 2: t = appAPI.time.hoursFromNow(1); break;
            case 3: t = appAPI.time.hoursFromNow(24); break;
            case 4: t = appAPI.time.hoursFromNow(2); break;
            case 5: t = appAPI.time.daysFromNow(7); break;
            default: t = appAPI.time.hoursFromNow(24);
        }

        var valObj = Script.getValue('cache/' + key,t == null);

        if(valObj == undefined)
        {
            value = func();
            if(value != undefined) {
                Script.setValue('cache/' + key,{value:value,timestamp:t},t==null);
            }
        }
        else {
            if(new Date(valObj.timestamp) >= appAPI.time.now() && forceset == false) {
                value = valObj.value;
            }
            else {
                value = func();
                if(value != undefined) {
                    Script.setValue('cache/' + key,{value:value,timestamp:t},t==null);
                } else {
                    value = valObj.value;
                }
            }
        }
        
        return value;
    },
    /* XHR data from URL Async, pass it through TornAPI, and run callback passing on the API */
    getPage: function (url,callback) {
        var u = document.location.protocol.replace(/[:]/g,'') + "://www.torn.com/" + url;
        appAPI.request.get({url:u, onSuccess: function(data){
            callback(new TornAPI(Utils.getCleanHtml(data)));         
        }});
    },
    /* XHR data from URL Sync, pass it through TornAPI, and return the API */
    getPageSync: function (url, queryObject) {
        var page;
        if(url.match(/.*?\.php/) == null)
            url += ".php";
        if(queryObject != undefined)
            url = url + (url.match(/\?/) == null ? '?' : '&') + $.param(queryObject);
        
        $.ajax({url:url,async:false,success:function(data){
            page = new TornAPI(Utils.getCleanHtml(data));
        }});
        return page;
    }
};


/* small jQuery extensions */
jQuery.fn.textOnly = function() {
    return $(this).clone().children().remove().end().text();
};
