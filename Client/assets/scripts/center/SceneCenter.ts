import SceneInfos, { SceneType, SceneInfo } from "../define/Scenes";
import BaseScene from "../scence/BaseScene";
import Game from "../Game";

/*
 * @Author: fasthro
 * @Description: 场景中心服务
 * @Date: 2019-04-01 11:12:53
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneCenter {

    // 管理器列表
    private static scenes: { [key: string]: BaseScene };
    // 上一个进入的场景
    private static lastEnterScene: BaseScene = null;
    // 初始化标志
    private static initialized: boolean = false;

    /**
     * 初始化管理器中心服务
     */
    public static initialize(): void {
        this.scenes = {};

        // 初始化管理信息
        SceneInfos.initialize();

        // 添加并初始化场景
        for (let key in SceneInfos.infos) {
            let info = SceneInfos.infos[key];
            let scene = info.scene.create(info.name);
            scene.initialize();

            this.scenes[key] = scene;
        }

        this.initialized = true;
    }

    /**
    * 获取管理器
    * @param t 类型
    */
    public static get<T extends BaseScene>(t: SceneType): T {
        return <T>this.scenes[t];
    }

    public static getSceneInfo(t: SceneType): SceneInfo{
        return SceneInfos.getSceneInfo(t);
    }

    /**
     * 进入场景
     * @param t 
     */
    public static enter(t: SceneType, customData?: any): void {
        let scene: BaseScene = this.get<BaseScene>(t);
        Game.loadScene(t, this, (completedCount: number, totalCount: number, item: any) => {

        }, (error) => {
            if(this.lastEnterScene)
            {
                this.lastEnterScene.onExit();
            }
            scene.onLoaded(customData);
        });
    }

    /**
     * update
     * @param dt 
     */
    public static update(dt): void {
        if (this.initialized) {
            for (var key in this.scenes) {
                var scene = this.scenes[key];
                if (scene != null) {
                    scene.update(dt);
                }
            }
        }
    }
}
