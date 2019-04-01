import BaseManager from "./BaseManager";
import { ControllerType } from "../define/Controllers";
import Game from "../Game";
import ResManager from "./ResManager";
import { ManagerType } from "../define/Managers";
import BaseController from "../controller/BaseController";
import { UILayer } from "../define/UILayer";

/*
 * @Author: fasthro
 * @Description: UI 管理器
 * @Date: 2019-03-26 15:24:35
 */

const { ccclass, property } = cc._decorator;

/**
 * UI 加载数据结构
 */
export class UILoadData {
    // 控制器
    public controller: BaseController = null;
    // 打开UI需要传递的参数
    public params: any = null;
}

@ccclass
export default class UIManager extends BaseManager {

    // 资源管理器
    private m_resMgr: ResManager = null;
    private get resMgr() {
        if (!this.m_resMgr) {
            this.m_resMgr = Game.getManager<ResManager>(ManagerType.Resource);
        }
        return this.m_resMgr;
    }

    // prefab 缓存池
    private prefabCache: { [key: string]: any };

    /**
     * manager create
     * @param name 
     */
    public static create(name: string): BaseManager {
        return new UIManager();
    }

    public initialize(): void{
        this.prefabCache = {};
    }

    /**
     * 检查是否在缓存池中
     * @param url url
     */
    private checkCache(url: string): boolean {
        let prefab = this.prefabCache[url];
        if (prefab) {
            return true;
        }
        return false;
    }

    /**
     * 在缓存池中获取 
     * @param url url
     */
    private getCache(url: string): any {
        return this.prefabCache[url]
    }

    /**
     * 添加到缓存池
     * @param url url
     * @param prefab prefab
     */
    private addCache(url: string, prefab: any) {
        this.prefabCache[url] = prefab;
    }

    /**
     * 显示UI
     * @param ct controller 类型
     * @param params 显示UI时候需要传递的参数
     */
    public showUI(ct: ControllerType, params: any = null): void {
        let controller = Game.getController(ct);
        if (controller) {
            let url: string = controller.getResPath();
            console.log(`uimanager -> showUI ${url}`)
            let loadData: UILoadData = { controller: controller, params: params };
            if (this.checkCache(url)) {
                this.onCreateUI(loadData, this.getCache(url));
            }
            else {
                this.resMgr.loadPrefab(url, this.onCreateUI, this, loadData);
            }
        }
    }

    /**
     * 创建UI完成回调
     * @param data 加载数据
     * @param prefab prefab
     */
    private onCreateUI(data: any, prefab: any): void {
        let loadData: UILoadData = data;
        let controller = loadData.controller;
        let gameObject: cc.Node = cc.instantiate(prefab);
        if (controller) {
            console.log(`uimanager -> onCreateUI ${loadData.controller.getResPath()}`);
            // 添加到缓存池
            let url = controller.getResPath();
            if (this.checkCache(url)) {
                this.addCache(url, prefab);
            }
            // 设置节点父类
            UIManager.getUILayerNode(loadData.controller.layer).addChild(gameObject);
            // 回调控制器，UI创建完成
            loadData.controller.onViewCreated(gameObject, loadData.params);
        }
    }

    /**
     * 关闭UI
     * @param ct controller 类型
     */
    public closeUI(ct: ControllerType): void {
        let controller = Game.getController(ct);
        if (controller) {
            controller.dispose();
            if (controller.canDestroy && controller.gameObject) {
                controller.gameObject.destroy();
            }
        }
    }

    /**
     * 获取UILayer节点
     * @param layer UILayer
     */
    private static getUILayerNode(layer: UILayer): cc.Node {
        return cc.find("Canvas");
    }
}
