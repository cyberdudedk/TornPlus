this.module1 = {
    allpages: new Func('Allpages',
        function(){
            log('All pages: ' + this.var1 + " = " + this.var2);
            //log(Torn.user.id() + " : " + Torn.user.name());
            //log(Torn.user.profile());
            //log(Torn.user.faction());
            //log(Torn.user.faction.Id());
            //log(Torn.user.education());
            //log(Torn.style.isOld());
            //log(Torn.user.homeInfo());
            //log(Torn.user.perks.faction());
            //log(Torn.user.perks.education());
            //log(Torn.user.perks.all());
            //log(Torn.user.status.isInJail());
            //log(Torn.user.status.isInHospital());
            
            //log(Torn.user.donator.isDonator());
            //log(Torn.user.donator.days());
            //log(Torn.user.donator.isSubscriber());
            //log(Torn.user.unlockables.hasNotebook());
            //log(Torn.user.unlockables.hasFriendslist());
            //log(Torn.user.unlockables.hasBlacklist());

            //log(Torn.user.property.owned());
            //log(Torn.user.property.current());

            //log(Torn.user.unlockables.hasBazaar());
            //log(Torn.user.unlockables.hasDisplayCase());
            //log(Torn.user.unlockables.hasRacing());
            //log(Torn.user.unlockables.hasStockTicker());
            //log(Torn.user.unlockables.hasCityWatch());
            
            //log(Torn.user.unlockables.hasMuseum());
            //log(Torn.user.unlockables.hasSports());

            //log(Torn.user.merits.available());
            //log(Torn.user.merits.used());
            //log(Torn.user.merits.upgrades());

            //log(Torn.user.job.isInJob());
            //log(Torn.user.job.isInCompany() );
            //log(Torn.user.job.isInStarter() );
            //log(Torn.user.job.company());
            //log(Torn.user.job.rank() );
            //log(Torn.user.job.gains() );
            //log(Torn.user.job.specials() );

            

        })
    .pages('allpages')
    .desc('sdfsf')
    .option('var2','string','test').option('var1','int',0)
    
    ,
    
    items: {
        grouping: new Func('Grouping items together',
            function() {
                log('items grouping');
            }).category('items').desc('Group items together').pages(['item'])
        ,
        bulkuse: new Func('Bulk using items',
            function() {
                log('bulk use');
            }).desc('Add a bulk use button to items').pages(['item'])
    }
};
