"use client"

import InputField from "./ui/InputFields"
import { useState, useMemo} from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "../Constants"
import { useConfig, useChainId, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "../utils" 

export default function AirdropForm() {
      const [tokenAddress, setTokenAddress] = useState("")
      const [recipients, setRecipients] = useState("")
      const [amounts, setAmounts] = useState("")
      const chainId = useChainId()
      const config = useConfig()
      const account = useAccount()
      const total:number = useMemo(() => calculateTotal(amounts), [amounts])
      const { data: hash, isPending, writeContractAsync } = useWriteContract()

      async function getApprovedAmount(tsenderAddress:string|null) : Promise<number> {
            if (!tsenderAddress) {
                  alert("No addresses found, please use a supported network.")
                  return 0
            }

            //This function read from the chain to see if we approved enough tokens (allowance)
            const response = await readContract(config, {
                  abi: erc20Abi,
                  address: tokenAddress as `0x${string}`,
                  functionName: "allowance",
                  args: [account.address, tsenderAddress as `0x${string}`],
            })
            return Number(response)
      }

      async function handleSubmit() {
            // If already approve, return and move to step 2
            // Else, call approve function on token contract
            // After approve is confirmed, call airdrop function on tsender contract
            // Wait for transaction confirmation and show success message

            const tSenderAddress = chainsToTSender[chainId]["tsender"]
            console.log("TSender Address: ", tSenderAddress)
            //We get the amount approved
            const approvedAmount = await getApprovedAmount(tSenderAddress)

            if (approvedAmount < total) {
                  const approvalHash = await writeContractAsync({
                        abi: erc20Abi,
                        address: tokenAddress as `0x${string}`,
                        functionName: "approve",
                        args: [tSenderAddress as `0x${string}`, total],
            })

            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash,
            })
            console.log("Approval Receipt: ", approvalReceipt)
            } 

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
      }

      return (
      <div>
            <InputField
                  label="Token Address"
                  placeholder="0x1234...abcd"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
            />
            <InputField
                  label="Recipients Address"
                  placeholder="0x1234...abcd"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  large={true}
            />
            <InputField
                  label="Amounts to Airdrop"
                  placeholder="100\n200\n300"
                  value={amounts}
                  onChange={(e) => setAmounts(e.target.value)}
                  large={true}
            />
            <button onClick={handleSubmit}
                  className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 transform">
                  Submit Airdrop
            </button>

      </div>
      )           
}