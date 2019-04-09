
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("斗地主/ResultItemCom")
export default class DDZResultItemCom extends cc.Component {
    
    // 地主标志 node
    @property(cc.Node)
    public lordNode: cc.Node = null;

    // 名称
    @property(cc.Label)
    public nameLabel: cc.Label = null;

    // 低分
    @property(cc.Label)
    public scoreLabel: cc.Label = null;

    // 倍数
    @property(cc.Label)
    public  multipleLabel: cc.Label = null;

    // coin
    @property(cc.Label)
    public coinLabel: cc.Label = null;
}
