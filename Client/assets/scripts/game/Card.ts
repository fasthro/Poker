/*
 * @Author: fasthro
 * @Description: 牌
 * @Date: 2019-04-03 10:37:41
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Card")
export default class Card extends cc.Component {
    // icon
    private _iconSprite: cc.Sprite = null;
    // mask
    private _maskSprite: cc.Sprite = null;
    // btn
    private _btn: cc.Button = null;

    // cId
    private _cId: number = 0;
    public get cId(): number {
        return this._cId;
    }

    // 是否已经出列
    public isDequeue: boolean = false;
    // 是否为滑动选择状态
    public isSelected: boolean = false;

    public onLoad(): void {
        this._iconSprite = this.node.getChildByName("icon").getComponent(cc.Sprite);
        this._maskSprite = this.node.getChildByName("mask").getComponent(cc.Sprite);
        this._btn = this.node.getComponent(cc.Button);

        this._maskSprite.node.active = false;
    }

    /**
     * 初始化牌
     * @param cId cId
     * @param atlas 图集
     * @param clickHandler 点击事件
     */
    public initCard(cId: number, atlas: cc.SpriteAtlas, clickHandler: cc.Component.EventHandler): void {
        this.isDequeue = false;
        this.isSelected = false;
        this._btn.clickEvents.push(clickHandler);
        this._iconSprite.spriteFrame = atlas.getSpriteFrame(cId.toString());
        this._maskSprite.spriteFrame = atlas.getSpriteFrame(cId.toString());
    }

    /**
     * 显示遮罩
     * @param active 
     */
    public showMask(active: boolean): void {
        this._maskSprite.node.active = active;
    }
}
