import React from 'react';
import { Image } from 'react-bootstrap';

interface ImageWithPlaceholderProps {
  previewImage?: string;
  image?: string;
  [x: string | number | symbol]: unknown;
}

const ImageWithPlaceholder = (props: ImageWithPlaceholderProps) => {
  const { previewImage, image, ...otherProps } = props

  return <Image
    src={
      previewImage
        ? previewImage
        : image
          ? image
          : 'images/placeholder-avatar.png'
    }
    {...otherProps}
  />
}

export default ImageWithPlaceholder