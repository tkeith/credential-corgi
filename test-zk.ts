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

let CredentialProver = Experimental.ZkProgram({
  publicInput: Field,

  methods: {
    proveCredentialMeetsRequirements: {
      privateInputs: [
        Field,
        Bool,
        Field,
        Field,
        Field,
        Bool,
        Field,
        Field,
        Field,
      ],

      method(
        requirementsHash: Field,
        stringHashRequirement: Field,
        booleanRequirement: Bool,
        intMin: Field,
        intMax: Field,
        stringHashVal: Field,
        booleanVal: Bool,
        intVal: Field,
        intVal2: Field,
        intVal3: Field
      ) {
        Poseidon.hash([
          stringHashRequirement,
          booleanRequirement.toField(),
          intMin,
          intMax,
        ]).assertEquals(requirementsHash);
        stringHashRequirement.assertEquals(stringHashVal);
        booleanRequirement.assertEquals(booleanVal);
        intMin.assertLessThanOrEqual(intVal);
        intMax.assertGreaterThanOrEqual(intVal);
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
