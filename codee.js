/* Controller Grid */
.controllers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 cards per row */
    gap: 20px;
    padding: 10px 0;
}

/* Make cards responsive for smaller screens */
@media (max-width: 1400px) {
    .controllers-grid {
        grid-template-columns: repeat(3, 1fr); /* 3 cards on medium screens */
    }
}

@media (max-width: 1024px) {
    .controllers-grid {
        grid-template-columns: repeat(2, 1fr); /* 2 cards on tablets */
    }
}

@media (max-width: 768px) {
    .controllers-grid {
        grid-template-columns: 1fr; /* 1 card on mobile */
    }
}

/* Controller Card - Make them compact for 4-column layout */
.controller-card {
    background: white;
    border-radius: 12px;
    padding: 16px; /* Reduced padding */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    min-height: 220px; /* Fixed height for consistency */
    display: flex;
    flex-direction: column;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px; /* Reduced margin */
}

.controller-icon {
    font-size: 20px; /* Smaller icon */
    background: #eff6ff;
    padding: 8px; /* Reduced padding */
    border-radius: 6px;
    color: #3b82f6;
}

.controller-name {
    font-size: 16px; /* Smaller font */
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 12px 0; /* Reduced margin */
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Limit to 2 lines */
    -webkit-box-orient: vertical;
}

.controller-info {
    display: flex;
    flex-direction: column;
    gap: 8px; /* Reduced gap */
    margin-bottom: 16px; /* Reduced margin */
    flex-grow: 1;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0; /* Reduced padding */
}

.info-label {
    color: #6b7280;
    font-size: 12px; /* Smaller font */
    font-weight: 500;
}

.info-value {
    color: #374151;
    font-weight: 500;
    font-size: 12px; /* Smaller font */
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60%;
}

.status {
    font-size: 12px; /* Smaller font */
    font-weight: 500;
    padding: 3px 6px; /* Reduced padding */
    border-radius: 4px;
}

.card-footer {
    border-top: 1px solid #f3f4f6;
    padding-top: 12px; /* Reduced padding */
    margin-top: auto; /* Push to bottom */
}

.view-doors-btn {
    width: 100%;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #374151;
    padding: 8px 12px; /* Reduced padding */
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    font-size: 14px; /* Smaller font */
}