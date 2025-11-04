summary = {
    'total_travelers': len(clean_df),
    'active_now': int(clean_df['active_now'].sum()),
    'upcoming': int(((clean_df['BEGIN_DT'] > now_utc)).sum()),
    'inactive': int(((clean_df['END_DT'] < now_utc)).sum()),
}

previous_data["summary"] = summary
previous_data["items"] = items

return JSONResponse(content={
    'summary': summary,
    'items': items,
    'message': 'New file uploaded and processed successfully'
})