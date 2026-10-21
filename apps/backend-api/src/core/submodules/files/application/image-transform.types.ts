export enum ImageFit {
  COVER = 'cover',
  CONTAIN = 'contain',
  FILL = 'fill',
  INSIDE = 'inside',
  OUTSIDE = 'outside',
}

export enum ImagePreset {
  HOME_CARD = 'home-card',
}

export type ImageTransformInput = {
  src: string;
  preset: ImagePreset;
};

export type TransformedImage = {
  path: string;
  contentType: 'image/webp';
  etag: string;
};
