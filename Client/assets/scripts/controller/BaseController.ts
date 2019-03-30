/*
 * @Author: fasthro
 * @Description: 控制器基类
 * @Date: 2019-03-28 11:11:56
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseController {
    // 物体节点
    public gameObject: cc.Node = null;
    // 是否可销毁
    public canDestroy: boolean = true;

    /**
     * 工厂创建控制器,必须在子类中实现创建的方法
     * @param name 控制器名称
     */
    public static create(name: string): IController {
        console.error(`${name} controller static create method return null!`);
        return null;
    }

    getBase(): BaseController {
        return this;
    }
}
