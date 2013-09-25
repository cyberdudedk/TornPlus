({
    stockblockcost: new Func('Stock Block Cost',function(page,qs){
        var blockshares = {1:4000000,2:1500000,3:3000000,4:1500000,5:3000000,6:500000,
        7:150000,8:1000000,9:125000,10:5000000,11:300000,12:6000000,13:1000000,14:100000,
        15:2000000,16:500000,17:100000,18:1500000,19:2000000,20:1000000,21:5000000,22:1500000,
        23:2500000,25:100000,26:100000,27:3000000,28:1750000,29:1750000,30:9000000,31:350000};

        var blocknum = blockshares[qs.stock];
        if(blocknum) {
            var tbl = Torn.ui.pageContent.stock.profile.getPriceTable()
            var price = Utils.number(tbl.find('tr:eq(0)').text());
            var blockprice = Utils.tornNumber(blocknum * price);
            tbl.append('<tr><td colspan="2"><hr width="100%"></td></tr><tr><td><b>Block cost:</b></td><td>$'+blockprice+'</td></tr>');
        }
    })
    .desc('Show the price of benefit blocks in the stock market')
    .category('Misc')
    .pages({'stockexchange':{step:'profile'}})
    ,

    stockprofit: new Func('Stock Profit/Loss in portfolio',function(page,qs){
        var stocks = Torn.ui.pageContent.stock.portfolio.getStockRows();
        for(var i in stocks){
            var stock = stocks[i];
            var worth = Utils.number(stock.eq(1).find('td:eq(0)').text());
            var amount = Utils.number(stock.eq(1).find('td:eq(1)').text());
            var originalprice = Utils.number(stock.eq(0).find('td:eq(2)').text());
            var profit = Utils.tornNumber(worth - (amount*originalprice),0);
            stock.eq(1).find('td:eq(2) font').prepend('$' + profit + ' ');
        }
    })
    .desc('Show the profit or loss for each transaction in your stock portfolio')
    .category('Misc')
    .pages({'stockexchange':{step:'portfolio'}})
})
