import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { PaginatedResponse } from '../types/PaginatedResponse';
import { BadRequestException } from '@nestjs/common';
import { assignFilters, FILTERS, rawQuery } from '../common/query.utils';
import options from '../common/options';
import { NestServiceOptions } from '../types/ServiceOptions';
import { nestify } from '../common/nestify';
import { RootFilterQuery } from 'mongoose';
import { Users } from 'src/schemas/users.schema';

export class NestService<M, D> {
    private model: Model<M>;
    private options: NestServiceOptions;
    constructor(model: Model<M>, options: NestServiceOptions = {}) {
        this.model = model;
        this.options = {
            multi: false,
            softDelete: true,
            pagination: true,
            ...options,
        };
    }

    async _find<P extends boolean = true>(
        query: Record<string, any> = {},
        findOptions: {
            pagination?: P;
        } = {
                pagination: this.options.pagination as P,
            },
    ): Promise<P extends true ? PaginatedResponse<D> : D[]> {
        // Apply soft delete filter if enabled
        if (this.options.softDelete) {
            query[options.deleteKey || 'deleted'] = {
                $ne: true,
            };
        }

        const filters = assignFilters({}, query, FILTERS, {});
        const searchQuery = rawQuery(query);
        const isPaginationEnabled = findOptions.pagination ?? this.options.pagination;

        const q = this.model.find(searchQuery);
        nestify(q, filters, options, !isPaginationEnabled);

        if (!isPaginationEnabled) {
            return (await q.exec()) as P extends true ? PaginatedResponse<D> : D[];
        }

        const countQuery = this.options.softDelete
            ? { [options.deleteKey || 'deleted']: { $ne: true }, ...searchQuery }
            : searchQuery;

        const [data, total] = await Promise.all([
            q.exec(),
            this.model.countDocuments(countQuery),
        ]);

        return {
            total,
            $limit: Number(filters.$limit) || options.defaultLimit,
            $skip: Number(filters.$skip) || options.defaultSkip,
            data,
        } as P extends true ? PaginatedResponse<D> : D[];
    }

    async _create(data: Partial<D>): Promise<D>;
    async _create(data: Partial<D>[]): Promise<D[]>;
    async _create(data: Partial<D> | Partial<D>[]): Promise<D | D[]> {
        const multi = this.options.multi;

        if (multi) {
            // When multi is enabled, handle both array and single object
            if (Array.isArray(data)) {
                // @ts-expect-error - mongoose types issue
                return this.model.insertMany(data, { ordered: false });
            }
            // @ts-expect-error - mongoose types issue
            return this.model.create(data);
        }

        // When multi is disabled, only accept single object
        if (Array.isArray(data)) {
            throw new BadRequestException(
                'Bulk creation is not enabled. Set multi: true in service options to allow array input.',
            );
        }
        // @ts-expect-error - mongoose types issue
        return this.model.create(data);
    }

    async _patch(
        id: string | null,
        data: Record<any, any>,
        query: Record<string, any> = {},
    ): Promise<D | D[] | null> {
        // Apply soft delete filter if enabled
        if (this.options.softDelete) {
            query[options.deleteKey || 'deleted'] = {
                $ne: true,
            };
        }

        const filters = assignFilters({}, query, FILTERS, {});
        const searchQuery: FilterQuery<D> = id
            ? { _id: id, ...rawQuery(query) }
            : rawQuery(query);

        const isSingleUpdate = Boolean(id);
        // @ts-expect-error - internal method call
        const q = this._getOrFind(isSingleUpdate, searchQuery, data);

        if (isSingleUpdate) {
            nestify(q, filters, options, isSingleUpdate);
            // @ts-expect-error - mongoose query exec
            return q.exec();
        }
        const result = await q.exec();

        // @ts-expect-error - updateMany result type
        if (result.modifiedCount > 0) {
            // @ts-expect-error - mongoose find return type
            return this.model.find(searchQuery).exec();
        }
        return [];
    }

    async _get(
        id: string,
        query: Record<string, any> = {},
    ): Promise<D | null> {
        // Apply soft delete filter if enabled
        if (this.options.softDelete) {
            query[options.deleteKey || 'deleted'] = {
                $ne: true,
            };
        }

        const filters = assignFilters({}, query, FILTERS, {});
        const searchQuery: FilterQuery<Record<any, any>> = {
            ...rawQuery(query),
            _id: id,
        };

        const q = this.model.findOne(searchQuery);
        const isSingleOperation = true;
        nestify(q, filters, options, isSingleOperation);
        // @ts-expect-error - mongoose findOne return type
        return (await q.exec()) || null;
    }

    private _getOrFind(
        isSingleUpdate: boolean,
        searchQuery: FilterQuery<D>,
        data: UpdateQuery<M>,
    ) {
        if (isSingleUpdate) {
            return this.model.findOneAndUpdate(searchQuery, data, { new: true });
        }
        return this.model.updateMany(searchQuery, data);
    }

    async _remove(
        id: string | null,
        query: Record<string, any> = {},
        user: Users,
    ): Promise<D | D[] | null> {
        const searchQuery: FilterQuery<Record<any, any>> = id
            ? { _id: id, ...rawQuery(query) }
            : rawQuery(query);

        const data = await this._get(id, query);

        if (this.options.softDelete) {
            // Soft delete: mark as deleted
            await this._patch(
                id,
                {
                    deleted: true,
                    deletedBy: user._id,
                    deletedAt: new Date(),
                },
                searchQuery,
            );
            return data;
        }

        // Hard delete: actually remove from database
        if (id) {
            await this.model.deleteOne(searchQuery).exec()
        } else {
            await this.model.deleteMany(searchQuery).exec();
        }
        return data;
    }

    async getCount(filter: RootFilterQuery<D>) {
        return this.model.countDocuments(filter);
    }
}