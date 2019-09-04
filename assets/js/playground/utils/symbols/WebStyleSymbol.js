/*! ArcGIS API for JavaScript 4.12 | Copyright (c) 2019 Esri. All rights reserved. | http://www.esri.com/legal/privacy | https://developers.arcgis.com/terms/faq */
define(["esri/config","esri/request","esri/core/HandleRegistry","esri-playground-js/utils/CurrentState","esri-playground-js/utils/CodeGenerator","dojo/dom","dojo/dom-construct"],function(esriConfig,esriRequest,HandleRegistry,CurrentState,CodeGenerator,dom,domConstruct){var symbol={},handles=new HandleRegistry;var init=function(){handles.removeAll();var currentState=CurrentState.getInstance();var urlHandler=currentState.statefulObject.portal.watch("url",function(name,oldValue,newValue){handles.remove("web-style-symbol-styleName-handler");if(!newValue){update(currentState,"styleName",null);update(currentState,"name",null)}else{currentState.statefulObject.set("styleUrl",null);initStyles(currentState)}});handles.add("web-style-symbol-portal-url-handler",urlHandler);var styleUrlHandler=currentState.statefulObject.watch("styleUrl",function(name,oldValue,newValue){if(!newValue){update(currentState,"name",null)}else{currentState.statefulObject.portal.set("url",null);initNamesForEmbeddedStyles(currentState,newValue)}});handles.add(styleUrlHandler,"web-style-symbol-styleUrl-handler");if(!(currentState.statefulObject.portal.url||currentState.statefulObject.styleUrl)){currentState.statefulObject.portal.set("url","https://www.arcgis.com")}if(currentState.statefulObject.portal.url){initStyles(currentState)}if(currentState.statefulObject.styleUrl){initNamesForEmbeddedStyles(currentState,currentState.statefulObject.styleUrl)}};function initStyles(currentState){getStyles().then(function(stylesResult){update(currentState,"styleName",stylesResult.styles);var handler=currentState.statefulObject.watch("styleName",function(name,oldValue,newValue){if(newValue){currentState.statefulObject.set("name",null);initNamesForStyle(currentState,stylesResult.groupId,newValue)}});handles.add(handler,"web-style-symbol-styleName-handler");if(currentState.statefulObject.styleName){initNamesForStyle(currentState,stylesResult.groupId,currentState.statefulObject.styleName)}})}function initNamesForStyle(currentState,groupId,styleName){getNamesForStyle(groupId,styleName).then(function(namesResult){update(currentState,"name",namesResult)})}function initNamesForEmbeddedStyles(currentState,styleUrl){getNamesForEmbeddedStyles(styleUrl).then(function(namesResult){update(currentState,"name",namesResult)})}function update(currentState,propertyName,values){var configData=currentState.config,property=CodeGenerator.getProperty(configData,configData.className,propertyName);if(!property){return}if(values){var options={type:"String",values:[]};values.forEach(function(value){options.values.push(value);if(property){property.options=options}})}else{delete property.options}currentState.set("config",configData);var domId=property.domId+"-ID",propertyDOM=dom.byId(domId),parentDOM=propertyDOM.parentNode;domConstruct.destroy(propertyDOM);var inputNode;if(values){inputNode=document.createElement("SELECT");inputNode.className="property-value";inputNode.setAttribute("id",domId);inputNode.setAttribute("name",property.name);var placeHolderNode=document.createElement("option");placeHolderNode.innerHTML="select "+property["name"];placeHolderNode.className="property-value";placeHolderNode.disabled=true;placeHolderNode.selected=true;placeHolderNode.style.background="#ecf0f1";inputNode.appendChild(placeHolderNode);property.options.values.forEach(function(option){var optionNode=document.createElement("option");optionNode.innerHTML=option.name;optionNode.setAttribute("value",option.value);inputNode.appendChild(optionNode)})}else{inputNode=document.createElement("input");inputNode.className="property-value";inputNode.setAttribute("id",domId);inputNode.setAttribute("type","text");inputNode.setAttribute("placeholder","enter "+property["name"])}parentDOM.appendChild(inputNode);if(currentState.statefulObject[property.name]){inputNode.value=currentState.statefulObject[property.name]}currentState.statefulObject.watch(property.name,function(name,oldValue,value){inputNode.value=value});inputNode.addEventListener("change",function(){currentState.statefulObject.set(property.name,inputNode.value)},false);if(!values){inputNode.value=null;currentState.statefulObject.set(property.name,null)}}function getStyles(){var groupId;return esriRequest(esriConfig.portalUrl+"/sharing/rest/portals/self?f=json").then(function(response){return esriRequest(esriConfig.portalUrl+"/sharing/rest/community/groups/",{query:{q:response.data.stylesGroupQuery,f:"json"}})}).then(function(response){groupId=response.data.results[0].id;return esriRequest(esriConfig.portalUrl+"/sharing/rest/search",{query:{q:"group: "+groupId,f:"json"}})}).then(function(response){var styles=[];response.data.results.forEach(function(style){styles.push({name:style.title,value:style.typeKeywords[0]==="3d"?style.typeKeywords[2]:style.typeKeywords[1]})});return{groupId:groupId,styles:styles}})}function getNamesForStyle(groupId,styleName){return esriRequest(esriConfig.portalUrl+"/sharing/rest/search",{query:{q:"group: "+groupId+" AND typekeywords: "+styleName,f:"json"}}).then(function(response){return esriRequest(esriConfig.portalUrl+"/sharing/rest/content/items/"+response.data.results[0].id+"/data?f=json").then(function(result){return result.data.items.map(function(item){return{name:item.name,value:item.name}})})})}function getNamesForEmbeddedStyles(url){return esriRequest(url+"?f=json").then(function(response){return response.data.items.map(function(item){return{name:item.name,value:item.name}})})}symbol.init=init;return symbol});