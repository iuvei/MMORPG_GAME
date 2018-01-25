//导入相关头文件
#include <deprecated/CCString.h>
#include "SougouYuyin.h"
#include "SogouYuyinIOS.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"

void SetAppidAndAccesskey()
{
    [[SogouYuyinIOS shareInstance] SetAppidAndAccesskey];
}

bool Startlistening(JSContext *cx, uint32_t argc, jsval *vp)
{
    [[SogouYuyinIOS shareInstance] StartListening];
    return true;
}

bool StopListening(JSContext *cx, uint32_t argc, jsval *vp)
{
    [[SogouYuyinIOS shareInstance] StopListening];
    return true;
}

bool CancelListening(JSContext *cx, uint32_t argc, jsval *vp)
{
    [[SogouYuyinIOS shareInstance] CancelListening];
    return true;
}


void SougouListenCallback(std::string token)
{
    cocos2d::__String  strCmd;
    strCmd.initWithFormat("SougouListenCallbackJS('%s')",token.c_str());
    ScriptingCore::getInstance()->evalString(strCmd.getCString());
}

void RegisterFunctions(JSContext *cx, JS::HandleObject global)
{
    JS_DefineFunction(cx, global, "Startlistening", Startlistening, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "StopListening", StopListening, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "CancelListening", CancelListening, 0, JSPROP_READONLY | JSPROP_PERMANENT);
}
