# sanitize before storing / returning
items = clean_nans(items)
summary = clean_nans(summary)

previous_data["summary"] = summary
previous_data["items"] = items
previous_data["last_updated"] = datetime.now().isoformat()