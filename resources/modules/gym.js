({
    gymhelper: new Func('Gym Helper', function(){
        var gains = Torn.user.gym().gains,
            boxes = Torn.ui.pageContent.gym.getStatBoxes(),
            colors = ['green','yellow','orange','red'],
            ids = ['Strength','Speed','Defense','Dexterity'],
            arr = [], pairs = {};
        for(i in ids) {
            var num = Number(gains[ids[i]]);
            if(!pairs[num]) pairs[num] = [];
            pairs[num].push(boxes.eq(i));
        }
        for(var n in pairs) {
            arr.push({num:Number(n),divs:pairs[n]});
        }
        arr.sort(function(a,b){
            return b.num - a.num;
        });
        for(var i in arr) {
            var p = arr[i];
            if(p.num != '0')
                for(var d in p.divs)
                    p.divs[d].find('.divHeader').css('color',colors[i]).append(p.num.toFixed(1));
        }
    })
    .category('UI')
    .desc('Help out determine which Stat to train in your active Gym. Using colors to signal most effective to least effective<br>Green = Most effect<br>Yellow = Second most effect<br>Orange = Second least effect<br>Red = Least effective')
    .pages('gym')

})