/**
 * Created by zj on 2015/10/29 0029.
 */

var FilterCode = FilterCode ||{
        MIAOBIAN_HASALPHA:// ���
        "varying vec4 v_fragmentColor;\n"
        +"varying vec2 v_texCoord;\n"
        +"uniform float outlineSize;\n"    // ��߿�ȣ�������Ϊ��λ
        +"uniform vec3 outlineColor;\n"    // �����ɫ
        +"uniform vec2 textureSize;\n" // �����С����͸ߣ���Ϊ�˼�����Χ������������꣬���봫��������Ϊ�������귶Χ��0~1
        +"uniform vec3 foregroundColor;\n"  // ��Ҫ�������壬�ɴ��ɲ���������Ĭ��Ϊ��ɫ
        +"int getIsStrokeWithAngel(float angel)\n" //�ж�������Ƕ��Ͼ���ΪoutlineSize��һ���ǲ���͸��
        +"{ \n"
        +"      int stroke = 0;\n"
        +"      float rad = angel * 0.01745329252;\n"  // ����������� pi / 180���Ƕ�ת����

            // ���Ƚ��Ѷ���outlineSize * cos(rad)�������Ϊ��x����ͶӰ������textureSize.x����Ϊtexture2D���յ���һ��0~1���������꣬�������������� \n\
        +"      float a = texture2D(CC_Texture0, vec2(v_texCoord.x + outlineSize * cos(rad) / textureSize.x, v_texCoord.y + outlineSize * sin(rad) / textureSize.y)).a;\n"
        +"      if (a >= 0.5)\n" // �Ұ�alphaֵ����0.5����Ϊ��͸����С��0.5����Ϊ͸��
        +"      { \n"
        +"          stroke = 1;\n"
        +"      } \n"
        +"      return stroke; \n"
        +"} \n"
        +"void main()\n"
        +"{ \n"
        +"    vec4 myC = texture2D(CC_Texture0, vec2(v_texCoord.x, v_texCoord.y));  \n"// ���ڴ����������ص����ɫ
        +"    myC.rgb *= foregroundColor;\n"
        +"    if (myC.a >= 0.5) \n"// ��͸�������ܣ�ֱ�ӷ���
        +"    { \n"
        +"        gl_FragColor = v_fragmentColor * myC;\n"
        +"         return;\n"
        +"    } \n"
        +"    int strokeCount = 0; \n"
        +"    strokeCount += getIsStrokeWithAngel(0.0);\n"
        +"    strokeCount += getIsStrokeWithAngel(30.0); \n"
        +"    strokeCount += getIsStrokeWithAngel(60.0); \n"
        +"    strokeCount += getIsStrokeWithAngel(90.0);\n"
        +"    strokeCount += getIsStrokeWithAngel(120.0);\n"
        +"    strokeCount += getIsStrokeWithAngel(150.0);\n"
        +"    strokeCount += getIsStrokeWithAngel(180.0); \n"
        +"    strokeCount += getIsStrokeWithAngel(210.0);\n"
        +"    strokeCount += getIsStrokeWithAngel(240.0);\n"
        +"    strokeCount += getIsStrokeWithAngel(270.0); \n"
        +"    strokeCount += getIsStrokeWithAngel(300.0); \n"
        +"    strokeCount += getIsStrokeWithAngel(330.0); \n"
        +"    if (strokeCount > 0)\n"// ����Χ������һ�����ǲ�͸���ģ������Ҫ��������ɫ
        +"    { \n"
        +"        myC.rgb = outlineColor; myC.a = 1.0; \n"
        +"    } \n"
        +"    gl_FragColor = v_fragmentColor * myC; \n"
        +"}",

        LIGHT_EXTRACTION:// ��ȡԭͼ��ɫ
        "precision lowp float;\n"
        +"varying vec4 v_fragmentColor;\n"
        +"varying vec2 v_texCoord;\n"
        +"uniform float u_bloomThreshold; // ���Ͷȣ�[0-1)��\n"
        +"void main()\n"
        +"{\n"
        +"    vec4 color = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);\n"
        +"    gl_FragColor = clamp((color - u_bloomThreshold) / (1.0 - u_bloomThreshold), 0.0, 1.0);\n"
        +"}",
        BLOOM_BLEND_TEXTURES:// �����ض��������ԭʼ������ͼ����˹ģ��������ɫ����ͼ����������Ч��
        "uniform sampler2D CC_BlurTex;\n"       // ģ���������������
        +"uniform float u_BloomIntensity;\n"    // ģ�����Ҷ�
        +"uniform float u_BloomSaturation;\n"   // ģ�����Ͷ�
        +"uniform float u_BaseIntensity;\n"     // ԭʼ���Ҷ�
        +"uniform float u_BaseSaturation;\n"    // ԭʼ���Ͷ�
        +"varying vec2 v_texCoord;\n"
        +"vec4 adjustSaturation(vec4 color, float saturation)\n"// ������ɫ�ı��Ͷ�
        +"{\n"
        +"    float grey = dot(color, vec4(0.3, 0.59, 0.11, 1));\n"// ���۸�ϲ���̹⣬���ѡȡ0.3, 0.59, 0.11����ֵ
        +"    return grey + saturation * (color - grey);\n"
        +"}\n"
        +"void main()\n"
        +"{\n"
        +"    vec4 bloom = texture2D(CC_BlurTex, v_texCoord);\n"// ��ȡԭʼ������ͼ��ģ��������ͼ��������ɫ
        +"   vec4 base = texture2D(CC_Texture0, v_texCoord);\n"
        +"    bloom = adjustSaturation(bloom, u_BloomSaturation) * u_BloomIntensity;\n"// �ữԭ��������ɫ
        +"    base = adjustSaturation(base, u_BaseSaturation) * u_BaseIntensity;\n"

        +"   base *= (vec4(1.0, 1.0, 1.0, 1.0) - clamp(bloom, 0.0, 1.0));\n"// ���ģ������ֵ΢��ԭʼ����ֵ
            // ����ԭʼ������ͼ��ģ��������ͼ������ԭ�����ػ����ϵ���ģ��������أ�ʵ�ַ���Ч��
        +"    gl_FragColor = base + bloom;\n"
        +"}",

        MEDIAN_BLUR:// ��ģ��
        "varying vec2 v_texCoord;\n"
        +"uniform vec2 u_TextureCoordOffset[25];\n"
        +"void main() \n"
        +"{\n"
        +"  gl_FragColor = vec4(0.0)\n"
        +"  for (int i = 0; i < 25; i++)\n"
        +"  {\n"
            // Sample a grid around and including our texel
        +"      gl_FragColor += texture(CC_Texture0, v_texCoord + u_TextureCoordOffset[i]);\n"
        +"  }\n"
        +"  gl_FragColor /= 25;\n"
        +"}",

        GAUSSIAN_BLUR:// ��˹ģ��
        "precision mediump float;\n"
        +"varying vec2 v_texCoord;\n"
        // +"varying vec4 v_fragmentColor;\n"
        +"void main(void)\n"
        +"{\n"
        +"   vec4 col = vec4(0);\n"
            //先全部写死好了
        // +"   int r = 3;\n"
        // +"   for (int i = -r; i <= r; i++)\n"
        // +"   {\n"
        // +"      for (int j = -r; j <= r; j++)\n"
        // +"      {\n"
        // +"              float weight = (r-abs(i))*(r-abs(j));\n"
        // +"              col += weight * texture2D(CC_Texture0, v_texCoord + vec2( i * 0.00075,j * 0.00133));\n"
        // +"              count += weight; \n"
        // +"      }\n"
        // +"   }\n"
        +"      col += 1.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 5.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 1.0 * texture2D(CC_Texture0, v_texCoord + vec2( -4.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 10.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( -3.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 9.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 15.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 9.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( -2.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 16.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 20.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 16.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( -1.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 5.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 10.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 15.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 20.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 20.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 20.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 15.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 10.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 5.0 * texture2D(CC_Texture0, v_texCoord + vec2( 0.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 16.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 20.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 16.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( 1.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 9.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 15.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 12.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 9.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( 2.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 10.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 8.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 6.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( 3.0 * 0.00075,4.0 * 0.00133));\n"
        +"      col += 1.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,-4.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,-3.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,-2.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,-1.0 * 0.00133));\n"
        +"      col += 5.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,0.0 * 0.00133));\n"
        +"      col += 4.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,1.0 * 0.00133));\n"
        +"      col += 3.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,2.0 * 0.00133));\n"
        +"      col += 2.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,3.0 * 0.00133));\n"
        +"      col += 1.0 * texture2D(CC_Texture0, v_texCoord + vec2( 4.0 * 0.00075,4.0 * 0.00133));\n"

        +"   //--------------------------------------------------------		\n"
        +"   //   1 3 1														\n"
        +"   //   3 1 3   / 11												\n"
        +"   //   1 3 1														\n"
        +"                                                                     \n"
        +"   //gl_FragColor = (sample[0] + (3.0*sample[1]) + sample[2] + 	    \n"
        +"   //	(3.0*sample[3]) + sample[4] + (3.0*sample[5]) + 			\n"
        +"   //	sample[6] + (3.0*sample[7]) + sample[8]) / 11.0;			\n"
        +"   //--------------------------------------------------------		\n"
        +"   // Gaussian weighting:											\n"
        +"   // 1  4  7  4 1													\n"
        +"   // 4 16 26 16 4													\n"
        +"   // 7 26 41 26 7 / 273 (i.e. divide by total of weightings)		\n"
        +"   // 4 16 26 16 4													\n"
        +"   // 1  4  7  4 1													\n"
        +"   gl_FragColor = col/625.0;//(												    \n"
        +"//       (0.01  * (sample[0] + sample[4]  + sample[20] + sample[24])) +	\n"
        +"//       (0.015  * (sample[1] + sample[3]  + sample[5]  + sample[9] + 		\n"
        +"//           sample[15] + sample[19] + sample[21] + sample[23])) +		\n"
        +"//       (0.02  * (sample[2] + sample[10] + sample[14] + sample[22])) +	\n"
        +"//       (0.06 * (sample[6] + sample[8]  + sample[16] + sample[18])) +	\n"
        +"//       (0.10 * (sample[7] + sample[11] + sample[13] + sample[17])) +	\n"
        +"//       (0.12 * sample[12])												\n"
        +"   //    ) ;														\n"
        +"}",

        WAVE_FULL:// ȫ��ˮ��
        "varying vec4 v_fragmentColor;\n"
        +"varying vec2 v_texCoord;\n"
        +"precision highp float; \n"
        +"uniform float time;\n"
        +"uniform vec2 resolution; \n"
        +"const float PI = 3.1415926535897932;\n"
        +"const float speed = 0.2; \n"// �ٶ�
        +"const float speed_x = 0.3;\n"
        +"const float speed_y = 0.3;\n"
        +"const float emboss = 0.3;\n"// ��͹ǿ��
        +"const float intensity = 0.6;\n"// ǿ��
        +"const int steps = 18;\n"// �����ܶ�
        +"const float frequency = 5.0;\n"// Ƶ��
        +"const int angle = 7;\n"// ���������
        +"const float delta = 100.0;\n"// ������ԽСԽ���ң�
        +"const float intence = 200.0;\n"// ����ǿ��
        +"const float reflectionCutOff = 0.012;\n"// �߹�
        +"const float reflectionIntence = 80000.;\n"
        +"float col(vec2 coord)\n"
        +"{\n"
        +"      float delta_theta = 2.0 * PI / float(angle);\n"
        +"      float col = 0.0;\n"
        +"      float theta = 0.0; \n"
        +"      for (int i = 0; i < steps; i++)  							\n"
        +"      {															\n"
        +"          vec2 adjc = coord;										\n"
        +"          theta = delta_theta * float(i);							\n"
        +"          adjc.x += cos(theta)*time*speed + time * speed_x;  		\n"
        +"          adjc.y -= sin(theta)*time*speed - time * speed_y;		\n"
        +"          col = col + cos((adjc.x * cos(theta) - 					\n"
        +"          adjc.y * sin(theta)) * frequency) * intensity;          \n"
        +"      }\n"
        +"      return cos(col);\n"
        +"}\n"
        +"void main(void)  												\n"
        +"{  															\n"
        +"      vec2 p = vec2(v_texCoord.xy), c1 = p, c2 = p;              \n"
        +"      float cc1 = col(c1); \n"
        +"\n"
        +"      c2.x += resolution.x/delta;  								\n"
        +"      float dx = emboss*(cc1-col(c2))/delta;  					\n"
        +"\n"
        +"      c2.x = p.x;  												\n"
        +"      c2.y += resolution.y/delta;  								\n"
        +"      float dy = emboss*(cc1-col(c2))/delta;  					\n"
        +"\n"
        +"      c1.x += dx;												\n"
        +"      c1.y = -(c1.y+dy);											\n"
        +"      c1.y = - c1.y;												\n"
        +"      float alpha = 1.+dot(dx,dy)*intence;  						\n"
        +"      float ddx = dx - reflectionCutOff;							\n"
        +"      float ddy = dy - reflectionCutOff;							\n"
        +"      if (ddx > 0. && ddy > 0.)									\n"
        +"          alpha = pow(alpha, ddx*ddy*reflectionIntence);			\n"
        +"      c1.x = clamp(c1.x, 0.0, 0.95);\n"
        +"      c1.y = clamp(c1.y, 0.0, 0.95);\n"
        +"      vec4 col = texture2D(CC_Texture0,c1);						\n"
        +"      gl_FragColor =  vec4(col.rgb, 1.0);										\n"
        +"}",
        GRAY_SCALE_FRAGMENT_SHADER:// �û�
        "varying vec2 v_texCoord;   \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        + "    float gray = texColor.r * 0.299 + texColor.g * 0.587 + texColor.b * 0.114; \n"
        + "    gl_FragColor = vec4(gray, gray, gray, texColor.a);  \n"
        + "}",
        SEPIA_FRAGMENT_SHADER:// ���
        "varying vec2 v_texCoord;   \n"
        + "uniform float u_degree; \n"
        + "void main() \n"
        + "{  \n"
        + "    vec4 texColor = texture2D(CC_Texture0, v_texCoord);  \n"
        + "    float r = texColor.r * 0.393 + texColor.g * 0.769 + texColor.b * 0.189; \n"
        + "    float g = texColor.r * 0.349 + texColor.g * 0.686 + texColor.b * 0.168; \n"
        + "    float b = texColor.r * 0.272 + texColor.g * 0.534 + texColor.b * 0.131; \n"
        + "    gl_FragColor = mix(texColor, vec4(r, g, b, texColor.a), u_degree);  \n"
        + "}",
        NEGATIVE:// ����
        "varying vec2 v_texCoord;   \n"
        +"void main() \n"
        +"{\n"
        +"    vec4 texColor = texture2D(CC_Texture0, v_texCoord);\n"
        +"    gl_FragColor = vec4(1.0 - texColor.rgb, 1.0);\n"
        +"}",

        SHARPEN:// ��
        "varying vec2 v_texCoord;\n"
        +"uniform vec2 u_TextureCoordOffset[25];\n"
        +"vec4 sample[25];\n"
        +"void main() \n"
        +"{\n"
        +"      for (int i = 0; i < 25; i++)\n"
        +"      {\n"
            // Sample a grid around and including our texel
        +"          sample[i] = texture(CC_Texture0, v_texCoord + u_TextureCoordOffset[i]);\n"
        +"      }\n"
            // Sharpen weighting:
            // -1 -1 -1 -1 -1
            // -1 -1 -1 -1 -1
            // -1 -1 25 -1 -1
            // -1 -1 -1 -1 -1
            // -1 -1 -1 -1 -1
        +"      gl_FragColor = 25.0 * sample[12];\n"
        +"      for (int i = 0; i < 25; i++)\n"
        +"      {\n"
        +"          if (i != 12)\n"
        +"              gl_FragColor -= sample[i];\n"
        +"       }"
        +"}",

        DILATE://����
        "varying vec2 v_texCoord;\n"
        +"uniform vec2 u_TextureCoordOffset[25];\n"
        +"vec4 sample[25];\n"
        +"vec4 maxValue = vec4(0.0);\n"
        +"void main() \n"
        +"{\n"
        +"      for (int i = 0; i < 25; i++)\n"
        +"      {\n"
            // Sample a grid around and including our texel
        +"          sample[i] = texture(CC_Texture0, v_texCoord + u_TextureCoordOffset[i]);\n"
            // Keep the maximum value
        +"          maxValue = max(sample[i], maxValue);\n"
        +"       }\n"
        +"      gl_FragColor = maxValue;\n"
        +"}",
        ERODE://��ʴ
        "varying vec2 v_texCoord;\n"
        +"uniform vec2 u_TextureCoordOffset[25];\n"
        +"vec4 sample[25];\n"
        +"vec4 minValue = vec4(1.0);\n"
        +"void main() \n"
        +"{\n"
        +"      for (int i = 0; i < 25; i++)\n"
        +"      {\n"
            // Sample a grid around and including our texel
        +"          sample[i] = texture(CC_Texture0, v_texCoord + u_TextureCoordOffset[i]);\n"
            // Keep the minimum value
        +"          minValue = min(sample[i], minValue);\n"
        +"       }\n"
        +"      gl_FragColor = minValue;\n"
        +"}",
        GLOWFILTER:// ԭͼ��˸
        "precision lowp float;\n"
        +"const float blurSize = 0.001953125;\n"// 1.0/512.0
        +"const float intensity = 0.35;\n"
        +"varying vec2 v_texCoord;\n"
        +"float u_time;\n"
        +"void main()\n"
        +"{\n"
        +"vec4 sum = vec4(0);\n"
        +"vec2 texcoord = v_texCoord;\n"
        +"int j;\n"
        +"int i;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x - 4.0*blurSize, texcoord.y)) * 0.05;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x - 3.0*blurSize, texcoord.y)) * 0.09;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x - 2.0*blurSize, texcoord.y)) * 0.12;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x - blurSize, texcoord.y)) * 0.15;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y)) * 0.16;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x + blurSize, texcoord.y)) * 0.15;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x + 2.0*blurSize, texcoord.y)) * 0.12;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x + 3.0*blurSize, texcoord.y)) * 0.09;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x + 4.0*blurSize, texcoord.y)) * 0.05;\n"

                // blur in y (vertical)
                // take nine samples, with the distance blurSize between them
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y - 4.0*blurSize)) * 0.05;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y - 3.0*blurSize)) * 0.09;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y - 2.0*blurSize)) * 0.12;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y - blurSize)) * 0.15;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y)) * 0.16;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y + blurSize)) * 0.15;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y + 2.0*blurSize)) * 0.12;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y + 3.0*blurSize)) * 0.09;\n"
        +"sum += texture2D(CC_Texture0, vec2(texcoord.x, texcoord.y + 4.0*blurSize)) * 0.05;\n"

                //increase blur with intensity!
                //fragColor = sum*intensity + texture2D(iChannel0, texcoord);
        +"if(sin(u_time) > 0.0)\n"
        +"gl_FragColor = sum * sin(u_time)+ texture2D(CC_Texture0, texcoord);\n"
        +"else\n"
        +"gl_FragColor = sum * -sin(u_time)+ texture2D(CC_Texture0, texcoord);\n"
        +"}",

        POINTLIGHT:// ���Դ
            "precision lowp float;\n"
            +"varying vec2 v_texCoord;\n"
            +"uniform vec2 u_lightPosition;\n"
            +"uniform vec2 u_textureSize;\n"
            +"uniform float u_radius;\n"
            +"uniform float u_spot;\n"// �Ƿ�۹�ƣ�0�� 1�ǣ� --���۹���м��������Χ��ȫ��  -������м�΢������Χȫ��
            +"void main()\n"
            +"{\n"
                    +"vec2 uv = v_texCoord;\n"
                    +"float radius = (u_radius / u_textureSize.y) * (u_textureSize.x/u_textureSize.y);\n"
                    +"float distance  = length( u_lightPosition - uv.xy );\n"
                    +"float maxDistance = pow( radius, 0.20);\n"
                    +"float quadDistance = pow( distance, 0.2);\n"
                    +"float quadIntensity = 1.0 - min( quadDistance, maxDistance )/maxDistance;\n"
                    +"float add = smoothstep(0.0,0.5,quadIntensity);\n"
                    +"quadIntensity += add * u_spot;\n"
                    +"quadIntensity = max(quadIntensity, 0.2 * u_spot);\n"// �۹�����������Χȫ��
                    +"vec4 texture = texture2D(CC_Texture0, uv);\n"
                    +"gl_FragColor = vec4(texture.rgb * vec3(quadIntensity), texture.a);\n"
            +"}",
        SHADER_POSITION_TEXTURE_COLOR_VERT:
        "attribute vec4 a_position; \n"
        + "attribute vec2 a_texCoord; \n"
        + "attribute vec4 a_color;  \n"
        + "#ifdef GL_ES\n"
        + "varying lowp vec4 v_fragmentColor; \n"
        + "varying mediump vec2 v_texCoord; \n"
        + "#else\n"
        + "varying vec4 v_fragmentColor; \n"
        + "varying vec2 v_texCoord; \n"
        + "#endif\n"
        + "void main() \n"
        + "{ \n"
        + "    gl_Position = CC_PMatrix * a_position;  \n"
        + "    v_fragmentColor = a_color; \n"
        + "    v_texCoord = a_texCoord; \n"
        + "}",
        BURL:
        "#ifdef GL_ES\n"
        +"precision mediump float;\n"
        +"#endif\n"
        +"varying vec4 v_fragmentColor;\n"
        +"varying vec2 v_texCoord;\n"
        +"uniform vec2 resolution;\n"
        +"uniform float blurRadius;\n"
        +"uniform float sampleNum;\n"
        +"vec4 blur(vec2);\n"
        +"void main(void)\n"
        +"{\n"
        +"vec4 col = blur(v_texCoord); //* v_fragmentColor.rgb;\n"
        +"gl_FragColor = vec4(col) * v_fragmentColor;\n"
        +"}\n"
        +"vec4 blur(vec2 p)\n"
        +"{\n"
        +"if (blurRadius > 0.0 && sampleNum > 1.0)\n"
        +"{\n"
        +"vec4 col = vec4(0);\n"
        +"vec2 unit = 1.0 / resolution.xy;\n"
        +"float r = blurRadius;\n"
        +"float sampleStep = r / sampleNum;\n"

        +"float count = 0.0;\n"

        +"for(float x = -r; x < r; x += sampleStep)\n"
        +"{\n"
        +"   for(float y = -r; y < r; y += sampleStep)\n"
        +"      {\n"
        +"        float weight = (r - abs(x)) * (r - abs(y));\n"
        +"        col += texture2D(CC_Texture0, p + vec2(x * unit.x, y * unit.y)) * weight;\n"
        +"        count += weight;\n"
        +"   }\n"
        +"}\n"
        +"return col / count;\n"
        +"}\n"
        +"return texture2D(CC_Texture0, p);\n"
        +"}",
        BURL_WINRT:
        "#ifdef GL_ES\n"
        +"precision mediump float;\n"
        +"#endif\n"
        +"varying vec4 v_fragmentColor;\n"
        +"varying vec2 v_texCoord;\n"
        +"uniform vec2 resolution;\n"
        +"vec4 blur(vec2);\n"
        +"void main(void)\n"
        +"{\n"
        +"    vec4 col = blur(v_texCoord); //* v_fragmentColor.rgb;\n"
        +"    gl_FragColor = vec4(col) * v_fragmentColor;\n"
        +"}\n"
        +"vec4 blur(vec2 p)\n"
        +"{\n"
        +"    vec4 col = vec4(0);\n"
        +"    vec2 unit = 1.0 / resolution.xy;\n"
        +"    float count = 0.0;\n"
        +"    for(float x = -4.0; x <= 4.0; x += 2.0)\n"
        +"    {\n"
        +"        for(float y = -4.0; y <= 4.0; y += 2.0)\n"
        +"        {\n"
        +"            float weight = (4.0 - abs(x)) * (4.0 - abs(y));\n"
        +"            col += texture2D(CC_Texture0, p + vec2(x * unit.x, y * unit.y)) * weight;\n"
        +"            count += weight;\n"
        +"        }\n"
        +"    }\n"
        +"    return col / count;\n"
        +"}",



}