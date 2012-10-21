/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var TAG_TILE_MAP = 1;
var debugLabel = null;
var layer;
var level;
var mouseTileX;
var mouseTileY;

Object.prototype.getName = function() { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};

var MyLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    player: null,
    tmxMap : null,
    prevLocation:null,

    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();
        log.info('Canvas size: ' + size.width + 'x' + size.height)

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            "res/CloseNormal.png",
            "res/CloseSelected.png",
            this,
            function () {
                window.location = '';
            });
        closeItem.setAnchorPoint(cc.p(0.5, 0.5));

        var menu = cc.Menu.create(closeItem, null);
        menu.setPosition(cc.PointZero());
        this.addChild(menu, 1);
        closeItem.setPosition(cc.p(size.width - 20, 20));

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(cc.p(size.width / 2, size.height - 40));
        // add the label as a child to this layer
        //this.addChild(this.helloLabel, 5);

        // var lazyLayer = new cc.LazyLayer();
        // this.addChild(lazyLayer);

        // add "Helloworld" splash screen"
        this.sprite = cc.Sprite.create("res/HelloWorld.png");
        this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
        this.sprite.setPosition(cc.p(size.width / 2, size.height / 2));

        //lazyLayer.addChild(this.sprite, 0);

        // var worker = new Worker('tilemap_loader.js');
        // worker.addEventListener('message', function(e) {
        //     console.log('Worker said: ', e.data);
        // }, false);

        // worker.postMessage('Hello World'); // Send data to our worker.

        level = new Level({ file: 'res/atrium.tmx' });
        this.tmxMap = level.tmxMap;
        // this.tmxMap = cc.TMXTiledMap.create("res/atrium.tmx");
        this.addChild(this.tmxMap, 0, TAG_TILE_MAP);


        // get dimension properties from our tmx map
        // var ms = this.tmxMap.getMapSize()
        // , ts = this.tmxMap.getTileSize()
        // , ws = cc.SizeMake(ms.width * ts.width, ms.height * ts.height)

        // // calculate the center spot for the map
        // var mapCenterX = -ms.width * ts.width / 2
        // var mapCenterY = -ms.height * ts.height / 2

        // this.tmxMap.setPosition(cc.p(mapCenterX + size.width / 2, mapCenterY + size.height / 2));

        // log.info(
        //       'Map loaded. Size: ' + ms.width + 'x' + ms.height +
        //       ' Tile size: ' + ts.width + 'x' + ts.height +
        //       ' World size: ' + ws.width + 'x' + ws.height +
        //       ' Map pos: ' + this.tmxMap.getPosition().x + ',' + this.tmxMap.getPosition().y +
        //       ' Anchor pt: ' + this.tmxMap.getAnchorPoint().x + ',' + this.tmxMap.getAnchorPoint().y)

        // load player
        this.player = new Player({ tmxMap: this.tmxMap, folderName: 'player'});
        this.player.setPosition(cc.p(1678,948));
        level.objectLayer.addChild(this.player);    
        // this.tmxMap.addChild(this.player);

        // var collisionLayer = this.tmxMap.layerNamed('collision')
        // collisionLayer.setVisible(false);
        
        // // get our object & wall layer
        // var objectLayer = this.tmxMap.layerNamed('object');
        // objectLayer.addChild(this.player);    

        // // reorder each tile's z-order
        // for(var y = 0; y < ms.height; y++) {
        //   for(var x = 0; x < ms.width; x++) {
        //     var tile = objectLayer.tileAt(cc.p(y,x));
        //     // ensure there's an object or wall
        //     if( tile ) {
        //       // add x and y this is equivalient to increasing the tile's z-order row by row
        //       // this.tmxMap.reorderChild(tile, x + y);
        //       objectLayer.reorderChild(tile, x + y);
        //     }
        //   }
        // }

        for( var i = 0; i < 0; i++) {
            // setTimeout(function(){
            var monster = new Monster({ tmxMap: layer.tmxMap, folderName: 'skeleton'});
            monster.setPosition(cc.p(cc.RANDOM_0_1() * 500 + 1000, cc.RANDOM_0_1() * 500 + 500));
            level.objectLayer.addChild(monster);                
            //this.tmxMap.addChild(monster);
            // }, 100 * i);
        }

        this.setTouchEnabled(true);
        this.setTouchEnabled(true);
        this.setKeyboardEnabled(true);
        this.scheduleUpdate();

        console.log('creating isogrid');
        //this.addChild(this.createIsoGrid(this.tmxMap));        
        
        this.addChild(this.createDebugPanel());

        var endTime   = new Date()
        log.info('Load time: ' + Math.abs((parent.startTime.getTime() - endTime.getTime()) / 1000) + ' seconds.')
        log.info('Press WASD + QEZC to move our hero in 8 directions.')

        console.log('game starting');
        return true;
    },
    update: function(dt) {
        this._super();

        var objectLayer = level.objectLayer;
        var tile = objectLayer.tileAt(cc.p(this.player.tileX, this.player.tileY));
        if(tile) {
           debugLabel.setString('player z: ' + this.player.getZOrder() + ' tile zindex: ' + tile.getZOrder());
        } else {
            debugLabel.setString(this.player.getZOrder());
        }
    },
    registerWithTouchDispatcher:function () {
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
        cc.Director.getInstance().getTouchDispatcher().addStandardDelegate(this, 0);        
    },
    onTouchBegan:function (touch, event) {

        level.getPath({targetTileX: mouseTileX, targetTileY: mouseTileY, player: this.player});

        return true;
    },
    onTouchEnded:function (touch, event) {
        this.prevLocation = null;
    },
    // on mouse move
    onTouchesMoved:function(touch, event) {
        var touchLocation = touch[0].getLocation();

        var tmxMap = this.tmxMap
        var ms = this.tmxMap.getMapSize()
        , ts = this.tmxMap.getTileSize()
        , ws = cc.SizeMake(ms.width * ts.width, ms.height * ts.height);

        var tw = ts.width
        var th = ts.height
        var canvas = cc.canvas;
        var worldPos = this.tmxMap.convertTouchToNodeSpace(touch[0]);
        ymouse = Math.round((worldPos.y/th) + 0.5) - 1
        xmouse = Math.round((worldPos.x/tw) + 0.5) - 1

        mouseTileX = xmouse
        mouseTileY = ymouse

        var gid = level.collisionLayer.tileGIDAt(cc.p(mouseTileX, mouseTileY))
        var pos = level.backgroundLayer.positionAt(cc.p(mouseTileX, mouseTileY));
        zindex = 0;                
        
        //debugLabel.setString('tile coord: ' + xmouse + ',' + ymouse + ' world pos: ' + worldPos.x + ',' + worldPos.y  + ' gid: ' + gid + ' player tile coord: ' + this.player.tileX + ',' + this.player.tileY + ' z: ' + zindex + ' tile pos: ' + pos.x + ',' + pos.y);
    },
    onTouchCancelled:function (touch, event) {
    }, 
    onTouchMoved:function (touch, event) {

        var touchLocation = touch.getLocation();

        if (!this.prevLocation) {
            this.prevLocation = cc.p(touchLocation.x, touchLocation.y);
            return;
        }
        var node = this.getChildByTag(TAG_TILE_MAP);
        var diff = cc.pSub(touchLocation, this.prevLocation);
        var currentPos = node.getPosition();

        //diff = cc.p(diff.x * node.getScaleX(),diff.y * node.getScaleY());
        var curPos = cc.pAdd(currentPos, diff);
        node.setPosition(curPos);
        this.prevLocation = cc.p(touchLocation.x, touchLocation.y);
    },
    onKeyDown:function (keyCode) {
        this.player.keyDown(keyCode);
    },
    onKeyUp:function (keyCode) {
        this.player.keyUp(keyCode);
    },

    // draw: function() {
    //     this._super();

    //     cc.renderContext.fillStyle = "rgba(255,255,255, 0.5)";
    //     cc.renderContext.strokeStyle = "rgba(255,255,255,1)";
    //     // draw a simple line
    //     // The default state is:
    //     // Line Width: 1
    //     // color: 255,255,255,255 (white, non-transparent)
    //     // Anti-Aliased
    //     // cc.drawingUtil.drawLine(cc.p(0, 0), cc.p(150, 150));

    //     var size = cc.Director.getInstance().getWinSize();
    //     //cc.renderContext.fillStyle = "rgba(0, 0, 1, 0.8)";
    //     // cc.renderContext.beginPath();
    //     cc.renderContext.fillRect(0, 0, size.width, 70);
    //     // cc.renderContext.closePath();
    //     cc.renderContext.fill();
        
    //     cc.renderContext.moveTo(0, 0);
    //     cc.renderContext.lineTo(150, 150);
        
    //     cc.renderContext.stroke();
    // },

     // returns a nodes.RenderTexture with an ISO grid
    createIsoGrid : function(tmxMap) {
        var ms = tmxMap.getMapSize()
        , ts = tmxMap.getTileSize()
        , ws = cc.SizeMake(ms.width * ts.width, ms.height * ts.height)

        console.log('create texture...' + ws.width + ',' + ws.height);
        var texture = cc.RenderTexture.create(ws.width, ws.height, cc.IMAGE_FORMAT_RAWDATA);

        var gridWidth = ts.width
        var gridHeight = ts.height
        var ctx = texture.context

        ctx.strokeStyle = 'white'

        console.log('doing firsthalf')
        // first half
        for(var y = 0; y < ms.width; y++) {
          var startX = ws.width / 2
          var startY = (ws.height / 2 + (ms.width / 2) * gridHeight) - 16

          startY = startY - y * gridHeight / 2
          startX = startX - y * gridWidth / 2

          for(var x = 0; x < y + 1; x++) {
            var nextX = startX + (x * gridWidth)

            ctx.moveTo(nextX - gridWidth / 2, startY)
            ctx.lineTo(nextX, startY + gridHeight / 2)
            ctx.lineTo(nextX + gridWidth / 2, startY)
            ctx.lineTo(nextX, startY - gridHeight / 2)
            ctx.lineTo(nextX - gridWidth / 2, startY)
          }
        }

        console.log('doing secondhalf')
        // second half
        for(var y = 0; y < ms.width - 1; y++) {
          var startX = ws.width / 2
          var startY = ws.height / 2 - (((ms.width / 2 - 1) - y) * gridHeight)
          startY = startY - 16

          startY = startY - y * gridHeight / 2
          startX = startX - y * gridWidth / 2

          for(var x = 0; x < y + 1; x++) {
            var nextX = startX + (x * gridWidth)

            ctx.moveTo(nextX - gridWidth / 2, startY)
            ctx.lineTo(nextX, startY + gridHeight / 2)
            ctx.lineTo(nextX + gridWidth / 2, startY)
            ctx.lineTo(nextX, startY - gridHeight / 2)
            ctx.lineTo(nextX - gridWidth / 2, startY)
          }
        }

        ctx.stroke()
        console.log('stroke done');
        return texture
    },
    createDebugPanel : function() {
        var size = cc.Director.getInstance().getWinSize();
        var texture = cc.RenderTexture.create(size.width,  570);
        // texture.setContentSize(cc.p(size.width, 70));
        // texture.setPosition(cc.p(5, 30));        
        // texture.setAnchorPoint(cc.p(0, 0));
        
        var ctx = texture.context;
        ctx.translate(0, size.height);
        
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.fillStyle = "rgba(255,255,255,1)";
        //ctx.fillStyle = "rgba(0, 0, 1, 0.8)";
        ctx.fillRect(0, 0, size.width, -200);
        
        ctx.fill();
        
        ctx.fillText('texture hello world', 50, 10);

        // ctx.beginPath();
        // ctx.moveTo(50, 50);
        // ctx.lineTo(450, 450);
        // ctx.closePath();
        // ctx.stroke();        
        
        debugLabel = cc.LabelTTF.create("Debug Panel", "Arial", 24);
        debugLabel.setPosition(cc.p(5, 50));        
        debugLabel.setAnchorPoint(cc.p(0, 0));

        //this.addChild(debugLabel);
        texture.addChild(debugLabel);

        return texture;
      }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
