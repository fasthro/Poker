import DDZ = require("./DDZ");

/*
 * @Author: fasthro
 * @Description: 斗地主本轮逻辑
 * @Date: 2019-04-04 15:07:35
 */

/**
 * 事件回调数据类型
 */
export class DDZEventData {
    public player?: DDZPlayer;
    public cards?: Array<number>;
}

/**
 * 事件回调类型
 */
export type DDZEvent = {
    handler(data: DDZEventData): void;
    context: any;
}

/**
 * 斗地主 - 玩家数据
 */
export class DDZPlayer {

    // 玩家名称
    private readonly _id: number = 0;
    public get id(): number { return this._id; }

    // 玩家名称
    private readonly _name: string = "";
    public get name(): string { return this._name; }

    // 玩家头像
    private readonly _head: string = "";
    public get head(): string { return this._head; }

    // 玩家积分
    private _score: number = 0;
    public get score(): number { return this._score; }
    public set score(value) { this._score = value; }

    // 是否为地主
    private _landlord: boolean = false;
    public get landlord(): boolean { return this._landlord; }
    public set landlord(value) { this._landlord = value; }

    // 手里牌
    private _cards: Array<number> = [];
    public get cards(): Array<number> { return this._cards; }
    public set cards(value) { this._cards = value; }

    // 本轮出的牌
    private _discards: Array<number> = [];
    public get discards(): Array<number> { return this._discards; }
    public set discards(value) { this._discards = value; }

    // 上一轮出的牌
    private _preDiscards: Array<number> = [];
    public get preDiscards(): Array<number> { return this._preDiscards; }
    public set preDiscards(value) { this._preDiscards = value; }

    // 是否为操作方
    private _owner: boolean = false;
    public get owner(): boolean { return this._owner; }
    public set owner(value) { this._owner = value; }

    // event
    // 准备
    public readyEvent: DDZEvent = null;
    // 发牌
    public dealEvent: DDZEvent = null;

    /**
     * 构造方法
     * @param name 名称
     * @param head 头像
     */
    constructor(id: number, name: string, head: string) {
        this._id = id;
        this._name = name;
        this._head = head;

        this._score = 0;
        this._landlord = false;
        this._cards = [];
        this.discards = [];
        this.preDiscards = [];

    }

    /**
     * 准备
     */
    public ready(): void {
        this.callEvent(this.readyEvent);
    }

    /**
     * 发牌
     * @param cards 
     */
    public deal(cards: Array<number>): void {
        this.cards = cards;
        
        let data: DDZEventData = new DDZEventData();
        data.cards = cards;
        this.callEvent(this.dealEvent, data);
    }

    /**
     * 执行事件
     * @param event 
     * @param data 
     */
    private callEvent(event: DDZEvent, data?: DDZEventData): void {
        if (event) {
            if (!data) {
                data = new DDZEventData();
            }
            data.player = this;
            event.handler.call(event.context, data);
        }
    }
}

/**
 * 斗地主 - 本轮数据
 */
export class DDZRound {

    // 玩家X - 左边玩家
    private _playerX: DDZPlayer = null;
    public get playerX(): DDZPlayer { return this._playerX; }
    public set playerX(value) { this._playerX = value; }

    // 玩家Y - 右边玩家
    private _playerY: DDZPlayer = null;
    public get playerY(): DDZPlayer { return this._playerY; }
    public set playerY(value) { this._playerY = value; }

    // 玩家Z - 操作方
    private _playerZ: DDZPlayer = null;
    public get playerZ(): DDZPlayer { return this._playerZ; }
    public set playerZ(value) { this._playerZ = value; }

    // 底牌
    private _cards: Array<number> = [];
    public get cards(): Array<number> { return this._cards; }

    /**
     * 初始化
     */
    public initRound(): void {
        // new player
        this._playerX = new DDZPlayer(1, "x玩家", "");
        this._playerY = new DDZPlayer(2, "y玩家", "");
        this._playerZ = new DDZPlayer(3, "z玩家", "");
        this._playerZ.owner = true;
    }

    /**
     * 绑定准备事件
     */
    public bindReadyEvent(event: DDZEvent): void {
        this._playerX.readyEvent = event;
        this._playerY.readyEvent = event;
        this._playerZ.readyEvent = event;
    }

    /**
     * 准备
     * @param event 
     */
    public ready(): void {
        this._playerX.ready();
        this._playerY.ready();
        this._playerZ.ready();

        // 发牌
        this.deal();
    }

    /**
     * 绑定发牌事件
     */
    public bindDealEvent(event: DDZEvent): void {
        this._playerX.dealEvent = event;
        this._playerY.dealEvent = event;
        this._playerZ.dealEvent = event;
    }

    /**
     * 发牌
     */
    public deal(): void {
        let cards = DDZ.Core.deal();
        // 底牌
        this._cards = cards.w;
        // 玩家牌
        this._playerX.deal(cards.x);
        this._playerY.deal(cards.y);
        this._playerZ.deal(cards.z);
    }
}
