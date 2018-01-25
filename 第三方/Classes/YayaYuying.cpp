//导入相关头文件
#include "YayaYuying.h" 
#include "cocos2d_specifics.hpp"
#include "ScriptingCore.h"
#include "platform/android/jni/JniHelper.h"
//// js call c++ //c++ call java
bool LoginYaya(JSContext *cx, uint32_t argc, jsval *vp)
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
    //---------------------
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    std::string params01;
    jsval_to_std_string(cx, args.get(0), &params01);
    jstring str01 = minfo.env->NewStringUTF(params01.c_str());
    //---------------------

    isHave = cocos2d::JniHelper::getMethodInfo(minfo,"org/cocos2dx/javascript/AppActivity","LoginSDK", "(Ljava/lang/String;)V");
    if (isHave)
    {
        minfo.env->CallVoidMethod(jobj, minfo.methodID,str01);
    }
    return true;
}

//c++ call java
bool StartRecord(JSContext *cx, uint32_t argc, jsval *vp)
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
    //---------------------
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    std::string params01;
    jsval_to_std_string(cx, args.get(0), &params01);
    jstring str01 = minfo.env->NewStringUTF(params01.c_str());
    //---------------------
    isHave = cocos2d::JniHelper::getMethodInfo(minfo,"org/cocos2dx/javascript/AppActivity","StartAudioRecord", "(Ljava/lang/String;)V");
    if (isHave)
    {
        minfo.env->CallVoidMethod(jobj, minfo.methodID,str01);
    }
    return true;
}

//c++ call java
bool StopRecord(JSContext *cx, uint32_t argc, jsval *vp)
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
    
    isHave = cocos2d::JniHelper::getMethodInfo(minfo,"org/cocos2dx/javascript/AppActivity","StopAudioRecord", "()V");
    if (isHave)
    {
        minfo.env->CallVoidMethod(jobj, minfo.methodID);
    }
    return true;
}

//c++ call java
bool PlayAudioRecord(JSContext *cx, uint32_t argc, jsval *vp)
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
    //---------------------
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    std::string params01;
    jsval_to_std_string(cx, args.get(0), &params01);
    jstring str01 = minfo.env->NewStringUTF(params01.c_str());
    //---------------------
    isHave = cocos2d::JniHelper::getMethodInfo(minfo,"org/cocos2dx/javascript/AppActivity","PlayAudioRecord", "(Ljava/lang/String;)V");
    if (isHave)
    {
        minfo.env->CallVoidMethod(jobj, minfo.methodID,str01);
    }
    return true;
}

// c++ call js
void LoginCallBack(std::string token)
{
    cocos2d::__String  strCmd;
    strCmd.initWithFormat("LoginCallBack(%s)",token.c_str());
    
    ScriptingCore::getInstance()->evalString(strCmd.getCString());
}

// c++ call js
void ReqService(std::string token)
{
    cocos2d::__String  strCmd;
    strCmd.initWithFormat("ReqService(%s)",token.c_str());
    
    ScriptingCore::getInstance()->evalString(strCmd.getCString());
}

// c++ call js
void OutTimeCallBack(std::string token)
{
    cocos2d::__String  strCmd;
    strCmd.initWithFormat("OutTimeCallBack(%s)",token.c_str());
    
    ScriptingCore::getInstance()->evalString(strCmd.getCString());
}

 
//注册全体函数
void RegisterJsbFunctions(JSContext *cx, JS::HandleObject global)
{
    JS_DefineFunction(cx, global, "LoginYaya", LoginYaya, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "StartRecord", StartRecord, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "StopRecord", StopRecord, 0, JSPROP_READONLY | JSPROP_PERMANENT);
    JS_DefineFunction(cx, global, "PlayAudioRecord", PlayAudioRecord, 0, JSPROP_READONLY | JSPROP_PERMANENT);
}   