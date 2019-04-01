import BaseManager from "./BaseManager";

/*
 * @Author: fasthro
 * @Description: 资源管理
 * @Date: 2019-03-28 10:36:24
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResManager extends BaseManager {
    /**
     * manager create
     * @param name 
     */
    public static create(name: string): BaseManager {
        return new ResManager();
    }

    /**
     * 加载 prefab
     * @param url 资源路径
     * @param callback 回调
     * @param context 上下文
     * @param params 附加参数
     */
    public loadPrefab(url: string, callback: (params: any, prefab: any) => void = null, context: any = null, params: any = null): void {
        if (url == null || url == undefined || url == "") {
            console.error("ResManager -> loadPrefab url = null!");
            return;
        }

        cc.loader.loadRes(url, cc.Prefab, function (error: Error, prefab: any) {
            if (error) {

            }
            else {
                if (callback) {
                    try {
                        callback.call(context, params, prefab);
                    }
                    catch{

                    }
                }
            }
        });
    }

    /**
     * 加载 texture
     * @param url 资源路径
     * @param callback 回调
     * @param context 上下文
     * @param params 附加参数
     */
    public loadTexture(url: string, callback: (params: any, prefab: any) => void = null, context: any = null, params: any = null): void {
        if (url == null || url == undefined || url == "") {
            console.log(url);
            console.error("ResManager -> loadTexture url = null!");
            return;
        }

        cc.loader.loadRes(url, cc.SpriteFrame, function (error: Error, texture: any) {
            if (error) {

            }
            else {
                if (callback) {
                    try {
                        callback.call(context, params, texture);
                    }
                    catch{

                    }
                }
            }
        });
    }

}
