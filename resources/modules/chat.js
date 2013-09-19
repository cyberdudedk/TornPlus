/*
* TODO: more chat commands
* Font family?
* Special commands? (Noicons, etc)
* */
/* Format:
* BBCode: [{BBCODE}]CONTENT[/{BBCODE}]
* BBCode: [{BBCODE}={DATA}]CONTENT[/{BBCODE}]
* Binary: {xSTARTCOMMAND}{xCOMMAND}{xSTARTCONTENT}CONTENT{xENDCONTENT}
* Binary: {xSTARTCOMMAND}{xCOMMAND}{xDATA}*{xSTARTCONTENT}CONTENT{xENDCONTENT}
* Binary: {x01}{xCOMMAND}{x02}CONTENT{x03}
* Binary: {x01}{xCOMMAND}{xDATA}*{x02}CONTENT{x03}
* */

/*
1 -> 8 = 8, special commands
1 Span start (start)
2 Span start (end)
3 Span end
4 /noicons, (collect /noicons, /noformat /noformaticons into 1 with sub value/arg?) 'TODO: implement
5 /noformat 'TODO: implement
6 /noformaticons 'TODO: implement
7
8

12 //Signal TornPlus chat enabled on this message by this user? If this flag is not there, ignore.

14 -> 29 = 16, 16bit code, 16 single color, or 6x16 = hex color, 2*16 bit = 255 ascii. Can convert into ascii string if needed.
14 0
15 1
16 2
17 3
18 4
19 5
20 6
21 7
22 8
23 9
24 10
25 11
26 12
27 13
28 14
29 15

128->159 = 32, commands
128 0 Style
129 1 Color
130 2 BgColor
131 3 Size
*/

/* Hook onMessageRecieved to allow ignore.
* var orig = chatServer.callbacks_['onMessageReceived'];
chatServer.callbacks_['onMessageReceived'] = [];
chatServer.onMessageReceived(function(){
var args = arguments;
if(args[3] == '1613175') return;
    jQuery.each(orig, function (a, c) {
      c.apply(void 0, args)
    })
})


* */

({

    hookCallbacks: [],
    hookedChat: false,
    hookChat: function(callback) {
        this.hookCallbacks.push(callback);
        var that = this;
        if(this.hookedChat == false) {
            this.hookedChat = true;
            Script.fromPage('chatServer',
                function(channel) {
                    var hookChatTimer = setInterval(function(){
                        if(typeof(chatServer) != 'undefined') {
                            clearInterval(hookChatTimer);
                            chatServer.onMessageReceived(function() {
                                retrieve(channel,arguments);
                            });
                        }
                    },10);
                },
                function(data) {
                    if(data != undefined) {
                        that.hookCallbacks.forEach(function(clback) {
                            clback.call(that,data);
                        });
                    }
                });
        }
    },

    clicklinks: new Func('Clickable links', function(){
        var replaced;
        var linkify = this.module.Helpers.linkify.html;

        var perform = function() {
            curhtml = $(this).html();
            replaced = linkify(curhtml);
            if(curhtml != replaced) {
                $(this).html(replaced);
            }
        }

        this.module.hookChat(function(data) {
            perform.call($('#'+data[0]));
        });

        $('.message').each(function(){
            perform.call(this);
        })
    })
    .category('Chat')
    .desc('Turn urls into clickable links')
    .pages('allpages')
    ,

    newline: new Func('Allow newlines',function() {
        var replaced;
        var perform = function() {
            curhtml = $(this).html();
            replaced = curhtml.replace(/\n/g,'<br>');
            if(curhtml != replaced) {
                $(this).html(replaced);
            }
        }

        this.module.hookChat(function(data) {
            perform.call($('#'+data[0]));
        });

        $('.message').each(function(){
            perform.call(this);
        });
    })
    .category('Chat')
    .desc('Allow newlines')
    .pages('allpages')


    ,
    emoticons: new Func('Emoticons', function() {
        /* List of smiley names */
        /*
        smile
        laughing
        angry
        blushing
        thumbsup
        music
        kiss
        blink
        upsidedown
        surprised
        undecided
        ninja
        thumbsdown
        nuclear
        rose
        schock
        sarcastic
        alien
        beer
        ffinger
        heart
        clown
        tongue
        frown
        worried
        devil
        question
        cigarette
        wow
        cool
        confused
        cry
        pirate
        xbox
        coffee
        dogpoo
        biggrin
        coolcig
        evil
        sidehappy
        weirdo
        right
        coke
        cat
        bigsmile
        embarrassed
        mad
        whistling
        nerd
        sick
        movie
        pepsi
        brokenheart
*/
        var mapObj = {
            ':)':"smile",
            ':d':"laughing",
            ':s':"worried",
            '<3':'heart',
            ':@':'devil',
            '(r)':'rose',
            '@-/--':'rose',
            ':o':'surprised',
            ';)':'blink',
            '(u)':'thumbsup',
            '</3':'brokenheart',
            '8)':'cool',
            ':p':'tongue',
            ':(':'frown',
            'xd':'xd',
            ':|':'undecided',
            //':/':'undecided', /* Does not play well with urls, probably needs some kind of check to make sure it's not in a url, maybe we need some kind of order these are performed in */
            ':s':'confused',
            ":'(":'cry',
            'o.o':'shock'
            // TODO: more

        };

        var replaced;
        Script.loadCSS('chat');
        var regStr = Object.keys(mapObj).join('\n').replace(/\(/g,'\\(').replace(/\)/g,'\\)').replace(/\./g,'\\.').replace(/\|/g,'\\|').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'|');
        var re = new RegExp(regStr,"gi");
        
        var perform = function() {
            curhtml = $(this).html();
            replaced = curhtml.replace(re, function(matched){
                matched =  $("<div />").html(matched).text();
                return '<span title="'+matched+'" class="emoticon '+mapObj[matched.toLowerCase()]+'">&nbsp;</span>';
            });
            if(curhtml != replaced) {
                $(this).html(replaced);
            }
        }

        this.module.hookChat(function(data) {
            perform.call($('#'+data[0]));
        });

        $('.message').each(function(){
            perform.call(this);
        });
    })
    .category('Chat')
    .desc('Enable classic emoticons')
    .pages('allpages')

    ,

    commands: new Func('Use commands',function() {
        var replaced;
        var that = this;
        Script.loadCSS('chat');

        var perform = function() {
            if(that.Me) {
                var msg = $(this).textOnly().trim();
                if(msg.slice(0, 4) == '/me ') {
                    msg = msg.slice(4);
                    var name = $('b:first a:first',this).text();
                    replaced = '<span class="chatcommands me">'+name + ' ' + msg +'</span>';
                    $(this).html(replaced);
                }
            }
        }

        this.module.hookChat(function(data) {
            perform.call($('#'+data[0]));
        });

        $('.message').each(function(){
            perform.call(this);
        });

    })
    .category('Chat')
    .desc('Enables commands')
    .pages('allpages')
    .option('Me','boolean',false)

    ,

    pluschat: new Func('Plus Chat',function() {
        var that = this;
        Script.loadCSS('chat');

        var enums = Script.getModule('chat').Helpers.enums.flags;
        var stylish = Script.getModule('chat').Helpers.stylish;
        var bb = Script.getModule('chat').Helpers.bbcode;

        var regex = /\x01([\x80-\x9F])([\x0E-\x1D]*?)\x02(.*?)\x03/m;
        var bbregex = /\[(.*?)=?(.*?)\](.*?)\[\/\1\]/m

        appAPI.dom.addInlineJS("function unbindChatBox(){ $('.chatboxtextarea').addClass('eventsRemoved').unbind('keydown'); }");

        var code = function(id) {
            var values = id;
            if(arguments.length > 1)
                values = Array.prototype.slice.call(arguments);
            if($.isArray(values)) {
                var str = '';
                for(var i in values)
                    str += String.fromCharCode(values[i]);
                return str;
            }
            else
                return String.fromCharCode(values);
        }

        var hookedChatBoxfunction = function() {
            $('.chatboxtextarea').keydown(function(e) {
                if(e.which==13&&e.shiftKey==0) {
                    e.preventDefault();
                    var id = $(this).parent().parent().attr('id').slice(8);
                    var text = $(this).val().replace(/^\s+|\s+$/g, "");
                    $(this).val("").css("height", "44px").css("overflow", "hidden");

                    text = code(enums.TORNPLUS) + text;
                    while(text.match(bbregex) != undefined) {
                        text = text.replace(bbregex,function(m,tag,tagvalue,content) {
                            var codes = [enums.STARTCOMMAND];
                            var bbret = bb(tag,tagvalue);
                            if(typeof(bbret.key) != 'undefined') {
                                codes.push(bbret.key+128); //Add base of 128 to Key
                                for(var a in bbret.args) {
                                    codes.push(Number(bbret.args[a])+14); //Add base of 14 to data values
                                }
                                codes.push(enums.STARTCONTENT);
                                var ret = code(codes) + content + code(enums.ENDCOMMAND);
                                return ret;
                            } else
                                return m2;
                        });
                    }
                    if(text != "")
                    {
                        var lasttext = text.replace(/'/g,"\\'").replace(/\n/g,'<br>').replace(/"/g,'\\"');
                        var jsstr = 'chatServer.sendMessage("' + lasttext + '".replace(/<br>/g,"\\n"), "' + id + '")';
                        appAPI.dom.addInlineJS(jsstr);
                    }

                }
            });
        }

        var waitForEvents = setInterval(
            function() {
                if($('.chatboxtextarea').hasClass('eventsRemoved')) {
                    clearInterval(waitForEvents);
                    hookedChatBoxfunction();
                }
                else
                    appAPI.dom.callPageFunction('unbindChatBox');
            },200);


        var perform = function() {
            var msg = $(this).textOnly().slice(1);
            if(msg.charCodeAt(0) == enums.TORNPLUS)  {
                msg = msg.slice(1);
                var name = $(this).find('b:first');
                var replaced = msg;
                while(replaced.match(regex) != undefined) {
                    replaced = replaced.replace(regex, function(m,m1,m2,m3) {
                        var type = m1.charCodeAt(0)-128;
                        var args = [];
                        for ( var i = 0; i < m2.length; i++ )
                        {
                            args.push(m2.charCodeAt(i)-14);
                        }
                        return '<span style="'+stylish.call(that,type,args)+'">'+m3+'</span>';
                    });
                }

                if(msg != replaced) {
                    $(this).html(name.html() + ' ' + replaced);
                }
            }
        };

        this.module.hookChat(function(data) {
            perform.call($('#'+data[0]));
        });

        $('.message').each(function(){
            perform.call(this);
        });
    })
    .category('Chat')
    .desc('Enables Colors, Styles, etc')
    .pages('allpages')
    .option('Colors','boolean',false)
    .option('Backgroundcolor','boolean',false)
    .option('Styles','boolean',false)
    .option('Font','boolean',false)
    .option('Size','boolean',false)

    ,

    Helpers: {
        /* [12] TornPlusChat, [1-8] special commands, [128-159] commands, [14-29] data values */
        /* 16 data values availabe */
        /* 32 command slots available */
        /* 9 flags slots available */
        /* These enums are without base (128 for commands and 14 for data values) */
        enums: {
            flags: {
                TORNPLUS: 12,
                STARTCOMMAND: 1,
                STARTCONTENT: 2,
                ENDCOMMAND: 3
            },
            commands: {
                STYLE:0,
                COLOR:1,
                BGCOLOR:2,
                SIZE:3
            },
            style: {
                BOLD:0,
                ITALIC:1,
                STRIKETHROUGH:2,
                UNDERLINE:3
            },
            colors: {
                id: {
                    0:'black',
                    1:'navy',
                    2:'green',
                    3:'teal',
                    4:'maroon',
                    5:'purple',
                    6:'olive',
                    7:'silver',
                    8:'gray',
                    9:'blue',
                    10:'lime',
                    11:'aqua',
                    12:'red',
                    13:'fuchsia',
                    14:'yellow',
                    15:'white'
                },
                name: {
                    'black':0,
                    'navy':1,
                    'green':2,
                    'teal':3,
                    'maroon':4,
                    'purple':5,
                    'olive':6,
                    'silver':7,
                    'gray':8,
                    'grey':8,
                    'blue':9,
                    'lime':10,
                    'aqua':11,
                    'red':12,
                    'fuchsia':13,
                    'magenta':13,
                    'yellow':14,
                    'white':15
                }
            }
        },
        hex: function(args) {
            var str = '';
            for(var i in args) {
                str += args[i].toString(16);
            }
            return str;
        },
        isPositiveInt: function(n) {
            return n >>> 0 === parseFloat(n);
        },
        hexToCode: function(value) {
            var code = [];
            for(var i in value.split('')) {
                code.push(parseInt(value[i],16))
            }
            return code;
        },
        bbcode: function(type,value) {
            var key;
            var args = [];
            var helpers = Script.getModule('chat').Helpers;
            var enums = helpers.enums;

            switch(type.toLowerCase()) {
                case 'b':
                case 'strong':
                    key = enums.commands.STYLE;
                    args = [enums.style.BOLD];
                break;
                case 'i':
                case 'italic':
                    key = enums.commands.STYLE;
                    args = [enums.style.ITALIC];
                break;
                case 's':
                    key = enums.commands.STYLE;
                    args = [enums.style.STRIKETHROUGH];
                break;
                case 'u':
                    key = enums.commands.STYLE;
                    args = [enums.style.UNDERLINE];
                break;
                case 'color':
                case 'colour':
                case 'c':
                    key = enums.commands.COLOR;
                    if(value.indexOf('#') == 0) {
                        args = helpers.hexToCode(value.slice(1));
                    } else if(helpers.isPositiveInt(value)) {
                        args = [value];
                    } else {
                        args = [helpers.enums.colors.name[value] || 0];
                    }
                break;
                case 'bgcolor':
                case 'bgcolour':
                case 'bg':
                    key = enums.commands.BGCOLOR;
                    if(value.indexOf('#') == 0) {
                        args = helpers.hexToCode(value.slice(1));
                    } else if(helpers.isPositiveInt(value)) {
                        args = [value];
                    } else {
                        args = [helpers.enums.colors.name[value] || 0];
                    }
                break;
                case 'size':
                    key = enums.commands.SIZE;
                    args = [value];
                break;
            }

            return {key:key,args:args};
        },
        stylish: function(type,args) {
            var values = {};
            var helpers = Script.getModule('chat').Helpers;
            var enums = helpers.enums;
            switch(type) {
                case enums.commands.STYLE:
                    if(this.Styles) {
                        switch(args[0]) {
                            case enums.style.BOLD:
                                values['font-weight'] = 'bold';
                            break;
                            case enums.style.ITALIC:
                                values['font-style'] = 'italic';
                            break;
                            case enums.style.STRIKETHROUGH:
                                values['text-decoration'] = 'line-through';
                            break;
                            case enums.style.UNDERLINE:
                                values['text-decoration'] = 'underline';
                            break;
                        }
                    }
                break;
                case enums.commands.COLOR:
                    if(this.Colors) {
                        if(args.length > 1) {
                            values['color'] = helpers.hex(args);
                        } else {
                            values['color'] = helpers.enums.colors.id[args[0]];
                        }
                    }
                break;
                case enums.commands.BGCOLOR:
                    if(this.Backgroundcolor) {
                        if(args.length > 1) {
                            values['background-color'] = helpers.hex(args);
                        } else {
                            values['background-color'] = helpers.enums.colors.id[args[0]];
                        }
                    }
                break;
                case enums.commands.SIZE:
                    if(this.Size) {
                        values['font-size'] = (args[0]+7) + 'px';
                    }
                break;
            }

            var str = '';
            for(var k in values) {
                var v = values[k];
                str += k + ':' + v + ';';
            }

            return str;
        },


        linkify: {
            section_html_pattern: /([^<]+(?:(?!<a\b)<[^<]*)*|(?:(?!<a\b)<[^<]*)+)|(<a\b[^>]*>[^<]*(?:(?!<\/a\b)<[^<]*)*<\/a\s*>)/ig,
            url_pattern: /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img,
            url_replace: '$1$4$7$10$13<a href="$2$5$8$11$14" target="_new" class="blueLink">$2$5$8$11$14</a>$3$6$9$12',
            html: function(text) {
                var linkify = Script.getModule('chat').Helpers.linkify;
                text = text.replace(/&amp;apos;/g, '&#39;'); // IE does not handle &apos; entity!
                return text.replace(linkify.section_html_pattern, function(m0, m1, m2) {
                    if (m2) return m2;
                    return linkify.text(m1,linkify);
                });
            },
            text: function(text/*, linkify reference */) {
                var linkify = (arguments.length > 1 ? arguments[1] : Script.getModule('chat').Helpers.linkify);
                return text.replace(linkify.url_pattern, linkify.url_replace);
            }
        }
    }
});