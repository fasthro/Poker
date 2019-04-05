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
    public head: cc.Sprite = null;

    // 积分文本框
    @property(cc.Label)
    public score: cc.Label = null;

    /**
     * 初始化
     */
    public initHead(): void {
        // TODO
        // this.head.spriteFrame = null;
        this.score.string = "0";
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
        this.score.string = score.toString();
    }
}
