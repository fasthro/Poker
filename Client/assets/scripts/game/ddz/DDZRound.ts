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
    public timeout?: number;            // 倒计时
    public force?: boolean;             // 强制出牌


    tostring(): string {
        return `
        player:${this.player.name} 
        cards:${this.cards ? this.cards : "null"} 
        wcards:${this.wcards ? this.wcards : "null"} 
        ocards:${this.ocards ? this.ocards : "null"}
        dcards:${this.dcards ? this.dcards : "null"}
        minScore:${this.minScore != null || this.minScore != undefined ? this.minScore : "null"}
        choiceScore:${this.choiceScore != null || this.choiceScore != undefined ? this.choiceScore : "null"}
        timeout:${this.timeout != null || this.timeout != undefined ? this.timeout : "null"}
        force:${this.force ? this.force : "null"}`
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
 * 牌操作状态
 */
const DDZ_STATE = cc.Enum({
    CHOICE_SCORE: 0,
    CHOICE_CARD: 1,
});

// 托管执行时间(秒)
export const AGENT_TIME: number = 200;
// 选择分数时间(秒)
export const CHOICE_SCORE_TIME: number = 1500;
// 第一次选牌时间(秒)
export const FIRST_CHOICE_CARD_TIME: number = 1500;
// 选牌时间(秒)
export const CHOICE_CARD_TIME: number = 1500;

/**
 * 斗地主 - 玩家数据
 */
export class DDZPlayer {

    // round
    private _round: DDZRound = null;

    // 玩家id
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
    private _isLord: boolean = false;
    public get isLord(): boolean { return this._isLord; }

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

    // 连胜次数
    private _winCount: number = 0;
    public get winCount(): number { return this._winCount; }

    // 倒计时
    private _timeout: number = 0;
    // 倒计时handler
    private _timeoutHandler: number = null;

    // 强制出牌标志
    private _isForce: boolean = false;

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
    // 操作计时
    public timeoutEvent: DDZEvent = null;

    /**
     * 构造方法
     * @param name 名称
     * @param head 头像
     */
    constructor(round: DDZRound, id: number, name: string, head: string, coin: number) {
        this._round = round;
        this._id = id;
        this._name = name;
        this._head = head;
        this._coin = coin;
        this._winCount = 0;
    }

    /**
     * 初始化
     * @param owner 是否为操作者
     * @param agent 是否托管
     */
    public init(owner: boolean = false, agent: boolean = false): void {
        this._owner = owner;
        this._agent = agent;
        this._isLord = false;
        this._cards = [];
        this._wcards = [];
        this._dcards = [];
        this._pcards = [];
        this._score = 0;
        this._isForce = false;
    }

    /**
     * 倒计时
     */
    private _setTimeout(timeout: number, state: number): void {
        this._timeout = timeout;

        let data: DDZEventData = new DDZEventData();
        data.timeout = this._timeout;
        this._callEvent(this.timeoutEvent, data);

        let self = this;
        this._clearTimeout();
        this._timeoutHandler = setInterval(() => {
            self._timeout--;
            if (self._timeout < 0) {
                if (state == DDZ_STATE.CHOICE_SCORE) {
                    self._round.executeChoiceScore(self, 0);
                }
                else if (state == DDZ_STATE.CHOICE_CARD) {
                    if (self._isForce) {
                        self._round.executeChoiceCard(self, [self.cards[0]]);
                    }
                    else {
                        self._round.executeChoiceCard(self, []);
                    }
                }
                this._clearTimeout();
            }
            else {
                let data: DDZEventData = new DDZEventData();
                data.timeout = self._timeout;
                self._callEvent(this.timeoutEvent, data);
            }
        }, 1000);
    }

    /**
     * 清空倒计时
     */
    private _clearTimeout(): void {
        if (this._timeoutHandler) clearTimeout(this._timeoutHandler);
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
        this._setTimeout(CHOICE_SCORE_TIME, DDZ_STATE.CHOICE_SCORE);

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

            let self = this;
            setTimeout(() => {
                this._round.executeChoiceScore(self, alternative[DDZ.Utils.random(0, alternative.length - 1)]);
            }, AGENT_TIME * 1000);
        }
    }

    /**
     * 确认选择的分数
     * @param score 抢的分数 0 - 不抢
     */
    public executeChoiceScore(score: number): void {
        this._score = score;

        this._clearTimeout();

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
        this._isLord = true;
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
     * @param ocards 
     * @param force 强制出牌
     */
    public choiceCard(ocards: Array<number>, force: boolean): void {
        this._isForce = force;
        
        this._setTimeout(CHOICE_CARD_TIME, DDZ_STATE.CHOICE_CARD);

        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.ocards = ocards;
        data.force = force;
        this._callEvent(this.choiceCardEvent, data);

        // 托管随机抢
        if (this.agent) {
            let self = this;
            setTimeout(() => {
                if (force) {
                    self._round.executeChoiceCard(self, [self._cards[0]]);
                }
                else {
                    self._round.executeChoiceCard(self, []);
                }
            }, AGENT_TIME * 1000);
        }
    }

    /**
     * 执行选择出牌
     * @param dcards 要出去的牌
     */
    public executeChoiceCard(dcards: Array<number>): void {
        this._isForce = false;
        this._dcards = dcards;

        this._clearTimeout();

        // 移除出去的牌
        for (let i = 0; i < dcards.length; i++) {
            for (let k = 0; k < this.cards.length; k++) {
                if (dcards[i] == this.cards[k]) {
                    this.cards.splice(k, 1);
                    break;
                }
            }
        }

        let data: DDZEventData = new DDZEventData();
        data.player = this;
        data.dcards = DDZ.Core.sortSpecial(dcards);
        data.cards = this.cards;
        this._callEvent(this.executeChoiceCardEvent, data);
    }

    /**
     * 本轮结束
     * @param win 是否胜利
     * @param coin 结算金coin
     */
    public overRound(win: boolean, coin: number): void {
        if (win) {
            this._winCount++;
            this._coin += this._isLord ? coin * 2 : coin;
        }
        else {
            this._winCount = 0;
            this._coin -= this._isLord ? coin * 2 : coin;
            if (this._coin <= 0) this._coin = 0;
        }
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
            if (event.name != "_onTimeoutEvent") {
                console.log(`${this.name} event: ${event.name} data:${data.tostring()}`);
            }
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

    // 底分
    private _score: number = 0;
    public get score(): number { return this._score };

    // 倍数
    private _multiple: number = 0;
    public get multiple(): number { return this._multiple };

    // 本轮开始的玩家
    private _first: DDZPlayer = null;
    // 本轮当前进行的玩家
    private _current: DDZPlayer = null;

    // 事件
    // 重新开始
    private _breakEvent: DDZEvent = null;
    // over
    private _overEvent: DDZEvent = null;

    /**
     * 比赛流局重新开始
     * @param score 底分
     * @param breakEvent 比赛中断流局事件
     * @param overEvent 比赛结束事件
     */
    constructor(score: number, breakEvent: DDZEvent, overEvent: DDZEvent) {
        this._score = score;
        this._breakEvent = breakEvent;
        this._overEvent = overEvent;

        this._playerX = new DDZPlayer(this, 1, "x玩家", "", 1000);
        this._playerY = new DDZPlayer(this, 2, "y玩家", "", 2000);
        this._playerZ = new DDZPlayer(this, 3, "z玩家", "", 3000);
    }

    /**
     * 初始化
     */
    public init(): void {
        this._multiple = 0;
        this._first = null;
        this._current = null;

        this._playerX.init(false, true);
        this._playerY.init(false, true);
        this._playerZ.init(true, false);
    }

    /**
     * 绑定倒计时事件
     * @param event 
     */
    public bindTimeoutEvent(event: DDZEvent): void {
        this._playerX.timeoutEvent = event;
        this._playerY.timeoutEvent = event;
        this._playerZ.timeoutEvent = event;
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
                // 都不叫就流局重新开始
                if (highestPlayer.score == 0) {
                    this._callEvent(this._breakEvent);
                }
                else {
                    this.createLord(highestPlayer);
                }
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

        // 记录倍数
        this._multiple = player.score;

        player.createLord(this.wcards)

        // 选择出牌
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
        // 本轮强制出牌标志
        let force: boolean = false;
        if (!this._first) {
            force = true;
        }
        else {
            // 上下两家都没出牌轮到自己应为强制出牌
            let nextPlayer = this._nextPlayer(player);
            let pretPlayer = this._pretPlayer(player);
            force = nextPlayer.dcards.length == 0 && pretPlayer.dcards.length == 0;
        }

        if (force) {
            this._first = player;
        }
        this._current = player;

        player.choiceCard(cards, force);
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
     * @param dcards 
     */
    public executeChoiceCard(player: DDZPlayer, dcards: Array<number>): void {
        player.executeChoiceCard(dcards);

        // 本轮结束
        if (player.cards.length == 0) {
            this._overRound(player);
        }
        // 下一个玩家选择牌
        else {
            let nextPlayer = this._nextPlayer(player);
            this.choiceCard(nextPlayer, dcards);
        }
    }

    /**
     * 本轮结束
     * @param player 
     */
    private _overRound(player: DDZPlayer): void {
        let coin = this._score * this.multiple;
        player.overRound(true, coin);

        let nextPlayer1 = this._nextPlayer(player);
        let nextPlayer2 = this._nextPlayer(player);

        if (player.isLord) {
            nextPlayer1.overRound(false, coin);
            nextPlayer2.overRound(false, coin);
        }
        else {
            if (nextPlayer1.isLord) {
                nextPlayer1.overRound(false, coin);
            }
            else {
                nextPlayer1.overRound(true, coin);
            }

            if (nextPlayer2.isLord) {
                nextPlayer2.overRound(false, coin);
            }
            else {
                nextPlayer2.overRound(true, coin);
            }
        }

        this._callEvent(this._overEvent);
    }

    /**
     * 执行事件
     * @param event 
     * @param data 
     */
    private _callEvent(event: DDZEvent, data?: DDZEventData): void {
        if (event) {
            console.log(`Round event: ${event.name} data:${data ? data.tostring() : "null"}`);
            event.handler.call(event.context, data);
        }
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
     * 上一个玩家
     * @param player 相对玩家
     */
    private _pretPlayer(player: DDZPlayer): DDZPlayer {
        if (this.isPlayerX(player)) return this.playerY;
        if (this.isPlayerY(player)) return this.playerZ;
        return this.playerX;
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
