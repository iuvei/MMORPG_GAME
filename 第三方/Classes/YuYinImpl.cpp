#include "YuYinImpl.h"

NS_CC_BEGIN
static YuYinImpl* _yuyinImpl;
YuYinImpl* YuYinImpl::getInstance()
{
	if (!_yuyinImpl)
	{
		_yuyinImpl = new YuYinImpl();
		_yuyinImpl->retain();
	}
	return _yuyinImpl;
}

bool YuYinImpl::init()
{
	CCLOG("YuYinImpl Inited.");

	YVTool* pYVTool = YVTool::getInstance();
	pYVTool->initSDK(1001005, FileUtils::getInstance()->getWritablePath(), false, false);

	_isSchedule = false;

	YuYinLoginListern *login = new YuYinLoginListern();
	pYVTool->addLoginListern(login);
	YuYinStopRecordListern *stopRecord = new YuYinStopRecordListern();
	pYVTool->addStopRecordListern(stopRecord);
	YuYinUploadListern *uploadEnd = new YuYinUploadListern();
	pYVTool->addUpLoadFileListern(uploadEnd);
	YuYinFinishSpeechListern *speechFinish = new YuYinFinishSpeechListern();
	pYVTool->addFinishSpeechListern(speechFinish);
	YuYinDownloadListern *downloadLis = new YuYinDownloadListern();
	pYVTool->addDownloadVoiceListern(downloadLis);
	YuYinFinishPlayListern *finishiPlay = new YuYinFinishPlayListern();
	pYVTool->addFinishPlayListern(finishiPlay);

	//pYVTool->cpLogin();
	startDispatch();
	return Node::init();
}

void YuYinImpl::login(std::string name)
{
	YVTool::getInstance()->cpLogin(name, name);
}

void YuYinImpl::dispose()
{
	stopDispatch();
	_yuyinImpl->release();
	_yuyinImpl = NULL;
}
NS_CC_END