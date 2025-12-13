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