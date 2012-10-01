/*!
Copyright (C) 2012 Anna-Liisa Mattila

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
var WIDGET3D=WIDGET3D||{};WIDGET3D.ElementType={MAIN_WINDOW:0,WINDOW:1,BASIC:2,TEXT:3,UNDEFINED:666},WIDGET3D.Container,WIDGET3D.initialized=!1,WIDGET3D.events,WIDGET3D.mainWindow,WIDGET3D.focused=[],WIDGET3D.init=function(e){var e=e||{};return e.container!=undefined?WIDGET3D.Container=e.container:(console.log("Container must be specified!"),console.log("Container has to be constructor method of container of used 3D-engine (eg. in three.js THREE.Object3D")),WIDGET3D.mainWindow=new WIDGET3D.MainWindow,e.collisionCallback==undefined||e.collisionCallback.callback==undefined?(console.log("CollisionCallback has to be JSON object containing attributes callback (and args, optional)"),console.log("Initializing WIDGET3D failed!"),!1):(WIDGET3D.events=new WIDGET3D.DomEvents(e.collisionCallback,e.domElement),WIDGET3D.initialized=!0,WIDGET3D.mainWindow)},WIDGET3D.isInitialized=function(){return WIDGET3D.initialized},WIDGET3D.getEvents=function(){return WIDGET3D.events},WIDGET3D.getMainWindow=function(){return WIDGET3D.mainWindow},WIDGET3D.unfocusFocused=function(){for(var e=0;e<WIDGET3D.focused.length;++e)WIDGET3D.focused[e].unfocus();WIDGET3D.focused=[]},WIDGET3D.getRealWidth=function(){return parseInt(window.getComputedStyle(WIDGET3D.events.domElement_,null).getPropertyValue("width"))},WIDGET3D.getRealHeight=function(){return parseInt(window.getComputedStyle(WIDGET3D.events.domElement_,null).getPropertyValue("height"))},WIDGET3D.getCanvasWidth=function(){return WIDGET3D.events.domElement_.width},WIDGET3D.getCanvasHeight=function(){return WIDGET3D.events.domElement_.height},WIDGET3D.mouseCoordinates=function(e){var t={x:0,y:0};if(!e)e=window.event,t.x=e.x,t.y=e.y;else{var n=e.target,r=0,i=0;while(n.offsetParent)r+=n.offsetLeft,i+=n.offsetTop,n=n.offsetParent;t.x=e.pageX-r,t.y=e.pageY-i}return t},WIDGET3D.normalizedMouseCoordinates=function(e){var t=WIDGET3D.mouseCoordinates(e),n=WIDGET3D.getRealWidth(),r=WIDGET3D.getRealHeight(),i={minX:0,maxX:n,minY:0,maxY:r},s=WIDGET3D.normalizeCoords(t,i);return s},WIDGET3D.normalizeCoords=function(e,t){var n=+((e.x-t.minX)/t.maxX)*2-1,r=-((e.y-t.minY)/t.maxY)*2+1;return{x:n,y:r}},WIDGET3D.calculateLimits=function(e,t,n){var r=e.x+t/2,i=e.x-t/2,s=e.y+n/2,o=e.y-n/2;return{minX:i,maxX:r,minY:o,maxY:s}},WIDGET3D.parentCoordToChildCoord=function(e,t,n){var r=(e.x-n.minX)/n.maxX*t.maxX+t.minX,i=(e.y-n.minY)/n.maxY*t.maxY+t.minY;return{x:r,y:i}},WIDGET3D.GuiObject=function(){this.isVisible_=!0,this.inFocus_=!1,this.events_=[],this.setUpEvents()},WIDGET3D.GuiObject.prototype.setUpEvents=function(){for(var e=0;e<WIDGET3D.NUMBER_OF_EVENTS;++e)this.events_.push({callback:!1,arguments:undefined,index:undefined})},WIDGET3D.GuiObject.prototype.focus=function(){this.inFocus_||(WIDGET3D.unfocusFocused(),this.inFocus_=!0,WIDGET3D.focused.push(this))},WIDGET3D.GuiObject.prototype.unfocus=function(){this.inFocus_&&(this.inFocus_=!1)},WIDGET3D.GuiObject.prototype.addEventListener=function(e,t,n){this.events_[e].callback=t,this.events_[e].arguments=n,WIDGET3D.mainWindow.childEvents_[e].push(this),this.events_[e].index=WIDGET3D.mainWindow.childEvents_[e].length-1,WIDGET3D.events.enabled_[e]||WIDGET3D.events.enableEvent(e)},WIDGET3D.GuiObject.prototype.switchEventCallback=function(e,t,n){this.events_[e].callback=t,this.events_[e].arguments=n},WIDGET3D.GuiObject.prototype.removeEventListener=function(e){this.events_[e].callback=!1,this.events_[e].arguments=undefined,WIDGET3D.mainWindow.childEvents_[e].splice(this.events_[e].index,1);for(var t=0;t<WIDGET3D.mainWindow.childEvents_[e].length;++t)WIDGET3D.mainWindow.childEvents_[e][t].setNewEventIndex(e,t);this.events_[e].index=undefined,WIDGET3D.mainWindow.childEvents_[e].length==0&&WIDGET3D.events.disableEvent(e)},WIDGET3D.GuiObject.prototype.setNewEventIndex=function(e,t){this.events_[e].index=t,WIDGET3D.mainWindow.childEvents_[e][t]=this},WIDGET3D.GuiObject.prototype.inheritance=function(){function e(){}e.prototype=this;var t=new e;return t},WIDGET3D.Basic=function(){WIDGET3D.GuiObject.call(this),this.mesh_,this.parent_,this.updateCallback_},WIDGET3D.Basic.prototype=WIDGET3D.GuiObject.prototype.inheritance(),WIDGET3D.Basic.prototype.type_=WIDGET3D.ElementType.BASIC,WIDGET3D.Basic.prototype.addUpdateCallback=function(e,t){this.updateCallback_={callback:e,arguments:t}},WIDGET3D.Basic.prototype.update=function(){this.updateCallback_&&(this.updateCallback_.callback(this.updateCallback_.arguments),WIDGET3D.mainWindow.needsUpdate())},WIDGET3D.Basic.prototype.setParent=function(e){this.parent_!=undefined&&(this.isVisible_&&this.mesh_&&this.parent_.container_.remove(this.mesh_),this.parent_.removeFromObjects(this)),this.parent_=e,this.parent_.children_.push(this),this.isVisible_&&this.mesh_&&this.parent_.container_.add(this.mesh_),this.parent_.isVisible_||this.hide()},WIDGET3D.Basic.prototype.setMesh=function(e){this.mesh_&&this.parent_?(this.isVisible_&&this.parent_.container_.remove(this.mesh_),WIDGET3D.mainWindow.removeMesh(this.mesh_),this.mesh_=e,this.isVisible_&&(this.parent_.container_.add(this.mesh_),WIDGET3D.mainWindow.needsUpdate())):this.parent_?(this.mesh_=e,this.isVisible_&&(this.parent_.container_.add(this.mesh_),WIDGET3D.mainWindow.needsUpdate())):this.mesh_=e,WIDGET3D.mainWindow.meshes_.push(this.mesh_)},WIDGET3D.Basic.prototype.show=function(){this.isVisible_||(this.isVisible_=!0,this.mesh_.visible=!0,this.parent_.container_.add(this.mesh_),WIDGET3D.mainWindow.needsUpdate())},WIDGET3D.Basic.prototype.hide=function(){this.isVisible_&&(this.isVisible_=!1,this.mesh_.visible=!1,this.inFocus_&&this.unfocus(),this.parent_.container_.remove(this.mesh_),WIDGET3D.mainWindow.needsUpdate())},WIDGET3D.Basic.prototype.getLocation=function(){return{x:this.mesh_.position.x,y:this.mesh_.position.y,z:this.mesh_.position.z}},WIDGET3D.Basic.prototype.setLocation=function(e,t,n){this.mesh_.position.x=e,this.mesh_.position.y=t,this.mesh_.position.z=n,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.setX=function(e){this.mesh_.position.x=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.setY=function(e){this.mesh_.position.y=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.setZ=function(e){this.mesh_.position.z=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.getRot=function(){return{x:this.mesh_.rotation.x,y:this.mesh_.rotation.y,z:this.mesh_.rotation.z}},WIDGET3D.Basic.prototype.setRot=function(e,t,n){this.mesh_.rotation.x=e,this.mesh_.rotation.y=t,this.mesh_.rotation.z=n,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.setRotX=function(e){this.mesh_.rotation.x=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.setRotY=function(e){this.mesh_.rotation.y=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.setRotZ=function(e){this.mesh_.rotation.z=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Basic.prototype.remove=function(){this.hide();for(var e=0;e<this.events_.length;++e)this.events_[e].callback&&this.removeEventListener(e);var t=WIDGET3D.mainWindow.removeMesh(this.mesh_);t!=this.mesh_&&(console.log("removed mesh was wrong! "),console.log(t),console.log(this.mesh_));var n=this.parent_.removeFromObjects(this);n!=this&&(console.log("removed object was wrong! "),console.log(n),console.log(this))},WIDGET3D.Basic.prototype.inheritance=function(){function e(){}e.prototype=this;var t=new e;return t},WIDGET3D.WindowInterface=function(){this.children_=[],this.container_=new WIDGET3D.Container},WIDGET3D.WindowInterface.prototype.addChild=function(e){return e.setParent(this),e},WIDGET3D.WindowInterface.prototype.hideNotFocused=function(){for(var e=0;e<this.children_.length;++e)this.children_[e].inFocus_||this.children_[e].hide()},WIDGET3D.WindowInterface.prototype.removeFromObjects=function(e){for(var t=0;t<this.children_.length;++t)if(this.children_[t]===e)var n=this.children_.splice(t,1);return n[0]},WIDGET3D.MainWindow=function(){WIDGET3D.GuiObject.call(this),WIDGET3D.WindowInterface.call(this),this.meshes_=[],this.childEvents_=new Array(WIDGET3D.NUMBER_OF_EVENTS);for(var e=0;e<this.childEvents_.length;++e)this.childEvents_[e]=[];this.needsUpdate_=!0},WIDGET3D.MainWindow.prototype=WIDGET3D.GuiObject.prototype.inheritance(),WIDGET3D.MainWindow.prototype.addChild=WIDGET3D.WindowInterface.prototype.addChild,WIDGET3D.MainWindow.prototype.hideNotFocused=WIDGET3D.WindowInterface.prototype.hideNotFocused,WIDGET3D.MainWindow.prototype.removeFromObjects=WIDGET3D.WindowInterface.prototype.removeFromObjects,WIDGET3D.MainWindow.prototype.type_=WIDGET3D.ElementType.MAIN_WINDOW,WIDGET3D.MainWindow.prototype.needsUpdate=function(){this.needsUpdate_=!0},WIDGET3D.MainWindow.prototype.update=function(){this.needsUpdate_=!1},WIDGET3D.MainWindow.prototype.removeMesh=function(e){for(var t=0;t<this.meshes_.length;++t)if(this.meshes_[t]===e)var n=this.meshes_.splice(t,1);return n[0]},WIDGET3D.Window=function(){WIDGET3D.Basic.call(this),WIDGET3D.WindowInterface.call(this)},WIDGET3D.Window.prototype=WIDGET3D.Basic.prototype.inheritance(),WIDGET3D.Window.prototype.addChild=WIDGET3D.WindowInterface.prototype.addChild,WIDGET3D.Window.prototype.hideNotFocused=WIDGET3D.WindowInterface.prototype.hideNotFocused,WIDGET3D.Window.prototype.removeFromObjects=WIDGET3D.WindowInterface.prototype.removeFromObjects,WIDGET3D.Window.prototype.type_=WIDGET3D.ElementType.WINDOW,WIDGET3D.Window.prototype.setParent=function(e){this.parent_!=undefined?(this.parent_.container_.remove(this.container_),this.parent_.removeFromObjects(this),this.parent_=e,this.parent_.children_.push(this),this.parent_.container_.add(this.container_)):(this.parent_=e,this.parent_.children_.push(this),this.parent_.container_.add(this.container_))},WIDGET3D.Window.prototype.setMesh=function(e){this.mesh_?(this.isVisible_&&this.container_.remove(this.mesh_),WIDGET3D.mainWindow.removeMesh(this.mesh_),this.mesh_=e,this.isVisible_&&this.container_.add(this.mesh_),WIDGET3D.mainWindow.meshes_.push(this.mesh_)):(this.mesh_=e,WIDGET3D.mainWindow.meshes_.push(this.mesh_),this.container_.add(this.mesh_)),WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.show=function(){if(!this.isVisible_){for(var e=0;e<this.children_.length;++e)this.children_[e].show();this.isVisible_=!0,this.parent_.container_.add(this.container_),this.mesh_&&(this.mesh_.visible=!0,this.container_.add(this.mesh_)),WIDGET3D.mainWindow.needsUpdate()}},WIDGET3D.Window.prototype.hide=function(){if(this.isVisible_){for(var e=0;e<this.children_.length;++e)this.children_[e].hide();this.isVisible_=!1,this.inFocus_&&this.unfocus(),this.parent_.container_.remove(this.container_),this.mesh_&&(this.mesh_.visible=!1,this.container_.remove(this.mesh_)),WIDGET3D.mainWindow.needsUpdate()}},WIDGET3D.Window.prototype.getLocation=function(){return{x:this.container_.position.x,y:this.container_.position.y,z:this.container_.position.z}},WIDGET3D.Window.prototype.setLocation=function(e,t,n){this.container_.position.x=e,this.container_.position.y=t,this.container_.position.z=n,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.setX=function(e){this.container_.position.x=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.setY=function(e){this.container_.position.y=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.setZ=function(e){this.container_.position.z=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.getRot=function(){return{x:this.container_.rotation.x,y:this.container_.rotation.y,z:this.container_.rotation.z}},WIDGET3D.Window.prototype.setRot=function(e,t,n){this.container_.rotation.x=e,this.container_.rotation.y=t,this.container_.rotation.z=n,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.setRotX=function(e){this.container_.rotation.x=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.setRotY=function(e){this.container_.rotation.y=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.setRotZ=function(e){this.container_.rotation.z=e,WIDGET3D.mainWindow.needsUpdate()},WIDGET3D.Window.prototype.remove=function(){for(var e=0;e<this.children_.length;++e)this.children_[e].remove();this.hide();for(var t=0;t<this.events_.length;++t)this.events_[t].callback&&this.removeEventListener(t);if(this.mesh_){var n=WIDGET3D.mainWindow.removeMesh(this.mesh_);n!=this.mesh_&&console.log("removed mesh was wrong! "+n)}this.parent_.container_.remove(this.container_);var r=this.parent_.removeFromObjects(this);r!=this&&(console.log(r),console.log(this),console.log("removed object was wrong! "+r))},WIDGET3D.Window.prototype.inheritance=function(){function e(){}e.prototype=this;var t=new e;return t},WIDGET3D.Text=function(){WIDGET3D.Basic.call(this),this.mutable_=!0,this.cursor_="|",this.string_="",this.text_=this.string_+this.cursor_,this.maxLength_=undefined},WIDGET3D.Text.prototype=WIDGET3D.Basic.prototype.inheritance(),WIDGET3D.Text.prototype.type_=WIDGET3D.ElementType.TEXT,WIDGET3D.Text.prototype.setText=function(e){this.string_=e,this.inFocus_&&this.mutable_?this.text_=this.string_+this.cursor_:this.text_=this.string_,this.update()},WIDGET3D.Text.prototype.addLetter=function(e){this.mutable_&&(this.maxLength_!=undefined&&this.string_.length<this.maxLength_?this.string_+=e:this.string_+=e,this.inFocus_?this.text_=this.string_+this.cursor_:this.text_=this.string_,this.update())},WIDGET3D.Text.prototype.erase=function(e){this.mutable_&&(e>=this.string_.length?this.string_="":this.string_=this.string_.substring(0,this.string_.length-e),this.inFocus_?this.text_=this.string_+this.cursor_:this.text_=this.string_,this.update())},WIDGET3D.Text.prototype.focus=function(){this.inFocus_||(WIDGET3D.unfocusFocused(),this.inFocus_=!0,WIDGET3D.focused.push(this),this.mutable_&&this.setText(this.string_))},WIDGET3D.Text.prototype.unfocus=function(){this.inFocus_&&(this.inFocus_=!1,this.mutable_&&this.setText(this.string_))},WIDGET3D.Text.prototype.inheritance=function(){function e(){}e.prototype=this;var t=new e;return t},WIDGET3D.EventType={onclick:0,ondblclick:1,onmousemove:2,onmousedown:3,onmouseup:4,onmouseover:5,onmouseout:6,onkeydown:7,onkeyup:8,onkeypress:9},WIDGET3D.NUMBER_OF_EVENTS=10,WIDGET3D.DomEvents=function(e,t){var n=this;t?n.domElement_=t:n.domElement_=document,n.collisions_={callback:e.callback,args:e.args},n.enabled_=[];for(var r=0;r<WIDGET3D.NUMBER_OF_EVENTS;++r)n.enabled_.push(!1);n.mouseEvent=function(e,t){var r=n.collisions_.callback(e,t,n.collisions_.args);!r&&WIDGET3D.mainWindow.events_[t].callback?WIDGET3D.mainWindow.events_[t].callback(e,WIDGET3D.mainWindow.events_[t].arguments):r&&r.events_[t].callback&&r.events_[t].callback(e,r.events_[t].arguments)},n.keyboardEvent=function(e,t){WIDGET3D.mainWindow.events_[t].callback&&(console.log("mainwindow event!"),WIDGET3D.mainWindow.inFocus_&&WIDGET3D.mainWindow.events_[t].callback(e,WIDGET3D.mainWindow.events_[t].arguments));for(var n=0;n<WIDGET3D.mainWindow.childEvents_[t].length;++n)WIDGET3D.mainWindow.childEvents_[t][n].inFocus_&&WIDGET3D.mainWindow.childEvents_[t][n].events_[t].callback(e,WIDGET3D.mainWindow.childEvents_[t][n].events_[t].arguments)},n.onclick=function(e){n.mouseEvent(e,WIDGET3D.EventType.onclick)},n.ondblclick=function(e){n.mouseEvent(e,WIDGET3D.EventType.ondblclick)},n.onmousemove=function(e){n.mouseEvent(e,WIDGET3D.EventType.onmousemove)},n.onmousedown=function(e){n.mouseEvent(e,WIDGET3D.EventType.onmousedown)},n.onmouseup=function(e){n.mouseEvent(e,WIDGET3D.EventType.onmouseup)},n.onmouseover=function(e){n.mouseEvent(e,WIDGET3D.EventType.onmouseover)},n.onmouseout=function(e){n.mouseEvent(e,WIDGET3D.EventType.onmouseout)},n.onkeydown=function(e){n.keyboardEvent(e,WIDGET3D.EventType.onkeydown)},n.onkeyup=function(e){n.keyboardEvent(e,WIDGET3D.EventType.onkeyup)},n.onkeypress=function(e){n.keyboardEvent(e,WIDGET3D.EventType.onkeypress)}},WIDGET3D.DomEvents.prototype.enableEvent=function(e){switch(e){case WIDGET3D.EventType.onclick:this.domElement_.onclick=this.onclick,this.enabled_[e]=!0;break;case WIDGET3D.EventType.ondblclick:this.domElement_.ondblclick=this.ondblclick,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onmousemove:this.domElement_.onmousemove=this.onmousemove,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onmousedown:this.domElement_.onmousedown=this.onmousedown,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onmouseup:this.domElement_.onmouseup=this.onmouseup,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onmouseover:this.domElement_.onmouseover=this.onmouseover,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onmouseout:this.domElement_.onmouseout=this.onmouseout,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onkeydown:document.onkeydown=this.onkeydown,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onkeyup:document.onkeyup=this.onkeyup,this.enabled_[e]=!0;break;case WIDGET3D.EventType.onkeypress:document.onkeypress=this.onkeypress,this.enabled_[e]=!0;break;default:console.log("event types supported: "),console.log(WIDGET3D.EventType);return}},WIDGET3D.DomEvents.prototype.disableEvent=function(e){switch(e){case WIDGET3D.EventType.onclick:delete this.domElement_.onclick,this.enabled_[e]=!1;break;case WIDGET3D.EventType.ondblclick:delete this.domElement_.ondblclick,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onmousemove:delete this.domElement_.onmousemove,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onmousedown:delete this.domElement_.onmousedown,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onmouseup:delete this.domElement_.onmouseup,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onmouseover:delete this.domElement_.onmouseover,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onmouseout:delete this.domElement_.onmouseout,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onkeydown:delete document.onkeydown,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onkeyup:delete document.onkeyup,this.enabled_[e]=!1;break;case WIDGET3D.EventType.onkeypress:delete document.onkeypress,this.enabled_[e]=!1;break;default:console.log("event types supported: "),console.log(WIDGET3D.EventType);return}};var THREEJS_WIDGET3D={};THREEJS_WIDGET3D.initialized=!1,THREEJS_WIDGET3D.Container=THREE.Object3D,THREEJS_WIDGET3D.init=function(e){if(WIDGET3D!=undefined&&!THREEJS_WIDGET3D.initialized){var e=e||{};if(e.renderer)THREEJS_WIDGET3D.renderer=e.renderer;else{var t=e.width!==undefined?e.width:window.innerWidth,n=e.height!==undefined?e.height:window.innerHeight,r=e.antialias!==undefined?e.antialias:!0,i=e.domParent!==undefined?e.domParent:document.body;THREEJS_WIDGET3D.renderer=new THREE.WebGLRenderer({antialias:r}),THREEJS_WIDGET3D.renderer.setSize(t,n);var s=e.clearColor!==undefined?e.clearColor:3355443,o=e.opacity!==undefined?e.opacity:1;THREEJS_WIDGET3D.renderer.setClearColorHex(s,o),i.appendChild(THREEJS_WIDGET3D.renderer.domElement)}THREEJS_WIDGET3D.camera=e.camera!==undefined?e.camera:new THREE.PerspectiveCamera(75,THREEJS_WIDGET3D.renderer.domElement.width/THREEJS_WIDGET3D.renderer.domElement.height,1,1e4),THREEJS_WIDGET3D.scene=e.scene!==undefined?e.scene:new THREE.Scene,THREEJS_WIDGET3D.scene.add(THREEJS_WIDGET3D.camera);var u=!1;if(!WIDGET3D.isInitialized()){u=WIDGET3D.init({collisionCallback:{callback:THREEJS_WIDGET3D.checkIfHits},container:THREE.Object3D,domElement:THREEJS_WIDGET3D.renderer.domElement});if(!u)return console.log("Widget3D init failed!"),!1}else u=WIDGET3D.getMainWindow();return THREEJS_WIDGET3D.mainWindow=u,THREEJS_WIDGET3D.scene.add(THREEJS_WIDGET3D.mainWindow.container_),THREEJS_WIDGET3D.projector=new THREE.Projector,THREEJS_WIDGET3D.initialized=!0,u}},THREEJS_WIDGET3D.checkIfHits=function(e,t){if(!THREEJS_WIDGET3D.initialized)return console.log("THREEJS_WIDGET3D is not initialized!"),console.log("To initialize THREEJS_WIDGET3D: THREEJS_WIDGET3D.init()"),!1;var n=WIDGET3D.normalizedMouseCoordinates(e),r=new THREE.Vector3(n.x,n.y,1),i=THREEJS_WIDGET3D.projector.pickingRay(r,THREEJS_WIDGET3D.camera),s=i.intersectObjects(THREEJS_WIDGET3D.mainWindow.meshes_),o=!1;if(s.length>0)for(var u=0;u<s.length;++u)if(s[u].object.visible){o=s[u].object;var a=new THREE.Matrix4;a.getInverse(s[u].object.matrixWorld);var f=a.multiplyVector3(s[u].point.clone()),l=THREEJS_WIDGET3D.findObject(o,t);return l&&(l.mousePosition_=f),l}return!1},THREEJS_WIDGET3D.findObject=function(e,t){for(var n=0;n<THREEJS_WIDGET3D.mainWindow.childEvents_[t].length;++n)if(THREEJS_WIDGET3D.mainWindow.childEvents_[t][n].isVisible_&&e===THREEJS_WIDGET3D.mainWindow.childEvents_[t][n].mesh_)return THREEJS_WIDGET3D.mainWindow.childEvents_[t][n];return!1},THREEJS_WIDGET3D.render=function(){THREEJS_WIDGET3D.renderer.render(THREEJS_WIDGET3D.scene,THREEJS_WIDGET3D.camera)},THREEJS_WIDGET3D.GridWindow=function(e){WIDGET3D.Window.call(this);var e=e||{};this.width_=e.width!==undefined?e.width:1e3,this.height_=e.height!==undefined?e.height:1e3,this.density_=e.density!==undefined?e.density:10;var t=e.color!==undefined?e.color:7039851,n=e.lineWidth!==undefined?e.lineWidth:2;this.clickLocation_,this.rotationOnMouseDownY_,this.rotationOnMousedownX_,this.modelRotationY_=0,this.modelRotationX_=0,this.rotate_=!1;var r=new THREE.Mesh(new THREE.PlaneGeometry(this.width_,this.height_,this.density_,this.density_),new THREE.MeshBasicMaterial({color:t,opacity:.5,wireframe:!0,side:THREE.DoubleSide,wireframeLinewidth:n}));this.setMesh(r),e.defaultControls&&(this.addEventListener(WIDGET3D.EventType.onmousedown,this.mousedownHandler,this),this.addEventListener(WIDGET3D.EventType.onmouseup,this.mouseupHandler,this),this.addEventListener(WIDGET3D.EventType.onmousemove,this.mousemoveHandler,this))},THREEJS_WIDGET3D.GridWindow.prototype=WIDGET3D.Window.prototype.inheritance(),THREEJS_WIDGET3D.GridWindow.prototype.update=function(){var e=this.getRot();this.setRotY(e.y+(this.modelRotationY_-e.y)*.03),this.setRotX(e.x+(this.modelRotationX_-e.x)*.03),this.updateCallback_&&this.updateCallback_.callback(this.updateCallback_.arguments),WIDGET3D.mainWindow.needsUpdate()},THREEJS_WIDGET3D.GridWindow.prototype.mousedownHandler=function(e,t){return t.rotate_=!0,t.clickLocation_=WIDGET3D.normalizedMouseCoordinates(e),t.rotationOnMouseDownY_=t.modelRotationY_,t.rotationOnMouseDownX_=t.modelRotationX_,!1},THREEJS_WIDGET3D.GridWindow.prototype.mouseupHandler=function(e,t){t.rotate_=!1},THREEJS_WIDGET3D.GridWindow.prototype.mousemoveHandler=function(e,t){if(t.rotate_){var n=WIDGET3D.normalizedMouseCoordinates(e);t.modelRotationY_=t.rotationOnMouseDownY_+(n.x-t.clickLocation_.x),t.modelRotationX_=t.rotationOnMouseDownX_+(n.y-t.clickLocation_.y)}},THREEJS_WIDGET3D.GridIcon=function(e){WIDGET3D.Basic.call(this);var e=e||{},t=e.parent;if(t==undefined)return console.log("GridIcon needs to have grid window as parent!"),console.log("Parent has to be given in parameters."),!1;var e=e||{},n=e.color!==undefined?e.color:16777215,r=e.picture!==undefined?e.picture:!1;this.width_=t.width_/(t.density_+3.3),this.height_=t.height_/(t.density_+3.3),this.depth_=30;var i=new THREE.CubeGeometry(this.width_,this.height_,this.depth_),s;r?s=THREE.ImageUtils.loadTexture(r):s=!1;var o=new THREE.MeshBasicMaterial({map:s,color:n}),u=new THREE.Mesh(i,o);this.setMesh(u),t.addChild(this),this.setToPlace()},THREEJS_WIDGET3D.GridIcon.prototype=WIDGET3D.Basic.prototype.inheritance(),THREEJS_WIDGET3D.GridIcon.prototype.setToPlace=function(){var e=this.parent_.getLocation(),t=-this.parent_.width_/2+e.x/this.parent_.width_,n=this.parent_.height_/2+e.y/this.parent_.height_,r=this.parent_.width_/this.parent_.density_,i=this.parent_.height_/this.parent_.density_,s=r/2,o=i/2;if(this.parent_.children_.length-1>0){var u=this.parent_.children_[this.parent_.children_.length-2],a=u.getLocation();if((this.parent_.children_.length-1)%this.parent_.density_==0)var f=t+s,l=a.y-i;else var f=a.x+r,l=a.y}else var f=t+s,l=n-o;this.setLocation(f,l,e.z/this.parent_.height_)},THREEJS_WIDGET3D.TitledWindow=function(e){WIDGET3D.Window.call(this);var e=e||{};this.width_=e.width!==undefined?e.width:2e3,this.height_=e.height!==undefined?e.height:2e3;var t=e.title!==undefined?e.title:"title",n=e.color!==undefined?e.color:8421504,r=e.texture,i=e.material!==undefined?e.material:new THREE.MeshBasicMaterial({color:n,map:r,side:THREE.DoubleSide}),s=new THREE.Mesh(new THREE.PlaneGeometry(this.width_,this.height_),i);this.setMesh(s),this.clickLocation_,this.locationOnMouseDownY_,this.locationOnMousedownX_,this.modelLocationY_=this.getLocation().y,this.modelLocationX_=this.getLocation().x,this.drag_=!1,this.closeButton_=new WIDGET3D.Basic;var o=new THREE.Mesh(new THREE.PlaneGeometry(this.width_/10,this.height_/10),new THREE.MeshBasicMaterial({color:11141120,side:this.mesh_.material.side}));this.closeButton_.setMesh(o),this.closeButton_.setLocation(this.width_/2-this.width_/20,this.height_/2+this.height_/20,0),this.addChild(this.closeButton_),this.title_=new WIDGET3D.Basic,this.textureCanvas_=document.createElement("canvas"),this.textureCanvas_.width=512,this.textureCanvas_.height=128,this.textureCanvas_.style.display="none",document.body.appendChild(this.textureCanvas_),this.titleContext_=this.textureCanvas_.getContext("2d"),this.setTitle(t),this.addChild(this.title_),this.defaultControls_=e.defaultControls!==undefined?e.defaultControls:!1,this.defaultControls_&&(this.title_.addEventListener(WIDGET3D.EventType.onmousedown,this.mousedownHandler,this),this.title_.addEventListener(WIDGET3D.EventType.onmouseup,this.mouseupHandler,this),this.title_.addEventListener(WIDGET3D.EventType.onmousemove,this.mousemoveHandler,this))},THREEJS_WIDGET3D.TitledWindow.prototype=WIDGET3D.Window.prototype.inheritance(),THREEJS_WIDGET3D.TitledWindow.prototype.update=function(){if(this.defaultControls_){var e=new THREE.Vector3(this.modelLocationX_,this.modelLocationY_,1);THREEJS_WIDGET3D.projector.unprojectVector(e,THREEJS_WIDGET3D.camera).normalize(),e.x=e.x*WIDGET3D.getRealWidth(),e.y=e.y*WIDGET3D.getRealHeight();var t=this.getLocation();this.setY(t.y+(e.y-t.y)),this.setX(t.x+(e.x-t.x))}this.updateCallback_&&this.updateCallback_.callback(this.updateCallback_.arguments),WIDGET3D.mainWindow.needsUpdate()},THREEJS_WIDGET3D.TitledWindow.prototype.setTitle=function(e){this.titleContext_.fillStyle="#B3B3B3",this.titleContext_.fillRect(0,0,this.textureCanvas_.width,this.textureCanvas_.height),this.titleContext_.fillStyle="#000000",this.titleContext_.font="bold 60px Courier New",this.titleContext_.align="center",this.titleContext_.textBaseline="middle",this.titleContext_.fillText(e,10,this.textureCanvas_.height/2);var t=new THREE.Texture(this.textureCanvas_),n=new THREE.MeshBasicMaterial({map:t,side:this.mesh_.material.side}),r=new THREE.Mesh(new THREE.PlaneGeometry(this.width_-this.width_/10,this.height_/10),n);this.title_.setMesh(r),this.title_.setY(this.height_/2+this.height_/20),this.title_.setX((this.width_-this.width_/10)/2-this.width_/2),t.needsUpdate=!0},THREEJS_WIDGET3D.TitledWindow.prototype.mousedownHandler=function(e,t){t.focus(),t.drag_=!0,t.clickLocation_=WIDGET3D.normalizedMouseCoordinates(e),t.locationOnMouseDownY_=t.modelLocationY_,t.locationOnMouseDownX_=t.modelLocationX_},THREEJS_WIDGET3D.TitledWindow.prototype.mouseupHandler=function(e,t){t.drag_=!1},THREEJS_WIDGET3D.TitledWindow.prototype.mousemoveHandler=function(e,t){if(t.drag_){var n=WIDGET3D.normalizedMouseCoordinates(e);t.modelLocationY_=t.locationOnMouseDownY_+(n.y-t.clickLocation_.y),t.modelLocationX_=t.locationOnMouseDownX_+(n.x-t.clickLocation_.x)}},THREEJS_WIDGET3D.TitledWindow.prototype.remove=function(){for(var e=0;e<this.children_.length;++e)this.children_[e].remove();this.hide();var t=this.textureCanvas_;document.body.removeChild(t);for(var n=0;n<this.events_.length;++n)this.events_[n].callback&&this.removeEventListener(n);if(this.mesh_){var r=WIDGET3D.mainWindow.removeMesh(this.mesh_);r!=this.mesh_&&console.log("removed mesh was wrong! "+r)}this.parent_.container_.remove(this.container_);var i=this.parent_.removeFromObjects(this);i!=this&&(console.log(i),console.log(this),console.log("removed object was wrong! "+i))},THREEJS_WIDGET3D.Dialog=function(e){WIDGET3D.Window.call(this);var e=e||{};this.width_=e.width!==undefined?e.width:1e3,this.height_=e.height!==undefined?e.height:1e3,this.color_=e.color!==undefined?e.color:12636368,this.opacity_=e.opacity!==undefined?e.opacity:.9,this.text_=e.text!==undefined?e.text:"This is a dialog",this.buttonText_=e.buttonText!==undefined?e.buttonText:"submit",this.maxTextLength=e.maxTextLength!==undefined?e.maxTextLength:undefined,this.canvas_=document.createElement("canvas"),this.canvas_.width=512,this.canvas_.height=512,this.canvas_.style.display="none",document.body.appendChild(this.canvas_),this.context_=this.canvas_.getContext("2d"),this.material_=this.createDialogText(this.text_);var t=new THREE.Mesh(new THREE.PlaneGeometry(this.width_,this.height_),this.material_);this.setMesh(t),this.button_=new WIDGET3D.Basic,this.buttonCanvas_=document.createElement("canvas"),this.buttonCanvas_.width=512,this.buttonCanvas_.height=128,this.buttonCanvas_.style.display="none",document.body.appendChild(this.buttonCanvas_),this.buttonContext_=this.buttonCanvas_.getContext("2d"),this.createButtonText(this.buttonText_),this.addChild(this.button_),this.textBox_=new WIDGET3D.Text,this.textBox_.maxLength_=this.maxTextLength,this.textCanvas_=document.createElement("canvas"),this.textCanvas_.width=512,this.textCanvas_.height=128,this.textCanvas_.style.display="none",document.body.appendChild(this.textCanvas_),this.textContext_=this.textCanvas_.getContext("2d"),this.createTextBox(),this.textBox_.addUpdateCallback(this.updateTextBox,this),this.addChild(this.textBox_),this.textBox_.setText(""),this.textBox_.addEventListener(WIDGET3D.EventType.onclick,this.textBoxOnclick,this),this.textBox_.addEventListener(WIDGET3D.EventType.onkeypress,this.textBoxOnkeypress,this),this.textBox_.addEventListener(WIDGET3D.EventType.onkeydown,this.textBoxOnkeypress,this)},THREEJS_WIDGET3D.Dialog.prototype=WIDGET3D.Window.prototype.inheritance(),THREEJS_WIDGET3D.Dialog.prototype.update=function(){this.textBox_.update(),this.updateCallback_&&this.updateCallback_.callback(this.updateCallback_.arguments)},THREEJS_WIDGET3D.Dialog.prototype.createDialogText=function(e){this.context_.fillStyle="#FFFFFF",this.context_.fillRect(0,0,this.canvas_.width,this.canvas_.height),this.context_.fillStyle="#000055",this.context_.font="bold 30px Courier New",this.context_.align="center",this.context_.textBaseline="middle";var t=this.context_.measureText(e).width;this.context_.fillText(e,this.canvas_.width/2-t/2,40);var n=new THREE.Texture(this.canvas_),r=new THREE.MeshBasicMaterial({map:n,color:this.color_,opacity:this.opacity_});return n.needsUpdate=!0,r},THREEJS_WIDGET3D.Dialog.prototype.createButtonText=function(e){this.buttonContext_.fillStyle="#B3B3B3",this.buttonContext_.fillRect(0,0,this.buttonCanvas_.width,this.buttonCanvas_.height),this.buttonContext_.fillStyle="#000000",this.buttonContext_.font="bold 60px Courier New",this.buttonContext_.align="center",this.buttonContext_.textBaseline="middle";var t=this.buttonContext_.measureText(e).width;this.buttonContext_.fillText(e,this.buttonCanvas_.width/2-t/2,this.buttonCanvas_.height/2);var n=new THREE.Texture(this.buttonCanvas_),r=new THREE.MeshBasicMaterial({map:n}),i=new THREE.Mesh(new THREE.CubeGeometry(this.width_/2,this.height_/10,20),r);this.button_.setMesh(i);var s=this.getLocation(),o=s.y-this.height_/5;this.button_.setLocation(s.x,o,s.z),n.needsUpdate=!0},THREEJS_WIDGET3D.Dialog.prototype.createTextBox=function(){var e=new THREE.Texture(this.textCanvas_),t=new THREE.MeshBasicMaterial({map:e}),n=new THREE.Mesh(new THREE.PlaneGeometry(this.width_/1.5,this.height_/10),t);this.textBox_.setMesh(n);var r=this.getLocation(),i=r.y+this.height_/10;this.textBox_.setLocation(r.x,i,r.z+10),this.updateTextBox(this)},THREEJS_WIDGET3D.Dialog.prototype.updateTextBox=function(e){e.textContext_.fillStyle="#FFFFFF",e.textContext_.fillRect(0,0,e.textCanvas_.width,e.textCanvas_.height),e.textContext_.fillStyle="#000000",e.textContext_.font="bold 50px Courier New",e.textContext_.align="center",e.textContext_.textBaseline="middle",e.textContext_.fillText(e.textBox_.text_,5,e.textCanvas_.height/2),e.textBox_.mesh_.material.map.needsUpdate=!0},THREEJS_WIDGET3D.Dialog.prototype.textBoxOnclick=function(e,t){t.textBox_.focus()},THREEJS_WIDGET3D.Dialog.prototype.textBoxOnkeypress=function(e,t){if(e.charCode!=0){var n=String.fromCharCode(e.charCode);t.textBox_.addLetter(n)}else e.type=="keydown"&&(e.keyCode==8||e.keyCode==46)&&t.textBox_.erase(1)},THREEJS_WIDGET3D.Dialog.prototype.remove=function(){for(var e=0;e<this.children_.length;++e)this.children_[e].remove();this.hide();var t=this.textCanvas_,n=this.buttonCanvas_;document.body.removeChild(t),document.body.removeChild(n);for(var r=0;r<this.events_.length;++r)this.events_[r].callback&&this.removeEventListener(r);if(this.mesh_){var i=WIDGET3D.mainWindow.removeMesh(this.mesh_);i!=this.mesh_&&console.log("removed mesh was wrong! "+i)}this.parent_.container_.remove(this.container_);var s=this.parent_.removeFromObjects(this);s!=this&&(console.log(s),console.log(this),console.log("removed object was wrong! "+s))},THREEJS_WIDGET3D.SelectDialog=function(e){WIDGET3D.Window.call(this);var e=e||{};this.width_=e.width!==undefined?e.width:1e3,this.height_=e.height!==undefined?e.height:1e3,this.color_=e.color!==undefined?e.color:12636368,this.opacity_=e.opacity!==undefined?e.opacity:.9,this.choices_=e.choices!==undefined?e.choices:[],this.hasCancel_=e.hasCancel!==undefined?e.hasCancel:!1,this.text_=e.text!==undefined?e.text:!1,this.hasCancel_&&(this.cancelText_=e.cancelText!==undefined?e.cancelText:"Cancel",this.choices_.push({string:this.cancelText_,onclick:{handler:function(e,t){t.remove()},parameters:this}})),this.text_?this.createText():this.choiceHeight_=this.height_/(this.choices_.length*1.2),this.choiceCanvases_=[],this.createChoises()},THREEJS_WIDGET3D.SelectDialog.prototype=WIDGET3D.Window.prototype.inheritance(),THREEJS_WIDGET3D.SelectDialog.prototype.createText=function(){this.textCanvas_=document.createElement("canvas"),this.textCanvas_.width=512,this.textCanvas_.height=128,this.textCanvas_.style.display="none",document.body.appendChild(this.textCanvas_);var e=this.textCanvas_.getContext("2d"),t=this.createTitleMaterial(this.text_,e,this.textCanvas_);this.choiceHeight_=this.height_/((this.choices_.length+1)*1.2);var n=new THREE.Mesh(new THREE.CubeGeometry(this.width_,this.choiceHeight_,10),t);n.position.y=this.height_*.5-this.choiceHeight_*.5,console.log(this.choiceHeight_),this.setMesh(n)},THREEJS_WIDGET3D.SelectDialog.prototype.createChoises=function(){var e=0;for(var t=0;t<this.choices_.length;++t){var n=new WIDGET3D.Basic,r=document.createElement("canvas");this.choiceCanvases_.push(r),r.width=512,r.height=128,r.style.display="none",document.body.appendChild(r);var i=r.getContext("2d"),s=this.createButtonMaterial(this.choices_[t].string,i,r),o=this.width_/1.2,u=this.choiceHeight_,a=new THREE.Mesh(new THREE.CubeGeometry(o,u,10),s);n.setMesh(a);var f=this.getLocation(),l=0;t==0?this.text_?l=this.height_*.5-u*1.7:l=this.height_*.5-u*.5:l=e-1.2*u,e=l,n.setLocation(f.x,l,f.z),n.addEventListener(WIDGET3D.EventType.onclick,this.choices_[t].onclick.handler,this.choices_[t].onclick.parameters),n.menuID_=t,this.addChild(n)}},THREEJS_WIDGET3D.SelectDialog.prototype.createButtonMaterial=function(e,t,n){t.fillStyle="#FFFFFF",t.fillRect(0,0,n.width,n.height),t.fillStyle="#000000",t.font="bold 40px Courier New",t.align="center",t.textBaseline="middle";var r=t.measureText(e).width;t.fillText(e,n.width/2-r/2,n.height/2);var i=new THREE.Texture(n),s=new THREE.MeshBasicMaterial({map:i,color:this.color_,opacity:this.opacity_});return i.needsUpdate=!0,s},THREEJS_WIDGET3D.SelectDialog.prototype.createTitleMaterial=function(e,t,n){t.fillStyle="#FFFFFF",t.fillRect(0,0,n.width,n.height),t.fillStyle="#000000",t.font="bold 45px Courier New",t.align="center",t.textBaseline="middle";var r=t.measureText(e).width;t.fillText(e,n.width/2-r/2,n.height/2);var i=new THREE.Texture(n),s=new THREE.MeshBasicMaterial({map:i,color:this.color_,opacity:this.opacity_});return i.needsUpdate=!0,s},THREEJS_WIDGET3D.SelectDialog.prototype.changeChoiceText=function(e,t){var n=!1;for(var r=0;r<this.children_.length;++r)if(this.children_[r].menuID_==t){n=this.children_[r];break}if(n){var i=n.mesh_.material.map.image,s=n.mesh_.material.map.image.getContext("2d"),o=this.createButtonMaterial(e,s,i);return n.mesh_.material=o,n.mesh_.needsUpdate=!0,!0}return!1},THREEJS_WIDGET3D.SelectDialog.prototype.remove=function(){for(var e=0;e<this.children_.length;++e)this.children_[e].remove();for(var t=0;t<this.choiceCanvases_.length;++t)n=this.choiceCanvases_[t],document.body.removeChild(n);this.hide();var n=this.textCanvas_;document.body.removeChild(n);for(var t=0;t<this.events_.length;++t)this.events_[t].callback&&this.removeEventListener(t);if(this.mesh_){var r=WIDGET3D.mainWindow.removeMesh(this.mesh_);r!=this.mesh_&&console.log("removed mesh was wrong! "+r)}this.parent_.container_.remove(this.container_);var i=this.parent_.removeFromObjects(this);i!=this&&(console.log(i),console.log(this),console.log("removed object was wrong! "+i))}