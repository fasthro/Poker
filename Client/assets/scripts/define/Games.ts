import { ControllerType } from "./Controllers";

/*
 * @Author: fasthro
 * @Description: 游戏相关配置
 * @Date: 2019-04-03 14:48:04
 */

/**
 * 游戏类型
 */
export enum GameType {
  DDZ,
}

export interface GameInfo {
  name: string;
  controllerType: ControllerType;
}

export default class GameInfos {
  // game infos 
  public static infos: { [key: number]: GameInfo };

  /**
   * 初始化由Center负责调用
   */
  public static initialize(): void {
    this.infos = {}
    this.infos[GameType.DDZ] = { name: "斗地主", controllerType: ControllerType.DDZ };
  }

  /**
   * 获取游戏信息
   * @param t GameType
   */
  public static getGameInfo(t: GameType): GameInfo {
    return this.infos[t];
  }
}
