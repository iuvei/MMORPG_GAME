/**
 * UILabel控件，按钮控件
 */

var MUILabel = ccui.Widget.extend({
    ptype: "",
    _isHit: true,
    _textAlgin: 0,
    uiHeight: 0,
    uiWidth: 0,
    _textArr: null,
    _htmlText: "",
    _htmlData: null,
    _color: null,
    _fontSize: 22,
    _fontName: null,
    _textAlign: 0,
    _multiline: false,
    _textWidth: 0,
    _textHeight: 20,
    _rowCount: 1,
    _outlineColor: null,
    _outlineSize: 1,
    _isEnableOutline: false,		//默认不描边
    _leading: 0,

    ctor: function () {
        this.ptype = EnumPanelType.LABEL;
        this._super();
        this._textArr = [];
        this._htmlData = [];
        this._fontName = GameFont.DEFAULT;
        this._color = new cc.Color(255, 255, 255);
        this._outlineColor = new cc.Color();
        this.setAnchorPoint(0, 0);
    },

    Init: function () {
        var json = this.jsonobj;
        //解析LABEL数据		这里要移到UIParseUtil.ParseLabel里去
        UIParseUtil.ParseLabel(this, json);
        this.AddChildren()
    },
    /**
     * 设置描边颜色 by zfs
     * @param color:0xff00ff
     * @param lineWidth:1
     * @constructor
     */
    EnableOutline: function (color, size, alpha) {
        color = color || 0x0;
        size = size || 1;
        alpha = alpha || (size >= 2 ? 120 : 255);
        var newColor = UIUtil.GetCCColor(color, alpha);
        if (!this._isEnableOutline || !cc.colorEqual(newColor, this._outlineColor) || this._outlineSize != size) {
            this._outlineColor = newColor;
            this._outlineSize = size;
            for (var i = 0; i < this._textArr.length; i++) {
                this._textArr[i].enableOutline(this._outlineColor, size);
            }
        }
        this._isEnableOutline = true;
    },

    DisableEffect: function () {
        for (var i = 0; i < this._textArr.length; i++) {
            this._textArr[i].disableEffect();
        }
    },

    SetString: function (text) {
        if (this._htmlText != text)
        {
            this._rowCount = 1;
        }
        text = String(text);	//这里转一下 免得比较的时候_htmlText会自动转换为int   	--merlin
        text = text.replace(/\r/g, "\n");
        var rowArr = text.split(/\n/);
        if(rowArr.length>1)
        {
            this._rowCount = rowArr.length;
            for(var i = 0; i<rowArr.length; i++)
            {
                if(rowArr[i] == "")
                {
                    this._rowCount--;
                }
            }
        }
        //text = text.replace(/\n/g, "<br>");     //label是多个render组成  不能直接\n换行  必须从最左开始排列
        if (this._htmlText != text) {
            this._htmlText = text;
            this._ParseText();
        }
    },

    SetText: function (text) {
        this.SetString(text);
    },
    SetHtmlText: function (htmlText) {
        this.SetString(htmlText);
    },
    GetText: function () {
        return this.jsonobj.text;
    },
    GetHtmlText: function () {
        return this.jsonobj.htmlText;
    },
    GetString: function () {
        return this._htmlText;
    },
    /**
     * 设置文本颜色
     * @param color:0xff00ff
     * @param alpha:255
     * @constructor
     */
    SetColor: function (color, alpha) {
        var newColor = UIUtil.GetCCColor(color, alpha);
        if (!cc.colorEqual(newColor, this._color)) {
            this._color = newColor;
            for (var i = 0; i < this._textArr.length; i++) {
                this._textArr[i].SetDefaultColor(this._color);
            }
        }
    },
    SetFontSize: function (size) {
        if (this._fontSize != size) {
            this._fontSize = size;
            for (var i = 0; i < this._textArr.length; i++) {
                this._textArr[i].SetFontSize(this._fontSize);
            }
            this._SortText();
        }
    },
    SetFontName: function (name) {
        if (this._fontName != name) {
            this._fontName = name;
            for (var i = 0; i < this._textArr.length; i++) {
                this._textArr[i].SetFontName(this._fontName);
            }
        }
    },

    SetIsHit: function (hit) {
        this._isHit = hit;
    },

    _ParseText: function () {
        var self = this;
        this._htmlData.length = 0;
        var data = this._htmlData;
        var colorArr = [];
        var color;
        var isUnderline = false;
        var isNewLine = false;
        var strArr;
        while (strArr = TextUtil.HTML_SPILT_PATTERN.exec(this._htmlText)) {
            strArr.forEach(function (str, i) {
                if (i > 0 && str) {		//html做好标记 文本则创建text
                    var first = str.charAt(0);	//这里标签少 随便写了 不用正则也可以
                    if (first == '<') {
                        var second = str.charAt(1);
                        switch (second) {
                            case 'u':
                            case 'U':
                                isUnderline = true;
                                break;
                            case 'f':
                            case 'F':
                                var hColor = str.match(/["']#(.+?)["']/);
                                if (hColor)
                                    color = UIUtil.GetCCColor(parseInt(hColor[1], 16));
                                else
                                    color = self._color;
                                colorArr.push(color);
                                break;
                            case 'b':
                            case 'B':
                                if (str.charAt(2) == 'r' || str.charAt(2) == 'R')
                                    isNewLine = true;
                                break;
                            case '/':
                                var third = str.charAt(2);
                                switch (third) {
                                    case 'u':
                                    case 'U':
                                        isUnderline = false;
                                        break;
                                    case 'f':
                                    case 'F':
                                        colorArr.pop();
                                        color = colorArr.length > 0 ? colorArr[colorArr.length - 1] : null;
                                        break;
                                }
                                break;
                        }
                        return;	//forEach里return只是continue的作用而已
                    }
                    data.push({str: str, color: color, underline: isUnderline, newline:isNewLine});
                    isNewLine = false;
                }
            });
        }
        if (this._htmlData.length == 0) {
            this._htmlData.push({str: this._htmlText, underline: isUnderline, newline:isNewLine});
        }
        this._RenderText();
    },

    _RenderText: function () {	//等于是自己实现了个richtext -- merlin
        this.ClearText();
        var size = this._fontSize;
        var font = this._fontName;
        var leftW = this.uiWidth;
        var self = this;
        var data = this._htmlData;
        var costWidth = 0;
        var textData = {str:"",dArr:[],underline:false,newline:false};
        for (var i = 0; i < data.length; i++)
        {
            var regexp = "{@}";
            if(data[i].str.match(regexp))
            {
                continue;
            }
            textData.str+=data[i].str;
            var obj = {idx:0,color:""};
            obj.idx = textData.str.length;
            obj.color = data[i].color;
            textData.dArr.push(obj);
        }
        var render = LabelRender.Create();
        render.SetDefaultColor(this._color);
        render.SetFontSize(size);
        render.rownum = 1;
        render.SetTextData(textData);
        //render.SetUnderLine(isUnderline);
        self._textArr.push(render);
        self.addChild(render);
        this._SetWidth();

        var str = textData.str;
        if (this._multiline)
        {
            var count = 0;
            var gap = 1;
            var arr = str.split("");
            if (render.GetWidth() + costWidth > leftW)
            {
                for(var i = 0; i<arr.length;i++)
                {
                    count += TextUtil.GetCharactersByString(arr[i])*TextUtil.zijieWidthNum;
                    if(count>=leftW)
                    {
                        arr.splice(i-gap,0,"\n");
                        count = 0;
                        gap++;
                    }
                }
            }
            render.rownum = gap;
            this._rowCount = gap;
            this._textHeight *= gap;
            arr = arr.join("");
            textData.str = arr;
            render.SetTextData(textData);
        }
        else
        {
            this._textHeight *= this._rowCount;
        }
        this._SortText();
    },

    /**
     * 每种情况都考虑有点复杂 先支持常用的 多行全按左对齐来处理
     * @private
     */
    _SortText: function () {
        var startY = this.uiHeight ? this.uiHeight : this._textHeight;
        var row = 1;
        for (var i = 0; i < this._textArr.length; i++)
        {
            var render = this._textArr[i];
            var startX = 0;
            var w = this.uiWidth ? this.uiWidth : 0;
            if (this._textAlgin == 1)
            {
                startX = ( w - this._textWidth ) * 0.5;
            }
            else if (this._textAlgin == 2)
            {
                startX = w - this._textWidth;
            }
            render.x = startX;
            render.y = ( this._textHeight);
            if (row != render.rownum && this._textHeight>this.uiHeight) {
                startY = this._textHeight + this._leading;
            }
            render.y = startY;
        }
    },

    ClearText: function () {
        this._textArr.forEach(function (render) {
            LabelRender.Delete(render);
            if (render.parent)
                render.parent.removeChild(render);
        });
        this._textArr.length = 0;
        this._textWidth = 0;
        this._textHeight = 30;
    },

    SetTextAlign: function (align) {
        if (this._textAlgin != align) {
            this._textAlgin = align;
            this._SortText();
        }
    },

    SetMultiline: function (value) {
        if (this._multiline != value) {
            this._multiline = value;
            this._RenderText();
        }
    },
    _SetWidth:function()
    {
        for(var i = 0;i<this._textArr.length;i++)
        {
            this._textWidth = this._textArr[i].width;
        }
    },
    GetWidth: function () {
        return this._textWidth;
    },

    GetHeight: function () {
        return this._textHeight;
        if (this.uiHeight)
            return this.uiHeight;
        return ( this._rowCount - 1 ) * ( this._textHeight + this._leading ) + this._textHeight;
    },

    SetUISize: function (w, h) {
        if (this.uiWidth != w || ( h && this.uiHeight != h )) {
            this.uiWidth = w;
            if (h)
                this.uiHeight = h;
            this._SortText();
        }
    },

    SetLeading: function (value) {
        if (this._leading != value) {
            this._leading = value;
            this._SortText();
        }
    },
    GetRows: function () {
        return this._rowCount;
    },
    GetFontSize: function () {
        return this._fontSize;
    }
});