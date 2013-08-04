/* API class, instance takes page content as parameter, and uses that for base.
    This means we can get content of a page using XHR and pass it through this API to get a ready API for usage
 */
TornAPI = function(p) {
    var page = jQuery(p);
    var self = this;
    this.style = {
        isOld: function() {
            return $('#banner').size() == 0;
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
        },

        pageContent: {
            home: {
                getBoxes: function() {
                    var boxes = {};
                    $('.dragbox',self.ui.content()).each(function(){
                        boxes[$('h2',this).text()] = $('.dragbox-content table, #propertyImage',this);
                    });
                    return boxes;
                }
            },
            jail: function() {

            },
            hospital: function() {

            },
            items: function() {

            },
            racing: {
                front: function() {

                },
                cars: function() {

                },
                parts: function() {

                }

            },
            gym: function() {

            },
            crimes: function() {

            },
            casino: function() {

            }
        },

        currentPageContent: function() {

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
                var page = getPageSync('profiles',{XID:self.user.id()});
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
        homeInfo: function() {
            return cachedValue('user/homeinfo',function() {
                var perks, workingstats, battlestats, values = {
                    'Perks':perks = {},
                    'Working Stats':workingstats = {},
                    'Battle Stats':battlestats = {}
                };
                var boxes = getPageSync('index').ui.pageContent.home.getBoxes();

                $('tr:not(:last-child) td',boxes['Personal Perks']).each(function(){
                    var spl = $(this).text().split(': ');
                    if(perks[spl[0]] == undefined) perks[spl[0]] = [];
                    perks[spl[0]].push(spl[1]);
                });

                $('tr',boxes['Working Stats']).each(function(){
                    workingstats[$('td:eq(0)',this).text().split(/\b/)[0]] = Utils.number($('td:eq(1)',this).text());
                });

                $('tr',boxes['Battle Stats']).each(function(){
                    battlestats[$('td:eq(0)',this).text().split(/\b/)[0]] = Utils.number($('td:eq(1)',this).text());
                });

                return values;
            },0)
        },

        status: {
            isInJail: function() {

            },
            isInHospital: function() {

            },
            /* Is either isFlying or isLanded (Not in Torn) */
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
                var all = [], perks = self.user.homeInfo().Perks;
                for(var t in perks)
                    all = all.concat(perks[t]);
                return all;
            },
            education: function() {
                return self.user.homeInfo().Perks.Education;
            },
            job: function() {
                return self.user.homeInfo().Perks.Job;
            },
            /* Company 2.0 update? */
            /*
            company: function() {

            },*/
            faction: function() {
                return self.user.homeInfo().Perks.Faction;
            },
            enhancer: function() {
                return self.user.homeInfo().Perks.Enhancer;
            },
            merit: function() {
                return self.user.homeInfo().Perks.Merit;
            },
            property: function() {
                return self.user.homeInfo().Perks.Property;
            },
            stock: function() {
                return self.user.homeInfo().Perks.Stock;
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
}