import BaseManager from "./BaseManager";

/*
 * @Author: fasthro
 * @Description: 场景管理器
 * @Date: 2019-03-28 18:36:11
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScenceManager extends BaseManager implements IManager {
    public static create(name: string): IManager {
        return new ScenceManager();
    }

    initialize(): void {
        
    }

    update(dt: any): void {
        
    }

    dispose(): void {
        
    }

    
}
