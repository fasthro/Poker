import BaseController from "./BaseController";
import DDZView from "../view/DDZView";
import { UILayer } from "../define/UILayer";
import { DDZRound, DDZEventData, DDZPlayer } from "../game/ddz/DDZRound";

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
        this._view.initView();

        // 创建 Round
        this._round = new DDZRound();
        // 初始化 Round
        this._round.initRound();

        // 绑定事件
        // 准备
        this._round.bindReadyEvent({ name: "onReady", handler: this.onReady, context: this });
        // 发牌
        this._round.bindDealEvent({ name: "onDeal", handler: this.onDeal, context: this });
        // 开始抢地主
        this._round.bindStartGrabLandlord({ name: "onStartGrabLandlord", handler: this.onStartGrabLandlord, context: this });
        // 开始抢地主
        this._round.bindGrabLandlord({ name: "onGrabLandlord", handler: this.onGrabLandlord, context: this });

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
    private onReady(data: DDZEventData): void {
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
    private onDeal(data: DDZEventData): void {
        if (data.player.owner) {
            this._view.cards.initCards(data.cards);
        }
    }

    /**
     * 开始抢地主
     * @param data 
     */
    private onStartGrabLandlord(data: DDZEventData): void {
        // x 玩家抢地主
        if (this._round.isPlayerX(data.targetPlayer)) {
            this._view.setStartGrabLandlordX();
        }
        // y 玩家抢地主
        else if (this._round.isPlayerY(data.targetPlayer)) {
            this._view.setStartGrabLandlordY();
        }
        // z 玩家抢地主
        else {
            this._view.setStartGrabLandlordZ(data.score);
        }
    }

    /**
     * 抢地主
     * @param data 
     */
    private onGrabLandlord(data: DDZEventData): void {
        // x 玩家抢地主
        if (this._round.isPlayerX(data.targetPlayer)) {
            this._view.setGrabLandlordX(data.score);
        }
        // y 玩家抢地主
        else if (this._round.isPlayerY(data.targetPlayer)) {
            this._view.setGrabLandlordY(data.score);
        }
        // z 玩家抢地主
        else {
            this._view.setGrabLandlordZ(data.score);
        }
    }
}
