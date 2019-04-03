/*
 * @Author: fasthro
 * @Description: 斗地主逻辑，负责各种牌型识别判断，洗牌，提示等功能
 * @Date: 2019-04-03 16:10:29
 */
module DDZ {
    /**
     * 核心逻辑
     * - 牌的对应关系
     * - 大王 小王 黑桃A 红桃A 草花A 方片A  黑桃2 红桃2 草花2 方片2 黑桃3 红桃3 草花3 方片3 ...
     * -  2    3     4    5    6     7     8     9    10    11    12   13    14    15  ...
     */
    export class Core {

        // 所有的牌数组
        private static _cards: Array<number> = [];
        // 所有的牌数组
        public static get cards(): any {
            if (this._cards.length == 0) {
                for (let i = 2; i <= 55; i++) {
                    this._cards.push(i);
                }
            }
            return this._cards;
        }

        /**
         * 洗牌
         */
        public static disorder(): void {
            let tryCount = Utils.random(1, 8);
            let cardCount = this.cards.length;
            for (let i = 0; i < tryCount; i++) {
                for (let k = 0; k < this.cards.length; k++) {
                    let r = Utils.random(k, cardCount - 1);
                    let temp = this.cards[k];
                    this.cards[k] = this.cards[r];
                    this.cards[r] = temp;
                }
            }
        }

        /**
         * 发牌
         * @returns w: 底牌, xyz: 玩家牌
         */
        public static deal(): any {
            this.disorder();

            let x: Array<number> = [];
            let y: Array<number> = [];
            let z: Array<number> = [];
            let w: Array<number> = [];

            for (let i = 0; i < this.cards.length; i++) {
                if (i <= 50) {
                    if (i % 3 == 1) x.push(this.cards[i]);
                    else if (i % 3 == 2) y.push(this.cards[i]);
                    else if (i % 3 == 0) z.push(this.cards[i]);
                }
                else {
                    w.push(this.cards[i]);
                }
            }
            return { w: w, x: x, y: y, z: z };
        }

        /**
         * 排序-普通
         * @param cards 
         * @returns 返回排序后的牌列表
         */
        public static sortNormal(cards: Array<number>): Array<number> {
            let ncs = this.absoluteCards(cards);
            ncs.sort();
            return this.unAbsoluteCards(ncs);
        }

        /**
         * 排序-特殊
         * 炸弹、3条、对子、单牌的顺序排列
         * @param cards 
         * @returns 返回排序后的牌列表
         */
        public static sortSpecial(cards: Array<number>): void {
            let ncs = this.absoluteCards(cards);
            ncs.reverse();
            
            // let newCards = this.
        }

        /**
         * 将外部数据的牌编号,变成内部方便比较大小的绝对值
         * @param card 
         * @returns card 绝对值
         */
        private static absoluteCard(card: number): number {
            if (card > 11) return card;
            else if (card < 12 && card > 3) return card + 52; // A || 2
            else if (card == 2) return 65;                    // 大王
            else if (card == 3) return 64;                    // 小王
        }

        /**
         * 将外部数据的牌编号,变成内部方便比较大小的绝对值
         * @param cards 
         * @returns cards 绝对值
         */
        private static absoluteCards(cards: Array<number>): Array<number> {
            let ncs: Array<number> = [];
            for (let i = 0; i < cards.length; i++) {
                ncs.push(this.absoluteCard(cards[i]));
            }
            return ncs;
        }

        /**
         * 将内部数据的绝对值,变成外部牌编号
         * @param card 
         * @returns card 牌编号
         */
        private static unAbsoluteCard(card: number): number {
            if (card < 56) return card;
            else if (card < 55 && card > 64) return card - 52; // A || 2
            else if (card == 65) return 2;                     // 大王
            else if (card == 64) return 3;                     // 小王
        }

        /**
         * 将内部数据的绝对值,变成外部牌编号
         * @param cards 
         * @returns cards 牌编号
         */
        private static unAbsoluteCards(cards: Array<number>): Array<number> {
            let ncs: Array<number> = [];
            for (let i = 0; i < cards.length; i++) {
                ncs.push(this.unAbsoluteCard(cards[i]));
            }
            return ncs;
        }
    }

    /**
     * 工具
     */
    export class Utils {
        /**
         * 随机数
         * @param minValue 
         * @param maxValue 
         */
        public static random(minValue: number, maxValue: number): number {
            return Math.round(Math.random() * (maxValue - minValue) + minValue);
        }
    }
}

export = DDZ;
