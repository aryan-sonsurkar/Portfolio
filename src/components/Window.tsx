"use client"

import { motion } from "framer-motion"
import { X, Minus } from "lucide-react"

export default function Window({
  id,
  title,
  zIndex,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  children,
}: {
  id: string
  title: string
  zIndex: number
  isActive: boolean
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="absolute inset-4 pointer-events-auto window-shadow rounded-xl overflow-hidden"
      style={{ zIndex }}
      onClick={onFocus}
    >
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b transition-colors ${
          isActive ? "border-[#3B82F6]/20 bg-[#0C1118]/90" : "border-[#3B82F6]/5 bg-[#0C1118]/60"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onClose() }}
              className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize() }}
              className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors"
            />
          </div>
          <span className="text-xs text-[#94A3B8] font-medium ml-2">{title}</span>
        </div>
      </div>
      <div
        className={`bg-[#05070A]/95 backdrop-blur-xl ${
          isActive ? "border border-[#3B82F6]/10" : "border border-[#3B82F6]/5"
        } border-t-0 rounded-b-xl h-[calc(100%-40px)] overflow-hidden`}
      >
        {children}
      </div>
    </motion.div>
  )
}
