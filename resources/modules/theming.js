({
    themes: new Func('Enable Themes',function(){
        if(typeof(this.Theme) != 'undefined') {
            var file = 'modules/themes/'+this.Theme+'/theme.css';
            appAPI.resources.includeCSS(file);
        }
    })
    .pages('allpages')
    .desc('Enable one of these themes, that can override the visual layout of Torn<br>Works best with Ajaxify as the theme won\'t have to inserted all the time<br>On normal the theme change is very visible')
    .category('Theme')
    .on('load')
    .option('Theme','dropdown',null,{'blue':'Blue Theme','red':'Red Theme'})

})