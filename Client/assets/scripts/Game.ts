import ManagerCenter from "./center/ManagerCenter";
import { ManagerType } from "./define/Managers";
import ContrlllerCenter from "./center/ContrlllerCenter";
import { ControllerType } from "./define/Controllers";
import UIManager from "./manager/UIManager";
import MainGame from "./MainGame";
import { UILayer } from "./define/UILayer";
import ScenceManager from "./manager/ScenceManager";

/*
 * @Author: fasthro
 * @Description: 游戏内各种接口集合
 * @Date: 2019-03-27 15:39:35
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game {
    // mainGame
    public static mainGame: MainGame = null;

    // uiManager
    private static uiMgr: UIManager = null;
    // sceneManager
    private static sceneMgr: ScenceManager = null;

    /**
     * 获取管理器
     * @param t 类型
     */
    public static getManager<T extends IManager>(t: ManagerType): T {
        return <T>ManagerCenter.getManager<T>(t);
    }

    /**
     * 获取管理器
     * @param t 类型
     */
    public static getManagerByName(t: ManagerType): IManager {
        return ManagerCenter.getManagerByName(t);
    }

    /**
     * 获取控制器
     * @param t 类型
     */
    public static getController<T extends IController>(t: ControllerType): T {
        return <T>ContrlllerCenter.getController<T>(t);
    }

    /**
     * 获取控制器
     * @param t 类型
     */
    public static getControllerByName(t: ControllerType): IManager {
        return ContrlllerCenter.getControllerByName(t);
    }

    /**
     * 切换场景
     * @param name 
     */
    public static loadScene(name: string, context?: any, onProgress?: (completedCount: number, totalCount: number, item: any) => void, onLoaded?: Function): void {
        if (!Game.sceneMgr)
            Game.sceneMgr = Game.getManager<ScenceManager>(ManagerType.Scence);

        Game.sceneMgr.loadScene(name, context, onProgress, onLoaded);
    }

    /**
     * 显示 UI
     * @param ct 控制器类型
     * @param params 打开UI需要传递的参数
     */
    public static showUI(ct: ControllerType, params: any = null) {
        if (!Game.uiMgr)
            Game.uiMgr = Game.getManager<UIManager>(ManagerType.UI);

        Game.uiMgr.showUI(ct, params);
    }

    /**
     * 关闭 UI
     * @param ct 控制器类型
     */
    public static closeUI(ct: ControllerType): void {
        if (!Game.uiMgr)
            Game.uiMgr = Game.getManager<UIManager>(ManagerType.UI);

        Game.uiMgr.closeUI(ct);
    }

    /**
     * 获取 UILayer Node
     * @param layer UILayer
     */
    public static GetUILayerNode(layer: UILayer) {
        if (layer == UILayer.Window) {
            return Game.mainGame.windowNode;
        }
        else if (layer == UILayer.Popup) {
            return Game.mainGame.popupNode;
        }
        else if (layer == UILayer.Loading) {
            return Game.mainGame.loadingNode;
        }
        else if (layer == UILayer.Wait) {
            return Game.mainGame.waitNode;
        }
        return Game.mainGame.node;
    }
}
