({
    jailquickbust: new Func("Jail Quick Bust", function(){ /* TODO: Support Captcha */
        Torn.ui.pageContent.jail.getRows().find('td:eq(7) a').click(function(){
            var msg = getPageSync($(this).attr('href') + '1').ui.pageContent.jail.getBustMessage();

            var msgType = 'info';
            if(msg.indexOf('You busted') > -1) msgType = 'good';
            else if(msg.indexOf('While trying') > -1) msgType = 'bad';
            notice(msg,msgType);
            return false;
        });
    })
    .category('Misc')
    .desc("Quick (One-click) Bust in Jail")
    .pages('jailview')

    ,

    jailquickbail: new Func("Jail Quick Bail", function(){ /* TODO: Support Captcha */
        Torn.ui.pageContent.jail.getRows().find('td:eq(6) a').click(function(){
            var msg = getPageSync(
                getPageSync($(this).attr('href'))
                    .ui.pageContent.jail.getBailYesButton().attr('href'))
                .ui.pageContent.jail.getBailMessage();

            var msgType = 'info';
            if(msg.indexOf('You bought') > -1) msgType = 'good';
            notice(msg,msgType);
            return false;
        });
    })
    .category('Misc')
    .desc("Quick (One-click) Bail in Jail")
    .pages('jailview')

    ,

    jailbailhelper: new Func("Jail Bail Helper", function(){
        var inLawFirm = (Torn.user.job.company() == 'Law Firm');
        var multiplier = 25 * (Torn.user.perks.byResult.bail() * (inLawFirm == true ? 0.5 : 1));
        Torn.ui.pageContent.jail.getRows().each(function(){
            var tds = $(this).find('td');
            var level = Utils.number(tds.eq(4).text());
            var timespl = tds.eq(3).text().split(' ');
            var mins = (parseInt(timespl[0]) * 60) + (timespl.length == 5 ? parseInt(timespl[2]) : 0);
            var price = (mins+1)*level*multiplier;
            tds.eq(6).find('a').append(' For $' + Utils.tornNumber(price));
        });
        
    })
    .category('Misc')
    .desc("Show bail prices in Jail")
    .pages('jailview')

    ,

    hospitalquickrevive: new Func("Hospital Quick Revive", function(){
        Torn.ui.pageContent.hospital.getRows().find('a[href^="revive.php?ID="]').each(function(){
            $(this).click(function(){
                var id = Utils.number($(this).attr('href'));
                var msg = postPageSync('revive.php?step=revive',{revive:id}).ui.pageContent.hospital.revive.getMessage();

                var msgType = 'good';
                if(msg.indexOf('You do not have') > -1) msgType = 'info';
                else if(msg.indexOf('This person does not') > -1) msgType = 'bad';
                notice(msg,msgType);
                return false;
            });
        });
    })
    .category('Misc')
    .desc("Quick (One-click) Revive in Hospital")
    .pages('hospitalview')
})