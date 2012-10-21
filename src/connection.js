if(io) {
  var socket = io.connect('http://localhost');

  socket.on('news', function (data) {
    console.log(data);    
  });

  var otherPlayer;

  socket.on('playerConnected', function (data) {
    var tmxMap = layer.tmxMap;
    var player = new Player({ tmxMap: tmxMap, folderName: 'player'});
    player.setPosition(cc.p(1678,948));    
    
    var objectLayer = tmxMap.layerNamed('object');
    objectLayer.addChild(player);      

    otherPlayer = player;
  });

  socket.on('playerPos', function(data){
    
    otherPlayer.setPosition(cc.p(data.pos.x, data.pos.y));

    otherPlayer.sprite.stopAllActions();    
    otherPlayer.sprite.runAction(cc.RepeatForever.create(cc.Animate.create(otherPlayer.animationSets['walk'].animations[5])));
  });

}