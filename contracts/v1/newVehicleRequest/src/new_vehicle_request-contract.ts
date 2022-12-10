/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Iterators } from 'fabric-shim-api';
import Long = require('long');
import { DescripcionVehic/*, System*/ } from './descripcion_vehic';
import {VehicleRequestStatus} from  "./new_vehicle_status";
import {Sistema} from "./system_request";
import { Software } from './sw_request';
//import { TradeAgreementHistory } from './tradeagreementhistory';
//import { UpdateAdStatus } from './updateAdStatus';
import { exists } from 'fs';

const ANY_ROLE = 'anyRole';
const BUSINESS_ROLE = 'BUSINESS_ROLE';

@Info({ title: 'NewVehicleRequestContract', description: 'UpdateAd SmartContract' })
export class NewVehicleRequestContract extends Contract {

    private static getAclSubject(mspIdVal: string, roleVal: string) {
        return JSON.stringify({ mspId: mspIdVal, role: roleVal });        // Deterministic because of the key order
    }

    private aclRules = {};

    constructor() {
        super('NewVehicleRequestContract');
        this.aclRules[NewVehicleRequestContract.getAclSubject('OEMManufacturerOrgMSP', 'any')] = [ 'init' , 'sendUpdateAd'];
        this.aclRules[NewVehicleRequestContract.getAclSubject('HomologatorOrgMSP', 'any')] = [ 'init' ];
        this.aclRules[NewVehicleRequestContract.getAclSubject('VehicleManufacturerOrgMSP', 'any')] = [ 'init' /*, 'getUpdateStatus'*/];
        this.aclRules[NewVehicleRequestContract.getAclSubject('InspectorOrgMSP', 'any')] = [ 'init' ];
        /*this.aclRules[UpdateAdContract.getAclSubject('ExporterOrgMSP', 'exporter')] = [ 'acceptTrade', 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ExportingEntityOrgMSP', 'exporter')] = [ 'acceptTrade', 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ImporterOrgMSP', 'importer')] = [ 'requestTrade', 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ExporterOrgMSP', 'exporter_banker')] = [ 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ImporterOrgMSP', 'importer_banker')] = [ 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('RegulatorOrgMSP', 'regulator')] = [ 'exists', 'getTrade', 'getTradeStatus', 'listTrade',
                                                                                        'getTradesByRange', 'getTradeHistory' ];
    */}

    public async beforeTransaction(ctx: Context) {
        /*const mspId = ctx.clientIdentity.getMSPID();
        let role = ctx.clientIdentity.getAttributeValue(BUSINESS_ROLE);
        if (!role) {
            role = 'any';
        }
        const tx = ctx.stub.getFunctionAndParameters().fcn;

        const aclSubject = UpdateAdContract.getAclSubject(mspId, role);
        if (!this.aclRules.hasOwnProperty(aclSubject)) {
            throw new Error(`The participant belonging to MSP ${mspId} and role ${role} is not recognized`);
        }

        if (!this.aclRules[aclSubject].includes(tx)) {
            throw new Error(`The participant belonging to MSP ${mspId} and role ${role} cannot invoke transaction ${tx}`);
        }*/
    }

    /**
     * Perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    @Transaction()
    public async inicio(ctx: Context) {
        console.log('Initializing the trade contract');
    }

    @Transaction(false)
    @Returns('boolean')
    public async existe(ctx: Context, id_doc: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(id_doc);
        return (!!buffer && buffer.length > 0);
    }

    

    @Transaction()
    public async sendNewVehicleDescription(ctx: Context, id_doc: string, cod_modelo: string, systems: string): Promise<void> {
        const exists = await this.existe(ctx, id_doc);
        if (exists) {
            throw new Error(`The trade ${id_doc} already exists`);
        }
        const vehicle = new DescripcionVehic();
        vehicle.id_doc = id_doc;
        vehicle.codif_modelo = cod_modelo;
        vehicle.sistemas = systems;
        const listOfSystems = systems.replace(/\s/g,'');
        const sistemas = listOfSystems.split(",");
        vehicle.status="REQUESTED";
        var validSystems;
        for(let i=0; i<sistemas.length; i++){
            validSystems= await this.isSystemValid(ctx, sistemas[i]);
            if(!validSystems){
                vehicle.status="REJECTED";
            }
        }
        const buffer = Buffer.from(JSON.stringify(vehicle));
        await ctx.stub.putState(id_doc, buffer);
    }

    @Transaction()
    public async sendNewSystemDescription(ctx: Context, nombre: string, sw_included: string): Promise<void> {
        const exists = await this.existe(ctx, nombre);
        if (exists) {
            throw new Error(`The trade ${nombre} already exists`);
        }
        const system = new Sistema();
        system.nombre = nombre;
        system.sw_included =sw_included;
        system.status="REQUESTED";
        const listOfSoftware = sw_included.replace(/\s/g,'');
        const software = listOfSoftware.split(",");
        var validSoftware;
        for(let i=0; i<software.length; i++){
            validSoftware= await this.isSoftwareValid(ctx, software[i]);
            if(!validSoftware){
                system.status="REJECTED";
            }
        }
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(nombre, buffer);
    }

    @Transaction()
    public async sendNewSwDescription(ctx: Context, nombre: string): Promise<void> {
        const exists = await this.existe(ctx, nombre);
        if (exists) {
            throw new Error(`The trade ${nombre} already exists`);
        }
        const sw = new Software();
        sw.nombre = nombre;
        sw.status="REQUESTED";
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(nombre, buffer);
    }

    @Transaction()
    public async acceptVehicle(ctx: Context, vehicleId: string, justification: string): Promise<void> {
        const vehicle = await this.getVehicleDescription(ctx, vehicleId);

        if (vehicle.status !== 'REQUESTED') {
            throw new Error('The trade ' + vehicleId + ' is in the wrong status.  Expected REQUESTED got ' + vehicle.status);
        }
        vehicle.status = 'ACCEPTED';
        vehicle.justification=justification;
        const buffer = Buffer.from(JSON.stringify(vehicle));
        await ctx.stub.putState(vehicleId, buffer);
    }

    @Transaction()
    public async rejectVehicle(ctx: Context, vehicleId: string, justification: string): Promise<void> {
        const vehicle = await this.getVehicleDescription(ctx, vehicleId);

        if (vehicle.status !== 'REQUESTED') {
            throw new Error('The vehicle ' + vehicleId + ' is in the wrong status.  Expected REQUESTED got ' + vehicle.status);
        }
        vehicle.status = 'REJECTED';
        vehicle.justification=justification;
        const buffer = Buffer.from(JSON.stringify(vehicle));
        await ctx.stub.putState(vehicleId, buffer);
    }

    @Transaction()
    public async acceptSystem(ctx: Context, systemId: string, justification: string): Promise<void> {
        const system = await this.getSystemDescription(ctx, systemId);

        if (system.status !== 'REQUESTED') {
            throw new Error('The system ' + systemId + ' is in the wrong status.  Expected REQUESTED got ' + system.status);
        }
        system.status = 'ACCEPTED';
        system.justification=justification;
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(systemId, buffer);
    }

    @Transaction()
    public async rejectSystem(ctx: Context, systemID: string, justification: string): Promise<void> {
        const system = await this.getSystemDescription(ctx, systemID);

        if (system.status !== 'REQUESTED') {
            throw new Error('The system ' + systemID + ' is in the wrong status.  Expected REQUESTED got ' + system.status);
        }
        system.status = 'REJECTED';
        system.justification=justification;
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(systemID, buffer);
    }

    @Transaction()
    public async acceptSoftware(ctx: Context, swId: string, justification: string): Promise<void> {
        const sw = await this.getSoftwareDescription(ctx, swId);

        if (sw.status !== 'REQUESTED') {
            throw new Error('The software ' + swId + ' is in the wrong status.  Expected REQUESTED got ' + sw.status);
        }
        sw.status = 'ACCEPTED';
        sw.justification=justification;
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(swId, buffer);
    }

    @Transaction()
    public async rejectSoftware(ctx: Context, swID: string, justification: string): Promise<void> {
        const sw = await this.getSoftwareDescription(ctx, swID);

        if (sw.status !== 'REQUESTED') {
            throw new Error('The software ' + swID + ' is in the wrong status.  Expected REQUESTED got ' + sw.status);
        }
        sw.status = 'REJECTED';
        sw.justification=justification;
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(swID, buffer);
    }

    @Transaction(false)
    @Returns('DescripcionVehic')
    public async getVehicleDescription(ctx: Context, vehicleId: string): Promise<DescripcionVehic> {
        const exists = await this.existe(ctx, vehicleId);
        if (!exists) {
            throw new Error(`The vehicle ${vehicleId} does not exists`);
        }
        const buffer = await ctx.stub.getState(vehicleId);
        const vehicle = JSON.parse(buffer.toString()) as DescripcionVehic;
        return vehicle;
    }

    @Transaction(false)
    @Returns('Sistema')
    public async getSystemDescription(ctx: Context, systemId: string): Promise<Sistema> {
        const exists = await this.existe(ctx, systemId);
        if (!exists) {
            throw new Error(`The vehicle ${systemId} does not exists`);
        }
        const buffer = await ctx.stub.getState(systemId);
        const system = JSON.parse(buffer.toString()) as Sistema;
        return system;
    }

    @Transaction(false)
    @Returns('Software')
    public async getSoftwareDescription(ctx: Context, swId: string): Promise<Software> {
        const exists = await this.existe(ctx, swId);
        if (!exists) {
            throw new Error(`The software ${swId} does not exists`);
        }
        const buffer = await ctx.stub.getState(swId);
        const system = JSON.parse(buffer.toString()) as Software;
        return system;
    }

    @Transaction(false)
    @Returns('DescripcionVehic')
    public async getVehicleSpecificationStatus(ctx: Context, tradeId: string): Promise<VehicleRequestStatus> {
        const trade = await this.getVehicleDescription(ctx, tradeId);
        const tradeStatus = { Status: trade.status, justification: trade.justification };
        return tradeStatus;
    }

    @Transaction(false)
    @Returns('boolean')
    public async isSystemValid(ctx: Context, id_sys: string): Promise<boolean> {
        /*const vehicle = await this.getVehicleDescription(ctx, id_sys);
        const listOfSystems = vehicle.sistemas.replace(/\s/g,'');
        const sistemas = listOfSystems.split(",");*/
        //for(let i=0; i<sistemas.length; i++){
        const exists = await this.existe(ctx, id_sys);
        if(!exists){
            return false;
        }
        else{
            const system= await this.getSystemDescription(ctx, id_sys);
            if(system.status=='REJECTED'){
                return false;
            }
            else{
                const listOfSoftware = system.sw_included.replace(/\s/g,'');
                const software = listOfSoftware.split(",");
                var softwareValid;
                for(let i=0; i<software.length; i++){
                    softwareValid = await this.isSoftwareValid(ctx, software[i]);
                    if(!softwareValid){
                        return false;
                    }
                }
                
            }
        }
        //}
        return true;
    }

    @Transaction(false)
    @Returns('boolean')
    public async isSoftwareValid(ctx: Context, id_sw: string): Promise<boolean> {
        /*const system = await this.getSystemDescription(ctx, id_doc);
        const listOfSoftware = system.sw_included.replace(/\s/g,'');
        const software = listOfSoftware.split(",");*/
        //var exists;
        //for(let i=0; i<software.length; i++){
        const exists = await this.existe(ctx, id_sw);
        if(!exists){
            return false;
        }
        else{
            const sw= await this.getSoftwareDescription(ctx, id_sw);
            if(sw.status=='REJECTED'){
                return false;
            }
        }
        //}
        return true;
    }

    /*
    @Transaction(false)
    @Returns('TradeAgreement[]')
    public async listTrade(ctx: Context): Promise<TradeAgreement[]> {
        const mspid = ctx.clientIdentity.getMSPID();
        if (mspid === 'RegulatorOrgMSP') {
            const queryRegulator = {
                selector: {
                    tradeID: { $regex: '.+' },
                },
                use_index: ['_design/regulatorIndexDoc', 'regulatorIndex'],
            };

            const resultsetRegulator = await ctx.stub.getQueryResult(JSON.stringify(queryRegulator));
            return await this.processResultset(resultsetRegulator);
        }
        const queryExporter = {
            selector: {
                exporterMSP: ctx.clientIdentity.getMSPID(),
            },
            use_index: ['_design/exporterIndexDoc', 'exporterIndex'],
        };
        const queryImporter = {
            selector: {
                importerMSP: ctx.clientIdentity.getMSPID(),
            },
            use_index: ['_design/importerIndexDoc', 'importerIndex'],
        };

        const resultsetExporter = await ctx.stub.getQueryResult(JSON.stringify(queryExporter));
        const resultsetImporter = await ctx.stub.getQueryResult(JSON.stringify(queryImporter));

        return this.mergeResults(
                        await this.processResultset(resultsetExporter),
                        await this.processResultset(resultsetImporter));
    }

    @Transaction(false)
    @Returns('TradeAgreement[]')
    public async getTradesByRange(ctx: Context, fromTradeId: string, toTradeId: string): Promise<TradeAgreement[]> {
        const resultset = await ctx.stub.getStateByRange(fromTradeId, toTradeId);
        return await this.processResultset(resultset);
    }

    @Transaction(false)
    @Returns('TradeAgreement[]')
    public async getTradeHistory(ctx: Context, tradeId: string): Promise<TradeAgreementHistory[]> {

        const resultset = await ctx.stub.getHistoryForKey(tradeId);

        const results = [];
        try {
            while (true) {
                const obj = await resultset.next();
                if (obj.value) {
                    const tradeHistory = new TradeAgreementHistory();
                    tradeHistory.txId = obj.value.txId;
                    if (Long.isLong(obj.value.timestamp.seconds)) {
                        tradeHistory.timestamp = (new Date(obj.value.timestamp.seconds.toInt() * 1000 + Math.round(obj.value.timestamp.nanos / 1000000))).toString();
                    } else {
                        tradeHistory.timestamp = (new Date(obj.value.timestamp.seconds * 1000 + Math.round(obj.value.timestamp.nanos / 1000000))).toString();
                    }
                    tradeHistory.isDelete = obj.value.isDelete.toString();
                    const resultStr = Buffer.from(obj.value.value).toString('utf8');
                    const tradeJSON = await JSON.parse(resultStr) as TradeAgreement;
                    tradeHistory.tradeAgreement = tradeJSON;
                    results.push(tradeHistory);
                }

                if (obj.done) {
                    return results;
                }
            }
        } finally {
            await resultset.close();
        }
    }*/

    private async processResultset(resultset: Iterators.StateQueryIterator): Promise<DescripcionVehic[]> {
        try {
            const tradeList = new Array();
            while (true) {
                const obj = await resultset.next();

                if (obj.value) {
                    const resultStr = Buffer.from(obj.value.value).toString('utf8');
                    const tradeJSON = await JSON.parse(resultStr) as DescripcionVehic;

                    tradeList.push(tradeJSON);
                }

                if (obj.done) {
                    return tradeList;
                }
            }
        } finally {
            await resultset.close();
        }
    }

    private mergeResults(resultset1: DescripcionVehic[], resultset2: DescripcionVehic[]): DescripcionVehic[] {
        const tradeList = resultset1.concat(resultset2).map((item) => JSON.stringify(item));

        const tradeSet = new Set<string>(tradeList);
        return Array.from(tradeSet).map((item) => JSON.parse(item));
    }

}
