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
var NewSoftwareRequestContract_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewSoftwareRequestContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const software_request_1 = require("./software_request");
//import {VehicleRequestStatus} from  "./new_vehicle_status";
//import { TradeAgreementHistory } from './tradeagreementhistory';
//import { UpdateAdStatus } from './updateAdStatus';
const ANY_ROLE = 'anyRole';
const BUSINESS_ROLE = 'BUSINESS_ROLE';
let NewSoftwareRequestContract = NewSoftwareRequestContract_1 = class NewSoftwareRequestContract extends fabric_contract_api_1.Contract {
    constructor() {
        super('NewSoftwareRequestContract');
        this.aclRules = {};
        this.aclRules[NewSoftwareRequestContract_1.getAclSubject('OEMManufacturerOrgMSP', 'any')] = ['init',];
        this.aclRules[NewSoftwareRequestContract_1.getAclSubject('HomologatorOrgMSP', 'any')] = ['init'];
        this.aclRules[NewSoftwareRequestContract_1.getAclSubject('VehicleManufacturerOrgMSP', 'any')] = ['init' /*, 'getUpdateStatus'*/];
        this.aclRules[NewSoftwareRequestContract_1.getAclSubject('InspectorOrgMSP', 'any')] = ['init'];
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
    async sendNewSwDescription(ctx, nombre) {
        const exists = await this.existe(ctx, nombre);
        if (exists) {
            throw new Error(`The trade ${nombre} already exists`);
        }
        const sw = new software_request_1.Software();
        sw.nombre = nombre;
        sw.status = "REQUESTED";
        const buffer = Buffer.from(JSON.stringify(sw));
        await ctx.stub.putState(nombre, buffer);
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
    async getSoftwareDescription(ctx, swId) {
        const exists = await this.existe(ctx, swId);
        if (!exists) {
            throw new Error(`The software ${swId} does not exists`);
        }
        const buffer = await ctx.stub.getState(swId);
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
], NewSoftwareRequestContract.prototype, "inicio", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewSoftwareRequestContract.prototype, "existe", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewSoftwareRequestContract.prototype, "sendNewSwDescription", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewSoftwareRequestContract.prototype, "acceptSoftware", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], NewSoftwareRequestContract.prototype, "rejectSoftware", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Software'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewSoftwareRequestContract.prototype, "getSoftwareDescription", null);
NewSoftwareRequestContract = NewSoftwareRequestContract_1 = __decorate([
    fabric_contract_api_1.Info({ title: 'NewSoftwareRequestContract', description: 'System Request SmartContract' }),
    __metadata("design:paramtypes", [])
], NewSoftwareRequestContract);
exports.NewSoftwareRequestContract = NewSoftwareRequestContract;
//# sourceMappingURL=new_software_request-contract.js.map