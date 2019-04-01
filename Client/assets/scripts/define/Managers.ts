import UIManager from "../manager/UIManager";
import NetworkManager from "../manager/NetworkManager";
import ResManager from "../manager/ResManager";
import ScenceManager from "../manager/ScenceManager";

/*
 * @Author: fasthro
 * @Description: 管理器类型配置
 * @Date: 2019-03-26 16:11:04
 */

const { ccclass, property } = cc._decorator;

export enum ManagerType {
    UI,
    Network,
    Resource,
    Scence,
}

export interface ManagerInfo {
    name: string;
    manager: any;
}

@ccclass
export default class ManagerInfos {
    // manager infos 
    public static infos: { [key: number]: ManagerInfo };

    /**
     * 初始化由Center负责调用
     */
    public static initialize(): void {
        this.infos = {}
        this.infos[ManagerType.UI] = { name: "ui", manager: UIManager };
        this.infos[ManagerType.Network] = { name: "network", manager: NetworkManager };
        this.infos[ManagerType.Resource] = { name: "resource", manager: ResManager };
        this.infos[ManagerType.Scence] = { name: "scence", manager: ScenceManager };
    }
}
