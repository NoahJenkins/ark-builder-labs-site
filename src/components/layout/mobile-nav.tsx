"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NAVIGATION_ITEMS, SITE_CONFIG } from "@/lib/constants"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if dark mode is active
    const checkDarkMode = () => {
      const hasClassDark = document.documentElement.classList.contains('dark')
      const hasDataThemeDark = document.documentElement.getAttribute('data-theme') === 'dark'
      
      // Only consider it dark mode if explicitly set to dark
      const isDark = hasClassDark || hasDataThemeDark
      setIsDarkMode(isDark)
    }
    
    checkDarkMode()
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    })
    
    return () => observer.disconnect()
  }, [])

  // Removed debug logging for cleaner console output

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[1000000]"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                data-mobile-backdrop="true"
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  zIndex: 999998,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)'
                }}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                data-mobile-menu="true"
                style={{
                  position: 'fixed',
                  right: 0,
                  top: 0,
                  height: '100vh',
                  width: '16rem',
                  background: isDarkMode ? '#1A2332' : '#ffffff',
                  borderLeft: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 999999,
                  padding: '1.5rem',
                  opacity: 1,
                  color: isDarkMode ? '#ffffff' : '#000000'
                }}
              >
                <div className="flex justify-end mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                    style={{
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
              <div className="flex flex-col space-y-6 mt-8">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors"
                    style={{
                      color: isDarkMode ? '#ffffff' : '#000000'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                <div
                  className="pt-6 border-t"
                  style={{
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                  }}
                >
                  <Button asChild className="w-full">
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </div>
                <div className="pt-4">
                  <p
                    className="text-sm mb-2"
                    style={{
                      color: isDarkMode ? '#9CA3AF' : '#6B7280'
                    }}
                  >
                    Connect with us
                  </p>
                  <div className="flex space-x-4">
                    {Object.entries(SITE_CONFIG.social).map(([platform, url]) => (
                      <Link 
                        key={platform}
                        href={url}
                        className="transition-colors capitalize"
                        style={{
                          color: isDarkMode ? '#9CA3AF' : '#6B7280'
                        }}
                      >
                        {platform}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}