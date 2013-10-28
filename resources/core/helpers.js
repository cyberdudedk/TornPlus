
/* Utils contains general Javascript functions usable several places */
Utils = {
    number: function(str) {
        var m;
        if(str == undefined) return undefined;
        if(typeof(str) == 'number') return str;
        if((m = str.match(/^[\s\S]*?\$?(([\d]*?,?)*[\d]*?[.]?[\d]+)[^\d]*?$/m)) == undefined) return undefined;
        return Number(m[1].replace(/,/g,'')); //Extract integer or float value
    },
    tornNumber: function(num,dec) {
        return Utils.addThousands(Utils.round(num,dec));
    },
    round: function(n,dec) {
        n = parseFloat(n);
        if(!isNaN(n)){
            if(!dec) var dec= 0;
            var factor= Math.pow(10,dec);
            return Math.floor(n*factor+((n*factor*10)%10>=5?1:0))/factor;
        }else{
            return n;
        }
    },
    addThousands: function(num)
    {
        var numStr = num + "";
        var neg = false;
        if(numStr.indexOf('-') == 0) {
            neg = true;
            numStr = numStr.substring(1);
        }

        var spl = numStr.split('.');
        var nt = spl[0];
        var nmod = ((nt.length-1) % 3)+1;
        return (neg ? '-' : '') + nt.substring(0,nmod) + (nmod != nt.length ? ',' + nt.substring(nmod).match(/.{3}/g).join(',') : '') + (spl[1] ? '.' + spl[1] : '');
    },
    percent: function(value, divisor) {
        return ((value / divisor)*100).toFixed(2) + "%";
    },
    querystringToObject: function(query, emptyAsNull) {
        if (query == '' || typeof(query) == 'undefined') {
            if(typeof(emptyAsNull) == 'undefined' || emptyAsNull == false) return {};
            else return null;
        }
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
        var doc = document.implementation.createHTMLDocument('');
        /* Get body tag and attributes, for reapplying afterwards. */
        var bodyAttrs = {};
        result = /<body ?(.*?)>/ig.exec(html);
        if(result != null) {

            result.forEach(function(v,i){
                if(i > 0 && v != '')  {
                    var spl = v.split('=');
                    bodyAttrs[spl[0]] = spl[1].replace(/"/g,'');
                }
            });
        }
        /* Loads entire document, with head, etc. Doesn't work in FF :( */
        //doc.open(); //doc.write(html); //doc.close();

        /* Fix for getting a Body, but head and body attributes is stripped out :( */
        doc.body.innerHTML = html;

        /* Reapplying body attributes */
        var $bod = $(doc.body);
        for(var key in bodyAttrs) {
            $bod.attr(key,bodyAttrs[key]);
        }

        return $bod;
    },
    getCleanHtml: function(html)
    {
        html = Utils.createCleanBody(html);
        /* Removes Src from Imgs to stop the browser from loading the images, and puts the src as origSrc.
           jQuery "extension" to override attr('src') request is included in project */
        html.find('img').each(function(){
            $(this).attr('origsrc',$(this).attr('src'));
            $(this).attr('src','');
        });
        html.find('script').remove();
        return html;
    },
    endsWith: function(str,suffix) {
        return str.toString().indexOf(suffix, str.toString().length - suffix.length) !== -1;
    },
    br2nl: function (str) {
        return str.replace(/<br\s*\/?>/mg,"\n");
    },
    getFullTimestamp: function()
    {
        return Math.round(+new Date());
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
    },
    postPageSync: function(url, postData) {
        $.ajax({url:url,type:'POST',async:false,data:postData,success:function(data){
            page = new TornAPI(Utils.getCleanHtml(data));
        }});
        return page;
    },
    notice: function(msg,type) {
        if(typeof(type) == 'undefined') type = 'info';
        $('#noticebar').addClass('show');
        if(!noticeIds[type]) {
            noticeIds[type] = {};
        }
        var ts;
        if(!noticeIds[type][msg]) {
            ts = Utils.getFullTimestamp();
            noticeIds[type][msg] = ts;
            noticeCounts[ts] = 1;
            var msgObj = $('<div id="noticemsg_'+ts+'" class="noticemsg '+type+'"><span class="noticecount"></span>'+msg+'</div>');
            $('#noticebar').append(msgObj);
        } else {
            ts = noticeIds[type][msg];
            noticeCounts[ts]+=1;
            $('#noticemsg_' + ts + ' .noticecount').text(noticeCounts[ts] + 'x ');
        }

        Helpers.runNoticeTimer();
    },
    runNoticeTimer: function() {
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(function(){
            noticeIds = {};
            noticeCounts = {};
            $('#noticebar').html('');
            $('#noticebar').removeClass('show');
        },5000);
    },
    rebuildNotices: function(storedMessages) {

        var noticeIds = storedMessages['noticeIds'];
        var noticeCounts = storedMessages['noticeCounts'];
        var show = false;
        for(var noticeCat in noticeIds) {
            for(var noticeMsg in noticeIds[noticeCat]) {
                var id = noticeIds[noticeCat][noticeMsg];
                var num = noticeCounts[id];
                var msgObj = $('<div id="noticemsg_'+id+'" class="noticemsg '+noticeCat+'"><span class="noticecount"></span>'+noticeMsg+'</div>');
                if(num > 1) {
                    msgObj.find('.noticecount').text(num + 'x ');
                }
                $('#noticebar').append(msgObj);
                show = true;
            }
        }
        if(show) {
            $('#noticebar').addClass('show');
            Helpers.runNoticeTimer();
        }
        
    },

    reload: function() {
        var obj = {noticeIds:noticeIds, noticeCounts: noticeCounts};
        Script.setValueRefresh('noticemessages',obj);

        Helpers.reloadPage();
    },

    reloadPage: function() {
        location.reload();
    }


};


/* small jQuery extensions */
jQuery.fn.textOnly = function() {
    return $(this).clone().children().remove().end().text();
};

(function(){
    /* jQuery "extension" to override attr('src') request, to check for origsrc */
    var originalAttrMethod = jQuery.fn.attr;
    jQuery.fn.attr = function(){
        if(arguments.length == 1 && arguments[0] == 'src') {
            var val = originalAttrMethod.apply( this, ['origsrc'] );
            if(typeof(val) == 'undefined' || val === false){
                val = originalAttrMethod.apply( this, ['src'] );
            }

            return val;
        } else
            return originalAttrMethod.apply( this, arguments );
    }
})();

jQuery.fn.enableImgs = function() {
    $(this).find('img').each(function(){
        $(this).attr('src',$(this).attr('origsrc'));
    });
    return $(this);
}