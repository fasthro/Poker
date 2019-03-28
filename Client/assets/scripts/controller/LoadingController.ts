import BaseController from "./BaseController";
import LoadingView from "../view/LoadingView";

/*
 * @Author: fasthro
 * @Description: loading 界面控制器
 * @Date: 2019-03-28 14:56:48
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingController extends BaseController implements IController {
    // view
    private view: LoadingView = null;

    public static create(name: string): IController {
        return new LoadingController();
    }

    initialize(): void {

    }

    onViewCreated(go: any): void {
        this.gameObject = go;
        this.view = this.gameObject.addComponent(LoadingView);
    }

    update(dt: any): void {

    }

    getParent(): cc.Node {
        return cc.find("Canvas");
    }

    getResPath(): string {
        return "prefabs/ui/loading_view";
    }

    dispose(): void {

    }
}
