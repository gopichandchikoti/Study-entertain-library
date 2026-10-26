declare module 'epubjs' {
  type EpubRendition = {
    display: () => Promise<unknown>
    next: () => Promise<unknown>
    prev: () => Promise<unknown>
  }

  type EpubBook = {
    renderTo: (element: HTMLElement, options: { width: string; height: string }) => EpubRendition
    destroy: () => void
  }

  const ePub: (source: string) => EpubBook
  export default ePub
}
