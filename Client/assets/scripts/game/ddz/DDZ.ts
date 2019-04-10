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
     * 出牌提示
     * - 牌的对应关系
     * - 3-10 = 3 - 10
     * - J    = 11
     * - Q    = 12
     * - K    = 13
     * - A    = 14
     * - 2    = 15
     * - 小王 = 16
     * - 大王 = 17
     */
    export class Assist {
        /**
         * 第一手出牌提示
         * @param cards 自己手中牌
         */
        public static firstDiscard(cards: Array<number>): Array<Array<number>> {
            return null;
        }

        /**
         * 多选只能提示
         * @param ocards 
         * @param cards 
         */
        public static specialDiscard(ocards: Array<number>, cards: Array<number>): Array<Array<number>> {
            return null;
        }


        /**
         * 压牌提示
         * @param ocards 对手出的牌
         * @param cards 自己手中牌
         */
        public static discard(ocards: Array<number>, cards: Array<number>): Array<Array<number>> {
            return null;
        }

        /**
         * 补全提示
         * @param ocards 对手出的牌
         * @param cards 自己手中牌
         */
        public static competion(ocards: Array<number>, cards: Array<number>, dequeueCards: Array<number>): Array<number> {
            return null;
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
         * 牌型分析(完全不考虑顺子)
         * @param cards 
         */
        private static _analysis(cards: Array<number>): void {

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
