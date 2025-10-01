
Server running at http://localhost:5000
✅ MSSQL pool connected (Pune)
✅ Denver MSSQL pool connected
[DENVER] SSE client disconnected, cleared timers
[DENVER] SSE client disconnected, cleared timers

<--- Last few GCs --->

[35300:00000181087F3000]   582490 ms: Scavenge (interleaved) 3959.7 (4121.2) -> 3959.7 (4121.2) MB, pooled: 19 MB, 6.73 / 0.00 ms  (average mu = 0.223, current mu = 0.079) allocation failure;
[35300:00000181087F3000]   583558 ms: Mark-Compact 3969.7 (4131.1) -> 3958.6 (4119.1) MB, pooled: 20 MB, 1031.15 / 0.00 ms  (average mu = 0.143, current mu = 0.061) allocation failure; scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
----- Native stack trace -----

 1: 00007FF7DCB8542D node::SetCppgcReference+17693
 2: 00007FF7DCAE8248 SSL_get_quiet_shutdown+102712
 3: 00007FF7DD66ED41 v8::Isolate::ReportExternalAllocationLimitReached+65
 4: 00007FF7DD65B9C6 v8::Function::Experimental_IsNopFunction+2870
 5: 00007FF7DD4A8B10 v8::internal::StrongRootAllocatorBase::StrongRootAllocatorBase+31456
 6: 00007FF7DD4A280A v8::internal::StrongRootAllocatorBase::StrongRootAllocatorBase+6106
 7: 00007FF7DD49DEA5 v8::internal::ThreadIsolation::JitPageReference::Size+188453
 8: 00007FF7DCE21D0D BIO_ssl_shutdown+189
