const suppressGreen = isNoGreenLocation(r);

if (flags[i].dayStart && !suppressGreen) {
  cls.push('row-day-start');
}

const rowStyle =
  (flags[i].dayStart && !suppressGreen)
    ? { background: '#e6ffed' }
    : {};


...


function isNoGreenLocation(row) {
  const z = String(row.Zone || '').toLowerCase();
  return (
    z.includes('quezon') ||
    z.includes('vilnius')
  );
}


where to add excaly 
          // compute dayStart flags so first-of-day gaps become 0 (mirror render logic)
          const flags = new Array(arr.length).fill(null).map(() => ({ dayStart: false }));
          for (let i = 0; i < arr.length; i++) {
            const cur = arr[i];
            const prev = arr[i - 1];
            const curDate = cur.__logical_date || (cur.DateOnly ? String(cur.DateOnly).slice(0, 10) : (cur.Date ? String(cur.Date).slice(0, 10) : null));
            const prevDate = prev ? (prev.__logical_date || (prev.DateOnly ? String(prev.DateOnly).slice(0, 10) : (prev.Date ? String(prev.Date).slice(0, 10) : null))) : null;
            if (!prev || prevDate !== curDate) flags[i].dayStart = true;
          }
          for (let i = 0; i < arr.length; i++) {
            if (flags[i].dayStart) arr[i].__gap = 0;
          }

          return arr;
        }

        // NEW: export timeline to

    }
            }
          }

          for (let i = 0; i < all.length; i++) {
            if (flags[i].dayStart) {
              all[i].__gap = 0;
            }
          }


     function renderReasonChips(reasonText) {
          if (!reasonText) return <span className="muted">—</span>;
          const parts = String(reasonText).split(";").map(s => s.trim()).filter(Boolean);
          return parts.map((p, idx) => (<span key={idx} className="pill" title={SCENARIO_EXPLANATIONS[p] || p}>{p}</span>));
        }

        function renderReasonExplanations(reasonText) {
          if (!reasonText) return <div className="muted">No flags</div>;
          const parts = String(reasonText).split(";").map(s => s.trim()).filter(Boolean);
          return (
            <div>
              {parts.map((p, idx) => (
                <div key={idx} className="why-item" style={{ marginBottom: 8 }}>
                  <b>{p}</b>
                  <div className="small">{SCENARIO_EXPLANATIONS[p] || "No explanation available."}</div>
                </div>
              ))}
            </div>
          );
        }

        async function sendChat(qText, opts = { top_k: 5 }) {
          if (!qText || !qText.toString().trim()) return;
          const text = qText.toString().trim();
          pushChatMessage({ who: 'user', text });
          setChatInput("");
          setChatLoading(true);
          try {
            const payload = Object.assign({ q: text }, opts);
            const resp = await fetch(API_BASE + "/chatbot/query", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!resp.ok) {
              const t = await resp.text().catch(() => '');
              throw new Error("Server: " + resp.status + " " + t);
            }
            const js = await resp.json();
            const answer = js.answer || js.answer_text || js.result || "No answer returned.";
            const evidence = Array.isArray(js.evidence) ? js.evidence : (js.evidence ? [js.evidence] : []);
            pushChatMessage({ who: 'bot', text: answer, evidence });
          } catch (err) {
            pushChatMessage({ who: 'bot', text: "Error: " + err.message, evidence: [] });
            console.error("chat error", err);
          } finally {
            setChatLoading(false);
            setTimeout(() => {
              const el = document.querySelector('.chat-body');
              if (el) el.scrollTop = el.scrollHeight;
            }, 80);
          }
        }

        const QUICK_PROMPTS = [
          "Who is high risk today",
          "Who is low risk today",
          "Show me 320172 last 90 days",
          "Trend details for today — top reasons",
          "Explain repeated_short_breaks"
        ];
        function useQuickPrompt(q) {
          setChatOpen(true);
          sendChat(q);
        }

        function isNoGreenLocation(row) {
          const z = String(row.Zone || '').toLowerCase();
          return (
            z.includes('quezon') ||
            z.includes('vilnius')
          );
        }

        // Swipe timeline rendering uses DAY_BOUNDARY_HOUR = 0 to match backend date assignment
        function renderSwipeTimeline(details, modalRow) {


          if (!details || !details.raw_swipes || details.raw_swipes.length === 0) {
            return <div className="muted">No raw swipe evidence available (person not flagged or raw file missing).</div>;
          }

          const all = details.raw_swipes.map(r => {
            const obj = Object.assign({}, r);
            try { obj.__ts = makeLocalDateFromRow(obj); } catch (e) { obj.__ts = null; }

            let gap = null;
            if (obj.SwipeGapSeconds !== undefined && obj.SwipeGapSeconds !== null) {
              gap = Number(obj.SwipeGapSeconds);
              if (isNaN(gap)) gap = null;
            } else if (obj.SwipeGap) {
              try {
                const parts = String(obj.SwipeGap).split(':').map(p => Number(p));
                if (parts.length === 3 && parts.every(p => !isNaN(p))) gap = parts[0] * 3600 + parts[1] * 60 + parts[2];
              } catch (e) { gap = null; }
            }
            obj.__gap = gap;
            obj.__zone_l = String((obj.Zone || '')).toLowerCase();

            // Prefer backend-provided date fields (DateOnly) or computed timestamp
            if (obj.__ts) {
              obj.__logical_date = logicalDateForTs(obj.__ts, DAY_BOUNDARY_HOUR);
            } else if (obj.DateOnly) {
              // DateOnly may be a string or object; coerce to YYYY-MM-DD
              obj.__logical_date = String(obj.DateOnly).slice(0, 10);
            } else if (obj.Date) {
              obj.__logical_date = String(obj.Date).slice(0, 10);
            } else {
              obj.__logical_date = null;
            }
            return obj;
          }).sort((a, b) => {
            // Primary sort: parsed timestamp if present
            if (a.__ts && b.__ts) return a.__ts - b.__ts;
            if (a.__ts) return -1;
            if (b.__ts) return 1;
            // Fallback: use DateOnly + Time or Date+Time strings
            const ka = (a.DateOnly || a.Date || '') + ' ' + (a.Time || '');
            const kb = (b.DateOnly || b.Date || '') + ' ' + (b.Time || '');
            return ka.localeCompare(kb);
          });

          // flags: dayStart for first row OR when logical date changes between rows
          const flags = new Array(all.length).fill(null).map(() => ({ dayStart: false, outReturn: false }));
          for (let i = 0; i < all.length; i++) {
            const cur = all[i];
            const prev = all[i - 1];
            const curDate = cur.__logical_date || (cur.DateOnly ? String(cur.DateOnly).slice(0, 10) : (cur.Date ? String(cur.Date).slice(0, 10) : null));
            const prevDate = prev ? (prev.__logical_date || (prev.DateOnly ? String(prev.DateOnly).slice(0, 10) : (prev.Date ? String(prev.Date).slice(0, 10) : null))) : null;
            if (!prev || prevDate !== curDate) {
              flags[i].dayStart = true;
            }
          }

          const OUT_RETURN_GAP_SECONDS = 60 * 60;
          for (let i = 0; i < all.length - 1; i++) {
            const a = all[i], b = all[i + 1];
            const aZone = a.__zone_l || ''; const bZone = b.__zone_l || ''; const bGap = b.__gap || 0;
            if (aZone.includes('out of office') || aZone.includes('out_of_office') || aZone.includes('out of')) {
              if (!bZone.includes('out of office') && (bGap >= OUT_RETURN_GAP_SECONDS || (bGap === null && aZone.includes('out')))) {
                flags[i].outReturn = true; flags[i + 1].outReturn = true;
              }
            }
          }

          for (let i = 0; i < all.length; i++) {
            if (flags[i].dayStart) {
              all[i].__gap = 0;
            }
          }

          return (
            <div className="table-scroll">
              <table className="evidence-table" role="table" aria-label="Swipe timeline">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Employee ID</th>
                    <th>Card</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>SwipeGap</th>
                    <th>Door</th>
                    <th>Direction</th>
                    <th>Zone</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {all.map((rObj, idx) => {
                    const r = rObj || {};
                    const g = (r.__gap !== undefined && r.__gap !== null) ? Number(r.__gap) : null;
                    const isDayStart = flags[idx].dayStart;
                    const gapFormatted = (isDayStart)
                      ? formatSecondsToHmsJS(0)
                      : (
                        (r.SwipeGap && String(r.SwipeGap).trim())
                          ? String(r.SwipeGap)
                          : (g !== null && g !== undefined)
                            ? formatSecondsToHmsJS(g)
                            : "-"
                      );

                    // display date: prefer logical (backend date), then DateOnly, then Date
                    const displayDate = r.__logical_date || (r.DateOnly ? String(r.DateOnly).slice(0, 10) : (r.Date ? String(r.Date).slice(0, 10) : '-'));
                    const displayTime = r.Time || (r.__ts ? r.__ts.toTimeString().slice(0, 8) : '-');

                    const cls = [];
                    if (isDayStart) cls.push('row-day-start');
                    if (flags[idx].outReturn) cls.push('row-out-return');
                    const rowStyle = isDayStart ? { background: '#e6ffed' } : {};
                    let extraNote = "";
                    try {
                      const originalDate = r.Date ? String(r.Date).slice(0, 10) : null;
                      const logical = r.__logical_date || null;
                      if (originalDate && logical && originalDate !== logical) {
                        extraNote = `Orig: ${originalDate}`;
                        if ((String(r.Direction || '').toLowerCase().indexOf('out') !== -1)) {
                          extraNote += " — Out";
                        }
                      }
                    } catch (e) { extraNote = ""; }

                    return (
                      <tr key={idx} className={cls.join(' ')} style={rowStyle}>
                        <td className="small">{r.EmployeeName || '-'}</td>
                        <td className="small">{r.EmployeeID || '-'}</td>
                        <td className="small">{r.CardNumber || r.Card || '-'}</td>
                        <td className="small">{displayDate}</td>
                        <td className="small">{displayTime}</td>
                        <td className="small">{gapFormatted}</td>
                        <td className="small" style={{ minWidth: 160 }}>{r.Door || '-'}</td>
                        <td className="small">{r.Direction || '-'}</td>
                        <td className="small">{r.Zone || '-'}</td>
                        <td className="small">{r.Note || '-'}{r._source ? <span className="muted"> ({r._source})</span> : null}
                          {extraNote ? <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{extraNote}</div> : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        function handleRiskBarClick(label) {
          if (!label) return;
          if (selectedRiskFilter === label) {
            setSelectedRiskFilter("");
          } else {
            setSelectedRiskFilter(label);
          }
          setPage(1);
        }

        function clearRiskFilter() {
          setSelectedRiskFilter("");
        }

