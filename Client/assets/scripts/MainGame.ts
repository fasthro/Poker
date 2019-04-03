import GameEnv from "./define/GameEnv";
import ManagerCenter from "./center/ManagerCenter";
import CtrlCenter from "./center/ContrlllerCenter";
import Game from "./Game";
import SceneCenter from "./center/SceneCenter";
import { SceneType } from "./define/Scenes";
import GameCenter from "./center/GameCenter";

/*
 * @Author: fasthro
 * @Description: 游戏入口
 * @Date: 2019-03-26 15:26:10
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainGame extends cc.Component {
    onLoad() {
        // 游戏帧频设置
        cc.game.setFrameRate(GameEnv.frameRate);
        
        // 常驻
        cc.game.addPersistRootNode(this.node);

        // 初始化中心服务
        // 场景
        SceneCenter.initialize();
        // 管理器
        ManagerCenter.initialize();
        // 控制器
        CtrlCenter.initialize();
        // 游戏
        GameCenter.initialize();
    }

    start() {
        Game.enterScene(SceneType.Init);
    }

    update(dt) {
        SceneCenter.update(dt);
        ManagerCenter.update(dt);
        CtrlCenter.update(dt);
    }
}
