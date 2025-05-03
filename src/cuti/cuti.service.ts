// cuti.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { formatResponse } from 'src/helper/response.helper';
import { CutiDocument } from './schema/cuti.schema';
import { CreateCutiDto } from './dto/create-cuti.dto';

@Injectable()
export class CutiService {
    constructor(
        @InjectModel('Cuti') private cutiModel: Model<CutiDocument>,
    ) { }

    async applyCuti(accountId: string, createCutiDto: CreateCutiDto): Promise<any> {
        try {
            const newCuti = new this.cutiModel({
                id: uuidv4(),
                accountId,
                ...createCutiDto,
            });
            const saved = await newCuti.save();
            return formatResponse('success', 201, 'Cuti applied successfully', saved);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to apply cuti', error.message);
        }
    }

    async getUserCutiList(
        accountId: string,
        status: 'pending' | 'approved' | 'rejected' = 'pending',
        page = 1,
        limit = 25
    ): Promise<any> {
        try {
            const query: any = { accountId };

            switch (status) {
                case 'approved':
                    query['pjoApproval'] = { $exists: true };
                    query['pjoApproval.approvalStatus'] = 'approved';
                    break;
                case 'rejected':
                    query['pjoApproval'] = { $exists: true };
                    query['pjoApproval.approvalStatus'] = 'rejected';
                    break;
                case 'pending':
                default:
                    query['pjoApproval'] = { $exists: false };
            }

            const skip = (page - 1) * limit;
            const [totalCount, items] = await Promise.all([
                this.cutiModel.countDocuments(query),
                this.cutiModel.find(query).skip(skip).limit(limit).lean(),
            ]);

            const isMax = skip + items.length >= totalCount;

            return formatResponse('success', 200, `Cuti list retrieved (${status})`, {
                items,
                page,
                limit,
                totalCount,
                isMax,
            });
        } catch (error) {
            return formatResponse('error', 500, 'Failed to retrieve cuti list', error.message);
        }
    }


    async approveCuti(cutiId: string, approvalData: any): Promise<any> {
        try {
            const cuti = await this.cutiModel.findOne({ id: cutiId });
            if (!cuti) return formatResponse('error', 404, 'Cuti not found');

            const field = (() => {
                switch (approvalData.role) {
                    case 'pjo': return 'pjoApproval';
                    case 'manager': return 'managerApproval';
                    case 'hrd': return 'hrdApproval';
                    default: return null;
                }
            })();
            if (!field) return formatResponse('error', 400, 'Invalid role');

            cuti[field] = approvalData;
            const updated = await cuti.save();
            return formatResponse('success', 200, 'Cuti approval updated', updated);
        } catch (error) {
            return formatResponse('error', 500, 'Failed to approve cuti', error.message);
        }
    }
}