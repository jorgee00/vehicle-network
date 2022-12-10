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
exports.DescripcionVehic = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let DescripcionVehic = class DescripcionVehic {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], DescripcionVehic.prototype, "id_doc", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], DescripcionVehic.prototype, "codif_modelo", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], DescripcionVehic.prototype, "sistemas", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], DescripcionVehic.prototype, "status", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], DescripcionVehic.prototype, "justification", void 0);
DescripcionVehic = __decorate([
    fabric_contract_api_1.Object()
], DescripcionVehic);
exports.DescripcionVehic = DescripcionVehic;
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
//# sourceMappingURL=descripcion_vehic.js.map