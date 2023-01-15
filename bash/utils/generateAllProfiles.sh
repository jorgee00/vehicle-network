#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
#
mkdir -p ../../gateways
node manage-connection-profile.js --generate oemmanuf OEMManufacturerOrgMSP 7051 7054
node manage-connection-profile.js --generate homologatororg HomologatorOrgMSP 8051 8054
node manage-connection-profile.js --generate vehiclemanuf VehicleManufacturerOrgMSP 9051 9054
node manage-connection-profile.js --generate inspectororg InspectorOrgMSP 10051 10054
