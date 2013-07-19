this.module1 = {
    allpages: new Func('Allpages',
        function(){
            log('All pages: ' + this.var1 + " = " + this.var2);
            log(Torn.user.id() + " : " + Torn.user.name());
            log(Torn.user.profile());
            log(Torn.user.faction());
            log(Torn.user.factionId());
            log(Torn.user.education());
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