import { useState } from "react";

const useImagePlaceholder = () => {
  const [imagePlaceholder, setImagePlaceholder] = useState<string | null>(null);

  const generateImagePlaceholder = (imageNumber: number) => {
    const imageUrl = `https://picsum.photos/20/30?random=${imageNumber}`;
    setImagePlaceholder(imageUrl);
  };

  const clearPlaceholder = () => {
    setImagePlaceholder(null);
  };

  return {
    imagePlaceholder,
    generateImagePlaceholder,
    clearPlaceholder,
  };
};

export default useImagePlaceholder;
