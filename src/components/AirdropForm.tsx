// src/components/AirdropForm.tsx
"use client"

import InputField from "./ui/InputFields"
import Spinner from "./ui/Spinner"
import { useState, useMemo } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "../Constants"
import { useConfig, useChainId, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "../utils"
import { useLocalStorage } from "../hooks/UseLocalStorage"

export default function AirdropForm() {
    // Use localStorage for form inputs
    const [tokenAddress, setTokenAddress] = useLocalStorage("tsender-tokenAddress", "")
    const [recipients, setRecipients] = useLocalStorage("tsender-recipients", "")
    const [amounts, setAmounts] = useLocalStorage("tsender-amounts", "")
    
    const [loadingState, setLoadingState] = useState<"idle" | "wallet" | "approving" | "airdropping">("idle")
    
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()

    async function getApprovedAmount(tsenderAddress: string | null): Promise<number> {
        if (!tsenderAddress) {
            alert("No addresses found, please use a supported network.")
            return 0
        }

        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tsenderAddress as `0x${string}`],
        })
        return Number(response)
    }

    async function handleSubmit() {
        try {
            const tSenderAddress = chainsToTSender[chainId]["tsender"]
            console.log("TSender Address: ", tSenderAddress)
            
            const approvedAmount = await getApprovedAmount(tSenderAddress)

            if (approvedAmount < total) {
                // Approval needed
                setLoadingState("wallet")
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: "approve",
                    args: [tSenderAddress as `0x${string}`, total],
                })

                setLoadingState("approving")
                const approvalReceipt = await waitForTransactionReceipt(config, {
                    hash: approvalHash,
                })
                console.log("Approval Receipt: ", approvalReceipt)
            }

            // Airdrop transaction
            setLoadingState("wallet")
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })

            setLoadingState("airdropping")
            
            // Clear form after successful submission
            setTokenAddress("")
            setRecipients("")
            setAmounts("")
            
        } catch (error) {
            console.error("Transaction failed:", error)
            alert("Transaction failed. Please try again.")
        } finally {
            setLoadingState("idle")
        }
    }

    const getButtonContent = () => {
        switch (loadingState) {
            case "wallet":
                return (
                    <>
                        <Spinner size="sm" />
                        <span>Confirm in Wallet...</span>
                    </>
                )
            case "approving":
                return (
                    <>
                        <Spinner size="sm" />
                        <span>Approving Tokens...</span>
                    </>
                )
            case "airdropping":
                return (
                    <>
                        <Spinner size="sm" />
                        <span>Transaction Pending...</span>
                    </>
                )
            default:
                return "Submit Airdrop"
        }
    }

    const isLoading = loadingState !== "idle"

    // Function to clear all saved data
    const handleClearForm = () => {
        setTokenAddress("")
        setRecipients("")
        setAmounts("")
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <InputField
                label="Token Address"
                placeholder="0x1234...abcd"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
            />
            <InputField
                label="Recipients Address"
                placeholder="0x1234...abcd,0x5678...efgh"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                large={true}
            />
            <InputField
                label="Amounts to Airdrop"
                placeholder="100&#10;200&#10;300"
                value={amounts}
                onChange={(e) => setAmounts(e.target.value)}
                large={true}
            />

            {/*Display total if amounts are provided*/}
            {amounts && total > 0 && (
                <div className="text-sm text-zinc-600 bg-zinc-100 p-3 rounded-lg">
                    <span className="font-medium">Total tokens to distribute:</span> {total.toLocaleString()}
                </div>
            )}
            
            <div className="flex gap-3">
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`
                        flex-1 px-6 py-3 rounded-lg font-semibold
                        transition-all duration-200 shadow-md
                        flex items-center justify-center gap-2
                        ${isLoading 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
                        }
                        text-white
                    `}
                >
                    {getButtonContent()}
                </button>

                {/* Clear form button */}
                {(tokenAddress || recipients || amounts) && !isLoading && (
                    <button
                        onClick={handleClearForm}
                        className="px-6 py-3 rounded-lg font-semibold bg-zinc-200 hover:bg-zinc-300 text-zinc-700 transition-all duration-200"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Status message */}
            {loadingState !== "idle" && (
                <div className="text-center text-sm text-zinc-600">
                    {loadingState === "wallet" && "Please check your wallet to confirm the transaction"}
                    {loadingState === "approving" && "Waiting for approval confirmation on the blockchain"}
                    {loadingState === "airdropping" && "Airdrop transaction submitted, waiting for confirmation"}
                </div>
            )}
        </div>
    )
}