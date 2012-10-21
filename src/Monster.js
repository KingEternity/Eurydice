Monster = Agent.extend({

  ctor:function (opts) {
    this._super(opts);
  },

  update : function(dt) {
      this._super(dt);    

      if(this.numberOfRunningActions() == 0) {
        var targetPos = cc.p(cc.RANDOM_MINUS1_1() * 200, cc.RANDOM_MINUS1_1() * 200);
        this.calcDirection(targetPos);

        var direction = this.getDirection(this.getPosition(), targetPos);
        var diff = cc.pSub(this.getPosition(), targetPos)
        var degrees = cc.RADIANS_TO_DEGREES(cc.pToAngle(targetPos)) + 180;        
        var rowIndex = 8 - Math.ceil(degrees / 45);
        //log.debug(degrees + ',' + rowIndex);
        
        var action = cc.MoveBy.create(cc.RANDOM_0_1() * 5 + 3, targetPos);
        this.runAction(action);

        this.sprite.stopAllActions();
        this.sprite.runAction(cc.RepeatForever.create(cc.Animate.create(this.animationSets['walk'].animations[rowIndex])));
        
        //console.log(this.numberOfRunningActions());
      }
      
  }
});