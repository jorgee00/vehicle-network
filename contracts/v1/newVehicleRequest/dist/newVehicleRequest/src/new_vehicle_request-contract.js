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
    async haySistemas(ctx, id_doc) {
        //const trade = await this.getVehicleDescription(ctx, id_doc);
        /*const sistemas = trade.sistemas.split(",");
        var exists;
        for(let i=0; i<sistemas.length; i++){
            exists = await this.existe(ctx, id_doc);
            if(!exists){
                return false;
            }
        }*/
        return "true";
    }
    async sendNewVehicleDescription(ctx, id_doc, cod_modelo, systems) {
        const exists = await this.existe(ctx, id_doc);
        if (exists) {
            throw new Error(`The trade ${id_doc} already exists`);
        }
        const trade = new descripcion_vehic_1.DescripcionVehic();
        trade.id_doc = id_doc;
        trade.codif_modelo = cod_modelo;
        trade.sistemas = systems;
        trade.status = "REQUESTED";
        const buffer = Buffer.from(JSON.stringify(trade));
        await ctx.stub.putState(id_doc, buffer);
    }
    async acceptVehicle(ctx, tradeId, justification) {
        const trade = await this.getVehicleDescription(ctx, tradeId);
        if (trade.status !== 'REQUESTED') {
            throw new Error('The trade ' + tradeId + ' is in the wrong status.  Expected REQUESTED got ' + trade.status);
        }
        trade.status = 'ACCEPTED';
        trade.justification = justification;
        const buffer = Buffer.from(JSON.stringify(trade));
        await ctx.stub.putState(tradeId, buffer);
    }
    async rejectVehicle(ctx, tradeId, justification) {
        const trade = await this.getVehicleDescription(ctx, tradeId);
        if (trade.status !== 'REQUESTED') {
            throw new Error('The trade ' + tradeId + ' is in the wrong status.  Expected REQUESTED got ' + trade.status);
        }
        trade.status = 'REJECTED';
        trade.justification = justification;
        const buffer = Buffer.from(JSON.stringify(trade));
        await ctx.stub.putState(tradeId, buffer);
    }
    async getVehicleDescription(ctx, tradeId) {
        const exists = await this.existe(ctx, tradeId);
        if (!exists) {
            throw new Error(`The trade ${tradeId} does not exists`);
        }
        const buffer = await ctx.stub.getState(tradeId);
        const trade = JSON.parse(buffer.toString());
        return trade;
    }
    async getVehicleSpecificationStatus(ctx, tradeId) {
        const trade = await this.getVehicleDescription(ctx, tradeId);
        const tradeStatus = { Status: trade.status, justification: trade.justification };
        return tradeStatus;
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
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], NewVehicleRequestContract.prototype, "haySistemas", null);
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
NewVehicleRequestContract = NewVehicleRequestContract_1 = __decorate([
    fabric_contract_api_1.Info({ title: 'NewVehicleRequestContract', description: 'UpdateAd SmartContract' }),
    __metadata("design:paramtypes", [])
], NewVehicleRequestContract);
exports.NewVehicleRequestContract = NewVehicleRequestContract;
//# sourceMappingURL=new_vehicle_request-contract.js.map