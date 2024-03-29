/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Iterators } from 'fabric-shim-api';
import Long = require('long');
import { AvisoActualizacion/*, System*/ } from './aviso_actualizacion';
//import { TradeAgreementHistory } from './tradeagreementhistory';
//import { UpdateAdStatus } from './updateAdStatus';

const ANY_ROLE = 'anyRole';
const BUSINESS_ROLE = 'BUSINESS_ROLE';

@Info({ title: 'UpdateAdContract', description: 'UpdateAd SmartContract' })
export class UpdateAdContract extends Contract {

    private static getAclSubject(mspIdVal: string, roleVal: string) {
        return JSON.stringify({ mspId: mspIdVal, role: roleVal });        // Deterministic because of the key order
    }

    private aclRules = {};

    constructor() {
        super('UpdateAdContract');
        this.aclRules[UpdateAdContract.getAclSubject('OEMManufacturerOrgMSP', 'any')] = [ 'init' , 'sendUpdateAd'];
        this.aclRules[UpdateAdContract.getAclSubject('HomologatorOrgMSP', 'any')] = [ 'init' ];
        this.aclRules[UpdateAdContract.getAclSubject('VehicleManufacturerOrgMSP', 'any')] = [ 'init' /*, 'getUpdateStatus'*/];
        this.aclRules[UpdateAdContract.getAclSubject('InspectorOrgMSP', 'any')] = [ 'init' ];
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
    public async existe(ctx: Context, tradeId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(tradeId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async sendUpdateAd(ctx: Context, tradeId: string, fab_vehic: string, systems_to_update: string, date: string): Promise<void> {
        const exists = await this.existe(ctx, tradeId);
        if (exists) {
            throw new Error(`The trade ${tradeId} already exists`);
        }
        const trade = new AvisoActualizacion();
        trade.id_documento = tradeId;
        trade.id_fab_vehic = fab_vehic;
        trade.systems_to_update = systems_to_update;
        trade.date = date;

        const buffer = Buffer.from(JSON.stringify(trade));
        await ctx.stub.putState(tradeId, buffer);
    }

    /*@Transaction()
    public async acceptTrade(ctx: Context, tradeId: string): Promise<void> {
        const trade = await this.getTrade(ctx, tradeId);

        if (trade.status !== 'REQUESTED') {
            throw new Error('The trade ' + tradeId + ' is in the wrong status.  Expected REQUESTED got ' + trade.status);
        }
        trade.status = 'ACCEPTED';

        const buffer = Buffer.from(JSON.stringify(trade));
        await ctx.stub.putState(tradeId, buffer);
    }

    @Transaction(false)
    @Returns('TradeAgreement')
    public async getTrade(ctx: Context, tradeId: string): Promise<TradeAgreement> {
        const exists = await this.exists(ctx, tradeId);
        if (!exists) {
            throw new Error(`The trade ${tradeId} does not exists`);
        }
        const buffer = await ctx.stub.getState(tradeId);
        const trade = JSON.parse(buffer.toString()) as TradeAgreement;
        return trade;
    }

    @Transaction(false)
    @Returns('TradeAgreement')
    public async getTradeStatus(ctx: Context, tradeId: string): Promise<TradeAgreementStatus> {
        const trade = await this.getTrade(ctx, tradeId);
        const tradeStatus = { Status: trade.status };
        return tradeStatus;
    }

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

    private async processResultset(resultset: Iterators.StateQueryIterator): Promise<AvisoActualizacion[]> {
        try {
            const tradeList = new Array();
            while (true) {
                const obj = await resultset.next();

                if (obj.value) {
                    const resultStr = Buffer.from(obj.value.value).toString('utf8');
                    const tradeJSON = await JSON.parse(resultStr) as AvisoActualizacion;

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

    private mergeResults(resultset1: AvisoActualizacion[], resultset2: AvisoActualizacion[]): AvisoActualizacion[] {
        const tradeList = resultset1.concat(resultset2).map((item) => JSON.stringify(item));

        const tradeSet = new Set<string>(tradeList);
        return Array.from(tradeSet).map((item) => JSON.parse(item));
    }

}
