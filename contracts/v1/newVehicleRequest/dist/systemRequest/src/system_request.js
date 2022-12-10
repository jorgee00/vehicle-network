"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sistema = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let Sistema = class Sistema {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Sistema.prototype, "nombre", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], Sistema.prototype, "sw_included", void 0);
Sistema = __decorate([
    fabric_contract_api_1.Object()
], Sistema);
exports.Sistema = Sistema;
/*export class CodifModelo {
    marca:       string;
    modelo:      string;
    id_vehículo: string;
}

export class Sistema {
    nombre:  string;
    manager: Manager;
}

export class Manager {
    identificador:        string;
    nombre:               string;
    sistemas_controlados: string[];
}*/ 
//# sourceMappingURL=system_request.js.map