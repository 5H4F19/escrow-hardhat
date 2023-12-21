import { BaseSyntheticEvent, useEffect, useLayoutEffect, useState } from "react"
import { IEscrow } from "./createContract"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { ethers } from "ethers"

import EscrowArtifacts from '../artifacts/contracts/Escrow.sol/Escrow.json';
import { cn } from "@/lib/utils"

const provider = new ethers.providers.Web3Provider((window as any).ethereum);

const Contracts = ({ address, arbiter, beneficiary, value }: IEscrow) => {

  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const [signerAccount, setSignerAccount] = useState<string>()
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [approvableByYou, setApprovableByYou] = useState<boolean>(false)

  const findIsApproved = async () => {
    const contract = new ethers.Contract(address, EscrowArtifacts.abi, provider);
    const isApproved = await contract.isApproved()
    setIsApproved(isApproved)
  }
  useLayoutEffect(() => {
    findIsApproved()
  }, [])

  useEffect(() => {
    const f = async () => {
      const signer = provider.getSigner()
      console.log()
      const signerAccount = await signer.getAddress()
      setSigner(signer)
      setSignerAccount(signerAccount)
      setApprovableByYou(signerAccount.toString() === arbiter.toString())
    }
    f()
  }, [window.ethereum])

  const approveHandler = async (e: BaseSyntheticEvent<MouseEvent>) => {
    e.preventDefault()
    const contract = new ethers.Contract(address, EscrowArtifacts.abi, provider);
    const signer = provider.getSigner()
    const approveTxn = await contract.connect(signer).approve();
    await approveTxn.wait();
  }

  return (
    <Card className='relative w-fit'>
      <CardHeader className='flex flex-row items-center  justify-between'>
        <CardTitle className=' text-2xl'>Contract#1</CardTitle>
        <Badge variant={isApproved ? 'secondary' : 'outline'}>{isApproved ? 'Approved' : 'Pending'}</Badge>
      </CardHeader>
      <CardContent>
        <div className='flex items-center'>
          <div className='w-24'>
            <Label>Arbiter</Label>
          </div>
          <div>
            <CardDescription>{arbiter}</CardDescription>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='w-24'>
            <Label>Beneficiary</Label>
          </div>
          <div>
            <CardDescription>{beneficiary}</CardDescription>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='w-24'>
            <Label>Value</Label>
          </div>
          <div>
            <CardDescription>{value}<Label className='mx-2'>Ether</Label></CardDescription>
          </div>
        </div>
      </CardContent>
      <CardFooter className={cn(isApproved && 'hidden')}>
        <Button onClick={approveHandler} className={cn(!approvableByYou ? "hidden" : "", "w-full")}>Approve
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Contracts
