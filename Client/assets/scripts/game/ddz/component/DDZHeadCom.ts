/*
 * @Author: fasthro
 * @Description: 斗地主头像组件
 * @Date: 2019-04-05 22:44:10
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("斗地主/HeadCom")
export default class DDZHeadCom extends cc.Component {

    // 头像 Sprite
    @property(cc.Sprite)
    public headSprite: cc.Sprite = null;

    // 积分文本框
    @property(cc.Label)
    public scoreLabel: cc.Label = null;

    // 地主标识
    @property(cc.Node)
    public dzNode: cc.Node = null;

    /**
     * 初始化
     */
    public init(): void {
        // TODO
        // this.headSprite.spriteFrame = null;
        this.scoreLabel.string = "0";
        this.dzNode.active = false;
    }

    /**
     * 设置头像
     * @param head 
     */
    public setHead(head: string): void {
        // TODO
    }

    /**
     * 设置积分
     * @param score 
     */
    public setScore(score: number): void {
        this.scoreLabel.string = score.toString();
    }

    /**
     * 设置地主
     */
    public setDZ(): void {
        this.dzNode.active = true;
    }
}
