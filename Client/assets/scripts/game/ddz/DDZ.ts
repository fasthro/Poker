/*
 * @Author: fasthro
 * @Description: 斗地主逻辑，负责各种牌型识别判断，洗牌，提示等功能
 * ******************* 牌型 ****************
 * 1.单张
 * 2.对子 isPair
 * 3.三条 isTripleton
 * 4.炸弹 isFourBomb
 * 5.王炸 isKingBomb
 * 6.三带二 isThreeTwo
 * 7.三带一 isThreeOne
 * 8.顺子 isStraight
 * 9.双顺子 isStraight2
 * 10.三顺子 isStraight3
 * 11.四顺子 isStraight4
 * 12.六带四 isSixFour
 * 13.六带二 isSixTwo
 * 14.九带六 isNineSix
 * 15.九带三 isNineThree
 * 16.四带四 isFourFour
 * 17.四带二 isFourTwo
 * 18.十二带四 isTwelveFour
 * 19.十二带八 isTwelveEight
 * 20.十五带五 isFifteenFive
 * 21.八带四 isEightFour
 * 22.八带八 isEightEight
 * 23.十二带六 isTwelveSix
 * ********************************************
 * ******************* 其他方法 ****************
 * 1.洗牌 disorder
 * 2.洗牌 deal
 * 3.验证牌边界 validateBoundy
 * 4.验证牌型 validateRule
 * 5.比较牌大小 compareCards 
 * ********************************************
 * @Date: 2019-04-03 16:10:29
 */
module DDZ {
    /**
     * 牌型和基础
     * - 牌的对应关系
     * - 大王 小王 黑桃A 红桃A 草花A 方片A  黑桃2 红桃2 草花2 方片2 黑桃3 红桃3 草花3 方片3 ...
     * -  2    3     4    5    6     7     8     9    10    11    12   13    14    15  ...
     * 
     *  大 - 2
     *  小 - 3
     *  3  - 12,13,14,15
     *  4  - 16,17,18,19
     *  5  - 20,21,22,23
     *  6  - 24,25,26,27
     *  7  - 28,29,30,31
     *  8  - 32,33,34,35
     *  9  - 36,37,38,39
     *  10 - 40,41,42,43
     *  J  - 44,45,46,47
     *  Q  - 48,49,50,51
     *  K  - 52,53,54,55
     *  A  - 4,5,6,7
     *  2  - 8,9,10,11
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
            ncs.reverse();
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
        public static isThreeTwo(cards: Array<number>): number {
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

            let start: number = 0;

            // 33355
            if (c1 == c3 && c4 == c5) {
                start = this.unAbsoluteCard(ncs[0]);
            }

            // 33-444
            if (c1 == c2 && c3 == c5) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            return start;
        }

        /**
         * 是不是三带一
         * @param cards 
         * @returns 0 - 不是三带一，abs - 三带一的值(比如3335,返回3,用于比较大小)
         */
        public static isThreeOne(cards: Array<number>): number {
            if (cards.length != 4)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();

            let c1 = Math.floor(ncs[0] / 4);
            let c2 = Math.floor(ncs[1] / 4);
            let c3 = Math.floor(ncs[2] / 4);
            let c4 = Math.floor(ncs[3] / 4);

            let start: number = 0;

            // 333-5
            if (c1 == c2 && c2 == c3) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 3-444
            if (c2 == c3 && c3 == c4) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            return start;
        }

        /**
         * 是不是顺子
         * @param cards 
         * @returns 0 - 不是顺子,abs - 顺子起始牌值(比如34567,返回3,用于比较大小)
         */
        public static isStraight(cards: Array<number>): number {
            if (cards.length < 5)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();
            console.log(ncs);
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
         * 是不是四顺子
         * @param cards 
         * @returns 0 - 不是顺子,abs - 顺子起始牌值(比如333344445555,返回3,用于比较大小)
         */
        public static isStraight4(cards: Array<number>): number {
            if (cards.length > 7 && cards.length % 4 == 0) {
                let ncs = this.absoluteCards(this.copyCards(cards));
                ncs.sort();

                // 最低3开头, 最高 A 结尾
                if (ncs[0] > 11 && ncs[ncs.length - 1] < 60) {
                    let index = 0;
                    for (let i = 0; i < ncs.length / 4 - 1; i++) {
                        index = i * 4;
                        // 比较 i 对牌是否为对子
                        let cardP1 = Math.floor(ncs[index] / 4);
                        let cardP2 = Math.floor(ncs[index + 1] / 4);
                        let cardP3 = Math.floor(ncs[index + 2] / 4);
                        let cardP4 = Math.floor(ncs[index + 3] / 4);
                        if (cardP1 != cardP2 || cardP1 != cardP3 || cardP1 != cardP4)
                            return 0

                        index = (i + 1) * 4;
                        // 比较 i + 1 对牌是否为对子
                        let cardN1 = Math.floor(ncs[index] / 4);
                        let cardN2 = Math.floor(ncs[index + 1] / 4);
                        let cardN3 = Math.floor(ncs[index + 2] / 4);
                        let cardN4 = Math.floor(ncs[index + 3] / 4);
                        if (cardN1 != cardN2 || cardN1 != cardN3 || cardN1 != cardN4)
                            return 0

                        // 比较 i 对和 i+1 对是否连续
                        if (cardN1 - cardP1 != 1)
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
        public static isSixFour(cards: Array<number>): number {
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

            let start: number = 0;

            // 555666-7788
            if (card7 == card8 && card9 == card10
                && card1 == card3
                && card4 == card6
                && card4 - card1 == 1) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 3344-555666
            if (card1 == card2 && card3 == card4
                && card5 == card7
                && card8 == card10
                && card8 - card5 == 1) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            // 33-555666-77
            if (card1 == card2 && card9 == card10
                && card3 == card5
                && card6 == card8
                && card6 - card3 == 1) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            return start;
        }

        /**
         * 是不是飞机-六带二
         * @param cards 
         * @returns 0 - 不是飞机-六带二,abs - 飞机-六带二起始牌值(比如33344456,返回3,用于比较大小)
         */
        public static isSixTwo(cards: Array<number>): number {
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

            let start: number = 0;

            // 555666-78
            if (card1 == card3 && card4 == card6
                && card4 - card1 == 1) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 34-555666
            if (card3 == card5 && card6 == card8
                && card6 - card3 == 1) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 3-555666-7
            if (card2 == card4 && card5 == card7
                && card5 - card2 == 1) {
                start = this.unAbsoluteCard(ncs[1]);
            }
            return start;
        }

        /**
         * 是不是飞机-九带六
         * @param cards 
         * @returns 0 - 不是飞机-九带六,abs - 飞机-九带六起始牌值(比如333444555667788,返回3,用于比较大小)
         */
        public static isNineSix(cards: Array<number>): number {
            if (cards.length != 15)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);
            let card13 = Math.floor(ncs[12] / 4);
            let card14 = Math.floor(ncs[13] / 4);
            let card15 = Math.floor(ncs[14] / 4);

            let start: number = 0;

            // 555666777-8899JJ
            if (card10 == card11 && card12 == card13 && card14 == card15
                && card1 == card3
                && card4 == card6
                && card7 == card9
                && card4 - card1 == 1 && card7 - card4 == 1) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 33-555666777-8899
            if (card1 == card2 && card12 == card13 && card14 == card15
                && card3 == card5
                && card6 == card8
                && card9 == card11
                && card6 - card3 == 1 && card9 - card6 == 1) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 3344-666777888-99
            if (card1 == card2 && card3 == card4 && card14 == card15
                && card5 == card7
                && card8 == card10
                && card11 == card13
                && card8 - card5 == 1 && card11 - card8 == 1) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            // 334455-666777888
            if (card1 == card2 && card3 == card4 && card5 == card6
                && card7 == card9
                && card10 == card12
                && card13 == card15
                && card10 - card7 == 1 && card13 - card10 == 1) {
                start = this.unAbsoluteCard(ncs[6]);
            }
            return start;
        }

        /**
         * 是不是飞机-九带三
         * @param cards 
         * @returns 0 - 不是飞机-九带三,abs - 飞机-九带三起始牌值(比如333444555678,返回3,用于比较大小)
         */
        public static isNineThree(cards: Array<number>): number {
            if (cards.length != 12)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);

            let start: number = 0;

            // 555666777-89J
            if (card1 == card3 && card4 == card6 && card7 == card9
                && card4 - card1 == 1 && card7 - card4 == 1) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 3-555666777-89
            if (card2 == card3 && card5 == card7 && card8 == card10
                && card5 - card2 == 1 && card8 - card5 == 1) {
                start = this.unAbsoluteCard(ncs[1]);
            }
            // 34-555666777-8
            if (card3 == card5 && card6 == card8 && card9 == card11
                && card6 - card3 == 1 && card9 - card6 == 1) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 344-555666777
            if (card4 == card6 && card7 == card9 && card10 == card12
                && card7 - card4 == 1 && card10 - card7 == 1) {
                start = this.unAbsoluteCard(ncs[3]);
            }
            return start;
        }

        /**
         * 是不是四带四
         * @param cards 
         * @returns 0 - 不是四带四,abs - 四带四起始牌值(比如33334455,返回3,用于比较大小)
         */
        public static isFourFour(cards: Array<number>): number {
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

            let start: number = 0;

            // 5555-6677
            if (card1 == card4 && card5 == card6 && card7 == card8) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 33-5555-77
            if (card3 == card6 && card1 == card2 && card7 == card8) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 3344-5555
            if (card5 == card8 && card1 == card2 && card3 == card4) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            return start;
        }

        /**
         * 是不是四带二
         * @param cards 
         * @returns 0 - 不是四带二,abs - 四带二起始牌值(比如555567,返回5,用于比较大小)
         */
        public static isFourTwo(cards: Array<number>): number {
            if (cards.length != 6)
                return 0;

            let ncs = this.absoluteCards(this.copyCards(cards));
            ncs.sort();

            let card1 = Math.floor(ncs[0] / 4);
            let card2 = Math.floor(ncs[1] / 4);
            let card3 = Math.floor(ncs[2] / 4);
            let card4 = Math.floor(ncs[3] / 4);
            let card5 = Math.floor(ncs[4] / 4);
            let card6 = Math.floor(ncs[5] / 4);

            let start: number = 0;

            // 5555-67
            if (card1 == card4) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 4-5555-6
            if (card2 == card5) {
                start = this.unAbsoluteCard(ncs[1]);
            }
            // 34-5555
            if (card3 == card6) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            return start;
        }

        /**
         * 是不是十二带四
         * @param cards 
         * @returns 0 - 不是十二带四,abs - 十二带四起始牌值(比如5556667778889JQK,返回5,用于比较大小)
         */
        public static isTwelveFour(cards: Array<number>): number {
            if (cards.length != 16)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);
            let card13 = Math.floor(ncs[11] / 4);
            let card14 = Math.floor(ncs[11] / 4);
            let card15 = Math.floor(ncs[11] / 4);
            let card16 = Math.floor(ncs[11] / 4);

            let start: number = 0;

            // 555666777888-9JQK
            if (card1 == card3
                && card4 == card6
                && card7 == card9
                && card10 == card12
                && card4 - card1 == 1
                && card7 - card4 == 1
                && card10 - card7 == 1) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 4-555666777888-JQK
            if (card2 == card4
                && card5 == card7
                && card8 == card10
                && card11 == card13
                && card5 - card2 == 1
                && card8 - card5 == 1
                && card11 - card8 == 1) {
                start = this.unAbsoluteCard(ncs[1]);
            }
            // 44-555666777888-QK
            if (card3 == card5
                && card6 == card8
                && card9 == card11
                && card12 == card13
                && card6 - card3 == 1
                && card9 - card6 == 1
                && card12 - card9 == 1) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 344-555666777888-K
            if (card4 == card6
                && card7 == card9
                && card10 == card12
                && card13 == card15
                && card7 - card4 == 1
                && card10 - card7 == 1
                && card13 - card10 == 1) {
                start = this.unAbsoluteCard(ncs[3]);
            }
            // 3344-555666777888
            if (card5 == card7
                && card8 == card10
                && card11 == card13
                && card14 == card16
                && card8 - card5 == 1
                && card11 - card8 == 1
                && card14 - card11 == 1) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            return start;
        }

        /**
         * 是不是十二带八
         * @param cards 
         * @returns 0 - 不是十二带八,abs - 十二带八起始牌值(比如55566677788899JJQQKK,返回5,用于比较大小)
         */
        public static isTwelveEight(cards: Array<number>): number {
            if (cards.length != 20)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);
            let card13 = Math.floor(ncs[11] / 4);
            let card14 = Math.floor(ncs[11] / 4);
            let card15 = Math.floor(ncs[11] / 4);
            let card16 = Math.floor(ncs[11] / 4);
            let card17 = Math.floor(ncs[11] / 4);
            let card18 = Math.floor(ncs[11] / 4);
            let card19 = Math.floor(ncs[11] / 4);
            let card20 = Math.floor(ncs[11] / 4);

            let start: number = 0;

            // 555666777888-99JJQQKK
            if (card1 == card3
                && card4 == card6
                && card7 == card9
                && card10 == card12
                && card4 - card1 == 1
                && card7 - card4 == 1
                && card10 - card7 == 1
                && card13 == card14
                && card15 == card16
                && card17 == card18
                && card19 == card20) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 44-555666777888-JJQQKK
            if (card3 == card5
                && card6 == card8
                && card9 == card11
                && card12 == card14
                && card6 - card3 == 1
                && card9 - card6 == 1
                && card12 - card9 == 1
                && card1 == card2
                && card15 == card16
                && card17 == card18
                && card19 == card20) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 3344-555666777888-QQKK
            if (card5 == card7
                && card8 == card10
                && card11 == card13
                && card14 == card16
                && card8 - card5 == 1
                && card11 - card8 == 1
                && card14 - card11 == 1
                && card1 == card2
                && card3 == card4
                && card17 == card18
                && card19 == card20) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            // 333344-555666777888-KK
            if (card7 == card9
                && card10 == card12
                && card13 == card15
                && card16 == card18
                && card10 - card7 == 1
                && card13 - card10 == 1
                && card16 - card13 == 1
                && card1 == card2
                && card3 == card4
                && card5 == card6
                && card19 == card20) {
                start = this.unAbsoluteCard(ncs[6]);
            }
            // 33334444-555666777888
            if (card9 == card11
                && card12 == card14
                && card15 == card17
                && card18 == card20
                && card12 - card9 == 1
                && card15 - card12 == 1
                && card18 - card15 == 1
                && card1 == card2
                && card3 == card4
                && card5 == card6
                && card7 == card8) {
                start = this.unAbsoluteCard(ncs[8]);
            }
            return start;
        }

        /**
         * 是不是十五带五
         * @param cards 
         * @returns 0 - 不是十五带五,abs - 十五带五起始牌值(比如55566677788899JJQQKK,返回5,用于比较大小)
         */
        public static isFifteenFive(cards: Array<number>): number {
            if (cards.length != 20)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);
            let card13 = Math.floor(ncs[12] / 4);
            let card14 = Math.floor(ncs[13] / 4);
            let card15 = Math.floor(ncs[14] / 4);
            let card16 = Math.floor(ncs[15] / 4);
            let card17 = Math.floor(ncs[16] / 4);
            let card18 = Math.floor(ncs[17] / 4);
            let card19 = Math.floor(ncs[18] / 4);
            let card20 = Math.floor(ncs[19] / 4);

            let start: number = 0;

            // 555666777888999-JJQQK
            if (card1 == card3
                && card4 == card6
                && card7 == card9
                && card10 == card12
                && card13 == card15
                && card4 - card1 == 1
                && card7 - card4 == 1
                && card10 - card7 == 1
                && card13 - card10 == 1) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 4-555666777888999-JJQQ
            if (card2 == card4
                && card5 == card7
                && card8 == card10
                && card11 == card13
                && card14 == card16
                && card5 - card2 == 1
                && card8 - card5 == 1
                && card11 - card8 == 1
                && card14 - card11 == 1) {
                start = this.unAbsoluteCard(ncs[1]);
            }
            // 44-555666777888999-JJQ
            if (card3 == card5
                && card6 == card8
                && card9 == card11
                && card12 == card14
                && card15 == card17
                && card6 - card3 == 1
                && card9 - card6 == 1
                && card12 - card9 == 1
                && card15 - card12 == 1) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 344-555666777888999-JJ
            if (card4 == card7
                && card7 == card9
                && card10 == card12
                && card13 == card15
                && card16 == card18
                && card7 - card4 == 1
                && card10 - card7 == 1
                && card13 - card10 == 1
                && card16 - card13 == 1) {
                start = this.unAbsoluteCard(ncs[3]);
            }
            // 3344-555666777888999-J
            if (card5 == card8
                && card8 == card10
                && card11 == card13
                && card14 == card16
                && card17 == card19
                && card8 - card5 == 1
                && card11 - card8 == 1
                && card14 - card11 == 1
                && card17 - card14 == 1) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            // 33344-555666777888999
            if (card6 == card9
                && card9 == card11
                && card12 == card14
                && card15 == card17
                && card18 == card20
                && card9 - card6 == 1
                && card12 - card9 == 1
                && card15 - card12 == 1
                && card18 - card15 == 1) {
                start = this.unAbsoluteCard(ncs[5]);
            }
            return start;
        }

        /**
         * 是不是八带四
         * @param cards 
         * @returns 0 - 不是八带四,abs - 八带四起始牌值(比如555566667788,返回5,用于比较大小)
         */
        public static isEightFour(cards: Array<number>): number {
            if (cards.length != 12)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);

            let start = 0;

            // 55556666-789J
            if (card1 == card4
                && card5 == card8
                && card5 - card1 == 1) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 34-55556666-78
            if (card3 == card6
                && card7 == card10
                && card7 - card3 == 1) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 3344-55556666
            if (card5 == card8
                && card9 == card12
                && card9 - card5 == 1) {
                start = this.unAbsoluteCard(ncs[4]);
            }

            return start;
        }

        /**
         * 是不是八带八
         * @param cards 
         * @returns 0 - 不是八带八,abs - 八带八起始牌值(比如55556666778899JJ,返回5,用于比较大小)
         */
        public static isEightEight(cards: Array<number>): number {
            if (cards.length != 16)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);
            let card13 = Math.floor(ncs[12] / 4);
            let card14 = Math.floor(ncs[13] / 4);
            let card15 = Math.floor(ncs[14] / 4);
            let card16 = Math.floor(ncs[15] / 4);

            let start = 0;

            // 55556666-778899JJ
            if (card1 == card4
                && card5 == card8
                && card5 - card1 == 1
                && card9 == card10
                && card11 == card12
                && card13 == card14
                && card15 == card16) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 44-55556666-778899
            if (card3 == card6
                && card7 == card10
                && card7 - card3 == 1
                && card1 == card2
                && card11 == card12
                && card13 == card14
                && card15 == card16) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 3344-55556666-7788
            if (card5 == card8
                && card9 == card12
                && card9 - card5 == 1
                && card1 == card2
                && card3 == card4
                && card13 == card14
                && card15 == card16) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            // 333344-55556666-77
            if (card7 == card10
                && card11 == card14
                && card11 - card7 == 1
                && card1 == card2
                && card3 == card4
                && card5 == card6
                && card15 == card16) {
                start = this.unAbsoluteCard(ncs[6]);
            }
            // 22333344-55556666
            if (card9 == card12
                && card13 == card16
                && card13 - card9 == 1
                && card1 == card2
                && card3 == card4
                && card5 == card6
                && card7 == card8) {
                start = this.unAbsoluteCard(ncs[8]);
            }

            return start;
        }

        /**
         * 是不是十二带六
         * @param cards 
         * @returns 0 - 不是十二带六,abs - 十二带六起始牌值(比如5555666677778899JJ,返回5,用于比较大小)
         */
        public static isTwelveSix(cards: Array<number>): number {
            if (cards.length != 16)
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
            let card11 = Math.floor(ncs[10] / 4);
            let card12 = Math.floor(ncs[11] / 4);
            let card13 = Math.floor(ncs[12] / 4);
            let card14 = Math.floor(ncs[13] / 4);
            let card15 = Math.floor(ncs[14] / 4);
            let card16 = Math.floor(ncs[15] / 4);
            let card17 = Math.floor(ncs[16] / 4);
            let card18 = Math.floor(ncs[17] / 4);

            let start: number = 0;

            // 555566667777-8899JJ
            if (card1 == card4
                && card5 == card8
                && card9 == card12
                && card5 - card1 == 1
                && card9 - card5 == 1
                && card13 == card14
                && card15 == card16
                && card17 == card18) {
                start = this.unAbsoluteCard(ncs[0]);
            }
            // 44-555566667777-8899
            if (card3 == card6
                && card7 == card10
                && card11 == card14
                && card7 - card3 == 1
                && card11 - card7 == 1
                && card1 == card2
                && card15 == card16
                && card17 == card18) {
                start = this.unAbsoluteCard(ncs[2]);
            }
            // 3344-555566667777-88
            if (card5 == card8
                && card9 == card12
                && card13 == card16
                && card9 - card5 == 1
                && card13 - card9 == 1
                && card1 == card2
                && card3 == card4
                && card17 == card18) {
                start = this.unAbsoluteCard(ncs[4]);
            }
            // 223344-555566667777
            if (card7 == card10
                && card11 == card14
                && card15 == card18
                && card11 - card7 == 1
                && card15 - card11 == 1
                && card1 == card2
                && card3 == card4
                && card5 == card6) {
                start = this.unAbsoluteCard(ncs[6]);
            }

            return start;
        }

        /**
         * 验证cards 是否在 boundyCards 范围内
         * @param cards 
         * @param boundyCards 
         */
        public static validateBoundy(cards: Array<number>, boundyCards: Array<number>): boolean {
            if (!cards || cards.length == 0) return true;
            if (!boundyCards) return false;

            for (let i = 0; i < cards.length; i++) {
                if (cards[i] > 55 || cards[i] < 2) return false;
                let isFind: boolean = false;
                for (let k = 0; k < boundyCards.length; k++) {
                    if (cards[i] == boundyCards[k]) {
                        isFind = true;
                        break;
                    }
                }
                if (!isFind) return false;
            }
            return true;
        }

        /**
         * 验证 cards 是否符合牌型规则
         * @param cards 
         */
        public static validateRule(cards: Array<number>): boolean {
            if (!cards) return false;
            let length: number = cards.length;
            // 单张
            if (length == 1) {
                return true;
            }
            // 对子/王炸
            else if (length == 2 && (this.isPair(cards) || this.isKingBomb(cards))) {
                return true;
            }
            // 三条
            else if (length == 3 && this.isTripleton(cards)) {
                return true;
            }
            // 三带一/普通炸
            else if (length == 4 && (this.isThreeOne(cards) > 0 || this.isFourBomb(cards))) {
                return true;
            }
            // 三带二
            else if (length == 5 && this.isThreeTwo(cards) > 0) {
                return true;
            }
            // 四带二
            else if (length == 6 && this.isFourTwo(cards) > 0) {
                return true;
            }
            // 四带四/六带二
            else if (length == 8 && (this.isFourFour(cards) > 0 || this.isSixTwo(cards) > 0)) {
                return true;
            }
            // 六带四
            else if (length == 10 && this.isSixFour(cards) > 0) {
                return true;
            }
            // 单顺/双顺/三顺/四顺
            else if (length > 4 && (this.isStraight(cards) > 0 || this.isStraight2(cards) > 0 || this.isStraight3(cards) > 0 || this.isStraight4(cards) > 0)) {
                return true;
            }
            // 九带三/八带四
            else if (length == 12 && (this.isNineThree(cards) > 0 || this.isEightFour(cards) > 0)) {
                return true;
            }
            // 九带六
            else if (length == 15 && this.isNineSix(cards) > 0) {
                return true;
            }
            // 八带八/十二带四
            else if (length == 16 && (this.isNineSix(cards) > 0 || this.isTwelveFour(cards) > 0)) {
                return true;
            }
            // 十二带六
            else if (length == 18 && this.isTwelveSix(cards) > 0) {
                return true;
            }
            // 十五带五
            else if (length == 20 && (this.isFifteenFive(cards) > 0) || this.isTwelveEight(cards) > 0) {
                return true;
            }
            return false;
        }

        /**
         * 比较牌大小
         * @param ocards 对手的牌
         * @param dcards 自己要出的牌
         * @returns 0 dcards = ocards, 1 dcards > ocards, -1 dcards < ocards, -2 不符合出牌规则
         */
        public static compareCards(ocards: Array<number>, dcards: Array<number>): number {
            if (!ocards || ocards.length == 0) {
                if (this.validateRule(dcards)) {
                    return 1;
                }
                return -2;
            }

            // 炸弹
            if (!this.isBomb(ocards) && this.isBomb(dcards)) {
                return 1;
            }
            else if (this.isBomb(ocards) && this.isBomb(dcards)) {
                if (this.isKingBomb(dcards)) {
                    return 1;
                }
                else {
                    if (ocards[0] > dcards[0]) {
                        return -1;
                    }
                    else if (ocards[0] < dcards[0]) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            }
            else if (this.isBomb(ocards) && !this.isBomb(dcards)) {
                return -2;
            }

            // 牌数
            if (ocards.length != dcards.length) return -2;

            // 单张
            if (ocards.length == 1) {
                return this._compareSingleCard(ocards[0], dcards[0]);
            }

            // 对子
            if (this.isPair(ocards)) {
                if (!this.isPair(dcards)) return -2;
                return this._compareSingleCard(ocards[0], dcards[0]);
            }

            // 三条
            if (this.isTripleton(ocards)) {
                if (!this.isPair(dcards)) return -2;
                return this._compareSingleCard(ocards[0], dcards[0]);
            }

            let ostart = 0;
            let dstart = 0;

            // 三带一
            ostart = this.isThreeOne(ocards);
            if (ostart > 0) {
                dstart = this.isThreeOne(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 三带二
            ostart = this.isThreeTwo(ocards);
            if (ostart > 0) {
                dstart = this.isThreeTwo(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 四带二
            ostart = this.isFourTwo(ocards);
            if (ostart > 0) {
                dstart = this.isFourTwo(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 四带四
            ostart = this.isFourFour(ocards);
            if (ostart > 0) {
                dstart = this.isFourFour(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 六带二
            ostart = this.isSixTwo(ocards);
            if (ostart > 0) {
                dstart = this.isSixTwo(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 六带四
            ostart = this.isSixFour(ocards);
            if (ostart > 0) {
                dstart = this.isSixFour(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 单顺
            ostart = this.isStraight(ocards);
            if (ostart > 0) {
                dstart = this.isStraight(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 双顺
            ostart = this.isStraight2(ocards);
            if (ostart > 0) {
                dstart = this.isStraight2(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 三顺
            ostart = this.isStraight3(ocards);
            if (ostart > 0) {
                dstart = this.isStraight3(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 四顺
            ostart = this.isStraight4(ocards);
            if (ostart > 0) {
                dstart = this.isStraight4(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 九带三
            ostart = this.isNineThree(ocards);
            if (ostart > 0) {
                dstart = this.isNineThree(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 九带六
            ostart = this.isNineSix(ocards);
            if (ostart > 0) {
                dstart = this.isNineSix(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 八带四
            ostart = this.isEightFour(ocards);
            if (ostart > 0) {
                dstart = this.isEightFour(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 八带八
            ostart = this.isEightEight(ocards);
            if (ostart > 0) {
                dstart = this.isEightEight(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 十二带四
            ostart = this.isTwelveFour(ocards);
            if (ostart > 0) {
                dstart = this.isTwelveFour(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            // 十二带八
            ostart = this.isTwelveEight(ocards);
            if (ostart > 0) {
                dstart = this.isTwelveEight(ocards);
                if (dstart > 0) return this._compareStart(ostart, dstart);
                return -2;
            }

            return -2;
        }

        /**
         * 比较单牌大小
         * @param ocards 对手的牌
         * @param dcards 自己要出的牌
         * @returns 0 dcards = ocards, 1 dcards > ocards, -1 dcards < ocards
         */
        private static _compareSingleCard(ocard: number, dcard: number): number {
            let oc = Math.floor(this.absoluteCard(ocard) / 4);
            let dc = Math.floor(this.absoluteCard(dcard) / 4);
            if (oc > dc) return -1;
            else if (oc < dc) return 1;
            else return 0;
        }

        /**
         * 比较start值大小
         * @param ostart 对手牌的Start
         * @param dstart 自己要出牌的Start
         * @returns 0 dstart = ostart, 1 dstart > ostart, -1 dstart < ostart
         */
        private static _compareStart(ostart: number, dstart: number): number {
            if (ostart > dstart) return -1;
            else if (ostart < dstart) return 1;
            else return 0;
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
     * 牌型类型
     */
    const PatternType = cc.Enum({
        SINGLE: 0,
        PAIR: 1,
        TRIP: 2,
        BOMB: 3,
        KING_BOMB: 4,
        STRAIGHT3: 5,
        STRAIGHT2: 6,
        STRAIGHT: 7,
    });

    /**
     * 牌型
     */
    export class Pattern {
        // 牌绝对值
        public absCard: number;
        // 所有牌
        public cards: Array<number>;
        // 牌型类型
        public type: number;

        public tostring(): string {
            // 牌型
            let cpt = "";
            if (this.type == PatternType.SINGLE) cpt = "单牌"
            else if (this.type == PatternType.PAIR) cpt = "对子"
            else if (this.type == PatternType.TRIP) cpt = "三条"
            else if (this.type == PatternType.BOMB) cpt = "炸弹"
            else if (this.type == PatternType.KING_BOMB) cpt = "王炸"
            else if (this.type == PatternType.STRAIGHT3) cpt = "三顺"
            else if (this.type == PatternType.STRAIGHT2) cpt = "双顺"
            else if (this.type == PatternType.STRAIGHT) cpt = "单顺"

            // 牌
            let cs = "";
            for (let i = 0; i < this.cards.length; i++) {
                let card = this.cards[i];
                let str = "";
                if (card == 2) str = "大王"
                else if (card == 3) str = "小王"
                else if (card >= 4 && card <= 7) str = "A"
                else if (card >= 8 && card <= 11) str = "2"
                else {
                    let num = Math.floor(card / 4);
                    if (num == 11) str = "J"
                    else if (num == 12) str = "Q"
                    else if (num == 13) str = "K"
                    else str = num.toString();
                }

                cs += str;
                if (i < this.cards.length - 1) cs += ",";
            }
            return `牌型: ${cpt} - abs:${this.absCard} - 牌: ${cs}`;
        }
    }

    /**
     * 计数接口
     */
    export interface ICount {
        // 牌绝对值
        absCard: number;
        // 牌数量
        count: number;
    }

    /**
     * 牌型价值接口
     */
    export interface IValue {
        // 牌型索引
        index: number;
        // 价值
        value: number;
    }

    /**
     * 牌型方案
     */
    export interface IPatternPlan {
        // 王炸
        kingbombs?: Array<Pattern>;
        // 炸弹
        bombs?: Array<Pattern>;
        // 三条
        trips?: Array<Pattern>;
        // 三顺
        straights3?: Array<Pattern>;
        // 双顺
        straights2?: Array<Pattern>;
        // 单顺
        straights?: Array<Pattern>;
        // 对子
        pairs?: Array<Pattern>;
        // 单牌
        singles?: Array<Pattern>;
    }

    /**
     * 牌型价值
     */
    const VALUES = {
        // 单牌价值
        single: {
            "3": 1,
            "4": 1,
            "5": 1,
            "6": 1,
            "7": 1,
            "8": 1,
            "9": 1,
            "10": 1,
            "11": 2,
            "12": 3,
            "13": 4,
            "14": 4,
            "15": 6,
            "16": 8,
            "17": 8
        },
        // 对子价值
        pair: {
            "3": 4,
            "4": 4,
            "5": 5,
            "6": 5,
            "7": 5,
            "8": 5,
            "9": 6,
            "10": 6,
            "11": 7,
            "12": 8,
            "13": 9,
            "14": 10,
            "15": 12
        },
        // 三条价值
        trip: {
            "3": 9,
            "4": 9,
            "5": 10,
            "6": 10,
            "7": 11,
            "8": 11,
            "9": 12,
            "10": 12,
            "11": 13,
            "12": 13,
            "13": 15,
            "14": 18,
            "15": 20
        },
        // 单顺的价值
        straight: {
            "5": 15,
            "6": 17,
            "7": 19,
            "8": 21,
            "9": 22,
            "10": 23,
            "11": 24,
            "12": 25
        },
        // 双顺的价值
        straight2: {
            "3": 17,
            "4": 21,
            "5": 24,
            "6": 28,
            "7": 32,
            "8": 36,
            "9": 40,
            "10": 44
        },
        // 三顺的价值
        straight3: {
            "2": 18,
            "3": 24,
            "4": 30,
            "5": 36,
            "6": 42
        },
        // 炸弹
        bomb: {
            "3": 13,
            "4": 14,
            "5": 15,
            "6": 16,
            "7": 17,
            "8": 18,
            "9": 19,
            "10": 20,
            "11": 21,
            "12": 22,
            "13": 24,
            "14": 26,
            "15": 28
        },
        // 王炸
        kingBomb: 15
    };

    /**
     * AI
     */
    export class AI {

        /**
         * 第一次出牌提示
         * @param cards 
         */
        public static dcFirstAssist(cards: Array<number>): void {
            let plans = this._analysis(cards);
            let maxValue = this._calculateBestPlanIndex(plans);
            let plan = plans[maxValue.index];


        }

        /**
        * 将外部数据的牌编号,变成内部方便比较大小的绝对值
        * @param cards 
        * @returns cards 绝对值
        */
        private static _absoluteCard(card: number): number {
            // 大王
            if (card == 2) return 17;
            // 小王
            else if (card == 3) return 16;
            // A
            else if (card <= 7) return 14;
            // 2
            else if (card <= 11) return 15;
            // 3 - 10
            else return Math.floor(card / 4);
        }

        /**
         * copy cards
         * @param cards 
         */
        private static _copyCards(cards: Array<number>): Array<number> {
            let ncards: Array<number> = [];
            for (let i = 0; i < cards.length; i++) {
                ncards[i] = cards[i];
            }
            return ncards;
        }

        /**
         * copy pattern
         * @param patterns 
         */
        private static _copyPatterns(patterns: Array<Pattern>): Array<Pattern> {
            let npatterns: Array<Pattern> = [];
            for (let i = 0; i < patterns.length; i++) {
                let pattern = new Pattern();
                pattern.absCard = patterns[i].absCard;
                pattern.type = patterns[i].type;
                pattern.cards = this._copyCards(patterns[i].cards);
                npatterns.push(pattern);
            }
            return npatterns;
        }

        /**
         * copy IPattern
         * @param patterns 
         */
        private static _copyIPatterns(patterns: IPatternPlan): IPatternPlan {
            let npatterns: IPatternPlan = {};
            npatterns.kingbombs = this._copyPatterns(patterns.kingbombs);
            npatterns.bombs = this._copyPatterns(patterns.bombs);
            npatterns.trips = this._copyPatterns(patterns.trips);
            npatterns.straights3 = this._copyPatterns(patterns.straights3);
            npatterns.straights2 = this._copyPatterns(patterns.straights2);
            npatterns.straights = this._copyPatterns(patterns.straights);
            npatterns.pairs = this._copyPatterns(patterns.pairs);
            npatterns.singles = this._copyPatterns(patterns.singles);
            return npatterns;
        }

        /**
         * 判断对象是否存在
         * @param obj 
         */
        private static _existObj(obj: any): boolean {
            return obj != null && obj != undefined;
        }

        /**
         * 排序 Pattern
         * @param pattern1 
         * @param pattern2 
         */
        private static _comparePattern(pattern1: Pattern, pattern2: Pattern): number {
            if (pattern1.absCard > pattern2.absCard) return 1;
            else if (pattern1.absCard < pattern2.absCard) return -1;
            else return 0;
        }

        /**
         * 排序 ICount
         * @param pattern1 
         * @param pattern2 
         */
        private static _compareICount(c1: ICount, c2: ICount): number {
            if (c1.absCard > c2.absCard) return 1;
            else if (c1.absCard < c2.absCard) return -1;
            else return 0;
        }

        /**
         * 分析牌型方案
         * @param cards 
         * @returns Array<IPatternPlan>
         */
        private static _analysis(cards: Array<number>): Array<IPatternPlan> {
            console.time("_getAIPatterns");
            // 牌型方案
            let plans: Array<IPatternPlan> = [];

            let removes: Array<number> = [];
            let ncards = this._copyCards(cards);
            let map: { [index: number]: number } = {};

            //方案一,不拆三条，不拆顺子牌型
            let pat = this._normalPatternPlan(ncards);
            plans.push(pat);

            //方案二, 拆单顺子牌型
            let pat2: IPatternPlan = this._copyIPatterns(pat);
            // 完全不考虑单顺,单顺拆开，重新组合对子和单牌
            if (pat2.straights.length > 0) {
                for (let i = 0; i < pat2.straights.length; i++) {
                    let cards = pat2.straights[i].cards;
                    for (let k = 0; k < cards.length; k++) {
                        // 在单牌中查询是否可以组成对子
                        let merger: boolean = false;
                        for (let m = 0; m < pat2.singles.length; m++) {
                            let scard = pat2.singles[m].cards[0];
                            if (this._absoluteCard(scard) == this._absoluteCard(cards[k])) {
                                merger = true;
                                pat2.singles.splice(m, 1);

                                let pattern = new Pattern();
                                pattern.absCard = this._absoluteCard(cards[k]);
                                pattern.cards = [];
                                pattern.type = PatternType.PAIR;
                                pattern.cards.push(cards[k]);
                                pattern.cards.push(scard);

                                pat2.pairs.push(pattern);
                                break;
                            }
                        }
                        // 没有合成对子就放入单牌中
                        if (!merger) {
                            let pattern = new Pattern();
                            pattern.absCard = this._absoluteCard(cards[k]);
                            pattern.cards = [cards[k]];
                            pattern.type = PatternType.SINGLE;

                            pat2.singles.push(pattern);
                        }
                    }
                }

                pat2.straights = [];
            }
            plans.push(pat2);

            //方案三, 组双顺牌型(优先组双顺)
            let _pat: IPatternPlan = { straights2: [] };
            // 牌列表
            ncards = this._copyCards(cards);
            // 每张牌数量字典
            map = {};
            for (let i = 0; i < ncards.length; i++) {
                let absCard = this._absoluteCard(ncards[i]);
                map[absCard] = map[absCard] ? map[absCard] + 1 : 1;
            }
            let len: number = Math.ceil(ncards.length / 3);
            while (len > 0) {
                len--;
                // 最小3，最大A
                let c: number = 0;
                for (let i = 3; i < 15; i++) {
                    if (this._existObj(map[i])) {
                        if (map[i] >= 2) {
                            c++;
                        } else {
                            if (c >= 3) {
                                let pattern = new Pattern();
                                pattern.cards = [];
                                pattern.type = PatternType.STRAIGHT2;
                                for (let k = 0; k < c; k++) {
                                    let absCard = i - k - 1;
                                    console.log(absCard);
                                    for (let n = 0; n < 2; n++) {
                                        for (let m = 0; m < ncards.length; m++) {
                                            if (absCard == this._absoluteCard(ncards[m])) {
                                                pattern.cards.push(ncards[m])
                                                ncards.splice(m, 1);
                                                break;
                                            }
                                        }
                                    }
                                    map[absCard] -= 2;
                                }

                                pattern.cards.sort();
                                pattern.absCard = this._absoluteCard(pattern.cards[0]);
                                _pat.straights2.push(pattern);
                            }
                            c = 0;
                            break;
                        }
                    }
                    else {
                        if (c >= 3) {
                            let pattern = new Pattern();
                            pattern.cards = [];
                            pattern.type = PatternType.STRAIGHT2;

                            for (let k = 0; k < c; k++) {
                                let absCard = i - k - 1;
                                for (let n = 0; n < 2; n++) {
                                    for (let m = 0; m < ncards.length; m++) {
                                        if (absCard == this._absoluteCard(ncards[m])) {
                                            pattern.cards.push(ncards[m])
                                            ncards.splice(m, 1);
                                            break;
                                        }
                                    }
                                }
                                map[absCard] -= 2;
                            }
                            pattern.cards.sort();
                            pattern.absCard = this._absoluteCard(pattern.cards[0]);
                            _pat.straights2.push(pattern);
                        }
                        c = 0;
                        break;
                    }
                }
            }
            // 添加到牌型列表
            let pat3 = this._normalPatternPlan(ncards);
            pat3.straights2 = _pat.straights2;
            plans.push(pat3);

            //方案四, 固定单一牌型
            ncards = this._copyCards(cards);
            let pat4 = this._singlePatternPlan(ncards);
            plans.push(pat4);

            // 方案五，方案一的扩展，砍掉单顺的头尾，与单牌组成对子
            // TODO

            console.timeEnd("_getAIPatterns");
            ///////////////////// LOG //////////////////////

            for (let i = 0; i < plans.length; i++) {
                console.log("**********************************");
                console.log("牌型价值: " + this._calculatePlanValue(plans[i]));
                if (plans[i].kingbombs) {
                    for (let k = 0; k < plans[i].kingbombs.length; k++) {
                        console.log(plans[i].kingbombs[k].tostring());
                    }
                }

                if (plans[i].bombs) {
                    for (let k = 0; k < plans[i].bombs.length; k++) {
                        console.log(plans[i].bombs[k].tostring());
                    }
                }

                if (plans[i].trips) {
                    for (let k = 0; k < plans[i].trips.length; k++) {
                        console.log(plans[i].trips[k].tostring());
                    }
                }

                if (plans[i].straights3) {
                    for (let k = 0; k < plans[i].straights3.length; k++) {
                        console.log(plans[i].straights3[k].tostring());
                    }
                }

                if (plans[i].straights2) {
                    for (let k = 0; k < plans[i].straights2.length; k++) {
                        console.log(plans[i].straights2[k].tostring());
                    }
                }

                if (plans[i].straights) {
                    for (let k = 0; k < plans[i].straights.length; k++) {
                        console.log(plans[i].straights[k].tostring());
                    }
                }

                if (plans[i].pairs) {
                    for (let k = 0; k < plans[i].pairs.length; k++) {
                        console.log(plans[i].pairs[k].tostring());
                    }
                }

                if (plans[i].singles) {
                    for (let k = 0; k < plans[i].singles.length; k++) {
                        console.log(plans[i].singles[k].tostring());
                    }
                }

            }

            return plans;
        }

        /**
         * 牌型方案(第一种)
         * @param cards 
         */
        private static _normalPatternPlan(cards: Array<number>): IPatternPlan {
            let removes: Array<number> = [];
            let ncards = this._copyCards(cards);

            // 每张牌数量字典
            let map: { [index: number]: number } = {};
            for (let i = 0; i < ncards.length; i++) {
                let absCard = this._absoluteCard(ncards[i]);
                map[absCard] = map[absCard] ? map[absCard] + 1 : 1;
            }

            let pat: IPatternPlan = { kingbombs: [], bombs: [], trips: [], straights3: [], straights2: [], straights: [], pairs: [], singles: [] };

            // 双王
            if (this._existObj(map[17]) && this._existObj(map[16])) {
                map[16] = null;
                map[17] = null;

                let count = ncards.length;
                for (let i = 0; i < count; i++) {
                    if (ncards[i] == 2 || ncards[i] == 3) {
                        let index = i - (count - ncards.length)
                        ncards.splice(index, 1);
                    }
                }

                let pattern = new Pattern();
                pattern.absCard = 17;
                pattern.cards = [2, 3];
                pattern.type = PatternType.KING_BOMB;

                pat.kingbombs.push(pattern);
            }

            // 炸弹，三条
            for (let item in map) {
                let absCard = parseInt(item);
                if (this._existObj(map[absCard])) {
                    // 炸弹
                    if (map[absCard] == 4) {
                        let pattern = new Pattern();
                        pattern.absCard = absCard;
                        pattern.cards = [];
                        pattern.type = PatternType.BOMB;

                        for (let k = 0; k < 4; k++) {
                            for (let i = 0; i < ncards.length; i++) {
                                if (this._absoluteCard(ncards[i]) == absCard) {
                                    pattern.cards.push(ncards[i]);
                                    ncards.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        pat.bombs.push(pattern);
                        map[absCard] = null;
                    }
                    // 三条
                    else if (map[absCard] == 3) {
                        let pattern = new Pattern();
                        pattern.absCard = absCard;
                        pattern.cards = [];
                        pattern.type = PatternType.TRIP;

                        for (let k = 0; k < 3; k++) {
                            for (let i = 0; i < ncards.length; i++) {
                                if (this._absoluteCard(ncards[i]) == absCard) {
                                    pattern.cards.push(ncards[i]);
                                    ncards.splice(i, 1);
                                    break;
                                }
                            }
                        }
                        pat.trips.push(pattern);
                        map[absCard] = null;
                    }
                }
            }

            // 三顺
            removes = [];
            if (pat.trips.length >= 2) {
                pat.trips.sort(this._comparePattern);
                let merger: boolean = false;
                let pattern: Pattern = null;
                for (let i = 0; i < pat.trips.length - 1; i++) {
                    if (pat.trips[i + 1].absCard != 15 && pat.trips[i].absCard + 1 == pat.trips[i + 1].absCard) {
                        if (merger) {
                            for (let _c of pat.trips[i + 1].cards) {
                                pattern.cards.push(_c);
                            }

                            removes.push(i + 1);
                        } else {
                            pattern = new Pattern();
                            pattern.absCard = pat.trips[i].absCard;
                            pattern.cards = [];
                            pattern.type = PatternType.STRAIGHT3;
                            for (let _c of pat.trips[i].cards) {
                                pattern.cards.push(_c);
                            }
                            for (let _c of pat.trips[i + 1].cards) {
                                pattern.cards.push(_c);
                            }

                            pat.straights3.push(pattern);

                            removes.push(i);
                            removes.push(i + 1);
                        }
                    }
                    else {
                        merger = false;
                    }
                }

                for (let i = removes.length - 1; i >= 0; i--) {
                    pat.trips.splice(removes[i], 1);
                }
            }

            // 单顺子
            // 取剩余的牌，按照从小到大的顺序排列
            let remains: Array<ICount> = [];
            for (let item in map) {
                let absCard = parseInt(item);
                if (this._existObj(map[absCard])) {
                    let c: ICount = { absCard: absCard, count: map[item] };
                    remains.push(c);
                }
            }
            remains.sort(this._compareICount);
            // 查询单顺
            if (remains.length >= 5) {
                // 第一步,先取出最小的一个五连 再在剩余的牌中取出最小的一个五连，依此类推，直到没有五连为止
                let len = remains.length;
                while (len > 0) {
                    len--;
                    let c = 0;
                    for (let i = 1; i < remains.length; i++) {
                        if (remains[i - 1].count > 0 && remains[i].count > 0
                            && remains[i].absCard < 15
                            && remains[i - 1].absCard + 1 == remains[i].absCard) {
                            if (c == 0) c = 2;
                            else if (c == 4) {
                                let pattern = new Pattern();
                                pattern.absCard = remains[i - 4].absCard;
                                pattern.cards = [];
                                pattern.type = PatternType.STRAIGHT;
                                for (let k = 4; k >= 0; k--) {
                                    let re = remains[i - 4 + k]
                                    for (let m = 0; m < ncards.length; m++) {
                                        if (this._absoluteCard(ncards[m]) == re.absCard) {
                                            pattern.cards.push(ncards[m]);
                                            re.count -= 1;
                                            ncards.splice(m, 1);
                                            break;
                                        }
                                    }
                                }
                                pattern.cards.sort();
                                pat.straights.push(pattern);
                                break;
                            }
                            else c += 1;
                        }
                        else c = 0
                    }

                    for (let i = 0; i < remains.length; i++) {
                        if (remains[i].count <= 0) remains.splice(i, 1);
                    }
                }

                // 第二步,扩展五连
                removes = [];
                ncards.sort();
                len = ncards.length;
                while (len > 0) {
                    len--;
                    let end: boolean = false;
                    for (let i = 0; i < ncards.length; i++) {
                        let absCard = this._absoluteCard(ncards[i]);
                        if (absCard >= 15) continue;
                        for (let k = 0; k < pat.straights.length; k++) {
                            let pattern = pat.straights[k];
                            if (pattern.type != PatternType.STRAIGHT) continue;
                            // 最小一张成顺子
                            if (absCard + 1 == pattern.absCard) {
                                pattern.cards.push(ncards[i]);
                                pattern.absCard = absCard;
                                ncards.splice(i, 1);
                                end = true;
                                break;
                            }
                            // 最大一张成顺子
                            else if (pattern.absCard + pattern.cards.length == absCard) {
                                pattern.cards.push(ncards[i]);
                                ncards.splice(i, 1);
                                end = true;
                                break;
                            }
                        }
                        if (end) break;
                    }
                }

                // 第三步,无缝连接成更大的连牌(如果可能的话)
                if (pat.straights.length > 1) {
                    let len = pat.straights.length;
                    while (len > 0) {
                        len--;
                        for (let i = 0; i < pat.straights.length; i++) {
                            let end: boolean = false;
                            for (let k = i + 1; k < pat.straights.length; k++) {
                                if (pat.straights[i].absCard + pat.straights[i].cards.length == pat.straights[k].absCard) {
                                    for (let m = 0; m < pat.straights[k].cards.length; m++) {
                                        pat.straights[i].cards.push(pat.straights[k].cards[m]);
                                    }
                                    pat.straights.splice(k, 1);
                                    end = true;
                                    break;
                                }
                            }
                            if (end) break;
                        }
                    }
                }
            }

            // 双顺(单顺合双顺)
            if (pat.straights.length > 1) {
                let len = pat.straights.length;
                while (len > 0) {
                    len--;
                    for (let i = 0; i < pat.straights.length; i++) {
                        let end: boolean = false;
                        for (let k = i + 1; k < pat.straights.length; k++) {
                            if (pat.straights[i].absCard == pat.straights[k].absCard && pat.straights[i].cards.length == pat.straights[k].cards.length) {
                                let pattern = new Pattern();
                                pattern.absCard = pat.straights[i].absCard;
                                pattern.cards = [];
                                pattern.type = PatternType.STRAIGHT2;
                                for (let m = 0; m < pat.straights[i].cards.length; m++) {
                                    pattern.cards.push(pat.straights[i].cards[m]);
                                }
                                for (let m = 0; m < pat.straights[k].cards.length; m++) {
                                    pattern.cards.push(pat.straights[k].cards[m]);
                                }
                                pattern.cards.sort();
                                pat.straights2.push(pattern);

                                pat.straights.splice(k, 1);
                                pat.straights.splice(i, 1);
                                end = true;
                                break;
                            }
                        }
                        if (end) break;
                    }
                }
            }

            // 对子
            map = {};
            for (let i = 0; i < ncards.length; i++) {
                let absCard = this._absoluteCard(ncards[i]);
                map[absCard] = map[absCard] ? map[absCard] + 1 : 1;
            }
            for (let item in map) {
                if (map[item] == 2) {
                    let pattern = new Pattern();
                    pattern.absCard = parseInt(item);
                    pattern.cards = [];
                    pattern.type = PatternType.PAIR;

                    for (let k = 0; k < 2; k++) {
                        for (let m = 0; m < ncards.length; m++) {
                            if (this._absoluteCard(ncards[m]) == pattern.absCard) {
                                pattern.cards.push(ncards[m]);
                                ncards.splice(m, 1);
                                break;
                            }
                        }
                    }
                    pat.pairs.push(pattern);
                }
            }

            // 双顺(对子合双顺)
            if (pat.pairs.length > 2) {
                removes = [];

                let c = 0;
                let pattern: Pattern = null;
                for (let i = 0; i < pat.pairs.length - 1; i++) {
                    if (pat.pairs[i + 1].absCard != 15 && pat.pairs[i].absCard + 1 == pat.pairs[i + 1].absCard) {
                        if (c == 0) c = 2;
                        else if (c == 2) {
                            c = 3;

                            pattern = new Pattern();
                            pattern.absCard = pat.pairs[i - 1].absCard;
                            pattern.cards = [];
                            pattern.type = PatternType.STRAIGHT2;

                            for (let m = 0; m < pat.pairs[i - 1].cards.length; m++) {
                                pattern.cards.push(pat.pairs[i - 1].cards[m]);
                            }
                            for (let m = 0; m < pat.pairs[i].cards.length; m++) {
                                pattern.cards.push(pat.pairs[i].cards[m]);
                            }
                            for (let m = 0; m < pat.pairs[i + 1].cards.length; m++) {
                                pattern.cards.push(pat.pairs[i + 1].cards[m]);
                            }

                            pat.straights2.push(pattern);

                            removes.push(i - 1);
                            removes.push(i);
                            removes.push(i + 1);
                        }
                        else {
                            c += 1;
                            for (let m = 0; m < pat.pairs[i + 1].cards.length; m++) {
                                pattern.cards.push(pat.pairs[i + 1].cards[m]);
                            }
                            removes.push(i + 1);
                        }
                    }
                    else c = 0;
                }

                for (let i = removes.length - 1; i >= 0; i--) {
                    pat.pairs.splice(removes[i], 1);
                }
            }

            // 单牌
            for (let i = 0; i < ncards.length; i++) {
                let pattern = new Pattern();
                pattern.absCard = this._absoluteCard(ncards[i]);
                pattern.cards = [ncards[i]];
                pattern.type = PatternType.SINGLE;

                pat.singles.push(pattern);
            }
            pat.singles.sort(this._comparePattern);

            return pat;
        }

        /**
         * 牌型方案(第二种)
         * @param cards 
         */
        private static _singlePatternPlan(cards: Array<number>): IPatternPlan {
            let patterns: Array<Pattern> = [];
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                let absCard = this._absoluteCard(card);
                let insert = false;
                for (let k = 0; k < patterns.length; k++) {
                    let pattern = <Pattern>patterns[k];
                    if (pattern.absCard == absCard) {
                        pattern.cards.push(card);
                        if (pattern.type == PatternType.SINGLE) {
                            pattern.type = PatternType.PAIR;
                        } else if (pattern.type == PatternType.PAIR) {
                            pattern.type = PatternType.TRIP;
                        } else if (pattern.type == PatternType.TRIP) {
                            pattern.type = PatternType.BOMB;
                        }
                        insert = true;
                        break;
                    }
                }
                if (!insert) {
                    let pattern = new Pattern();
                    pattern.absCard = absCard;
                    pattern.cards = [card];
                    pattern.type = PatternType.SINGLE;

                    patterns.push(pattern);
                }
            }

            // 大小王重新分析
            let kings: Array<number> = [];
            for (let i = 0; i < patterns.length; i++) {
                let pattern = patterns[i];
                if (pattern.absCard == 16) {
                    kings.push(i);
                }
                else if (pattern.absCard == 17) {
                    kings.push(i);
                }
                if (kings.length == 2) break;
            }
            if (kings.length == 2) {
                patterns[kings[0]].type = PatternType.KING_BOMB;
                patterns[kings[0]].cards.push(patterns[kings[1]].cards[0]);
                patterns.splice(kings[1], 1);
            }

            // 牌型方案
            let plan: IPatternPlan = { singles: [], pairs: [], trips: [], bombs: [], kingbombs: [] };
            for (let k = 0; k < patterns.length; k++) {
                if (patterns[k].type == PatternType.SINGLE) {
                    plan.singles.push(patterns[k]);
                } else if (patterns[k].type == PatternType.PAIR) {
                    plan.pairs.push(patterns[k]);
                } else if (patterns[k].type == PatternType.TRIP) {
                    plan.trips.push(patterns[k]);
                } else if (patterns[k].type == PatternType.BOMB) {
                    plan.bombs.push(patterns[k]);
                } else if (patterns[k].type == PatternType.KING_BOMB) {
                    plan.kingbombs.push(patterns[k]);
                }
            }

            return plan
        }

        /**
         * 计算牌型分析方案里最好牌型索引
         * @param plans 
         */
        private static _calculateBestPlanIndex(plans: Array<IPatternPlan>): IValue {
            let maxValue: IValue = { index: 0, value: 0 };
            for (let i = 0; i < plans.length; i++) {
                let sumValue: number = this._calculatePlanValue(plans[i]);
                if (maxValue.value < sumValue) {
                    maxValue.value = sumValue;
                    maxValue.index = i;
                }
            }
            return maxValue;
        }

        /**
         * 计算牌型方案的价值
         * @param plan 
         */
        private static _calculatePlanValue(plan: IPatternPlan): number {
            let sumValue: number = 0;
            if (plan.kingbombs) {
                for (let k = 0; k < plan.kingbombs.length; k++) {
                    sumValue += VALUES.kingBomb;
                }
            }

            if (plan.bombs) {
                for (let k = 0; k < plan.bombs.length; k++) {
                    sumValue += VALUES.bomb[plan.bombs[k].absCard];
                }
            }

            if (plan.trips) {
                for (let k = 0; k < plan.trips.length; k++) {
                    sumValue += VALUES.trip[plan.trips[k].absCard];
                }
            }

            if (plan.straights3) {
                for (let k = 0; k < plan.straights3.length; k++) {
                    sumValue += VALUES.straight3[Math.ceil(plan.straights3[k].cards.length / 3)];
                }
            }

            if (plan.straights2) {
                for (let k = 0; k < plan.straights2.length; k++) {
                    sumValue += VALUES.straight2[Math.ceil(plan.straights3[k].cards.length / 2)];
                }
            }

            if (plan.straights) {
                for (let k = 0; k < plan.straights.length; k++) {
                    sumValue += VALUES.straight[Math.ceil(plan.straights[k].cards.length)];
                }
            }

            if (plan.pairs) {
                for (let k = 0; k < plan.pairs.length; k++) {
                    sumValue += VALUES.pair[plan.pairs[k].absCard];
                }
            }

            if (plan.singles) {
                for (let k = 0; k < plan.singles.length; k++) {
                    sumValue += VALUES.single[plan.singles[k].absCard];
                }
            }
            return sumValue;
        }

        /**M 
         * 方案牌型下的牌进行排序
         * @param plan 
         * @param remainCards 
         */
        private static _sortPlan(plan: IPatternPlan, remainCards: Array<number>) {

        }

        public static test(cards: Array<number>) {
            this._analysis(cards);
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
