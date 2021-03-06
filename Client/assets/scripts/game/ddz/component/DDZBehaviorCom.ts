import Cards from "../../Cards";

/*
 * @Author: fasthro
 * @Description: 斗地主牌桌行为组件
 * @Date: 2019-04-05 22:44:10
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("斗地主/BehaviorCom")
export default class DDZBehaviorCom extends cc.Component {

    // 分数 node
    @property(cc.Node)
    public scoreNode: cc.Node = null;
    // 1分
    @property(cc.Node)
    public scoreNode1: cc.Node = null;
    // 2分
    @property(cc.Node)
    public scoreNode2: cc.Node = null;
    // 3分
    @property(cc.Node)
    public scoreNode3: cc.Node = null;

    // 弹窗 node
    @property(cc.Node)
    public popupNode: cc.Node = null;
    // 消息文本
    @property(cc.Label)
    public popupLabel: cc.Label = null;

    // 牌数 node
    @property(cc.Node)
    public cardCountNode: cc.Node = null;
    // 牌数文本
    @property(cc.Label)
    public cardCountLabel: cc.Label = null;

    // 倒计时 node
    @property(cc.Node)
    public countdownNode: cc.Node = null;
    // 倒计时文本
    @property(cc.Label)
    public countdownLabel: cc.Label = null;

    // dcard node
    @property(cc.Node)
    public dcardNode: cc.Node = null;
    // dcards
    @property(Cards)
    public dcards: Cards = null;

    /**
     * 初始化
     */
    public init(): void {
        this.setScore(false);
        this.setBehavior(false);
        this.setCardCount(false);
        this.setCountdown(false);
        this.setDcard(false);
    }

    /**
     * 设置分数显示
     * @param score 
     */
    public setScore(active: boolean, score?: number): void {
        this.scoreNode.active = active;
        if (score != null && score != undefined) {
            this.scoreNode1.active = score == 1;
            this.scoreNode2.active = score == 2;
            this.scoreNode3.active = score == 3;
        }
    }

    /**
     * 设置行为提示
     * @param msg 
     */
    public setBehavior(active: boolean, msg?: string): void {
        this.popupNode.active = active;
        if (msg) this.popupLabel.string = msg;
    }

    /**
     * 设置牌数
     * @param count 
     */
    public setCardCount(active: boolean, count?: number): void {
        this.cardCountNode.active = active;
        if (count != null && count != undefined) this.cardCountLabel.string = count.toString();
    }

    /**
     * 设置倒计时
     * @param time 
     */
    public setCountdown(active: boolean, time?: number): void {
        this.countdownNode.active = active;
        if (time != null && time != undefined) this.countdownLabel.string = time.toString();
    }

    /**
     * 设置dcards
     * @param dcards 
     */
    public setDcard(active: boolean, dcards?: Array<number>): void {
        this.dcardNode.active = active;
        if (dcards) this.dcards.initCards(dcards);
    }
}
