ctor:function () 
{
	this._super();
	this.init();
	var self = this;
	var loadAnimationImg = function()
	{
		cc.loader.loadImg("res/bibirole.png", function (err, img) 
		{
			if(err)
			{
				cc.log(err);
			}
			else
			{
				var texture2d = img;
				var retFrames = self._ParseAnimi(animjson, texture2d);
				var obj = {frames: retFrames, animjson: animjson};
			}
		});
	};
	var animjson = null;
	cc.loader.loadTxt("res/bibirole.json", function (err, txt) 
	{
		if(err)
		{
			cc.log(err);
		}
		else
		{
			animjson = JSON.parse(txt);
			loadAnimationImg.call(null);
		}
	});
},
_ParseAnimi:function(animjson, texture)
{
	var frames = animjson.frames;// 每帧图片的参数
	var retFrames = [];

	var frame = null;
	var spriteFrame = null;
	var locTexture = null;
	var tempElement = null;
	var tempTexture = null;
	var rect = null;
	var mm = 100;
	for ( var i = 0, len = frames.length; i < len; i++ ) {
		frame = frames[i];
		spriteFrame = retFrames[frame.name];

		if ( !spriteFrame ) {
			// 从纹理图片上剪切对应的帧图
			spriteFrame = new cc.SpriteFrame( texture, frame.rect, frame.rotated, frame.offset, animjson.sourceSize );
			/*使用例子
				var sp = new cc.Sprite();
				sp.initWithSpriteFrame(spriteFrame);
				sp.x = mm+=110;
				sp.y = 200;
				this.addChild(sp);
			*/
			// spriteFrame.name = frame.name;
			/* 
				cc.spriteFrameCache.addSpriteFrame( spriteFrame, frame.name );
				var sp =new cc.Sprite("#001.png");
				self.addChild(sp);
				sp.x = sp.y = 500;
			*/
			spriteFrame.retain();	//动画不放spriteFrameCache里  测下removeunusedSpriteFrame
			if(spriteFrame.getTexture() instanceof Object)
				retFrames.push(spriteFrame);
		}
	}
	return retFrames;
},