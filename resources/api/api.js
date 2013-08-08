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
            return false; //TODO: Detection needed
        },
        isRespo: function() {
            return false; //TODO: Detection needed when Respo is released
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
                return $('#player-stats');
            },
            iconInfo: function() {
                return $('#iconTray',self.ui.navigation.info());
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
            properties: {
                propertyList: function() {
                    var properties = [];
                    var numKeys = ['upkeep','staff cost','happiness','vault'];
                    self.ui.content().filter('table').find('tr:gt(0) td:last-child').each(function(){
                        var prop = {};
                        $(this).html().split('<br>').forEach(function(v,i){
                            var text = $('<span>'+v+'</span>').text().trim();
                            if(text != '')
                            {
                                var spl = text.toLowerCase().split(': ');
                                var key = spl[0];
                                var value = spl[1];
                                if($.inArray(key,numKeys) > -1) value = Utils.number(value);
                                prop[key] = value;
                            }

                        });
                        prop['id'] = Utils.number($(this).find('a[href^="properties.php?step=info"]').prop('href'));
                        properties.push(prop);
                    });
                    return properties;
                }
            },
            propertyInfo: {
                modifications: function() {
                    var mods = [];
                    var spl = $('<div></div>').append(self.ui.content().clone()).html().split('(Hover over the images to see further details)');
                    $(spl[1]).filter('img').each(function(){
                        mods.push($(this).prop('title').toLowerCase());
                    });
                    return mods;
                },
                staff: function() {
                    var staff = [];
                    var spl = $('<div></div>').append(self.ui.content().clone()).html().split('(Hover over the images to see further details)');
                    $(spl[2]).filter('img').each(function(){
                        staff.push($(this).prop('title').toLowerCase().replace(' service',''));
                    });
                    return staff;
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
            /* TODO: More */
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
            })
        },
        icons: function() {
            icons = {};
            $('li',self.ui.navigation.iconInfo()).each(function(){
                var id = $(this).prop('id');
                var title = Utils.br2nl($(this).prop('title'));
                var titleObj = $('<span>'+title+'</span>');
                icons[$('b',titleObj).text()] = titleObj.textOnly().trim();
            });
            return icons;
        },
        

        status: {
            isInJail: function() {
                return page.attr('bgcolor') == '#BBA47E';
            },
            isInHospital: function() {
                return page.attr('bgcolor') == '#FFFFFF';
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
                /* TODO: More */
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
                return self.user.faction.info() != undefined;
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
                return cachedValue('user/property/owned',function(){
                    return getPageSync('properties').ui.pageContent.properties.propertyList();
                });
            },
            current: function() {
                return cachedValue('user/property/current',function() {
                    var cur = self.user.property.owned()[0];
                    var page = getPageSync('properties',{step:'info',ID:cur.id});
                    var mods = page.ui.pageContent.propertyInfo.modifications();
                    var staff = page.ui.pageContent.propertyInfo.staff();
                    var dlProp = Script.getDataList('properties');
                    var dlStaff = Script.getDataList('propertiesStaff');
                    var dlUpgrades = Script.getDataList('propertiesUpgrades');
                    var curPropInfo = dlProp[cur.property];
                    var sizes = ['small','medium','large','sufficient','superior','1x','2x','3x','5x','10x'];

                    var loopFunc = function(loop, list, addto){
                        loop.forEach(function(v){
                            var size,
                            spl = v.split(' ');
                            if($.inArray(spl[0],sizes) > -1) size = spl.shift();
                            var u = (size ? list[spl.join('_')][size] : list[spl.join('_')]);
                            if(Utils.endsWith(u.cost,'%')) u.cost = (Utils.number(u.cost) / 100)*curPropInfo.cost;
                            if(Utils.endsWith(u.happy,'%')) u.happy = (Utils.number(u.happy) / 100)*curPropInfo.happy;
                            addto[v] = u;
                        });
                    }
                    loopFunc(mods,dlUpgrades,cur['upgrades'] = {});
                    loopFunc(staff,dlStaff,cur['staff'] = {});
                    return cur;
                });
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
                return cachedValue('user/donator/isDonator',function() {
                    return self.user.icons()['Donator'] != undefined;
                });
            },
            isSubscriber: function() {
                //Subscriber icon with end date
                return cachedValue('user/donator/subscriber',function() {
                    return self.user.icons()['Subscriber'] != undefined;
                });
            },
            days: function() {
                return cachedValue('user/donator/days',function() {
                    return (self.user.icons()['Donator'] != undefined ? Utils.number(self.user.icons()['Donator']) : undefined) ;
                });
            }

        }

    };
}