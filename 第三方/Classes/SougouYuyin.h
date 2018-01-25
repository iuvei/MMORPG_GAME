#ifndef SougouYuyin_h
#define SougouYuyin_h
//导入相关的头文件
#include <stdio.h>
#include "jsapi.h"
#include "jsfriendapi.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"


bool Startlistening(JSContext *cx, uint32_t argc, jsval *vp);
bool StopListening(JSContext *cx, uint32_t argc, jsval *vp);
bool CancelListening(JSContext *cx, uint32_t argc, jsval *vp);
void SetAppidAndAccesskey();

void SougouListenCallback(std::string token);

void RegisterFunctions(JSContext *cx, JS::HandleObject global);
#endif
