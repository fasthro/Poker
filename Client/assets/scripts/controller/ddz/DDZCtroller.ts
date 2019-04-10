import BaseController from "../BaseController";
import DDZView from "../../view/ddz/DDZView";
import { DDZRound, DDZEvent, DDZEventData } from "../../game/ddz/DDZRound";
import { UILayer } from "../../define/UILayer";
import Game from "../../Game";
import { ControllerType } from "../../define/Controllers";


/*
 * @Author: fasthro
 * @Description: 斗地主
 * @Date: 2019-04-03 15:07:35
 */

export default class DDZCtroller extends BaseController {
    // view
    private _view: DDZView = null;
    // round
    private _round: DDZRound = null;
    public get round(): DDZRound {
        return this._round;
    }

    /**
     * controller create
     * @param name 
     */
    public static create(name: string): IController {
        return new DDZCtroller();
    }

    public initialize(): void {
        super.initialize();
        this.layer = UILayer.Window;
    }

    public onViewCreated(go: any, params: any): void {
        super.onViewCreated(go, params);
        this._view = this.gameObject.getComponent(DDZView);
        this._view.initView(this);

        // 创建 Round
        let breakEvent: DDZEvent = { name: "_onBreakEvent", handler: this._onBreakEvent, context: this };
        let overEvent: DDZEvent = { name: "_onOverEvent", handler: this._onOverEvent, context: this };
        // 创建 Round
        this._round = new DDZRound(2, breakEvent, overEvent);

        // 绑定事件
        // 准备
        this._round.bindReadyEvent({ name: "_onReadyEvent", handler: this._onReadyEvent, context: this });
        // 发牌
        this._round.bindDealEvent({ name: "_onDealEvent", handler: this._onDealEvent, context: this });
        // 选择分数
        this._round.bindChoiceScoreEvent({ name: "_onChoiceScoreEvent", handler: this._onChoiceScoreEvent, context: this });
        // 执行选择分数
        this._round.bindExecuteChoiceScoreEvent({ name: "_onExecuteChoiceScoreEvent", handler: this._onExecuteChoiceScoreEvent, context: this });
        // 产生地主
        this._round.bindCreateLordEvent({ name: "_onCreateLordEvent", handler: this._onCreateLordEvent, context: this });
        // 选择出牌
        this._round.bindChoiceCardEevnt({ name: "_onChoiceCardEevnt", handler: this._onChoiceCardEevnt, context: this });
        // 执行选择出牌
        this._round.bindExecuteChoiceCardEvent({ name: "_onExecuteChoiceCardEvent", handler: this._onExecuteChoiceCardEvent, context: this });

        // 倒计时
        this._round.bindTimeoutEvent({ name: "_onTimeoutEvent", handler: this._onTimeoutEvent, context: this });

        // Round
        this._round.init();
        this._round.ready();
    }

    /**
     * 重新开始游戏
     */
    public restart(): void {
        // Round
        this._view.initView(this);
        this._round.init();
        this._round.ready();
    }

    /**
     * 比赛中止,流局
     * @param data 
     */
    private _onBreakEvent(data: DDZEventData): void {

    }

    /**
     * 比赛结束
     * @param data 
     */
    private _onOverEvent(data: DDZEventData): void {
        Game.showUI(ControllerType.DDZRusult, this._round);
    }

    /**
     * 准备
     * @param data 
     */
    private _onReadyEvent(data: DDZEventData): void {
        // head 设置
        this._view.headX.setHead("");
        this._view.headX.setScore(this._round.playerX.coin);

        this._view.headY.setHead("");
        this._view.headY.setScore(this._round.playerY.coin);

        this._view.headZ.setHead("");
        this._view.headZ.setScore(this._round.playerZ.coin);
    }

    /**
     * 发牌
     * @param data 
     */
    private _onDealEvent(data: DDZEventData): void {
        this._view.setDeal(data.cards);
    }

    /**
     * 选择分数
     * @param data 
     */
    private _onChoiceScoreEvent(data: DDZEventData): void {
        if (this._round.isPlayerX(data.player)) this._view.setChoiceScoreX();
        else if (this._round.isPlayerY(data.player)) this._view.setChoiceScoreY();
        else this._view.setChoiceScoreZ(data.minScore);
    }

    /**
     * 执行选择分数
     * @param data 
     */
    private _onExecuteChoiceScoreEvent(data: DDZEventData): void {
        if (this._round.isPlayerX(data.player)) this._view.setExecuteChoiceScoreX(data.choiceScore);
        else if (this._round.isPlayerY(data.player)) this._view.setExecuteChoiceScoreY(data.choiceScore);
        else this._view.setExecuteChoiceScoreZ(data.choiceScore);
    }

    /**
     * 设置地主
     * @param data 
     */
    private _onCreateLordEvent(data: DDZEventData): void {
        // 显示底牌
        this._view.setWcard(data.wcards);

        // 设置手中牌
        if (data.player.owner) {
            this._view.cards.initCards(data.cards);
            this._view.cards.dequeueCards(data.wcards);
        }

        // 设置地主标志
        if (this._round.isPlayerX(data.player)) this._view.setCreateLordX();
        else if (this._round.isPlayerY(data.player)) this._view.setCreateLordY();
        else this._view.setCreateLordZ();
    }

    /**
     * 选择出牌
     * @param data 
     */
    private _onChoiceCardEevnt(data: DDZEventData): void {
        if (this._round.isPlayerX(data.player)) this._view.setChoiceCardX();
        else if (this._round.isPlayerY(data.player)) this._view.setChoiceCardY();
        else this._view.setChoiceCardZ(true, data.ocards, data.force);
    }

    /**
     * 执行选择出牌
     * @param data 
     */
    private _onExecuteChoiceCardEvent(data: DDZEventData): void {
        if (this._round.isPlayerX(data.player)) this._view.setExecuteChoiceCardX(data.dcards, data.cards);
        else if (this._round.isPlayerY(data.player)) this._view.setExecuteChoiceCardY(data.dcards, data.cards);
        else this._view.setExecuteChoiceCardZ(data.dcards, data.cards);
    }

     /**
     * 倒计时
     * @param data 
     */
    private _onTimeoutEvent(data: DDZEventData): void {
        if (this._round.isPlayerX(data.player)) this._view.setTimeoutX(data.timeout);
        else if (this._round.isPlayerY(data.player)) this._view.setTimeoutY(data.timeout);
        else this._view.setTimeoutZ(data.timeout);
    }

    public update(dt): void {
        if (!this.active)
            return;
    }

    public getResPath(): string {
        return "prefabs/ui/ddz_view";
    }
}
