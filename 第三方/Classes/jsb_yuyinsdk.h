#ifndef __jsb_yuyinsdk
#define __jsb_yuyinsdk

#include "scripting/js-bindings/manual/cocos2d_specifics.hpp"
#include "YuYinImpl.h"

NS_CC_BEGIN

bool loginSDK(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc != 1)
	{
		CCLOG("js_YAYA_loginSDK: wrong number of arguments");
		return false;
	}

	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	std::string arg0;
	jsval_to_std_string(cx, args.get(0), &arg0);
	YuYinImpl::getInstance()->login(arg0);
	return true;
}

bool startRecordVoice(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc != 1)
	{
		CCLOG("js_YAYA_startRecord: wrong number of arguments");
		return false;
	}

	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	std::string arg0;
	jsval_to_std_string(cx, args.get(0), &arg0);
	YuYinImpl::getInstance()->startRecord(arg0);
	return true;
}

bool stopRecordVoice(JSContext *cx, uint32_t argc, jsval *vp)
{
	YuYinImpl::getInstance()->stopRecord();
	return true;
}

bool playOnlineVoice(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc != 1)
	{
		CCLOG("js_YAYA_playOnline: wrong number of arguments");
		return false;
	}

	JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
	JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	std::string arg0;
	jsval_to_std_string(cx, args.get(0), &arg0);
	YuYinImpl::getInstance()->playOnline(arg0);
	return true;
}

bool stopPlayVoice(JSContext *cx, uint32_t argc, jsval *vp)
{
	YuYinImpl::getInstance()->stopPlay();
	return true;
}

void register_all_yuyinsdk(JSContext* cx, JS::HandleObject obj) {
	// Get the ns
	JS::RootedObject ns(cx);
	get_or_create_js_obj(cx, obj, "yaya", &ns);

	JS_DefineFunction(cx, ns, "loginSDK", loginSDK, 0, JSPROP_READONLY | JSPROP_PERMANENT);
	JS_DefineFunction(cx, ns, "startRecord", startRecordVoice, 0, JSPROP_READONLY | JSPROP_PERMANENT);
	JS_DefineFunction(cx, ns, "stopRecord", stopRecordVoice, 0, JSPROP_READONLY | JSPROP_PERMANENT);
	JS_DefineFunction(cx, ns, "playOnline", playOnlineVoice, 0, JSPROP_READONLY | JSPROP_PERMANENT);
	JS_DefineFunction(cx, ns, "stopPlay", stopPlayVoice, 0, JSPROP_READONLY | JSPROP_PERMANENT);
}
NS_CC_END
#endif
