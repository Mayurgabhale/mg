realMap = L.map('realmap', { 
    preferCanvas: true,
    maxBounds: [
        [85, -180],  
        [-60, 180]
    ],
    maxBoundsViscosity: 1.0
}).setView([60, -30], 3); // Greenland / Europe centered