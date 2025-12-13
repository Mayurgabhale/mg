react-dom.development.js:29905 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
babel.min.js:7 Uncaught SyntaxError: Inline Babel script: Unexpected token (1142:21) (at babel.min.js:7:10099)
  1140 |           // resolve reasons once (reasons exist ONLY in aggregated data, not per swipe)
  1141 |           const reasonsText =
> 1142 |             modalRow?.Reasons ||
       |                      ^
  1143 |             modalRow?.DetectedScenarios ||
  1144 |             (details?.aggregated_rows &&
  1145 |               details.aggregated_rows[0] &&
    at J.raise (babel.min.js:7:10099)
    at X.unexpected (babel.min.js:5:27476)
    at te.parseExprAtom (babel.min.js:6:30787)
    at t.parseExprAtom (babel.min.js:8:22540)
    at te.parseExprSubscripts (babel.min.js:6:25684)
    at te.parseMaybeUnary (babel.min.js:6:25267)
    at te.parseExprOps (babel.min.js:6:23839)
    at te.parseMaybeConditional (babel.min.js:6:23430)
    at te.parseMaybeAssign (babel.min.js:6:22650)
    at t.parseMaybeAssign (babel.min.js:8:12561)
J.raise @ babel.min.js:7
X.unexpected @ babel.min.js:5
te.parseExprAtom @ babel.min.js:6
(anonymous) @ babel.min.js:8
te.parseExprSubscripts @ babel.min.js:6
te.parseMaybeUnary @ babel.min.js:6
te.parseExprOps @ babel.min.js:6
te.parseMaybeConditional @ babel.min.js:6
te.parseMaybeAssign @ babel.min.js:6
(anonymous) @ babel.min.js:8
te.parseConditional @ babel.min.js:6
(anonymous) @ babel.min.js:8
te.parseMaybeConditional @ babel.min.js:6
te.parseMaybeAssign @ babel.min.js:6
(anonymous) @ babel.min.js:8
z.parseVar @ babel.min.js:6
z.parseVarStatement @ babel.min.js:6
z.parseStatement @ babel.min.js:5
(anonymous) @ babel.min.js:8
z.parseBlockBody @ babel.min.js:6
z.parseBlock @ babel.min.js:6
te.parseFunctionBody @ babel.min.js:7
(anonymous) @ babel.min.js:8
z.parseFunction @ babel.min.js:6
z.parseFunctionStatement @ babel.min.js:6
z.parseStatement @ babel.min.js:5
(anonymous) @ babel.min.js:8
z.parseBlockBody @ babel.min.js:6
z.parseBlock @ babel.min.js:6
te.parseFunctionBody @ babel.min.js:7
(anonymous) @ babel.min.js:8
z.parseFunction @ babel.min.js:6
z.parseFunctionStatement @ babel.min.js:6
z.parseStatement @ babel.min.js:5
(anonymous) @ babel.min.js:8
z.parseBlockBody @ babel.min.js:6
z.parseBlock @ babel.min.js:6
te.parseFunctionBody @ babel.min.js:7
(anonymous) @ babel.min.js:8
z.parseFunction @ babel.min.js:6
te.parseFunctionExpression @ babel.min.js:6
te.parseExprAtom @ babel.min.js:6
(anonymous) @ babel.min.js:8
te.parseExprSubscripts @ babel.min.js:6
te.parseMaybeUnary @ babel.min.js:6
te.parseExprOps @ babel.min.js:6
te.parseMaybeConditional @ babel.min.js:6
te.parseMaybeAssign @ babel.min.js:6
(anonymous) @ babel.min.js:8
te.parseParenAndDistinguishExpression @ babel.min.js:7
te.parseExprAtom @ babel.min.js:6
(anonymous) @ babel.min.js:8
te.parseExprSubscripts @ babel.min.js:6
te.parseMaybeUnary @ babel.min.js:6
te.parseExprOps @ babel.min.js:6
te.parseMaybeConditional @ babel.min.js:6
te.parseMaybeAssign @ babel.min.js:6
(anonymous) @ babel.min.js:8
te.parseExpression @ babel.min.js:6
z.parseStatement @ babel.min.js:5
(anonymous) @ babel.min.js:8
z.parseBlockBody @ babel.min.js:6
z.parseTopLevel @ babel.min.js:5
t.parse @ babel.min.js:5
h @ babel.min.js:4
n.parse @ babel.min.js:2
n.parseCode @ babel.min.js:2
(anonymous) @ babel.min.js:14
n.wrap @ babel.min.js:2
e.transform @ babel.min.js:14
s @ babel.min.js:1
r @ babel.min.js:24
i @ babel.min.js:24
r @ babel.min.js:24
o @ babel.min.js:24
u @ babel.min.js:24
f @ babel.min.js:1
(anonymous) @ babel.min.js:1


// resolve reasons once (reasons exist ONLY in aggregated data, not per swipe)
const reasonsText =
  modalRow?.Reasons ||
  modalRow?.DetectedScenarios ||
  (details?.aggregated_rows &&
    details.aggregated_rows[0] &&
    (details.aggregated_rows[0].Reasons ||
     details.aggregated_rows[0].DetectedScenarios)) ||
  "";



....
<td>
  {flags[idx].dayStart && reasonsText
    ? renderReasonChips(reasonsText)
    : <span className="muted">—</span>}
</td>


        // Swipe timeline rendering uses DAY_BOUNDARY_HOUR = 0 to match backend date assignment
        function renderSwipeTimeline(details, modalRow) {

          // resolve reasons once (reasons exist ONLY in aggregated data, not per swipe)
          const reasonsText =
            modalRow?.Reasons ||
            modalRow?.DetectedScenarios ||
            (details?.aggregated_rows &&
              details.aggregated_rows[0] &&
              (details.aggregated_rows[0].Reasons ||
                details.aggregated_rows[0].DetectedScenarios)) ||
            "";
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
