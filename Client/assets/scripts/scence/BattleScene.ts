import BaseScene from "./BaseScene";

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

    public initialize(): void {

    }

    public update(dt: any): void {

    }

    public dispose(): void {

    }
}