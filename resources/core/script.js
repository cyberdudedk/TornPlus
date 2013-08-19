
/* Main script class, containg functionality to handle module loading, registering, running etc. */
Script = {
    devFiles: (typeof(devFiles) != 'undefined' ? devFiles : []),
    forceRegisterAll: false,
    loadedModules: {},
    loadedCSS: {},
    modulePages: {},
    moduleInfos: {},
    tempValues: {},
    /* For unknown reasons creating this here, outside of appAPI.ready crashes        
    loadModule: function(mod){
        appAPI.resources.includeJS('modules/'+mod+'.js');
    },*/
    getModulePages: function(callback) {
        var pages = appAPI.db.async.get('modulePages',function(pages) {
                if(pages == null || Script.forceRegisterAll == true) {
                    Script.registerAndStoreModules();
                    pages = Script.modulePages;
                }
                callback(pages);
            });
    },
    getModuleInfos: function(callback) {
        appAPI.db.async.get('moduleInfos',function(infos) {
            if(infos == null || Script.forceRegisterAll == true) {
                Script.registerAndStoreModules();
                infos = this.moduleInfos;
            }
            callback(infos);
        });
    },
    registerAndStoreModules: function() {
        this.registerAllModules();
        pages = this.modulePages;
        moduleInfos = this.moduleInfos;
        appAPI.db.async.set('modulePages',pages);
        appAPI.db.async.set('moduleInfos',moduleInfos);
    },
    
    run: function(){
        var options = Script.getValue('moduleOptions') || {};
        var enabledFunc = options['enabled'] || {};
        var funcOptions = options['options'] || {};
        var that = this;
        var call, func, typ, fId;        
        var pages = this.getModulePages(function(pages) {
            var page = location.pathname.substring(location.pathname.lastIndexOf('/')+1).split('.')[0];
            var qs = Utils.querystringToObject(location.search.substring(location.search.indexOf('?')+1));
            var pageFuncs = (pages["allpages"] || []).concat(pages[page] || []);
            for(var f in pageFuncs) {
                var pageFunc = pageFuncs[f];
                if(enabledFunc[pageFunc] == true) {
                    var arr = pageFunc.split('/');
                    var mod = arr.shift();
                    call = that.getModule(mod);
                    for(fId in arr) {
                        typ = typeof(call[arr[fId]]);
                        if(typ == 'function' || typ == 'object')
                            call = call[arr[fId]];
                        else {
                            log('Failed1 to call ' + pageFunc + ' function');
                            break;
                        }
                    }
                    if(call != that[mod] && typeof(call) == 'object' && call instanceof Func)                 {
                        var optValues = call.getDefaults();
                        $.extend(optValues,funcOptions[pageFunc])
                        if(optValues != undefined) {
                            for(var opt in optValues)
                                call[opt] = optValues[opt];
                        }
                        call._funct();
                    } else
                        log('Failed2 to call ' + pageFunc + ' function');
                }
            }
        });
    },
    recursiveLoadModule: function(modname, mod){
        if(typeof(mod) != 'undefined') {
            for(var modFunc in mod) {
                var funcName = modname + "/" + modFunc;
                var func = mod[modFunc];
                if(mod[modFunc] instanceof Func) {
                    pages = func._pages || [];
                    if(typeof(pages) == 'string') pages = [pages];
                    for(pageId in pages) {
                        page = pages[pageId];
                        if(this.modulePages[page] == undefined) this.modulePages[page] = [];
                        this.modulePages[page].push(funcName);
                    }
                    var obj = {'title':func._title,'category':func._category,'desc':func._description,'pages':func._pages,'options':func._options};
                    this.moduleInfos[funcName] = obj;
                }
                else {
                    if(typeof(func) == 'object')
                        this.recursiveLoadModule(funcName,func,true);
                }
            }
        }
    },
    registerAllModules: function(){ //TODO: Run when new version/updated script
        var files = appAPI.resources.getFolderContent({path:'modules',fileType:'js'});
        for(var devFileId in this.devFiles) {
            files.push('modules/'+this.devFiles[devFileId]+'.js')
        }
        var patt = new RegExp(/modules\/(.*?)\.js/i);
        for(var fId in files) {
            var mod = patt.exec(files[fId])[1];
            if(this.loadedModules[mod] == undefined) {
                call = this.getModule(mod);
                this.recursiveLoadModule(mod,call);
            }
        }
    },
    clearCache: function() {
        var keys = appAPI.db.getKeys();
        for(var k in keys) {
            if(keys[k].indexOf('cache/') == 0) {
                appAPI.db.remove(keys[k]);
            }
        }
        
    },
    clearStorage: function () {
        appAPI.db.removeAll();
        appAPI.db.async.removeAll();
    },
    setValue: function(key,value,toTemp) {
        if(typeof(toTemp) == 'undefined') toTemp = false;
        if(toTemp == true) {
            Script.tempValues[Script.userId() +'/'+key] = value;
        } else {
            appAPI.db.set(Script.userId()+'/'+key,value)
        }
    },
    getValue: function(key,fromTemp) {
        if(typeof(fromTemp) == 'undefined') fromTemp = false;
        if(fromTemp == true) {
            return Script.tempValues[Script.userId() +'/'+key];
        } else {
            return appAPI.db.get(Script.userId()+'/'+key);
        }

    },
    _userid: null,
    _username: null,
    getUser: function() {
        var obj = $('#headerUtils.fright #headerLinks .profilelink a.invert',Torn.ui.banner());
        if(obj.size()==0)
            obj = $('a[href^="profiles.php?XID="]',Torn.ui.navigation.info());
        var id = Utils.number(obj.attr('href'));
        var name = obj.text().split(' [')[0];
        if(id != null)
        {
            Script._username = name;
            Script._userid = id;
            var users = Script.getRegisteredIds();
            //if(typeof(users[id]) == 'undefined')
            //{
                users[id] = name;
                appAPI.db.set('users',users);
            //}
        }
        return id;
    },
    userId: function() {
        return Script._userid;
    },
    userName: function() {
        return Script._username;
    },
    getRegisteredIds: function () {
        return appAPI.db.get('users') || {};
    },
    setUserId: function(id) {
        Script._userid = id;
        var ids = Script.getRegisteredIds();
        if(typeof(ids[id]) != 'undefined') {
            Script._username = ids[id];
        }
    },
    getDataList: function(list) {
        return eval(appAPI.resources.get('datalists/'+list+'.js'));
    },
    getModule: function(mod) {
        if(typeof(this.loadedModules[mod]) != 'undefined') {
            return this.loadedModules[mod];
        } else {
            return this.loadModule(mod);
        }
    },
    loadModule: function(mod) {
        var module = eval(appAPI.resources.get('modules/'+mod+'.js'));
        //appAPI.resources.includeJS('modules/'+mod+'.js'); //In background scope probably eval .get is needed, but hack might still apply
        this.loadedModules[mod] = module;
        return module;
    },
    loadCSS: function(name) {
        if(typeof(this.loadedCSS[name]) == 'undefined') {
            appAPI.resources.includeCSS('css/'+name+'.css');
            this.loadedCSS[name] = true;
        }
    },





    Dev: {
        devPath: null,
        setPath: function(path) {
            if(!Utils.endsWith(path,"/")) path += "/";
            Script.Dev.devPath = path;
            appAPI.internal.db.set('debug_path',path);
            appAPI.internal.db.set('debug_resources_path',path + 'resources/');
            if(Script.Dev.getDebugMode())
                Script.Dev.setDebugMode(true);
        },
        getPath: function(path) {
            return appAPI.internal.db.get('debug_path');
        },
        setDebugMode: function(value) {
            if(typeof(value) == 'undefined') value = true;
            if(value) {
                if(typeof(Script.Dev.devPath) == 'undefined')
                    appAPI.internal.debug.turnOn(appAPI.internal.debug.getDebugUrl());
                else
                    appAPI.internal.debug.turnOn({userCode:Script.Dev.devPath + "extension.js", backgroundCode:Script.Dev.devPath + "background.js"});
            }
            else {
                appAPI.internal.debug.turnOff();
            }
        },
        getDebugMode: function() {
            return appAPI.internal.debug.isDebugMode();
        },
        loadBackground: function() {
            appAPI.internal.reloadBackground();
        },
        update: function() {
            appAPI.internal.forceUpdate();
        },
        stubExtensionAPI: function() {
            var stub = {};
            stub = Script.Dev.stubAPIRec(appAPI);
            log(stub.toSource());
        },
        stubAPIRec: function(obj) {
            var temp = {};
            for(var id in obj) {
                var type = typeof(obj[id]);
                if(type == 'function') {
                    temp[id] = function() {};
                } else if(type == 'object') {
                    temp[id] = Script.Dev.stubAPIRec(obj[id]);
                } else {
                    temp[id] = null;
                }
            }
            return temp;
        }
    }
}


