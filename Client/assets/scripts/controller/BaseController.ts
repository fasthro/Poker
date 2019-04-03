import { UILayer } from "../define/UILayer";

/*
 * @Author: fasthro
 * @Description: 控制器基类
 * @Date: 2019-03-28 11:11:56
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseController implements IController {
    // 物体节点
    public gameObject: cc.Node = null;
    // 所在UI层
    public layer: UILayer = UILayer.Window;
    // 是否处于激活状态
    public active: boolean = false;
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

    /**
     * 初始化
     */
    public initialize(): void {
        this.active = false;
    }

    /**
     * 界面创建完成回调
     * @param go 
     */
    public onViewCreated(go: any, params: any): void {
        this.gameObject = go;
        this.active = true;
    }

    /**
     * 获取界面资源路径
     */
    public getResPath(): string {
        return "";
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
        this.active = false;
    }
}
