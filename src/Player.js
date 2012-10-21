Player = Agent.extend({
	moveX: 0,
  moveY: 0,
  speed: 200,
  direction: 0,
  currentAction : null,
  moving: false,

  ctor:function (opts) {
      this._super(opts);
  },

 update: function(dt) {
    this._super(dt);

    if(this.moveX == 0 && this.moveY == 0) {
      return;
    }
    var collisionLayer = this.tmxMap.layerNamed('collision')

    var nextTileX = 0
    var nextTileY = 0
    var nextStepX = 0
    var nextStepY = 0

    // applied timed-based movement to our player
    // Cocos2D-Javascript doesn't seem to like floating point so we are ensuring integer here else will see graphical artificats
    // we need to floor/ceil if its negative/positive or we will have ibalance movement speed on opposite directions

    var amountMoveX = this.moveX < 0 ? Math.floor(this.moveX * dt) : Math.ceil(this.moveX * dt)
    var amountMoveY = this.moveY < 0 ? Math.floor(this.moveY * dt) : Math.ceil(this.moveY * dt)
    
    var destPos = cc.pAdd(this.getPosition(), cc.p(amountMoveX,amountMoveY))
    var tw = this.tmxMap.getTileSize().width;
    var th = this.tmxMap.getTileSize().height;
    var mw = this.tmxMap.getMapSize().width;
    var mh = this.tmxMap.getMapSize().height;

    var y = mh - destPos.x/tw + mw/2 - destPos.y/th;
    var x = mh + destPos.x/tw - mw/2 - destPos.y/th;

    nextTileX = Math.ceil(x)
    nextTileY = Math.ceil(y)

    // var dir = this.getDirection(destPos, this.getPosition());
    // log.info(dir[0].x + ',' + dir[1].y + '|' + dir[1]);
    
    // this.tamara = layer.tileAt(cc.p(29, 29));
    var gid = collisionLayer.tileGIDAt(cc.p(nextTileX, nextTileY))
    var gid2 = collisionLayer.tileGIDAt(cc.p(nextTileX, this.tileY))
    var gid3 = collisionLayer.tileGIDAt(cc.p(this.tileX, nextTileY))

    if(gid == 0) {
      this.setPosition(destPos);
      this.tmxMap.setPosition(cc.pSub(this.tmxMap.getPosition(), cc.p(amountMoveX, amountMoveY)));
    } else {
      this.moveX = 0
      this.moveY = 0
      //this.play({animationName: 'idle', animationIndex: this.direction, loop : true})
    }

    this.emit('playerPos', { x: this.getPosition().x, y: this.getPosition().y})
  },

  keyDown: function(keyCode) {
    var charCode = String.fromCharCode(keyCode)
    
    if(charCode == 'D' || keyCode == '39') {
      this.moveX = this.speed
      this.direction = 4
    } else if(charCode == 'A' || keyCode == '37') {
      this.moveX = -this.speed
      this.direction = 0
    } else if(charCode == 'S' || charCode == 'X' || keyCode == '40') {
      this.moveY = -this.speed
      this.direction = 6
    } else if(charCode == 'W' || keyCode == '38') {
      this.moveY = this.speed
      this.direction = 2
    } else if(charCode == 'E') {
      this.moveY = this.speed / 2
      this.moveX = this.speed
      this.direction = 3
    } else if(charCode == 'Q') {
      this.moveY = this.speed / 2
      this.moveX = -this.speed
      this.direction = 1
    } else if(charCode == 'Z') {
      this.moveY = -this.speed / 2
      this.moveX = -this.speed
      this.direction = 7
    } else if(charCode == 'C') {
      this.moveY = -this.speed / 2
      this.moveX = this.speed
      this.direction = 5
    }

    if(this.moveX != 0 || this.moveY != 0 ) {
      // this.play({animationName: 'walk', animationIndex: this.direction, loop : true})
      if(!this.moving) {
        this.sprite.stopAllActions();    
        this.sprite.runAction(cc.RepeatForever.create(cc.Animate.create(this.animationSets['walk'].animations[this.direction])));
        this.moving = true;
      }
      
    }
  },
  keyUp: function(keyCode) {
    this.moveX = 0
    this.moveY = 0

    this.sprite.stopAllActions();    
    this.sprite.runAction(cc.RepeatForever.create(cc.Animate.create(this.animationSets['idle'].animations[this.direction])));

    this.moving = false;

    return true
  },
});