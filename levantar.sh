cd bash

rm -r channel-artifacts/

../../build/bin/cryptogen generate --config=./crypto-config.yaml

../../build/bin/configtxgen -profile FourOrgsTradeOrdererGenesis -channelID trade-sys-channel -outputBlock ./channel-artifacts/genesis.block

../../build/bin/configtxgen -profile FourOrgsVehicleChannel -outputCreateChannelTx ./channel-artifacts/tradechannel/channel.tx -channelID tradechannel

../../build/bin/configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/OEMManufacturerOrgMSPanchor.tx -channelID tradechannel -asOrg OEMManufacturerOrg

../../build/bin/configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/HomologatorMSPanchor.tx -channelID tradechannel -asOrg HomologatorOrg

../../build/bin/configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/VehicleManufacturerMSPanchor.tx -channelID tradechannel -asOrg VehicleManufacturerOrg

../../build/bin/configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/InspectorOrgMSPanchor.tx -channelID tradechannel -asOrg InspectorOrg

docker-compose -f docker-compose-e2e.yaml -f docker-compose-couchdb.yaml up