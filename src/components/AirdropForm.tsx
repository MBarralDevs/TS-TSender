"use client"

import InputField from "./ui/InputFields"
import { useState } from "react"

export default function AirdropForm() {
      const [tokenAddress, setTokenAddress] = useState("")
      const [recipients, setRecipients] = useState("")
      const [amounts, setAmounts] = useState("")

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
      </div>
      )           
}