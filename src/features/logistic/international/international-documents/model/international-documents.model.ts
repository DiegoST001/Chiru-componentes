export interface SupplierSummary {
	id: string;
	name?: string;
	suppliernumber?: string;
}

export interface LogisticsEntry {
	id: string;
	supplier?: SupplierSummary | Record<string, unknown>;
	supplier_id?: string;
	activeRuc?: string | null;
	sunatResolution?: string | null;
	customsPatent?: string | null;
	sunatBondLetter?: string | null;
	municipalLicense?: string | null;
	realFiscalAddressProof?: string | null;
	noTaxDebtCertificate?: string | null;
	legalRepresentativePower?: string | null;
	legalRepresentativeDni?: string | null;
	constitutionDeed?: string | null;
	financialStatements?: string | null;
	civilLiabilityInsurance?: string | null;
}

export type DocumentFieldName =
	| 'activeRuc'
	| 'sunatResolution'
	| 'customsPatent'
	| 'sunatBondLetter'
	| 'municipalLicense'
	| 'realFiscalAddressProof'
	| 'noTaxDebtCertificate'
	| 'legalRepresentativePower'
	| 'legalRepresentativeDni'
	| 'constitutionDeed'
	| 'financialStatements'
	| 'civilLiabilityInsurance';

export interface UpdateLogisticsDocumentsRequest {
	activeRuc?: string;
	sunatResolution?: string;
	customsPatent?: string;
	sunatBondLetter?: string;
	municipalLicense?: string;
	realFiscalAddressProof?: string;
	noTaxDebtCertificate?: string;
	legalRepresentativePower?: string;
	legalRepresentativeDni?: string;
	constitutionDeed?: string;
	financialStatements?: string;
	civilLiabilityInsurance?: string;
}

export interface DocumentUrlResponse {
	fieldName: DocumentFieldName;
	url: string | null;
}

export interface DocumentsStatusEntry {
	field: DocumentFieldName;
	status: 'uploaded' | 'pending';
	url?: string;
}

export interface DocumentsStatusResponse {
	id: string;
	supplierId?: string;
	completionPercentage: number;
	missingRequiredCount: number;
	uploadedRequiredCount: number;
	requiredDocuments: DocumentsStatusEntry[];
	optionalDocuments: DocumentsStatusEntry[];
}

export interface ApiError {
	statusCode: number;
	message: string | string[];
	error?: string;
}

