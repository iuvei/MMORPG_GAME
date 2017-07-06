var node1 = new ccui.ImageView("res/001.png");
node1.setPosition(cc.winSize.width/2,cc.winSize.height/1.2);
var node2 = new cc.Sprite("res/4.png");
node1.addChild(node2);
scene.addChild(node1);


var node1 = new ccui.ImageView("res/001.png");
node1.setPosition(cc.winSize.width/2,cc.winSize.height/2);
var node2 = new cc.Sprite("res/4.png");
node1.addChild(node2);
scene.addChild(node1);
//设为灰色
Filter.GrayScale(node1);
//还原            
Filter.UnGray(node2);