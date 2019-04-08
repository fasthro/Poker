import DDZResultItemCom from "../../game/ddz/component/DDZResultItemCom";

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

}
