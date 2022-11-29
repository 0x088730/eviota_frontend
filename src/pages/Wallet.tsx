import { useEffect } from 'react';
import { useMixpanel } from 'react-mixpanel-browser';
import { EviotaWallet } from '../components'

const Dashboard = () => {

  const mixpanel = useMixpanel();

  useEffect(() => mixpanel.track('Loaded Wallet page'), [mixpanel])

  return (
    <div>
      <EviotaWallet />
    </div>
  );
};

export default Dashboard;
