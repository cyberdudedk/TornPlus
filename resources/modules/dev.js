({
    enabledev: new Func('Enable Developer Mode',function() {

        if(!Script.Dev.getDebugMode() && this.enablelocaldev)
        {
            //Enable Debug mode
            Script.Dev.setPath(this.localwebpath);
            Script.Dev.setDebugMode(true);
        }
        else if(Script.Dev.getDebugMode() && !this.enablelocaldev)
        {
            
            //Disable Debug mode
            Script.Dev.setDebugMode(false);
        }
        else if(Script.Dev.getPath() != this.localwebpath) {
            Script.Dev.setPath(this.localwebpath);
        }
        if(this.reloadBGonrefresh) {
            Script.Dev.loadBackground();
        }
    })
    .category('Dev')
    .pages('allpages')
    .desc('Enable local Developer Mode')
    .option('enablelocaldev','boolean',false)
    .option('localwebpath','string',Script.Dev.getPath())
    .option('reloadBGonrefresh','boolean',false)
});