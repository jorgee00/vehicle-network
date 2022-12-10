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
var NewSystemRequestContract_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewSystemRequestContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const system_request_1 = require("./system_request");
//import {VehicleRequestStatus} from  "./new_vehicle_status";
//import { TradeAgreementHistory } from './tradeagreementhistory';
//import { UpdateAdStatus } from './updateAdStatus';
const ANY_ROLE = 'anyRole';
const BUSINESS_ROLE = 'BUSINESS_ROLE';
let NewSystemRequestContract = NewSystemRequestContract_1 = class NewSystemRequestContract extends fabric_contract_api_1.Contract {
    constructor() {
        super('NewSystemRequestContract');
        this.aclRules = {};
        this.aclRules[NewSystemRequestContract_1.getAclSubject('OEMManufacturerOrgMSP', 'any')] = ['init',];
        this.aclRules[NewSystemRequestContract_1.getAclSubject('HomologatorOrgMSP', 'any')] = ['init'];
        this.aclRules[NewSystemRequestContract_1.getAclSubject('VehicleManufacturerOrgMSP', 'any')] = ['init' /*, 'getUpdateStatus'*/];
        this.aclRules[NewSystemRequestContract_1.getAclSubject('InspectorOrgMSP', 'any')] = ['init'];
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
    async sendNewSystemDescription(ctx, nombre, sw_included) {
        const exists = await this.existe(ctx, nombre);
        if (exists) {
            throw new Error(`The trade ${nombre} already exists`);
        }
        const system = new system_request_1.Sistema();
        system.nombre = nombre;
        system.sw_included = sw_included;
        system.status = "REQUESTED";
        const buffer = Buffer.from(JSON.stringify(system));
        await ctx.stub.putState(nombre, buffer);
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
    async getSystemDescription(ctx, systemId) {
        const exists = await this.existe(ctx, systemId);
        if (!exists) {
            throw new Error(`The vehicle ${systemId} does not exists`);
        }
        const buffer = await ctx.stub.getState(systemId);
        const system = JSON.parse(buffer.toString());
        return system;
    }
    /*@Transaction(false)
    @Returns('DescripcionVehic')
    public async getVehicleSpecificationStatus(ctx: Context, tradeId: string): Promise<VehicleRequestStatus> {
        const trade = await this.getVehicleDescription(ctx, tradeId);
        const tradeStatus = { Status: trade.status, justification: trade.justification };
        return tradeStatus;
    }*/
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
], NewSystemRequestContract.prototype, "inicio", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewSystemRequestContract.prototype, "existe", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewSystemRequestContract.prototype, "sendNewSystemDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewSystemRequestContract.prototype, "acceptSystem", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewSystemRequestContract.prototype, "rejectSystem", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Sistema'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewSystemRequestContract.prototype, "getSystemDescription", null);
NewSystemRequestContract = NewSystemRequestContract_1 = __decorate([
    fabric_contract_api_1.Info({ title: 'NewSystemRequestContract', description: 'System Request SmartContract' }),
    __metadata("design:paramtypes", [])
], NewSystemRequestContract);
exports.NewSystemRequestContract = NewSystemRequestContract;
//# sourceMappingURL=new_system_request-contract.js.map