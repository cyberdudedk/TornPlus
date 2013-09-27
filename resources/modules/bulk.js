({
    bulkmuseum: new Func('Bulk exchange sets in Museum',function(page,qs){
        var items = this.module.stepItems()[qs.step];
        var userItems = Torn.user.items.list();
        var sets = Number.MAX_VALUE;
        for(var i in items) {
            var quan = ((userItems[items[i]] || {quantity:0}).quantity) / this.module.itemQuantity(items[i]);
            sets = Math.min(sets,quan);
        }
        var pointsPerSet = Utils.number(Torn.ui.content().filter('b:eq(1)').text());

        var slider = $('<div id="museum_slider" data-sets="'+sets+'"></div>');

        var bulkdiv = $('<div id="meseumbulk"></div>').append(
            $('<table></table>').attr({class:'data', border:"0", cellpadding:"0", cellspacing:"1"})
                .append($('<thead></thead>')
					.append($('<tr></tr>').attr({class:'bgDark ftWhite'})
						.append($('<th></th>').css({width:'75px'}).append('No. Sets'))
                        .append($('<th></th>').append('Quick Slider'))
						.append($('<th></th>').css({width:'100px'}).append('Total Points'))
						.append($('<th></th>').css({width:'120px'}).append('Bulk Exchange'))
					)
                )
                .append($('<tbody></tbody>')
                    .append($('<tr></tr>').attr({class:'bgAlt3'})
						.append($('<td></td>')
							.append($('<div></div>').attr({id:'museum_no'}).append(sets))
						)
                        .append($('<td></td>')
                            .append(slider)
						)
                        .append($('<td></td>')
							.append($('<div></div>').attr({id:'museum_points'}))
						)
                        .append($('<td></td>')
                            .append('[')
							.append($('<a></a>').attr('href','#').append('Exchange').click(function(){
                                var val = Utils.number($('#museum_no').text());
                                var href = Torn.ui.pageContent.museum.step.getExchangeLink().attr('href');
                                for(var i = 0; i<val;i++) {
                                    var page = getPageSync(href);
                                    var href = page.ui.pageContent.museum.step.getExchangeLink().attr('href');
                                    var msg = page.ui.pageContent.museum.step.getMessage();
                                    var msgType = 'info';
                                    if(msg.indexOf('You do not have the') > -1) msgType = 'bad';
                                    else if(msg.indexOf('You have exchanged') > -1) msgType = 'Good';
                                    notice(msg,msgType);
                                }
                                return false;
                            }))
                            .append(']')
						)
                    )
                )
        );

        Torn.ui.pageContent.museum.step.getNavigationTable().next().after(bulkdiv);

        sliderInPage = function(channel) {
            var slider = $('#museum_slider');
            var sets = slider.data('sets');
            slider.slider({
                value:sets, min: 0, max: sets, step: 1,
                slide: function( event, ui ) {
                    retrieve(channel,ui.value); /* Send value from page scope back to script */
			    }
            });
            return sets;
        }

        sliderCallback = function(value) {
            $('#museum_no').text(Utils.tornNumber(value));
            $("#museum_points" ).text(Utils.tornNumber(value * pointsPerSet));
        }

        /* Send to page scope in order to get access to jquery UI from page */
        Script.fromPage('slider',sliderInPage,sliderCallback);

    })
    .pages({'museum':{step:undefined}})
    .desc('Exchange several sets in Museum with one-click')
    .category('Bulk')

    ,

    stepItems: function() {
        return {
            1:[186, 187, 215, 258, 261, 266, 268, 269, 273, 274, 281, 384, 618],
            2:[260, 263, 264, 267, 271, 272, 276, 277, 282, 385, 617],
            3:[450, 451, 452],
            4:[454],
            5:[453],
            6:[458],
            7:[455, 456, 457],
            8:[460, 461, 462],
            9:[459]
        }
    },
    itemQuantity: function(id) {
        var arr = {460: 5, 461: 5}
        return arr[id] || 1;
    }

})