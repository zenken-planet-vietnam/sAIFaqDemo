/* eslint-disable constructor-super */
/* eslint-disable no-unused-vars */
import tinySegmenter from "./tinySegmenter";
import synonym from './synonymDictionary'
export class analysis {

    // phân tích dữ liệu
    analysisData(questions) {
        let tagPackage = {
            questions: questions,
            invertedIndex: this.invertedIndex(questions)
        }
        return tagPackage
    }

    invertedIndex(questions) {
        let invertedDatas = {}
        questions.forEach(element => {
            let words = tinySegmenter.segmentNoneSpace(element.label)
            words.forEach(word => {
                let wordTrim = word.toLowerCase().trim()
                if (wordTrim.length > 0) {
                    if (!invertedDatas[wordTrim])
                        invertedDatas[wordTrim] = {
                            text: wordTrim,
                            ids: [element.id]
                        }
                    else {
                        invertedDatas[wordTrim].ids.push(element.id)
                    }
                }
            });
        });
        for (let element in invertedDatas) {
            invertedDatas[element].synonyms = this.getSynonym(element)
        }
        return invertedDatas
    }
    // get synonym
    getSynonym(word) {
        let synonyms = []
        for (let item in synonym) {
            if (item.toLowerCase() === word) {
                synonyms.push(synonym[item])
            }
            if (synonym[item] === word) {
                synonyms.push(item)
            }
        }
        return synonyms
    }

}