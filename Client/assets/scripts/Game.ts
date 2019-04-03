import ManagerCenter from "./center/ManagerCenter";
import { ManagerType } from "./define/Managers";
import ContrlllerCenter from "./center/ContrlllerCenter";
import { ControllerType } from "./define/Controllers";
import UIManager from "./manager/UIManager";
import ScenceManager from "./manager/ScenceManager";
import BaseController from "./controller/BaseController";
import BaseManager from "./manager/BaseManager";
import BaseScene from "./scence/BaseScene";
import SceneInfos, { SceneType, SceneInfo } from "./define/Scenes";
import SceneCenter from "./center/SceneCenter";
import { GameType, GameInfo } from "./define/Games";
import GameCenter from "./center/GameCenter";

/*
 * @Author: fasthro
 * @Description: 游戏内各种接口集合
 * @Date: 2019-03-27 15:39:35
 */

export default class Game {

    // uiManager
    private static uiMgr: UIManager = null;
    // sceneManager
    private static sceneMgr: ScenceManager = null;

    /**
     * 获取管理器
     * @param t 类型
     */
    public static getManager<T extends BaseManager>(t: ManagerType): T {
        return <T>ManagerCenter.get<T>(t);
    }

    /**
     * 获取控制器
     * @param t 类型
     */
    public static getController<T extends BaseController>(t: ControllerType): T {
        return <T>ContrlllerCenter.get<T>(t);
    }

    /**
     * 获取场景
     * @param t 类型
     */
    public static getScene<T extends BaseScene>(t: SceneType): T {
        return <T>SceneCenter.get<T>(t);
    }

    /**
     * 获取场景信息
     * @param t 类型
     */
    public static getSceneInfo(t: SceneType): SceneInfo {
        return SceneCenter.getSceneInfo(t);
    }

    /**
     * 获取游戏信息
     * @param t 类型
     */
    public static getGameInfo(t: GameType): GameInfo {
        return GameCenter.getGameInfo(t);
    }

    /**
     * 切换场景
     * @param t 
     */
    public static loadScene(t: SceneType, context?: any, onProgress?: (completedCount: number, totalCount: number, item: any) => void, onLoaded?: Function): void {
        if (!Game.sceneMgr)
            Game.sceneMgr = Game.getManager<ScenceManager>(ManagerType.Scence);

        Game.sceneMgr.loadScene(this.getSceneInfo(t).name, context, onProgress, onLoaded);
    }

    /**
     * 进入场景
     * @param t 
     */
    public static enterScene(t: SceneType, customData?: any): void {
        SceneCenter.enter(t, customData);
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
}
