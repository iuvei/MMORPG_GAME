/**
 * 时间相关工具集合
 */
var TimerUtil = TimerUtil || {
	
	GetTimer:function()
	{
		return new Date().getTime();
	},
	
	
	TimeUpdate:function( callback, target, interval, repeat, delay )
	{
		if ( this._scheduler == null )
		{
			this._scheduler = cc.director.getScheduler();
		}
		interval = interval || 0;
		repeat = (repeat == null) ? cc.REPEAT_FOREVER : repeat;
		delay = delay || 0;
		if ( this._keyIndex == null )
		{
			this._keyIndex = 0;
		}
		
		this._keyIndex++;
		this._scheduler.schedule(callback, target, interval, repeat, delay, false, this._keyIndex + "" );
		return this._keyIndex;
	},
	
	ClearTimeUpdate:function( keyIndex, target )
	{
		this._scheduler.unschedule( keyIndex + "", target );
	},

	/**
	 * 封装一下 cocos里默认this指针是Global
	 * @param target
	 * @param callback
	 * @param delay
	 * @constructor
	 */
	SetTimeout:function( target, callback, delay )
	{
		if( delay < 50 && delay != 0 )
		{
			cc.log( "************************ The delay param is too small, please sure that delay unit is ms. ********************" );
		}
		var args;
		if (arguments.length > 3)
		{
			args = Array.prototype.slice.call(arguments, 3);
		}
		return setTimeout(function(param)
		{
			callback.apply(target, param);
		}, delay, args);
	},

	ClearTimeout:function(timeId)
	{
		clearTimeout(timeId);
	},

	/**
	 * 下一帧触发 一般用于避免重复渲染
	 * @param callback
	 * @param target
	 * @constructor
	 */
	NextFrame:function( callback, target )
	{
		this.TimeUpdate( callback, target, 0, 1 );
	}
}

//一般使用
this.UpdateId = TimerUtil.TimeUpdate(this.OnFrame,this,0.5);
TimerUtil.ClearTimeout(this.UpdateId);
