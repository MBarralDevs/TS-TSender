// src/components/ui/Spinner.tsx
export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-3"
    }

    return (
        <div className={`${sizeClasses[size]} border-white border-t-transparent rounded-full animate-spin`} />
    )
}