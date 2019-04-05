import Card from "./Card";

/*
 * @Author: fasthro
 * @Description: 牌组件
 * @Date: 2019-04-02 11:19:07
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Game/Cards")
export default class Cards extends cc.Component {
    // 图集
    @property(cc.SpriteAtlas)
    public atlas: cc.SpriteAtlas = null;

    // card perfab
    @property(cc.Prefab)
    public cardPrefab: cc.Prefab = null;

    // 牌的尺寸
    @property(cc.Vec2)
    public cardSize: cc.Vec2 = new cc.Vec2(250, 334);

    // 牌的间距
    @property(cc.Integer)
    public cardSpace: number = 80;

    // 牌弹出的间距
    @property(cc.Integer)
    public cardDequeueSpace: number = 60;

    // 伸展方式 0 中心向两侧, -1 向左, 1 向右
    private _stretch: number = 0;

    // 牌列表
    private _cards: Array<Card> = [];

    // touch
    private _touchEvent: cc.Touch;

    onLoad(): void {
        // this.initCards([2, 3, 4, 5, 6, 7, 8, 9, 10], -1);
    }

    /**
     * 初始化牌
     * @param cards 牌数组
     * @param stretch 伸展方式 0 中心向两侧, -1 向左, 1 向右
     */
    public initCards(cIds: number[], stretch: number = 0): void {
        this._stretch = stretch;
        this._cards = [];

        let count = cIds.length;
        for (let i = 0; i < count; i++) {
            this._cards.push(this.createCard(cIds[i], i, count));
        }
    }

    /**
     * 添加牌
     * @param id 牌id
     * @param index 指定位置 
     */
    public addCard(id: number, index: number): void {
        if (index < 0)
            index = 0;

        if (index > this._cards.length)
            index = this._cards.length;

        let card = this.createCard(id, index, this._cards.length + 1);
        card.node.setSiblingIndex(index);
        this._cards.splice(index, 0, card);
        this.updatePosition();
    }

    /**
     * 获取已经出队的牌列表
     * @return Array<number>
     */
    public getDequeueCards(): any {
        let cards: Array<number> = [];
        let count = this._cards.length;
        for (let i = 0; i < count; i++) {
            let card: Card = this._cards[i];
            if (card.isDequeue) {
                cards.push(card.cId);
            }
        }
        return cards;
    }

    /**
     * 创建牌
     * @param cId 
     * @param index 
     * @param total 
     */
    private createCard(cId: number, index: number, total: number): Card {
        let cardNode: cc.Node = cc.instantiate(this.cardPrefab);
        cardNode.name = cId.toString();
        this.node.addChild(cardNode);
        cardNode.setPosition(this.getCardPosition(index, total, false));

        let card: Card = cardNode.getComponent("Card");

        // click
        let clickHandler = new cc.Component.EventHandler();
        clickHandler.component = "Cards";
        clickHandler.target = this.node;
        clickHandler.handler = "onCardClick";
        clickHandler.customEventData = index.toString();

        // touch event
        cardNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        cardNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        cardNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        cardNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        // init
        card.initCard(cId, this.atlas, clickHandler);

        return card;
    }

    /**
     * 刷新牌坐标
     * @param isReset 是否重置
     */
    public updatePosition(isReset?: boolean): void {
        let count = this._cards.length;
        for (let i = 0; i < count; i++) {
            let card: Card = this._cards[i];
            let isDequeue = isReset ? false : card.isDequeue;
            card.node.setPosition(this.getCardPosition(i, count, isDequeue));
        }
    }

    /**
     * 获取牌的坐标
     * @param index 牌的索引
     * @param total 总牌数
     * @param isDequeue 是否已经出列
     */
    private getCardPosition(index: number, total: number, isDequeue: boolean): cc.Vec2 {
        let totalWidth = this.cardSpace * total + this.cardSize.x - this.cardSpace;
        let x: number = 0;
        if (this._stretch == 0) {
            x = index * this.cardSpace - totalWidth / 2;
        }
        else if (this._stretch == 1) {
            x = index * this.cardSpace;
        }
        else if (this._stretch == -1) {
            x = index * this.cardSpace - totalWidth;
        }
        let y = isDequeue ? this.cardDequeueSpace : 0;
        return new cc.Vec2(x, y);
    }

    /**
     * 是否为相同 touch
     * @param touch 
     */
    private getSameTouch(touch: cc.Touch): boolean {
        if (this._touchEvent) {
            return this._touchEvent.getID() == touch.getID();
        }
        return false;
    }

    /**
     * 单张牌点击事件回调
     * @param event 
     * @param customEventData 弹出的间距
     */
    private onCardClick(event, customEventData): void {
        let index: number = parseInt(customEventData);
        let card: Card = this._cards[index];
        card.isDequeue = !card.isDequeue;
        card.node.setPosition(this.getCardPosition(index, this._cards.length, card.isDequeue));
    }

    /**
     * touch start
     * @param event 
     */
    private onTouchStart(event): void {
        if (!this._touchEvent) {

            this._touchEvent = event.touch;

            let count = this._cards.length - 1;
            for (let i = count; i >= 0; i--) {
                let card: Card = this._cards[i];
                let rect: cc.Rect = card.node.getBoundingBoxToWorld();
                rect.width = this.cardSize.x;
                if (rect.contains(event.touch.getLocation())) {
                    card.showMask(true);
                    break;
                }
            }
        }
    }

    /**
     * touch move
     * @param event 
     */
    private onTouchMove(event): void {
        if (this.getSameTouch(event.touch)) {
            let w = event.touch.getStartLocation().x - event.touch.getLocation().x;
            let h = this.cardSize.y + this.cardSpace + 2;
            let x = w > 0 ? event.touch.getLocation().x : event.touch.getStartLocation().x;
            let y = -1;
            let rect: cc.Rect = new cc.Rect(x, y, Math.abs(w), h);
            let count = this._cards.length - 1;
            for (let i = count; i >= 0; i--) {
                let card: Card = this._cards[i];
                let rt = card.node.getBoundingBoxToWorld();
                if (i != count) {
                    rt.width = this.cardSpace;
                }
                card.isSelected = rect.intersects(rt)
                card.showMask(card.isSelected);
            }
        }
    }

    /**
     * touch cancel
     * @param event 
     */
    private onTouchCancel(event): void {
        this.onTouchEnd(event);
    }

    /**
     * touch end
     * @param event 
     */
    private onTouchEnd(event): void {
        if (this.getSameTouch(event.touch)) {
            let unDequeue: boolean = true;
            let cards: { [key: number]: Card } = {};
            for (let i = 0; i < this._cards.length; i++) {
                let card: Card = this._cards[i];
                if (card.isSelected) {
                    cards[i] = card;
                    if (!card.isDequeue && unDequeue) {
                        unDequeue = false;
                    }
                }
            }

            for (let i = 0; i < this._cards.length; i++) {
                let card = cards[i];
                if (card) {
                    card.showMask(false);
                    card.isDequeue = !unDequeue;
                    card.isSelected = false;
                    card.node.setPosition(this.getCardPosition(i, this._cards.length, card.isDequeue));
                }
            }

            this._touchEvent = null;
        }
    }
}

