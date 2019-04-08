import BaseController from "../BaseController";
import { UILayer } from "../../define/UILayer";
import DDZResultView from "../../view/ddz/DDZResultView";

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

    }
}
