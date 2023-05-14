import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/page";
import {
  hashStringToBigInt,
  hashStringToHexString,
  hashStringToHexStringWithPrefix,
  hexToString,
  insertNewlineEveryNChars,
  snarkyPoker,
} from "@/utils";
import ZkappWorkerClient from "@/zkclient";
import { useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/contracts";

const ProofForm: React.FC = () => {
  const { load, stopLoad } = useGlobalState();
  const [structures, setStructures] = useState<any[]>([]);
  const [proofRequestCode, setProofRequestCode] = useState("");
  const [credentialStructure, setCredentialStructure] = useState<any>(null);
  const [credentialData, setCredentialData] = useState("");
  const [credentialHash, setCredentialHash] = useState("");
  const [proofData, setProofData] = useState<any>(null);

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        // load("Fetching credential structures...");
        const response = await axios.post("/api", {
          action: "get-credential-structure-list",
        });
        setStructures(response.data.list);
        // stopLoad();
      } catch (error) {
        console.error(error);
      }
    };

    fetchStructures();
  }, []);

  useEffect(() => {
    if (proofRequestCode) {
      try {
        const json = JSON.parse(hexToString(proofRequestCode));
        const foundStructure = structures.find(
          (s) => s.fullkey === json.fullkey
        );
        if (foundStructure) {
          setCredentialStructure(JSON.parse(foundStructure.structure));
        } else {
          setCredentialStructure(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [proofRequestCode, structures]);

  const zkappWorkerClient = new ZkappWorkerClient();

  const generateProof = async () => {
    load("Generating proof, this takes ~30 seconds...");
    await snarkyPoker(async function () {
      return await zkappWorkerClient!.pingSnarky();
    });

    const proofRequest = JSON.parse(hexToString(proofRequestCode));
    const credential = JSON.parse(credentialData);

    type AnyObj = {
      [key: string]: string | boolean | number | bigint;
    };

    function firstOfStringBoolInt(
      obj: AnyObj
    ): Array<string | boolean | number | bigint | undefined> {
      let firstString: string | undefined;
      let firstBool: boolean | undefined;
      let firstInt: number | bigint | undefined;

      const keys = Object.keys(obj).sort();

      for (const key of keys) {
        const val = obj[key];
        if (typeof val === "string" && firstString === undefined) {
          firstString = val;
        } else if (typeof val === "boolean" && firstBool === undefined) {
          firstBool = val;
        } else if (
          (typeof val === "number" || typeof val === "bigint") &&
          firstInt === undefined
        ) {
          firstInt = val;
        }

        if (
          firstString !== undefined &&
          firstBool !== undefined &&
          firstInt !== undefined
        ) {
          break;
        }
      }

      return [firstString, firstBool, firstInt];
    }

    const [credString, credBool, credInt] = firstOfStringBoolInt(credential);

    const proof: string =
      (await zkappWorkerClient!.proveCredentialMeetsRequirements(
        hashStringToBigInt(proofRequest.stringRequirement),
        proofRequest.booleanRequirement,
        proofRequest.integerMinimum,
        proofRequest.integerMaximum,
        hashStringToBigInt(credString as string),
        credBool as boolean,
        credInt as number
      )) as string;
    console.log("proof received:", proof);
    stopLoad();
    return proof;
  };

  const handleGenerateProof = async () => {
    const proof = await generateProof();
    setProofData(proof);
  };

  const { chain, chains } = useNetwork();

  const { data, write } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "createEntity",
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    (async function () {
      if (isLoading) {
        load("Publishing proof...", "pub-proof");
      } else {
        if (stopLoad("pub-proof")) {
        }
      }
    })();
  }, [isLoading]);

  const handlePublish = () => {
    if (!write) {
      alert("not ready yet...");
      return;
    }

    write({
      args: [
        "proof:" + hashStringToHexString(proofData),
        hashStringToHexStringWithPrefix(proofData),
      ],
    });
  };

  return (
    <div>
      <h1 className="my-4 text-corgi font-bold text-xl">Proof Request Code</h1>
      <textarea
        value={proofRequestCode}
        onChange={(e) => setProofRequestCode(e.target.value)}
        className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
      />
      {credentialStructure && (
        <>
          <h1 className="my-4 text-corgi font-bold text-xl">Proof Request</h1>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>{hexToString(proofRequestCode)}</code>
          </pre>
          <h1 className="my-4 text-corgi font-bold text-xl">
            Credential Structure
          </h1>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>{JSON.stringify(credentialStructure, null, 2)}</code>
          </pre>
          <label
            htmlFor="credentialData"
            className="block text-sm font-medium text-gray-700 mt-2"
          >
            Credential Data
          </label>
          <textarea
            id="credentialData"
            name="credentialData"
            value={credentialData}
            onChange={(e) => setCredentialData(e.target.value)}
            className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1 my-1 h-32"
          />
          <label
            htmlFor="credentialHash"
            className="block text-sm font-medium text-gray-700 mt-2"
          >
            Credential Hash
          </label>
          <input
            id="credentialHash"
            name="credentialHash"
            value={credentialHash}
            onChange={(e) => setCredentialHash(e.target.value)}
            className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1 my-1"
          />
          <button
            onClick={handleGenerateProof}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-corgi hover:bg-corgi-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corgi"
          >
            Generate Proof
          </button>
        </>
      )}
      {proofData && (
        <>
          <h1 className="my-4 text-corgi font-bold text-xl">
            {(!proofData.startsWith("failed") && "Proof Data") ||
              "Proof Failed"}
          </h1>
          <pre className="bg-gray-200 p-4 rounded-md mb-2">
            <code>{insertNewlineEveryNChars(proofData, 200)}</code>
          </pre>
          {!proofData.startsWith("failed") && (
            <>
              <button
                onClick={handlePublish}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-corgi hover:bg-corgi-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corgi"
              >
                Publish Proof
              </button>
              {isSuccess && (
                <div>
                  <h1 className="my-4 text-corgi font-bold text-xl">
                    Publish success!
                  </h1>
                  <p>Transaction ID:</p>
                  <pre className="bg-gray-200 p-4 rounded-md">
                    <code>{data?.hash}</code>
                  </pre>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProofForm;
