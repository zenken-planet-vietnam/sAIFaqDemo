export default{
    "ENQUETE_RESOLVED_TITLE": "Please let us know your opinions and requests for future service improvement",
    "ENQUETE_RESOLVED_MESSAGE": "Thank you for participating in the questionnaire. <br /> We will continue to use it to improve our services, so we look forward to your continued support.",
    "ENQUETE_UNRESOLVED_TITLE": "Please let us know your opinions and requests for future service improvement",
    "ENQUETE_UNRESOLVED_MESSAGE": "Thank you for your help. We will use your opinions and requests for improvement.",
    "ENQUETE_SET": {
        "RESOLVED": [
            {
                "index": 1,
                "required": false,
                "type": "radio",
                "title": "Please tell me the reason for the solution.",
                "description": "",
                "choices": [
                    {
                        "value": "1",
                        "label": "There was an answer I was looking for"
                    },
                    {
                        "value": "2",
                        "label": "There was no answer, but there was a similar answer"
                    },
                    {
                        "value": "3",
                        "label": "Resolved regardless of the content of the answer"
                    }
                ]
            },
            {
                "index": 2,
                "required": false,
                "type": "textarea",
                "title": "If you have any other requests, please fill in.",
                "description": "例：OOに関する質問を追加して欲しい",
                "choices": []
            },
            {
                "index": 3,
                "required": false,
                "type": "checkbox",
                "title": "What are your thoughts?",
                "description": "",
                "choices": [
                    {
                        "value": "1",
                        "label": "It was very good"
                    },
                    {
                        "value": "2",
                        "label": "it was good"
                    },
                    {
                        "value": "3",
                        "label": "ordinary"
                    },
                    {
                        "value": "4",
                        "label": "Use in the future"
                    },
                    {
                        "value": "5",
                        "label": "Will not be used in the future"
                    }
                ]
            }
        ],
        "UNRESOLVED": [
            {
                "index": 1,
                "required": true,
                "type": "radio",
                "title": "Please tell me the reason for the solution.",
                "description": "",
                "choices": [
                    {
                        "value": "1",
                        "label": "There was an answer I was looking for"
                    },
                    {
                        "value": "2",
                        "label": "There was no answer, but there was a similar answer"
                    },
                    {
                        "value": "3",
                        "label": "Resolved regardless of the content of the answer"
                    }
                ]
            },
            {
                "index": 2,
                "required": false,
                "type": "textarea",
                "title": "If you have any other requests, please fill in.",
                "description": "例：OOに関する質問を追加して欲しい",
                "choices": []
            },
            {
                "index": 3,
                "required": true,
                "type": "checkbox",
                "title": "What are your thoughts?",
                "description": "",
                "choices": [
                    {
                        "value": "1",
                        "label": "It was very good"
                    },
                    {
                        "value": "2",
                        "label": "it was good"
                    },
                    {
                        "value": "3",
                        "label": "ordinary"
                    },
                    {
                        "value": "4",
                        "label": "Use in the future"
                    },
                    {
                        "value": "5",
                        "label": "Will not be used in the future"
                    }
                ]
            }
        ]
    }
}
