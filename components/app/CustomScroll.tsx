"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import styles from "./CustomScroll.module.css"

/**
 * CustomScroll
 * - Hides native scrollbars cross-browser and renders an overlay gradient thumb that
 *   mirrors the chart accent. Fully arrowless on all browsers.
 * - Keyboard, wheel, and touch interactions go to the viewport normally.
 * - Dragging the thumb adjusts the scroll position.
 */
export function CustomScroll({
  className,
  style,
  children,
}: React.PropsWithChildren<{
  className?: string
  style?: React.CSSProperties
}>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)

  const [thumb, setThumb] = useState({ height: 24, top: 0 })
  // Whether content can scroll at all
  const [canScroll, setCanScroll] = useState(false)
  // UI interaction states controlling visibility
  const [hovering, setHovering] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [dragging, setDragging] = useState(false)
  const scrollIdleTimer = useRef<number | null>(null)
  const dragState = useRef<{ startY: number; startTop: number; dragging: boolean }>({
    startY: 0,
    startTop: 0,
    dragging: false,
  })

  const updateThumb = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const content = viewport.scrollHeight
    const viewportH = viewport.clientHeight
    const trackH = track.clientHeight

    // If not scrollable
    const scrollable = content > viewportH + 1
    setCanScroll(scrollable)

    if (!scrollable) {
      setThumb((t) => ({ ...t, height: 0, top: 0 }))
      return
    }

    const ratio = viewportH / content
    const thumbH = Math.max(24, Math.floor(trackH * ratio))

    const maxScrollTop = content - viewportH
    const maxThumbTop = trackH - thumbH
    const currentTop = Math.round((viewport.scrollTop / maxScrollTop) * maxThumbTop)

    setThumb({ height: thumbH, top: Number.isFinite(currentTop) ? currentTop : 0 })
  }, [])

  // Sync on scroll/resize/content changes
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const onScroll = () => {
      updateThumb()
      if (!canScroll) return
      setScrolling(true)
      if (scrollIdleTimer.current) window.clearTimeout(scrollIdleTimer.current)
      scrollIdleTimer.current = window.setTimeout(() => {
        setScrolling(false)
      }, 800)
    }
    viewport.addEventListener("scroll", onScroll, { passive: true })

    const ro = new ResizeObserver(() => updateThumb())
    ro.observe(viewport)

    // Mutation observer to detect children/content changes
    const mo = new MutationObserver(() => updateThumb())
    mo.observe(viewport, { subtree: true, childList: true, characterData: true })

    updateThumb()

    return () => {
      viewport.removeEventListener("scroll", onScroll)
      ro.disconnect()
      mo.disconnect()
      if (scrollIdleTimer.current) window.clearTimeout(scrollIdleTimer.current)
    }
  }, [updateThumb, canScroll])

  // Drag handling
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragState.current.dragging) return
      e.preventDefault()
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return

      const dy = e.clientY - dragState.current.startY
      const trackH = track.clientHeight
      const thumbH = thumbRef.current?.clientHeight ?? thumb.height
      const maxThumbTop = trackH - thumbH
      const nextTop = Math.min(Math.max(dragState.current.startTop + dy, 0), maxThumbTop)

      // Map back to scrollTop
      const content = viewport.scrollHeight
      const viewportH = viewport.clientHeight
      const maxScrollTop = content - viewportH
      viewport.scrollTop = (nextTop / maxThumbTop) * maxScrollTop
    }

    const endDrag = () => {
      if (!dragState.current.dragging) return
      dragState.current.dragging = false
      document.body.classList.remove("select-none")
      setDragging(false)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", endDrag)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", endDrag)
    }
  }, [thumb.height])

  const onThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const track = trackRef.current
    const thumbEl = thumbRef.current
    if (!track || !thumbEl) return

    dragState.current.dragging = true
    dragState.current.startY = e.clientY
    dragState.current.startTop = thumbEl.offsetTop
    document.body.classList.add("select-none")
    setDragging(true)
  }, [])

  const onTrackMouseDown = useCallback((e: React.MouseEvent) => {
    // Optional: jump page when clicking track
    const track = trackRef.current
    const viewport = viewportRef.current
    if (!track || !viewport) return

    const rect = track.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const thumbH = thumbRef.current?.clientHeight ?? thumb.height
    const thumbTop = Math.max(0, Math.min(clickY - thumbH / 2, track.clientHeight - thumbH))

    const content = viewport.scrollHeight
    const viewportH = viewport.clientHeight
    const maxScrollTop = content - viewportH
    const maxThumbTop = track.clientHeight - thumbH

    viewport.scrollTop = (thumbTop / maxThumbTop) * maxScrollTop
  }, [thumb.height])

  const shouldShow = canScroll && (hovering || scrolling || dragging)
  const trackStyle = useMemo<React.CSSProperties>(() => ({
    opacity: shouldShow ? 1 : 0,
    transform: shouldShow ? "translateX(0)" : "translateX(4px)",
    pointerEvents: shouldShow ? "auto" : "none",
  }), [shouldShow])

  return (
    <div
      ref={containerRef}
      className={cn(styles.customScroll, "h-full min-h-0", className)}
      style={style}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div ref={viewportRef} className={cn(styles.viewport, "h-full min-h-0 w-full")}
           role="region">
        {children}
      </div>
      <div ref={trackRef} className={styles.track} style={trackStyle} onMouseDown={onTrackMouseDown}>
        <div
          ref={thumbRef}
          className={styles.thumb}
          style={{ height: `${thumb.height}px`, top: `${thumb.top}px` }}
          onMouseDown={onThumbMouseDown}
        />
      </div>
    </div>
  )
}
