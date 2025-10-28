"use client"

import { useState, useEffect } from "react"
import AirdropForm from "./AirdropForm"
import { useAccount } from "wagmi"

export default function HomeContent() {
    const [isUnsafeMode, setIsUnsafeMode] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const { isConnected } = useAccount()

    // Prevent hydration mismatch by only rendering after mount
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // During SSR and initial render, show a loading state
    if (!isMounted) {
        return (
            <main>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                        <p className="text-sm text-zinc-500">Loading...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main>
            {!isConnected ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <h2 className="text-xl font-medium text-zinc-600">
                        Please connect a wallet...
                    </h2>
                </div>
            ) : (
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    <AirdropForm isUnsafeMode={isUnsafeMode} onModeChange={setIsUnsafeMode} />
                </div>
            )}
        </main>
    )
}