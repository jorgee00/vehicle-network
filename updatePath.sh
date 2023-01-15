echo export PATH=$PATH:/usr/local/go/bin >> $HOME/.bashrc
echo export GOPATH=$HOME/go >> $HOME/.bashrc
echo export PATH=$PATH:$GOPATH/bin >> $HOME/.bashrc
echo export PATH=$PATH:$GOPATH/src/github.com/hyperledger/fabric/build/bin >> $HOME/.bashrc

cd bash/
echo export FABRIC_CFG_PATH=${PWD} >> $HOME/.bashrc