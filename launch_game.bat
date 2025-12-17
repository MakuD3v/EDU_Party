@echo off
set "URI=%~1"
rem URI format: eduparty://launch?token=lobby_id:username
rem We need to parse this or pass it to Godot safely.
rem For simplicity, we pass the whole URI string to Godot, and Godot parses it.
rem Or we can rely on Godot to handle args.

echo Launching EDU Party with %URI%
cd "C:\Users\USER\Desktop\EDU_Party\client"
godot --path . -- %URI%
