/* TODO: Shoplifting has an extra depth that is currently missing here */
({
    'Search for cash': {
        key: 'searchstreets',
        crimes: [{
            text: 'Search the train station',
            key: 'searchtrainstation',
            nerve: 2,
            page: 2
        }, {
            text: 'Search under the old bridge',
            key: 'searchbridge',
            nerve: 2,
            page: 2
        }, {
            text: 'Search the bins',
            key: 'searchbins',
            nerve: 2,
            page: 2
        }, {
            text: 'Search the water fountain',
            key: 'searchfountain',
            nerve: 2,
            page: 2
        }, {
            text: 'Search the dumpsters',
            key: 'searchdumpster',
            nerve: 2,
            page: 2
        }, {
            text: 'Search movie theater',
            key: 'searchmovie',
            nerve: 2,
            page: 2
        }]
    },
    'Sell copied media': {
        key: 'sellcopiedcds',
        crimes: [{
            text: 'Rock CDs',
            key: 'cdrock',
            nerve: 3,
            page: 2
        }, {
            text: 'Heavy Metal CDs',
            key: 'cdheavymetal',
            nerve: 3,
            page: 2
        }, {
            text: 'Pop CDs',
            key: 'cdpop',
            nerve: 3,
            page: 2
        }, {
            text: 'Rap CDs',
            key: 'cdrap',
            nerve: 3,
            page: 2
        }, {
            text: 'Reggae CDs',
            key: 'cdreggae',
            nerve: 3,
            page: 2
        }, {
            text: 'Horror DVDs',
            key: 'dvdhorror',
            nerve: 3,
            page: 2
        }, {
            text: 'Action DVDs',
            key: 'dvdaction',
            nerve: 3,
            page: 2
        }, {
            text: 'Romance DVDs',
            key: 'dvdromance',
            nerve: 3,
            page: 2
        }, {
            text: 'Sci Fi DVDs',
            key: 'dvdsci',
            nerve: 3,
            page: 2
        }, {
            text: 'Thriller DVDs',
            key: 'dvdthriller',
            nerve: 3,
            page: 2
        }]
    },
    'Shoplift': {
        key: 'shoplift',
        crimes: [{
            text: 'Sweet shop',
            key: 'sweetshop',
            nerve: 4,
            page: 3
        }, {
            text: 'Market stall',
            key: 'marketstall',
            nerve: 4,
            page: 3
        }, {
            text: 'Clothes shop',
            key: 'clothesshop',
            nerve: 4,
            page: 3
        }, {
            text: 'Jewellery shop',
            key: 'jewelryshop',
            nerve: 4,
            page: 3
        }]
    },
    'Pickpocket someone': {
        key: 'pickpocket',
        crimes: [{
            text: 'Hobo',
            key: 'hobo',
            nerve: 5,
            page: 4
        }, {
            text: 'Kid',
            key: 'kid',
            nerve: 5,
            page: 4
        }, {
            text: 'Old woman',
            key: 'oldwoman',
            nerve: 5,
            page: 4
        }, {
            text: 'Businessman',
            key: 'businessman',
            nerve: 5,
            page: 4
        }, {
            text: 'Lawyer',
            key: 'lawyer',
            nerve: 5,
            page: 4
        }, {
            text: 'Loan shark',
            key: 'tim',
            nerve: 5,
            page: 4
        }]
    },
    'Larceny': {
        key: 'larceny',
        crimes: [{
            text: 'Apartment',
            key: 'apartment',
            nerve: 6,
            page: 4
        }, {
            text: 'Detached house',
            key: 'house',
            nerve: 6,
            page: 4
        }, {
            text: 'Mansion',
            key: 'mansion',
            nerve: 6,
            page: 4
        }, {
            text: 'Cars',
            key: 'cartheft',
            nerve: 6,
            page: 4
        }, {
            text: 'Office',
            key: 'office',
            nerve: 6,
            page: 4
        }]
    },
    'Armed Robberies': {
        key: 'robsweetshop',
        crimes: [{
            text: 'Swift robbery',
            key: 'swiftrobbery',
            nerve: 7,
            page: 4
        }, {
            text: 'Thorough robbery',
            key: 'thoroughrobbery',
            nerve: 7,
            page: 4
        }, {
            text: 'Swift Convenience',
            key: 'swiftconvenient',
            nerve: 7,
            page: 4
        }, {
            text: 'Thorough Convenience',
            key: 'thoroughconvenient',
            nerve: 7,
            page: 4
        }, {
            text: 'Swift Bank',
            key: 'swiftbank',
            nerve: 7,
            page: 4
        }, {
            text: 'Thorough Bank',
            key: 'thoroughbank',
            nerve: 7,
            page: 4
        }, {
            text: 'Swift Armored Car',
            key: 'swiftcar',
            nerve: 7,
            page: 4
        }, {
            text: 'Thorough Armored Car',
            key: 'thoroughcar',
            nerve: 7,
            page: 4
        }]
    },
    'Transport drugs': {
        key: 'transportdrugs',
        crimes: [{
            text: 'Transport Cannabis',
            key: 'cannabis',
            nerve: 8,
            page: 4
        }, {
            text: 'Transport Amphetamines',
            key: 'amphetamines',
            nerve: 8,
            page: 4
        }, {
            text: 'Transport Cocaine',
            key: 'cocaine',
            nerve: 8,
            page: 4
        }, {
            text: 'Sell Pills',
            key: 'drugspills',
            nerve: 8,
            page: 4
        }, {
            text: 'Sell Cannabis',
            key: 'drugscanabis',
            nerve: 8,
            page: 4
        }, {
            text: 'Sell Cocaine',
            key: 'drugscocaine',
            nerve: 8,
            page: 4
        }]
    },
    'Plant a computer virus': {
        key: 'virus',
        crimes: [{
            text: 'Simple virus',
            key: 'simplevirus',
            nerve: 9,
            page: 4
        }, {
            text: 'Polymorphic virus',
            key: 'polymorphicvirus',
            nerve: 9,
            page: 4
        }, {
            text: 'Tunneling Virus',
            key: 'tunnelingvirus',
            nerve: 9,
            page: 4
        }, {
            text: 'Armored Virus',
            key: 'armoredvirus',
            nerve: 9,
            page: 4
        }, {
            text: 'Stealth virus',
            key: 'stealthvirus',
            nerve: 9,
            page: 4
        }]
    },
    'Assassination': {
        key: 'assasination',
        crimes: [{
            text: 'Assassinate a target',
            key: 'assasination',
            nerve: 10,
            page: 4
        }, {
            text: 'Drive by Shooting',
            key: 'driveby',
            nerve: 10,
            page: 4
        }, {
            text: 'Car Bomb',
            key: 'carbomb',
            nerve: 10,
            page: 4
        }, {
            text: 'Mob Boss',
            key: 'murdermobboss',
            nerve: 10,
            page: 4
        }]
    },
    'Arson': {
        key: 'arson',
        crimes: [{
            text: 'Home',
            key: 'home',
            nerve: 11,
            page: 4
        }, {
            text: 'Car Lot',
            key: 'Carlot',
            nerve: 11,
            page: 4
        }, {
            text: 'Office Building',
            key: 'OfficeBuilding',
            nerve: 11,
            page: 4
        }, {
            text: 'Apartment Building',
            key: 'aptbuilding',
            nerve: 11,
            page: 4
        }, {
            text: 'Warehouse',
            key: 'warehouse',
            nerve: 11,
            page: 4
        }, {
            text: 'Motel',
            key: 'motel',
            nerve: 11,
            page: 4
        }, {
            text: 'Government Building',
            key: 'govbuilding',
            nerve: 11,
            page: 4
        }]
    },
    'Grand Theft Auto': {
        key: 'gta',
        crimes: [{
            text: 'Steal a parked car',
            key: 'parkedcar',
            nerve: 12,
            page: 4
        }, {
            text: 'Hijack a car',
            key: 'movingcar',
            nerve: 12,
            page: 4
        }, {
            text: 'Steal car from showroom',
            key: 'carshop',
            nerve: 12,
            page: 4
        }]
    },
    'Pawn Shop': {
        key: 'pawnshop',
        crimes: [{
            text: 'Side Door',
            key: 'pawnshop',
            nerve: 13,
            page: 4
        }, {
            text: 'Rear Door',
            key: 'pawnshopcash',
            nerve: 13,
            page: 4
        }]
    },
    'Counterfeiting': {
        key: 'counterfeiting',
        crimes: [{
            text: 'Money',
            key: 'makemoney2',
            nerve: 14,
            page: 4
        }, {
            text: 'Casino tokens',
            key: 'maketokens2',
            nerve: 14,
            page: 4
        }, {
            text: 'Credit card',
            key: 'makecard',
            nerve: 14,
            page: 4
        }]
    },
    'Kidnapping': {
        key: 'kidnapping',
        crimes: [{
            text: 'Kid',
            key: 'napkid',
            nerve: 15,
            page: 4
        }, {
            text: 'Woman',
            key: 'napwomen',
            nerve: 15,
            page: 4
        }, {
            text: 'Undercover cop',
            key: 'napcop',
            nerve: 15,
            page: 4
        }, {
            text: 'Mayor',
            key: 'napmayor',
            nerve: 15,
            page: 4
        }]
    },
    'Arms Trafficking': {
        key: 'armstraffic',
        crimes: [{
            text: 'Explosives',
            key: 'trafficbomb',
            nerve: 16,
            page: 4
        }, {
            text: 'Firearms',
            key: 'trafficarms',
            nerve: 16,
            page: 4
        }]
    },
    'Bombings': {
        key: 'bombings',
        crimes: [{
            text: 'Bomb a factory',
            key: 'bombfactory',
            nerve: 17,
            page: 4
        }, {
            text: 'Bomb a government building',
            key: 'bombbuilding',
            nerve: 17,
            page: 4
        }]
    },
    'Hacking': {
        key: 'hacking',
        crimes: [{
            text: 'Hack into a Bank Mainframe',
            key: 'hackbank',
            nerve: 18,
            page: 4
        }, {
            text: 'Hack the F.B.I Mainframe',
            key: 'hackfbi',
            nerve: 18,
            page: 4
        }]
    }
});