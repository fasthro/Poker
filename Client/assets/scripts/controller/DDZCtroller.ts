import BaseController from "./BaseController";
import DDZView from "../view/DDZView";
import { UILayer } from "../define/UILayer";
import { DDZRound, DDZEventData } from "../game/ddz/DDZRound";

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
        this._round.bindReadyEvent({ handler: this.onReady, context: this });
        // 发牌
        this._round.bindDealEvent({ handler: this.onDeal, context: this });
        
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
     */
    private onDeal(data: DDZEventData): void {
        if(data.player.owner)
        {
            this._view.cards.initCards(data.cards);
        }
    }
}
