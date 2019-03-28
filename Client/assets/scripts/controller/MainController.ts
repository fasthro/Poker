import BaseController from "./BaseController";

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
        return cc.find("Canvas");
    }

    getResPath(): string {
        return "prefabs/ui/main_view";
    }

    dispose(): void {

    }
}
