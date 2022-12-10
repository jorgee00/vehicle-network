"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NewVehicleRequestContract_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewVehicleRequestContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const descripcion_vehic_1 = require("./descripcion_vehic");
const system_request_1 = require("./system_request");
const sw_request_1 = require("./sw_request");
const ANY_ROLE = 'anyRole';
const BUSINESS_ROLE = 'BUSINESS_ROLE';
let NewVehicleRequestContract = NewVehicleRequestContract_1 = class NewVehicleRequestContract extends fabric_contract_api_1.Contract {
    constructor() {
        super('NewVehicleRequestContract');
        this.aclRules = {};
        this.aclRules[NewVehicleRequestContract_1.getAclSubject('OEMManufacturerOrgMSP', 'any')] = ['init', 'sendUpdateAd'];
        this.aclRules[NewVehicleRequestContract_1.getAclSubject('HomologatorOrgMSP', 'any')] = ['init'];
        this.aclRules[NewVehicleRequestContract_1.getAclSubject('VehicleManufacturerOrgMSP', 'any')] = ['init' /*, 'getUpdateStatus'*/];
        this.aclRules[NewVehicleRequestContract_1.getAclSubject('InspectorOrgMSP', 'any')] = ['init'];
        /*this.aclRules[UpdateAdContract.getAclSubject('ExporterOrgMSP', 'exporter')] = [ 'acceptTrade', 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ExportingEntityOrgMSP', 'exporter')] = [ 'acceptTrade', 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ImporterOrgMSP', 'importer')] = [ 'requestTrade', 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ExporterOrgMSP', 'exporter_banker')] = [ 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('ImporterOrgMSP', 'importer_banker')] = [ 'exists', 'getTrade', 'getTradeStatus', 'listTrade' ];
        this.aclRules[UpdateAdContract.getAclSubject('RegulatorOrgMSP', 'regulator')] = [ 'exists', 'getTrade', 'getTradeStatus', 'listTrade',
                                                                                        'getTradesByRange', 'getTradeHistory' ];
    */ 
    }
    static getAclSubject(mspIdVal, roleVal) {
        return JSON.stringify({ mspId: mspIdVal, role: roleVal }); // Deterministic because of the key order
    }
    async beforeTransaction(ctx) {
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
    async inicio(ctx) {
        console.log('Initializing the trade contract');
    }
    async existe(ctx, id_doc) {
        const buffer = await ctx.stub.getState(id_doc);
        return (!!buffer && buffer.length > 0);
    }
    async sendNewVehicleDescription(ctx, id_doc, cod_modelo, systems) {
        const exists = await this.existe(ctx, id_doc);
        if (exists) {
            throw new Error(`The trade ${id_doc} already exists`);
        }
        const vehicle = new descripcion_vehic_1.DescripcionVehic();
        vehicle.id_doc = id_doc;
        vehicle.codif_modelo = cod_modelo;
        vehicle.sistemas = systems;
        const listOfSystems = systems.replace(/\s/g, '');
        const sistemas = listOfSystems.split(",");
        vehicle.status = "REQUESTED";
        var validSystems;
        for (let i = 0; i < sistemas.length; i++) {
            validSystems = await this.isSystemValid(ctx, sistemas[i]);
            if (!validSystems) {
                vehicle.status = "REJECTED";
            }
        }
        const buffer = Buffer.from(JSON.stringify(vehicle));
        await ctx.stub.putState(id_doc, buffer);
    }
    async sendNewSystemDescription(ctx, nombre, sw_included) {
        const exists = await this.existe(ctx, nombre);
        if (exists) {
            throw new Error(`The trade ${nombre} already exists`);
        }
        const system = new system_request_1.Sistema();
        system.nombre = nombre;
        system.sw_included = sw_included;
        system.status = "REQUESTED";
        const listOfSoftware = sw_included.replace(/\s/g, '');
        const software = listOfSoftware.split(",");
        var validSoftware;
        for (let i = 0; i < software.length; i++) {
            validSoftware = await this.isSoftwareValid(ctx, software[i]);
            if (!validSoftware) {
                system.status = "REJECTED";
            }
        }
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(nombre, buffer);
    }
    async sendNewSwDescription(ctx, nombre) {
        const exists = await this.existe(ctx, nombre);
        if (exists) {
            throw new Error(`The trade ${nombre} already exists`);
        }
        const sw = new sw_request_1.Software();
        sw.nombre = nombre;
        sw.status = "REQUESTED";
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(nombre, buffer);
    }
    async acceptVehicle(ctx, vehicleId, justification) {
        const vehicle = await this.getVehicleDescription(ctx, vehicleId);
        if (vehicle.status !== 'REQUESTED') {
            throw new Error('The trade ' + vehicleId + ' is in the wrong status.  Expected REQUESTED got ' + vehicle.status);
        }
        vehicle.status = 'ACCEPTED';
        vehicle.justification = justification;
        const buffer = Buffer.from(JSON.stringify(vehicle));
        await ctx.stub.putState(vehicleId, buffer);
    }
    async rejectVehicle(ctx, vehicleId, justification) {
        const vehicle = await this.getVehicleDescription(ctx, vehicleId);
        if (vehicle.status !== 'REQUESTED') {
            throw new Error('The vehicle ' + vehicleId + ' is in the wrong status.  Expected REQUESTED got ' + vehicle.status);
        }
        vehicle.status = 'REJECTED';
        vehicle.justification = justification;
        const buffer = Buffer.from(JSON.stringify(vehicle));
        await ctx.stub.putState(vehicleId, buffer);
    }
    async acceptSystem(ctx, systemId, justification) {
        const system = await this.getSystemDescription(ctx, systemId);
        if (system.status !== 'REQUESTED') {
            throw new Error('The system ' + systemId + ' is in the wrong status.  Expected REQUESTED got ' + system.status);
        }
        system.status = 'ACCEPTED';
        system.justification = justification;
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(systemId, buffer);
    }
    async rejectSystem(ctx, systemID, justification) {
        const system = await this.getSystemDescription(ctx, systemID);
        if (system.status !== 'REQUESTED') {
            throw new Error('The system ' + systemID + ' is in the wrong status.  Expected REQUESTED got ' + system.status);
        }
        system.status = 'REJECTED';
        system.justification = justification;
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(systemID, buffer);
    }
    async acceptSoftware(ctx, swId, justification) {
        const sw = await this.getSoftwareDescription(ctx, swId);
        if (sw.status !== 'REQUESTED') {
            throw new Error('The software ' + swId + ' is in the wrong status.  Expected REQUESTED got ' + sw.status);
        }
        sw.status = 'ACCEPTED';
        sw.justification = justification;
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(swId, buffer);
    }
    async rejectSoftware(ctx, swID, justification) {
        const sw = await this.getSoftwareDescription(ctx, swID);
        if (sw.status !== 'REQUESTED') {
            throw new Error('The software ' + swID + ' is in the wrong status.  Expected REQUESTED got ' + sw.status);
        }
        sw.status = 'REJECTED';
        sw.justification = justification;
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(swID, buffer);
    }
    async getVehicleDescription(ctx, vehicleId) {
        const exists = await this.existe(ctx, vehicleId);
        if (!exists) {
            throw new Error(`The vehicle ${vehicleId} does not exists`);
        }
        const buffer = await ctx.stub.getState(vehicleId);
        const vehicle = JSON.parse(buffer.toString());
        return vehicle;
    }
    async getSystemDescription(ctx, systemId) {
        const exists = await this.existe(ctx, systemId);
        if (!exists) {
            throw new Error(`The vehicle ${systemId} does not exists`);
        }
        const buffer = await ctx.stub.getState(systemId);
        const system = JSON.parse(buffer.toString());
        return system;
    }
    async getSoftwareDescription(ctx, swId) {
        const exists = await this.existe(ctx, swId);
        if (!exists) {
            throw new Error(`The software ${swId} does not exists`);
        }
        const buffer = await ctx.stub.getState(swId);
        const system = JSON.parse(buffer.toString());
        return system;
    }
    async getVehicleSpecificationStatus(ctx, tradeId) {
        const trade = await this.getVehicleDescription(ctx, tradeId);
        const tradeStatus = { Status: trade.status, justification: trade.justification };
        return tradeStatus;
    }
    async isSystemValid(ctx, id_sys) {
        /*const vehicle = await this.getVehicleDescription(ctx, id_sys);
        const listOfSystems = vehicle.sistemas.replace(/\s/g,'');
        const sistemas = listOfSystems.split(",");*/
        //for(let i=0; i<sistemas.length; i++){
        const exists = await this.existe(ctx, id_sys);
        if (!exists) {
            return false;
        }
        else {
            const system = await this.getSystemDescription(ctx, id_sys);
            if (system.status == 'REJECTED') {
                return false;
            }
            else {
                const listOfSoftware = system.sw_included.replace(/\s/g, '');
                const software = listOfSoftware.split(",");
                var softwareValid;
                for (let i = 0; i < software.length; i++) {
                    softwareValid = await this.isSoftwareValid(ctx, software[i]);
                    if (!softwareValid) {
                        return false;
                    }
                }
            }
        }
        //}
        return true;
    }
    async isSoftwareValid(ctx, id_sw) {
        /*const system = await this.getSystemDescription(ctx, id_doc);
        const listOfSoftware = system.sw_included.replace(/\s/g,'');
        const software = listOfSoftware.split(",");*/
        //var exists;
        //for(let i=0; i<software.length; i++){
        const exists = await this.existe(ctx, id_sw);
        if (!exists) {
            return false;
        }
        else {
            const sw = await this.getSoftwareDescription(ctx, id_sw);
            if (sw.status == 'REJECTED') {
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
    async processResultset(resultset) {
        try {
            const tradeList = new Array();
            while (true) {
                const obj = await resultset.next();
                if (obj.value) {
                    const resultStr = Buffer.from(obj.value.value).toString('utf8');
                    const tradeJSON = await JSON.parse(resultStr);
                    tradeList.push(tradeJSON);
                }
                if (obj.done) {
                    return tradeList;
                }
            }
        }
        finally {
            await resultset.close();
        }
    }
    mergeResults(resultset1, resultset2) {
        const tradeList = resultset1.concat(resultset2).map((item) => JSON.stringify(item));
        const tradeSet = new Set(tradeList);
        return Array.from(tradeSet).map((item) => JSON.parse(item));
    }
};
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "inicio", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "existe", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "sendNewVehicleDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "sendNewSystemDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "sendNewSwDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "acceptVehicle", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "rejectVehicle", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "acceptSystem", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "rejectSystem", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "acceptSoftware", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "rejectSoftware", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('DescripcionVehic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getVehicleDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Sistema'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getSystemDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Software'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getSoftwareDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('DescripcionVehic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getVehicleSpecificationStatus", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "isSystemValid", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "isSoftwareValid", null);
NewVehicleRequestContract = NewVehicleRequestContract_1 = __decorate([
    fabric_contract_api_1.Info({ title: 'NewVehicleRequestContract', description: 'UpdateAd SmartContract' }),
    __metadata("design:paramtypes", [])
], NewVehicleRequestContract);
exports.NewVehicleRequestContract = NewVehicleRequestContract;
//# sourceMappingURL=new_vehicle_request-contract.js.map