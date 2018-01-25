#ifndef __yunwa_yuyinimpl
#define __yunwa_yuyinimpl

#include "cocos2d.h"
#include "YunVaSDK/yvListern.h"
#include "YunVaSDK/YVTool.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
NS_CC_BEGIN
using namespace YVSDK;

class YuYinImpl :Node
{
public:
	YuYinImpl()
	{
	}
	~YuYinImpl()
	{

	}

	static YuYinImpl* getInstance();

	bool init();

	CREATE_FUNC(YuYinImpl);
	void startDispatch()
	{
		if (_isSchedule)
			return;
		_isSchedule = true;
		Director::getInstance()->getScheduler()->scheduleUpdate(this, 0, false);
	}

	void stopDispatch()
	{
		if (!_isSchedule)
			return;
		_isSchedule = false;
		Director::getInstance()->getScheduler()->unscheduleUpdate(this);
	}

	void dispose();

	void login(std::string id);

	void startRecord(std::string ext)
	{
		cocos2d::__String strName;
		strName.initWithFormat("temp%d.amr", _recordIndex);
		bool suc = YVTool::getInstance()->startRecord((FileUtils::getInstance()->getWritablePath() + "yunva_audio/" + strName.getCString()).c_str(), 0, ext);
		if (!suc)
			CCLOG("startRecord Failed");
		else
			_recordIndex++;		//��Ҫ���������ӳ� ��һ����δ�ϴ���� �ڶ����ֿ�ʼ¼��
		if (_recordIndex >= 5)
			_recordIndex = 0;
	}

	void stopRecord()
	{
		YVTool::getInstance()->stopRecord();
	}


	void playOnline(std::string url)
	{
		YVTool::getInstance()->playFromUrl(url);
	}

	void stopPlay()
	{
		YVTool::getInstance()->stopPlay();
	}

	//��������Ӧ�����ò��ϵ�
	void playRecord(std::string url)
	{
		YVTool::getInstance()->playRecord("", url);
	}
	void speechVoice(std::string path)
	{
		YVTool::getInstance()->speechVoice(path);
	}

	/************************************************************************/
	// ����js��������
	// ext Ϊ¼��ʱ������ַ��������� time, url, result, err
	/************************************************************************/
	void sendVoice(std::string ext)
	{
		cocos2d::__String  strCmd;
		strCmd.initWithFormat("yaya.SendYuYinMsg(%s)", ext.c_str());
		ScriptingCore::getInstance()->evalString(strCmd.getCString());
	}
	void playEnd()
	{
		ScriptingCore::getInstance()->evalString("yaya.OnYuYinPlayEnd()");
	}

	void update(float d)
	{
		YVTool::getInstance()->dispatchMsg(d);
	}

	class YuYinLoginListern:public YVListern::YVLoginListern
	{
		void onLoginListern(CPLoginResponce* r)
		{
			if(r->result != 0)
			{
				CCLOG("Login YunVa Failed");
			}
			else
			{
				CCLOG("Login YunVa Success");
			}
		}
	};

	class YuYinStopRecordListern :public YVListern::YVStopRecordListern
	{
		void onStopRecordListern(RecordStopNotify* r)
		{
			//if (r->time > 500)
			//{
			//	CCLOG("Stop Record  time: %d   %s", r->time, r->strfilepath.c_str());
			//}
			//else
			//{
			//	CCLOG("Stop Record  time: %d  is too short      %s", r->time, r->strfilepath.c_str());
			//}
			if (r->time > 300)
			{
				cocos2d::__String ext;
				ext.initWithFormat("%s, %d", r->ext.c_str(), r->time);
				YVTool::getInstance()->speechVoice(r->strfilepath, ext.getCString());
			}
			else
			{
				CCLOG("Stop Record  time: %d  is too short      %s", r->time, r->strfilepath.c_str());
			}
			
		}
	};

	class YuYinUploadListern :public YVListern::YVUpLoadFileListern
	{
		void onUpLoadFileListern(UpLoadFileRespond* r)
		{
			if (r->result == 0)
			{
				//CCLOG("Upload percent: %d   url:%s   msg:%s    %s", r->percent, r->fileurl.c_str(), r->msg.c_str(), r->fileid.c_str());
			}
			else
			{
				//CCLOG("Upload percent: %d   url:%s   msg:%s    %s", r->percent, r->fileurl.c_str(), r->msg.c_str(), r->fileid.c_str());
			}
		}
	};


	class YuYinFinishSpeechListern :public YVListern::YVFinishSpeechListern
	{
		void onFinishSpeechListern(SpeechStopRespond* r)
		{
			if (r->err_id == 0)
			{
				//CCLOG("Finish Speech percent: %s   url:%s   msg:%s", r->err_msg.c_str(), r->url.c_str(), r->result.c_str());
			}
			else
			{
				//CCLOG("Finish Speech percent: %s   url:%s   msg:%s", r->err_msg.c_str(), r->url.c_str(), r->result.c_str());
			}
			cocos2d::__String ext;
			ext.initWithFormat("%s, '%s', '%s', '%s'", r->ext.c_str(), r->url.c_str(), r->result.c_str(), r->err_msg.c_str());

			//std::u16string outUtf16;
			//bool succeed = StringUtils::UTF8ToUTF16(ext.getCString(), outUtf16);

			YuYinImpl::getInstance()->sendVoice(ext.getCString());
		}

		//std::string UtfToGbk(const char* utf8)
		//{
		//	int len = MultiByteToWideChar(CP_UTF8, 0, utf8, -1, NULL, 0);
		//	wchar_t* wstr = new wchar_t[len + 1];
		//	memset(wstr, 0, len + 1);
		//	MultiByteToWideChar(CP_UTF8, 0, utf8, -1, wstr, len);
		//	len = WideCharToMultiByte(936, 0, wstr, -1, NULL, 0, NULL, NULL);
		//	char* str = new char[len + 1];
		//	memset(str, 0, len + 1);
		//	WideCharToMultiByte(936, 0, wstr, -1, str, len, NULL, NULL);
		//	if (wstr) delete[] wstr;
		//	return str;
		//}
	};

	class YuYinDownloadListern :public YVListern::YVDownloadVoiceListern
	{
		void onDownloadVoiceListern(DownloadVoiceRespond* r)
		{
			//CCLOG("onDownloadVoiceListern  %d    ", r->percent);
		}
	};

	class YuYinFinishPlayListern :public YVListern::YVFinishPlayListern
	{
		void onFinishPlayListern(StartPlayVoiceRespond* r)
		{
			if (r->result == 1 )
				CCLOG("Finish Play  %d    %s", r->result, r->describe.c_str());
			YuYinImpl::getInstance()->playEnd();
		}
	};
private:
	int _recordIndex = 0;
	bool _isSchedule = false;
};
NS_CC_END
#endif
