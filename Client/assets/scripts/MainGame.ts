import GameEnv from "./define/GameEnv";
import ManagerCenter from "./center/ManagerCenter";
import CtrlCenter from "./center/ContrlllerCenter";
import Game from "./Game";
import UIManager from "./manager/UIManager";
import { ManagerType } from "./define/Managers";
import { ControllerType } from "./define/Controllers";

/*
 * @Author: fasthro
 * @Description: 游戏入口
 * @Date: 2019-03-26 15:26:10
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainGame extends cc.Component {

    @property(cc.Node)
    public windowNode: cc.Node = null;

    @property(cc.Node)
    public popupNode: cc.Node = null;

    @property(cc.Node)
    public loadingNode: cc.Node = null;

    @property(cc.Node)
    public waitNode: cc.Node = null;

    onLoad() {
        // 游戏帧频设置
        cc.game.setFrameRate(GameEnv.frameRate);
        
        // 常驻
        cc.game.addPersistRootNode(this.node);

        // 初始化管理器中心服务
        ManagerCenter.initialize();
        // 初始化控制器中心服务
        CtrlCenter.initialize();
    }

    start() {
        // 初始化
        Game.mainGame = this;

        // 加载loading界面
        Game.showUI(ControllerType.Launch);
    }

    update(dt) {
        ManagerCenter.update(dt);
        CtrlCenter.update(dt);
    }
}
