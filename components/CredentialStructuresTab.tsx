"use client";
import CreateCredentialStructureForm from "@/components/CreateCredentialStructureForm";

export const CredentialStructuresTab: React.FC = () => {
  return <CreateCredentialStructureForm />;
};
export const CredentialsTab: React.FC = () => {
  return (
    <div>
      {/* tab header */}
      <h2 className="text-xl font-bold">Credentials</h2>
      {/* tab content */}
    </div>
  );
};
export const ProofRequestsTab: React.FC = () => {
  return (
    <div>
      {/* tab header */}
      <h2 className="text-xl font-bold">Proof Requests</h2>
      {/* tab content */}
    </div>
  );
};
export const ProofsTab: React.FC = () => {
  return (
    <div>
      {/* tab header */}
      <h2 className="text-xl font-bold">Proofs</h2>
      {/* tab content */}
    </div>
  );
};
