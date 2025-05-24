export enum BCStatus {
  ISSUED = 'ISSUED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

// This matches the NestJS CreateBonCommandeDto
export interface CreateBCDto {
  reference: string;
  date?: string;
  fournisseurId: number;
  demandeAchatId: number;
  montantTotal?: number;
  status?: BCStatus;
  demandeProjetId?: number;
}
