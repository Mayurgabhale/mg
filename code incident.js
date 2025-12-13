Reasons: Array.from(val.ReasonsSet).join(";"),



...
...

{renderReasonChips(modalRow.Reasons || modalRow.DetectedScenarios)}

...
...
...
<th>Reasons Flagged</th>


...

<td>
  {row.Reasons
    ? renderReasonChips(row.Reasons)
    : <span className="muted">—</span>}
</td>

...
..

<td>
  {renderReasonChips(
    row.Reasons ||
    row.DetectedScenarios ||
    row.Detected ||
    ""
  )}
</td>

..
..
..