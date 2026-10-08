export function getWindowFrames(win: Window) {
  const frames = {
    each(cb: (win: Window) => void) {
      for (let i = 0; i < win.frames?.length; i += 1) {
        const frame = win.frames[i]
        if (frame)
          cb(frame)
      }
    },

    addEventListener(event: string, listener: any, options?: any) {
      const cleanups = new Set<VoidFunction>()
      frames.each((frame) => {
        try {
          const doc = frame.document
          doc.addEventListener(event, listener, options)
          cleanups.add(() => doc.removeEventListener(event, listener, options))
        }
        catch {}
      })

      let cleaning = false
      return (): void | false => {
        if (cleaning)
          return false
        cleaning = true
        try {
          cleanups.forEach((cleanup) => {
            try {
              cleanup()
              cleanups.delete(cleanup)
            }
            catch {}
          })
          if (cleanups.size > 0)
            return false
        }
        finally {
          cleaning = false
        }
      }
    },

    removeEventListener(event: string, listener: any, options?: any) {
      frames.each((frame) => {
        try {
          frame.document.removeEventListener(event, listener, options)
        }
        catch {}
      })
    },
  }

  return frames
}

export function getParentWindow(win: Window) {
  const parent = win.frameElement != null ? win.parent : null
  return {
    addEventListener: (event: string, listener: any, options?: any) => {
      try {
        parent?.addEventListener(event, listener, options)
      }
      catch {}
      return (): void | false => {
        try {
          parent?.removeEventListener(event, listener, options)
        }
        catch {
          return false
        }
      }
    },
    removeEventListener: (event: string, listener: any, options?: any) => {
      try {
        parent?.removeEventListener(event, listener, options)
      }
      catch {}
    },
  }
}
