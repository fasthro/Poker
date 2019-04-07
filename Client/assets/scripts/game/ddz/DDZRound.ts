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
    public player?: DDZPlayer;          // 事件执行玩家
    public cards?: Array<number>;       // 牌
    public wcards?: Array<number>;      // 底牌
    public minScore?: number;           // 抢地主最小可抢分数
    public grabScore?: number;          // 抢地主抢的分数
}

/**
 * 事件回调类型
 */
export type DDZEvent = {
    name?: string;
    handler(data: DDZEventData): void;
    context: any;
}

/**
 * 斗地主 - 玩家数据
 */
export class DDZPlayer {
    // round
    private _round: DDZRound = null;

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

    // 是否托管代理
    private _agent: boolean = false;
    public get agent(): boolean { return this._agent; }
    public set agent(value) { this._agent = value; }

    // 手里牌
    private _cards: Array<number> = [];
    public get cards(): Array<number> { return this._cards; }
    public set cards(value) { this._cards = value; }

    // 底牌
    private _wcards: Array<number> = [];
    public get wcards(): Array<number> { return this._wcards; }

    // 本轮出的牌
    private _discards: Array<number> = [];
    public get discards(): Array<number> { return this._discards; }
    public set discards(value) { this._discards = value; }

    // 抢地主分数
    private _grabScore: number = 0;
    public get grabScore(): number { return this._grabScore; }

    // 上一轮出的牌
    private _preDiscards: Array<number> = [];
    public get preDiscards(): Array<number> { return this._preDiscards; }
    public set preDiscards(value) { this._preDiscards = value; }

    // 是否为操作方
    private _owner: boolean = false;
    public get owner(): boolean { return this._owner; }
    public set owner(value) { this._owner = value; }

    // 准备
    public readyEvent: DDZEvent = null;
    // 发牌
    public dealEvent: DDZEvent = null;
    // 开始抢地主
    public startGrabEvent: DDZEvent = null;
    // 抢地主
    public grabEvent: DDZEvent = null;
    // 设置地主
    public setLandlordEvent: DDZEvent = null;

    /**
     * 构造方法
     * @param name 名称
     * @param head 头像
     */
    constructor(round: DDZRound, id: number, name: string, head: string) {
        this._round = round;
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
        if (this.owner) {
            this.callEvent(this.readyEvent);
        }
    }

    /**
     * 发牌
     * @param cards 
     */
    public deal(cards: Array<number>): void {
        this.cards = DDZ.Core.sortNormal(cards);
        if (this.owner) {
            let data: DDZEventData = new DDZEventData();
            data.cards = this.cards;
            this.callEvent(this.dealEvent, data);
        }
    }

    /**
     * 开始抢地主
     * @param target 可抢最小分数
     */
    public startGrabLandlord(minScore: number): void {
        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.minScore = minScore;
        this.callEvent(this.startGrabEvent, data);

        // 托管随机抢
        if (this.agent) {
            let alternative: Array<number> = [0];
            for (let i = 1; i < 4; i++) {
                if (i > minScore) alternative.push(i);
            }
            this._round.grab(this, alternative[DDZ.Utils.random(0, alternative.length - 1)]);
        }
    }

    /**
     * 抢地主
     * @param target 目标玩家
     * @param grabScore 抢的分数 0 - 不抢
     */
    public grabLandlord(grabScore: number): void {
        console.log(`${this.name} 抢 ${grabScore} 分`);
        this._grabScore = grabScore;

        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.grabScore = grabScore;
        this.callEvent(this.grabEvent, data);
    }

    /**
     * 设置为地主
     * @param cards 底牌
     */
    public setLandlord(wcards: Array<number>): void {
        this._wcards = wcards;
        for (let i = 0; i < wcards.length; i++) {
            this.cards.push(wcards[i]);
        }

        this.cards = DDZ.Core.sortNormal(this.cards);

        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.cards = this.cards;
        data.wcards = wcards;
        this.callEvent(this.setLandlordEvent, data);
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
            console.log(`${this.name} event: ${event.name}`);
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
    private _wcards: Array<number> = [];
    public get wcards(): Array<number> { return this._wcards; }

    // 本轮开始的玩家
    private _startPlayer: DDZPlayer = null;
    public get startPlayer(): DDZPlayer { return this._startPlayer; }

    // 本轮当前进行的玩家
    private _targetPlayer: DDZPlayer = null;
    public get targetPlayer(): DDZPlayer { return this._startPlayer; }

    /**
     * 初始化
     */
    public initRound(): void {
        // new player
        this._playerX = new DDZPlayer(this, 1, "x玩家", "");
        this._playerX.agent = true;

        this._playerY = new DDZPlayer(this, 2, "y玩家", "");
        this._playerY.agent = true;

        this._playerZ = new DDZPlayer(this, 3, "z玩家", "");
        this._playerZ.owner = true;

        // 清空玩家
        this._startPlayer = null;
        this._targetPlayer = null;
    }

    /**
     * 绑定准备事件
     * @param event 
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
     * @param event 
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
        this._wcards = cards.w;
        // 玩家发牌
        this._playerX.deal(cards.x);
        this._playerY.deal(cards.y);
        this._playerZ.deal(cards.z);
        
        // 开始抢地主
        this.startGrab();
    }

    /**
     * 绑定开始抢地主事件
     * @param event 
     */
    public bindStartGrabEvent(event: DDZEvent): void {
        this._playerX.startGrabEvent = event;
        this._playerY.startGrabEvent = event;
        this._playerZ.startGrabEvent = event;
    }

    /**
     * 开始抢地主
     */
    public startGrab(): void {
        // 随机一名玩家
        let player = this.randomPlayer();

        // 设置进行操作的玩家
        this._startPlayer = player;
        this._targetPlayer = player;

        // 玩家开始抢
        player.startGrabLandlord(1);
    }

    /**
     * 绑定抢地主事件
     * @param event 
     */
    public bindGrab(event: DDZEvent): void {
        this._playerX.grabEvent = event;
        this._playerY.grabEvent = event;
        this._playerZ.grabEvent = event;
    }

    /**
     * 执行抢地主
     * @param score 
     */
    public grab(player: DDZPlayer, score: number): void {
        player.grabLandlord(score);

        // 抢到3分直接设置地主
        if (score == 3) {
            player.setLandlord(this.wcards)
        }
        else {
            // 分数最高玩家
            let highestScorePlayer: DDZPlayer = null;
            if (this._playerX.grabScore >= this._playerY.grabScore && this._playerX.grabScore >= this._playerZ.grabScore) {
                highestScorePlayer = this._playerX;
            }
            else if (this._playerY.grabScore >= this._playerX.grabScore && this._playerY.grabScore >= this._playerZ.grabScore) {
                highestScorePlayer = this._playerY;
            }
            else {
                highestScorePlayer = this._playerZ;
            }
            
            let nextPlayer = this.nextPlayer(player);
            // 全部抢完，找抢的最高分玩家，且设置成地主
            if (this.isSamePlayer(this.startPlayer, nextPlayer)) {
                player.setLandlord(this.wcards)
            }
            // 继续下一个玩家抢地主
            else {
                nextPlayer.startGrabLandlord(highestScorePlayer.grabScore + 1);
            }
        }
    }

    /**
     * 绑定抢地主事件
     * @param event 
     */
    public bindSetLandlord(event: DDZEvent): void {
        this._playerX.setLandlordEvent = event;
        this._playerY.setLandlordEvent = event;
        this._playerZ.setLandlordEvent = event;
    }

    /**
     * 下一个玩家
     * @param player 相对玩家
     */
    public nextPlayer(player: DDZPlayer): DDZPlayer {
        if (this.isPlayerX(player)) return this.playerZ;
        if (this.isPlayerY(player)) return this.playerX;
        return this.playerY;
    }

    /**
     * 是否为相同玩家
     * @param player 相对玩家
     */
    public isSamePlayer(player: DDZPlayer, target: DDZPlayer): boolean {
        return player.id == target.id;
    }

    /**
     * 是否为X玩家
     * @param player 
     */
    public isPlayerX(player: DDZPlayer): boolean {
        return player.id == this.playerX.id;
    }

    /**
     * 是否为Y玩家
     * @param player 
     */
    public isPlayerY(player: DDZPlayer): boolean {
        return player.id == this.playerY.id;
    }

    /**
     * 是否为Z玩家
     * @param player 
     */
    public isPlayerZ(player: DDZPlayer): boolean {
        return player.id == this.playerZ.id;
    }

    /**
     * 随机玩家
     * @returns 返回随机的玩家
     */
    private randomPlayer(): DDZPlayer {
        let tryCount = 8;
        let players: Array<DDZPlayer> = [this.playerX, this.playerY, this.playerZ];
        for (let i = 0; i < players.length; i++) {
            let r = DDZ.Utils.random(i, players.length - 1);
            let temp = players[i];
            players[i] = players[r];
            players[r] = temp;
        }
        return players[0];
    }
}
