import UIManager from "../manager/UIManager";
import NetworkManager from "../manager/NetworkManager";
import ManagerInfos, { ManagerType } from "../define/Managers";
import BaseManager from "../manager/BaseManager";

/*
 * @Author: fasthro
 * @Description: 管理器中心
 * @Date: 2019-03-26 15:58:51
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class ManagerCenter {

    // 管理器列表
    private static managers: { [key: string]: BaseManager };

    // 初始化标志
    private static initialized: boolean = false;

    /**
     * 初始化管理器中心服务
     */
    public static initialize(): void {
        this.managers = {};
        
        // 初始化管理信息
        ManagerInfos.initialize();

        // 添加并初始化管理器
        for(let key in ManagerInfos.infos)
        {
            let info = ManagerInfos.infos[key];
            let manager = info.manager.create(info.name);
            manager.initialize();
            
            this.managers[key] = manager;
        }

        this.initialized = true;
    }

    /**
     * 获取管理器
     * @param t 类型
     */
    public static get<T extends BaseManager>(t: ManagerType): T {
        return <T>this.managers[t];
    }
    
    /**
     * update
     * @param dt 
     */
    public static update(dt): void {
        if(this.initialized)
        {
            for(var key in this.managers) {
                var mgr = this.managers[key];
                if (mgr != null) {
                    mgr.update(dt);
                }
            }
        }
    }
}
