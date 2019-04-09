import DDZResultItemCom from "../../game/ddz/component/DDZResultItemCom";
import Game from "../../Game";
import DDZCtroller from "../../controller/ddz/DDZCtroller";
import { ControllerType } from "../../define/Controllers";

/*
 * @Author: fasthro
 * @Description: 斗地主结果界面
 * @Date: 2019-04-08 17:44:58
 */

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("斗地主/ResultView")
export default class DDZResultView extends cc.Component {

    @property(DDZResultItemCom)
    public item1: DDZResultItemCom = null;

    @property(DDZResultItemCom)
    public item2: DDZResultItemCom = null;

    @property(DDZResultItemCom)
    public item3: DDZResultItemCom = null;

    // win node
    @property(cc.Node)
    public winNode: cc.Node = null;

    // lose node
    @property(cc.Node)
    public loseNode: cc.Node = null;

    /**
     * 设置x信息
     * @param name 玩家昵称
     * @param isLord 是否为地主
     * @param isWin  是否胜利
     * @param score  底分
     * @param multiple 倍数
     */
    public setItemX(name: string, isLord: boolean, isWin: boolean, score: number, multiple: number): void {
        this.item2.nameLabel.string = name;
        this.item2.lordNode.active = isLord;
        this.item2.scoreLabel.string = score.toString();
        this.item2.multipleLabel.string = isLord ? (multiple * 2).toString() : multiple.toString();
        let coin = isLord ? score * multiple * 2 : score * multiple;
        this.item2.coinLabel.string = isWin ? coin.toString() : `-${coin.toString()}`
    }

    /**
     * 设置y信息
     * @param name 玩家昵称
     * @param isLord 是否为地主
     * @param isWin  是否胜利
     * @param score  底分
     * @param multiple 倍数
     */
    public setItemY(name: string, isLord: boolean, isWin: boolean, score: number, multiple: number): void {
        this.item3.nameLabel.string = name;
        this.item3.lordNode.active = isLord;
        this.item3.scoreLabel.string = score.toString();
        this.item3.multipleLabel.string = isLord ? (multiple * 2).toString() : multiple.toString();
        let coin = isLord ? score * multiple * 2 : score * multiple;
        this.item3.coinLabel.string = isWin ? coin.toString() : `-${coin.toString()}`
    }

    /**
     * 设置z信息
     * @param name 玩家昵称
     * @param isLord 是否为地主
     * @param isWin  是否胜利
     * @param score  底分
     * @param multiple 倍数
     */
    public setItemZ(name: string, isLord: boolean, isWin: boolean, score: number, multiple: number): void {
        this.item1.nameLabel.string = name;
        this.item1.lordNode.active = isLord;
        this.item1.scoreLabel.string = score.toString();
        this.item1.multipleLabel.string = isLord ? (multiple * 2).toString() : multiple.toString();
        let coin = isLord ? score * multiple * 2 : score * multiple;
        this.item1.coinLabel.string = isWin ? coin.toString() : `-${coin.toString()}`
    }

    /**
     * 离开按钮点击回调
     * @param event 
     */
    public onClickLeavelBtn(event): void {
        Game.closeUI(ControllerType.DDZRusult);
    }

    /**
     * 继续按钮点击回调
     * @param event 
     */
    public onClickContinueBtn(event): void {
        Game.closeUI(ControllerType.DDZRusult);
        Game.getController<DDZCtroller>(ControllerType.DDZ).restart();
    }
}
