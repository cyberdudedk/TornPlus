/* API class, instance takes page content as parameter, and uses that for base.
    This means we can get content of a page using XHR and pass it through this API to get a ready API for usage
 */
TornAPI = function(p) {
    var page = jQuery(p);
    var self = this;
    this.style = {
        isOld: function() {
            return false; //Detection needed
        },
        isMobile: function() {
            return false; //Detection needed
        },
        isRespo: function() {
            return false; //Detection needed when Respo is released
        }
    } 

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
                return $('#player-stats'); //$('#mainNavigation #nav-g1');
            }
        },
        banner: function() {
            return $('#banner');
        },
        content: function(){
            return $('> div > table:not(#announce) > tbody > tr > td:last',page).contents().filter(function(){return this.nodeType == 1 || (this.nodeType == 3 && this.textContent.trim() != '');});
        }
    };
    
    this.user = {
        id: function() {
            return Script.userId();
        },
        name: function() {
            return Script.userName();
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

        status: {
            isInJail: function() {

            },
            isInHospital: function() {

            },
            isTraveling: function() {

            },
            isFlying: function() {

            },
            isLanded: function() {

            },
            inCountry: {
                mexico: function() {
                    return (self.user.status.isTraveling() ? false : self.user.status.isInWhichCountry() == 'mexico');
                }
            },
            isInWhichCountry: function() {

            }
        },



        faction: {
            info: function() {
                return self.user.profile().faction;
            },
            id: function() {
                return self.user.faction.info().id;
            },
            isInFaction: function() {
                return self.user.faction.info != undefined;
            }
        },

        education: function() {
            return cachedValue('user/education',function() {
                var page = getPageSync('education.php');
                var edus = null;
                var educontainer = $("div.eduContainer",page.ui.content());
                if(educontainer.size()>0) edus = {};
                educontainer.each(function() {
                    var prog = $('.eduProgress .eduNumber',this).text().split(' / ');
                    edus[$('.eduTitle',this).text().toLowerCase()] = {num:Number(prog[0]), max:Number(prog[1])};
                });
                return edus;
            });
        },

        perks: {
            all: function() {

            },
            education: function() {

            },
            job: function() {

            },
            company: function() {

            },
            faction: function() {

            },
            byEffect: {
                nerve: function() {

                },
                education: function() {

                },
                addiction: function() {

                },
                hospital: function() {

                }
                /* TODO: More perks */


            }
        },

        job: {
            isInJob: function() {

            },
            jobType: function() {

            },
            company: function() {

            },
            rank: function() {

            },
            specials: function() {

            },
            gains: function() {

            }

        },


        property: {
            owned: function() {

            },
            information: function() {

            }
        },


        stats: {
            working: function() {

            },
            battle: function() {

            },
            detailed: function() {

            },
            racing: function() {

            },
            gym: function() {

            },
            poker: function() {

            },
            roulette: function() {

            },
            faction: function() {

            },
            recruit: function() {

            }
        },



        unlockables: {
            hasBazaar: function() {

            },
            hasDisplayCase: function() {

            },
            hasRacing: function() {

            },
            hasStockTicker: function() {

            },
            hasMuseum: function() {

            },
            hasSports: function() {

            },
            /* Are these needed? */
            hasNotebook: function() {
                return self.user.donator.isDonator();
            },
            hasFriendslist: function() {
                return self.user.donator.isDonator();
            },
            hasBlacklist: function() {
                return self.user.donator.isDonator();
            }
        },

        donator: {
            isDonator: function() {

            },
            isSubscriber: function() {

            },
            days: function() {

            }

        }

    };
    
    this.pagecontent = function(){
        
    }
}