export interface Product {
    id: string;
    image: string;
    name: string;
    status: ProductStatus;
    category: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    archivedAt?: string;
}

export type ProductStatus = 'active' | 'draft' | 'archived';