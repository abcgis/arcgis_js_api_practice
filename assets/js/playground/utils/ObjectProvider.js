/*! ArcGIS API for JavaScript 4.12 | Copyright (c) 2019 Esri. All rights reserved. | http://www.esri.com/legal/privacy | https://developers.arcgis.com/terms/faq */
define(["esri/widgets/ColorPicker","esri/widgets/support/colorUtils","esri-playground-js/utils/DataProvider","dojo/Stateful","dojo/_base/declare","dojo/dom"],function(ColorPicker,colorUtil,DataProvider,Stateful,declare,dom){var objectProvider={};var StatefulClass=declare([Stateful],{});var getStatefullObject=function(configData){var obj=new StatefulClass,configName=configData["className"]||configData["name"];obj.set("className",configName);var properties=configData["properties"];properties.forEach(function(property){var propName=property["name"],propType=property["type"],propValue=property["value"],propAttributes=property["attributes"],propDefault=property["default"],propVisibility=property["visibility"],el=dom.byId(property["domId"]+"-"+"ID");obj.set(propName,null);if(propType==="Number"||propType==="String"){if(propType==="Number"&&propAttributes&&propAttributes.min&&propAttributes.max){var rangeEl=dom.byId(property["domId"]+"-"+"RangeID");var isMSIE=0;if(isMSIE){rangeEl.addEventListener("change",function(){obj.set(propName,rangeEl.value)})}else{rangeEl.addEventListener("input",function(){obj.set(propName,rangeEl.value)})}}obj.watch(propName,function(name,oldValue,value){if(propDefault&&value===null){el.value=propDefault}else{el.value=value}if(propAttributes&&propAttributes.min&&propAttributes.max){rangeEl.value=el.value}if(propName==="url"){var img=new Image;img.addEventListener("load",function(){obj.set("width",this.naturalWidth);obj.set("height",this.naturalHeight)});img.src=el.value}});el.addEventListener("change",function(){if(propType==="Number"&&propAttributes&&el.value<propAttributes.min){var errMsg=dom.byId("msg");errMsg.innerHTML=propName+" cannot be less than "+propAttributes.min+"!";var event=new Event("errMsg");errMsg.dispatchEvent(event);obj.set(propName,null)}else{if(el.value==propDefault){obj.set(propName,null)}else{obj.set(propName,el.value)}}if(propAttributes&&propAttributes.min&&propAttributes.max){var rangeEl=dom.byId(property["domId"]+"-"+"RangeID");rangeEl.value=el.value}if(propName==="url"){var img=new Image;img.addEventListener("load",function(){obj.set("width",this.naturalWidth);obj.set("height",this.naturalHeight)});img.src=el.value}},false);if(propVisibility){var visPropParent;properties.forEach(function(prop){if(prop["name"]===propVisibility["name"]){visPropParent=prop}});var domElem=dom.byId(visPropParent["domId"]+"-"+"ID");var parentNode=el.parentNode.parentNode;if(domElem.value!==propVisibility["value"]){parentNode.style.display="none"}domElem.addEventListener("change",function(){if(domElem.value===propVisibility["value"]){parentNode.style.display="-webkit-box";parentNode.style.display="-moz-box";parentNode.style.display="-ms-flexbox";parentNode.style.display="-webkit-flex";parentNode.style.display="flex";if(propDefault!==undefined){obj.set(propName,propDefault)}}else{parentNode.style.display="none";obj.set(propName,null)}})}if(propValue){obj.set(propName,propValue)}}else if(propType==="Boolean"){obj.watch(propName,function(name,oldValue,value){el.checked=value});el.addEventListener("change",function(){if(el.checked){obj.set(propName,true)}else{obj.set(propName,false)}},false)}else if(propType==="Color"){var text=dom.byId(property["domId"]+"-"+"TextID");if(text){var colorPicker=new ColorPicker({title:"color-picker",showRecentColors:false,showTransparencySlider:true,showSuggestedColors:false,required:true},el);colorPicker.startup();var defVal=propDefault||[0,0,0,1];colorPicker.set("color",defVal);text.innerHTML="["+defVal+"]";text.style.background=colorPicker.get("color");colorPicker.on("color-change",function(){var selected=colorPicker.get("color");var contrastColor=colorUtil.getContrastingColor(selected);var textVal=selected.toRgba();textVal[3]=Math.round(textVal[3]*100)/100;var colorEquality=defVal.every(function(val,idx){return val===textVal[idx]?true:false});if(colorEquality){obj.set(propName,null)}else{obj.set(propName,textVal)}if(textVal.constructor===Array){textVal="["+textVal+"]"}text.innerHTML=textVal;text.style.background=selected;text.style.color=contrastColor});obj.watch(propName,function(name,oldValue,value){if(value===null){value=defVal}colorPicker.set("color",value)})}}else if(propType==="Class"||propType==="Object"){var config=property["config"]||property;if(config&&config["properties"]){obj.set(propName,getStatefullObject(config));var textElem=dom.byId(property["domId"]+"-"+"TextID"),text=[],subObj=obj[propName];config["properties"].forEach(function(prop){var def=prop["default"];if(def!=null){if(typeof def==="number"){def=Math.round(def*100)/100}if(def.constructor===Array){def="["+def+"]"}text.push(def)}else{text.push(prop["name"])}});textElem.innerHTML=text.join(", ");subObj.watch(function(){text=[];config["properties"].forEach(function(prop){var def=subObj[prop["name"]]||prop["default"]||prop["name"];if(typeof def==="number"){def=Math.round(def*100)/100}if(def.constructor===Array){def="["+def+"]"}text.push(def)});textElem.innerHTML=text.join(", ")})}}});return obj};objectProvider.getStatefullObject=getStatefullObject;objectProvider.StatefulClass=StatefulClass;return objectProvider});