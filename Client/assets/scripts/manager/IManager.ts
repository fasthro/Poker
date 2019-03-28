/*
 * @Author: fasthro
 * @Description: 管理接口
 * @Date: 2019-03-26 15:35:31
 */

interface IManager {
    initialize(): void;
    update(dt): void;
    dispose(): void;
}