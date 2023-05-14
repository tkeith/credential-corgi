import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/page";
import ZkappWorkerClient from "@/zkclient";
import { snarkyPoker } from "@/utils";
import { Field } from "snarkyjs";

interface Structure {
  fullkey: string;
  structure: string;
}

const IssueCredentialForm: React.FC = () => {
  const { load, stopLoad } = useGlobalState();
  const [structures, setStructures] = useState<Structure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(
    null
  );
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState<string | null>(null);
  const [credential, setCredential] = useState<{ [key: string]: any } | null>(
    null
  );
  const [credentialHash, setCredentialHash] = useState<string | null>(null);

  const zkappWorkerClient = new ZkappWorkerClient();

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

  const handleStructureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = structures.find((s) => s.fullkey === e.target.value);
    if (selected) {
      setSelectedStructure(selected);
      const structure = JSON.parse(selected.structure);
      const initialFormValues: { [key: string]: string } = Object.keys(
        structure
      ).reduce((acc: { [key: string]: string }, key: string) => {
        acc[key] = "";
        return acc;
      }, {});
      setFormValues(initialFormValues);
    } else {
      setSelectedStructure(null);
      setFormValues({});
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setFormValues({ ...formValues, [key]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedValues: { [key: string]: any } = {};
    const structure = JSON.parse(selectedStructure?.structure || "{}");

    for (const key in structure) {
      const type = structure[key];
      const value = formValues[key];

      if (type === "integer") {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
          setError(`Invalid value for ${key}: ${value} is not an integer.`);
          return;
        }
        parsedValues[key] = intValue;
      } else if (type === "boolean") {
        const lowerValue = value.toLowerCase();
        if (lowerValue.startsWith("t")) {
          parsedValues[key] = true;
        } else if (lowerValue.startsWith("f")) {
          parsedValues[key] = false;
        } else {
          setError(`Invalid value for ${key}: ${value} is not a boolean.`);
          return;
        }
      } else {
        parsedValues[key] = value;
      }
    }

    console.log(JSON.stringify(parsedValues));

    load("Hashing credential using Poseidon...");

    (async function () {
      const hash: string = await snarkyPoker(async function () {
        return await zkappWorkerClient!.zkpHashCredential(parsedValues);
      });

      console.log("hash type", typeof hash);

      setCredential(parsedValues);
      setCredentialHash(hash);
      console.log("credentialHash from state: ", credentialHash);
      console.log(
        "credentialHash from state -- json: ",
        JSON.stringify(credentialHash)
      );

      stopLoad();
    })();
  };

  return (
    <div>
      <h1 className="my-4 text-corgi font-bold text-xl">Issue a credential</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label
          htmlFor="structure"
          className="block text-sm font-medium text-gray-700"
        >
          Choose a credential structure
        </label>
        <select
          id="structure"
          onChange={handleStructureChange}
          className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
        >
          <option value="">Select a structure...</option>
          {structures.map((s) => (
            <option key={s.fullkey} value={s.fullkey}>
              {s.fullkey}
            </option>
          ))}
        </select>
        {selectedStructure && (
          <>
            {Object.entries(JSON.parse(selectedStructure.structure)).map(
              ([key, type]) => (
                <div key={key} className="space-y-2">
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {key}
                  </label>
                  <input
                    id={key}
                    value={formValues[key] || ""}
                    onChange={(e) => handleInputChange(e, key)}
                    placeholder={`Type: ${type}`}
                    className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
                  />
                </div>
              )
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-corgi hover:bg-corgi-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corgi"
            >
              Issue
            </button>
          </>
        )}
      </form>
      {credentialHash && (
        <>
          <h1 className="my-4 text-corgi font-bold text-xl">
            Credential issued
          </h1>
          <p>Credential (send this to the user):</p>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>{JSON.stringify(credential, null, 2)}</code>
          </pre>
          <p>Poseidon hash:</p>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>{credentialHash}</code>
          </pre>
        </>
      )}
    </div>
  );
};

export default IssueCredentialForm;
