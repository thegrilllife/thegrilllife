/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

var partner_shareasale = function() {
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			},
		
		startExtension : {
			onSuccess : function(){
				if(app.ext.myRIA && app.ext.myRIA.template){
					app.ext.orderCreate.checkoutCompletes.push(function(P){
						var order = app.data['order|'+P.orderID];
						var $img = $("<img src='https://shareasale.com/sale.cfm?amount="+order.sum.items_total+"&tracking="+P.orderID+"&transtype=SALE&merchantID=44300' width='1' height='1'>");
						$('body').append($img);
						});
					} else	{
						setTimeout(function(){app.ext.partner_shareasale.callbacks.startExtension.onSuccess()},250);
					}
				},
			onError : function(){}
			}
		}, //callbacks
	return r;
	}