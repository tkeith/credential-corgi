import React, { useState } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/page";
import { useNetwork, usePrepareContractWrite, useContractWrite } from "wagmi";
import { ABI, CONTRACT_ADDRESSES } from "@/contracts";
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

  // const { config } = usePrepareContractWrite({
  //   address: CONTRACT_ADDRESSES[chain!.network] as `0x${string}`,
  //   abi: ABI,
  //   functionName: "createEntity",
  //   args: [hashString(structureKey), generatedStructure],
  // });

  // const { write } = useContractWrite(config);

  const { write } = useContractWrite({
    address: CONTRACT_ADDRESSES[chain!.network] as `0x${string}`,
    abi: ABI,
    functionName: "createEntity",
  });

  const handlePublish = () => {
    console.log(chain!.network);
    console.log(JSON.stringify(CONTRACT_ADDRESSES));
    console.log(CONTRACT_ADDRESSES[chain!.network] as `0x${string}`);
    console.log(ABI);
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
    <div className="space-y-4">
      <h1 className="text-corgi font-bold text-xl">
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
          placeholder="a medical insurance card including pharmacy copay and expiration date"
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
        <div>
          <h2 className="text-corgi font-bold text-lg">Generated structure</h2>
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
      )}
    </div>
  );
};

export default CreateCredentialStructureForm;
