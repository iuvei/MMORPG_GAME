/**
 * Created by merlin on 2016/8/8.
 */
var LabelRender = ccui.Text.extend( {
    _underline:null,
    _color:null,
    lineNum:0,
    _fontName:null,
    _size:0,
    data:null,
    _vertualRenderer:null,
    ctor:function(){
        this._super();
        this.setAnchorPoint( 0, 1 );
        this.ignoreContentAdaptWithSize( true );
        this.SetFontName( GameFont.DEFAULT );
        this._vertualRenderer = this.getVirtualRenderer();//this._vertualRenderer.getLetter(1); return sprite
        this.SetFontSize(22);
    },

    SetFontName:function(name){
        if( this._fontName != name ){
            this._fontName = name;
            this.setFontName( name );
        }
    },

    SetFontSize:function(size){
        if( this._size != size ){
            this._size = size;
            this.setFontSize( size );
        }
    },

    SetText:function( text ){
        this.setString( text );
    },
    //{str:"",dArr:[{idx:0,color:""}],underline:false,newline:false}
    SetTextData:function(textData)
    {
        this.data = textData;
        this.SetText(textData.str);
        var arr = textData.dArr
        for(var i = 0; i<arr.length;i++)
        {
            var count = i>0 ? arr[i-1].idx : 0;
            for(var j = count;j<arr[i].idx;j++)
            {
                var tempTxt = this._vertualRenderer.getLetter(j);
                if(tempTxt)
                {
                    var color = arr[i].color ? new cc.Color(arr[i].color.r, arr[i].color.g, arr[i].color.b) : new cc.Color(255, 255, 255);
                    tempTxt.setColor(color);
                }
            }
        }
    },
    SetUnderLine:function(value){
        var line = this._underline;
        if( value ){
            if( line ){
                line.clear();
            }
            else {
                line = new cc.DrawNode();
                this.addChild(line);
                this._underline = line;
            }
            var color = this._color || this.getTextColor();
            if( color )
                line.drawSegment(cc.p(3,0), cc.p(this.getBoundingBox().width - 1, 0), 0.5, color);
        }
        else{
            if( line )
                this.removeChild( line );
            this._underline = null;
        }
    },

    SetColor:function(color){
        this._color = color;
        if( color ){
            this.setTextColor(color);
            if( this._underline ){
                this._underline.clear();
                var color = this.getTextColor();
                this._underline.drawSegment(cc.p(3,0), cc.p(this.getBoundingBox().width - 1, 0), 0.5, color);
            }
        }
    },

    SetDefaultColor:function(color){
        if( !this._color )
        {
            this.setTextColor( color );
            if( this._underline ){
                this._underline.clear();
                this._underline.drawSegment(cc.p(3,0), cc.p(this.getBoundingBox().width - 1, 0), 1, color);
            }
        }
    },
    //给特定文本添加触摸事件 this._vertualRenderer.getLetter(j)返回对象类型为Sprite
    GetListener:function()
    {
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function (touch, event)
            {
                var target = event.getCurrentTarget();
                var pos = touch.getLocation();
                pos = target.convertToNodeSpace(pos);
                var rect = cc.rect(0,0,target.width,target.height);
                if(cc.rectContainsPoint(rect, pos))
                {
                   //TODO
                }
                return true;
            }
        });
        return listener
    },
    GetWidth:function(){
        return this.getContentSize().width;
    },

    GetHeight:function(){
        return this.getContentSize().height;
    },

    OnRecycle:function(){
    },
    OnRevert:function(){
    },
    Dispose:function () {
        this.release();
    },
} );
LabelRender.oPool = new MCachePool();
LabelRender.oPool.SetSize( 5000 );
LabelRender.Create = function(){
    var o = LabelRender.oPool.Gain();
    if( !o ){
        o = new LabelRender();
        o.retain();
    }
    return o;
};
LabelRender.Delete = function(o){
    if( o ){
        o.disableEffect();
        LabelRender.oPool.Recycle(o);
    }
};


























