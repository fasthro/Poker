import BaseController from "./BaseController";
import { UILayer } from "../define/UILayer";
import LaunchView from "../view/InitView";
import InitView from "../view/InitView";
import Game from "../Game";
import { SceneType } from "../define/Scenes";
import { GameType } from "../define/Games";
import { ControllerType } from "../define/Controllers";

/*
 * @Author: fasthro
 * @Description: 启动界面控制器，负责游戏启动，登录等
 * @Date: 2019-03-28 18:48:01
 */

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
        super.initialize();
        this.layer = UILayer.Loading;
    }

    public onViewCreated(go: any, params: any): void {
        super.onViewCreated(go, params);
        this.m_view = this.gameObject.addComponent(InitView);

        setTimeout(()=>{
            // 关闭初始化界面
            Game.closeUI(ControllerType.Init);
        
            Game.enterScene(SceneType.Battle, GameType.DDZ);
        }, 2000);
    }

    public update(dt): void {
        if(!this.active)
            return;

        this.m_view.progressBar.progress += 0.05;
    }

    public getResPath(): string {
        return "prefabs/ui/init_view";
    }
}
