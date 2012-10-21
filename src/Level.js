Level = cc.Class.extend({
  ms        : null, // map size
  ts        : null, // tile size
  ws        : null, // world size
  tmxMap    : null, // TMXTiledMap
  mapCenterOffsetX : 0,
  mapCenterOffsetY : 0,

  collisionLayer  : null,
  backgroundLayer : null,
  objectLayer     : null,

  graph           : null, // stores graph for A Star

  ctor:function (opts) {    
    log.debug('loading tilemap: ' + opts.file);
    this.tmxMap = cc.TMXTiledMap.create(opts.file);    

    this.ms = this.tmxMap.getMapSize();
    this.ts = this.tmxMap.getTileSize();
    this.ws = cc.SizeMake(this.ms.width * this.ts.width, this.ms.height * this.ts.height);

    this.mapCenterOffsetX = -this.ms.width * this.ts.width / 2
    this.mapCenterOffsetY = -this.ms.height * this.ts.height / 2
    //this.tmxMap.setAnchorPoint(cc.p(0.5, 0.5));
    
    // center our map
    var d = cc.Director.getInstance();
    var s = d.getWinSize();
    this.tmxMap.setPosition(cc.p(this.mapCenterOffsetX + s.width/2, this.mapCenterOffsetY + s.height/2));      

    log.info(
      'Map size: ' + this.ms.width + 'x' + this.ms.height +
      ' Tile size: ' + this.ts.width + 'x' + this.ts.height +
      ' World size: ' + this.ws.width + 'x' + this.ws.height +
      ' start pos: ' + this.tmxMap.getPosition().x + ',' + this.tmxMap.getPosition().y +
      ' anchor pt: ' + this.tmxMap.getAnchorPoint().x + ',' + this.tmxMap.getAnchorPoint().y)


    this.backgroundLayer = this.tmxMap.layerNamed('background');
    this.collisionLayer = this.tmxMap.layerNamed('collision');
    this.objectLayer = this.tmxMap.layerNamed('object');
    this.collisionLayer.setVisible(false);

    // this.objectLayer.addChild({child: player})
    // this.player.playAnimation()

    this.updateZIndex();
    this.initGraph();  
  },

  getPath: function(opts) {
    var graph = this.graph
    var start = graph.nodes[opts.player.tileX][opts.player.tileY];
    var end = graph.nodes[opts.targetTileX][opts.targetTileY];
    var coordinates = astar.search(graph.nodes, start, end);

    var finalPos = this.backgroundLayer.positionAt(cc.p(end.x, end.y));
    finalPos = cc.p(end.x * 64, end.y * 32)   
    finalPos.x += 32
    finalPos.y += 32
    log.debug('astar search: start: ' + start + ' end: ' + end + ' coords length: ' + coordinates.length)
    console.log(end)
    log.debug('final position: ' + finalPos.x + ',' + finalPos.y);
    opts.player.setPosition(finalPos);
  },

  updateZIndex: function() {
     // reorder each tile's z-order so our player's z index will work
    for(var y = 0; y < this.ms.height; y++) {
      for(var x = 0; x < this.ms.width; x++) {
        var tile = this.objectLayer.tileAt(cc.p(x,y))
        // var pos = this.objectLayer.positionAt(cc.p(x, y));
        // if(pos.y == 0 ) {
        //   console.log(pos.x + ',' + pos.y)
        // }
        // ensure there's an object or wall
        if( tile ) {
          // add x and y this is equivalient to increasing the tile's z-order row by row
          this.objectLayer.reorderChild(tile, x + y);
        }        
      }
    }
  },

  initGraph: function() {
    // initialize graph for astar
    var debugGraph = $('#searchGrid')
    var cellTemplate = $("<span />").addClass("grid_item").width(4).height(4);

    var grid = [];

    for(var x = 0; x < this.ms.width; x++) {
      var node = [];

      var row = $("<div class='clear' />");
      debugGraph.append(row)

      for(var y = 0; y < this.ms.height; y++) {

        var cell = cellTemplate.clone();
        row.append(cell);

        var gid = this.collisionLayer.tileGIDAt(cc.p(x, y))        
        if(gid == 1 || gid == 2) {
          node.push(parent.GraphNodeType.WALL)
          cell.addClass('wall')
          // exit
        } else if(gid == 3) {
          // exit          
          node.push(parent.GraphNodeType.OPEN)
        } else {          
          node.push(parent.GraphNodeType.OPEN)
        }
      }

      grid.push(node);
    }

    this.graph = new parent.Graph(grid);
  }
});