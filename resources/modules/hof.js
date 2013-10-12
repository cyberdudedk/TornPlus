({  //TODO: Clean up
    plushof: new Func("Torn Plus Hall of Fame", function(page,qs) {
        var navigation = Torn.ui.pageContent.newspaper.hof.getNavigationTable();
        var newrow = $('<tr></tr>').appendTo(navigation);
        var td = $('<td></td>')
            .appendTo(newrow)
            .attr({'width':'20%','align':'center'});
        td.append('> ');
        $('<a href="halloffame.php?tornplus&plusstep=hof">Torn Plus HoF</a>').appendTo(td);

        var td2 = $('<td></td>')
            .appendTo(newrow)
            .attr({'width':'20%','align':'center'});
        td2.append('> ');
        $('<a href="halloffame.php?tornplus&plusstep=personalhof">Torn Plus Personal HoF</a>').appendTo(td2);

        if(typeof(qs.tornplus) != 'undefined') {
            if(qs.plusstep == 'hof') {
                this.module.hofbytype();
            } else if(qs.plusstep == 'personalhof') {
                this.module.personalhof();
            }
        }

    })
    .pages('halloffame')
    .desc('Enable Torn Plus HoF in the Hall of Fame section of the newspaper')
    .category('Misc'),

    //TODO: Clean up
    //TODO: "Loading" text, that explains that it can take up to 2 minutes.
    hofbytype: function() {
        var limits = [10,20,50,100,200];
        var keyvalues = Script.getDataList('hofkeys');
        var defaultLimit = 20;
        var hr = Torn.ui.content().find('hr:last');
        var div = $('<div class="tornplus_hof"></div>').insertAfter(hr);

        var select = $('<select></select>').appendTo(div);
        $('<option value="">Select value</option>').appendTo(select);
        keyvalues.forEach(function(v,i){
            $('<option></option>').val(v).text(v).appendTo(select);
        })
        div.append(' Results: ');

        var selectlimit = $('<select></select>').appendTo(div);
        limits.forEach(function(v,i){
            $('<option></option>').val(v).text(v).prop('selected',v==defaultLimit).appendTo(selectlimit);
        });

        var tablediv = $('<div class="tornplus_hof_tablediv"></div>').appendTo(div);

        var updateResults = function() {

            var val = select.val();
            var limit = selectlimit.val();
            if(val != "") {
                var userid = Torn.user.id();
                var url = 'http://pb-software.net/tornplus/api.php?function=hof&id=' + userid + '&type=' + val + '&limit=' + limit;
                appAPI.request.get({url:url, onSuccess: function(response){
                    tablediv.html('');
                    var json = appAPI.JSON.parse(response);
                    var tblList = $('<table></table>').attr({width:"90%", cellspacing:"1", cellpadding:"2", border:"0"}).appendTo(tablediv);
                    var rowheader = $('<tr></tr>').attr('bgcolor','#999999').appendTo(tblList);

                    $('<td><b>Pos</b></td>').appendTo(rowheader);
                    $('<td><b>Player</b></td>').attr('align','center').appendTo(rowheader);
                    $('<td><b>'+val+'</b></td>').attr('align','center').appendTo(rowheader);
                    var count = 0;
                    $.each(json, function(i, item) {
                        var bgcol = (count % 2 == 0 ? '#DFDFDF' : '#CCCCCC');
                        if(item.self) {
                            bgcol = (count % 2 == 0 ? '#DFF0DF' : '#CCDCCC');
                        }
                        var row = $('<tr></tr>').attr('bgcolor',bgcol).appendTo(tblList);
                        $('<td><b># '+item.position+'</b></td>').appendTo(row);
                        $('<td><b><a href="profiles.php?XID='+item.id+'">'+item.name+'</a></b></td>').attr('align','center').appendTo(row);
                        $('<td>'+item.value+'</td>').attr('align','center').appendTo(row);
                        count++;
                    });

                    var rowbottom = $('<tr></tr>').attr('bgcolor','#999999').appendTo(tblList);
                    $('<td></td>').attr({align:"center",height:"10", colspan:"7"}).appendTo(rowbottom).append('&nbsp;');
                }})
            }
            else {
                tablediv.html('');
            }
        }

        select.change(function(){
            updateResults();
        });

        selectlimit.change(function(){
            updateResults();
        });

        div.after('<hr width="90%">');
    },

    personalhof: function() {
        var hr = Torn.ui.content().find('hr:last');
        var div = $('<div class="tornplus_hof"></div>').insertAfter(hr);
        var tablediv = $('<div class="tornplus_hof_tablediv"></div>').appendTo(div);
        tablediv.html('Loading... Please wait while server is generating data, this can take up to 2 minutes.<br>You are welcome to navigate to another page and come back later, the data should then be ready for you.');
        var userid = Torn.user.id();
        var url = 'http://pb-software.net/tornplus/api.php?debug=true&function=myhof&id=' + userid;
        appAPI.request.get({url:url, onSuccess: function(response){
            var json = appAPI.JSON.parse(response);
            tablediv.html('');
            var tblList = $('<table></table>').attr({width:"90%", cellspacing:"1", cellpadding:"2", border:"0"}).appendTo(tablediv);
            var rowheader = $('<tr></tr>').attr('bgcolor','#999999').appendTo(tblList);
            $('<td><b>Stat</b></td>').appendTo(rowheader);
            $('<td><b>Position</b></td>').attr('align','center').appendTo(rowheader);
            $('<td><b>Value</b></td>').attr('align','center').appendTo(rowheader);
            var count = 0;
            $.each(json, function(i, item) {
                var bgcol = (count % 2 == 0 ? '#DFDFDF' : '#CCCCCC');
                var row = $('<tr></tr>').attr('bgcolor',bgcol).appendTo(tblList);
                $('<td><b>'+item.keyname+'</b></td>').appendTo(row);
                $('<td><b>'+item.position+'</b></td>').attr('align','center').appendTo(row);
                $('<td>'+item.value+'</td>').attr('align','center').appendTo(row);
                count++;
            });

            var rowbottom = $('<tr></tr>').attr('bgcolor','#999999').appendTo(tblList);
            $('<td></td>').attr({align:"center",height:"10", colspan:"7"}).appendTo(rowbottom).append('&nbsp;');

        }})
    }


})