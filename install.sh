sudo apt install build-essential git make curl unzip g++ libtool jq libltdl-dev

sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ${USER}

wget https://go.dev/dl/go1.19.4.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.19.4.linux-amd64.tar.gz
rm go1.19.4.linux-amd64.tar.gz

echo export PATH=$PATH:/usr/local/go/bin >> $HOME/.bashrc
mkdir -p $HOME/go/src/github.com/hyperledger
echo export GOPATH=$HOME/go >> $HOME/.bashrc
echo export PATH=$PATH:$GOPATH/bin >> $HOME/.bashrc
echo export PATH=$GOPATH/src/github.com/hyperledger/fabric/build/bin >> $HOME/.bashrc


sudo apt-get purge nodejs
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install -y openjdk-11-jdk maven

wget https://services.gradle.org/distributions/gradle-6.3-bin.zip -P /tmp --quiet
sudo unzip -q /tmp/gradle-6.3-bin.zip -d /opt && rm /tmp/gradle-6.3-bin.zip
sudo ln -s /opt/gradle-6.3/bin/gradle /usr/bin

cd ~/go/src/github.com/hyperledger

git clone https://github.com/hyperledger/fabric.git -b release-2.2

cd fabric
make clean-all
make docker
make configtxgen cryptogen

cd ..
git clone https://github.com/hyperledger/fabric-ca.git -b release-1.4
cd fabric-ca
make clean-all
make docker