Agent = cc.Node.extend({
  animationSets : null,
  speed: 0,
  direction: 7, // facing SW default direction
  sprite : null,
  tmxMap : null, // current tmxmap agent is on

  moveX: 0,
  moveY: 0,
  speed: 200,
  currentAction : null,
  moving: false,
  curDirection: null,
  animationIndex : 0,

  tileX: 0,        // current tile coordinates in map
  tileY: 0,

    ctor:function (opts) {
        this._super();

        this.tmxMap     = opts.tmxMap

        this.animationSets = new Array()

        this.animationSets['walk'] = new AnimationSet({
            textureFile: 'res/agents/' + opts.folderName + '/walk.png',
            frameWidth: 128,
            frameHeight: 128,
            animationDelay: 0.15,
            backward: false
        })

        this.animationSets['idle'] = new AnimationSet({
            textureFile: 'res/agents/' + opts.folderName + '/idle.png',
            frameWidth: 128,
            frameHeight: 128,
            animationDelay: 0.15,
            backward: true
        })        

        this.sprite = new cc.Sprite();
        this.sprite.initWithSpriteFrame(this.animationSets['walk'].startingFrame);

        this.addChild(this.sprite);

        this.sprite.runAction(cc.RepeatForever.create(cc.Animate.create(this.animationSets['idle'].animations[5])));

        this.scheduleUpdate();
    },

    update : function(dt) {
        this._super(dt); 

        var tw = this.tmxMap.getTileSize().width;
        var th = this.tmxMap.getTileSize().height;
        var mw = this.tmxMap.getMapSize().width;
        var mh = this.tmxMap.getMapSize().height;

        var y = mh - this.getPosition().x/tw + mw/2 - this.getPosition().y/th;
        var x = mh + this.getPosition().x/tw - mw/2 - this.getPosition().y/th;

        var worldPos = this.getPosition();
        ymouse = Math.round((worldPos.y/th) + 0.5) - 1
        xmouse = Math.round((worldPos.x/tw) + 0.5) - 1

        
        this.tileX = xmouse
        this.tileY = ymouse
        this.tileX = Math.ceil(x);
        this.tileY = Math.ceil(y);

        var objectLayer = this.tmxMap.layerNamed('object');
        objectLayer.reorderChild(this, this.tileX + this.tileY - 1);        
    },

    calcDirection : function(destPos) {
      var dir = this.getDirection(this.getPosition(), destPos)
      this.curDirection = dir

     // See which direction the sprite is facing for the next tile
      if(dir.x < 0 && dir.y > 0) {
        this.curHeading = 'NW'
        this.animationIndex = 3
      } else if(dir.x > 0 && dir.y > 0) {
        this.curHeading = 'NE'
        this.animationIndex = 5
      } else if(dir.x < 0 && dir.y < 0) {
        this.curHeading = 'SW'
        this.animationIndex = 1
      } else if(dir.x > 0 && dir.y < 0) {
        this.curHeading = 'SE'
        this.animationIndex = 7
      }
    },

    getDirection : function(sourcePos, targetPos) {
      var direction = cc.pNormalize(cc.pSub(sourcePos, targetPos));
      return direction;
    },

    emit: function(evt, data) {
      if(socket) {
        socket.emit(evt, data)
      }
    }
});