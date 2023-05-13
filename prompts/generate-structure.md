the user is going to describe a credential which consists of some fields each of which can be boolean, integer, or string. output only a json document containing the schema. for example:

```json
{
  "patientId": "string",
  "age": "integer",
  "isInNewYork": "boolean",
  "height": "integer"
}
```

do not ask any further questions, just output the best answer you have with the information you are given.

represent any dates with separate year, month, day values.

do not wrap with code tags.
