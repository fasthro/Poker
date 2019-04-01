/*
 * @Author: fasthro
 * @Description: 启动界面
 * @Date: 2019-03-28 18:47:22
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class InitView extends cc.Component {
    // 进度条
    @property(cc.ProgressBar)
    public progressBar: cc.ProgressBar = null;

    // 进度文本
    @property(cc.Label)
    public rateLable: cc.Label = null;

    onLoad() {
        this.progressBar = this.node.getChildByName("progress").getComponent(cc.ProgressBar);
        this.rateLable = this.progressBar.node.getChildByName("rate").getComponent(cc.Label);
    }

    start() {
        this.progressBar.progress = 0;
        this.rateLable.string = "0%";
    }
}
