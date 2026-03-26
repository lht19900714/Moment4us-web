import { Link } from "react-router";

import type { HomeGalleryItem } from "../loaders/home.server";

interface MasonryGalleryProps {
  items: readonly HomeGalleryItem[];
}

export function MasonryGallery({ items }: MasonryGalleryProps) {
  return (
    <div className="masonry-gallery" data-count={items.length}>
      {items.map((item, index) => (
        <article key={item.id} className="masonry-gallery__item">
          <Link className="masonry-gallery__link" to={item.href}>
            <img
              alt={item.alt}
              className="masonry-gallery__image"
              height={item.height}
              loading={index === 0 ? "eager" : "lazy"}
              sizes={item.sizes}
              src={item.src}
              srcSet={item.srcSet}
              width={item.width}
            />
            <div className="masonry-gallery__overlay">
              <p className="masonry-gallery__category">{item.category}</p>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
