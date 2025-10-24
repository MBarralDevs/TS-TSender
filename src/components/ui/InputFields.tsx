"use client"

import { ChangeEvent } from "react"

interface InputFieldProps {
    label: string
    placeholder: string
    value?: string
    type?: "text" | "number" | "email" | "password"
    large?: boolean
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function InputField({
    label,
    placeholder,
    value,
    type,
    large,
    onChange,
}: InputFieldProps) {

    const baseClasses = `
        w-full px-4 py-2 rounded-lg border border-zinc-300 
        bg-white text-zinc-900 placeholder-zinc-400
        focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent
        transition-all duration-200
        hover:border-zinc-400
    `

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-zinc-700">
                {label}
            </label>
            
            {large ? (
                <textarea
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`${baseClasses} min-h-[120px] resize-y`}
                    rows={5}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={baseClasses}
                />
            )}
        </div>
    )
}