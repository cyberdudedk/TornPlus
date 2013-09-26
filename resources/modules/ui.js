({
    hideupgradelink: new Func("Hide upgrade link", function(){
        $('a[href*="level2.php"]').each(function(){
            var par = $(this).parent();
            $(this).remove();
            if(par.attr('id') == 'noteBox') {
                var spl = par.html().split('!');
                spl.splice(2,1);
                par.html(spl.join('!'));
            }
        });
    })
    .category('UI')
    .desc("Hide Level upgrade link, so you can't accidentally click it.<br>Good for level holding")
    .pages('allpages')
    ,
    autoupgradelevel: new Func("Auto upgrade level", function(){
            var levelA = $('a[href*="level2.php"]');
            if(levelA.size() > 0)
            {
                href = levelA.attr('href') + "&confirm=1";
                $.ajax({url:href, async:false, success:function(data){ //TODO: Move $.ajax to Script.XXXX function
                    window.location.reload(true); //TODO: Support ajaxify
                }});
            }
    })
    .category('Misc')
    .desc("Automatically upgrade level when available")
    .pages('allpages')

    ,

    colorurls: new Func("Clearly visible clicky URLs", function(){
        $('a:link[href^="/leaving.php"]').css('color','#0000FF');
    })
    .category('UI')
    .desc("Color user defined clickable URLs with a standard blue color")
    .pages('allpages')

    ,

    battlestatround: new Func("Round battlestat on Home", function(){
        Torn.ui.pageContent.home.getBoxes()['Battle Stats'].find('tr b').each(function(){
            $(this).text(Utils.tornNumber(Utils.round(Utils.number($(this).text()),0)));
        });
    })
    .category('UI')
    .desc("Round the battlestat on Home page to nearest whole number")
    .pages('index')

    ,
    

    battlestatpercentage: new Func("Show percentage on battle stats", function(page){
        if(page == 'index') {
            var stats = Torn.ui.pageContent.home.getBoxes()['Battle Stats'].find('tr b');
            var total = Utils.number(stats.last().text());
            stats.filter(':lt(4)').each(function(){
                $(this).after(' ('+Utils.percent(Utils.number($(this).text()),total)+')');
            });
        } else if (page == 'gym') {
            var total = 0;
            var boxes = Torn.ui.pageContent.gym.getStatBoxes().find('.gymStatBox');
            boxes.each(function(){total += Utils.number($(this).text())});
            boxes.each(function(){
                var text = $(this).text();
                if(text.indexOf('%') == -1)
                    $(this).append(' ('+Utils.percent(Utils.number(text),total)+')');
            });
        }
    })
    .category('UI')
    .desc("Adds a percentage counter next to the battle stats on Home page and in Gym")
    .pages(['index','gym'])

    ,

    blacklistattack: new Func("Attack links on Blacklist page", function(){
        Torn.ui.pageContent.blacklist.table.getHeader().append('<th style="text-align:right;width:1%">Attack</th>');
        Torn.ui.pageContent.blacklist.table.getRows().each(function(){
            var id = Utils.number($(this).find('a[href^="/profiles.php"]').prop('href'));
            $(this).append('<td style="text-align:right;width:1%"><a href="/attack.php?PID='+ id +'">[Attack]</a></td>');
        });
    })
    .category('UI')
    .desc("Add a Attack column to all enemies in Blacklist")
    .pages('blacklist')

    ,

    racingnumbers: new Func("Numbers on bars in Racing", function(page,qs){
        var enlarge = 15, divider = 1;
        if(qs.step == "parts3") {
            divider = 5.6;
        }

        var tbls;
        if($.isEmptyObject(qs)) {
            tbls = Torn.ui.pageContent.racing.front.racingupdates.getCar().find('table');
        } else if(qs.step == 'cars') {
            tbls = Torn.ui.pageContent.racing.cars.getCars().find('tr:eq(1) > td:eq(3) > table');
        } else if(qs.step == 'parts') {
            tbls = Torn.ui.pageContent.racing.parts.cars.getCars().find('td:eq(2) table');
        } else if(qs.step == 'parts3') {
            tbls = Torn.ui.pageContent.racing.parts.upgrades.getUpgrades().find('tr:eq(2) td:eq(1) table');
        }

        tbls.each(function() {
            $(this).attr("width", $(this).width()+enlarge);
            $(this).find('img[src="/images/bar_gray2.png"]').parent().each(function(){
                var main = Utils.number($(this).find('img[src="/images/bar_gray3.png"]:first').attr('width') || 0) / divider;
                var plus = Utils.number($(this).find('img[src="/images/bar_green3.png"]').attr('width') || 0) / divider;
                var neg = Utils.number($(this).find('img[src="/images/bar_red3.png"]').attr('width') || 0)  / divider;

                var total = Utils.round(main + plus - neg,2).toFixed(2);
                if(total < 10 && total > 0) total = "0" + total;
                
                var title = main;
                if(plus > 0) {
                    title+= "+" + Utils.round(plus,2);
                }
                if(neg > 0) {
                    title+= "-" + Utils.round(neg,2);
                }
                $(this).parent().append('<td><span style="font-size: 9px;" title="'+title+'">' + total + "</span></td>");
            });
        });
    })
    .category('UI')
    .desc("Show numbers besides specs bars on racing pages")
    .pages({'racing':[null,{step:'cars'},{step:'parts'},{step:'parts3'}]})

    ,

    taglisthover: new Func("Last activity when hovering Tag list", function(){
        Torn.ui.navigation.tagList().mouseover(function(){
            $(this).attr('title','Last Active: ' + Torn.player(Utils.number($(this).find('a.button').attr('href'))).profile()['Last action']);
        });
    })
    .category('UI')
    .desc("Hover mouse over a profile in Tag List to see Last Activity")
    .pages('allpages')

    ,

    showinfoiconstext: new Func("Show Info Icons text (Expand Info Icons)",function() {
        var icontray = Torn.ui.navigation.iconInfo(),
        infoIcons = this.module.getInfoIcons(),
        that = this;
        var keyTranslate = {Female:'Gender',Male:'Gender'};

        if(icontray.size() > 0) {
            var newtray = $('<ul></ul>').attr('id','iconTraynew').addClass('big').insertAfter(icontray);
            icontray.find('.iconShow').each(function(){
                var spl = $(this).attr('title').split('</b>'),
                name = spl[0].replace('<b>',''),
                text = spl[1].replace(/<br>/g,' ').trim() || name;
                name = keyTranslate[name] || name;
                if(infoIcons[name] && that[infoIcons[name]]) {
                    $('<span></span>').addClass('iconSpan').html(that.module.shortInfoText(name,text))
                        .insertAfter($(this).appendTo(newtray)).after('<br style="clear:both;"/>');
                }
            });
        }
    })
    .pages('allpages')
    .category('UI')
    .desc('Expand Info (Navigation) Icons show you can see the Text without having to hover')
    .options(function(){
            var infoIcons = this.getInfoIcons(),
            options = [];
            for(var k in infoIcons)
                options.push(new Option(infoIcons[k],'boolean',false));
            return options;
    })

    ,

    getInfoIcons: function() {
        //TODO: Find the rest of the icons
        return {'Gender':'Gender','Company':'Company','Married':'Marriage',
            'Faction':'Faction','Education':'Education','Item Market':'Item Market',
            'Stock Market':'Stock Market','Drug Cooldown':'Drug Cooldown',
            'Medical Cooldown':'Medical Cooldown','Booster Cooldown':'Booster Cooldown',
            'Hospital':'Hospital','Low Life':'Low Life','Jail':'Jail',
            'Bank Investment':'Bank','Donator':'Donator','Bazaar':'Bazaar',
            'Racing':'Racing','Property Vault':'Property Vault','High Bidder':'Auction House'};
    },
    shortInfoText: function(key,text) {
        /* TODO: More? */
        switch(key) {
            case 'Bank Investment':
                text = this.shortTimeText(text).replace('Current bank investment worth','');
            break;
            case 'Education':
                text = this.shortTimeText(text).replace('Currently completing the','');
            break;
        }
        return text;
    },
    shortTimeText: function(str) {
        str = str.replace(' days','d').replace(' hours, ',':').replace(' minutes and ',':').replace(' seconds','');
        return str.replace(/(\d+):(\d+):(\d+)/,function($0,$1,$2,$3){
            return ($1.length == 1 ? "0" + $1: $1) + ':' + ($2.length == 1 ? "0" + $2: $2) + ':' + ($3.length == 1 ? "0" + $3: $3);
        });
        
    }



})