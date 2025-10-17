.card {
  background-blend-mode: overlay;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

.card-icon {
  font-size: 2rem;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  flex: 1;
  color: #f1f5f9;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card:hover .card-icon {
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.card.active {
  transform: scale(0.96);
  border-color: var(--success);
}

.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
}

.card-footer {
  border-top: 1px solid rgba(255,255,255,0.05);
  padding-top: 0.75rem;
  text-align: right;
}

.access-indicator {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.3rem;
  font-size: 0.85rem;
}

.access-indicator .arrow {
  transition: transform 0.3s ease;
}

.card:hover .access-indicator .arrow {
  transform: translateX(4px);
}