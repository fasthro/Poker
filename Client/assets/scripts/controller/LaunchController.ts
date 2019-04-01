import BaseController from "./BaseController";
import Game from "../Game";
import { UILayer } from "../define/UILayer";
import LaunchView from "../view/LaunchView";
import { ControllerType } from "../define/Controllers";
import { SceneType } from "../define/Scenes";

/*
 * @Author: fasthro
 * @Description: 启动界面控制器，负责游戏启动，登录等
 * @Date: 2019-03-28 18:48:01
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class LaunchController extends BaseController {
    // view
    private m_view: LaunchView = null;

    /**
     * controller create
     * @param name 
     */
    public static create(name: string): IController {
        return new LaunchController();
    }

    public initialize(): void {
        this.layer = UILayer.Loading;
    }

    public onViewCreated(go: any, params: any): void {
        super.onViewCreated(go, params);

        this.m_view = this.gameObject.addComponent(LaunchView);

        // 热更新

        // 预加载

        let self = this;

        setTimeout(() => {
            Game.loadScene(SceneType.Login, this, (completedCount: number, totalCount: number, item: any) => {
                self.m_view.progressBar.progress = completedCount / totalCount;
            }, (error) => {
                Game.closeUI(ControllerType.Launch);
                setTimeout(() => {
                    Game.showUI(ControllerType.Main);
                }, 2000);
            });
        }, 3000);

    }

    getResPath(): string {
        return "prefabs/ui/launch_view";
    }
}
