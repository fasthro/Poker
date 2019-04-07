import BaseController from "./BaseController";
import DDZView from "../view/DDZView";
import { UILayer } from "../define/UILayer";
import { DDZRound, DDZEventData, DDZPlayer } from "../game/ddz/DDZRound";
import DDZ = require("../game/ddz/DDZ");

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
        this._round = new DDZRound();
        // 初始化 Round
        this._round.initRound();

        // 绑定事件
        // 准备
        this._round.bindReadyEvent({ name: "onReady", handler: this.onReadyEvent, context: this });
        // 发牌
        this._round.bindDealEvent({ name: "onDeal", handler: this.onDealEvent, context: this });
        // 开始抢地主
        this._round.bindStartGrabEvent({ name: "onStartGrab", handler: this.onStartGrabEvent, context: this });
        // 开始抢地主
        this._round.bindGrab({ name: "onGrab", handler: this.onGrabEvent, context: this });
        // 设置地主
        this._round.bindSetLandlord({ name: "onSetLandlord", handler: this.onSetLandlordEvent, context: this });

        // Round 准备
        this._round.ready();
    }

    public update(dt): void {
        if (!this.active)
            return;
    }

    public getResPath(): string {
        return "prefabs/ui/ddz_view";
    }

    /**
     * 准备
     * @param data 
     */
    private onReadyEvent(data: DDZEventData): void {
        // 设置头像和积分
        this._view.headX.setHead("");
        this._view.headX.setScore(this._round.playerX.score);
        this._view.headY.setHead("");
        this._view.headY.setScore(this._round.playerY.score);
        this._view.headZ.setHead("");
        this._view.headZ.setScore(this._round.playerZ.score);
    }

    /**
     * 发牌
     * @param data 
     */
    private onDealEvent(data: DDZEventData): void {
        this._view.cards.initCards(data.cards);
    }

    /**
     * 开始抢地主
     * @param data 
     */
    private onStartGrabEvent(data: DDZEventData): void {
        // x 玩家开始抢地主
        if (this._round.isPlayerX(data.player)) {
            this._view.setStartGrabLandlordX();
        }
        // y 玩家开始抢地主
        else if (this._round.isPlayerY(data.player)) {
            this._view.setStartGrabLandlordY();
        }
        // z 玩家开始抢地主
        else {
            this._view.setStartGrabLandlordZ(data.minScore);
        }
    }

    /**
     * 抢地主
     * @param data 
     */
    private onGrabEvent(data: DDZEventData): void {
        // x 玩家抢地主
        if (this._round.isPlayerX(data.player)) {
            this._view.setGrabLandlordX(data.grabScore);
        }
        // y 玩家抢地主
        else if (this._round.isPlayerY(data.player)) {
            this._view.setGrabLandlordY(data.grabScore);
        }
        // z 玩家抢地主
        else {
            this._view.setGrabLandlordZ(data.grabScore);
        }
    }

    /**
     * 玩家操作抢地主按钮
     * @param score 抢的分数
     */
    public onClickGrab(score: number): void {
        this._round.grab(this._round.playerZ, score);
    }

    /**
     * 设置地主
     * @param data 
     */
    private onSetLandlordEvent(data: DDZEventData): void {
        // 显示底牌
        this._view.setWcard(data.wcards);

        // 设置地主标志
        // x 玩家设置地主
        if (this._round.isPlayerX(data.player)) {
            this._view.setLandlordX();
        }
        // y 玩家设置地主
        else if (this._round.isPlayerY(data.player)) {
            this._view.setLandlordY();
        }
        // z 玩家设置地主
        else {
            this._view.setLandlordZ();

            // 显示自己的牌，并且底牌需要出队
            this._view.cards.initCards(data.cards);
            this._view.cards.dequeueCards(data.wcards);
        }
    }
}
