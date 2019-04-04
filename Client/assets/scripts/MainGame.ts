import GameEnv from "./define/GameEnv";
import ManagerCenter from "./center/ManagerCenter";
import CtrlCenter from "./center/ContrlllerCenter";
import Game from "./Game";
import SceneCenter from "./center/SceneCenter";
import { SceneType } from "./define/Scenes";
import GameCenter from "./center/GameCenter";
import DDZ = require("./game/ddz/DDZ");
import Cards from "./game/Cards";

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

    @property(Cards)
    public cardsCom: Cards = null;
    
    start() {
        // Game.enterScene(SceneType.Init);
        let cards = [16, 17, 18, 20, 21, 22, 24, 25, 26];
        this.cardsCom.initCards(cards);
        console.log(DDZ.Core.isStraight3(cards));
    }

    update(dt) {
        SceneCenter.update(dt);
        ManagerCenter.update(dt);
        CtrlCenter.update(dt);
    }
}
