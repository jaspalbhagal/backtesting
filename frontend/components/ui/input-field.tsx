"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputFieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
}

export function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
