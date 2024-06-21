import { useEffect, useRef } from "react";

interface InfiniteScrollTriggerProps {
  onVisible: () => void;
  isLoading: boolean;
}

const InfiniteScrollTrigger: React.FC<InfiniteScrollTriggerProps> = ({
  onVisible,
  isLoading,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) return; // Prevent intersection observer from triggering while loading

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible();
        }
      },
      {
        root: null, // Use the viewport as the container
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the element is visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [onVisible, isLoading]);

  return <div ref={ref} />;
};

export default InfiniteScrollTrigger;
