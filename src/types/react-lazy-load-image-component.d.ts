declare module 'react-lazy-load-image-component' {
  import { ComponentType } from 'react';

  interface LazyLoadImageProps {
    src: string;
    alt?: string;
    effect?: 'blur' | 'opacity' | 'black-and-white';
    threshold?: number;
    placeholderSrc?: string;
    className?: string;
    style?: React.CSSProperties;
    width?: number | string;
    height?: number | string;
    wrapperClassName?: string;
    wrapperStyle?: React.CSSProperties;
    onError?: () => void;
    onLoad?: () => void;
    beforeLoad?: () => void;
    afterLoad?: () => void;
    visibleByDefault?: boolean;
    delayMethod?: 'throttle' | 'debounce';
    delayTime?: number;
    placeholder?: React.ReactNode;
    useIntersectionObserver?: boolean;
    scrollPosition?: { x: number; y: number };
  }

  export const LazyLoadImage: ComponentType<LazyLoadImageProps>;
  export const trackWindowScroll: (Component: ComponentType<any>) => ComponentType<any>;
}

declare module 'react-lazy-load-image-component/src/effects/blur.css' {
  const content: any;
  export default content;
}
