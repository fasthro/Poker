import DDZHeadCom from "../game/ddz/component/DDZHeadCom";
import Cards from "../game/Cards";
import DDZBehaviorCom from "../game/ddz/component/DDZBehaviorCom";
import DDZCtroller from "../controller/DDZCtroller";
import DDZString from "../language/DDZString";

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
    @property(DDZBehaviorCom)
    public behaviorX: DDZBehaviorCom = null;
    @property(DDZBehaviorCom)
    public behaviorY: DDZBehaviorCom = null;
    @property(DDZBehaviorCom)
    public behaviorZ: DDZBehaviorCom = null;

    // 选择牌按钮 node
    @property(cc.Node)
    public choiceCardNode: cc.Node = null;
    // 不出
    @property(cc.Button)
    public btnPass: cc.Button = null;
    // 智能提示
    @property(cc.Button)
    public btnAI: cc.Button = null;
    // 出牌
    @property(cc.Button)
    public btnDiscard: cc.Button = null;

    // 选择分数按钮 node
    @property(cc.Node)
    public choiceScoreNode: cc.Node = null;
    // 不叫
    @property(cc.Button)
    public btnUnChoice: cc.Button = null;
    // 一分
    @property(cc.Button)
    public btnChoiceScore1: cc.Button = null;
    // 二分
    @property(cc.Button)
    public btnChoiceScore2: cc.Button = null;
    // 三分
    @property(cc.Button)
    public btnChoiceScore3: cc.Button = null;

    onLoad() {
        // 注册选择分数按钮事件
        this.btnUnChoice.clickEvents.push(this.createClickEventHandler("onClickChoiceScore", "0"));
        this.btnChoiceScore1.clickEvents.push(this.createClickEventHandler("onClickChoiceScore", "1"));
        this.btnChoiceScore2.clickEvents.push(this.createClickEventHandler("onClickChoiceScore", "2"));
        this.btnChoiceScore3.clickEvents.push(this.createClickEventHandler("onClickChoiceScore", "3"));

        // 注册出牌按钮事件
        this.btnPass.clickEvents.push(this.createClickEventHandler("onClickChoiceCardPass"));
        this.btnAI.clickEvents.push(this.createClickEventHandler("onClickChoiceCardAI"));
        this.btnDiscard.clickEvents.push(this.createClickEventHandler("onClickChoiceCardDiscard"));
    }

    /**
     * 初始化 view
     */
    public initView(controller: DDZCtroller): void {
        this._controller = controller;

        this.cards.initCards([]);
        this.wcards.initCards([]);

        this.headX.init();
        this.headY.init();
        this.headZ.init();

        this.behaviorX.init();
        this.behaviorY.init();
        this.behaviorZ.init();

        this.choiceScoreNode.active = false;
        this.choiceCardNode.active = false;
    }

    /**
     * 设置X选择分数
     */
    public setChoiceScoreX(): void {
        this.choiceScoreNode.active = false;
    }

    /**
     * 设置Y选择分数
     */
    public setChoiceScoreY(): void {
        this.choiceScoreNode.active = false;
    }

    /**
     * 设置Z选择分数
     * @param minScore 最小可选分数
     */
    public setChoiceScoreZ(minScore: number): void {
        this.choiceScoreNode.active = true;

        this.btnChoiceScore1.interactable = minScore <= 1;
        this.btnChoiceScore2.interactable = minScore <= 2;
        this.btnChoiceScore3.interactable = minScore <= 3;
    }

    /**
     * 设置X执行选择分数
     * @param score 抢的分数
     */
    public setExecuteChoiceScoreX(score: number): void {
        if (score > 0) this.behaviorX.setScore(true, score);
        else this.behaviorX.setBehavior(true, DDZString.unChoiceScore);
    }

    /**
     * 设置Y执行选择分数
     * @param score 抢的分数
     */
    public setExecuteChoiceScoreY(score: number): void {
        if (score > 0) this.behaviorY.setScore(true, score);
        else this.behaviorY.setBehavior(true, DDZString.unChoiceScore);
    }

    /**
     * 设置Z执行选择分数
     * @param score 抢的分数
     */
    public setExecuteChoiceScoreZ(score: number): void {
        if (score > 0) this.behaviorZ.setScore(true, score);
        else this.behaviorZ.setBehavior(true, DDZString.unChoiceScore);
    }

    /**
     * 设置X为地主
     */
    public setCreateLordX(): void {
        this._setCreateLord();
        this.headX.setLord(true);
    }

    /**
     * 设置Y为地主
     */
    public setCreateLordY(): void {
        this._setCreateLord();
        this.headY.setLord(true);
    }

    /**
     * 设置Z为地主
     */
    public setCreateLordZ(): void {
        this._setCreateLord();
        this.headZ.setLord(true);
    }

    /**
     * 设置地主
     */
    private _setCreateLord(): void {
        this.behaviorX.init();
        this.behaviorY.init();
        this.behaviorZ.init();
    }

    /**
     * 设置底牌
     * @param cards 
     */
    public setWcard(cards: Array<number>): void {
        this.wcards.initCards(cards);
    }

    /**
     * 设置X选择出牌
     * @param active 
     */
    public setChoiceCardX(): void {
        this.choiceCardNode.active = false;
    }

    /**
     * 设置Y选择出牌
     * @param active 
     */
    public setChoiceCardY(): void {
        this.choiceCardNode.active = false;
    }

    /**
     * 设置Z选择出牌
     * @param active 
     * @param ocard 对手牌
     */
    public setChoiceCardZ(active: boolean, ocard: Array<number>): void {
        this.choiceCardNode.active = true;
    }

    /**
     * 选择分数按钮事件回调
     * @param event 
     * @param customEventData 
     */
    private onClickChoiceScore(event, customEventData): void {
        let score: number = parseInt(customEventData);
        this._controller.round.executeChoiceScore(this._controller.round.playerZ, score);
        this.choiceScoreNode.active = false;
    }

    /**
     * 不出按钮事件回调
     * @param event 
     * @param customEventData 
     */
    private onClickChoiceCardPass(event, customEventData): void {
        
    }

    /**
     * 提示按钮事件回调
     * @param event 
     * @param customEventData 
     */
    private onClickChoiceCardAI(event, customEventData): void {
        
    }

    /**
     * 出牌按钮事件回调
     * @param event 
     * @param customEventData 
     */
    private onClickChoiceCardDiscard(event, customEventData): void {
        
    }

    /**
     * 创建点击事件
     * @param handler 
     * @param customEventData 
     */
    private createClickEventHandler(handler: string, customEventData: string = "") {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "DDZView";
        clickEventHandler.handler = handler;
        clickEventHandler.customEventData = customEventData;
        return clickEventHandler
    }
}
