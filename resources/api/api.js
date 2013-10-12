/* API class, instance takes page content as parameter, and uses that for base.
    This means we can get content of a page using XHR and pass it through this API to get a API ready for usage
 */
TornAPI = function(p) {
    var page = jQuery(p);
    var self = this;


    this.style = {
        isOld: function() {
            return $('#banner').size() == 0;
        },
        isMobile: function() {
            return false; /* TODO: Detection needed */
        },
        isRespo: function() {
            return false; /* TODO: Detection needed when Respo is released */
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
            },
            tagList: function() {
                return self.ui.navigation.specials().find("li:contains('Tag List')").nextAll();
            }
        },
        banner: function() {
            return $('#banner');
        },
        content: function(){
            var obj = page.find('.tornpluscontent');
            if(obj.size() > 0) page = obj;
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
                getRows: function() {
                    return self.ui.content().filter('table').find('tr:gt(0) td:last-child');
                }
            },
            propertyInfo: {
                getModifications: function() {
                    var spl = $('<div></div>').append(self.ui.content().clone()).html().split('(Hover over the images to see further details)');
                    return $(spl[1]).filter('img');
                },
                getStaff: function() {
                    var spl = $('<div></div>').append(self.ui.content().clone()).html().split('(Hover over the images to see further details)');
                    return $(spl[2]).filter('img');
                }
            },
            points: {
                getItems: function() {
                    return self.ui.content().filter('table').find('> tbody > tr > td:not(:empty)');
                }
            },
            merits: {
                getRows: function() {
                    return self.ui.content().find('tr.bgAlt1, tr.bgAlt2');
                },
                getHeader: function() {
                    return self.ui.content().filter('table:first').find('td');
                }
            },
            recruit: {
                getPlayers: function() {
                    return self.ui.content().filter('.data').find('tbody tr');
                }
            },
            casino: {
                roulette: {
                    getStatistics: function() {
                        return self.ui.content().find('table.data:eq(1) tr:gt(1)');
                    }
                },
                poker: {
                    getScore: function() {
                        return $('<div></div>').append(self.ui.content().clone()).textOnly().replace(/[\[\]>]/g,'').trim();
                    }
                }
            },
            personalstats: {
                getRows: function() {
                    return $('.list tr:gt(0)',self.ui.content());
                }
            },
            items: {
                getTables: function() {
                    return self.ui.content().find('.data');
                },
                getItems: function() {
                    return self.ui.content().find('.data tbody tr');
                }
            },
            jail: {
                getRows: function() {
                    return self.ui.content().find('.data:eq(1) tbody tr');
                },
                getMessageContent: function() {
                    return self.ui.content().filter('font:last');
                },
                getBustMessage: function() {
                    return self.ui.pageContent.jail.getMessageContent().text().replace(/>\s*(Back)?/g, "").trim();
                },
                getBailMessage: function() {
                    return self.ui.pageContent.jail.getMessageContent().text().replace(/>\s*(Back)?/g, "").trim();
                },
                getBailYesButton: function() {
                    return self.ui.pageContent.jail.getMessageContent().find('td a:first');

                }
            },
            racing: {
                cars: {
                    getHeader: function() {
                        return self.ui.content().filter('table:first');
                    },
                    getCars: function() {
                        return self.ui.content().filter('table:gt(0)');
                    }
                },
                front: {
                    racingupdates: {
                        getCar: function() {
                            return self.ui.content().filter('#racingupdates').find('table:eq(4)');
                        }
                    }
                },
                parts: {
                    cars: {
                        getCars: function() {
                            return self.ui.content().filter('table:last').find('> tbody > tr > td > table');
                        }
                    },
                    upgrades: {
                        getUpgrades: function() {
                            return self.ui.content().filter('table:last').find('> tbody > tr > td > table');
                        }
                    }

                }

            },
            gym: {
                getInfo: function() {
                    return $('#gymExpTabs',page);
                },
                getStatBoxes: function() {
                    return $('.gymSubBoxLeft, .gymSubBoxRight',self.ui.content());
                }
            },
            blacklist: {
                table: {
                    getHeader: function() {
                        return self.ui.content().filter('.data').find('thead tr');
                    },
                    getRows: function() {
                        return self.ui.content().filter('.data').find(' tbody tr');
                    }
                }
            },
            crimes: function() {

            },
            stock: {
                portfolio: {
                    getStockRows: function() {
                        var rows = [];
                        self.ui.content().filter('table').find('tr:nth-child(7n+3)').each(function(){
                            rows.push($(this).closest("tr").nextAll().andSelf().slice(0, 4));
                        });
                        return rows;
                    }
                },
                profile: {
                    getPriceTable: function() {
                        return self.ui.content().filter('table').find('tr tr table:eq(1)');
                    }
                }
            },
            profiles: {
                getWrapper: function() {
                    return $('.profileWrapper',self.ui.content());
                },
                getBasicInfo: function() {
                    return $('#basicInfo',self.ui.pageContent.profiles.getWrapper());
                },
                getInfobox: function() {
                    return $('#infoBoxLeft',self.ui.pageContent.profiles.getWrapper());
                }

            },
            hospital: {
                getTable: function() {
                    return $('.data:eq(1)',self.ui.content());
                },
                getRows: function() {
                    return $('.data:eq(1) tbody tr',self.ui.content());
                },
                revive: {
                    getMessage: function() {
                        return $('center',self.ui.content()).text();
                    }
                }
            },
            iteminfo: {
                getInfoTable: function() {
                    return self.ui.content().filter('.data:first');
                }
            },
            museum: {
                step: {
                    getList: function() {
                        return self.ui.content().filter('table:first');
                    },
                    getNavigationTable: function() {
                        return self.ui.content().filter('table:last');
                    },
                    getExchangeLink: function() {
                        return self.ui.content().find('a[href^="museum.php?rfc="]');
                    },
                    getMessage: function() {
                        var b = self.ui.content().filter('b:first');
                        if(b.size() > 0) return b.text();
                        return self.ui.content().filter(function () { return this.nodeType === 3; }).text().replace('>','');
                    }

                }
            },
            userimages: {
                viewimage: {
                    getImage: function() {
                        return self.ui.content().find('img');
                    }
                },
                getImages: function() {
                    return self.ui.content().find('a[href^="userimages.php?step=viewimage&ID="]:odd');
                }

            },
            newspaper: {
                hof: {
                    getNavigationTable: function() {
                        return self.ui.content().find('table:first');
                    }
                }
            }

            /* TODO: More */
        },

        currentPageContent: function() {
            

        }
    };

    this.player = function(id) {
        var _playerid = id;
        var _profilePage;
        
        return {
            id: function() {
                return _playerid;
            },
            name: function() {
                return this.profile()['Name'];
            },
            profilePage: function() {
                if(typeof(this._profilePage) == 'undefined') {
                    this._profilePage = getPageSync('profiles',{XID:_playerid});
                }
                return this._profilePage;
            },
            detailedPage: function(personal) {
                if(typeof(personal) == 'undefined') personal = false;
                if(typeof(this._detailedPage) == 'undefined') {
                    if(personal) this._detailedPage = getPageSync('personalstats');
                    else this._detailedPage = getPageSync('personalstats',{ID:_playerid});
                }
                return this._detailedPage;
            },
            profile: function() {
                var values = {};
                var page = this.profilePage();
                var basicInfo = page.ui.pageContent.profiles.getBasicInfo();
                var infoBoxLeft = page.ui.pageContent.profiles.getInfobox();

                values['Level'] = Utils.number($('.statBox font.level a font',basicInfo).text());
                values['Rank'] = $('.statBox a span.rankSmall',basicInfo).text();
                values['Title'] = $('.statBox > span.rankSmall',basicInfo).text();
                values['Age'] = Utils.number($('.statBoxN',basicInfo).textOnly().trim());

                infoBoxLeft.find('table').remove().end().children().last().remove().end().end().html().split('<br>').forEach(function(v,i) {
                    var spl = $('<p>'+v+'</p>').text().trim().split(': ',2);
                    /* TODO: Add more! */
                    switch(spl[0]) {
                        case 'Faction':
                            var factiona = $(v).filter('a');
                            if(factiona.size() > 0) {
                                values['Faction'] = {id: Utils.number(factiona.attr('href')), name:spl[1]};
                            }
                        break;
                        case 'Online':
                            values['Online'] = spl[1] == 'Online';
                        break;
                        case 'Name':
                            values['Name'] = spl[1].split(' ')[0];
                        break;
                        default:
                            values[spl[0]] = spl[1];
                        break;
                    }
                });

                return values;
            },
            detailed: function(personal) {
                var match,
                    myregexp = /(\d*)([dhms])/g,
                    stats = {},
                    curheader,
                    convert = function(val) {
                        var totalSec = 0;
                        var multi = {s:1, m:60, h:3600, d:86400};
                        val = val.replace(/[$,]| \([\d\.]*[%s]\)/g,'');
                        var num = Number(val);
                        if(!isNaN(num)) return num;
                        while ((match = myregexp.exec(val)) != null) {
                            totalSec += (multi[match[2]] * Number(match[1]));
                        }
                        return totalSec;
                    };

                    this.detailedPage(personal).ui.pageContent.personalstats.getRows().each(function(){
                        if($(this).find('td').size() == 1) {
                            curheader = $(this).find('td b').text();
                            stats[curheader] = {};
                        }else {
                            stats[curheader][$(this).find('td:eq(0)').text().slice(0,-1)] = convert($(this).find('td:eq(1)').text());
                        }
                    });
                    return stats;
            }

        }
    }

    this.user = {
        id: function() {
            return Script.userId();
        },
        name: function() {
            return Script.userName();
        },
        profile: function() {
            return cachedValue('user/profile',function() {
                return self.player(self.user.id()).profile();
            });
        },
        homeInfo: function() {
            return cachedValue('user/homeinfo',function() {
                var perks, workingstats, battlestats, jobinformation, factioninformation, values = {
                    'Perks':perks = {},
                    'Working Stats':workingstats = {},
                    'Battle Stats':battlestats = {},
                    'Job Information':jobinformation = {},
                    'Faction Information':factioninformation = {}
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

                $('tr',boxes['Job Information']).each(function(){
                    var spl = $(this).text().split(': ');
                    jobinformation[spl[0]] = ($.inArray(spl[0],['Income','Job points']) > -1 ? Utils.number(spl[1]) : spl[1]);
                });

                $('tr',boxes['Faction Information']).each(function(){
                    var spl = $(this).text().split(': ');
                    factioninformation[spl[0]] = ($.inArray(spl[0],['Days in Faction','Respect','Rank','Members']) > -1 ? Utils.number(spl[1]) : spl[1]);
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
        pointsInfo: function() {
            return cachedValue('user/pointsinfo',function(){
                if(self.user.status.isInHospital()) return null;
                var points = {};
                getPageSync('points').ui.pageContent.points.getItems().each(function() {
                    points[$('.ptitle',this).text()] = {points: Utils.number($('.pvalue',this).text()), inactive: $(this).find('a.inline').hasClass('inactive')};
                });
                return points;
            });
        },

        status: {
            isInTornOkay: function() {
                return !self.user.statis.isInHospital() && !self.user.statis.isInJail() && !self.user.statis.isTraveling();
            },
            isInJail: function() {
                return page.attr('bgcolor') == '#BBA47E';
            },
            isInHospital: function() {
                return page.attr('bgcolor') == '#FFFFFF';
            },
            /* Is either isFlying or isLanded (Not in Torn) */
            isTraveling: function() {
                return self.user.status.isFlying();
                /* TODO: Further implement so it also accounts for isLanded when not in Torn  */
            },
            isFlying: function() {
                   /* TODO: Fix, is currently returning false when using Laptop or "Recruit a friend
                   See if we can distinguish Flying from normal by the header/top that is different from normal.
                   */
                return $('div center font',page).text() == 'Travelling';
            },
            isLanded: function() {
                /* TODO: Implement */
            },
            inCountry: {
                mexico: function() {
                    return (self.user.status.isTraveling() ? false : self.user.status.isInWhichCountry() == 'mexico');
                }
                /* TODO: More */
            },
            isInWhichCountry: function() {
                /* TODO: Implement */
            }
        },

        items: {
            list: function() {
                return cachedValue('user/items/list',function(){
                    var items = {};
                    getPageSync('item').ui.pageContent.items.getItems().each(function(){
                        var itemTd = $('td:eq(0)',this),
                            actions = {},
                            actionIds = {};

                        itemTd.find('a:gt(0)').each(function(){
                            var key = $(this).text(),
                            num = Utils.number($(this).attr('href'));
                            actions[key] = (num > 1000 ? 'uid' : 'id');
                            actionIds[key] = num;
                        });
                        var quantity = Utils.number(itemTd.textOnly().trim()) || 1,
                            id = Utils.number(itemTd.find('a:first').attr('href')),
                            name = itemTd.find('a:first').text(),
                            uniqueid = actionIds['Send'] || actionIds['Return'];
                        items[id] = {actions:actions,uid:uniqueid,name:name,quantity:quantity,id:id};
                    });
                    return items;
                },0);
            }
        },

        faction: {
            info: function() {
                return self.user.profile().Faction;
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
            /* Company 2.0 update?
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

                },
                bail: function() {
                    var bails = [];
                    self.user.perks.education().forEach(function(v){
                        if(v.indexOf('Bail Cost') > -1)
                            bails.push(v);
                    });
                    return bails;
                }
                /* TODO: More perks */


            },
            byResult: {
                bail: function() {
                    var totalPercent = 1;
                    var bails = self.user.perks.byEffect.bail();

                    bails.forEach(function(v){
                        totalPercent = totalPercent * ((100 - Utils.number(v))/100.0);
                    });
                    
                    /* TODO: Fix, due to Bug (Wrong Perk text), the Perk text has added Perks,
                    e.g 10% + 5% = 15%. However in reality the perks is stacked, thus 10%+5% = 14.5% reduction
                    Bug reported here: http://www.torn.com/forums.php?forumID=19&ID=15718385
                    */
                    if(totalPercent == 0.85) totalPercent = 0.855 /* TODO: Temp fix */
                    if(totalPercent == 0.65) totalPercent = 0.78625 /* TODO: Temp fix */
                    return totalPercent;
                }
            }
        },

        merits: {
            available: function() {
                return cachedValue('user/merits/available',function() {
                    return Utils.number(getPageSync('merits').ui.pageContent.merits.getHeader().find('b').eq(3).text());
                });
            },
            used: function() {
                return cachedValue('user/merits/used',function() {
                    return Utils.number(getPageSync('merits').ui.pageContent.merits.getHeader().find('b').eq(4).text());
                });
            },
            upgrades: function() {
                return cachedValue('user/merits/upgrades',function() {
                    var upgrades = {};
                    getPageSync('merits').ui.pageContent.merits.getRows().each(function(){
                        upgrades[$(this).find('b').text()] = Utils.number($(this).find('img').attr('src'));
                    });
                    return upgrades;
                });
            }
        },

        job: {
            /* TODO: Check if correctly works with Company employement
               TODO: Check if return correctly when in no job */
            isInJob: function() {
                return self.user.homeInfo()['Job Information']['Job'] != 'None'; //TODO: Is this right? When not in job?
            },
            isInStarter: function() {
                return $.inArray(self.user.homeInfo()['Job Information']['Job'],['Employee','Director']) == -1;
            },
            isInCompany: function() {
                return $.inArray(self.user.homeInfo()['Job Information']['Job'],['Employee','Director']) > -1;
            },
            jobType: function() {
                return self.user.homeInfo()['Job Information']['Job'];
            },
            company: function() {
                return self.user.homeInfo()['Job Information']['Company'];
            },
            rank: function() {
                return self.user.homeInfo()['Job Information']['Rank'];
            },
            specials: function() {
                return cachedValue('user/job/specials', function() {
                    var jobsData = Script.getDataList('job');
                    var info;
                    if(self.user.job.isInCompany()) {
                        info = jobsData['companies'][self.user.job.company()];
                        //TODO: Extract information from datalist on company, needs employee/company stars to get information
                        //TODO: Rank when director is "Director", get specials based on company stars?
                    } else {
                        info = jobsData['starter'][self.user.job.jobType().toLowerCase()];
                        var rank = self.user.job.rank();
                        var rankInfo;
                        var specials = [];
                        for(var index in info) {
                            rankInfo = info[index];
                            if(rankInfo.special != undefined) specials.push(rankInfo.special);
                            if(rankInfo.position == rank)
                                break;
                        }
                        return specials;
                    }
                });
            },
            gains: function() {
                return cachedValue('user/job/gains', function() {
                    var jobsData = Script.getDataList('job');
                    var info;
                    if(self.user.job.isInCompany()) {
                        info = jobsData['companies'][self.user.job.company()];
                        //TODO: Extract information from datalist on company, needs employee/company stars to get information
                        //TODO: Rank when director is "Director", get gains based on company stars?
                    } else {
                        info = jobsData['starter'][self.user.job.jobType().toLowerCase()];
                        var rank = self.user.job.rank();
                        var rankInfo;
                        for(var index in info) {
                            rankInfo = info[index];
                            if(rankInfo.position == rank)
                                break;
                        }
                        return rankInfo.statsgain;
                    }
                });
            }

        },


        property: {
            owned: function() {
                return cachedValue('user/property/owned',function(){
                    if(self.user.status.isInHospital()) return null;
                    var properties = [];
                    var numKeys = ['upkeep','staff cost','happiness','vault'];
                    getPageSync('properties').ui.pageContent.properties.getRows().each(function(){
                        var prop = {};
                        $(this).html().split('<br>').forEach(function(v,i){
                            var text = $('<span>'+v+'</span>').text().trim();
                            if(text != '') {
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
                });
            },
            current: function() {
                return cachedValue('user/property/current',function() {
                    if(self.user.status.isInHospital()) return null;
                    var cur = self.user.property.owned()[0];
                    var page = getPageSync('properties',{step:'info',ID:cur.id});
                    var modsImg = page.ui.pageContent.propertyInfo.getModifications();
                    var staffImg = page.ui.pageContent.propertyInfo.getStaff();
                    var dlProp = Script.getDataList('properties');
                    var dlStaff = Script.getDataList('propertiesStaff');
                    var dlUpgrades = Script.getDataList('propertiesUpgrades');
                    var curPropInfo = dlProp[cur.property];
                    var sizes = ['small','medium','large','sufficient','superior','1x','2x','3x','5x','10x'];
                    var mods = [],
                    staff = [];
                    modsImg.each(function(){
                        mods.push($(this).prop('title').toLowerCase());
                    });
                    staffImg.each(function(){
                        staff.push($(this).prop('title').toLowerCase().replace(' service',''));
                    });
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
                    };
                    loopFunc(mods,dlUpgrades,cur['upgrades'] = {});
                    loopFunc(staff,dlStaff,cur['staff'] = {});
                    return cur;
                });
            }
        },


        stats: {
            working: function() {
                return self.user.homeInfo()['Working Stats'];
            },
            battle: function() {
                return self.user.homeInfo()['Battle Stats'];
            },
            detailed: function() {
                return cachedValue('user/stats/detailed',function() {
                    return self.player(self.user.id()).detailed(true);
                });
            },
            racing: function() {
                return cachedValue('user/stats/racing',function(){
                    var stats = {};
                    var lvls = {'None':0,'F':1,'D':2,'C':3,'B':4,'A':5};
                    var carsRegex = /([^\r\n\s][\s\S]*?): ([\s\S]+)/m;
                    if(!self.user.unlockables.hasRacing()) return stats;
                    var page = getPageSync('racing',{step:'cars'});
                    var header = page.ui.pageContent.racing.cars.getHeader();
                    var carsTabels = page.ui.pageContent.racing.cars.getCars();
                    stats['class'] = 'None';
                    stats['skill'] = Utils.number(header.find('table font:last').text());
                    stats['class'] = header.find('td:last img').attr('title').slice(-1);
                    stats['level'] = lvls[stats['class']];

                    var cars = [];
                    carsTabels.each(function(){
                        var car = {'Car':$('tr:eq(1) > td:eq(0) b',this).text()};
                        $('tr:eq(1) > td:eq(1) td',this).text().split('\n').slice(2).forEach(function(v) {
                            var m = carsRegex.exec(v);
                            if(m != null)
                                car[m[1]] = Utils.number(m[2]);
                        });
                        cars.push(car);
                    });

                    stats['cars'] = {
                        unsorted: cars,
                        sorted: cars.slice().sort(function(a,b){
                                    return a['Car'] == 'None' || (b['Races won'] - a['Races won']);
                                })
                    }
                    return stats;
                });
            },
            gym: function() {
                return cachedValue('user/stats/gym', function() {
                    var gymInfo = getPageSync('includes/embeddedgym1').ui.pageContent.gym.getInfo();
                    var gymClass = {1:'Light',2:'Middle',3:'Heavy',4:'Special'};
                    var gymStat = {};
                    for(gym in gymClass)
                    {
                        var lis = $(gymInfo).find('#tabs-'+gym+' li');
                        gymStat[gymClass[gym]] = {max:lis.size(),unlocked:lis.filter('.active, .enter').size()};
                    }
                    var currentName = $('.active .name',gymInfo).text();
                    var spl = $('#disableStats',gymInfo).text().split(', ');
                    gymStat['Current'] = {'name':currentName,
                        gains:{
                            Strength:Utils.number(spl[0])*2,
                            Speed:Utils.number(spl[1])*2,
                            Defense:Utils.number(spl[2])*2,
                            Dexterity:Utils.number(spl[3])*2
                        }};
                    return gymStat;
                },0);
            },
            poker: function() {
                return cachedValue('user/stats/poker',function(){
                    return {Score:Utils.number(getPageSync('poker').ui.pageContent.casino.poker.getScore())};
                });
            },
            roulette: function() {
                return cachedValue('user/stats/roulette',function() {
                    var stats = {};
                    getPageSync('roulettegame',{step:'showStatistic'}).ui.pageContent.casino.roulette.getStatistics().each(function(){
                        stats[$('td:eq(0)',this).text()] = Utils.number($('td:eq(1)',this).text());
                    });
                    return stats;
                });
            },
            faction: function() {
                return self.user.homeInfo()['Faction Information'];
            },
            recruit: function() {
                return cachedValue('user/stats/recruit',function() {
                    var players = [];
                    getPageSync('bringafriend').ui.pageContent.recruit.getPlayers().each(function(){
                        var tds = $(this).find('td');
                        players.push({
                            name: tds.eq(2).find('a').text(),
                            id: Utils.number(tds.eq(2).find('a').attr('href')),
                            level: Utils.number(tds.eq(3).text()),
                            lastonline: tds.eq(4).text(),
                            signedup: tds.eq(5).text(),
                            completion: Utils.number(tds.eq(6).text())
                        });
                    });
                    return players.sort(function(a,b) {
                        return b.level - a.level;
                    });
                },1,true);
            }
        },



        unlockables: {
            hasBazaar: function() {
                return self.user.pointsInfo()['Bazaar'].inactive;
            },
            hasDisplayCase: function() {
                return self.user.pointsInfo()['Display Cabinet'].inactive;
            },
            hasRacing: function() {
                return self.user.pointsInfo()['Racing Licence'].inactive;
            },
            hasStockTicker: function() {
                return self.user.pointsInfo()['Stock Ticker'].inactive;
            },
            hasCityWatch: function() {
                return self.user.pointsInfo()['City Watch'].inactive;
            },
            hasMuseum: function() {
                return $.inArray('+ Museum Unlocked',self.user.perks.education()) > -1;
            },
            hasSports: function() {
                return $.inArray('+ Sports Shop Unlocked',self.user.perks.education()) > -1;
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
                return cachedValue('user/donator/subscriber',function() {
                    return self.user.icons()['Subscriber'] != undefined;
                });
            },
            days: function() {
                return cachedValue('user/donator/days',function() {
                    return (self.user.icons()['Donator'] != undefined ? Utils.number(self.user.icons()['Donator']) : undefined) ;
                });
            }

        },

        gym: function() {
            return self.user.stats.gym()['Current'];
        }

    };
}