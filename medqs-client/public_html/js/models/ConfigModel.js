/**
 * Single instance of ConfigModel
 * Created by Calvin on 2/15/2015.
 */
var moment = require('moment');
var _ = require('lodash');
var PERIOD_START = 0;
var PERIOD_END = 1;

var _aptSlotDurInMin = 15;
var _officeHours = [
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ]
    ] /* 0 - Sunday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ]
    ] /* 1 - Monday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ]
    ] /* 2 - Tuesday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ]
    ] /* 3 - Wednesday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ]
    ] /* 4 - Thursday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ]
    ] /* 5 - Friday */,
    [
        [
            moment({ hour: 9, minute: 0}),
            moment({ hour: 12, minute: 0})
        ],
        [
            moment({ hour: 14, minute: 0}),
            moment({ hour: 18, minute: 0})
        ]
    ] /* 6 - Saturday */
];

module.exports = {
    getAptSlotDurInMin : function(){
        return _aptSlotDurInMin;
    },
    getHeatmapSlotDurInMin: function(){
        return this.getAptSlotDurInMin();
    },
    getHeatmapSlotTimeDisplayFormat : function(){
        return this.getDefaultTimeDisplayFormat();
    },
    getDefaultTimeDisplayFormat: function(){
        return "HH:mm";
    },
    getOfficeHoursForDay: function(day /* 0 - Sun, 6 - Sat */){
        var result = [];
        _.forEach(_officeHours[day], function(session){
            result.push([session[0].clone(), session[1].clone()])
        });
        return result;
    }
};
