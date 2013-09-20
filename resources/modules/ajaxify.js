/* TODO: Comment/document this module */
({
    /* TODO: Fillout more performs, key = regex path, value = ajaxClass with setup. */
    ajaxPerform: {
        'gym\\.php':new ajaxClass().tornJS('/js/gym1.js').ajaxFunc('initGymExp'),
        'managerooms\\.php':new ajaxClass().localJS('manage-chat-rooms').tornJS('/js/jquery.tokeninput.js').ajaxFunc('manageChatRooms'),
        "factions\\.php\\?step=your&action=armoury":new ajaxClass().tornCSS('/css/lightbox.css').ajaxFunc('fancyBox'),
        "shops\\.php\\?step=":new ajaxClass().tornCSS('/css/lightbox.css').ajaxFunc('fancyBox'),
        '.*':new ajaxClass().ajaxFunc('startCountdowns').ajaxFunc('animIconExpiring').ajaxFunc('animIconNew').ajaxFunc('enableTabs').ajaxFunc('tooltip').ajaxFunc('tornExtended',true),
        'profiles\\.php\\?':new ajaxClass().ajaxFunc('carousel'),
        'education\\.php$':new ajaxClass().ajaxFunc('educationTimer')
    },
    
    ajaxify: new Func('Ajaxify',
        function(){
            var that = this;
            appAPI.resources.includeJS('jquery/jquery.history.js');
            appAPI.dom.addInlineJS(appAPI.resources.get('jquery/jquery.fancybox.pack.js'));
            appAPI.dom.addInlineCSS(appAPI.resources.get('jquery/jquery.fancybox.css'));
            appAPI.dom.addInlineJS("("+this.module.extraScripts.toString()+")()");
            appAPI.dom.addInlineJS("("+this.module.ajaxEmbed.toString()+")()");

            var scriptsHead = $('body').find('script');
            $('body').find('script').remove();
            scriptsHead.each(function(){
                var scr = $(this).text();
                if(scr.indexOf('window.setInterval') == -1) {
                    appAPI.dom.addInlineJS(scr);
                }
            });

            var content = $('<div class="tornpluscontent"></div>');
            var objs = $(document).find('div').filter(function(i,v) { return $(v).parent().is('body'); }).find('script').remove().end();
            $('body').append(content);
            objs.appendTo(content);

            $(document).on('click','a[href][href!=""]:not([href^="#"],.iframe,.fancybox-close)',function(e) {
                if(!e.ctrlKey) {
                    that.module.ajax($(this).attr('href'));
                    return false;
                }
            });

            $(document).on('submit','form',function(e){
                e.preventDefault();
                var submitBtn = $(this).find('input[type="submit"]:first'),
                submitName = submitBtn.attr('name'),
                submitBtnData = [];
                if(submitName != undefined)
                    submitBtnData.push({name:submitName,value:submitBtn.val()});
                that.module.ajaxForm($(this),submitBtnData);
            });

            Script.fromPageCallback('ajaxSubmit',function(value) {
                var form = $('#'+value);
                if(form.size() == 0)
                    form = $('form[name="'+value + '"]');
                that.module.ajaxForm(form);
            });

            Script.fromPageCallback('gotoPage',function(value) {
                that.module.ajax(value);
            });

            History.Adapter.bind(window,'statechange',function(e){
                that.module.performAjax(History.getState().data);
            });
            this.module.hookNativeOnclicks($(document));
            this.module.performAjaxScripts(location.pathname + location.search,false);
        })
    .pages('allpages')
    .category('WIP')
    .desc('Ajaxify Torn makes page loading faster as it doesn\'t need to reload the entire page on each pageview.<br/>Chat no longer needs to reinitialize for every page, and can stay running while navigating. This makes Torn feel 2-3 times faster')
    .on('load')

    ,

    ajaxForm: function(form,additionalData) {
        var data = form.serializeArray();
        if(additionalData != undefined)
            jQuery.merge(data, additionalData);
        this.ajax(form.attr('action'),data,form.prop('method'));
    },
    hookNativeOnclicks: function(page) {
        page.find('[onclick]').each(function(){
                var onclick = $(this).attr('onclick');
                onclick = onclick.replace(/[a-z]*\.location(\.href)?\s?=\s?['"]?([\]\w!#$%&()*+,.\/:;<=>?@[\\`{|}~^\-]+)['"]?/g, "retrieve('gotoPage','$2')");
                onclick = onclick.replace(/([a-z]*?\.[^.]+?)\.submit\(\)/g, "retrieve('ajaxSubmit',$($1).attr('name'))");
                $(this).attr('onclick',onclick);
            });
    },
    delayPageFunction: function(func, wait) {
        var args =  [].slice.call(arguments, 2);
        return setTimeout(function(){
             appAPI.dom.callPageFunction("runAjaxFunctions.apply(null,["+args+"])");
        }, wait);
    },
    performAjaxScripts: function(page,isAjax) {
        if(page.indexOf('/') === 0) page = page.slice(1);
        var bucket = {};
        var ajaxPerform = this.ajaxPerform;
        for(var k in ajaxPerform) {
            var reg = new RegExp(k,'gi');
            if(reg.test(page)) {
                var v = ajaxPerform[k].buckets;
                for(var bk in v) {
                    if(typeof(bucket[bk]) == 'undefined') bucket[bk] = [];
                    for(var bkindex in v[bk]) {
                        bucket[bk].push(v[bk][bkindex]);
                    }
                }
            }
        }

        /* TODO: Make sure not to load resource already loaded.
           Implement Script.addXXXX where Script maintains knowledge about what is loaded (Like loadedModules)
        */
        var buck;
        if(typeof(bucket['tornCSS'])) {
            buck = bucket['tornCSS'];
            for(var k in buck) {
                appAPI.dom.addRemoteCSS(buck[k].value);
            }
        }

        if(typeof(bucket['localCSS'])) {
            buck = bucket['localCSS'];
            for(var k in buck) {
                appAPI.dom.addInlineCSS(appAPI.resources.get('torncss/'+buck[k].value+'.css'));
            }
        }

        if(typeof(bucket['tornJS'])) {
            buck = bucket['tornJS'];
            for(var k in buck) {
                appAPI.dom.addRemoteJS(buck[k].value);
            }
        }

        if(typeof(bucket['localJS'])) {
            buck = bucket['localJS'];
            for(var k in buck) {
                appAPI.dom.addInlineJS(appAPI.resources.get('tornjs/'+buck[k].value+'.js'));
            }
        }

        if(typeof(bucket['ajaxFunc'])) {
            buck = bucket['ajaxFunc'];
            for(var k in buck) {
                if(buck[k].onlyAjax){
                    if(isAjax) this.delayPageFunction('runAjaxFunctions',100,buck[k].value);
                } else
                    this.delayPageFunction('runAjaxFunctions',100,buck[k].value);
            }
        }
    },
    retrievedAjaxPage: function(data,page) {
        var html = Utils.createCleanBody(data);
        var title = html.find('title').text();

        html.find('script').remove();
        html.find('title').remove();
        html.find('meta').remove();
        html.find('link').each(function(){
            if(!$("link[href='"+$(this).attr('href')+"']").length)
                $(this).appendTo('head');
            else
                $(this).remove();
        });

        var pagebody = $("body");
        $.each(html.prop("attributes"), function() {  /* Clone body attributes from ajaxData to document body */
            pagebody.attr(this.name, this.value);
        });

        this.hookNativeOnclicks(html);
        $('html head title').text(title);
        $('.tornpluscontent').get(0).innerHTML = html.html();

        this.performAjaxScripts(page,true);
        Script.run(false);
    },
    performAjax: function(stateObj) {
        var that = this;
        $.extend(stateObj,{
           beforeSend: function ( xhr ) {
                xhr.overrideMimeType("text/plain; charset=Windows-1252");
            }
        });
        $.ajax(stateObj).done(function(data) { that.retrievedAjaxPage.call(that,data,stateObj.url); });
    },
    ajax: function(page, data, method) {
        method = (method || 'GET').toUpperCase();
        if(data != undefined && method == 'GET') {
            var params = $.param(data);
            if(params != '') {
                if(page.indexOf('?') > -1) {
                    page += '&';
                } else {
                    page += '?';
                }

                page += params;
                data = {};
            }
        }
        data = data || {};

        var stateObj = {
            url:page,
            async: false,
            type: method,
            data: data,
            timestamp: new Date().getTime()
        };
        History.pushState(stateObj, null, page);
    },
    ajaxEmbed: function() {
        runAjaxFunctions = function() {
            for(var i in arguments) {
                arguments[i].call(null);
            }
            return function(){};
        }
    },
    /* TODO: Fill out more scripts. These are scripts either from Torn, some with minor modifactions, or replica. */
    extraScripts: function() {
        increment = function(textboxID) {
            var textboxToChange = document.getElementById(textboxID);
            textboxToChange.value = (+textboxToChange.value + 1) || 0;
        };
        decrement = function(textboxID) {
            var textboxToChange = document.getElementById(textboxID);
            textboxToChange.value = Math.max(0, (textboxToChange.value - 1) || 0);
        };

        displayActionText = function(actionText){
	        if(actionText == ''){
		        jQuery('.actions_header').html('What Would You Like To Do?');
            }
            else{
			    jQuery('.actions_header').html(actionText);
		    }
	    };

        setMoney = function(value) {
            document.getElementById('FtcMA').innerHTML = "$" + value;
        };

        enableTabs = function() {
            jQuery( "#tabs" ).tabs();
        };

        fancyBox = function() {
            $("a.inline").fancybox({
                    'type':'inline',
                    'autoSize':false,
                    'width': 500,
                    'height': 250,
                    'closeBtn': true,
                    'padding':0,
                    'openEffect':'none',
                    'closeEffect':'none',
                    'helpers' : { overlay : { css : {'background' : 'rgba(0, 0, 0, 0.55)'} } }
            });
            $("a.iframe").fancybox({
                    'type':'iframe',
                    'autoSize':false,
                    'width': 500,
                    'height': 250,
                    'closeBtn': true,
                    'padding':0,
                    'openEffect':'none',
                    'closeEffect':'none',
                    'helpers' : { overlay : { css : {'background' : 'rgba(0, 0, 0, 0.55)'} } }
            });
        }

        carousel = function() {
            if(jQuery('#carousel_ul li').size() > 1){
                jQuery('#carousel_ul li:first').before(jQuery('#carousel_ul li:last'));
                jQuery('#right_scroll img').click(function(){
                    var item_width = jQuery('#carousel_ul li').outerWidth() + 10;
                    var left_indent = parseInt(jQuery('#carousel_ul').css('left')) - item_width;
                    jQuery('#carousel_ul:not(:animated)').animate({'left' : left_indent},0,function(){
                        jQuery('#carousel_ul li:last').after(jQuery('#carousel_ul li:first'));
                        jQuery('#carousel_ul').css({'left' : '0px'});
                    });
                });

                jQuery('#left_scroll img').click(function(){
                    var item_width = jQuery('#carousel_ul li').outerWidth() + 10;
                    var left_indent = parseInt(jQuery('#carousel_ul').css('left')) + item_width;
                    jQuery('#carousel_ul:not(:animated)').animate({'left' : left_indent},0,function(){
                        jQuery('#carousel_ul li:first').before(jQuery('#carousel_ul li:last'));
                        jQuery('#carousel_ul').css({'left' : '0px'});
                    });


                });
            }
        }

        tornExtended = function() {
            if(typeof(cyberdudeScript) != 'undefined') {
                cyberdudeScript(); //Trigger Torn Extended script.
            }
        }

        educationTimer = function() {
            var testDays = [];
            $('b noscript').text().split(',').forEach(function(v) {
                var t = v.trim().split(' ');
                if(t[1] == 'hours') testDays.push('+' + t[0] + 'h')
                else if(t[1] == 'minutes') testDays.push('+' + t[0] + 'm')
                else if(t[1] == 'seconds') testDays.push('+' + t[0] + 's')
            });
            $('#theCounter').countdown({
                until: testDays.join(' '),
                expiryUrl: 'http://www.torn.com/education.php',
                format: 'dhms',
                labels: ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'],
                labels1: ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'],
                layout: '{d<}{dn} {dl},{d>} {h<}{hn} {hl},{h>} {m<}{mn} {ml} and{m>} {sn} {sl}'
            });
        }
    }
})
