/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
};
