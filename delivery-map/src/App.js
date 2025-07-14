import { useEffect, useRef, useState } from 'react';
import './App.css';
import MapaDelivery from './MapaDelivery';
import { authorizeNewMachnine, encrypt, verifyIfMachineIsAuthorazized } from './Auth';

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    checkAuthorization();
  }, []);

  async function checkAuthorization() {
    if (await verifyIfMachineIsAuthorazized() === true) {
      setAuthorized(true);
    }
  }

  async function configureNewDevice() {
    await authorizeNewMachnine(adminPassword);
    await checkAuthorization();
    setAdminPassword('');
  }

  return (
    <>
      {authorized ? (
        <MapaDelivery />
      ) : (
        <div className="App" style={{ textAlign: 'center', margin: '50px' }}>
          <h1>Welcome to the Delivery Map</h1>
          <p>Please authorize to view the map.</p>
          <form onSubmit={(e) => { e.preventDefault(); configureNewDevice(); }}>
            <input type="password" placeholder="Enter admin password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            <button type="submit">Authorize</button>
          </form>
        </div>
      )}
    </>
  );
}

export default App;