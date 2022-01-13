/* eslint-disable constructor-super */
/* eslint-disable no-unused-vars */
import tinySegmenter from "./tinySegmenter";
import synonym from './synonymDictionary'
export class analysis {

    // analys data
    analysisData(questions: any) {
        const tagPackage: any = {
            questions: questions,
            invertedIndex: this.invertedIndex(questions)
        }
        return tagPackage
    }
    // get invertedindex from list of question
    invertedIndex(questions: any) {
        const invertedDatas: any = {}
        const documents: any = []
        // create documents from term of list question
        questions.forEach((element: any) => {
            const document: any = {}
            const words = tinySegmenter.removeStopWord(element.label)
            document.id = element.id
            document.terms = []
            words.forEach((word: any) => {
                const wordTrim = word.toLowerCase().trim()
                if (wordTrim.length > 0) {
                    document.terms.push(wordTrim)
                }

            });
            documents.push(document)
        });
        // inverted_index and calculate weight term in document using tf-idf 
        documents.forEach((document: any) => {
            document.terms.forEach((word: any) => {
                const script = {
                    id: document.id,
                    weight: this.tf_idf(word, document, documents)
                }
                if (!invertedDatas[word])
                    invertedDatas[word] = {
                        text: word,
                        scripts: [
                            script
                        ],
                        // get synonyms from word
                        synonyms: this.getSynonym(word)
                    }
                else {
                    invertedDatas[word].scripts.push(
                        script
                    )
                }

            });
        });
        // get synonym
        // for (let element in invertedDatas) {
        //     invertedDatas[element].synonyms = this.getSynonym(element)
        // }
        return invertedDatas
    }
    // get synonym
    getSynonym(word: any) {
        const synonyms: any = []
        for (const item in synonym) {
            if (item.toLowerCase() === word) {
                synonyms.push((synonym as any)[item])
            }
            if ((synonym as any)[item] === word) {
                synonyms.push(item)
            }
        }
        return synonyms
    }
    // term frequence in doc
    tf(term: any, doc: any) {
        let result = 0
        doc.terms.forEach((word: any) => {
            if (word == term)
                result += 1
        });
        return result / doc.terms.length
    }
    // term inverse document frequency
    idf(term: any, docs: any) {
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
    tf_idf(term: any, doc: any, docs: any) {
        return this.tf(term, doc) * this.idf(term, docs)
    }
}