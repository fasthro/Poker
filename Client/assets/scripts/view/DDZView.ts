import DDZHeadCom from "../game/ddz/component/DDZHeadCom";
import Cards from "../game/Cards";
import DDZMessageCom from "../game/ddz/component/DDZMessageCom";

/*
 * @Author: fasthro
 * @Description: 斗地主界面
 * @Date: 2019-04-03 15:07:45
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("斗地主/View")
export default class DDZView extends cc.Component {

    // 牌组件
    @property(Cards)
    public cards: Cards = null;

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

    /**
     * 初始化 view
     */
    public initView(): void {
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

    }

    /**
     * 设置 PlayerY 开始抢地主
     */
    public setStartGrabLandlordY(): void {

    }

    /**
     * 设置 PlayerZ 开始抢地主
     * @param minScore 最小可抢分数
     */
    public setStartGrabLandlordZ(minScore: number): void {
        this.grabLandlordNode.active = true;
        this.btnScore1.enabled = minScore <= 1;
        this.btnScore2.enabled = minScore <= 2;
        this.btnScore3.enabled = minScore <= 3;
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

}
