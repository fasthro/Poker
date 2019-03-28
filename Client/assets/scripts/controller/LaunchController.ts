import BaseController from "./BaseController";
import Game from "../Game";
import { UILayer } from "../define/UILayer";
import LaunchView from "../view/LaunchView";

/*
 * @Author: fasthro
 * @Description: 启动界面控制器，负责游戏启动，登录等
 * @Date: 2019-03-28 18:48:01
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class LaunchController extends BaseController implements IController {
    // view
    private view: LaunchView = null;

    public static create(name: string): IController {
        return new LaunchController();
    }

    initialize(): void {
        
    }

    onViewCreated(go: any, params: any): void {
        
    }

    update(dt: any): void {
        
    }

    getParent(): cc.Node {
        return Game.GetUILayerNode(UILayer.Loading);
    }

    getResPath(): string {
        return "prefabs/ui/launch_view";
    }

    dispose(): void {
        
    }


}
