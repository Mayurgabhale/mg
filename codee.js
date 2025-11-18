/* ================= Semi Donut (dashboard sizing + correct colors) =============== */

.semi-donut {
  --percentage: 0;
  --active: #12b76a;      /* green */
  --inactive: #f6b43a;    /* orange */
  width: 300px;
  height: 150px;
  position: relative;
  font-size: 22px;
  font-weight: 600;
  overflow: hidden;
  color: var(--active);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
}

/* Half circle background + fill */
.semi-donut::after {
  content: '';
  width: 300px;
  height: 300px;
  border: 50px solid;
  border-color: var(--inactive) var(--inactive) var(--active) var(--active);
  position: absolute;
  border-radius: 50%;
  left: 0;
  top: 0;
  transform: rotate(calc(-45deg + var(--percentage) * 1.8deg));
  animation: fillAnimation 1s ease-in;
  box-sizing: border-box;
}

/* Inside text */
.gtext {
  position: absolute;
  bottom: 8px;
  text-align: center;
  color: var(--inactive);
}

.gtext .total {
  font-size: 20px;
  color: var(--active);
  display: block;
}

.gtext small {
  font-size: 12px;
  color: #98a3a8;
  display: block;
}