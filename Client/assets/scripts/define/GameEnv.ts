/*
 * @Author: fasthro
 * @Description: 游戏环境配置
 * @Date: 2019-03-26 16:36:24
 */

export default class GameEnv{

    // 游戏帧频
    public static frameRate: number = 60;

    // network
    // 网络连接-超时时间
    public static networkConnectTimeout = 120000;
    // 网络连接-重新连接最大次数
    public static networkReConnectMaxCount = 15;
    // 网络连接-重新连接时间间隔
    public static networkReConnectTimeInterval = 5000;
    
}
