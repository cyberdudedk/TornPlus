
/* Main script class, containg functionality to handle module loading, registering, running etc. */
Script = {
    devFiles: (typeof(devFiles) != 'undefined' ? devFiles : []),
    forceRegisterAll: false,
    loadedModules: {},
    modulePages: {},
    moduleInfos: {},
    /* For unknown reasons creating this here, outside of appAPI.ready crashes        
    loadModule: function(mod){
        appAPI.resources.includeJS('modules/'+mod+'.js');
    },*/
    getModulePages: function() {
        var pages = appAPI.db.get('modulePages');
        if(pages == null || this.forceRegisterAll == true) {
            this.registerAndStoreModules();
            pages = this.modulePages;
        }
        return pages;
    },
    getModuleInfos: function() {
        var infos = appAPI.db.get('moduleInfos');
        if(infos == null || this.forceRegisterAll == true) {
            this.registerAndStoreModules();
            infos = this.moduleInfos;    
        }
        return infos;
    },
    registerAndStoreModules: function() {
        this.registerAllModules();
        pages = this.modulePages;
        moduleInfos = this.moduleInfos;
        appAPI.db.set('modulePages',pages);
        appAPI.db.set('moduleInfos',moduleInfos);
    },
    
    run: function(){
        var options = appAPI.db.get('moduleOptions') || {};
        var enabledFunc = options['enabled'] || {};
        var funcOptions = options['options'] || {};
        
        var call, func, typ, fId;        
        var pages = this.getModulePages();
        var page = location.pathname.substring(location.pathname.lastIndexOf('/')+1).split('.')[0];
        var qs = Utils.querystringToObject(location.search.substring(location.search.indexOf('?')+1));
        var pageFuncs = (pages["allpages"] || []).concat(pages[page] || []);
        for(var f in pageFuncs) {
            var pageFunc = pageFuncs[f];
            if(enabledFunc[pageFunc] == true) {
                var arr = pageFunc.split('/');
                var mod = arr.shift();
                if(this.loadedModules[mod] == undefined) {
                    this.loadModule(mod);
                }
                call = this[mod];
                for(fId in arr) {
                    typ = typeof(call[arr[fId]]);
                    if(typ == 'function' || typ == 'object')
                        call = call[arr[fId]];
                    else {
                        log('Failed1 to call ' + pageFunc + ' function');
                        break;
                    }
                }
                if(call != this[mod] && typeof(call) == 'object' && call instanceof Func)                 {
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
                    this.recursiveLoadModule(funcName,func)
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
            this.loadModule(mod);
            call = this[mod];
            this.recursiveLoadModule(mod,call);
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
    }
}