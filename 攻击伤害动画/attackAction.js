//攻击，玩家伤害，怪物伤害
var img = cc.Sprite.create("res/1.png");
var seq;
var callback = cc.callFunc(function(target)
{
	target.removeFromParent();
}, img);

var scaleNum = 1
//角色掉血
var scale = new cc.ScaleTo( .1, scaleNum ); 
//seq = new cc.Sequence( scale, new cc.EaseExponentialOut(new cc.ScaleTo( .5, 1 )), new cc.EaseExponentialIn( new cc.MoveBy( .3, 30, -30) ),callback);
seq = new cc.Sequence( scale, new cc.EaseExponentialOut( new cc.ScaleTo( .2, 1 ) ), new cc.EaseExponentialIn( new cc.MoveBy( .5, 70, -70) ),callback);
scene.addChild(img);  

//怪物掉血
var p = cc.p(cc.winSize.width/2,cc.winSize.height/2);
var spawn = new cc.Spawn( new cc.MoveBy( 0.6, 0, 120 ), new cc.FadeTo( 0.6, 100 ) );
seq = new cc.Sequence( new cc.EaseExponentialOut( new cc.MoveBy( .5, p.x/2, -p.y/2 ) ), spawn, callback);

img.setPosition(cc.winSize.width/2,cc.winSize.height/2);
img.runAction(seq);