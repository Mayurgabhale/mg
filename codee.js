PS C:\Users\W0024618\Desktop\laca-occupancy-backend> npm cache clean --force
npm warn using --force Recommended protections disabled.
PS C:\Users\W0024618\Desktop\laca-occupancy-backend> npm run dev

> laca-occupancy-backend@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`
🚀 Server running on port 3001
✅ MSSQL pool connected (Laca)
RequestError: Connection lost - AC2A0000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:

    at handleError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\lib\tedious\request.js:384:15)
    at Connection.emit (node:events:530:35)
    at Connection.emit (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:970:18)
    at Connection.socketError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:1359:12)
    at Socket.<anonymous> (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:1060:12)
    at Socket.emit (node:events:530:35)
    at emitErrorNT (node:internal/streams/destroy:170:8)
    at emitErrorCloseNT (node:internal/streams/destroy:129:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
  code: 'EREQUEST',
  originalError: Error: Connection lost - AC2A0000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:

      at handleError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\lib\tedious\request.js:382:19)
      at Connection.emit (node:events:530:35)
      at Connection.emit (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:970:18)
      at Connection.socketError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:1359:12)
      at Socket.<anonymous> (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:1060:12)
      at Socket.emit (node:events:530:35)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
    info: ConnectionError: Connection lost - AC2A0000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:

        at Connection.socketError (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:1359:26)
        at Socket.<anonymous> (C:\Users\W0024618\Desktop\laca-occupancy-backend\node_modules\mssql\node_modules\tedious\lib\connection.js:1060:12)
        at Socket.emit (node:events:530:35)
        at emitErrorNT (node:internal/streams/destroy:170:8)
        at emitErrorCloseNT (node:internal/streams/destroy:129:3)
        at process.processTicksAndRejections (node:internal/process/task_queues:90:21) {
      code: 'ESOCKET',
      [cause]: [Error]
    }
  },
  number: undefined,
  lineNumber: undefined,
  state: undefined,
  class: undefined,
  serverName: undefined,
  procName: undefined
}
