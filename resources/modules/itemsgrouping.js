({
    itemsgrouping: new Func('Group items inventory',function(){
        var itemGroups = Script.getDataList('itemsGroups');
        var groups = this.Groups;
        var reverseLookup = {};
        for(var outer in itemGroups) {
            for(var inner in itemGroups[outer]) {
                for(var i in itemGroups[outer][inner]) {
                    reverseLookup[itemGroups[outer][inner][i]] = {outer:outer,inner:inner};
                }
            }
        }

        var itemTbls = Torn.ui.content().find('.data');
        var itemRows = itemTbls.find('tbody tr');

        itemRows.each(function(){
            var id = Utils.number($(this).find('td:first a:first').attr('href'));
            var reverse = reverseLookup[id];
            if(typeof(groups[reverse.outer][reverse.inner]) != 'object') {
                groups[reverse.outer][reverse.inner] = [];
            }
            groups[reverse.outer][reverse.inner].push($(this));
        });

        /* TODO: Clean up if possible */
        var firstTbl = itemTbls.eq(0);
        for(var outer in groups)
        {
            var addTable = false;
            var tbl = $('<table></table>').addClass('data')
                .attr({'width':'90%','cellspacing':1,'cellpadding':0,'border':0})
            var thead = $('<thead></thead>').appendTo(tbl);
            var tbody = $('<tbody></tbody>').appendTo(tbl);

            $('<tr></tr>').addClass('bgDark ftWhite')
                .append($('<th>'+outer+'</th>').attr('width','60%'))
                .append($('<th>Type</th>').attr('width','13%').css('text-align','center'))
                .append($('<th>Value</th>').attr('width','13%').css('text-align','right'))
                .appendTo(thead);

            for(var inner in groups[outer])
            {
                if(typeof(groups[outer][inner]) == 'object') {
                    addTable = true;
                    var innertd = $('<td></td>').attr('colspan',3).appendTo($('<tr></tr>').appendTo(tbody));
                    var innertbl = $('<table></table>').addClass('data subdata')
                        .attr({'width':'100%','cellspacing':1,'cellpadding':0,'border':0})
                        .appendTo(innertd);

                    $('<tr></tr>').addClass('bgDark ftWhite')
                        .append($('<th>'+inner+'</th>').attr('width','60%'))
                        .append($('<th>Type</th>').attr('width','13%').css('text-align','center'))
                        .append($('<th>Value</th>').attr('width','13%').css('text-align','right'))
                        .appendTo($('<thead></thead>').appendTo(innertbl));

                    var innerbody = $('<tbody></tbody>').appendTo(innertbl);
                    for(var itemNum in groups[outer][inner]) {
                        innerbody.append(groups[outer][inner][itemNum])
                    }
                }
            }
            if(addTable)
                tbl.insertBefore(firstTbl);
        }

        itemTbls.last().parent().find('hr').remove();
        itemTbls.remove();
    })
    .pages('item')
    .category('Group Items')
    .desc('Group items inventory into categories')
    .options(function(){
            return [new Option('Groups','sortinglist',Script.getDataList('itemsGroups'))];
        })
})