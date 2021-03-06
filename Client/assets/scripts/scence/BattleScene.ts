import BaseScene from "./BaseScene";
import Game from "../Game";
import { ControllerType } from "../define/Controllers";
import { GameType } from "../define/Games";

/*
 * @Author: fasthro
 * @Description: 战斗场景
 * @Date: 2019-03-29 16:19:03
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleScene extends BaseScene {
    
    public static create(name: string): BaseScene {
        return new BattleScene();
    }

    /**
     * 场景初始化
     */
    public initialize(): void {

    }

    /**
     * 场景加载完成回调
     */
    public onLoaded(customData?: any): void {
       Game.showUI(Game.getGameInfo(customData).controllerType);
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