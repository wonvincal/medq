/* 
 * Queue Model - hold data of a queue.  We should be very conscious about the
 * amount of data stored on the client side: 1) security, 2) size
 * 1) don't send over data that is not necessary
 * 2) don't store data that is not necessary
 * Copyright 2014 Calvin Wong.
 */
var Queue = function(id, name) {
    this.id = id;
    this.name = name;
    this.numWaiting = 10;
    this.tickets = [];
};

module.exports = Queue;