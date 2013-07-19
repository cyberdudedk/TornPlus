/* API class, instance takes page content as parameter, and uses that for base.
    This means we can get content of a page using XHR and pass it through this API to get a ready API for usage
 */
TornAPI = function(p) {
    var page = jQuery(p);
    var self = this;
    this.ui = {
        navigation: {
            account: function() {
                return $('#mainNavigation #nav-g3');
            },
            areas: function() {
                return $('#mainNavigation #nav-g4');
            },
            specials: function() {
                return $('#mainNavigation #nav-g5');
            },
            info: function() {
                return $('#mainNavigation #nav-g1');
            }
        },
        content: function(){
            return $('> div > table:not(#announce) > tbody > tr > td:last',page).contents().filter(function(){return this.nodeType == 1 || (this.nodeType == 3 && this.textContent.trim() != '');});
        }
    };
    
    this.user = {
        id: function() {
            return cachedValue('user/id',function() {
                return Utils.number($('#tblInfo a[href^="profiles.php?XID="]',self.ui.navigation.info()).attr('href')); 
            });
        },
        name: function() {
            return cachedValue('user/name',function() {
                return $('#tblInfo a[href^="profiles.php?XID="]',self.ui.navigation.info()).text(); 
            });
        },
        profile: function() {
            return cachedValue('user/profile',function() {
                var values = {};
                var page = getPageSync('profiles.php?XID='+self.user.id());
                var wrapper = $('.profileWrapper',page.ui.content());
                var basicInfo = $('#basicInfo',wrapper);
                var infoBoxLeft = $('#infoBoxLeft',wrapper);
                
                values['level'] = $('.statBox font.level a font',basicInfo).text();
                values['rank'] = $('.statBox a span.rankSmall',basicInfo).text();
                values['title'] = $('.statBox > span.rankSmall',basicInfo).text();
                values['age'] = $('.statBoxN',basicInfo).textOnly().trim();
                
                infoBoxLeft.find('table').remove().end().children().last().remove().end().end().html().split('<br>').forEach(function(v,i) {
                    var spl = $('<p>'+v+'</p>').text().trim().split(': ',2);
                    //Currently only using faction, maybe add more later
                    switch(spl[0]) {
                        case 'Faction':
                            var factiona = $(v).filter('a');
                            if(factiona.size() > 0) {
                                values['faction'] = {id: Utils.number(factiona.attr('href')), name:spl[1]};    
                            }
                        break;
                    }
                });
                
                return values;
            });
        },
        faction: function() {
            return self.user.profile().faction;
        },
        factionId: function() {
            return self.user.faction().id;
        },
        education: function() {
            return cachedValue('user/education',function() {
                var page = getPageSync('education.php');
                var edus = null;
                var educontainer = $("div.eduContainer",page.ui.content());
                if(educontainer.size()>0) edus = {};
                educontainer.each(function() {
                    var prog = $('.eduProgress .eduNumber',this).text().split(' / ');
                    edus[$('.eduTitle',this).text()] = {num:Number(prog[0]), max:Number(prog[1])};
                });
                return edus;
            });
        }
        
        
    };
    
    this.pagecontent = function(){
        
    }
}