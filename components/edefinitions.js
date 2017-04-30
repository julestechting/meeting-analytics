/*
 * Provide default definitions for the engine structure
 */

export const eDefaultParams = {
    defaultDuration: 1,
    defaultDurationUnit: 'Y',
    owner: 'default',
    hideFooter: false
};

export const eIndices = [
  {
    index: "meetings",
    type: "meeting",
    body: {
      "aliases": {
        "meetings": {}
      }
    }
  },
  {
    index: "attendances",
    type: "attendance",
    body: {
      "mappings": {
        "attendance": {
          "properties": {
            "owner": { "type": "keyword" },
            "attendeeName": {
              "type": "text",
              "fields": {
                "ngram": {
                  "type": "text",
                  "analyzer": "ngram-analyzer"
                }
              }
            },
            "attendeeMail": {
              "type": "keyword",
              "fields": {
                "ngram": {
                  "type": "text",
                  "analyzer": "ngram-analyzer"
                }
              }
            },
            "role": { "type": "keyword" },
            "accept": { "type": "keyword"},
            "status": { "type": "keyword" },
            "organizerName": { "type": "text" },
            "organizerMail": { "type": "keyword" },
            "subject": {
              "type": "text",
              "fields": {
                "raw": { "type": "keyword" }
              }
            },
            "start": { "type": "date" }
          }
        }
      },
      "settings": {
        "analysis": {
          "analyzer": {
            "ngram-analyzer": {
              "tokenizer": "ngram-tokenizer",
              "filter": [ "lowercase" ]
            }
          },
          "tokenizer": {
            "ngram-tokenizer": {
              "type": "ngram",
              "min_gram": "3",
              "max_gram": "10",
              "token_chars": [
                "letter",
                "digit"
              ],
            }
          }
        }
      },
      "aliases": {
        "attendances": {}
      }
    }
  },
  {
    index: "params",
    type: "param",
    body: {
      "mappings": {
        "param": {
          "properties": {
            "defaultDuration": { "type": "integer" },
            "defaultDurationUnit": { "type": "keyword" },
            "owner": { "type": "keyword" },
            "hideFooter": { "type": "boolean" }
          }
        }
      },
      "aliases": {
        "params": {}
      }
    }
  }
];

export const eLIndices = {
  meeting: eIndices[0].index,
  meetingType: eIndices[0].type,
  attendance: eIndices[1].index,
  attendanceType: eIndices[1].type,
  param: eIndices[2].index,
  paramType: eIndices[2].type
};
