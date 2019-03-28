import Game from "../Game";
import ResManager from "../manager/ResManager";
import { ManagerType } from "../define/Managers";

/*
 * @Author: fasthro
 * @Description: 加载texture图片资源，设置 Sprite 图像显示
 * @Date: 2019-03-27 18:02:29
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadTexture extends cc.Component {

    // 图片地址
    @property(cc.String)
    public url: string = "";

    onLoad(): void {
        let self = this;
        let resMrg = Game.getManager<ResManager>(ManagerType.Resource);
        resMrg.loadTexture(this.url, (error: Error, texture: any) => {
            if (!error) {
                let sprite: cc.Sprite = self.node.getComponent(cc.Sprite);
                if (sprite) {
                    sprite.spriteFrame = texture;
                }
            }
        });
    }
}
