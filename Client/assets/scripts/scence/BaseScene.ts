import { IScene } from "./IScene";

/*
 * @Author: fasthro
 * @Description: 场景基类
 * @Date: 2019-03-29 16:19:03
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BaseScene implements IScene {
    /**
     * 工厂创建管理，必须在子类中重新实现此方法
     * @param name 场景名字
     */
    public static create(name: string): BaseScene {
        console.error(`${name} scene static create method return null!`);
        return null;
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
