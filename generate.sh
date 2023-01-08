cd bash

rm -r channel-artifacts/
rm -r crypto-config/

cryptogen generate --config=./crypto-config.yaml

configtxgen -profile FourOrgsTradeOrdererGenesis -channelID trade-sys-channel -outputBlock ./channel-artifacts/genesis.block

configtxgen -profile FourOrgsVehicleChannel -outputCreateChannelTx ./channel-artifacts/tradechannel/channel.tx -channelID tradechannel

configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/OEMManufacturerOrgMSPanchor.tx -channelID tradechannel -asOrg OEMManufacturerOrg

configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/HomologatorMSPanchor.tx -channelID tradechannel -asOrg HomologatorOrg

configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/VehicleManufacturerMSPanchor.tx -channelID tradechannel -asOrg VehicleManufacturerOrg

configtxgen -profile FourOrgsVehicleChannel -outputAnchorPeersUpdate ./channel-artifacts/tradechannel/InspectorOrgMSPanchor.tx -channelID tradechannel -asOrg InspectorOrg