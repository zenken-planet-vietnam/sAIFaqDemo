/* eslint-disable constructor-super */
/* eslint-disable no-unused-vars */
import tinySegmenter from "./tinySegmenter";
import synonym from './synonymDictionary'
export class analysis {

    // analys data
    analysisData(questions) {
        let tagPackage = {
            questions: questions,
            invertedIndex: this.invertedIndex(questions)
        }
        return tagPackage
    }
    // get invertedindex from list of question
    invertedIndex(questions) {
        let invertedDatas = {}
        let documents = []
        // create document from term of list question
        questions.forEach(element => {
            let document = {}
            let words = tinySegmenter.segmentNoneSpace(element.label)
            document.id = element.id
            document.terms = []
            words.forEach(word => {
                let wordTrim = word.toLowerCase().trim()
                if (wordTrim.length > 0) {
                    document.terms.push(wordTrim)
                }

            });
            documents.push(document)
        });
        // inverted_index and calculate weight tf-idf term in document
        documents.forEach(document => {
            document.terms.forEach(word => {
                if (!invertedDatas[word])
                    invertedDatas[word] = {
                        text: word,
                        scripts: [
                            {
                                id: document.id,
                                weight: this.tf_idf(word, document, documents)
                            }
                        ],

                    }
                else {
                    invertedDatas[word].scripts.push(
                        {
                            id: document.id,
                            weight: this.tf_idf(word, document, documents)
                        }
                    )
                }
            });
        });
        // get synonym
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
    // term frequence in doc
    tf(term, doc) {
        let result = 0
        doc.terms.forEach(word => {
            if (word == term)
                result += 1
        });
        return result / doc.terms.length
    }
    // term inverse document frequency
    idf(term, docs) {
        let result = 0
        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            for (let j = 0; j < doc.terms.length; j++) {
                const word = doc.terms[j];
                if (word === term) {
                    result += 1
                    break
                }
            }

        }
        return Math.log(docs.length / result)
    }
    // tf-idf
    tf_idf(term, doc, docs) {
        return this.tf(term, doc) * this.idf(term, docs)
    }
}