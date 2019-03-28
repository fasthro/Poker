import ManagerCenter from "./center/ManagerCenter";
import { ManagerType } from "./define/Managers";
import ContrlllerCenter from "./center/ContrlllerCenter";
import { ControllerType } from "./define/Controllers";
import UIManager from "./manager/UIManager";
import MainGame from "./MainGame";
import { UILayer } from "./define/UILayer";

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

    // uimanager
    private static m_uiMgr: UIManager = null;

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
     * 显示 UI
     * @param ct 控制器类型
     * @param params 打开UI需要传递的参数
     */
    public static showUI(ct: ControllerType, params: any = null) {
        if (!Game.m_uiMgr)
            Game.m_uiMgr = Game.getManager<UIManager>(ManagerType.UI);

        Game.m_uiMgr.showUI(ct, params);
    }

    /**
     * 关闭 UI
     * @param ct 控制器类型
     */
    public static closeUI(ct: ControllerType): void {

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
