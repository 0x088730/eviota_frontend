import React, { createContext } from 'react'
import { KinClient, Network  } from '@kin-sdk/client';

// https://github.com/marmelab/react-admin/issues/1935
global.Buffer = global.Buffer || require('buffer').Buffer;

export const KinContext = createContext<KinClient>({} as KinClient)

type KinProviderProps = {
  appIndex: number;
  kinNetwork: Network
  children: React.ReactNode
}

export const KinProvider = ({ appIndex, kinNetwork, children }: KinProviderProps): React.ReactElement => {

  const kinClient = new KinClient(kinNetwork, { appIndex });

  return (
    <KinContext.Provider value={kinClient}>
      {children}
    </KinContext.Provider>
  );
}