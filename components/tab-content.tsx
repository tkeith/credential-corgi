import CreateCredentialStructureForm from "@/components/CreateCredentialStructureForm";
import IssueCredentialForm from "./IssueCredentialForm";
import ProofRequestForm from "./ProofRequestForm";
import ProofForm from "./ProofForm";

export const CredentialStructuresTab: React.FC = () => {
  return <CreateCredentialStructureForm />;
};
export const CredentialsTab: React.FC = () => {
  return <IssueCredentialForm />;
};
export const ProofRequestsTab: React.FC = () => {
  return <ProofRequestForm />;
};
export const ProofsTab: React.FC = () => {
  return <ProofForm />;
};
