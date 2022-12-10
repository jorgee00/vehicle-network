import { Context, Contract } from 'fabric-contract-api';
export declare class UpdateAdContract extends Contract {
    private static getAclSubject;
    private aclRules;
    constructor();
    beforeTransaction(ctx: Context): Promise<void>;
    /**
     * Perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    inicio(ctx: Context): Promise<void>;
    existe(ctx: Context, tradeId: string): Promise<boolean>;
    sendUpdateAd(ctx: Context, tradeId: string, fab_vehic: string, systems_to_update: string, date: string): Promise<void>;
    private processResultset;
    private mergeResults;
}
