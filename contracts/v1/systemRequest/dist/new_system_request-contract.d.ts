import { Context, Contract } from 'fabric-contract-api';
import { Sistema } from './system_request';
export declare class NewSystemRequestContract extends Contract {
    private static getAclSubject;
    private aclRules;
    constructor();
    beforeTransaction(ctx: Context): Promise<void>;
    /**
     * Perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    inicio(ctx: Context): Promise<void>;
    existe(ctx: Context, id_doc: string): Promise<boolean>;
    sendNewSystemDescription(ctx: Context, nombre: string, sw_included: string): Promise<void>;
    acceptSystem(ctx: Context, systemId: string, justification: string): Promise<void>;
    rejectSystem(ctx: Context, systemID: string, justification: string): Promise<void>;
    getSystemDescription(ctx: Context, systemId: string): Promise<Sistema>;
    private processResultset;
    private mergeResults;
}
