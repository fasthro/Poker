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
    public cards?: Array<number>;       // 手中牌
    public wcards?: Array<number>;      // 底牌
    public ocards?: Array<number>;      // 对手出的牌
    public dcards?: Array<number>;      // 自己出的牌
    public minScore?: number;           // 可选择的最小分数
    public choiceScore?: number;        // 最终选择的分数

    tostring(): string {
        return `
        player:${this.player.name} 
        cards:${this.cards ? this.cards : "null"} 
        wcards:${this.wcards ? this.wcards : "null"} 
        ocards:${this.ocards ? this.ocards : "null"}
        dcards:${this.dcards ? this.dcards : "null"}
        dcards:${this.minScore ? this.minScore : "null"}
        dcards:${this.choiceScore ? this.choiceScore : "null"}`
    }
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

    // 玩家代币
    private _coin: number = 0;
    public get coin(): number { return this._coin; }
    public set coin(value) { this._coin = value; }

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

    // 出的牌
    private _dcards: Array<number> = [];
    public get dcards(): Array<number> { return this._dcards; }
    public set dcards(value) { this._dcards = value; }

    // 上一轮出的牌
    private _pcards: Array<number> = [];
    public get pcards(): Array<number> { return this._pcards; }
    public set pcards(value) { this._pcards = value; }

    // 选择的分数
    private _score: number = 0;
    public get score(): number { return this._score; }

    // 是否为操作方
    private _owner: boolean = false;
    public get owner(): boolean { return this._owner; }
    public set owner(value) { this._owner = value; }

    // 准备
    public readyEvent: DDZEvent = null;
    // 发牌
    public dealEvent: DDZEvent = null;
    // 选择分数
    public choiceScoreEvent: DDZEvent = null;
    // 执行选择分数
    public executeChoiceScoreEvent: DDZEvent = null;
    // 产生地主
    public createLordEvent: DDZEvent = null;
    // 选择牌
    public choiceCardEvent: DDZEvent = null;
    // 执行选择出牌
    public executeChoiceCardEvent: DDZEvent = null;

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

        this._coin = 0;
        this._landlord = false;
        this._cards = [];
        this._wcards = [];
        this._dcards = [];
        this._pcards = [];
    }

    /**
     * 准备
     */
    public ready(): void {
        if (this.owner) {
            this._callEvent(this.readyEvent);
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
            this._callEvent(this.dealEvent, data);
        }
    }

    /**
     * 选择分数
     * @param minScore 可选择的最小分数
     */
    public choiceScore(minScore: number): void {
        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.minScore = minScore;
        this._callEvent(this.choiceScoreEvent, data);

        // 托管随机抢
        if (this.agent) {
            let alternative: Array<number> = [0];
            for (let i = 1; i < 4; i++) {
                if (i > minScore) alternative.push(i);
            }
            this._round.executeChoiceScore(this, alternative[DDZ.Utils.random(0, alternative.length - 1)]);
        }
    }

    /**
     * 确认选择的分数
     * @param score 抢的分数 0 - 不抢
     */
    public executeChoiceScore(score: number): void {
        this._score = score;

        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.choiceScore = score;
        this._callEvent(this.executeChoiceScoreEvent, data);
    }

    /**
     * 产生地主
     * @param cards 底牌
     */
    public createLord(wcards: Array<number>): void {
        this._wcards = wcards;
        for (let i = 0; i < wcards.length; i++) {
            this.cards.push(wcards[i]);
        }

        this.cards = DDZ.Core.sortNormal(this.cards);

        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.cards = this.cards;
        data.wcards = wcards;
        this._callEvent(this.createLordEvent, data);
    }

    /**
     * 选择出牌
     * @param cards 
     */
    public choiceCard(cards: Array<number>): void {
        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.ocards = cards;
        this._callEvent(this.choiceCardEvent, data);

        // 托管随机抢
        if (this.agent) {
            this._round.executeChoiceCard(this, []);
        }
    }

    /**
     * 执行选择出牌
     * @param cards 要出去的牌
     */
    public executeChoiceCard(cards: Array<number>): void {
        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.dcards = cards;
        this._callEvent(this.executeChoiceCardEvent, data);
    }

    /**
     * 执行事件
     * @param event 
     * @param data 
     */
    private _callEvent(event: DDZEvent, data?: DDZEventData): void {
        if (event) {
            if (!data) {
                data = new DDZEventData();
            }
            data.player = this;
            console.log(`${this.name} event: ${event.name} data:${data.tostring()}`);
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
    private _first: DDZPlayer = null;
    // 本轮当前进行的玩家
    private _current: DDZPlayer = null;

    /**
     * 初始化
     */
    public initRound(): void {
        // new player
        this._playerX = new DDZPlayer(this, 1, "x玩家", "");
        this._playerX.agent = true;
        this._playerX.coin = 1000;

        this._playerY = new DDZPlayer(this, 2, "y玩家", "");
        this._playerY.agent = true;
        this._playerY.coin = 2000;

        this._playerZ = new DDZPlayer(this, 3, "z玩家", "");
        this._playerZ.owner = true;
        this._playerZ.coin = 3000;

        // 清空玩家
        this._first = null;
        this._current = null;
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

        // 开始选择分数-随机玩家
        this.choiceScore(this._randomPlayer(), 1);
    }

    /**
     * 绑定选择分数事件
     * @param event 
     */
    public bindChoiceScoreEvent(event: DDZEvent): void {
        this._playerX.choiceScoreEvent = event;
        this._playerY.choiceScoreEvent = event;
        this._playerZ.choiceScoreEvent = event;
    }

    /**
     * 选择分数
     */
    public choiceScore(player: DDZPlayer, minScore: number): void {
        this._first = player;
        this._current = player;

        // 玩家开始抢
        player.choiceScore(minScore);
    }

    /**
     * 绑定执行选择分数事件
     * @param event 
     */
    public bindExecuteChoiceScoreEvent(event: DDZEvent): void {
        this._playerX.executeChoiceScoreEvent = event;
        this._playerY.executeChoiceScoreEvent = event;
        this._playerZ.executeChoiceScoreEvent = event;
    }

    /**
     * 执行选择分数
     * @param score 
     */
    public executeChoiceScore(player: DDZPlayer, score: number): void {
        player.executeChoiceScore(score);

        // 选择3分直接产生地主
        if (score == 3) {
            this.createLord(player);
        }
        else {
            // 分数最高玩家
            let highestPlayer = this._highestScorePlayer();
            // 下一个玩家
            let nextPlayer = this._nextPlayer(player);
            // 全部抢完，找抢的最高分玩家，且设置成地主
            if (this._isSamePlayer(this._first, nextPlayer)) {
                this.createLord(highestPlayer);
            }
            else {
                // 继续下一个玩家抢地主
                nextPlayer.choiceScore(highestPlayer.score + 1);
            }
        }
    }

    /**
     * 绑定产生地主事件
     * @param event 
     */
    public bindCreateLordEvent(event: DDZEvent): void {
        this._playerX.createLordEvent = event;
        this._playerY.createLordEvent = event;
        this._playerZ.createLordEvent = event;
    }

    /**
     * 产生地主
     */
    public createLord(player: DDZPlayer): void {
        this._first = null;
        this._current = null;

        player.createLord(this.wcards)

        // 先择出牌
        this.choiceCard(player, []);
    }

    /**
     * 绑定选择出牌
     * @param event 
     */
    public bindChoiceCardEevnt(event: DDZEvent): void {
        this._playerX.choiceCardEvent = event;
        this._playerY.choiceCardEvent = event;
        this._playerZ.choiceCardEvent = event;
    }

    /**
     * 选择出牌
     * @param player 操作玩家
     * @param cards 需要镇压的牌
     */
    public choiceCard(player: DDZPlayer, cards: Array<number>): void {
        if (!this._first) this._first = player;
        this._current = player;

        player.choiceCard(cards);
    }

    /**
     * 绑定执行选择出牌
     * @param event 
     */
    public bindExecuteChoiceCardEvent(event: DDZEvent): void {
        this._playerX.executeChoiceCardEvent = event;
        this._playerY.executeChoiceCardEvent = event;
        this._playerZ.executeChoiceCardEvent = event;
    }

    /**
     * 执行选择出牌
     * @param player 
     * @param cards 
     */
    public executeChoiceCard(player: DDZPlayer, cards: Array<number>): void {
        player.executeChoiceCard(cards);

        // 下一个玩家选择牌
        let nextPlayer = this._nextPlayer(player);
        this.choiceCard(nextPlayer, cards);
    }

    /**
     * 选择分数最高的玩家
     */
    private _highestScorePlayer(): DDZPlayer {
        if (this._playerX.score >= this._playerY.score && this._playerX.score >= this._playerZ.score) return this._playerX;
        else if (this._playerY.score >= this._playerX.score && this._playerY.score >= this._playerZ.score) return this._playerY;
        return this._playerZ;
    }

    /**
     * 下一个玩家
     * @param player 相对玩家
     */
    private _nextPlayer(player: DDZPlayer): DDZPlayer {
        if (this.isPlayerX(player)) return this.playerZ;
        if (this.isPlayerY(player)) return this.playerX;
        return this.playerY;
    }

    /**
     * 是否为相同玩家
     * @param player 相对玩家
     */
    private _isSamePlayer(player: DDZPlayer, target: DDZPlayer): boolean {
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
    private _randomPlayer(): DDZPlayer {
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
