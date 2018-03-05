#ifndef __MESSAGECENTER_H__
#define __MESSAGECENTER_H__

#include <string>
#include <list>
#include <jni.h>

struct lua_State;
class MessageCenter
{
public:
    MessageCenter(void);
    ~MessageCenter(void);

    static MessageCenter * getInstance();
    static int  lua_bind_AllFunction(lua_State* tolua_S);

    void cppSendMessageToJava(const std::string & message);

    static const std::string classPrefix;
    static const std::string fullName;
    static const std::string className;

private:
    static MessageCenter *m_instance;
    std::list<std::string> m_messageList;
};

int lua_cocos2dx_MessageCenter_getInstance(lua_State* tolua_S);
int lua_cocos2dx_MessageCenter_cppSendMessageToJava(lua_State* tolua_S);
#endif