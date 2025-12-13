<td>
  {flags[idx].dayStart
    ? renderReasonChips(modalRow?.Reasons || modalRow?.DetectedScenarios)
    : <span className="muted">—</span>}
</td>