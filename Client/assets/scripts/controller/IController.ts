/*
 * @Author: fasthro
 * @Description: 控制器接口
 * @Date: 2019-03-26 17:02:22
 */

interface IController {
    initialize(): void;
    onViewCreated(go: any, params: any): void;
    update(dt: any): void;
    getBase(): any;
    getParent(): cc.Node;
    getResPath(): string;
    dispose(): void;
}
