#ifndef YayaYuying_h
#define YayaYuying_h
//导入相关的头文件
#include <stdio.h>
#include "jsapi.h"
#include "jsfriendapi.h"
#include "ScriptingCore.h"
#include "cocos2d_specifics.hpp"
//自定义全局方法，用来测试，将在js中调用该方法
bool LoginYaya(JSContext *cx, uint32_t argc, jsval *vp);
bool StartRecord(JSContext *cx, uint32_t argc, jsval *vp);
bool StopRecord(JSContext *cx, uint32_t argc, jsval *vp);
bool PlayAudioRecord(JSContext *cx, uint32_t argc, jsval *vp);
//该方法将在java层调用
void LoginCallBack(std::string token);
//录音超时回调
void OutTimeCallBack(std::string token);
//还回当前语音录制相关信息
void ReqService(std::string token);
// 注册JS下调用的C++的函数
void RegisterJsbFunctions(JSContext *cx, JS::HandleObject global);
#endif