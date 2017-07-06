/**
 * Created by zj on 2015/10/26 0026.
 * �����˾�
 * ��̬��
 */
var Filter = Filter || {
        GetBlurTextureCoordOffset:function(texW, texH, step){
            if (step == undefined) step = 1.0;
            var xInc = step / texW;
            var yInc = step / texH;

            var texCoordOffsets = [];
            for (var i = 0; i < 5; i++){
                for (var j = 0; j < 5; j++){
                    texCoordOffsets[(((i*5)+j)*2)+0] = (-2.0 * xInc) + (i * xInc);
                    texCoordOffsets[(((i*5)+j)*2)+1] = (-2.0 * yInc) + (j * yInc);
                }
            }
            return texCoordOffsets;
        },

        /**
         * 这里有点恶心 不能直接在容器上加 得遍历 后面优化的时候需要把每个子控件的原始状态保存下来 UnGray的时候恢复
         * @param sprite
         * @constructor
         */
        UnGray:function( sprite ){
            if (sprite != undefined){
                if( sprite instanceof ccui.Widget ){
                	if( sprite instanceof ccui.ImageView ){
                		sprite.getVirtualRenderer().setState( 0 );
                	}
                	else{
                		sprite.setBright( true );
                	}
                }
                else if( sprite instanceof  cc.Sprite ){
                    if ( EngineCost.engieType == EngineCost.TYPE_WEB )
                        sprite._renderCmd._shaderProgram = null;
                    else {
                        var program = cc.shaderCache.getProgram("Normal");
                        if(!program){
                            var pp=new cc.Sprite();
                            program=pp.shaderProgram;
                            cc.shaderCache.addProgram(program, "Normal");
                        }
                        sprite.shaderProgram = program;
                    }
                }
                if( sprite.children ){
                    for(var i = 0; i < sprite.children.length; i++ ){
                        Filter.UnGray( sprite.children[i] );
                    }
                }
            }
        },
        /**
         * 这里有点恶心 不能直接在容器上设置shader 得遍历 后面优化的时候需要把每个子控件的原始状态保存下来 UnGray的时候恢复
         * (或是使用RenderTexture 再gray render
         * render.setAnchorPoint(0,0);
         * render.getSprite().setAnchorPoint(0,0);
         * render.x = -113;     坐标需要为-113才能重叠)   --merlin
         * @param sprite
         */
        GrayScale: function (sprite) {
            var program = this.GetGrayScaleProgram();


            if (sprite != undefined){
                if( sprite instanceof ccui.Widget ){
                    if( sprite instanceof ccui.Layout ){
                        // var bg = sprite.getProtectedChildByTag(-1);
                        // bg.setState(1);
                    }
                    else if( sprite instanceof ccui.ImageView ){
                        sprite.getVirtualRenderer().setState( 1 );
                    }
                    else{
                        sprite.setBright( false );
                        if( sprite instanceof ccui.Button )
                        	sprite.getVirtualRenderer().setState( 1 );      //当时为了加按钮缩放设置了disabledRender 这里需要把disabledRender变灰
                    }
                }
                else if( sprite instanceof  cc.Sprite ){
                    if ( EngineCost.engieType == EngineCost.TYPE_WEB )
                         sprite._renderCmd._shaderProgram = program;
                    else {
                            // gl.useProgram( program.getProgram() );
                        sprite.shaderProgram = program;
                    }
                }
//                else if( sprite.getVirtualRenderer() ){
//                    sprite.getVirtualRenderer().shaderProgram = program;
//                }
                if( sprite.children ){
                    for(var i = 0; i < sprite.children.length; i++ ){
                        Filter.GrayScale( sprite.children[i] );
                    }
                }
            }
        },
        GetGrayScaleProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_GrayScale");
            if(!program){
                program = new cc.GLProgram();
                if ( EngineCost.engieType == EngineCost.TYPE_WEB )
                    program.initWithVertexShaderByteArray(FilterCode.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.GRAY_SCALE_FRAGMENT_SHADER);
                else
                    program.initWithString(FilterCode.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.GRAY_SCALE_FRAGMENT_SHADER);
                program.retain();
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_GrayScale");
            }
            return program;
        },

        /**
         * ���
         * @param sprite
         * @param degree �ɵĳ̶� 0~1
         */
        Specia: function (sprite, degree) {
            var program = this.GetSpeciaProgram();
            if (sprite != undefined){
                var degreeLocation = program.getUniformLocationForName("u_degree");
                program.use();
                program.setUniformLocationF32(degreeLocation, degree);
                sprite._renderCmd._shaderProgram = program;
            }
        },
        GetSpeciaProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_Specia");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.SEPIA_FRAGMENT_SHADER);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_Specia");
            }
            return program;
        },

        /**
         * ����
         * @param sprite
         */
        Negative: function (sprite) {
            var program = this.GetNegativeProgram();
            if (sprite != undefined){
                sprite._renderCmd._shaderProgram = program;
            }
        },
        GetNegativeProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_Negative");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.NEGATIVE);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_Negative");
            }
            return program;
        },

        /**
         * ��
         * @param sprite
         * @param texCoordsOffset
         */
        Sharpen: function (sprite, texCoordsOffset) {
            var program = this.GetSharpenProgram();
            if (sprite != undefined){
                var loc = program.getUniformLocationForName("u_TextureCoordOffset");
                program.use();
                program.setUniformLocationWith2fv(loc, texCoordsOffset);
                sprite._renderCmd._shaderProgram = program;
            }
        },
        GetSharpenProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_Sharpen");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.SHARPEN);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_Sharpen");
            }
            return program;
        },

        /**
         * ����
         * @param sprite
         * @param texCoordsOffset
         */
        Dilate: function (sprite, texCoordsOffset) {
            var program = this.GetDilateProgram();
            if (sprite != undefined){
                var loc = program.getUniformLocationForName("u_TextureCoordOffset");
                program.use();
                program.setUniformLocationWith2fv(loc, texCoordsOffset);
                sprite._renderCmd._shaderProgram = program;
            }
        },
        GetDilateProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_Dilate");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.DILATE);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_Dilate");
            }
            return program;
        },

        /**
         * ��ʴ
         * @param sprite
         * @param texCoordsOffset
         */
        Erode: function (sprite, texCoordsOffset) {
            var program = this.GetErodeProgram();
            if (sprite != undefined){
                var loc = program.getUniformLocationForName("u_TextureCoordOffset");
                program.use();
                program.setUniformLocationWith2fv(loc, texCoordsOffset);
                sprite._renderCmd._shaderProgram = program;
            }
        },
        GetErodeProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_Erode");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.ERODE);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_Erode");
            }
            return program;
        },

        /**
         * ��ߣ�ֻ������Χ��alpha��ͼƬ��
         * @param sprite
         * @param size ��߳ߴ�
         * @param r,g,b ��ɫ��0-255��
         */
        StrokeAlpha: function (sprite, w, h, r,g,b, outlineSize) {
            if (w == undefined || h == undefined) return;
            if(outlineSize == undefined) outlineSize = 1;
            if (r == undefined) r = 255;
            if (g == undefined) g = 255;
            if (b == undefined) b = 255;

            var program = this.GetStrokeAlpha();
            if (sprite != undefined){
                program.use();
                var loc = program.getUniformLocationForName("outlineSize");
                program.setUniformLocationWith1f(loc, outlineSize);
                loc = program.getUniformLocationForName("outlineColor");
                program.setUniformLocationWith3f(loc, r/255, g/255, b/255);
                loc = program.getUniformLocationForName("textureSize");
                program.setUniformLocationWith2f(loc, w, h);
                loc = program.getUniformLocationForName("foregroundColor");
                program.setUniformLocationWith3f(loc, 1, 1, 1);
                gl.useProgram(program.getProgram());
                sprite._renderCmd._shaderProgram = program;
            }
        },
        GetStrokeAlpha:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_StrokeAlpha");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.SEPIA_FRAGMENT_SHADER);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_StrokeAlpha");
            }
            return program;
        },

        /**
         * ��ɫ��ȡ
         * @param sprite
         * @param bloomThreshold ���Ͷ� [0~1)
         */
        LightExtraction: function (sprite, bloomThreshold) {
            var program = this.GetLightExtractionProgram();
            if (sprite != undefined){
                var loc = program.getUniformLocationForName("u_bloomThreshold");
                program.use();
                program.setUniformLocationF32(loc, bloomThreshold);
                sprite._renderCmd._shaderProgram = program;
            }
        },
        GetLightExtractionProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_Light_Extraction");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.LIGHT_EXTRACTION);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_Light_Extraction");
            }
            return program;
        },

        /**
         * �����ض��������ԭʼ������ͼ����˹ģ��������ɫ����ͼ����������Ч��
         * @param sprite
         * @param withTex  Ҫ��ϵ�Ŀ������
         * @param bloomIty Ŀ����Ҷ� (0,1,1,1, 1) ���ߣ�0.25,  1.25,  1,    1,       1��
         * @param bloomSat Ŀ�걥�Ͷ�
         * @param baseIty  ԭͼ���Ҷ�
         * @param baseSat  ԭͼ���Ͷ�
         */
        //BloomBlendTexture: function (sprite, withTex, bloomIty, bloomSat, baseIty, baseSat) {
        //    var program = this.GetBloomBlendTexture();
        //    if (sprite != undefined){
        //        var loc = program.getUniformLocationForName("u_bloomThreshold");
        //        program.use();
        //        program.setUniformLocationF32(loc, bloomThreshold);
        //        sprite._renderCmd._shaderProgram = program;
        //    }
        //},
        GetBloomBlendTextureProgram:function() {
            var program = cc.shaderCache.getProgram("Custom_Filter_BloomBlendTexture");
            if (!program) {
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.BLOOM_BLEND_TEXTURES);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_BloomBlendTexture");
            }
            return program;
        },

        /**
         * ��ģ��
         * @param sprite
         * @param coordOffset ��������ƫ�ƣ�����GetBlurTextureCoordOffset���㣩
         */
        MedianBlur: function (sprite, coordOffset) {
            var program = this.GetMedianBlurProgram();
            if (sprite != undefined) {
                var loc = program.getUniformLocationForName("u_TextureCoordOffset");
                program.use();
                program.setUniformLocationWith2fv(loc, coordOffset);
                if (EngineCost.engieType == EngineCost.TYPE_WEB)
                    sprite._renderCmd._shaderProgram = program;
                else
                    sprite.shaderProgram = program;
            }
        },
        GetMedianBlurProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_MedianBlur");
            if(!program){
                program = new cc.GLProgram();
                if ( EngineCost.engieType == EngineCost.TYPE_WEB )
                    program.initWithVertexShaderByteArray(FilterCode.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.MEDIAN_BLUR);
                else
                    program.initWithString(FilterCode.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.MEDIAN_BLUR);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_MedianBlur");
            }
            return program;
        },

        /**
         * ��˹ģ��
         * @param sprite
         * @param coordOffset ��������ƫ�ƣ�����GetBlurTextureCoordOffset���㣩
         */
        GaussianBlur: function (sprite, coordOffset) {
            var program = this.GetGaussianBlurProgram();
            if (sprite != undefined){
                // var loc = program.getUniformLocationForName("u_TextureCoordOffset");
                program.use();
                // gl.uniform2f(loc, 100000, 100000);
                if (EngineCost.engieType == EngineCost.TYPE_WEB)
                    sprite._renderCmd._shaderProgram = program;
                else
                    sprite.shaderProgram = program;
            }
        },
        GetGaussianBlurProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_GaussianBlur");
            if(!program){
                program = new cc.GLProgram();
                if ( EngineCost.engieType == EngineCost.TYPE_WEB )
                    program.initWithVertexShaderByteArray(FilterCode.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.GAUSSIAN_BLUR);
                else
                    program.initWithString(FilterCode.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.GAUSSIAN_BLUR);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_GaussianBlur");
            }
            return program;
        },

        /**
         * ȫ��ˮ��
         */
        GetWaveFullProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_WaveFull");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.WAVE_FULL);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_WaveFull");
            }
            return program;
        },

        /**
         * ԭͼ��˸
         */
        GetGlowFilterProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_GlowFilter");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.GLOWFILTER);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_GlowFilter");
            }
            return program;
        },

        /**
         * ���Դ��۹��Ч��
         */
        GetPointLightProgram:function(){
            var program = cc.shaderCache.getProgram("Custom_Filter_PointLight");
            if(!program){
                program = new cc.GLProgram();
                program.initWithVertexShaderByteArray(cc.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.POINTLIGHT);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_PointLight");
            }
            return program;
        },

        WinterBlur:function (sprite) {
            var program = cc.shaderCache.getProgram("Custom_Filter_WinterBlur");
            if(!program) {
                program = new cc.GLProgram();
                program.initWithString(FilterCode.SHADER_POSITION_TEXTURE_COLOR_VERT, FilterCode.BURL);
                program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
                program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
                program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
                program.link();
                program.updateUniforms();
                cc.shaderCache.addProgram(program, "Custom_Filter_WinterBlur");
            }
            var glProgramState = cc.GLProgramState.getOrCreateWithGLProgram(program);
            sprite.setGLProgramState(glProgramState);
            sprite.shaderProgram = program;
            var size=sprite.getTexture().getContentSizeInPixels();
            glProgramState.setUniformVec2("resolution", cc.p(size.width,size.height));
            glProgramState.setUniformFloat("blurRadius",0);
            glProgramState.setUniformFloat("sampleNum", 7);
        },
};