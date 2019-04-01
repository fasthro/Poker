import BaseController from "./BaseController";
import LoadingView from "../view/LoadingView";
import Game from "../Game";
import { UILayer } from "../define/UILayer";

/*
 * @Author: fasthro
 * @Description: loading 界面控制器
 * @Date: 2019-03-28 14:56:48
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingController extends BaseController implements IController {
    // view
    private m_view: LoadingView = null;
    
    /**
     * controller create
     * @param name 
     */
    public static create(name: string): IController {
        return new LoadingController();
    }

    public initialize(): void {
        this.layer = UILayer.Loading;
    }

    public onViewCreated(go: any, params: any): void {
        super.onViewCreated(go, params);

    }

    public getResPath(): string {
        return "prefabs/ui/loading_view";
    }
}
