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
    this.pages = function(pages) {
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