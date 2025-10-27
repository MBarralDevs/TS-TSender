// src/components/AirdropForm.tsx
"use client"

import InputField from "./ui/InputFields"
import Spinner from "./ui/Spinner"
import TransactionDetails from "./TransactionDetails"
import { useState, useMemo } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "../Constants"
import { useConfig, useChainId, useAccount, useWriteContract } from "wagmi"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "../utils"
import { useLocalStorage } from "../hooks/UseLocalStorage"
import { useTokenInfo } from "../hooks/UseTokenInfo"

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useLocalStorage("tsender-tokenAddress", "")
    const [recipients, setRecipients] = useLocalStorage("tsender-recipients", "")
    const [amounts, setAmounts] = useLocalStorage("tsender-amounts", "")
    
    const [loadingState, setLoadingState] = useState<"idle" | "wallet" | "approving" | "airdropping">("idle")
    
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()
    
    // Fetch token info
    const tokenInfo = useTokenInfo(tokenAddress)
    
    // Calculate recipient count
    const recipientCount = useMemo(() => {
        return recipients.split(/[,\n]+/)
            .map(addr => addr.trim())
            .filter(addr => addr !== '').length
    }, [recipients])

    // Format token amount (convert from wei to token units)
    const formattedTokenAmount = useMemo(() => {
        if (!total || !tokenInfo.decimals) return "0"
        return (total / Math.pow(10, tokenInfo.decimals)).toFixed(4)
    }, [total, tokenInfo.decimals])

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

            setLoadingState("wallet")
            const airdropHash = await writeContractAsync({
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
            
            const airdropReceipt = await waitForTransactionReceipt(config, {
                hash: airdropHash,
            })
            
            console.log("Airdrop Receipt: ", airdropReceipt)
            alert("Airdrop successful! 🎉")
            
            // Clear form after success
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
    const hasFormData = tokenAddress || recipients || amounts
    const showTransactionDetails = tokenAddress && amounts && total > 0 && !tokenInfo.error

    const handleClearForm = () => {
        setTokenAddress("")
        setRecipients("")
        setAmounts("")
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Form */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-zinc-200">
                        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Airdrop Details</h2>
                        
                        <div className="space-y-5">
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
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button 
                            onClick={handleSubmit}
                            disabled={isLoading || !hasFormData}
                            className={`
                                flex-1 px-6 py-4 rounded-xl font-semibold text-lg
                                transition-all duration-200 shadow-lg
                                flex items-center justify-center gap-2
                                ${isLoading || !hasFormData
                                    ? 'bg-zinc-300 cursor-not-allowed text-zinc-500' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-95 text-white'
                                }
                            `}
                        >
                            {getButtonContent()}
                        </button>

                        {hasFormData && !isLoading && (
                            <button
                                onClick={handleClearForm}
                                className="px-6 py-4 rounded-xl font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Status message */}
                    {loadingState !== "idle" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm text-blue-800 text-center">
                                {loadingState === "wallet" && "⏳ Please check your wallet to confirm the transaction"}
                                {loadingState === "approving" && "⏳ Waiting for approval confirmation on the blockchain"}
                                {loadingState === "airdropping" && "⏳ Airdrop transaction submitted, waiting for confirmation"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column - Transaction Details */}
                <div className="lg:sticky lg:top-24 h-fit space-y-6">
                    {showTransactionDetails ? (
                        <TransactionDetails
                            totalWei={total}
                            totalTokens={formattedTokenAmount}
                            tokenName={tokenInfo.name}
                            tokenSymbol={tokenInfo.symbol}
                            recipientCount={recipientCount}
                            estimatedGas="~50,000 - 200,000"
                        />
                    ) : (
                        <div className="bg-zinc-50 rounded-2xl p-8 border-2 border-dashed border-zinc-300 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-200 flex items-center justify-center">
                                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-zinc-700 mb-2">Transaction Preview</h3>
                            <p className="text-sm text-zinc-500">Fill in the form to see transaction details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}