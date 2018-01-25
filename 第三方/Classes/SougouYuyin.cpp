//导入相关头文件
#include <deprecated/CCString.h>
#include "SougouYuyin.h"
#include "platform/android/jni/JniHelper.h"

void SetAppidAndAccesskey(){}

bool Startlistening(JSContext *cx, uint32_t argc, jsval *vp)
{
    cocos2d::JniMethodInfo minfo;
    bool isHave = cocos2d::JniHelper::getStaticMethodInfo(minfo,
                                                 "org/cocos2dx/javascript/AppActivity",
                                                 "getInstance",
                                                 "()Ljava/lang/Object;");
    jobject jobj;
    if (isHave)
    {
        jobj = minfo.env->CallStaticObjectMethod(minfo.classID, minfo.methodID);
    }
    
    isHave = cocos2d::JniHelper::getMethodInfo(minfo,"org/cocos2dx/javascript/AppActivity","startListening", "()V");
    if (isHave)
    {
        minfo.env->CallVoidMethod(jobj, minfo.methodID);
    }
    return true;
}

bool StopListening(JSContext *cx, uint32_t argc, jsval *vp)
{
    cocos2d::JniMethodInfo minfo;
    bool isHave = cocos2d::JniHelper::getStaticMethodInfo(minfo,
                                                 "org/cocos2dx/javascript/AppActivity",
                                                 "getInstance",
                                                 "()Ljava/lang/Object;");
    jobject jobj;
    if (isHave)
    {
        jobj = minfo.env->CallStaticObjectMethod(minfo.classID, minfo.methodID);
    }
    
    isHave = cocos2d::JniHelper::getMethodInfo(minfo,"org/cocos2dx/javascript/AppActivity","stopListening", "()V");
    if (isHave)
    {
        minfo.env->CallVoidMethod(jobj, minfo.methodID);
    }
    return true;
}

bool CancelListening(JSContext *cx, uint32_t argc, jsval *vp)
{
    cocos2d::JniMethodInfo minfo;
    bool isHave = cocos2d::JniHelper::getStaticMethodInfo(minfo,
                                                          "org/cocos2dx/javascript/AppActivity",
                                                          "getInstance",
                                                          "()Ljava/lang/Object;");
    jobject jobj;
    if (isHave)
    {
        jobj = minfo.env->CallStaticObjectMethod(minfo.classID, minfo.methodID);
    }

    isHave = cocos2d::JniHelper::getMethodInfo(minfo,"org/cocos2dx/javascript/AppActivity","cancelListening", "()V");
    if (isHave)
    {
        minfo.env->CallVoidMethod(jobj, minfo.methodID);
    }
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

extern "C"
{
    void Java_org_cocos2dx_javascript_AppActivity_ListeningCallback(JNIEnv *env, jobject thiz, jstring cmd)
    {
        std::string Cmd = cocos2d::JniHelper::jstring2string(cmd);
        SougouListenCallback(Cmd);
    }
}
