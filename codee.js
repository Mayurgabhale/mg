Check below error as well duration file carefully and fix this issue Quickly...




ERROR:root:Failed to connect to master DB using driver 'ODBC Driver 17 for SQL Server' for server SRVWUPNQ0986V
Traceback (most recent call last):
  File "C:\Users\W0024618\Desktop\Trend-Analysis\backend\duration_report.py", line 361, in _connect_master
    return pyodbc.connect(conn_str, autocommit=True)
           ~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^
pyodbc.InterfaceError: ('IM002', '[IM002] [Microsoft][ODBC Driver Manager] Data source name not found and no default driver specified (0) (SQLDriverConnect)')
ERROR:root:Connection attempt failed using driver 'ODBC Driver 17 for SQL Server' for region apac
Traceback (most recent call last):
  File "C:\Users\W0024618\Desktop\Trend-Analysis\backend\duration_report.py", line 410, in get_connection 
    return _make_conn(primary)
  File "C:\Users\W0024618\Desktop\Trend-Analysis\backend\duration_report.py", line 405, in _make_conn     
    return pyodbc.connect(conn_str, autocommit=True)
           ~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^
pyodbc.InterfaceError: ('IM002', '[IM002] [Microsoft][ODBC Driver Manager] Data source name not found and no default driver specified (0) (SQLDriverConnect)')
C:\Users\W0024618\Desktop\Trend-Analysis\backend\duration_report.py:745: FutureWarning: 'S' is deprecated and will be removed in a future version, please use 's' instead.
  df["_lts_rounded"] = df["LocaleMessageTime"].dt.floor("S")
C:\Users\W0024618\Desktop\Trend-Analysis\backend\duration_report.py:745: FutureWarning: 'S' is deprecated and will be removed in a future version, please use 's' instead.
  df["_lts_rounded"] = df["LocaleMessageTime"].dt.floor("S")
C:\Users\W0024618\Desktop\Trend-Analysis\backend\trend_runner.py:954: FutureWarning: DataFrameGroupBy.apply operated on the grouping columns. This behavior is deprecated, and in a future version of pandas the grouping columns will be excluded from the operation. Either pass `include_groups=False` to exclude the groupings or explicitly select the grouping columns after groupby to silence this warning.
  features = grouped.apply(agg_swipe_group).reset_index()
C:\Users\W0024618\Desktop\Trend-Analysis\backend\trend_runner.py:2465: FutureWarning: DataFrameGroupBy.apply operated on the grouping columns. This behavior is deprecated, and in a future version of pandas the grouping columns will be excluded from the operation. Either pass `include_groups=False` to exclude the groupings or explicitly select the grouping columns after groupby to silence this warning.
  raw_metrics_df = grouped_raw.apply(_agg_metrics).reset_index()
C:\Users\W0024618\Desktop\Trend-Analysis\backend\trend_runner.py:2540: FutureWarning: The behavior of array concatenation with empty entries is deprecated. In a future version, this will no longer exclude empty items when determining the result dtype. To retain the old behavior, exclude the empty entries before the concat operation.
  merged_metrics[base_col] = merged_metrics[raw_col].combine_first(merged_metrics.get(base_col))
C:\Users\W0024618\Desktop\Trend-Analysis\backend\trend_runner.py:1791: FutureWarning: Downcasting object dtype arrays on .fillna, .ffill, .bfill is deprecated and will change in a future version. Call result.infer_objects(copy=False) instead. To opt-in to the future behavior, set `pd.set_option('future.no_silent_downcasting', True)`
  for ix, r in df[df['CountSwipes'].fillna(0).astype(int) == 0].iterrows():
C:\Users\W0024618\Desktop\Trend-Analysis\backend\trend_runner.py:1785: FutureWarning: Setting an item of incompatible dtype is deprecated and will raise an error in a future version of pandas. Value '714.6' has dtype incompatible with int64, please explicitly cast to a compatible dtype first.
  df.at[idx, 'DurationMinutes'] = float(dursec / 60.0)
C:\Users\W0024618\Desktop\Trend-Analysis\backend\trend_runner.py:1986: FutureWarning: Downcasting object dtype arrays on .fillna, .ffill, .bfill is deprecated and will change in a future version. Call result.infer_objects(copy=False) instead. To opt-in to the future behavior, set `pd.set_option('future.no_silent_downcasting', True)`
  df['PresentToday'] = df['CountSwipes'].fillna(0).astype(int) > 0
C:\Users\W0024618\Desktop\Trend-Analysis\backend\trend_runner.py:2127: FutureWarning: The behavior of array concatenation with empty entries is deprecated. In a future version, this will no longer exclude empty items when determining the result dtype. To retain the old behavior, exclude the empty entries before the concat operation.
  df['RiskScore'] = df['RiskScore'].combine_first(risk_pairs['RiskScore_temp'])
INFO:werkzeug:127.0.0.1 - - [11/Dec/2025 14:38:29] "GET /run?start=2025-12-10&end=2025-12-10&full=true&region=apac HTTP/1.1" 200 -
