.margin{
    margin: 25px;
}

/* ===================Semi Donut Chart model-1======================== */

.semi-donut{
  --percentage: 0;
  --fill: #ff0;
  width: 300px;
  height: 150px;
  position: relative;
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;
  color: var(--fill);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
}

.semi-donut::after{
  content: '';
  width: 300px;
  height: 300px;
  border: 50px solid;
  border-color: rgba(0,0,0,0.15) rgba(0,0,0,0.15) var(--fill) var(--fill);
  position: absolute;
  border-radius: 50%;
  left: 0;
  top: 0;
  transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
  animation: fillAnimation 1s ease-in;
  box-sizing: border-box;
}

/* ===================Semi Donut Chart model-2======================== */

.semi-donut-model-2{
  width: 300px;
  height: 150px;
  position: relative;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  border-radius: 150px 150px 0 0;
  overflow: hidden;
  color: var(--fill);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
}

.semi-donut-model-2::before,
.semi-donut-model-2::after{
  content: '';
  width: 300px;
  height: 150px;
  border: 50px solid var(--fill);
  border-top: none;
  position: absolute;
  transform-origin: 50% 0%;
  border-radius: 0 0 300px 300px;
  left: 0;
  top: 100%;
  box-sizing: border-box;
}

.semi-donut-model-2::before{
  border-color: rgba(0,0,0,.15);
  transform: rotate(180deg);
}

.semi-donut-model-2::after{
  z-index: 3;
  animation: fillGraphAnimation 1s ease-in;
  transform: rotate(calc(var(--percentage) * 1.8deg));
}

.semi-donut-model-2:hover::after{
  opacity: .8;
  cursor: pointer;
}

/* ===================Multi Semi Donut Chart ======================== */

.multi-graph{
  width: 300px;
  height: 150px;
  position: relative;
  font-size: 22px;
  font-weight: 600;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.multi-graph::before{
  content: '';
  width: 300px;
  height: 150px;
  border: 50px solid rgba(0,0,0,.15);
  border-bottom: none;
  position: absolute;
  border-radius: 300px 300px 0 0;
  transform-origin: 50% 0%;
  left: 0;
  top: 0;
  box-sizing: border-box;
}

.multi-graph .graph{
  width: 300px;
  height: 150px;
  border: 50px solid var(--fill);
  border-top: none;
  position: absolute;
  transform-origin: 50% 0%;
  border-radius: 0 0 300px 300px;
  left: 0;
  top: 100%;
  z-index: 5;
  animation: fillGraphAnimation 1s ease-in;
  transform: rotate(calc(var(--percentage) * 1.8deg));
  box-sizing: border-box;
  cursor: pointer;
}

.multi-graph .graph::after{
  content: attr(data-name) ' ' counter(val) '%';
  counter-reset: val var(--percentage);
  background: var(--fill);
  border-radius: 2px;
  color: #fff;
  font-weight: 200;
  font-size: 12px;
  height: 20px;
  padding: 3px 5px;
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(calc(-1 * var(--percentage) * 1.8deg)) translate(-30px, 0);
  transform-origin: 0 50%;
  opacity: 0;
}

.multi-graph .graph:hover{
  opacity: 0.8;
}

.multi-graph .graph:hover::after{
  opacity: 1;
  left: 30px;
}

/* ===================Animations======================== */

@keyframes fillAnimation{
  0%{transform : rotate(-45deg);}
  50%{transform: rotate(135deg);}
}

@keyframes fillGraphAnimation{
  0%{transform: rotate(0deg);}
  50%{transform: rotate(180deg);}
}