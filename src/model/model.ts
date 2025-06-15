
export interface Category {
    /** Category name */
    name: string;

    /** Subcategory name */
    subcategory?: string;
}

/**
 * TypeScript interface for banking transactions with validation and type safety.
 * Converted from Python Pydantic model.
 */
export interface Transaction {
    /** Unique identifier for the transaction */
    id: string;

    /** User identifier for the transaction */
    user: string;

    /** Source of the transaction (e.g., 'bank', 'credit card') */
    source: string;

    /** Transaction date */
    date: Date;

    /** Transaction amount */
    amount: number;

    /** Currency code (e.g., EUR, USD) */
    currency: string;

    /** IBAN of the account associated with the transaction */
    iban?: string;

    /** IBAN of the other account involved in the transaction */
    other_party_iban?: string;

    /** Other party in the transaction */
    other_party?: string;

    /** Transaction description/usage */
    usage: string;

    /** Transaction category */
    category?: Category;
}