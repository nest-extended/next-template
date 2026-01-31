import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { ClsModule, ClsModuleOptions } from 'nestjs-cls';
import { NestExtendedConfig, NEST_EXTENDED_CONFIG } from '../types/nest-extended.config';

/**
 * Default ClsModule configuration.
 * Used when softDelete is configured but clsModule is not provided.
 */
const DEFAULT_CLS_CONFIG: ClsModuleOptions = {
    global: true,
    middleware: { mount: true },
};

/**
 * Default ConfigModule configuration.
 * Used when config is not provided.
 */
const DEFAULT_CONFIG_OPTIONS: ConfigModuleOptions = {
    envFilePath: ['.env'],
    isGlobal: true,
};

@Module({})
export class NestExtendedModule {
    static async forRoot(config: NestExtendedConfig = {}): Promise<DynamicModule> {
        const imports: Array<DynamicModule | Promise<DynamicModule>> = [];

        // Add ConfigModule with defaults or user-provided config
        imports.push(
            ConfigModule.forRoot({
                ...DEFAULT_CONFIG_OPTIONS,
                ...config.config,
            }),
        );

        // Add ClsModule if softDelete is configured (required for user context)
        // or if explicitly provided by user
        if (config.softDelete || config.clsModule) {
            imports.push(
                ClsModule.forRoot({
                    ...DEFAULT_CLS_CONFIG,
                    ...config.clsModule,
                }),
            );
        }

        // Resolve all import promises
        const resolvedImports = await Promise.all(imports);

        return {
            module: NestExtendedModule,
            global: true,
            imports: resolvedImports,
            providers: [
                {
                    provide: NEST_EXTENDED_CONFIG,
                    useValue: config,
                },
            ],
            exports: [NEST_EXTENDED_CONFIG],
        };
    }
}
