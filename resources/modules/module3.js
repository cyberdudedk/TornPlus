this.module3 = {   
    gym: {
        helper: new Func('GymHelper3',
        function(){
            log('gym helper from module3');
        }
    ).category('Gym').pages('gym')
    .desc('Gym Helper')
    }
}