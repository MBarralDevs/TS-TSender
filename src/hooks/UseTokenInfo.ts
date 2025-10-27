// src/hooks/useTokenInfo.ts
import { useState, useEffect } from 'react'
import { useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import { erc20Abi } from '../Constants'

interface TokenInfo {
    name: string
    symbol: string
    decimals: number
    isLoading: boolean
    error: string | null
}

export function useTokenInfo(tokenAddress: string): TokenInfo {
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
        name: '',
        symbol: '',
        decimals: 18,
        isLoading: false,
        error: null
    })
    
    const config = useConfig()

    useEffect(() => {
        if (!tokenAddress || tokenAddress.length !== 42) {
            setTokenInfo({
                name: '',
                symbol: '',
                decimals: 18,
                isLoading: false,
                error: null
            })
            return
        }

        const fetchTokenInfo = async () => {
            setTokenInfo(prev => ({ ...prev, isLoading: true, error: null }))
            
            try {
                const [name, symbol, decimals] = await Promise.all([
                    readContract(config, {
                        abi: erc20Abi,
                        address: tokenAddress as `0x${string}`,
                        functionName: 'name',
                    }),
                    readContract(config, {
                        abi: erc20Abi,
                        address: tokenAddress as `0x${string}`,
                        functionName: 'symbol',
                    }),
                    readContract(config, {
                        abi: erc20Abi,
                        address: tokenAddress as `0x${string}`,
                        functionName: 'decimals',
                    })
                ])

                setTokenInfo({
                    name: name as string,
                    symbol: symbol as string,
                    decimals: Number(decimals),
                    isLoading: false,
                    error: null
                })
            } catch (error) {
                setTokenInfo({
                    name: '',
                    symbol: '',
                    decimals: 18,
                    isLoading: false,
                    error: 'Invalid token address'
                })
            }
        }

        fetchTokenInfo()
    }, [tokenAddress, config])

    return tokenInfo
}