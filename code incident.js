<td>
  {r.Reasons || r.DetectedScenarios
    ? renderReasonChips(r.Reasons || r.DetectedScenarios)
    : <span className="muted">—</span>}
</td>