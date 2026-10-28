import Image, { type ImageProps } from "next/image";

function needsRawSrc(src: ImageProps["src"]) {
  const url = typeof src === "string" ? src : "";
  return url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("http://") || url.startsWith("https://");
}

export function MediaImage({ src, unoptimized, ...props }: ImageProps) {
  return <Image src={src} unoptimized={unoptimized || needsRawSrc(src)} {...props} />;
}
