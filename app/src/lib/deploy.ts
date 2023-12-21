import { Signer, ethers } from 'ethers';
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json'


export default async function deploy(
  signer: Signer,
  arbiter: string,
  beneficiary: string,
  value: string): Promise<ethers.Contract> {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  return factory.deploy(arbiter, beneficiary, { value });
}
