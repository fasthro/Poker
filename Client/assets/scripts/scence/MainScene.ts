import BaseScene from "./BaseScene";

/*
 * @Author: fasthro
 * @Description: 主场景
 * @Date: 2019-03-29 16:19:03
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends BaseScene {
    
    public static create(name: string): BaseScene {
        return new MainScene();
    }

    public initialize(): void {

    }

    public update(dt: any): void {

    }

    public dispose(): void {

    }
}