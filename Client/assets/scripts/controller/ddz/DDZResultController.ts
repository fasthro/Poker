import BaseController from "../BaseController";
import { UILayer } from "../../define/UILayer";
import DDZResultView from "../../view/ddz/DDZResultView";
import { DDZRound } from "../../game/ddz/DDZRound";

/*
 * @Author: fasthro
 * @Description: 斗地主结果
 * @Date: 2019-04-08 17:45:18
 */

export default class DDZResultController extends BaseController {
    // view
    private _view: DDZResultView = null;

    /**
     * controller create
     * @param name 
     */
    public static create(name: string): IController {
        return new DDZResultController();
    }

    public getResPath(): string {
        return "prefabs/ui/ddzResult_view";
    }

    public initialize(): void {
        super.initialize();
        this.layer = UILayer.Window;
    }

    public onViewCreated(go: any, params: any): void {
        super.onViewCreated(go, params);
        this._view = this.gameObject.getComponent(DDZResultView);

        let round = <DDZRound>params;

        this._view.winNode.active = round.playerZ.cards.length == 0;
        this._view.loseNode.active = round.playerZ.cards.length != 0;

        this._view.setItemX(round.playerX.name, round.playerX.isLord, round.playerX.winCount > 0, round.score, round.multiple);
        this._view.setItemY(round.playerY.name, round.playerY.isLord, round.playerY.winCount > 0, round.score, round.multiple);
        this._view.setItemZ(round.playerZ.name, round.playerZ.isLord, round.playerZ.winCount > 0, round.score, round.multiple);
    }
}
