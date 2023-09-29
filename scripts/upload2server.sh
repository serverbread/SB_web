#!/bin/bash
cd ..
for i in ./*
    echo $i
    ftp -n <<- EOF
        open $REMOTE_HOST
        user $REMOTE_USER $REMOTE_PASSWORD
        cd sb_web
        bin
        put $i
        bye
        EOF
    cowsay 'uhhhh'