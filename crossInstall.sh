#!/bin/sh
arch=$(cat .env | grep HORUS_ARCH= | cut -d '='  -f 2)
sudo rm -R node_modules
if [ -z "$arch" ]
then
        echo "regular"
        npm install
else
        echo "cross "$arch
        npm --arch=$arch --target_arch=$arch install
fi