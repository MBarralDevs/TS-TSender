// src/components/TransactionDetails.tsx
interface TransactionDetailsProps {
    totalWei: number
    totalTokens: string
    tokenName: string
    tokenSymbol: string
    recipientCount: number
    estimatedGas?: string
}

export default function TransactionDetails({
    totalWei,
    totalTokens,
    tokenName,
    tokenSymbol,
    recipientCount,
    estimatedGas
}: TransactionDetailsProps) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Transaction Summary
            </h3>
            
            <div className="space-y-3">
                {/* Token Info */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-600">Token</span>
                        <div className="text-right">
                            <p className="font-semibold text-zinc-900">{tokenSymbol || '—'}</p>
                            <p className="text-xs text-zinc-500">{tokenName || 'Loading...'}</p>
                        </div>
                    </div>
                </div>

                {/* Total Amount */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-600">Total Amount</span>
                        <div className="text-right">
                            <p className="font-semibold text-zinc-900">
                                {totalTokens} {tokenSymbol}
                            </p>
                            <p className="text-xs text-zinc-500 font-mono">
                                {totalWei.toLocaleString()} wei
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recipients */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-600">Recipients</span>
                        <p className="font-semibold text-zinc-900">{recipientCount}</p>
                    </div>
                </div>

                {/* Estimated Gas */}
                {estimatedGas && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-zinc-600">Est. Gas</span>
                            <p className="font-semibold text-zinc-900 font-mono">{estimatedGas}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}