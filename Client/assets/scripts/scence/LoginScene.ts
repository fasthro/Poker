import BaseScene from "./BaseScene";

/*
 * @Author: fasthro
 * @Description: 登录场景
 * @Date: 2019-03-29 16:19:03
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginScene extends BaseScene {
    
    public static create(name: string): BaseScene {
        return new LoginScene();
    }

    public initialize(): void {

    }

    public update(dt: any): void {

    }

    public dispose(): void {

    }
}
