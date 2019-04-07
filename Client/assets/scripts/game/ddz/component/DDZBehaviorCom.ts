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
    // 分数文本
    @property(cc.Label)
    public scoreLabel: cc.Label = null;

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

    /**
     * 初始化
     */
    public init(): void {
        this.setScore(false);
        this.setBehavior(false);
        this.setCardCount(false);
        this.setCountdown(false);
    }

    /**
     * 设置分数显示
     * @param score 
     */
    public setScore(active: boolean, score?: number): void {
        this.scoreNode.active = active;
        if (score) this.scoreLabel.string = score.toString();
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
        if (count) this.cardCountLabel.string = count.toString();
    }

    /**
     * 设置倒计时
     * @param time 
     */
    public setCountdown(active: boolean, time?: number): void {
        this.countdownNode.active = active;
        if (time) this.countdownLabel.string = time.toString();
    }
}
