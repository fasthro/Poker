import DDZHeadCom from "../game/ddz/component/DDZHeadCom";
import Cards from "../game/Cards";

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

    // 操作按钮
    // 不出
    @property(cc.Button)
    public btnPass: cc.Button = null;
    // 提示
    @property(cc.Button)
    public btnHint: cc.Button = null;
    // 出牌
    @property(cc.Button)
    public btnDiscard: cc.Button = null;

    onLoad() {
        // 牌组件
        if (!this.cards) this.cards = this.node.getChildByName("cards").getComponent(Cards);

        // 头像
        if (!this.headX) this.headX = this.node.getChildByName("head_x").getComponent(DDZHeadCom);
        if (!this.headY) this.headY = this.node.getChildByName("head_y").getComponent(DDZHeadCom);
        if (!this.headZ) this.headZ = this.node.getChildByName("head_z").getComponent(DDZHeadCom);

        // 操作按钮
        if (!this.btnPass) this.btnPass = this.node.getChildByName("btn_pass").getComponent(cc.Button);
        if (!this.btnHint) this.btnHint = this.node.getChildByName("btn_hint").getComponent(cc.Button);
        if (!this.btnDiscard) this.btnDiscard = this.node.getChildByName("btn_discard").getComponent(cc.Button);
    }

    /**
     * 初始化 view
     */
    public initView(): void {
        this.cards.initCards([]);
        this.headX.initHead();
        this.headY.initHead();
        this.headZ.initHead();
        this.btnPass.node.active = false;
        this.btnHint.node.active = false;
        this.btnDiscard.node.active = false;
    }
}
