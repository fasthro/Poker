/*
 * @Author: fasthro
 * @Description: Manager 基类
 * @Date: 2019-03-28 10:54:12
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BaseManager implements IManager {
    
    /**
     * 工厂创建管理，必须在子类中重新实现此方法
     * @param name 管理名字
     */
    public static create(name: string): BaseManager {
        console.error(`${name} manager static create method return null!`);
        return null;
    }

    /**
     * 管理器初始化
     */
    public initialize(): void {

    }

    /**
     * update
     * @param dt 
     */
    public update(dt: any): void {

    }

    /**
     * 回收释放
     */
    public dispose(): void {

    }
 
}
