#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then

  npm run dist:mac

else

  sudo dpkg --add-architecture i386
  sudo add-apt-repository ppa:ubuntu-wine/ppa -y
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
  echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
  sudo apt-get update
  sudo apt-get install icnsutils \
                       graphicsmagick \
                       xz-utils \
                       mono-devel \
                       ca-certificates-mono \
                       wine1.8 \
                       gcc-multilib \
                       g++-multilib

  npm run dist:all

fi
