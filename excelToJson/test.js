var self = this;
cc.loader.loadTxt("res/test.json", function (err, txt) 
{
	if(err)
	{
		cc.log(err);
	}
	else
	{
		cc.log(txt);
		var animjson = JSON.parse(txt);
		for(var i = 0; i<animjson.length;i++)
		{
			var item = animjson[i]
			cc.log(item.q_introduce);
			var txt = new ccui.Text(item.q_introduce,"",30);
			self.addChild(txt);
			txt.x = 250+i*50
			txt.y = 300 + i*50
		}
	}
});

JS: [{"q_activate_item": "[[20004,1]]", "q_type": 1, "q_art": "[1,29];[2,30];[3,31];[4,32]", "q_id": 1, "q_name_show": 1, "q_attribute": "{7:10800,1:520,2:180,}", "q_activate": "", "q_introduce": "\u96c6\u9f50\u4e00\u5957\u795e\u88c5", "q_time": -1, "q_name": "\u8f69\u8f95\u795e\u88c5", "q_item_show": 20004}, {"q_activate_item": "[[20004,1]]", "q_type": 1, "q_art": "[1,41];[2,42];[3,43];[4,44]", "q_id": 2, "q_name_show": 2, "q_attribute": "{7:10800,1:520,2:180,}", "q_activate": "", "q_introduce": "\u96c6\u9f50\u4e00\u5957\u795e\u8bdd\u00b7\u795e\u88c5", "q_time": -1, "q_name": "\u8f69\u8f95\u795e\u8bdd", "q_item_show": 20004}, {"q_activate_item": "[[20004,1]]", "q_type": 1, "q_art": "[1,37];[2,38];[3,39];[4,40]", "q_id": 3, "q_name_show": 3, "q_attribute": "{7:10800,1:520,2:180,}", "q_activate": "", "q_introduce": "\u62e5\u6709\u5927\u5730\u738b\u8005\u6218\u7532", "q_time": -1, "q_name": "\u5927\u5730\u738b\u8005\u6218\u7532", "q_item_show": 20004}, {"q_activate_item": "[[20004,1]]", "q_type": 1, "q_art": "[1,13];[2,14];[3,15];[4,16]", "q_id": 4, "q_name_show": 4, "q_attribute": "{7:10800,1:520,2:180,}", "q_activate": "", "q_introduce": "\u8de8\u670d\u6218\u573a\u80dc\u5229\u5956\u52b1", "q_time": -1, "q_name": "\u8f69\u8f95\u6218\u76d4", "q_item_show": 20004}, {"q_activate_item": "[[20004,1]]", "q_type": 2, "q_art": "[1,9];[2,10];[3,11];[4,12]", "q_id": 101, "q_name_show": 101, "q_attribute": "", "q_activate": "", "q_introduce": "\u8f69\u8f95\u65f6\u88c5\u8282\u83b7\u53d6", "q_time": -1, "q_name": "\u5929\u4e0b\u5e03\u6b66", "q_attribute_puton": "{17:1000}", "q_item_show": 20004}, {"q_activate_item": "[[20005,1]]", "q_type": 2, "q_art": "[1,30001];[2,30001];[3,30001];[4,30001]", "q_id": 102, "q_name_show": 102, "q_attribute": "", "q_activate": "", "q_introduce": "\u72ec\u4e00\u65e0\u4e8c", "q_time": -1, "q_name": "\u91d1\u8272\u5e74\u534e", "q_attribute_puton": "{17:1000}", "q_item_show": 20005}, {"q_activate_item": "[[20003,5000]]", "q_type": 2, "q_art": "[1,2001];[2,2002];[3,2003];[4,2004]", "q_id": 103, "q_name_show": 103, "q_attribute": "", "q_activate": "", "q_introduce": "\u6d3b\u52a8\u65f6\u88c5", "q_time": -1, "q_name": "\u897f\u88c5", "q_attribute_puton": "{17:1000}", "q_item_show": 20003}, {"q_activate_item": "[[20002,5000]]", "q_type": 2, "q_art": "[1,17];[2,18];[3,19];[4,20]", "q_id": 104, "q_name_show": 104, "q_attribute": "", "q_activate": "", "q_introduce": "\u6d3b\u52a8\u65f6\u88c5", "q_time": -1, "q_name": "\u9f99\u6218\u4e8e\u91ce", "q_attribute_puton": "{17:1000}", "q_item_show": 20002}, {"q_activate_item": "[[20001,5000]]", "q_type": 2, "q_art": "[1,31002];[2,31002];[3,31004];[4,31004]", "q_id": 105, "q_name_show": 105, "q_attribute": "", "q_activate": "", "q_introduce": "\u6d3b\u52a8\u65f6\u88c5", "q_time": -1, "q_name": "\u590f\u65e5\u6cf3\u88c5\u6d3e\u5bf9", "q_attribute_puton": "{17:1000}", "q_item_show": 20001}, {"q_activate_item": "[[20007,10000]]", "q_type": 2, "q_art": "[1,100002];[2,100002];[3,100004];[4,100004]", "q_id": 106, "q_name_show": 106, "q_attribute": "", "q_activate": "", "q_introduce": "\u6d3b\u52a8\u65f6\u88c5", "q_time": -1, "q_name": "\u96ea\u5c71\u98de\u72d0", "q_attribute_puton": "{17:1000}", "q_item_show": 20007}]
JS: 集齐一套神装
JS: 集齐一套神话·神装
JS: 拥有大地王者战甲
JS: 跨服战场胜利奖励
JS: 轩辕时装节获取
JS: 独一无二
JS: 活动时装
JS: 活动时装
JS: 活动时装
JS: 活动时装