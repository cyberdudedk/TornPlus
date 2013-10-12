({
    extenditempages: new Func('Extended Item Pages',function(page,qs) {

        if(page == 'iteminfo') {
            var content = Torn.ui.pageContent.iteminfo.getInfoTable().parent();
            this.module.helpers.generateMarket(qs.XID).appendTo(content);
        } else if(page == 'imarket') {
            var content = Torn.ui.content().filter('table.list').eq(0).parent();
            var id;
            if(qs.type) {
                id = qs.type;
            } else if(qs.searchname) {
                var a = $('a[href^="iteminfo.php?"]:first',Torn.ui.content());
                if(a.size() >= 1) {
                    id = Utils.number(a.prop('href'));
                } else {
                    var img = $('img[src^="images/items/"]:first',Torn.ui.content());
                    if(img.size() > 0) {
                        id = Utils.number(img.prop('src'));
                    } else {
                        var datalist = Script.getDataList('items');
                        var name = Torn.ui.content().filter('.list:first').find('center').textOnly().replace('There are','').replace('items available','').trim();
                        for(id in datalist) {
                            if(name == datalist[id]) break;
                        }
                    }
                }
            }
            this.module.helpers.generateItemInfo(id).appendTo(content);
        }
    })
    .category('items')
    .desc('Include Item market on Item info<br>And Item info on Item Market')
    .pages({'iteminfo':{},'imarket':{'step':'shop'}})

    ,

    searchitems: new Func('Search for items', function(){
        var searchForm = Torn.ui.searchForm();
        var searchSelector = searchForm.find('#mode');
        searchSelector.append('<option value="itemmarket">Item Market</option>');

        searchSelector.change(function(){
            var searchType = $(this).val();
            if(searchType == 'itemmarket') {
                searchForm.get(0).setAttribute('action','/imarket.php?step=shop&submit=Search');
                searchForm.find('#userword').attr('name', 'searchname');
                searchForm.append('<input type="hidden" name="step" value="shop" />');
            } else {
                searchForm.find('input[type="hidden"]').remove();
            }
        })
    })
    .category('items')
    .desc('Add an option to search for an item name in the search box in the top bar')
    .pages('allpages')


    ,

    helpers: {
        generateMarket: function(id) {
            var market = $("<div id=\"market_item\"></div>");
            if(!isNaN(parseInt(id))) {
                var page = getPageSync('imarket',{step:'shop',type:id})
                var data = page.ui.content().filter('table.list').eq(0).parent().enableImgs();
                data.html(data.html().replace(/&gt;/g,''));
                data.find('a[href="imarket.php"]').each(function() {
                    $(this).prev().remove().end().next().remove().end().remove();
                });
                market.append(data.html());
            }
            return market;
        },
        generateItemInfo: function(id) {
            var iteminfo =  $("<div id=\"iteminfo_item\"><h3>Item Info<h3/></div>");//.appendTo(table.parent());
            if(!isNaN(parseInt(id))) {
                var table = getPageSync('iteminfo',{XID:id}).ui.content().filter('.data').enableImgs();
                iteminfo.append(table);
            }
            return iteminfo;
        }
    }
})