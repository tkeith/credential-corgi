import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/page";

const hexToString = (hex: string) => {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
};

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
        load("Fetching credential structures...");
        const response = await axios.post("/api", {
          action: "get-credential-structure-list",
        });
        setStructures(response.data.list);
        stopLoad();
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

  const generateProof = async () => {
    // Add your proof generation logic here
    return 123;
  };

  const handleGenerateProof = async () => {
    const proof = await generateProof();
    setProofData(proof);
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
          <h1 className="my-4 text-corgi font-bold text-xl">
            Credential Structure
          </h1>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>{JSON.stringify(credentialStructure, null, 2)}</code>
          </pre>
          <label
            htmlFor="credentialData"
            className="block text-sm font-medium text-gray-700"
          >
            Credential Data
          </label>
          <textarea
            id="credentialData"
            name="credentialData"
            value={credentialData}
            onChange={(e) => setCredentialData(e.target.value)}
            className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
          />
          <label
            htmlFor="credentialHash"
            className="block text-sm font-medium text-gray-700"
          >
            Credential Hash
          </label>
          <input
            id="credentialHash"
            name="credentialHash"
            value={credentialHash}
            onChange={(e) => setCredentialHash(e.target.value)}
            className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
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
          <h1 className="my-4 text-corgi font-bold text-xl">Proof Data</h1>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>{JSON.stringify(proofData, null, 2)}</code>
          </pre>
        </>
      )}
    </div>
  );
};

export default ProofForm;
