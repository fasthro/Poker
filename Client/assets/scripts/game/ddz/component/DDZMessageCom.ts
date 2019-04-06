/*
 * @Author: fasthro
 * @Description: 斗地主牌桌消息组件
 * @Date: 2019-04-05 22:44:10
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("斗地主/MessageCom")
export default class DDZMessageCom extends cc.Component {

    // 分数 node
    @property(cc.Node)
    public scoreNode: cc.Node = null;
    // 一分
    @property(cc.Node)
    public score1: cc.Node = null;
    // 二分
    @property(cc.Node)
    public score2: cc.Node = null;
    // 三分
    @property(cc.Node)
    public score3: cc.Node = null;

    // 弹窗 node
    @property(cc.Node)
    public popupNode: cc.Node = null;
    // 消息文本
    @property(cc.Label)
    public msg: cc.Label = null;

    /**
     * 初始化
     */
    public init(): void {
        this.scoreNode.active = false;
        this.popupNode.active = false;
    }

    /**
     * 设置分数显示
     * @param score 
     */
    public setScore(score: number): void {
        this.scoreNode.active = true;
        this.popupNode.active = false;

        this.score1.active = score == 1;
        this.score2.active = score == 2;
        this.score3.active = score == 3;
    }

    /**
     * 设置弹窗内容
     * @param msg 
     */
    public setPopup(msg: string): void {
        this.scoreNode.active = false;
        this.popupNode.active = true;

        this.msg.string = msg;
    }
}
