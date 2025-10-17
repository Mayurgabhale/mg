.card-image {
  width: 100%;
  aspect-ratio: 16 / 9; /* keeps a perfect responsive rectangle */
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* shows entire image */
  transition: transform 0.4s ease;
  border-radius: 12px;
}

.card:hover .card-image img {
  transform: scale(1.03);
}