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
    async exists(ctx, id_doc) {
        const buffer = await ctx.stub.getState(id_doc);
        return (!!buffer && buffer.length > 0);
    }
    /**
     * Functions related to Vehicle
     */
    async sendNewVehicleDescription(ctx, id_doc, cod_modelo, systems) {
        const exists = await this.exists(ctx, id_doc);
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
            validSystems = await this.isSysValid(ctx, sistemas[i]);
            if (!validSystems) {
                vehicle.status = "REJECTED";
            }
        }
        const buffer = Buffer.from(JSON.stringify(vehicle));
        await ctx.stub.putState(id_doc, buffer);
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
    async getVehicleDescription(ctx, vehicleId) {
        const exists = await this.exists(ctx, vehicleId);
        if (!exists) {
            throw new Error(`The vehicle ${vehicleId} does not exists`);
        }
        const buffer = await ctx.stub.getState(vehicleId);
        const vehicle = JSON.parse(buffer.toString());
        return vehicle;
    }
    async getVehicleSpecificationStatus(ctx, tradeId) {
        const trade = await this.getVehicleDescription(ctx, tradeId);
        const tradeStatus = { Status: trade.status, justification: trade.justification };
        return tradeStatus;
    }
    /**
     * Functions related to systems
     */
    async sendNewSysDescription(ctx, id, descripcion, nombre, sw_included) {
        const exists = await this.exists(ctx, "sys-" + id);
        if (exists) {
            throw new Error(`The trade sys-${id} already exists`);
        }
        const system = new system_request_1.System();
        system.nombre = nombre;
        system.id = "sys-" + id;
        system.descripcion = descripcion;
        system.sw_included = sw_included;
        system.status = "REQUESTED";
        for (const sw of sw_included.replace(/\s/g, '').split(",")) {
            if ((await this.getSwStatus(ctx, sw)) === "REJECTED") {
                system.status = "REJECTED";
                break;
            }
        }
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(system.id, buffer);
    }
    async acceptSys(ctx, systemId, justification) {
        const system = await this.getSysDescription(ctx, systemId);
        if (system.status !== 'REQUESTED') {
            throw new Error('The system ' + systemId + ' is in the wrong status.  Expected REQUESTED got ' + system.status);
        }
        system.status = 'ACCEPTED';
        system.justification = justification;
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(systemId, buffer);
    }
    async rejectSys(ctx, systemID, justification) {
        const system = await this.getSysDescription(ctx, systemID);
        if (system.status !== 'REQUESTED') {
            throw new Error('The system ' + systemID + ' is in the wrong status.  Expected REQUESTED got ' + system.status);
        }
        system.status = 'REJECTED';
        system.justification = justification;
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(systemID, buffer);
    }
    async getSysDescription(ctx, systemId) {
        const exists = await this.exists(ctx, systemId);
        if (!exists) {
            throw new Error(`The vehicle ${systemId} does not exists`);
        }
        const buffer = await ctx.stub.getState(systemId);
        const system = JSON.parse(buffer.toString());
        return system;
    }
    async isSysValid(ctx, id_sys) {
        if (await this.exists(ctx, id_sys)) {
            const system = await this.getSysDescription(ctx, id_sys);
            if (system.status != 'REJECTED') {
                for (const sw of system.sw_included.replace(/\s/g, '').split(",")) {
                    if (!await this.isSwValid(ctx, sw)) {
                        return false;
                    }
                }
                ;
                return true;
            }
        }
        return false;
    }
    async listSys(ctx) {
        const queryRegulator = {
            selector: {
                id: { $regex: 'sys-.+' },
            }
        };
        const resultsetRegulator = await ctx.stub.getQueryResult(JSON.stringify(queryRegulator));
        return await this.processResultSetSys(resultsetRegulator);
    }
    async processResultSetSys(resultset) {
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
    /**
     * Functions related to software
     */
    async sendNewSwDescription(ctx, id, nombre, descripcion) {
        const exists = await this.exists(ctx, "sw-" + id);
        if (exists) {
            throw new Error(`The trade sw-${id} already exists`);
        }
        const sw = new sw_request_1.Software();
        sw.nombre = nombre;
        sw.id = "sw-" + id;
        sw.descripcion = descripcion;
        sw.status = "REQUESTED";
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(sw.id, buffer);
    }
    async acceptSw(ctx, swId, justification) {
        const sw = await this.getSwDescription(ctx, swId);
        if (sw.status !== 'REQUESTED') {
            throw new Error('The software ' + swId + ' is in the wrong status.  Expected REQUESTED got ' + sw.status);
        }
        sw.status = 'ACCEPTED';
        sw.justification = justification;
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(swId, buffer);
    }
    async rejectSw(ctx, swID, justification) {
        const sw = await this.getSwDescription(ctx, swID);
        if (sw.status !== 'REQUESTED') {
            throw new Error('The software ' + swID + ' is in the wrong status.  Expected REQUESTED got ' + sw.status);
        }
        sw.status = 'REJECTED';
        sw.justification = justification;
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(swID, buffer);
    }
    async getSwDescription(ctx, swId) {
        const exists = await this.exists(ctx, swId);
        if (!exists) {
            throw new Error(`The software ${swId} does not exists`);
        }
        const buffer = await ctx.stub.getState(swId);
        const system = JSON.parse(buffer.toString());
        return system;
    }
    async isSwValid(ctx, id) {
        return (await this.exists(ctx, id)) && (await this.getSwDescription(ctx, id)).status == 'ACCEPTED';
    }
    async getSwStatus(ctx, id) {
        return (await this.getSwDescription(ctx, id)).status;
    }
    async listSw(ctx) {
        const queryRegulator = {
            selector: {
                id: { $regex: 'sw-.+' },
            }
        };
        const resultsetRegulator = await ctx.stub.getQueryResult(JSON.stringify(queryRegulator));
        return await this.processResultSetSw(resultsetRegulator);
    }
    async processResultSetSw(resultset) {
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
], NewVehicleRequestContract.prototype, "exists", null);
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
], NewVehicleRequestContract.prototype, "acceptVehicle", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "rejectVehicle", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('DescripcionVehic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getVehicleDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('DescripcionVehic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getVehicleSpecificationStatus", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "sendNewSysDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "acceptSys", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "rejectSys", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('System'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getSysDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "isSysValid", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('System[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "listSys", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "sendNewSwDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "acceptSw", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "rejectSw", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Software'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getSwDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "isSwValid", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "getSwStatus", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Software[]'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "listSw", null);
NewVehicleRequestContract = NewVehicleRequestContract_1 = __decorate([
    fabric_contract_api_1.Info({ title: 'NewVehicleRequestContract', description: 'UpdateAd SmartContract' }),
    __metadata("design:paramtypes", [])
], NewVehicleRequestContract);
exports.NewVehicleRequestContract = NewVehicleRequestContract;
//# sourceMappingURL=new_vehicle_request-contract.js.map