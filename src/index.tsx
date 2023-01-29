import { debounce } from "lodash";
import { ImgHTMLAttributes, PropsWithChildren, useMemo } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

function getParentNode(
  container?: HTMLElement | React.RefObject<HTMLElement> | null
) {
  return container instanceof HTMLElement ? container : container?.current;
}

function useNodeVisible(
  node: React.RefObject<HTMLImageElement>,
  debounceTime = 300,
  container?: HTMLElement | React.RefObject<HTMLElement> | null
): boolean {
  const [visible, setVisible] = useState(false);

  const checkVisible = useCallback(
    () =>
      debounce(() => {
        const nodeRect = node.current?.getBoundingClientRect();
        if (!nodeRect) return setVisible(false);
        const parent = getParentNode(container);

        const { top, left, height, width } = nodeRect;
        const {
          top: parentTop = 0,
          left: parentLeft = 0,
          height: parentHeight = window.innerHeight ||
            document.documentElement.clientHeight,
          width: parentWidth = window.innerWidth ||
            document.documentElement.clientWidth,
        } = parent?.getBoundingClientRect() ?? {};

        const intersectionTop = Math.max(parentTop, 0);
        const intersectionLeft = Math.max(parentLeft, 0);

        const offsetTop = top - intersectionTop;
        const offsetLeft = left - intersectionLeft;

        const nextVisible =
          offsetTop <= parentHeight &&
          offsetTop + height >= 0 &&
          offsetLeft <= parentWidth &&
          offsetLeft + width >= 0;
        setVisible(nextVisible);
      }, debounceTime)(),
    [container, debounceTime, node]
  );

  // 初始化
  useEffect(() => {
    checkVisible();
  }, [checkVisible]);

  useEffect(() => {
    const parent = getParentNode(container);
    (parent ?? document).addEventListener("scroll", checkVisible, false);
    return () => {
      (parent ?? document).removeEventListener("scroll", checkVisible, false);
    };
  }, [checkVisible, container]);

  useEffect(() => {
    if (visible) {
      const parent = getParentNode(container);
      (parent ?? document).removeEventListener("scroll", checkVisible, false);
    }
  }, [visible, checkVisible, container]);

  return visible;
}

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** 滚动容器，默认为document */
  container?: HTMLElement | React.RefObject<HTMLElement> | null;
  /** 滚动事件防抖时间(ms)，默认300ms */
  debounceTime?: number;
}

const LazyImage: React.FC<PropsWithChildren<LazyImageProps>> = ({
  children,
  src,
  container,
  debounceTime,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const visible = useNodeVisible(imgRef, debounceTime, container);

  return <img ref={imgRef} src={visible ? src : undefined} {...props} />;
};

export default LazyImage;
