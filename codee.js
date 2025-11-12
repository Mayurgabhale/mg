return JSONResponse(content=jsonable_encoder({
    'summary': summary,
    'items': items,
    'message': f'{rows_added} daily travel records saved and cached'
}))