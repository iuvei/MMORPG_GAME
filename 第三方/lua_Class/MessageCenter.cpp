#include "MessageCenter.h"
#include "tolua_fix.h"
#include "LuaBasicConversions.h"
#include "stdlib.h"
#include "scripting/lua-bindings/manual/CCLuaEngine.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include <jni.h>
#include <android/log.h>
#include <external/lua/luajit/include/lua.h>
#include <external/lua/tolua/tolua++.h>
#include <scripting/lua-bindings/manual/LuaBasicConversions.h>
#include <external/lua/luajit/include/lauxlib.h>
#include "platform/android/jni/JniHelper.h"
#define  LOG_TAG    "MessageCenter"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG,LOG_TAG,__VA_ARGS__)
#endif

using namespace cocos2d;

const std::string MessageCenter::classPrefix = "CMsg";
const std::string MessageCenter::className = "MessageCenter";
const std::string MessageCenter::fullName = classPrefix + "." + className;

MessageCenter *MessageCenter::m_instance = NULL;

MessageCenter::MessageCenter(void)
{
    m_messageList.clear();
}
MessageCenter::~MessageCenter(void)
{
}
MessageCenter * MessageCenter::getInstance()
{
    if (!m_instance){
        m_instance = new MessageCenter();
    }
    return m_instance;
}

void MessageCenter::cppSendMessageToJava(const std::string & message)
{
    CCLOG("sendMessageToJava:%s", message.c_str());
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

    JniMethodInfo jmi;
    JniHelper::getMethodInfo(jmi, "org/cocos2dx/lua/AppActivity", "SendMessage", "(Ljava/lang/String;)V");
    jstring str = (jmi.env->NewStringUTF(message.c_str()));
    jmi.env->CallStaticVoidMethod(jmi.classID, jmi.methodID, str);

#endif
}

//==============lua bind================
int MessageCenter::lua_bind_AllFunction(lua_State* tolua_S)
{
    lua_getglobal(tolua_S, "_G");
    if (lua_istable(tolua_S,-1))//stack:...,_G,
    {
        tolua_open(tolua_S);

        tolua_module(tolua_S, classPrefix.c_str(), 0);
        tolua_beginmodule(tolua_S, classPrefix.c_str());

        tolua_usertype(tolua_S, MessageCenter::fullName.c_str());
        tolua_cclass(tolua_S, className.c_str(), MessageCenter::fullName.c_str(),"",nullptr);

        tolua_beginmodule(tolua_S, className.c_str());
        tolua_function(tolua_S, "getInstance", lua_cocos2dx_MessageCenter_getInstance);
        tolua_function(tolua_S, "cppSendMessageToJava", lua_cocos2dx_MessageCenter_cppSendMessageToJava);
        tolua_endmodule(tolua_S);
        g_luaType[typeid(MessageCenter).name()] = MessageCenter::fullName;
        g_typeCast[className] = MessageCenter::fullName;

        tolua_endmodule(tolua_S);
    }
    lua_pop(tolua_S, 1);
    return 1;
}

int lua_cocos2dx_MessageCenter_getInstance(lua_State* tolua_S)
{
    int argc = 0;
    MessageCenter* parentOfFunction = nullptr;
    const std::string &functionString = "'lua_cocos2dx_MessageCenter_getInstance'";
    const std::string &luaFunctionString = MessageCenter::fullName + ":getInstance";

    #if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
    if (!tolua_isusertable(tolua_S,1, MessageCenter::fullName.c_str(),0,&tolua_err))
    {
    tolua_error(tolua_S, ("#ferror in function " + functionString).c_str(),&tolua_err);
    return 0;
    }

    parentOfFunction = (MessageCenter*)tolua_tousertype(tolua_S,1,0);
    if (!parentOfFunction)
    {
    //tolua_error(tolua_S, ("invalid 'cobj' in function " + functionString).c_str(), nullptr);
    //return 0;
    }
    #endif

    argc = lua_gettop(tolua_S) - 1;

    if (argc == 0)
    {
    MessageCenter* ret = MessageCenter::getInstance();
    object_to_luaval<MessageCenter>(tolua_S, MessageCenter::fullName.c_str(),(MessageCenter*)ret);
    return 1;
}
else
{luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  luaFunctionString.c_str(),argc, 1);}
return 0;

}

int lua_cocos2dx_MessageCenter_cppSendMessageToJava(lua_State* tolua_S)
{
    int argc = 0;
    MessageCenter* parentOfFunction = nullptr;
    bool ok  = true;
    const std::string &functionString = "'lua_cocos2dx_MessageCenter_cppSendMessageToJava'";
    const std::string &luaFunctionString = MessageCenter::fullName + ":cppSendMessageToJava";

    #if COCOS2D_DEBUG >= 1
    tolua_Error tolua_err;
    if (!tolua_isusertype(tolua_S, 1, MessageCenter::fullName.c_str(), 0, &tolua_err))
    {
    tolua_error(tolua_S, ("#ferror in function " + functionString).c_str(),&tolua_err);
    return 0;
    }
    #endif

    parentOfFunction = (MessageCenter*)tolua_tousertype(tolua_S,1,0);

    #if COCOS2D_DEBUG >= 1
    if (!parentOfFunction)
    {
    tolua_error(tolua_S, ("invalid 'cobj' in function " + functionString).c_str(), nullptr);
    return 0;
    }
    #endif

    argc = lua_gettop(tolua_S)-1;
    if (argc == 1)
    {
    std::string arg0;

    ok &= luaval_to_std_string(tolua_S, 2,&arg0, luaFunctionString.c_str());
    if(!ok)
    {
    tolua_error(tolua_S,("invalid arguments in function " + functionString).c_str(), nullptr);
    return 0;
    }
    parentOfFunction->cppSendMessageToJava(arg0);
    lua_settop(tolua_S, 1);
    return 1;
    }
    else
    {luaL_error(tolua_S, "%s has wrong number of arguments: %d, was expecting %d \n",  luaFunctionString.c_str(),argc, 1);}

    return 0;
}

//extern "C"
//{
//JNIEXPORT void JNICALL Java_org_cocos2dx_lua_AppActivity_javaSendMessageToCpp(JNIEnv*  env, jobject thiz)
//{
//    auto engine = LuaEngine::getInstance();
//    lua_State* L = engine->getLuaStack()->getLuaState();
//    lua_getglobal(L,"J_CALL_C_J");
//    lua_call(L,0,0);
//    lua_pop(L,1);
//}
//}