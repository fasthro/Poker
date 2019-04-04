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
        public static sortSpecial(cards: Array<number>): Array<number> {
            let ncs = this.absoluteCards(cards);
            ncs.sort();
            ncs.reverse();
            console.log(ncs);
            let newCards: Array<number> = [];

            let index: number = 0;

            // 双王
            if (ncs[0] == 65 && ncs[1] == 64) {
                newCards.push(ncs[0]);
                newCards.push(ncs[1]);

                ncs.splice(index, 1);
                ncs.splice(index, 1);
            }

            // 查找所有炸弹
            while (index < ncs.length && ncs.length > 3) {
                let c1 = Math.floor(ncs[index] / 4);
                let c2 = Math.floor(ncs[index + 1] / 4);
                let c3 = Math.floor(ncs[index + 2] / 4);
                let c4 = Math.floor(ncs[index + 3] / 4);

                if (c1 == c2 && c2 == c3 && c3 == c4) {
                    newCards.push(ncs[index]);
                    newCards.push(ncs[index + 1]);
                    newCards.push(ncs[index + 2]);
                    newCards.push(ncs[index + 3]);

                    ncs.splice(index, 1);
                    ncs.splice(index, 1);
                    ncs.splice(index, 1);
                    ncs.splice(index, 1);
                } else {
                    index++;
                }
            }

            // 查找所有的三条
            index = 0;
            while (index < ncs.length && ncs.length > 2) {
                let c1 = Math.floor(ncs[index] / 4);
                let c2 = Math.floor(ncs[index + 1] / 4);
                let c3 = Math.floor(ncs[index + 2] / 4);

                if (c1 == c2 && c2 == c3) {
                    newCards.push(ncs[index]);
                    newCards.push(ncs[index + 1]);
                    newCards.push(ncs[index + 2]);

                    ncs.splice(index, 1);
                    ncs.splice(index, 1);
                    ncs.splice(index, 1);
                }
                else {
                    index++;
                }
            }

            // 查找所有的对子
            index = 0;
            while (index < ncs.length && ncs.length > 1) {
                let c1 = Math.floor(ncs[index] / 4);
                let c2 = Math.floor(ncs[index + 1] / 4);

                if (c1 == c2 && ncs[index] < 64) {
                    newCards.push(ncs[index]);
                    newCards.push(ncs[index + 1]);

                    ncs.splice(index, 1);
                    ncs.splice(index, 1);
                } else {
                    index++;
                }
            }

            // 剩下的单张
            for (let i = 0; i < ncs.length; i++) {
                newCards.push(ncs[i]);
            }

            return this.unAbsoluteCards(newCards);
        }

        /**
         * 是不是对子
         * @param cards 
         */
        public static isPair(cards: Array<number>): boolean {
            if (cards.length != 2)
                return false;

            let c1 = Math.floor(cards[0] / 4);
            let c2 = Math.floor(cards[1] / 4);
            return c1 == c2;
        }

        /**
         * 是不是三条
         * @param cards 
         */
        public static isTripleton(cards: Array<number>): boolean {
            if (cards.length != 3)
                return false;

            let c1 = Math.floor(cards[0] / 4);
            let c2 = Math.floor(cards[1] / 4);
            let c3 = Math.floor(cards[2] / 4);
            return c1 == c2 && c2 == c3;
        }

        /**
         * 是不是四张炸弹
         * @param cards 
         */
        public static isFourBomb(cards: Array<number>): boolean {
            if (cards.length != 4)
                return false;

            let c1 = Math.floor(cards[0] / 4);
            let c2 = Math.floor(cards[1] / 4);
            let c3 = Math.floor(cards[2] / 4);
            let c4 = Math.floor(cards[3] / 4);
            return c1 == c2 && c2 == c3 && c3 == c4;
        }

        /**
         * 是不是王炸
         * @param cards 
         */
        public static isKingBomb(cards: Array<number>): boolean {
            if (cards.length != 2)
                return false;

            return cards[0] == 2 && cards[1] == 3;
        }

        /**
         * 是不是炸弹
         * @param cards 
         */
        public static isBomb(cards: Array<number>): boolean {
            return this.isFourBomb(cards) || this.isKingBomb(cards);
        }

        /**
         * 是不是三带二
         * @param cards 
         * @returns 0 - 不是三带二，abs - 三带二的值(比如33355,返回3的绝对值,用于比较大小)
         */
        public static isTripletonPair(cards: Array<number>): number {
            if (cards.length != 5)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();

            let c1 = Math.floor(ncs[0] / 4);
            let c2 = Math.floor(ncs[1] / 4);
            let c3 = Math.floor(ncs[2] / 4);
            let c4 = Math.floor(ncs[3] / 4);
            let c5 = Math.floor(ncs[4] / 4);

            // 不能带双王,牌中不能存在王
            for (let i = 0; i < ncs.length; i++) {
                if (ncs[i] == 64 || ncs[i] == 65)
                    return 0;
            }

            // 33355
            if (c1 == c2 && c2 == c3 && c4 == c5) {
                return this.unAbsoluteCard(ncs[0]);
            }
            return 0;
        }

        /**
         * 是不是三带一
         * @param cards 
         * @returns 0 - 不是三带一，abs - 三带一的值(比如3335,返回3,用于比较大小)
         */
        public static isTripletonSingle(cards: Array<number>): number {
            if (cards.length != 4)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();

            let c1 = Math.floor(ncs[0] / 4);
            let c2 = Math.floor(ncs[1] / 4);
            let c3 = Math.floor(ncs[2] / 4);
            let c4 = Math.floor(ncs[3] / 4);

            // 3335
            if (c1 == c2 && c2 == c3) {
                return this.unAbsoluteCard(ncs[0]);
            }
            return 0;
        }

        /**
         * 是不是顺子
         * @param cards 
         * @returns 0 - 不是顺子,abs - 顺子起始牌值(比如34567,返回3,用于比较大小)
         */
        public static isStraight(cards: Array<number>): number {
            if (cards.length != 5)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();

            // 最低3开头, 最高 A 结尾
            if (ncs[0] > 11 && ncs[ncs.length - 1] < 60) {
                for (let i = 0; i < ncs.length - 1; i++) {
                    let card = Math.floor(ncs[i] / 4);
                    let nextCard = Math.floor(ncs[i + 1] / 4);
                    if (nextCard - card != 1)
                        return 0
                }
                return this.unAbsoluteCard(ncs[0]);
            }
            return 0
        }

        /**
         * 是不是双顺子
         * @param cards 
         * @returns 0 - 不是顺子,abs - 顺子起始牌值(比如334455,返回3,用于比较大小)
         */
        public static isStraight2(cards: Array<number>): number {
            if (cards.length > 5 && cards.length % 2 == 0) {
                let ncs = this.absoluteCards(this.copyCards(cards));
                ncs.sort();

                // 最低3开头, 最高 A 结尾
                if (ncs[0] > 11 && ncs[ncs.length - 1] < 60) {
                    let index = 0;
                    for (let i = 0; i < ncs.length / 2 - 1; i++) {
                        index = i * 2;
                        // 比较 i 对牌是否为对子
                        let card1 = Math.floor(ncs[index] / 4);
                        let nextCard1 = Math.floor(ncs[index + 1] / 4);
                        if (card1 != nextCard1)
                            return 0

                        index = (i + 1) * 2;
                        // 比较 i + 1 对牌是否为对子
                        let card2 = Math.floor(ncs[index] / 4);
                        let nextCard2 = Math.floor(ncs[index + 1] / 4);
                        if (card2 != nextCard2)
                            return 0

                        // 比较 i 对和 i+1 对是否连续
                        if (card2 - card1 != 1)
                            return 0;
                    }
                    return this.unAbsoluteCard(ncs[0]);
                }
            }
            return 0
        }

        /**
         * 是不是三顺子
         * @param cards 
         * @returns 0 - 不是顺子,abs - 顺子起始牌值(比如333444555,返回3,用于比较大小)
         */
        public static isStraight3(cards: Array<number>): number {
            if (cards.length > 5 && cards.length % 3 == 0) {
                let ncs = this.absoluteCards(this.copyCards(cards));
                ncs.sort();

                // 最低3开头, 最高 A 结尾
                if (ncs[0] > 11 && ncs[ncs.length - 1] < 60) {
                    let index = 0;
                    for (let i = 0; i < ncs.length / 3 - 1; i++) {
                        index = i * 3;
                        // 比较 i 对牌是否为对子
                        let card1 = Math.floor(ncs[index] / 4);
                        let nextCard1 = Math.floor(ncs[index + 1] / 4);
                        let lastCard1 = Math.floor(ncs[index + 2] / 4);
                        if (card1 != nextCard1 || card1 != lastCard1)
                            return 0

                        index = (i + 1) * 3;
                        // 比较 i + 1 对牌是否为对子
                        let card2 = Math.floor(ncs[index] / 4);
                        let nextCard2 = Math.floor(ncs[index + 1] / 4);
                        let lastCard2 = Math.floor(ncs[index + 2] / 4);
                        if (card2 != nextCard2 || card2 != lastCard2)
                            return 0

                        // 比较 i 对和 i+1 对是否连续
                        if (card2 - card1 != 1)
                            return 0;
                    }
                    return this.unAbsoluteCard(ncs[0]);
                }
            }
            return 0
        }

        /**
         * 是不是飞机-六带四
         * @param cards 
         * @returns 0 - 不是飞机-六带四,abs - 飞机-六带四起始牌值(比如3334445566,返回3,用于比较大小)
         */
        public static isPlaneSixFour(cards: Array<number>): number {
            if (cards.length != 10)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();

            let card1 = Math.floor(ncs[0] / 4);
            let card2 = Math.floor(ncs[1] / 4);
            let card3 = Math.floor(ncs[2] / 4);
            let card4 = Math.floor(ncs[3] / 4);
            let card5 = Math.floor(ncs[4] / 4);
            let card6 = Math.floor(ncs[5] / 4);
            let card7 = Math.floor(ncs[6] / 4);
            let card8 = Math.floor(ncs[7] / 4);
            let card9 = Math.floor(ncs[8] / 4);
            let card10 = Math.floor(ncs[9] / 4);

            // 555666-7788
            if (card1 == card3
                && card4 == card6
                && card7 == card8 && card9 == card10) {
                return this.unAbsoluteCard(ncs[0]);
            }
            // 3344-555666
            else if (card1 == card2 && card3 == card4
                && card5 == card7
                && card8 == card10) {
                return this.unAbsoluteCard(ncs[4]);
            }
            // 33-555666-77
            else if (card1 == card2 && card9 == card10
                && card3 == card5
                && card6 == card8) {
                return this.unAbsoluteCard(ncs[2]);
            }
            return 0;
        }

        /**
         * 是不是飞机-六带二
         * @param cards 
         * @returns 0 - 不是飞机-六带二,abs - 飞机-六带二起始牌值(比如33344456,返回3,用于比较大小)
         */
        public static isPlaneSixTwo(cards: Array<number>): number {
            if (cards.length != 8)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();

            let card1 = Math.floor(ncs[0] / 4);
            let card2 = Math.floor(ncs[1] / 4);
            let card3 = Math.floor(ncs[2] / 4);
            let card4 = Math.floor(ncs[3] / 4);
            let card5 = Math.floor(ncs[4] / 4);
            let card6 = Math.floor(ncs[5] / 4);
            let card7 = Math.floor(ncs[6] / 4);
            let card8 = Math.floor(ncs[7] / 4);

            // 555666-78
            if (card1 == card3 && card4 == card6) {
                return this.unAbsoluteCard(ncs[0]);
            }
            // 34-555666
            else if (card3 == card5 && card6 == card8) {
                return this.unAbsoluteCard(ncs[2]);
            }
            // 3-555666-7
            else if (card2 == card4 && card5 == card7) {
                return this.unAbsoluteCard(ncs[1]);
            }
            return 0;
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
            else if (card > 55 && card < 64) return card - 52; // A || 2
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

        /**
         * 复制一份新牌，避免污染原始数据
         * @param cards 
         */
        private static copyCards(cards: Array<number>): Array<number> {
            let ncs: Array<number> = [];
            // 复制一份，避免改变原始数据
            for (let i = 0; i < cards.length; i++) {
                ncs.push(cards[i]);
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
