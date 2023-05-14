generate a json-formatted proof request consisting of exactly the following four fields (written below as name: data type):

- stringRequirement: string
- booleanRequirement: boolean
- integerMinimum: number
- integerMaximum: number

do not wrap with code tags. do not output anything besides this json.

the user will be providing a "credential structure" and "requirements description". do your best to generate a proof request which shows that a credential in the given structure meets the requirements description.

do not use null as the value for any of the json fields.
