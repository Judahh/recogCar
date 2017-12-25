#!/bin/sh
name=$(cat .env | grep HORUS_MODEL= | cut -d '='  -f 2)
cd ..
echo $name
zip -r $name.zip HorusSoftware -x *.git* -x *.ts -x *.map -x *.gitignore -x *.npmignore -x *.log -x *.md