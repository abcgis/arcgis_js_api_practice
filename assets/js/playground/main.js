/*! ArcGIS API for JavaScript 4.12 | Copyright (c) 2019 Esri. All rights reserved. | http://www.esri.com/legal/privacy | https://developers.arcgis.com/terms/faq */
"use strict";require(["esri-playground-js/utils/CurrentState","esri-playground-js/utils/mainUtils","esri-playground-js/utils/Initializer","esri-playground-js/utils/DataProvider","dojo/dom","dojo/on","dojo/domReady!"],function(CurrentState,mainUtils,Initializer,DataProvider,dom,on){var configData=null,selectionBlock=dom.byId("selectionBlock"),generatorBlock=dom.byId("generatorBlock"),pageTitle=dom.byId("pageTitle"),pageSubTitle=dom.byId("pageSubTitle"),playArea=dom.byId("playArea"),viewOptions=dom.byId("viewsOptions"),mapOptions=dom.byId("mapOptions"),searchBtn=dom.byId("searchBtn"),resetBtn=dom.byId("reset"),shareBtn=dom.byId("share");function setView(){var hash=window.location.hash,currentState=CurrentState.getInstance();if(hash.toLowerCase().indexOf("3d")>-1){viewOptions.style.display="none";shareBtn.style.display="none";resetBtn.style.display="none";currentState.set("view",Initializer.getView(true))}else{shareBtn.style.display="block";resetBtn.style.display="block";currentState.set("view",Initializer.getView())}}function init(){var hash=window.location.hash,currentState=CurrentState.getInstance();setView();var path=hash.split("=")[1];if(!path){selectionBlock.style.display="flex";generatorBlock.style.display="none";mapOptions.style.display="none";searchBtn.style.display="none";pageTitle.innerHTML="";pageSubTitle.innerHTML="A code generator application";Initializer.clearGraphicsLayer2D()}else{selectionBlock.style.display="none";generatorBlock.style.display="flex";mapOptions.style.display="block";searchBtn.style.display="inline";var filePath=path.split("?")[0],configUrl=require.toUrl("esri-playground-data")+"/"+filePath,className=configUrl.split("/").pop().split(".")[0],is3D=className.toLowerCase().indexOf("3d")>-1;if(className.toLowerCase().indexOf("picture")>-1||is3D||className.toLowerCase().indexOf("webstyle")>-1){viewOptions.style.display="none"}else{viewOptions.style.display="inline-block"}var ls=JSON.parse(sessionStorage.getItem(className));if(ls&&ls.config&&!is3D){configData=mainUtils.parseConfig(ls.config,true)}if(!configData||configData&&configUrl.indexOf(configData["className"])===-1){configData=mainUtils.parseConfig(configUrl,true)}currentState.set("config",configData);pageTitle.innerHTML=configData["className"]+": ";pageSubTitle.innerHTML=configData["summary"];Initializer.init()}}on(window,"hashchange",function(e){var hasState=!!e.oldURL.split("state")[1];if(!hasState){Initializer.reset();init()}});Initializer.initMsgCenterHandlers();setView();CurrentState.getInstance().view.when(function(){var playgroundSearchDataURL=require.toUrl("esri-playground-data")+"/index-config.json";DataProvider.getJsonData(playgroundSearchDataURL,true).then(function(data){Initializer.initSelectionHandlers(CurrentState.getInstance().view.map,data)})});init()});