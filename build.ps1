Set-Location .\server
npm run build
Set-Location ..\example\angular-project
npm run build:ssr
npm run serve:ssr