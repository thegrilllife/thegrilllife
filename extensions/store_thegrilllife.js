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



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var store_thegrilllife = function() {
	var theseTemplates = new Array('');
	var r = {

	vars : {
		searchSize : 4
		},

////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(P){
					var $context = $(app.u.jqSelector('#', P.parentID));
					app.ext.store_thegrilllife.u.loadRelatedItemsForProd(app.ext.myRIA.vars.session.recentCategories[0], P, $context);
					}]);
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN store_thegrilllife.callbacks.init.onError');
				}
			},
		populateRelatedItemsForProd : {
			onSuccess : function(rd){
				app.u.dump('BEGIN store_thegrilllife.callbacks.populateRelatedItemsForProd.onSuccess');
				rd.$list.anycontent({
					templateID : "productRelatedItemsListTemplate",
					datapointer : rd.datapointer
					});
				},
			onError : function(rd){
				app.u.dump('BEGIN store_thegrilllife.callbacks.populateRelatedItemsForProd.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {
			
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			loadRelatedItemsForProd : function(recentCat, infoObj, $context){
				//Only render for products that have categories assigned
				if(app.data[infoObj.datapointer]['%attribs']['user:app_category']){
					//Check the recentCat against the product's categories. If we've come through search,
					//or from the homepage, a direct link elsewhere, or loaded the app on the prod pages,
					//recentCat will not be applicable (or in the latter case, nonexistent)
					var cats = app.data[infoObj.datapointer]['%attribs']['user:app_category'].split("\n");
					app.u.dump(cats);
					if(!recentCat || cats.indexOf(recentCat) === -1){
						recentCat = cats[0];
						}
					
					var $container = $('.relatedItems', $context);
					
					//To avoid re-running searches, we keep any rendered related items lists around for reference.
					//Iterate through them, hide any non-applicable ones.
					var thisCatIsRendered = false;
					$container.children().each(function(){
						if($(this).data('navcat') !== recentCat){
							$(this).hide();
							}
						else {
							thisCatIsRendered = true;
							$(this).show();
							}
						});
					//Haven't rendered this category yet, so let's give it a shot!
					if(!thisCatIsRendered){
						app.u.dump(recentCat+" has not yet been rendered");
						var $itemListContainer = $('<div />');
						$itemListContainer.data('navcat', recentCat);
						
						var elasticsearch = app.ext.store_search.u.buildElasticRaw({
							"filter" : {
								"term" : {"app_category":recentCat}
								}
							});
						elasticsearch.size = app.ext.store_thegrilllife.vars.searchSize;
						
						var _tag = {
							callback : "populateRelatedItemsForProd",
							extension : "store_thegrilllife",
							datapointer : "prodRelatedSearch|"+infoObj.pid+"|"+recentCat,
							$list : $itemListContainer
							}
						
						app.ext.store_search.calls.appPublicProductSearch.init(elasticsearch, _tag, "mutable");
						app.model.dispatchThis("mutable");
						
						
						$container.append($itemListContainer);
						}
					}
				}
			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}