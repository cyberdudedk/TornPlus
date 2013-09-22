/*
 Examples of Options vars to be implemented, datatypes should be used in popup/settings to generated a UI component for the "datatype"
 Name, Datatype, Default, Min Max on numbers
  
 var1, 'string', 'test'
 var2, 'int', 5
 var3, 'int', 5, 0, 10
 var3, 'int', [5, 0, 10]
 var3, 'int', {value:5, min:0, max:10}
 var4, 'bool', 0
 var5, 'float', 0.5, 0, 0.8
 var6, 'color', '00ff00'
 var7, 'select', ['test1','test2']
 var8, 'select', {1:'test1',2:'test2'}
 var9, 'radio', {1:'test1',2:'test2'}
*/

/* Base wrapper class for module functions */
Func = function(title,f) {
    this.module = {};
    this._onLoad = false;
    
    this._setModule = function(mod) {
        this.module = mod;
        return this;
    }

    this.pages = function(pages,params) {
        this._pages = pages;
        return this;
    }
    
    this.category = function(cat) {
        this._category = cat;
        return this;
    }
    
    this.desc = function(description) {
        this._description = description;
        return this;
    }
    
    this.option = function(name,type,value,min,max) {
        if(typeof(this._options) == 'undefined') this._options = [];
        this._options.push(Option(name,type,value,min,max));
        return this;
    }
    
    this.options = function(options) {
        this._options = options;
        return this;
    }
    
    this.func = function(funct) {
        this._funct = funct;
        return this;
    }

    this.title = function(title) {
        this._title = title;
        return this;
    }

    this.on = function(onAction) {
        if(typeof(onAction) != 'array') onAction = [onAction];
        this._on = onAction;

        for(var i in onAction) {
            var act = onAction[i];
            switch(act) {
                case 'load':
                    this._onLoad = true;
                break;
            }
        }

        return this;
    }


    
    this.getDefaults = function() {
        var def = {};
        for(var o in this._options) {
            def[this._options[o].name] = this._options[o].value;
        }
        return def;
    }

    if(typeof(f) != 'undefined')
        this.title(title);
    if(typeof(f) != 'undefined')
        this.func(f);   
};

/* Option Datastructure used in setting options for modules Func */
Option = function(name,type,value,min,max) {
    var obj = {'name':name};
    obj['type'] = type;
    obj['value'] = value;
    if(typeof(min) != 'undefined') obj['min'] = min;
    if(typeof(max) != 'undefined') obj['max'] = max;
    return obj;
}


  ajaxClass = function() {
                this.buckets = {};
                this.ajaxFunc = function(funcName, onlyAjax) {
                    return this.add('ajaxFunc',funcName, onlyAjax);
                }

                this.localJS = function(jsName, onlyAjax) {
                    return this.add('localJS',jsName, onlyAjax);
                }

                this.tornJS = function(path, onlyAjax) {
                    return this.add('tornJS',path, onlyAjax);
                }

                this.localCSS = function(cssName, onlyAjax) {
                    return this.add('localCSS',cssName, onlyAjax);
                }

                this.tornCSS = function(path, onlyAjax) {
                    return this.add('tornCSS',path, onlyAjax);
                }

                this.add = function(bucketName, value, onlyAjax) {
                    if(typeof(onlyAjax) == 'undefined') onlyAjax = false;
                    if(typeof(this.buckets[bucketName]) == 'undefined') this.buckets[bucketName] = [];
                    this.buckets[bucketName].push({value:value,onlyAjax:onlyAjax});
                    return this;
                }
            }