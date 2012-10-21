importScripts('cocos2d-html5/cocos2d/platform/CCClass.js');
importScripts('cocos2d-html5/cocos2d/cocoa/CCGeometry.js');
importScripts('cocos2d-html5/cocos2d/platform/platform.js');
importScripts('cocos2d-html5/cocos2d/CCDirector.js');
importScripts('cocos2d-html5/cocos2d/base_nodes/CCNode.js');
importScripts('cocos2d-html5/cocos2d/tileMap_parallax_nodes/CCTMXTiledMap.js');


self.addEventListener('message', function(e) {
  var map = cc.TMXTiledMap.create("res/atrium.tmx");

  self.postMessage(e.data);
}, false);