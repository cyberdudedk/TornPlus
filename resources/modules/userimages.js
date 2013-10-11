({
    plususerimages: new Func('Advanced Profile Image controls',function(page,qs){
        var img = Torn.ui.pageContent.userimages.viewimage.getImage();

        img.parent().wrap('<div class="plus_profile_image_overlay"></div>');
        var overlay = img.parent().parent();
        var controls = $('<div class="image_controls"></div>').prependTo(overlay);
        var top = $('<div class="image_control control_top"></div>').appendTo(controls);
        var left = $('<div class="image_control control_sides control_left"></div>').appendTo(controls);
        var right = $('<div class="image_control control_sides control_right"></div>').appendTo(controls);

        $('<span>[Google search]</span>').appendTo(top).click(function() {
            window.open('https://www.google.com/searchbyimage?&image_url=' + img.attr('src'), '_blank');
        });


        $('<span>[Open Image]</span>').appendTo(top).click(function() {
            window.open(img.attr('src'), '_blank');
        });

        left.append('<div class="control_inner">&lt;&lt;</div>');
        right.append('<div class="control_inner">&gt;&gt;</div>');

        overlay.width(img.width());

        var browse = function(step) {
            var page = getPageSync('userimages.php',{XID:qs.XID});
            var images = page.ui.pageContent.userimages.getImages();

            var index = images.index(images.filter('a[href*="&ID='+qs.ID+'"]')) + step;
            if(index > images.size()-1) index = 0;
            else if(index < 0) index = images.size()-1;

            document.location.href = images.eq(index).attr('href');
        }

        left.click(function(){
            browse(-1);
        });

        right.click(function(){
            browse(1);
        });

        Script.keyboard(37,function(){
            browse(-1);
        });

        Script.keyboard(39,function(){
            browse(1);
        })
    })
    .pages({'userimages':{'step':'viewimage'}})
    .desc('Enable some features when watching user\'s profile images, hover to see the controls')
    .category('UI')



})