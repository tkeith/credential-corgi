import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "@/app/page";
import { stringToHex } from "@/utils";

interface Structure {
  fullkey: string;
  structure: string;
}

const CreateRequestForm: React.FC = () => {
  const { state, setState, load, stopLoad } = useGlobalState();
  const [structures, setStructures] = useState<Structure[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [requestString, setRequestString] = useState<string>("");

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        const response = await axios.post("/api", {
          action: "get-credential-structure-list",
        });
        setStructures(response.data.list);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStructures();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      load("Generating request...");

      const response = await axios.post("/api", {
        action: "generate-request",
        fullkey: selectedStructure,
        structure: structures.find((s) => s.fullkey === selectedStructure)
          ?.structure!,
        details,
      });
      setRequestString(response.data.request);
      stopLoad();
    } catch (error) {
      console.error(error);
    }
  };

  const baseUrl = window.location.href;

  return (
    <div>
      <h1 className="my-4 text-corgi font-bold text-xl">Send Proof Request</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label
          htmlFor="structure"
          className="block text-sm font-medium text-gray-700"
        >
          Select a credential structure
        </label>
        <select
          id="structure"
          value={selectedStructure}
          onChange={(e) => setSelectedStructure(e.target.value)}
          className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
        >
          <option value="">Select a structure</option>
          {structures.map((structure) => (
            <option key={structure.fullkey} value={structure.fullkey}>
              {structure.fullkey}
            </option>
          ))}
        </select>
        {selectedStructure && (
          <>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-700"
            >
              Describe the requirements that you'd like the proof to meet
            </label>
            <textarea
              id="details"
              name="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="focus:ring-corgi block w-full sm:text-sm border-gray-300 rounded-md border p-2 focus:border-corgi focus:outline-none focus:ring-1"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-corgi hover:bg-corgi-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-corgi"
            >
              Generate Request
            </button>
          </>
        )}
      </form>
      {requestString && (
        <div>
          <h1 className="my-4 text-corgi font-bold text-xl">
            Requirements Generated
          </h1>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>{requestString}</code>
          </pre>
          <h1 className="my-4 text-corgi font-bold text-xl">
            Requirements Link Generated
          </h1>
          <pre className="bg-gray-200 p-4 rounded-md">
            <code>
              {baseUrl}#{stringToHex(requestString)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CreateRequestForm;
