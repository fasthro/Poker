import DDZHeadCom from "../game/ddz/component/DDZHeadCom";
import Cards from "../game/Cards";
import DDZMessageCom from "../game/ddz/component/DDZMessageCom";
import DDZCtroller from "../controller/DDZCtroller";

/*
 * @Author: fasthro
 * @Description: 斗地主界面
 * @Date: 2019-04-03 15:07:45
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("斗地主/View")
export default class DDZView extends cc.Component {
    // controller
    private _controller: DDZCtroller;

    // 牌组件
    @property(Cards)
    public cards: Cards = null;

    // 底牌牌组件
    @property(Cards)
    public wcards: Cards = null;

    // 头像
    @property(DDZHeadCom)
    public headX: DDZHeadCom = null;
    @property(DDZHeadCom)
    public headY: DDZHeadCom = null;
    @property(DDZHeadCom)
    public headZ: DDZHeadCom = null;

    // 消息
    @property(DDZMessageCom)
    public messageX: DDZMessageCom = null;
    @property(DDZMessageCom)
    public messageY: DDZMessageCom = null;
    @property(DDZMessageCom)
    public messageZ: DDZMessageCom = null;

    // 操作node
    @property(cc.Node)
    public operateNode: cc.Node = null;
    // 不出
    @property(cc.Button)
    public btnPass: cc.Button = null;
    // 提示
    @property(cc.Button)
    public btnHint: cc.Button = null;
    // 出牌
    @property(cc.Button)
    public btnDiscard: cc.Button = null;

    // 抢地主node
    @property(cc.Node)
    public grabLandlordNode: cc.Node = null;
    // 不叫
    @property(cc.Button)
    public btnUnGrab: cc.Button = null;
    // 一分
    @property(cc.Button)
    public btnScore1: cc.Button = null;
    // 二分
    @property(cc.Button)
    public btnScore2: cc.Button = null;
    // 三分
    @property(cc.Button)
    public btnScore3: cc.Button = null;

    onLoad() {
        // 注册抢地主按钮事件
        this.btnUnGrab.clickEvents.push(this.createClickEventHandler("onClickGrab", "0"));
        this.btnScore1.clickEvents.push(this.createClickEventHandler("onClickGrab", "1"));
        this.btnScore2.clickEvents.push(this.createClickEventHandler("onClickGrab", "2"));
        this.btnScore3.clickEvents.push(this.createClickEventHandler("onClickGrab", "3"));
    }

    /**
     * 初始化 view
     */
    public initView(controller: DDZCtroller): void {
        this._controller = controller;

        this.cards.initCards([]);
        this.headX.init();
        this.headY.init();
        this.headZ.init();

        this.messageX.init();
        this.messageY.init();
        this.messageZ.init();

        this.operateNode.active = false;
        this.grabLandlordNode.active = false;
    }

    /**
     * 设置 PlayerX 开始抢地主
     */
    public setStartGrabLandlordX(): void {
        this.grabLandlordNode.active = false;
    }

    /**
     * 设置 PlayerY 开始抢地主
     */
    public setStartGrabLandlordY(): void {
        this.grabLandlordNode.active = false;
    }

    /**
     * 设置 PlayerZ 开始抢地主
     * @param minScore 最小可抢分数
     */
    public setStartGrabLandlordZ(minScore: number): void {
        this.grabLandlordNode.active = true;
        this.btnScore1.interactable = minScore <= 1;
        this.btnScore2.interactable = minScore <= 2;
        this.btnScore3.interactable = minScore <= 3;
    }

    /**
     * 设置 PlayerX 抢地主
     * @param score 抢的分数
     */
    public setGrabLandlordX(score: number): void {
        if (score > 0) {
            this.messageX.setScore(score);
        }
        else {
            this.messageX.setPopup("不叫");
        }
    }

    /**
     * 设置 PlayerY 抢地主
     * @param score 抢的分数
     */
    public setGrabLandlordY(score: number): void {
        if (score > 0) {
            this.messageY.setScore(score);
        }
        else {
            this.messageY.setPopup("不叫");
        }
    }

    /**
     * 设置 PlayerZ 抢地主
     * @param score 抢的分数
     */
    public setGrabLandlordZ(score: number): void {
        if (score > 0) {
            this.messageZ.setScore(score);
        }
        else {
            this.messageZ.setPopup("不叫");
        }
    }

    /**
     * 设置 PlayerX 为地主
     */
    public setLandlordX(): void {
        this.grabLandlordNode.active = false;
        this.headX.setDZ();

        this.messageX.init();
        this.messageY.init();
        this.messageZ.init();
    }

    /**
     * 设置 PlayerY 为地主
     */
    public setLandlordY(): void {
        this.grabLandlordNode.active = false;
        this.headY.setDZ();

        this.messageX.init();
        this.messageY.init();
        this.messageZ.init();
    }

    /**
     * 设置 PlayerZ 为地主
     */
    public setLandlordZ(): void {
        this.grabLandlordNode.active = false;
        this.headZ.setDZ();

        this.messageX.init();
        this.messageY.init();
        this.messageZ.init();
    }

    /**
     * 设置底牌
     * @param cards 
     */
    public setWcard(cards: Array<number>): void {
        this.wcards.initCards(cards);
    }

    /**
     * 抢地主按钮事件
     * @param event 
     * @param customEventData 
     */
    private onClickGrab(event, customEventData): void {
        let score: number = parseInt(customEventData);
        this._controller.onClickGrab(score);
    }

    /**
     * 创建点击事件
     * @param handler 
     * @param customEventData 
     */
    private createClickEventHandler(handler: string, customEventData: string) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "DDZView";
        clickEventHandler.handler = handler;
        clickEventHandler.customEventData = customEventData;
        return clickEventHandler
    }
}
