import { ConfigModuleOptions } from '@nestjs/config';
import { ClsModuleOptions } from 'nestjs-cls';

/**
 * Configuration interface for NestExtended module.
 * This allows the application to configure soft delete behavior
 * without coupling the core package to application-specific schemas.
 */
export interface SoftDeleteConfig {
    /**
     * Returns the query filter to exclude soft-deleted documents.
     * Default: { deleted: { $ne: true } }
     */
    getQuery: () => Record<string, any>;

    /**
     * Returns the data to set when soft deleting a document.
     * Receives the current user object from the controller.
     * @param user - The authenticated user object from token verification
     */
    getData: (user: any) => Record<string, any>;
}

export interface NestExtendedConfig {
    /**
     * Soft delete configuration.
     * If not provided, default soft delete behavior is used.
     */
    softDelete?: SoftDeleteConfig;

    /**
     * ClsModule configuration.
     * If softDelete is configured and clsModule is not provided,
     * default CLS config will be used: { global: true, middleware: { mount: true } }
     */
    clsModule?: ClsModuleOptions;

    /**
     * ConfigModule configuration.
     * Default: { envFilePath: ['.env'], isGlobal: true }
     * If not provided, default config will be used.
     */
    config?: ConfigModuleOptions;
}

/**
 * Injection token for NestExtended configuration.
 * Use this to inject the config in services.
 */
export const NEST_EXTENDED_CONFIG = Symbol('NEST_EXTENDED_CONFIG');
