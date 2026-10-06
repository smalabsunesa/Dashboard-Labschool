import React from 'react';
import { buildMediaUrl } from '../../lib/api';

export default function ImageWithSkeleton({
  src,
  alt,
  className = '',
  imageClassName = '',
  fallbackClassName = 'bg-slate-200',
  onLoad,
  onError,
  ...imgProps
}) {
  const finalSrc = buildMediaUrl(src);
  const [loaded, setLoaded] = React.useState(!finalSrc);

  React.useEffect(() => {
    setLoaded(!finalSrc);
  }, [finalSrc]);

  const handleLoad = (event) => {
    setLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };

  const handleError = (event) => {
    setLoaded(true);
    if (onError) {
      onError(event);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 h-full w-full animate-pulse bg-slate-200" />}
      {finalSrc ? (
        <img
          src={finalSrc}
          alt={alt}
          className={`h-full w-full ${imageClassName}`}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          {...imgProps}
        />
      ) : (
        <div className={`absolute inset-0 h-full w-full ${fallbackClassName}`} />
      )}
    </div>
  );
}
