"use client"

import InputField from "./ui/InputFields"
import { useState } from "react"

export default function AirdropForm() {
      const [tokenAddress, setTokenAddress] = useState("")
      const [recipients, setRecipients] = useState("")

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
            />
      </div>
      )           
}