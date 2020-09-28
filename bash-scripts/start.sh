#!/usr/bin/env bash

clear

echo
echo "--------------------------------------------------------------------------------"
echo "This script installs the './node_modules'."
echo "--------------------------------------------------------------------------------"
echo "Installing 'node_modules'..."
echo

yarn

echo
echo "Copy Node files to './assets/dependencies'..."
echo

nps --silent nodecopy

echo
echo "And some more production files..."
echo

nps --silent copy

echo "...ready."

echo "--------------------------------------------------------------------------------"
echo "This script just installed 'node_modules' and some production files."
echo "--------------------------------------------------------------------------------"
echo
echo "--------------------------------------------------------------------------------"
echo "You can start the development environment with 'npm run dev'! Happy Development!"
echo "--------------------------------------------------------------------------------"
echo
exit 0
