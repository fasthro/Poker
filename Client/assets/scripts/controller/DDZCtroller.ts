import BaseController from "./BaseController";
import DDZView from "../view/DDZView";
import { UILayer } from "../define/UILayer";

/*
 * @Author: fasthro
 * @Description: 斗地主
 * @Date: 2019-04-03 15:07:35
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class DDZCtroller extends BaseController {
    // view
    private _view: DDZView = null;

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
        this._view = this.gameObject.addComponent(DDZView);

    }

    public update(dt): void {
        if (!this.active)
            return;
    }

    public getResPath(): string {
        return "prefabs/ui/ddz/ddz_view";
    }
}
