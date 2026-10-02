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
      const cleanups: VoidFunction[] = []
      frames.each((frame) => {
        try {
          const doc = frame.document
          doc.addEventListener(event, listener, options)
          cleanups.push(() => doc.removeEventListener(event, listener, options))
        }
        catch {}
      })

      return () => {
        cleanups.splice(0).forEach((cleanup) => {
          try {
            cleanup()
          }
          catch {}
        })
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
      return () => {
        try {
          parent?.removeEventListener(event, listener, options)
        }
        catch {}
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
