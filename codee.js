// ==========================
// Combined graph.js + map.js
// ==========================

// --------------------------
// GAUGE FUNCTIONS
// --------------------------
function updateGauge(id, activeId, inactiveId, totalId) {
  const activeEl = document.getElementById(activeId);
  const inactiveEl = document.getElementById(inactiveId);

  const active = activeEl ? parseInt((activeEl.textContent || '0').replace(/,/g, ''), 10) || 0 : 0;
  const inactive = inactiveEl ? parseInt((inactiveEl.textContent || '0').replace(/,/g, ''), 10) || 0 : 0;
  const total = active + inactive;

  const gauge = document.getElementById(id);
  if (!gauge) return;

  let percentage = total === 0 ? 0 : Math.round((active / total) * 100);

  try { gauge.style.setProperty("--percentage", percentage); } catch (e) {}

  const totalLabel = gauge.querySelector(".total");
  const activeLabel = gauge.querySelector(".active");
  const inactiveLabel = gauge.querySelector(".inactive");

  if (totalLabel) totalLabel.textContent = total;
  if (activeLabel) activeLabel.textContent = active;
  if (inactiveLabel) inactiveLabel.textContent = inactive;

  const footerEl = document.getElementById(totalId);
  if (footerEl) footerEl.textContent = total;
}

function renderGauges() {
  updateGauge("gauge-cameras", "camera-online", "camera-offline", "camera-total");
  updateGauge("gauge-archivers", "archiver-online", "archiver-offline", "archiver-total");
  updateGauge("gauge-controllers", "controller-online", "controller-offline", "controller-total");
  updateGauge("gauge-ccure", "server-online", "server-offline", "server-total");
  updateGauge("gauge-doors", "door-online", "door-offline", "doorReader-total");
  updateGauge("gauge-readers", "reader-online", "reader-offline", "reader-total-inline");

  updateTotalCountChart();
}

// --------------------------
// TOTAL COUNT CHART (PIE)
// --------------------------
let _totalCountChart = null;

function findChartPlaceholderByTitle(titleText) {
  const cards = document.querySelectorAll('.totacl-gcard.wide');
  for (let card of cards) {
    const h = card.querySelector('.gcard-title');
    if (h && h.textContent.trim().toLowerCase() === titleText.trim().toLowerCase()) {
      return card.querySelector('.chart-placeholder');
    }
  }
  return null;
}

function collectTotalCounts() {
  const keys = [
    { id: 'camera-total', label: 'Cameras' },
    { id: 'archiver-total', label: 'Archivers' },
    { id: 'controller-total', label: 'Controllers' },
    { id: 'server-total', label: 'CCURE' },
    { id: 'doorReader-total', label: 'Doors' },
    { id: 'reader-total-inline', label: 'Readers' },
    { id: 'pc-total', label: 'Desktop' },
    { id: 'db-total', label: 'DB Server' }
  ];

  const labels = [];
  const values = [];

  keys.forEach(k => {
    const el = document.getElementById(k.id);
    const v = el ? parseInt((el.textContent || '0').replace(/,/g, '').trim(), 10) : 0;
    if (v > 0) { labels.push(k.label); values.push(v); }
  });

  return values.length === 0 ? { labels: ['No devices'], values: [0] } : { labels, values };
}

function renderTotalCountChart() {
  if (typeof Chart === 'undefined') return;

  const placeholder = findChartPlaceholderByTitle('Total Count');
  if (!placeholder) return;

  let canvas = placeholder.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    placeholder.innerHTML = '';
    placeholder.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  const data = collectTotalCounts();
  const totalValue = data.labels[0] === 'No devices' ? 0 : data.values.reduce((a, b) => a + b, 0);

  if (_totalCountChart) _totalCountChart.destroy();

  const palette = ['#10b981', '#f97316', '#2563eb','#7c3aed','#06b6d4','#ef4444','#f59e0b','#94a3b8'];

  const centerTextPlugin = {
    id: 'centerText',
    afterDatasetsDraw(chart) {
      const { ctx, chartArea, data } = chart;
      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const labelColor = getComputedStyle(document.body).getPropertyValue('--graph-card-footer-dark').trim() || "#888";
      const valueColor = getComputedStyle(document.body).getPropertyValue('--graph-card-title-dark').trim() || "#ffffff";

      ctx.font = "14px Arial"; ctx.fillStyle = labelColor; ctx.fillText("TOTAL", centerX, centerY - 20);
      ctx.font = "bold 22px Arial"; ctx.fillStyle = valueColor; ctx.fillText(total.toString(), centerX, centerY + 15);
      ctx.restore();
    }
  };

  _totalCountChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: data.labels, datasets: [{ data: data.values, backgroundColor: palette.slice(0,data.values.length), borderWidth:0 }] },
    options: {
      responsive:true, maintainAspectRatio:false, cutout:'45%', radius:'90%',
      plugins: {
        legend: {
          position:'right',
          labels: {
            usePointStyle:true, padding:12, color:getComputedStyle(document.body).getPropertyValue('--graph-card-title-dark'),
            generateLabels: function(chart) {
              const dataset = chart.data.datasets[0];
              const labels = chart.data.labels;
              const colors = dataset.backgroundColor;
              return labels.map((label,i)=>({text:`${label} - ${dataset.data[i]}`,fillStyle:colors[i],strokeStyle:colors[i],fontColor:getComputedStyle(document.body).getPropertyValue('--graph-card-title-dark'),hidden:false,index:i}));
            }
          }
        },
        tooltip:{ callbacks:{ label: ctx => `${ctx.label || ''} : ${ctx.parsed || 0}` } }
      }
    },
    plugins:[centerTextPlugin]
  });
}

function updateTotalCountChart() {
  if (!_totalCountChart) { renderTotalCountChart(); return; }
  const data = collectTotalCounts();
  _totalCountChart.data.labels = data.labels;
  _totalCountChart.data.datasets[0].data = data.values;
  _totalCountChart.data.datasets[0].backgroundColor = ['#10b981','#f97316','#2563eb','#7c3aed','#06b6d4','#ef4444','#f59e0b','#94a3b8'].slice(0,data.values.length);
  _totalCountChart.update();
}

// --------------------------
// OFFLINE SCATTER CHART
// --------------------------
let offlineChart;
let cityIndexMap = {};
let cityCounter = 0;
let dynamicTypeIndexMap = {};
let dynamicTypeList = [];

function getChartColors() {
  const isLightTheme = document.body.classList.contains('theme-light');
  return isLightTheme ? { backgroundColor:'#0a0a0a', text:'#e6eef7' } : 
  { camera:'#ff4d4d', archiver:'#4da6ff', controller:'#ffaa00', ccure:'#7d3cff', grid:'rgba(255,255,255,0.2)', text:'#e6eef7', background:'#0a0a0a' };
}

function updateChartTheme() {
  if(!offlineChart) return;
  const colors = getChartColors();
  offlineChart.options.scales.x.grid.color = colors.grid;
  offlineChart.options.scales.y.grid.color = colors.grid;
  offlineChart.options.scales.x.ticks.color = colors.text;
  offlineChart.options.scales.y.ticks.color = colors.text;
  if(offlineChart.options.plugins.legend) offlineChart.options.plugins.legend.labels.color = colors.text;
  offlineChart.update();
}

function initOfflineChart() {
  const canvas = document.getElementById("DotOfflineDevice");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const colors = getChartColors();
  offlineChart = new Chart(ctx,{
    type:"scatter",
    data:{
      datasets:[
        {label:"Camera", data:[], backgroundColor:colors.camera, pointStyle:"circle", pointRadius:6},
        {label:"Archiver", data:[], backgroundColor:colors.archiver, pointStyle:"rect", pointRadius:6},
        {label:"Controller", data:[], backgroundColor:colors.controller, pointStyle:"triangle", pointRadius:7},
        {label:"CCURE", data:[], backgroundColor:colors.ccure, pointStyle:"rectRot", pointRadius:6}
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{ display:true, labels:{ color:colors.text, font:{size:12}, usePointStyle:true } },
        tooltip:{ callbacks:{ label: ctx => `${ctx.raw.count || 0}` } }
      },
      scales:{
        x:{ title:{display:false}, grid:{color:colors.grid, drawBorder:true}, ticks:{color:colors.text, maxRotation:0, minRotation:0, callback: value => Object.keys(cityIndexMap).find(k=>cityIndexMap[k]===value)||""} },
        y:{ title:{display:false}, grid:{color:colors.grid, drawBorder:true}, ticks:{color:colors.text, callback:v=>dynamicTypeList[v]||""}, min:-0.5, max:()=>Math.max(dynamicTypeList.length-0.5,0.5) }
      }
    }
  });
}

function updateOfflineChart(offlineDevices) {
  const typeNames={cameras:"Camera", archivers:"Archiver", controllers:"Controller", servers:"CCURE"};
  dynamicTypeList=[]; dynamicTypeIndexMap={}; cityIndexMap={}; cityCounter=0;
  const filtered = offlineDevices.filter(dev=>typeNames.hasOwnProperty(dev.type));
  filtered.forEach(dev=>{ const label=typeNames[dev.type]; if(!(label in dynamicTypeIndexMap)){ dynamicTypeIndexMap[label]=dynamicTypeList.length; dynamicTypeList.push(label); }});
  const grouped={};
  filtered.forEach(dev=>{
    const source = dev.device?dev.device:dev;
    const city = source.city || "Unknown";
    const label = typeNames[dev.type];
    const key=city+"|"+label;
    if(!grouped[key]) grouped[key]={city:city,label:label,count:0};
    grouped[key].count++;
  });
  offlineChart.data.datasets.forEach(ds=>ds.data=[]);
  Object.values(grouped).forEach(item=>{
    if(!cityIndexMap[item.city]){ cityCounter++; cityIndexMap[item.city]=cityCounter; }
    const dynamicY = dynamicTypeIndexMap[item.label];
    const point={ x:cityIndexMap[item.city], y:dynamicY, count:item.count };
    const dataset = offlineChart.data.datasets.find(ds=>ds.label===item.label);
    if(dataset) dataset.data.push(point);
  });
  offlineChart.data.datasets.forEach(ds=>{ ds.hidden = ds.data.length===0; });
  offlineChart.update();
}

function setupThemeObserver() {
  const observer = new MutationObserver(mutations=>{ mutations.forEach(m=>{ if(m.attributeName==='class') setTimeout(updateChartTheme,100); }); });
  observer.observe(document.body,{ attributes:true, attributeFilter:['class'] });
}

function initializeChartSystem() {
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{ initOfflineChart(); setupThemeObserver(); });
  else { initOfflineChart(); setupThemeObserver(); }
}

initializeChartSystem();

function renderOfflineChartFromCombined(combinedDevices) {
  const offlineDevices = combinedDevices.filter(d=>d.device.status==="offline").map(d=>({device:d.device,type:d.device.type}));
  updateOfflineChart(offlineDevices);
}

// --------------------------
// MAP.JS FUNCTIONS
// --------------------------
let realMap; let CITY_LIST=[]; let cityLayers={}; let heatLayer=null;

const CITY_COORDS={ "Casablanca":[33.5731,-7.5898], "Dubai":[25.276987,55.296249], "Argentina":[-38.4161,-63.6167], "Austin TX":[30.2672,-97.7431],"Austria, Vienna":[48.2082,16.3738],"Costa Rica":[9.7489,-83.7534],"Denver":[39.7392,-104.9903],"Denver Colorado":[39.7392,-104.9903],"Florida, Miami":[25.7617,-80.1918],"Frankfurt":[50.1109,8.6821],"Gama Building":[37.7749,-122.4194],"Delta Building":[37.7749,-122.4194],"Ireland, Dublin":[53.3331,-6.2489],"Italy, Rome":[41.9028,12.4964],"Japan Tokyo":[35.6762,139.6503],"Kuala lumpur":[3.1390,101.6869],"London":[51.5074,-0.1278],"Madrid":[40.4168,-3.7038],"Mexico":[23.6345,-102.5528],"Moscow":[55.7558,37.6173],"NEW YORK":[40.7128,-74.0060],"Panama":[8.5380,-80.7821],"Peru":[-9.1900,-75.0152],"Pune":[18.5204,73.8567],"Pune 2nd Floor":[18.5204,73.8567],"Pune Podium":[18.5204,73.8567],"Pune Tower B":[18.5204,73.8567],"Quezon":[20.6760,121.0437],"Sao Paulo, Brazil":[-23.5505,-46.6333],"Taguig City":[14.5176,121.0509],"HYDERABAD":[17.3850,78.4867],"Singapore":[1.3521,103.8198],"Vilnius":[54.6872,25.2797] };

const CITY_PARENT_PATTERNS=[{ patterns:[/^vilnius\b/i,/gama building/i,/delta building/i], parent:"Vilnius" },{ patterns:[/^pune\b/i,/\bpune\b/i,/pune 2nd floor/i,/pune podium/i,/pune tower/i], parent:"Pune" }];

function normalizeCityForMap(rawName){ if(!rawName) return "Unknown"; const name=String(rawName).trim(); for(const rule of CITY_PARENT_PATTERNS){ for(const p of rule.patterns) if(p.test(name)) return rule.parent; } if(name.includes(" - ")) return name.split(" - ")[0].trim(); if(name.includes(",")) return name.split(",")[0].trim(); return name; }

function toNum(v){ if(v===undefined||v===null||v==="") return null; const n=Number(v); return Number.isFinite(n)?n:null; }

function initRealMap(){
  realMap=L.map('realmap',{preferCanvas:true,maxBounds:[[70,-135],[-60,160]],maxBoundsViscosity:1.0,minZoom:2.1,maxZoom:20}).setView([15,0],2.4);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:20,attribution:'Tiles © Esri'}).addTo(realMap);
  window.markerCluster=L.markerClusterGroup({ chunkedLoading:true, showCoverageOnHover:false });
  window.countryLayerGroup=L.layerGroup().addTo(realMap);
  realMap.addLayer(window.markerCluster);
  L.control.scale().addTo(realMap);
}

// --------------------------
// Additional map functions (device icons, city summaries, heatmaps, etc.)
// --------------------------
// ... (functions from map.js remain here, including _deviceIconDiv, _placeDeviceIconsForCity, buildCitySummaryHTML, placeCityMarkers, drawHeatmap, toggleHeat, fitAllCities, populateGlobalCityList, onCityItemClick, populateCityPanel, populateRegionPanel, ensureUniqueCityCoordinates, getCityCoordinates, updateMapData, city bar chart code, tooltips, fullscreen, etc.)

// --------------------------
// DOMContentLoaded INIT
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderGauges();        // Update gauges & pie chart
  setInterval(renderGauges, 6000);
  renderTotalCountChart();
  initRealMap();
  placeCityMarkers();

  const fullscreenBtn=document.getElementById("mapFullscreenBtn");
  const mapCard=document.querySelector(".worldmap-card");
  if(fullscreenBtn && mapCard){
    let isFullscreen=false;
    fullscreenBtn.addEventListener("click",()=>{
      isFullscreen=!isFullscreen;
      if(isFullscreen){ mapCard.classList.add("fullscreen"); document.body.classList.add("map-fullscreen-active"); fullscreenBtn.innerText="✖ Exit Full"; }
      else{ mapCard.classList.remove("fullscreen"); document.body.classList.remove("map-fullscreen-active"); fullscreenBtn.innerText="⛶ View Full"; }
      setTimeout(()=>{ realMap.invalidateSize(true); },300);
    });
  }
});