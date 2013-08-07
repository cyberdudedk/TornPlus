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
            
            //log(Torn.user.donator.isDonator());
            //log(Torn.user.donator.days());
            //log(Torn.user.donator.isSubscriber());
            //log(Torn.user.unlockables.hasNotebook());
            //log(Torn.user.unlockables.hasFriendslist());
            //log(Torn.user.unlockables.hasBlacklist());

            //log(Torn.user.property.owned());
            //log(Torn.user.property.current());


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