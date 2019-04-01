import BaseScene from "./BaseScene";
import Game from "../Game";
import { ControllerType } from "../define/Controllers";

/*
 * @Author: fasthro
 * @Description: 初始化场景
 * @Date: 2019-03-29 16:19:03
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class InitScene extends BaseScene {
    
    public static create(name: string): BaseScene {
        return new InitScene();
    }

    /**
     * 场景初始化
     */
    public initialize(): void {

    }

    /**
     * 场景加载完成回调
     */
    public onLoaded(): void {
        Game.showUI(ControllerType.Init);
    }

    /**
     * 退出场景回调
     */
    public onExit(): void {

    }

    /**
     * update
     */
    public update(dt: any): void {

    }

    /**
     * 回收释放
     */
    public dispose(): void {

    }
}
