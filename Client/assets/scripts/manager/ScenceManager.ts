import BaseManager from "./BaseManager";

/*
 * @Author: fasthro
 * @Description: 场景管理器
 * @Date: 2019-03-28 18:36:11
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScenceManager extends BaseManager {
    // 当前场景名字
    private m_sceneName: string = "empty";

    /**
     * manager create
     * @param name 
     */
    public static create(name: string): BaseManager {
        return new ScenceManager();
    }

    /**
     * 加载场景
     * @param name 场景名称
     * @param context 上下文
     * @param onProgress 加载进度回调
     * @param onLoaded 加载完成回调
     */
    public loadScene(name: string, context?:any, onProgress?: (completedCount: number, totalCount: number, item: any) => void, onLoaded?: Function): void {
        this.m_sceneName = name;
        let self = this;
        // 预加载场景
        cc.director.preloadScene(name, (completedCount: number, totalCount: number, item: any) => {
            console.log(`ScenceManager -> progress: ${completedCount} ${totalCount}`);
            onProgress.call(context, completedCount, totalCount, item);
        }, (error: Error, asset: cc.SceneAsset) => {
            cc.director.loadScene(self.m_sceneName, (error) => {
                console.log(cc.director.getScene().name);
                onLoaded.call(context, error);
            });
       });
    }
}
