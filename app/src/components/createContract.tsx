import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { ethers } from 'ethers'
import deploy from '@/lib/deploy'


export interface IEscrow {
  address: string
  arbiter: string
  beneficiary: string
  value: string
}
const Blank = (s: string): boolean => {
  return s.trim() === ''
}

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

const CreateContract = ({ escrows, setEscrows }: { escrows: IEscrow[], setEscrows: (s: IEscrow[]) => void }) => {
  const [beneficiary, setBeneficiary] = useState<string>('');
  const [arbiter, setArbiter] = useState<string>('');
  const [value, setValue] = useState<string>('');

  // Load escrows from localStorage on component mount
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();

  useEffect(() => {
    async function getAccounts() {
      console.log("hello", window.ethereum.isMetaMask)
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account])

  async function newContract() {
    // basic validation
    if (Blank(arbiter) && Blank(beneficiary) && Blank(value)) {
      alert("Invalid arguments")
      return;
    }
    if (!signer) { return }
    console.log('a' + value + 'b')

    const valueInWei = ethers.utils.parseUnits(value, "ether").toString();
    const escrowContract = await deploy(signer, arbiter, beneficiary, valueInWei);


    const escrow: IEscrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
    };

    setEscrows([...escrows, escrow]);
    localStorage.setItem('escrow', JSON.stringify([...escrows, escrow]));
  }

  return (
    <Card className='w-96'>
      <CardHeader>
        <CardTitle className='text-2xl'>Create a contract</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <Label>Arbiter</Label>
          <Input value={arbiter} type="text" id="arbiter" onChange={e => { setArbiter(e.target.value) }} />
        </div>
        <div className='space-y-2'>
          <Label>Benificiary</Label>
          <Input value={beneficiary} type="text" id="beneficiary" onChange={e => { setBeneficiary(e.target.value) }} />
        </div>
        <div className='space-y-2'>
          <Label>Amount (Ether)</Label>
          <Input value={value} type="text" id="wei" onChange={e => { setValue(e.target.value) }} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={e => {
          e.preventDefault()
          newContract()
        }}>Deploy</Button>
      </CardFooter>
    </Card>
  )
}

export default CreateContract
