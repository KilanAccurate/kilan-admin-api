// cuti.schema.ts
import { Schema, model, Document } from 'mongoose';
import { ApprovalData } from 'src/absen/dto/absensi.dto';
import { User } from 'src/auth/model/user.model';

const ApprovalDataSchema = new Schema({
    uid: { type: String, required: true },
    approvedDate: { type: Date, required: true },
    userId: { type: String, required: true },
    approvalStatus: { type: String, enum: ['approved', 'rejected'], required: true },
    role: { type: String, enum: ['pjo', 'manager', 'hrd'], required: true },
});

const CutiSchema = new Schema({
    id: { type: String, required: true },
    accountId: { type: String, required: true },
    tanggalMasuk: { type: Date, required: true },
    mulaiCuti: { type: Date, required: true },
    kembaliBekerja: { type: Date, required: true },
    poh: { type: String, enum: ['lokal', 'nonLokal'], required: true },
    rosterCuti: { type: String, required: true },
    tujuanCuti: { type: String, required: true },
    pekerjaanDiserahkanPada: [{ type: Object, required: true }],
    transport: { type: String, required: true },
    sisaHariCuti: { type: Number, required: true },
    keterangan: { type: String },
    pjoApproval: { type: ApprovalDataSchema },
    managerApproval: { type: ApprovalDataSchema },
    hrdApproval: { type: ApprovalDataSchema },
}, {
    timestamps: true,
});

export interface Cuti {
    id: string;
    accountId: string;
    tanggalMasuk: Date;
    mulaiCuti: Date;
    kembaliBekerja: Date;
    poh: 'lokal' | 'nonLokal';
    rosterCuti: string;
    tujuanCuti: string;
    pekerjaanDiserahkanPada: User[]; // List of user objects
    transport: string;
    sisaHariCuti: number;
    keterangan?: string;
    pjoApproval?: ApprovalData;
    managerApproval?: ApprovalData;
    hrdApproval?: ApprovalData;
}

export type CutiDocument = Cuti & Document;
export const CutiModel = model<CutiDocument>('Cuti', CutiSchema);
