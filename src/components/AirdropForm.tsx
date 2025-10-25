"use client"

import InputField from "./ui/InputFields"
import { useState } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "../Constants"
import { useConfig, useChainId, useAccount } from "wagmi"
import {readContract} from "@wagmi/core"

export default function AirdropForm() {
      const [tokenAddress, setTokenAddress] = useState("")
      const [recipients, setRecipients] = useState("")
      const [amounts, setAmounts] = useState("")
      const chainId = useChainId()
      const config = useConfig()
      const account = useAccount()

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
      }

      async function handleSubmit() {
            // If already approve, return and move to step 2
            // Else, call approve function on token contract
            // After approve is confirmed, call airdrop function on tsender contract
            // Wait for transaction confirmation and show success message

            const tSenderAddress = chainsToTSender[chainId]["tsender"]
            console.log("TSender Address:", tSenderAddress)
            console.log("Chain ID:", chainId)
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
            <button onClick={handleSubmit}>
                  Submit Airdrop
            </button>

      </div>
      )           
}