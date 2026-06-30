"use client"

import { motion } from "framer-motion"

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
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 30 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="absolute inset-[5%] pointer-events-auto window-shadow rounded-2xl overflow-hidden"
      style={{ zIndex }}
      onClick={onFocus}
    >
      <div
        className={`flex items-center justify-between px-5 py-3 border-b transition-colors ${
          isActive ? "border-[#3B82F6]/20 bg-[#0C1118]" : "border-[#3B82F6]/5 bg-[#0C1118]/60"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onClose() }}
              className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors"
            />
            <button
              onClick={(e) => { e.stopPropagation(); onMinimize() }}
              className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-green-500/20" />
          </div>
          <span className="text-sm text-[#94A3B8] font-medium ml-2">{title}</span>
        </div>
      </div>
      <div
        className={`bg-[#05070A]/95 backdrop-blur-xl ${
          isActive ? "border border-[#3B82F6]/10" : "border border-[#3B82F6]/5"
        } border-t-0 rounded-b-2xl h-[calc(100%-48px)] overflow-hidden`}
      >
        {children}
      </div>
    </motion.div>
  )
}
