import { exit } from "process";
import {
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
  Bool,
  Poseidon,
  Experimental,
} from "snarkyjs";

import { SmartContract, state, State, method, Struct } from "snarkyjs";

let TestProgram = Experimental.ZkProgram({
  publicInput: Field,

  methods: {
    testMethod: {
      privateInputs: [],

      method(publicInput: Field) {
        publicInput.assertLessThan(Field(5));
      },
    },
  },
});

(async function () {
  await TestProgram.compile();
  let ProofClass = Experimental.ZkProgram.Proof(TestProgram);
  let proof = await TestProgram.testMethod(Field(4));
  console.log("proof 1", proof);
  proof = await TestProgram.testMethod(Field(6));
  console.log("proof 2", proof);

  exit();
})();
