/*
 * @Author: fasthro
 * @Description: 场景接口
 * @Date: 2019-03-29 16:19:03
 */

export interface IScene {
    initialize(): void;
    onLoaded(): void;
    onExit(): void;
    update(dt): void;
    dispose(): void;
}
