import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export interface Props {
  /** @example <Img alt="A cat" /> */
  alt: string
  /** Sets the aspect ratio to "auto" (default), "square" (1:1), or "video" (16:9) */
  aspectRatio?: 'auto' | 'square' | 'video'
  /** If true, the image will be loaded with a placeholder and a shimmer effect (default: false) */
  shimmer?: boolean
  /** @example <Img src="/cat.jpg" /> */
  src: string
  /** Pass a class name directly to the `<img>` */
  imgProps?: { className?: string }
}

type ImgProps = Omit<Props, 'aspectRatio' | 'imgProps'> & { className?: string, loaded?: boolean, handleLoad?: () => void }

type ImgWrapperProps = PropsWithChildren<Pick<Props, 'aspectRatio'>>

/**
 * Renders an image wrapped with a container that sets the aspect ratio.
 * Optionally renders a placeholder with a shimmer effect while the image is loading (client only).
 * The aspect ratio container combined with 100% h/w on the image helps prevent layout shifts, which
 * really negates the need for a placeholder/shimmer. In my opinion, the shimmer effect is better
 * for pure SPAs that can't be rendered on the server (or statically).
 * @example
 * ```tsx
 * // this will be rendered on the server only
 * <Image alt="A cat" src="/cat.jpg" aspectRatio="video" imgProps={{ className: 'some-class' }} />
 * // this will be rendered first on the server and re-rendered on the client when the image loads
 * <Image alt="A cat" src="/cat.jpg" shimmer client:visible />
 * // this will be rendered on the client only after React is loaded (don't use this)
 * <Image alt="A cat" src="/cat.jpg" shimmer client:only="react" />
 * ```
 */
export default function Image ({
  alt,
  aspectRatio = 'auto',
  imgProps = {},
  shimmer = false,
  src
}: Props): JSX.Element {
  const { className } = imgProps

  if (!shimmer) {
    return (
      <ImgWrapper aspectRatio={aspectRatio}>
        <Img alt={alt} className={className} src={src} />
      </ImgWrapper>
    )
  }

  const [loaded, setLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const handleLoad = (): void => setLoaded(true)

  // never runs on the server
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * In Astro, "islands" are still rendered initially on the server (unless client:only is used).
   * This means that the image tag would be rendered on the server and begin loading before React.
   * The workaround is to load the placeholder div on the server, and then the img on the client. */
  return (
    <ImgWrapper aspectRatio={aspectRatio}>
      {mounted
        ? <Img alt={alt} className={className} handleLoad={handleLoad} loaded={loaded} src={src} />
        : <ImgPlaceholder />}
    </ImgWrapper>
  )
}

/**
 * Sets the aspect ratio of the image.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
 */
function ImgWrapper ({
  children,
  aspectRatio = 'auto'
}: ImgWrapperProps): JSX.Element {
  const classNameByAspectRatio = {
    auto: 'aspect-auto',
    square: 'aspect-square',
    video: 'aspect-video'
  }

  return (
    <div className={`${classNameByAspectRatio[aspectRatio]}`}>
      {children}
    </div>
  )
}

/**
 * Renders a placeholder with 100% height and width to fill the wrapper.
 */
function ImgPlaceholder (): JSX.Element {
  return <div className='h-full w-full bg-slate-100 dark:bg-slate-900 animate-pulse' />
}

/**
 * Renders the image.
 * If the image is loaded, then the shimmer effect is removed.
 */
function Img ({
  alt,
  className,
  handleLoad,
  loaded = false,
  shimmer = false,
  src
}: ImgProps): JSX.Element {
  return (
    <img
      alt={alt}
      className={clsx(
        'h-full w-full',
        shimmer && !loaded && 'bg-slate-100 dark:bg-slate-900 animate-pulse',
        className
      )}
      onLoad={handleLoad}
      src={src}
    />
  )
}
