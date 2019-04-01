import BaseController from "./BaseController";
import Game from "../Game";
import { UILayer } from "../define/UILayer";
import LaunchView from "../view/InitView";

/*
 * @Author: fasthro
 * @Description: 启动界面控制器，负责游戏启动，登录等
 * @Date: 2019-03-28 18:48:01
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class InitController extends BaseController {
    // view
    private m_view: LaunchView = null;

    /**
     * controller create
     * @param name 
     */
    public static create(name: string): IController {
        return new InitController();
    }

    public initialize(): void {
        this.layer = UILayer.Loading;
    }

    public onViewCreated(go: any, params: any): void {
        super.onViewCreated(go, params);
        this.m_view = this.gameObject.addComponent(LaunchView);
    }

    getResPath(): string {
        return "prefabs/ui/init_view";
    }
}
