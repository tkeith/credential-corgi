'use client';

import { Fragment, useState } from 'react'
import { Dialog, Menu, Tab, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';

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
      <h2 className="text-xl font-bold">Credentials</h2>
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


const navigation = [
  { name: 'Credential Structures', icon: HomeIcon, component: <CredentialStructuresTab /> },
  { name: 'Credentials', icon: HomeIcon, component: <CredentialsTab /> },
  { name: 'Proof Requests', icon: HomeIcon, component: <ProofRequestsTab /> },
  { name: 'Proofs', icon: HomeIcon, component: <ProofsTab /> },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div className='flex h-screen'>
        <Tab.Group>

          {/* Static sidebar for desktop */}
          <div className="flex-none w-72">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 pt-4">
              <div className="flex h-24 items-center">
                {/* next.js image public/logo.png */}
                <Image src="/corgi-logo.png" alt="logo" width={80} height={80} />
              </div>
              <nav className="flex flex-1 flex-col">
                <Tab.List className="flex flex-1 flex-col gap-y-3 -mx-2 space-y-1">
                  {navigation.map((tab) => (
                    <Tab as={Fragment}>
                      {({ selected }) => (
                        /* Use the `selected` state to conditionally style the selected tab. */
                        <button
                          className={
                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold focus:outline-none focus:ring-0 ${selected ? 'bg-gray-50 text-corgi' : 'text-gray-700 hover:text-corgi hover:bg-gray-50'}`
                          }
                        >
                          <tab.icon
                            className={`h-6 w-6 shrink-0
                          ${selected ? 'text-corgi' : 'text-gray-400 group-hover:text-corgi'}`}
                            aria-hidden="true"
                          />
                          {tab.name}
                        </button>
                      )}

                    </Tab>
                  ))}
                </Tab.List>
              </nav>
            </div>
          </div>

          <div className="flex-auto">
            <main>
              <Tab.Panels className="m-4">
                {navigation.map((tab) => (
                  <Tab.Panel key={tab.name} className="bg-white rounded-xl p-3 text-gray-900">
                    {tab.component}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </main>
          </div>
        </Tab.Group>
      </div>
    </>
  )
}
