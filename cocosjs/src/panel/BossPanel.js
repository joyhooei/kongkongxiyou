
//BossMyLayer
cb.BossMyLayer = cc.Layer.extend({
	ctor: function() {
		this._super();

		var ccsNode = ccs.CSLoader.createNode("uiccs/BossMyLayer.csb");
		this.addChild(ccsNode);
		this._ccsNode = ccsNode;

		this.__initView();

		bossHandler.getMyBoss();
	},

	__initView:function(){
		var ccsNode=this._ccsNode;
		var scrollView=ccsNode.getChildByName("scrollView");
		scrollView.setScrollBarEnabled(false);

		var entitySpriteMng = cb.EntitySpriteManger.getInstance();
		var itemNode, itemBtn, myBossData, levelText, selectImage;
		var entityData, entitySprite, skinIdData, mybossId;
		var itemData, itemDatas = {};
		this.itemDatas = itemDatas;
		this.collectSkinIds=[];
		for (var i = 1; i <= 5; i++) {
			itemNode = scrollView.getChildByTag(i+1000);
			if (!itemNode) break;

			mybossId=i;
			
			levelText = itemNode.getChildByName("levelText");
			selectImage = itemNode.getChildByName("selectImage");
			selectImage.setVisible(false);

			myBossData=dataApi.myboss.findById(mybossId);
			levelText.setString(myBossData.bossLevel+"级");

			entityData = dataApi.character.findById(myBossData.bossId);
			entitySprite = entitySpriteMng.createEntitySprite(entityData.skinId,EntityType.MOB);
			skinIdData = dataApi.skinId.findById(entityData.skinId);
			entitySprite.setPosition(0, skinIdData.offsetY+100);
			entitySprite.show(entityData.skinId,3,Entity.kMActionIdle,0.1);
			itemNode.addChild(entitySprite);

			this.collectSkinIds.push(entityData.skinId);

			itemBtn = scrollView.getChildByTag(10000 + i);
			itemBtn.setTag(mybossId);
			itemBtn.addTouchEventListener(this.touchEvent, this);

			var timeText=itemNode.getChildByName("timeText");

			itemData = {
				mybossId: mybossId,
				itemNode:itemNode,
				myBossData:myBossData,
				selectImage:selectImage,
				timeText:timeText,
				itemPoint:itemNode.getPosition()
			};
			itemDatas[mybossId]=itemData;
		}

		var self=this;
		var onActionCallback=function(){
			self.setSelectItemData(1);
		};
		this.runAction(
			cc.Sequence.create(
				cc.DelayTime.create(0.2),
				cc.CallFunc.create(onActionCallback)
			)
		);
	},

	setSelectItemData:function(mybossId){
		var itemData=this.itemDatas[mybossId];
		if (this.selectItemData) {
			this.selectItemData.selectImage.setVisible(false);
		}
		itemData.selectImage.setVisible(true);
		this.selectItemData=itemData;

		if (layerManager.isRunPanel(cb.kMBossPanelId)) {
			var curPanel = layerManager.curPanel;
			curPanel.setMyBossData(itemData.myBossData,itemData.canEnter);
		}
	},

	touchEvent: function(sender, type) {
		if (type === ccui.Widget.TOUCH_ENDED) {
			if (type === ccui.Widget.TOUCH_ENDED) {
				var mybossId = sender.getTag();
				this.setSelectItemData(mybossId);
			}
		}
	},

	setLayerData:function(data){
		var times=data.times;
		var oneTimes,itemData,haveRun;
		for (var i = 1; i <= 5; i++) {
			itemData=this.itemDatas[i];
			oneTimes=data[("times"+i)];

			itemData.residualTimes=oneTimes-times;
			if (itemData.residualTimes>0) {
				var timeStr=Math.floor(itemData.residualTimes/60)+"分"+itemData.residualTimes%60+"秒";
				itemData.timeText.setString(timeStr);
				itemData.timeText.setTextColor(consts.COLOR_RED);
				itemData.canEnter=false;
				haveRun=true;
			}else{
				itemData.residualTimes=0;
				itemData.timeText.setString("活跃");
				itemData.timeText.setTextColor(consts.COLOR_GREEN);
				itemData.canEnter=true;
			}
		}
		this.unscheduleAllCallbacks();
		if (haveRun) {
			this.schedule(this.onTick, 1);
		}
	},

	onTick:function(){
		var itemData, haveRun;
		for (var i = 1; i <= 5; i++) {
			itemData=this.itemDatas[i];
			if (itemData.residualTimes>0) {
				itemData.residualTimes--;
				var timeStr=Math.floor(itemData.residualTimes/60)+"分"+itemData.residualTimes%60+"秒";
				itemData.timeText.setString(timeStr);
				itemData.canEnter=false;
				haveRun=true;
				// itemData.timeText.setTextColor(consts.COLOR_RED);
			}else if (itemData.residualTimes<0){
				itemData.residualTimes=0;
				itemData.timeText.setString("活跃");
				itemData.timeText.setTextColor(consts.COLOR_GREEN);
				itemData.canEnter=true;
			}
		}
		if (!haveRun) {
			this.unscheduleAllCallbacks();
		}
	},

	updateLayerData: function() {
		var itemNode,index,itemData;
		for (var key in this.itemDatas) {
			itemData=this.itemDatas[key];
			itemNode=itemData.itemNode;
			itemNode.stopAllActions();
			itemNode.setPositionX(1400);

			index=parseInt(key);
			var sequence = cc.Sequence.create(
				cc.DelayTime.create(0.2*index),
				cc.MoveTo.create(0.2,itemData.itemPoint)
			);
			itemNode.runAction(sequence);
		}
	}
});

// //BossWorldLayer
// cb.BossWorldLayer = cc.Layer.extend({
// 	ctor: function() {
// 		this._super();

// 		var ccsNode = ccs.CSLoader.createNode("uiccs/BossWorldLayer.csb");
// 		this.addChild(ccsNode);
// 		this._ccsNode = ccsNode;

// 		this.__initView();
// 	},

// 	__initView:function(){
// 		var ccsNode=this._ccsNode;
// 		var scrollView=ccsNode.getChildByName("scrollView");
// 		scrollView.setScrollBarEnabled(false);

// 		this.itemNodes={};
// 		this.itemPoints={};
// 		this.selectImages={};

// 		var entitySpriteMng=cb.EntitySpriteManger.getInstance();
// 		var itemNode, itemBtn,myBossData, levelText,bustSprite,selectImage;
// 		var entityData, entitySprite, skinIdData,mybossId;
// 		var itemDatas={};
// 		for (var i = 1; i <= 5; i++) {
// 			itemNode = scrollView.getChildByTag(i+1000);
// 			if (!itemNode) break;

// 			this.itemNodes[i] = itemNode;
// 			this.itemPoints[i] = itemNode.getPosition();

// 			levelText = itemNode.getChildByName("levelText");
// 			selectImage = itemNode.getChildByName("selectImage");
// 			selectImage.setVisible(false);
// 			this.selectImages[i] = selectImage;

// 			mybossId=10+i;
// 			myBossData=dataApi.myboss.findById(mybossId);
// 			levelText.setString(myBossData.bossLevel+"级");

// 			entityData = dataApi.character.findById(myBossData.bossId);
// 			entitySprite = entitySpriteMng.createEntitySprite(entityData.skinId,EntityType.MOB);
// 			skinIdData = dataApi.skinId.findById(entityData.skinId);
// 			entitySprite.setPosition(0, skinIdData.offsetY+100);
// 			entitySprite.show(entityData.skinId,3,Entity.kMActionIdle,0.1);
// 			itemNode.addChild(entitySprite);
// 			if (mybossId===15) {
// 				entitySprite.setScale(0.6);
// 			}

// 			itemBtn = scrollView.getChildByTag(10000 + i);
// 			itemBtn.setTag(mybossId);
// 			itemBtn.addTouchEventListener(this.touchEvent, this);
// 		}
// 	},

// 	touchEvent:function(sender, type) {
// 		if (type === ccui.Widget.TOUCH_ENDED) {
// 			var mybossId=sender.getTag();
// 			cc.log("touchEvent=====>> mybossId="+mybossId);
// 		}
// 	},

// 	updateLayerData: function() {
// 		var itemNode,index;
// 		for (var key in this.itemNodes) {
// 			itemNode=this.itemNodes[key];

// 			itemNode.stopAllActions();
// 			itemNode.setPositionX(1000);

// 			index=parseInt(key);
// 			var sequence = cc.Sequence.create(
// 				cc.DelayTime.create(0.2*index),
// 				cc.MoveTo.create(0.2,this.itemPoints[key])
// 			);
// 			itemNode.runAction(sequence);
// 		}
// 	}
// });

//BossPanel
cb.BossPanel = cb.BasePanel.extend({
	ctor: function() {
		this._super();
		this.createCCSNode("uiccs/BossPanel.csb");
		this.__initView();
		this.openBgTouch();
	},

	__initView: function() {
		var ccsNode = this._ccsNode;
		var menuNode=ccsNode.getChildByName("menuNode");
		var tabBtn;
		this.tabBtns={};
		for (var i = 1; i <=10; i++) {
			tabBtn = menuNode.getChildByTag(i+1000);
			if (!tabBtn) {
				break;
			}
			tabBtn.addTouchEventListener(this.touchEvent, this);
			this.tabBtns[i]=tabBtn;

			var btnText=tabBtn.getChildByName("btnText");
			btnText.setString("我的BOSS");
			break;
		}
		this._layers={};
	
		this.bossText=ccsNode.getChildByName("bossText");
		this.levelText=ccsNode.getChildByName("levelText");
		this.placeText=ccsNode.getChildByName("placeText");

		var frameImage=ccsNode.getChildByName("frameImage");
		frameImage.setLocalZOrder(10);

		var touchEvent = function(sender, type) {
			if (type === ccui.Widget.TOUCH_ENDED) {
				bossHandler.inMyBoss(this.myBossData.areaId);
			}
		}
		var enterBtn=ccsNode.getChildByName("enterBtn");
		enterBtn.addTouchEventListener(touchEvent, this);
		this.enterBtn=enterBtn;
	},

	closePanel:function(){
		var layer = this._layers[1];
		if (!layer) return;

		var entitySpriteMng = cb.EntitySpriteManger.getInstance();
		var collectSkinIds=layer.collectSkinIds;
		for (var key in collectSkinIds) {
			var skinId=collectSkinIds[key];
			entitySpriteMng.clearEntitySpriteBySkinId(skinId);
		}

		layerManager.closePanel(this);
	},

	setMyBossData:function(myBossData,isCanEnter){
		if(!myBossData) return;

		this.myBossData=myBossData;
		this.levelText.setString(myBossData.needLevel+"级");

		if (app.getCurPlayer().level>=myBossData.needLevel) {
			this.levelText.setTextColor(consts.COLOR_PURE_YELLOW);
		}else{
			this.levelText.setTextColor(consts.COLOR_PURE_RED);
			isCanEnter=false;
		}

		var areaData = dataApi.area.findById(myBossData.areaId);
		this.placeText.setString(areaData.areaName);

		var entityData = dataApi.character.findById(myBossData.bossId);
		this.bossText.setString(entityData.name);

		if (isCanEnter) {
			this.enterBtn.setEnabled(true);
		}else{
			this.enterBtn.setEnabled(false);
		}
	},

	touchEvent: function(sender, type) {
		if (type === ccui.Widget.TOUCH_ENDED) {
			var index = sender.getTag() - 1000;
			this.selectTabBtn(index);
		}
	},

	setPanelData:function(tabIndex){
//		if (!tabIndex) {
			this.selectTabBtn(1);
//		}else{
		// 	if(typeof tabIndex == 'number'){
		// 		this.selectTabBtn(tabIndex);
		// 	}
//		}
		// this.updateMoney();
	},

	updatePanelData:function(data){
		var layer = this._layers[1];
		if (!layer) return;

		layer.setLayerData(data);
	},

	selectTabBtn: function(index) {
		if (index === null) return;
		if (this.tabIndex === index)
			return;

		if (this.tabIndex !== null)
			this.unselectTabBtn(this.tabIndex);

		this.tabIndex = index;
		var tabBtn = this.tabBtns[index];
		if(!tabBtn) return;

		var btnSprite=tabBtn.getChildByName("btnSprite");
		var btnText=tabBtn.getChildByName("btnText");

		btnSprite.setSpriteFrame("tabbtn_hselected.png");
		btnText.setTextColor(consts.COLOR_ORANGEGOLD);
		
		var layer = this._layers[index];
		if (layer) {
			layer.setVisible(true);
		}
		if (!layer) {
			if(index===1){
				layer=new cb.BossMyLayer();
			// } else if (index === 2) {
				// layer=new cb.BossWorldLayer();
			}
			if (!layer) return;
			this._ccsNode.addChild(layer);
			this._layers[index] = layer;
		}
		layer.updateLayerData();
	},

	unselectTabBtn: function(index) {
		var tabBtn = this.tabBtns[index];
		if(!tabBtn) return;

		var btnSprite=tabBtn.getChildByName("btnSprite");
		var btnText=tabBtn.getChildByName("btnText");
		btnSprite.setSpriteFrame("tabbtn_hnormal.png");
		btnText.setTextColor(consts.COLOR_WHITE);

		var layer = this._layers[index];
		if (layer) {
			layer.setVisible(false);
		}
	}

});