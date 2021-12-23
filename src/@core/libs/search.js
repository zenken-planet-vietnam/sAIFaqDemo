/* eslint-disable no-unused-vars */
import tinySegmenter from "./tinySegmenter"
class BaseSearch {
    search(query = '') { }
}

export class FullTextSearch extends BaseSearch {
    constructor(scriptData) {
        super(scriptData)
        this.scriptData = scriptData
        this.levenWords = []
    }
    // query: text input for search
    //tags : keyword for search
    search(query = '', tags = []) {
        if (query.length < 1 && tags.length === 0) {
            return {
                questions: this.scriptData.questions,
                words: []
            }
        }
        let words = tinySegmenter.segmentNoneSpace(query)
        tags.forEach(element => {
            words.push(element.text)
        });
        let results = this.checkTextIncludeWords(words)
        // results = results.sort((x, y) => y.weight - x.weight)
        let questions = this.scriptData.questions.filter(x => results.find(y => y === x.id) !== undefined)
        return {
            questions,
            words: [...words, ...this.levenWords]
        }
    }
    // check document include list word 
    checkTextIncludeWords(words) {
        let results = []
        for (let i = 0; i < words.length; i++) {
            const element = words[i];
            let result = []
            for (let word in this.scriptData.invertedIndex) {
                let invertedData = this.scriptData.invertedIndex[word]
                // check synonym and add synonym to list search
                let isSynonym = this.checkSynonym(element, invertedData.synonyms, word)
                if (word.includes(element) || isSynonym || this.levenshteinDistance(word, element)) {
                    invertedData.scripts.forEach(item => {
                        let script = result.find(x => x.id === item.id)
                        if (!script) result.push(item)
                        else if (script.weight < item.weight) script.weight = item.weight
                    });
                }
            }
            results.push(result)
        }
        let expectResults = this.getGeneralItem(results)
        expectResults.sort((a, b) => {
            return b.weight - a.weight
        })
        return expectResults.map(x => x.id)
    }
    //get documemt contains all text
    getGeneralItem(items) {
        if (items.length === 0) return []
        if (items.length === 1) return items[0]
        let results = []
        for (let i = 0; i < items[0].length; i++) {
            const element = items[0][i];
            let isContain = true
            for (let j = 1; j < items.length; j++) {
                const item = items[j];
                if (item.find(x => x.id == element.id) === undefined) {
                    isContain = false
                    break;
                }
            }
            if (isContain) results.push(element)
        }
        return results
    }
    //levenshteinDistance algorithm copy right 
    levenshteinDistance(str1 = '', str2 = '') {
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) {
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
            track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
            for (let i = 1; i <= str1.length; i += 1) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1, // deletion
                    track[j - 1][i] + 1, // insertion
                    track[j - 1][i - 1] + indicator, // substitution
                );
            }
        }
        let value = 1 - track[str2.length][str1.length] * 2 / (str1.length + str2.length);
        if (value > 0.5) {
            this.levenWords.push(str1)
            return true
        }
        return false
    }

    // check synonym with text
    checkSynonym(text, synonyms) {
        if (synonyms.length < 1) return false
        if (synonyms.indexOf(text) !== -1) {
            synonyms.forEach(element => {
                if (this.levenWords.indexOf(element) === -1)
                    this.levenWords.push(element)
            });
            return true
        }
        return false
    }
}