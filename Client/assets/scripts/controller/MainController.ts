import BaseController from "./BaseController";
import Game from "../Game";
import { UILayer } from "../define/UILayer";
import MainView from "../view/MainView";

/*
 * @Author: fasthro
 * @Description: 主界面控制器
 * @Date: 2019-03-28 11:11:56
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainCtroller extends BaseController {
    // view
    private m_view: MainView = null;
    
    /**
     * controller create
     * @param name 
     */
    public static create(name: string): IController {
        return new MainCtroller();
    }

    public initialize(): void {
        this.layer = UILayer.Window;
    }

    public onViewCreated(go: any, params: any): void {
        super.onViewCreated(go, params);

    }

    public getResPath(): string {
        return "prefabs/ui/main_view";
    }
}
