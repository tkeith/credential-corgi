import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/page";
import {
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { ABI, CONTRACT_ADDRESS } from "@/contracts";
import {
  hashString,
  hashStringToHexString,
  hashStringToHexStringWithPrefix,
} from "@/utils";

const CreateCredentialStructureForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [generatedStructure, setGeneratedStructure] = useState("");
  // const [generatedStructureHash, setGeneratedStructureHash] = useState(
  //   Buffer.from("")
  // );
  const [structureKey, setStructureKey] = useState("");
  const { state, setState, load, stopLoad } = useGlobalState();
  const { chain, chains } = useNetwork();
  const { address, isConnected } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      load("Generating credential structure...");

      const response = await axios.post("/api", {
        action: "generate-credential-structure",
        prompt: description,
      });
      setGeneratedStructure(response.data.structure);
      // setGeneratedStructureHash(hashString(generatedStructure));
      stopLoad();
    } catch (error) {
      console.error(error);
    }
  };

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
        load("Publishing credential structure...", "pub-cred-struct");
      } else {
        if (stopLoad("pub-cred-struct")) {
          try {
            load("Saving credential structure...");

            const response = await axios.post("/api", {
              action: "save-credential-structure",
              fullkey: address + ":structure:" + structureKey,
              structure: generatedStructure,
            });

            stopLoad();
          } catch (error) {
            console.error(error);
          }
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
        "structure:" + structureKey,
        hashStringToHexStringWithPrefix(structureKey),
      ],
    });

    console.log(
      `Structure key: ${structureKey}\nStructure JSON: ${generatedStructure}`
    );
  };

  return (
    <div>
      <h1 className="my-4 text-corgi font-bold text-xl">
        Create a new credential structure
      </h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Describe the credential structure that you would like to create
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Example: a medical insurance card including pharmacy copay and expiration date"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-corgi hover:bg-corgi-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corgi"
        >
          Generate
        </button>
      </form>
      {generatedStructure && (
        <>
          <div>
            <h1 className="my-4 text-corgi font-bold text-xl">
              Generated structure
            </h1>
            <pre className="bg-gray-200 p-4 rounded-md">
              <code>
                {JSON.stringify(JSON.parse(generatedStructure), null, 2)}
              </code>
            </pre>
            <div className="space-y-2">
              <label
                htmlFor="structureKey"
                className="block text-sm font-medium text-gray-700"
              >
                Structure key
              </label>
              <input
                id="structureKey"
                name="structureKey"
                value={structureKey}
                onChange={(e) => setStructureKey(e.target.value)}
                className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
              />
              <button
                onClick={handlePublish}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-corgi hover:bg-corgi-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corgi"
              >
                Publish
              </button>
            </div>
          </div>
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
    </div>
  );
};

export default CreateCredentialStructureForm;
