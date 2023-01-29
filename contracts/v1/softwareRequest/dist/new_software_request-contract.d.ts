import { Context, Contract } from 'fabric-contract-api';
import { Software } from './software_request';
export declare class NewSoftwareRequestContract extends Contract {
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
    sendNewSwDescription(ctx: Context, id: string, nombre: string, descripcion: string): Promise<void>;
    acceptSoftware(ctx: Context, swId: string, justification: string): Promise<void>;
    rejectSoftware(ctx: Context, swID: string, justification: string): Promise<void>;
    getSoftwareDescription(ctx: Context, swId: string): Promise<Software>;
    listSoftware(ctx: Context): Promise<Software[]>;
    private processResultset;
    private mergeResults;
}
