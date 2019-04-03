import GameInfos, { GameType, GameInfo } from "../define/Games";

/*
 * @Author: fasthro
 * @Description: 游戏中心服务
 * @Date: 2019-04-03 15:12:01
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCenter {
    // 初始化标志
    private static initialized: boolean = false;

    /**
     * 初始化游戏中心服务
     */
    public static initialize(): void {
        // 初始化游戏信息
        GameInfos.initialize();

        this.initialized = true;
    }

    /**
     * 获取游戏信息
     * @param t 
     */
    public static getGameInfo(t: GameType): GameInfo {
        return GameInfos.getGameInfo(t);
    }
}
