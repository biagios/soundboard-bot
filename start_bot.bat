echo off
cls
echo -----
echo /
echo Please Ensure any other instances of Soundboard Bot are closed.
echo Now hit any key to continue.
echo \
echo -----
pause 
start cmd /k node app.js
exit