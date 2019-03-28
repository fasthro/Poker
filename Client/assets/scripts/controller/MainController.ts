import BaseController from "./BaseController";
import Game from "../Game";
import { UILayer } from "../define/UILayer";

/*
 * @Author: fasthro
 * @Description: 主界面控制器
 * @Date: 2019-03-28 11:11:56
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainCtroller extends BaseController implements IController {
    
    public static create(name: string): IController {
        return new MainCtroller();
    }

    initialize(): void {

    }

    onViewCreated(go: any): void {

    }

    update(dt: any): void {

    }

    getParent(): cc.Node {
        return Game.GetUILayerNode(UILayer.Loading)
    }

    getResPath(): string {
        return "prefabs/ui/main_view";
    }

    dispose(): void {

    }
}
