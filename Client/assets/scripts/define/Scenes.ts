import MainScene from "../scence/MainScene";
import BattleScene from "../scence/BattleScene";
import InitScene from "../scence/InitScene";

/*
 * @Author: fasthro
 * @Description: 场景类型配置
 * @Date: 2019-04-01 11:26:57
 */

export enum SceneType {
    Init,
    Main,
    Battle,
}

export interface SceneInfo {
    name: string;
    scene: any;
}

export default class SceneInfos {
    // scene infos 
    public static infos: { [key: number]: SceneInfo };

    /**
     * 初始化由Center负责调用
     */
    public static initialize(): void {
        this.infos = {}
        this.infos[SceneType.Init] = { name: "init", scene: InitScene };
        this.infos[SceneType.Main] = { name: "main", scene: MainScene };
        this.infos[SceneType.Battle] = { name: "battle", scene: BattleScene };
    }

    /**
     * 获取场景信息
     * @param t SceneType
     */
    public static getSceneInfo(t: SceneType): SceneInfo {
        return this.infos[t];
    }
}