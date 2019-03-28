import ControllerInfos, { ControllerType } from "../define/Controllers";

/*
 * @Author: fasthro
 * @Description: 控制器中心
 * @Date: 2019-03-26 15:58:51
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class ContrlllerCenter {

    // 控制器列表
    private static contrlllers: { [key: string]: IController };

    // 初始化标志
    private static initialized: boolean = false;

    /**
     * 初始化控制器中心服务
     */
    public static initialize(): void {
        this.contrlllers = {};
        
        // 初始化控制器信息
        ControllerInfos.initialize();

        // 添加并初始化控制器
        for(let key in ControllerInfos.infos)
        {
            let info = ControllerInfos.infos[key];
            let contrlller = info.controller.create(info.name);
            contrlller.initialize();
            this.contrlllers[key] = contrlller;
        }

        this.initialized = true;
    }

    /**
     * 获取控制器
     * @param t 类型
     */
    public static getController<T extends IController>(t: ControllerType): T {
        return <T>this.contrlllers[t];
    }

    /**
     * 获取控制器
     * @param t 类型
     */
    public static getControllerByName(t: ControllerType): IController {
        return this.contrlllers[t];
    }

    /**
     * update
     * @param dt 
     */
    public static update(dt): void {
        if(this.initialized)
        {
            for(var key in this.contrlllers) {
                var mgr = this.contrlllers[key];
                if (mgr != null) {
                    mgr.update(dt);
                }
            }
        }
    }
}
