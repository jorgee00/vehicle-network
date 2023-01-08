wget https://go.dev/dl/go1.19.4.linux-amd64.tar.gz
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.19.4.linux-amd64.tar.gz
mkdir -p $HOME/go/src
echo export PATH=$PATH:/usr/local/go/bin >> $HOME/.bashrc
echo export GOPATH=$HOME/go >> $HOME/.bashrc
echo export PATH=$PATH:$GOPATH/bin >> $HOME/.bashrc
echo export $GOPATH/src/github.com/hyperledger/fabric/build/bin >> $HOME/.bashrc
mkdir -p $GOPATH/src/github.com/hyperledger/

sudo apt-get purge nodejs
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install -y openjdk-11-jdk maven

wget https://services.gradle.org/distributions/gradle-6.3-bin.zip -P /tmp –quiet
sudo unzip -q /tmp/gradle-6.3-bin.zip -d /opt && rm /tmp/gradle-6.3-bin.zip
sudo ln -s /opt/gradle-6.3/bin/gradle /usr/bin