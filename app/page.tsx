'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';

const CredentialStructuresTab: React.FC = () => {
  return (
    <div>
      {/* tab header */}
      <h2 className="text-xl font-bold">Credential Structures</h2>
      {/* tab content */}
    </div>
  );
};

const CredentialsTab: React.FC = () => {
  return (
    <div>
      {/* tab header */}
      <h2 className="text-xl font-bold">Credential Structures</h2>
      {/* tab content */}
    </div>
  );
};


const ProofRequestsTab: React.FC = () => {
  return (
    <div>
      {/* tab header */}
      <h2 className="text-xl font-bold">Proof Requests</h2>
      {/* tab content */}
    </div>
  );
};

const ProofsTab: React.FC = () => {
  return (
    <div>
      {/* tab header */}
      <h2 className="text-xl font-bold">Proofs</h2>
      {/* tab content */}
    </div>
  );
};




export default function Home() {
  const tabsData = [
    { name: 'Credential Structures', component: <CredentialStructuresTab /> },
    { name: 'Credentials', component: <CredentialsTab /> },
    { name: 'Proof Requests', component: <ProofRequestsTab /> },
    { name: 'Proofs', component: <ProofsTab /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-1 bg-cyan-900/20 rounded-xl">
              {tabsData.map((tab) => (
                <Tab key={tab.name} className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-medium text-white rounded-lg
                  ${selected ? 'bg-cyan-800 ring-2 ring-offset-2 ring-offset-cyan-900 ring-white ring-opacity-60' : 'opacity-60 hover:opacity-100'}`}
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {tabsData.map((tab) => (
                <Tab.Panel key={tab.name} className="bg-white rounded-xl p-3 text-gray-900">
                  {tab.component}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
}
