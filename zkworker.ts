import { Mina, PublicKey, fetchAccount } from "snarkyjs";
import * as crypto from "crypto";
import { Poseidon, Field } from "snarkyjs";

// ---------------------------------------------------------------------------------------

const state = {
  // ConcealedCare: null as null | typeof ConcealedCare,
  // zkapp: null as null | ConcealedCare,
  // transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

type Credential = {
  [key: string]: string | boolean | number | bigint;
};

const functions = {
  // loadContract: async (args: {}) => {
  //   const { ConcealedCare } = await import(
  //     "../../../contracts/build/src/ConcealedCare.js"
  //   );
  //   state.ConcealedCare = ConcealedCare;
  // },
  // compileContract: async (args: {}) => {
  //   await state.ConcealedCare!.compile();
  // },
  loadSnarkyJS: async (args: {}) => {},
  zkpHashCredential: async (args: { credential: Credential }) => {
    function hashStringToBigInt(input: string): bigint {
      const hash = crypto.createHash("sha256");
      hash.update(input);
      const hashedString = hash.digest("hex");
      let hex = "0x" + hashedString;
      return BigInt(hex);
    }

    function hashStringToField(input: string): Field {
      return Field(hashStringToBigInt(input));
    }

    function credentialToFields(credential: Credential): {
      [key: string]: Field;
    } {
      let fields: { [key: string]: Field } = {};

      for (const key in credential) {
        if (typeof credential[key] === "string") {
          fields[key] = hashStringToField(credential[key] as string);
        } else if (typeof credential[key] === "boolean") {
          fields[key] = Field(credential[key] as boolean);
        } else if (typeof credential[key] === "number") {
          fields[key] = Field(credential[key] as number);
        } else if (typeof credential[key] === "bigint") {
          fields[key] = Field(credential[key] as bigint);
        }
      }

      return fields;
    }

    function sortedCredentialValues(
      credential: Credential
    ): Array<string | boolean | number | bigint> {
      console.log("sortedCredentialValues called");
      console.log("credential", credential);
      const keys = Object.keys(credential).sort();
      console.log("keys", keys);
      const sortedValues = keys.map((key) => credential[key]!);
      console.log("sortedValues", sortedValues);
      return sortedValues;
    }

    function credentialArrayToFields(
      credentialArray: Array<string | boolean | number | bigint>
    ): Array<Field> {
      return credentialArray.map((value) => {
        if (typeof value === "string") {
          return hashStringToField(value);
        } else if (
          typeof value === "boolean" ||
          typeof value === "number" ||
          typeof value === "bigint"
        ) {
          return Field(value);
        } else {
          throw new Error(`Unsupported value type: ${typeof value}`);
        }
      });
    }

    function zkpHashCredential(credential: Credential): string {
      console.log("debug 2", credential);

      const sorted = sortedCredentialValues(credential);
      console.log("sorted", sorted);

      // return Field(sorted[0]!);

      return Poseidon.hash(
        credentialArrayToFields(sortedCredentialValues(credential))
      ).toString();
    }

    console.log("args", args);

    return zkpHashCredential(args.credential);
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};
// if (process.browser) {
  addEventListener(
    "message",
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
// }
