import MainScene from "../scence/MainScene";
import BattleScene from "../scence/BattleScene";
import LoginScene from "../scence/LoginScene";

/*
 * @Author: fasthro
 * @Description: 场景类型配置
 * @Date: 2019-04-01 11:26:57
 */

const { ccclass, property } = cc._decorator;

export enum SceneType {
    Login,
    Main,
    Battle,
}

export interface SceneInfo {
    name: string;
    scene: any;
}

@ccclass
export default class SceneInfos {
    // scene infos 
    public static infos: { [key: number]: SceneInfo };

    /**
     * 初始化由Center负责调用
     */
    public static initialize(): void {
        this.infos = {}
        this.infos[SceneType.Login] = { name: "login", scene: LoginScene };
        this.infos[SceneType.Main] = { name: "main", scene: MainScene };
        this.infos[SceneType.Battle] = { name: "battle", scene: BattleScene };
    }

    /**
     * 获取场景名称
     * @param t SceneType
     */
    public static getSceneName(t: SceneType): string {
        return this.infos[t].name;
    }
}