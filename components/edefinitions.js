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
            "attendeeName": { "type": "text" },
            "attendeeMail": {
              "type": "text",
              "fields": {
                "raw": { "type": "keyword" }
              }
            },
            "role": { "type": "keyword" },
            "status": { "type": "keyword" },
            "organizerName": { "type": "text" },
            "organizerMail": {
              "type": "text",
              "fields": {
                "raw": { "type": "keyword" }
              }
            },
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
