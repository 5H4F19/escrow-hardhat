import { useEffect, useState } from 'react';
import Contracts from './components/contracts'
import CreateContract, { IEscrow } from './components/createContract'

function App() {
  const [escrows, setEscrows] = useState<IEscrow[]>([]);

  useEffect(() => {
    const storedEscrows = JSON.parse(localStorage.getItem('escrow')!) || [];
    setEscrows(storedEscrows);
  }, []);

  return (
    <div className='dark bg-background h-screen'>
      <div className='container flex items-start justify-center space-x-20'>
        <CreateContract escrows={escrows} setEscrows={setEscrows} />
        <div className='space-y-5'>
          {escrows?.map((escrow, index) => {
            return <Contracts key={index} {...escrow} />
          })}
        </div>
      </div>
    </div>
  )
}

export default App
